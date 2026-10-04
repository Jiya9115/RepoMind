package com.repomind.analysis;

import com.github.javaparser.JavaParser;
import com.github.javaparser.ParseResult;
import com.github.javaparser.ast.CompilationUnit;
import com.github.javaparser.ast.body.ClassOrInterfaceDeclaration;
import com.github.javaparser.ast.body.MethodDeclaration;
import com.github.javaparser.ast.body.FieldDeclaration;
import com.github.javaparser.ast.ImportDeclaration;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class JavaCodeParser {

    private final JavaParser javaParser = new JavaParser();

    public record ParsedSymbol(String name, String type, int startLine, int endLine) {}

    public record JavaParseResult(List<ParsedSymbol> symbols, List<String> imports) {}

    public JavaParseResult parseJava(String content) {
        List<ParsedSymbol> symbols = new ArrayList<>();
        List<String> imports = new ArrayList<>();

        try {
            ParseResult<CompilationUnit> result = javaParser.parse(content);
            if (result.isSuccessful() && result.getResult().isPresent()) {
                CompilationUnit cu = result.getResult().get();

                // Imports
                for (ImportDeclaration imp : cu.getImports()) {
                    imports.add(imp.getNameAsString());
                }

                // Classes and Interfaces
                cu.findAll(ClassOrInterfaceDeclaration.class).forEach(decl -> {
                    int start = decl.getRange().map(r -> r.begin.line).orElse(1);
                    int end = decl.getRange().map(r -> r.end.line).orElse(start);
                    String type = decl.isInterface() ? "INTERFACE" : "CLASS";
                    symbols.add(new ParsedSymbol(decl.getNameAsString(), type, start, end));
                });

                // Methods
                cu.findAll(MethodDeclaration.class).forEach(method -> {
                    int start = method.getRange().map(r -> r.begin.line).orElse(1);
                    int end = method.getRange().map(r -> r.end.line).orElse(start);
                    symbols.add(new ParsedSymbol(method.getNameAsString(), "METHOD", start, end));
                });

                // Fields
                cu.findAll(FieldDeclaration.class).forEach(field -> {
                    int start = field.getRange().map(r -> r.begin.line).orElse(1);
                    int end = field.getRange().map(r -> r.end.line).orElse(start);
                    field.getVariables().forEach(v ->
                        symbols.add(new ParsedSymbol(v.getNameAsString(), "FIELD", start, end))
                    );
                });
            }
        } catch (Exception e) {
            // Safe fallback if parsing error
            return fallbackParse(content);
        }

        if (symbols.isEmpty()) {
            return fallbackParse(content);
        }

        return new JavaParseResult(symbols, imports);
    }

    private JavaParseResult fallbackParse(String content) {
        List<ParsedSymbol> symbols = new ArrayList<>();
        List<String> imports = new ArrayList<>();
        String[] lines = content.split("\r?\n");

        for (int i = 0; i < lines.length; i++) {
            String line = lines[i].trim();
            if (line.startsWith("import ")) {
                imports.add(line.replace("import ", "").replace(";", "").trim());
            } else if (line.contains("class ") || line.contains("interface ")) {
                String[] parts = line.split("\\s+");
                for (int j = 0; j < parts.length - 1; j++) {
                    if ("class".equals(parts[j])) {
                        symbols.add(new ParsedSymbol(parts[j + 1].split("[<{]")[0], "CLASS", i + 1, i + 10));
                    } else if ("interface".equals(parts[j])) {
                        symbols.add(new ParsedSymbol(parts[j + 1].split("[<{]")[0], "INTERFACE", i + 1, i + 10));
                    }
                }
            }
        }
        return new JavaParseResult(symbols, imports);
    }
}
