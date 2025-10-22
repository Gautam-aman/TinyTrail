package com.cfs.tinytrail.service;

import com.cfs.tinytrail.Repo.ClickEventRepo;
import com.cfs.tinytrail.Repo.UrlMappingRepository;
import com.cfs.tinytrail.dto.UrlMappingDto;
import com.cfs.tinytrail.dto.clickEventDto;
import com.cfs.tinytrail.entity.ClickEvent;
import com.cfs.tinytrail.entity.UrlMapping;
import com.cfs.tinytrail.entity.User;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PathVariable;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.security.Principal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class UrlMappingService {

    @Autowired
    private UrlMappingRepository urlMappingRepository;

    @Autowired
    private ClickEventRepo clickEventRepo;

    @Transactional
    public UrlMappingDto createShortUr(String originalUrl, User user) {
        if (originalUrl == null || originalUrl.isBlank()) {
            throw new IllegalArgumentException("Original URL cannot be null or empty");
        }


        if (user != null) {
            logger.info("Creating short URL for user: {}", user.getUsername());
        } else {
            logger.warn("Creating short URL for anonymous user");
        }


        String shortUrl;
        int attempts = 0;
        do {
            if (attempts >= 10) {
                throw new IllegalStateException("Unable to generate unique short URL after 10 attempts");
            }
            shortUrl = generateShortUrl(originalUrl);
            attempts++;
        } while (urlMappingRepository.findByShortUrl(shortUrl).isPresent());

        logger.info("Generated short URL: {}", shortUrl);


        UrlMapping urlMapping = new UrlMapping();
        urlMapping.setOriginalUrl(originalUrl);
        urlMapping.setShortUrl(shortUrl);
        urlMapping.setUser(user);
        urlMapping.setCreatedDate(LocalDateTime.now());
        urlMapping.setClickCount(0);


        urlMappingRepository.saveAndFlush(urlMapping);
        logger.info("Saved UrlMapping with ID: {}", urlMapping.getId());


        return changeToDto(urlMapping);
    }


    private UrlMappingDto changeToDto(UrlMapping urlMapping) {
        UrlMappingDto urlMappingDto = new UrlMappingDto();
        urlMappingDto.setId(urlMapping.getId());
        urlMappingDto.setOriginalUrl(urlMapping.getOriginalUrl());
        urlMappingDto.setShortUrl(urlMapping.getShortUrl());
        urlMappingDto.setClickCount(urlMapping.getClickCount());
        urlMappingDto.setCreatedDate(urlMapping.getCreatedDate());
        if (urlMapping.getUser() != null) {
            urlMappingDto.setUsername(urlMapping.getUser().getUsername());
        } else {

            urlMappingDto.setUsername(null);
        }
        urlMappingDto.setCreatedDate(urlMapping.getCreatedDate());
        return urlMappingDto;
    }

    private String generateShortUrl(String originalUrl) {
        String characters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
        Random random = new Random();
        StringBuilder shortUrl = new StringBuilder(8);
        for(int i = 0; i < 8; i++) {
            shortUrl.append(characters.charAt(random.nextInt(characters.length())));
        }
        return shortUrl.toString();
    }

    public List<UrlMappingDto> getUrlsByUsername(User user) {

        return urlMappingRepository.findByUser(user).stream().map(this::changeToDto).collect(Collectors.toList());

    }

    public List<clickEventDto> getClickEventsByDate(String shortUrl, LocalDateTime startDate, LocalDateTime endDate) {
        Optional<UrlMapping> optionalMapping = urlMappingRepository.findByShortUrl(shortUrl);
        if (optionalMapping.isEmpty()) return Collections.emptyList();

        UrlMapping urlMapping = optionalMapping.get();

        return clickEventRepo.findByUrlMappingAndClickDateBetween(urlMapping, startDate, endDate)
                .stream()
                .collect(Collectors.groupingBy(click -> click.getClickDate().toLocalDate(), TreeMap::new, Collectors.counting()))
                .entrySet()
                .stream()
                .map(entry -> {
                    clickEventDto dto = new clickEventDto();
                    dto.setClickDate(entry.getKey().atStartOfDay());
                    dto.setCount(entry.getValue());
                    return dto;
                })
                .collect(Collectors.toList());
    }


    public Map<LocalDate, Long> getTotalClicks(User user, LocalDate startDate, LocalDate endDate) {
        List<UrlMapping> urlMappings = urlMappingRepository.findByUser(user);
        List< ClickEvent> clickEvents = clickEventRepo.findByUrlMappingInAndClickDateBetween(urlMappings , startDate.atStartOfDay() ,endDate.plusDays(1).atStartOfDay());
        return clickEvents.stream().collect(Collectors.groupingBy(click -> click.getClickDate().toLocalDate()
                ,Collectors.counting()));

     }


  //  private static final Logger logger = LoggerFactory.getLogger(UrlMappingService.class);

    private static final Logger logger = LoggerFactory.getLogger(UrlMappingService.class);

    @Transactional
    public UrlMapping getOriginalUrl(String shortUrl) {

        Optional<UrlMapping> optionalMapping = urlMappingRepository.findByShortUrl(shortUrl);


        if (optionalMapping.isEmpty()) {
            logger.warn("Redirect failed: No URL mapping found for '{}'", shortUrl);
            return null;
        }


        UrlMapping urlMapping = optionalMapping.get();


        urlMapping.setClickCount(urlMapping.getClickCount() + 1);

        urlMappingRepository.saveAndFlush(urlMapping);

        ClickEvent clickEvent = new ClickEvent();
        clickEvent.setUrlMapping(urlMapping);
        clickEvent.setClickDate(LocalDateTime.now());
        clickEventRepo.saveAndFlush(clickEvent);


        return urlMapping;
    }
}
