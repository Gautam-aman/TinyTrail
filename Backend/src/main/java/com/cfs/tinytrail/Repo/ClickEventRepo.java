package com.cfs.tinytrail.Repo;

import com.cfs.tinytrail.entity.ClickEvent;
import com.cfs.tinytrail.entity.UrlMapping;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ClickEventRepo extends JpaRepository<ClickEvent, Long> {
    List<ClickEvent> findByUrlMappingAndClickDateBetween(UrlMapping urlMapping, LocalDateTime clickDateAfter, LocalDateTime clickDateBefore);
    List<ClickEvent> findByUrlMappingInAndClickDateBetween(List<UrlMapping> urlMappings, LocalDateTime clickDateAfter, LocalDateTime clickDateBefore);
}
