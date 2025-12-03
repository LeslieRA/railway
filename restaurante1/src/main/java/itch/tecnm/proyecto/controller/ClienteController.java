package itch.tecnm.proyecto.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import itch.tecnm.proyecto.dto.ClienteDto;
import itch.tecnm.proyecto.service.ClienteService;
import lombok.AllArgsConstructor;

//
@CrossOrigin("*")
@AllArgsConstructor
@RestController
@RequestMapping ("/api/cliente")
public class ClienteController {
	//Inyección de dependencia
		private ClienteService clienteService;

		//CONSTRUIR EL REST API  PARA AGREGAR UN CLIENTE
		@PostMapping
		public ResponseEntity<ClienteDto> crearCliente (@RequestBody ClienteDto clienteDto ){
			ClienteDto guardarCliente = clienteService.createCliente(clienteDto);
			//Respose entity permite utilicar información a traves de http
			return new ResponseEntity<>(guardarCliente, HttpStatus.CREATED);
		}

		//Construir el get del cliente REST API
			@GetMapping("{id}")
			public ResponseEntity<ClienteDto> getClienteById(@PathVariable("id") Integer clienteId){
				
				ClienteDto clienteDto = clienteService.getClienteById(clienteId);
				return ResponseEntity.ok(clienteDto);
			}

		
		
		// Construir REST API Update Cliente.
			// Exponer un endpoint HTTP PUT para actualizar un cliente
			@PutMapping("{id}")
			public ResponseEntity<ClienteDto> updateCliente(@PathVariable("id") Integer id,
					@RequestBody ClienteDto updateCliente) {
				ClienteDto clienteDto = clienteService.updateCliente(id, updateCliente);
				return ResponseEntity.ok(clienteDto);
			}
		
		//Construir delete cliente REST API
			@DeleteMapping("{id}")
			public ResponseEntity<String> deleteCliente(@PathVariable("id") Integer clienteId){
				clienteService.deleteCliente(clienteId);
				return ResponseEntity.ok("Registro eliminado");
			}
			
			@GetMapping 
			public ResponseEntity<List<ClienteDto>> getAllClientes(
					@RequestParam(required = false) String nombre
			){
				List<ClienteDto> clientes = clienteService.getAllClientes(nombre);
				return ResponseEntity.ok(clientes);
			}
			
			// En ClienteController
			@GetMapping("/buscar-por-correo")
			public ResponseEntity<ClienteDto> getClienteByCorreo(@RequestParam("correo") String correo) {
			    return ResponseEntity.ok(clienteService.getClienteByCorreo(correo));
			}
}
