package itch.tecnm.proyecto.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import itch.tecnm.proyecto.entity.Cliente;

public interface ClienteRepository extends JpaRepository<Cliente, Integer> {
	List<Cliente> findByNombreClienteContainingIgnoreCase(String nombre);
	
	// En itch.tecnm.proyecto.repository.ClienteRepository
	Optional<Cliente> findByCorreoCliente(String correoCliente);

}
