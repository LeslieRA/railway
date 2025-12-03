# --- Etapa 1: Build (Construcción) ---
# Usamos una imagen con Maven y JDK 17 para compilar el proyecto
FROM maven:3.9.6-eclipse-temurin-17 AS build

# Directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiamos todo el código fuente del proyecto EurekaServer al contenedor
COPY . .

# Ejecutamos Maven para limpiar y empaquetar, saltando los tests para agilizar
RUN mvn clean package -DskipTests

# --- Etapa 2: Runtime (Ejecución) ---
# Usamos una imagen ligera de Java 17 Alpine para correr la app
FROM eclipse-temurin:17-jdk-alpine

# Directorio de trabajo
WORKDIR /app

# Copiamos SOLO el archivo .jar generado en la etapa anterior (build)
# Usamos el comodín *.jar para que no importe si cambia la versión en el pom.xml
COPY --from=build /app/target/*.jar app.jar

# Exponemos el puerto 8761 (El estándar de Eureka y el que tienes en properties)
EXPOSE 8761

# Comando de inicio
ENTRYPOINT ["java", "-jar", "app.jar"]
