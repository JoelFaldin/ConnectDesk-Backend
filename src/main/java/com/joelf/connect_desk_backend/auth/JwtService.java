package com.joelf.connect_desk_backend.auth;

import java.util.Base64;
import java.util.Date;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import com.joelf.connect_desk_backend.user.entities.User;

import io.jsonwebtoken.JwtParser;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

@Service
public class JwtService {

  @Value("${jwt.secret}")
  public String jwtSecret;

  public String generateToken(User user) {
    SecretKey key = Keys.hmacShaKeyFor(Base64.getDecoder().decode(jwtSecret));

    System.out.println("SIGN KEY: " + Base64.getEncoder().encodeToString(key.getEncoded()));

    return Jwts.builder()
        .subject(user.getEmail())
        .issuedAt(new Date(System.currentTimeMillis()))
        .expiration(new Date(System.currentTimeMillis() + 86400000))
        .signWith(key)
        .compact();
  }

  public String extractUserName(String token) {
    SecretKey key = Keys.hmacShaKeyFor(Base64.getDecoder().decode(jwtSecret));
    JwtParser parser = Jwts.parser().verifyWith(key).build();

    System.out.println("SIGN KEY: " + Base64.getEncoder().encodeToString(key.getEncoded()));

    return parser.parseSignedClaims(token).getPayload().getSubject();
  }

  public boolean isTokenValid(String token, UserDetails userDetails) {
    final String username = extractUserName(token);

    return (username.equals(userDetails.getUsername())) && !isExpired(token);
  }

  public boolean isExpired(String token) {
    SecretKey key = Keys.hmacShaKeyFor(Base64.getDecoder().decode(jwtSecret));
    JwtParser parser = Jwts.parser().verifyWith(key).build();
    Date expiration = parser.parseSignedClaims(token).getPayload().getExpiration();

    return expiration.before(new Date());
  }
}
