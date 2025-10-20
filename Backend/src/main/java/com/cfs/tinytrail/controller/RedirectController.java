package com.cfs.tinytrail.controller;

import com.cfs.tinytrail.entity.UrlMapping;
import com.cfs.tinytrail.service.UrlMappingService;
import jakarta.servlet.http.HttpServletResponse;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;

@RestController
@AllArgsConstructor
public class RedirectController {

    private final UrlMappingService urlMappingService;

    @GetMapping("/{shortUrl:[a-zA-Z0-9]+}")
    public void redirect(@PathVariable String shortUrl, HttpServletResponse response) throws IOException {
        // This line calls the fixed service method
        UrlMapping urlMapping = urlMappingService.getOriginalUrl(shortUrl);

        if (urlMapping == null) {
            response.sendError(HttpServletResponse.SC_NOT_FOUND, "Short URL not found");
            return;
        }

        response.sendRedirect(urlMapping.getOriginalUrl());
    }
}