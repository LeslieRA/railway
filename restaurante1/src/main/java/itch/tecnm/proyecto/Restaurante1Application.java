package itch.tecnm.proyecto;

import java.util.Arrays;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import itch.tecnm.proyecto.config.filter.JwtAuthenticationFilter;

import static org.springframework.security.config.Customizer.withDefaults;

@SpringBootApplication
@Configuration
@EnableWebSecurity
public class Restaurante1Application {
    
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http, JwtAuthenticationFilter jwtAuthFilter) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .cors(withDefaults()) // Activa la configuración CORS definida abajo
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                
                // --- 1. PÚBLICO ---
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/cliente").permitAll()

                // Listar clientes sin token
                .requestMatchers(HttpMethod.GET, "/api/cliente").permitAll() 
                .requestMatchers(HttpMethod.GET, "/api/cliente/**").permitAll()

                // --- 2. PROTEGIDO ---
                .requestMatchers(HttpMethod.PUT, "/api/cliente/**").hasAnyRole("ADMINISTRADOR", "SUPERVISOR", "CAJERO")
                .requestMatchers(HttpMethod.DELETE, "/api/cliente/**").hasAnyRole("ADMINISTRADOR", "CAJERO")

                .anyRequest().authenticated()
            )
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        
        // ⚠️ IMPORTANTE: Aquí debes poner la URL donde se despliegue tu FRONTEND (Alumno-front)
        // Por ejemplo, si subes tu React a Vercel o Netlify, pon esa URL.
        configuration.setAllowedOrigins(Arrays.asList(
            "https://railway-production-b41c.up.railway.app/",      // <-- REEMPLAZA ESTO con tu URL real del frontend
            "https://restaurante-production-86f0.up.railway.app/" // Opcional: Permitir al mismo backend (Swagger/Self)
        ));
        
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type", "X-Requested-With", "Accept"));
        configuration.setAllowCredentials(true); // Recomendado para evitar problemas con algunos navegadores/tokens
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource(); 
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    public static void main(String[] args) {
        SpringApplication.run(Restaurante1Application.class, args);
    }
}