package com.cfs.tinytrail.dto;

import lombok.Data;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDateTime;

@Data
public class clickEventDto {

    private Long Count;
    private LocalDateTime clickDate;

}
