package com.cfs.tinytrail.Repo;

import com.cfs.tinytrail.entity.UrlMapping;
import com.cfs.tinytrail.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UrlMappingRepository extends JpaRepository<UrlMapping, Long> {
    Optional<UrlMapping> findByShortUrl(String url);
    List<UrlMapping> findByUser(User user);
}
