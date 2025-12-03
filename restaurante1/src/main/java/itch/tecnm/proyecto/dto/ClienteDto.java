package itch.tecnm.proyecto.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

//Lombok para generar getters, setters y constructores
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ClienteDto {
	private int id_cliente;
    private String nombreCliente;
    private String telefonoCliente;
    private String correoCliente;
	private String password;

}
