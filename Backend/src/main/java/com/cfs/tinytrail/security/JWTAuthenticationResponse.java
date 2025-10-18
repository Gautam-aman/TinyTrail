package com.cfs.tinytrail.security;


import lombok.AllArgsConstructor;
import lombok.Data;

@AllArgsConstructor
@Data
public class JWTAuthenticationResponse {

    private String token;
}
