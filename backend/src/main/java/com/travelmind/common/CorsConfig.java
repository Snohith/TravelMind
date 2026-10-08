package com.travelmind.common;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * The Next.js dev server (localhost:3000) calls this API directly.
 * Tight in prod via FRONTEND_URL; permissive locally so devs don't fight CORS.
 */
@Configuration
public class CorsConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        String frontend = System.getenv().getOrDefault("FRONTEND_URL", "http://localhost:3000");
        registry.addMapping("/api/**")
                .allowedOrigins(frontend)
                .allowedMethods("GET", "POST", "DELETE")
                .allowedHeaders("*");
    }
}
