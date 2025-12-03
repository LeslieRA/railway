package itch.tecnm.proyecto.service.impl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import itch.tecnm.proyecto.dto.ClienteDto;
import itch.tecnm.proyecto.entity.Cliente;
import itch.tecnm.proyecto.mapper.ClienteMapper;
import itch.tecnm.proyecto.repository.ClienteRepository;
import itch.tecnm.proyecto.service.ClienteService;
import lombok.AllArgsConstructor;

@Service
//Utilizando lombok para que ocupe todos los argumentos como constructor
@AllArgsConstructor
public class ClienteServiceImpl implements ClienteService{
private ClienteRepository clienteRepository;
	
	@Override
	public ClienteDto createCliente(ClienteDto clienteDto) {
Cliente cliente = ClienteMapper.mapToCliente(clienteDto);
        
        // --- LÓGICA PARA {noop} ---
        if (clienteDto.getPassword() != null && !clienteDto.getPassword().isEmpty()) {
            // Le pegamos el prefijo aquí para que el frontend no tenga que saber de seguridad
            cliente.setPassword("{noop}" + clienteDto.getPassword());
        } else {
            // Contraseña por defecto si no escriben nada
            cliente.setPassword("{noop}123");
        }
        
        Cliente savedCliente = clienteRepository.save(cliente);
        return ClienteMapper.mapToClienteDto(savedCliente);
	}
	
	@Override
	public ClienteDto getClienteById(Integer clienteId) {
		Cliente cliente = clienteRepository.findById(clienteId).orElse(null);
		return ClienteMapper.mapToClienteDto(cliente);
	}

	@Override
	public List<ClienteDto> getAllClientes() {
		
		List<Cliente> clientes = clienteRepository.findAll();
		
		return clientes.stream().map((cliente) -> ClienteMapper.mapToClienteDto(cliente))
				.collect(Collectors.toList());
	}

	@Override
	public ClienteDto updateCliente(Integer clienteId, ClienteDto updateCliente) {
		// Buscar el registro a modificar
		Cliente cliente = clienteRepository.findById(clienteId).orElse(null);
		//Modificar los atributos
		cliente.setNombreCliente(updateCliente.getNombreCliente());
		cliente.setTelefonoCliente(updateCliente.getTelefonoCliente());
		cliente.setCorreoCliente(updateCliente.getCorreoCliente());
		
		//Guardar cambios
		Cliente updateClienteObj = clienteRepository.save(cliente);
		
		return ClienteMapper.mapToClienteDto(updateClienteObj);
	}

	@Override
	public void deleteCliente(Integer clienteId) {
		//Buscar registro que se desea eliminar
		Cliente cliente = clienteRepository.findById(clienteId).orElse(null);
		clienteRepository.deleteById(clienteId);
	}

	@Override
	public List<ClienteDto> getAllClientes(String nombre) {
		List<Cliente> clientes;
        
        // Si el usuario envió un nombre para filtrar
        if (nombre != null && !nombre.trim().isEmpty()) {
            clientes = clienteRepository.findByNombreClienteContainingIgnoreCase(nombre);
        } else {
            // Si el nombre es nulo o vacío, trae todos los clientes
            clientes = clienteRepository.findAll();
        }
        
        return clientes.stream()
                .map(ClienteMapper::mapToClienteDto)
                .collect(Collectors.toList());
    }
	
	// En ClienteServiceImpl
	@Override
	public ClienteDto getClienteByCorreo(String correo) {
	    Cliente cliente = clienteRepository.findByCorreoCliente(correo)
	            .orElseThrow(() -> new RuntimeException("Cliente no encontrado"));
	    return ClienteMapper.mapToClienteDto(cliente); // Asegúrate que el Mapper incluya el password
	}
	
}
