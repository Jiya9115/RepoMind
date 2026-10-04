package com.repomind.config;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

import javax.sql.DataSource;
import java.net.URI;

@Configuration
public class DataSourceConfig {

    private static final Logger log = LoggerFactory.getLogger(DataSourceConfig.class);

    @Value("${DATABASE_URL:}")
    private String databaseUrl;

    @Value("${DATABASE_USERNAME:repomind}")
    private String defaultUsername;

    @Value("${DATABASE_PASSWORD:repomind}")
    private String defaultPassword;

    @Bean
    @Primary
    public DataSource dataSource() {
        HikariConfig config = new HikariConfig();
        config.setDriverClassName("org.postgresql.Driver");
        config.setMaximumPoolSize(10);
        config.setMinimumIdle(2);
        config.setConnectionTimeout(10000);
        config.setInitializationFailTimeout(-1);

        String rawUrl = databaseUrl != null && !databaseUrl.isBlank()
                ? databaseUrl.trim()
                : "jdbc:postgresql://localhost:5432/repomind";

        try {
            // Render / Railway / Heroku standard format: postgres://user:pass@host:port/db
            if (rawUrl.startsWith("postgres://") || rawUrl.startsWith("postgresql://")) {
                log.info("Detected Render/Railway standard postgres URI format. Converting to JDBC...");
                URI uri = new URI(rawUrl);
                String userInfo = uri.getUserInfo();
                String username = defaultUsername;
                String password = defaultPassword;

                if (userInfo != null && userInfo.contains(":")) {
                    String[] parts = userInfo.split(":", 2);
                    username = parts[0];
                    password = parts[1];
                } else if (userInfo != null) {
                    username = userInfo;
                }

                int port = uri.getPort() != -1 ? uri.getPort() : 5432;
                String path = uri.getPath();
                String dbName = (path != null && path.length() > 1) ? path.substring(1) : "repomind";
                String host = uri.getHost();

                String jdbcUrl = String.format("jdbc:postgresql://%s:%d/%s", host, port, dbName);
                config.setJdbcUrl(jdbcUrl);
                config.setUsername(username);
                config.setPassword(password);
                log.info("Configured JDBC connection to host: {}, database: {}", host, dbName);
            } else {
                // Already standard JDBC format (jdbc:postgresql://...)
                config.setJdbcUrl(rawUrl);
                config.setUsername(defaultUsername);
                config.setPassword(defaultPassword);
            }
        } catch (Exception e) {
            log.warn("Failed to parse DATABASE_URL ({}), falling back to direct configuration: {}", rawUrl, e.getMessage());
            config.setJdbcUrl(rawUrl);
            config.setUsername(defaultUsername);
            config.setPassword(defaultPassword);
        }

        return new HikariDataSource(config);
    }
}
