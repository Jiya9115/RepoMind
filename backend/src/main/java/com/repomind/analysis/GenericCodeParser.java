package com.repomind.analysis;

import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Component
public class GenericCodeParser {

    public record ParsedSymbol(String name, String type, int startLine, int endLine) {}

    public record GenericParseResult(List<ParsedSymbol> symbols, List<String> imports) {}

    public GenericParseResult parse(String content, String language) {
        List<ParsedSymbol> symbols = new ArrayList<>();
        List<String> imports = new ArrayList<>();
        String[] lines = content.split("\r?\n");

        if (language == null) language = "PLAINTEXT";
        String langUpper = language.toUpperCase();

        Pattern jsFuncPattern = Pattern.compile("(?:export\\s+)?(?:const|let)\\s+([A-Za-z0-9_]+)\\s*=\\s*(?:async\\s*)?\\([^)]*\\)\\s*(?::\\s*[^=]+)?\\s*=>");
        Pattern jsReactCompPattern = Pattern.compile("export\\s+const\\s+([A-Z][A-Za-z0-9_]*)\\s*:\\s*React\\.FC");
        Pattern jsClassPattern = Pattern.compile("(?:export\\s+)?class\\s+([A-Za-z0-9_]+)");
        Pattern jsInterfacePattern = Pattern.compile("(?:export\\s+)?(?:interface|type)\\s+([A-Za-z0-9_]+)");
        Pattern jsImportPattern = Pattern.compile("import\\s+.*?from\\s+['\"]([^'\"]+)['\"]");

        Pattern pyFuncPattern = Pattern.compile("^\\s*(?:async\\s+)?def\\s+([A-Za-z0-9_]+)");
        Pattern pyClassPattern = Pattern.compile("^\\s*class\\s+([A-Za-z0-9_]+)");
        Pattern pyImportPattern = Pattern.compile("^\\s*(?:from\\s+([A-Za-z0-9_.]+)\\s+import|import\\s+([A-Za-z0-9_.]+))");

        Pattern sqlTablePattern = Pattern.compile("CREATE\\s+TABLE\\s+(?:IF\\s+NOT\\s+EXISTS\\s+)?([A-Za-z0-9_]+)", Pattern.CASE_INSENSITIVE);
        Pattern cFuncPattern = Pattern.compile("^[A-Za-z0-9_\\*\\s]+\\s+([A-Za-z0-9_]+)\\s*\\([^)]*\\)\\s*\\{");

        for (int i = 0; i < lines.length; i++) {
            String line = lines[i];
            int lineNum = i + 1;

            if (langUpper.contains("TYPESCRIPT") || langUpper.contains("JAVASCRIPT")) {
                Matcher mComp = jsReactCompPattern.matcher(line);
                if (mComp.find()) {
                    symbols.add(new ParsedSymbol(mComp.group(1), "COMPONENT", lineNum, lineNum + 20));
                    continue;
                }
                Matcher mClass = jsClassPattern.matcher(line);
                if (mClass.find()) {
                    symbols.add(new ParsedSymbol(mClass.group(1), "CLASS", lineNum, lineNum + 25));
                    continue;
                }
                Matcher mInterface = jsInterfacePattern.matcher(line);
                if (mInterface.find()) {
                    symbols.add(new ParsedSymbol(mInterface.group(1), "INTERFACE", lineNum, lineNum + 10));
                    continue;
                }
                Matcher mFunc = jsFuncPattern.matcher(line);
                if (mFunc.find()) {
                    symbols.add(new ParsedSymbol(mFunc.group(1), "FUNCTION", lineNum, lineNum + 15));
                }
                Matcher mImp = jsImportPattern.matcher(line);
                if (mImp.find()) {
                    imports.add(mImp.group(1));
                }
            } else if (langUpper.contains("PYTHON")) {
                Matcher mClass = pyClassPattern.matcher(line);
                if (mClass.find()) {
                    symbols.add(new ParsedSymbol(mClass.group(1), "CLASS", lineNum, lineNum + 15));
                }
                Matcher mFunc = pyFuncPattern.matcher(line);
                if (mFunc.find()) {
                    symbols.add(new ParsedSymbol(mFunc.group(1), "FUNCTION", lineNum, lineNum + 10));
                }
                Matcher mImp = pyImportPattern.matcher(line);
                if (mImp.find()) {
                    String mod = mImp.group(1) != null ? mImp.group(1) : mImp.group(2);
                    if (mod != null) imports.add(mod);
                }
            } else if (langUpper.contains("SQL")) {
                Matcher mSql = sqlTablePattern.matcher(line);
                if (mSql.find()) {
                    symbols.add(new ParsedSymbol(mSql.group(1), "TABLE", lineNum, lineNum + 10));
                }
            } else if (langUpper.contains("C") || langUpper.contains("CPP")) {
                Matcher mC = cFuncPattern.matcher(line);
                if (mC.find()) {
                    symbols.add(new ParsedSymbol(mC.group(1), "FUNCTION", lineNum, lineNum + 15));
                }
            }
        }

        return new GenericParseResult(symbols, imports);
    }
}
