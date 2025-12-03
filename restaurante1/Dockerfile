# Dockerfile (runtime-only)
FROM eclipse-temurin:17-jre-jammy
WORKDIR /app
COPY target/*.jar app.jar
EXPOSE 7072
ENV JAVA_TOOL_OPTIONS="-Dserver.port=${PORT:-7072}"
ENTRYPOINT ["sh", "-c", "java $JAVA_TOOL_OPTIONS -jar /app/app.jar"]
