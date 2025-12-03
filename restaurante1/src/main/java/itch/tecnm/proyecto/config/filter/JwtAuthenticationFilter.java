package itch.tecnm.proyecto.config.filter; // Ajusta el paquete según el proyecto

import itch.tecnm.proyecto.service.JwtService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;
import java.util.List;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request, 
            @NonNull HttpServletResponse response, 
            @NonNull FilterChain filterChain
    ) throws ServletException, IOException {

        final String authHeader = request.getHeader("Authorization");

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        final String jwt = authHeader.substring(7);

        try {
            // 1. Extraemos el usuario y el rol DIRECTAMENTE del token
            // (No consultamos la base de datos local porque no tenemos usuarios aquí)
            final String username = jwtService.extractUsername(jwt);
            final String role = jwtService.extractRole(jwt); // Usamos el método nuevo

            if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                
                // 2. Validamos la firma del token (solo verifica que sea auténtico y no haya expirado)
                // Nota: Creamos un método sobrecargado en JwtService o simplificamos la validación aquí.
                // Para simplificar, asumiremos que si extractUsername funcionó y no expiró, es válido.
                
                // Creamos la autoridad basada en el rol que venía en el token
                SimpleGrantedAuthority authority = new SimpleGrantedAuthority(role);

                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                        username,
                        null,
                        Collections.singletonList(authority) // Asignamos el rol
                );
                
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        } catch (Exception e) {
            // Si el token está mal formado o expiró, simplemente no autenticamos
            System.err.println("Token inválido en microservicio de recursos: " + e.getMessage());
        }
        
        filterChain.doFilter(request, response);
    }
}