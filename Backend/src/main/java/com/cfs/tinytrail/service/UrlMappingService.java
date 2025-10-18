package com.cfs.tinytrail.service;

import com.cfs.tinytrail.Repo.ClickEventRepo;
import com.cfs.tinytrail.Repo.UrlMappingRepository;
import com.cfs.tinytrail.dto.UrlMappingDto;
import com.cfs.tinytrail.dto.clickEventDto;
import com.cfs.tinytrail.entity.ClickEvent;
import com.cfs.tinytrail.entity.UrlMapping;
import com.cfs.tinytrail.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PathVariable;

import java.security.Principal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.stream.Collectors;

@Service
public class UrlMappingService {

    @Autowired
    private UrlMappingRepository urlMappingRepository;

    @Autowired
    private ClickEventRepo clickEventRepo;

    public UrlMappingDto createShortUr(String originalUrl, User user) {
        String shortUrl = generateShortUrl(originalUrl);
        UrlMapping urlMapping = new UrlMapping();
        urlMapping.setShortUrl(shortUrl);
        urlMapping.setUser(user);
        urlMapping.setOriginalUrl(originalUrl);
        urlMapping.setCreatedDate(LocalDateTime.now());
        urlMappingRepository.save(urlMapping);
        return changeToDto(urlMapping);
    }

    private UrlMappingDto changeToDto(UrlMapping urlMapping) {
        UrlMappingDto urlMappingDto = new UrlMappingDto();
        urlMappingDto.setId(urlMapping.getId());
        urlMappingDto.setOriginalUrl(urlMapping.getOriginalUrl());
        urlMappingDto.setShortUrl(urlMapping.getShortUrl());
        urlMappingDto.setCreatedDate(urlMapping.getCreatedDate());
        urlMappingDto.setUsername(urlMapping.getUser().getUsername());
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
        UrlMapping urlMapping = urlMappingRepository.findByShortUrl(shortUrl);
        if (urlMapping == null) {
            return null;
        }


        return clickEventRepo.findByUrlMappingAndClickDateBetween(urlMapping , startDate ,endDate).stream()
                .collect(Collectors.groupingBy(click -> click.getClickDate().toLocalDate(),
                        Collectors.counting()))
                .entrySet().stream().map(entry->{
                    clickEventDto clickEventDto = new clickEventDto();
                    clickEventDto.setClickDate(entry.getKey().atStartOfDay());
                    clickEventDto.setCount(entry.getValue());
                    return clickEventDto;
                }).collect(Collectors.toList());

    }


    public Map<LocalDate, Long> getTotalClicks(User user, LocalDate startDate, LocalDate endDate) {
        List<UrlMapping> urlMappings = urlMappingRepository.findByUser(user);
        List< ClickEvent> clickEvents = clickEventRepo.findByUrlMappingInAndClickDateBetween(urlMappings , startDate.atStartOfDay() ,endDate.plusDays(1).atStartOfDay());
        return clickEvents.stream().collect(Collectors.groupingBy(click -> click.getClickDate().toLocalDate()
                ,Collectors.counting()));

     }

    public UrlMapping getOriginalUrl( @PathVariable String shortUrl) {
        UrlMapping urlMapping = urlMappingRepository.findByShortUrl(shortUrl);
        if (urlMapping != null){
            urlMapping.setClickCount(urlMapping.getClickCount() + 1);
            urlMappingRepository.save(urlMapping);

            // record the clickEvent
            ClickEvent clickEvent = new ClickEvent();
            clickEvent.setUrlMapping(urlMapping);
            clickEvent.setClickDate(LocalDateTime.now());
            clickEventRepo.save(clickEvent);

        }
        return urlMapping;
    }
}
