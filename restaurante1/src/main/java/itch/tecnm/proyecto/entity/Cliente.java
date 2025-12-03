package itch.tecnm.proyecto.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

//Lombok realiza automaticamente
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor

@Entity
@Table(name="cliente")
public class Cliente {
	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id_cliente;
	
	@Column(name="nombreCliente")
    private String nombreCliente;

	@Column(name="telefonoCliente")
    private String telefonoCliente;
    
	@Column(name="correoCliente")
    private String correoCliente;
	@Column(name = "password", nullable = false)
	private String password;
}
