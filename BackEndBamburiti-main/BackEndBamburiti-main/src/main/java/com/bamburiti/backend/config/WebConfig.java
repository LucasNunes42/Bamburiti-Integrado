package com.bamburiti.backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

	@Override
	public void addResourceHandlers(ResourceHandlerRegistry registry) {
		// Diz ao Spring que qualquer URL começando com /uploads/ deve olhar na pasta
		// física uploads/
		registry.addResourceHandler("/uploads/**").addResourceLocations("file:uploads/");
	}
}