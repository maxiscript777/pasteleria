# Pasteleria 1000 sabores

1. Haz doble clic en `iniciar.bat` (la primera vez instala todo y tarda unos minutos).
2. Se abre la tienda en http://localhost:5173
## Usuarios de prueba

- Administrador: admin@duoc.cl / admin123 (entra al panel en /admin)
- Cliente: cliente@gmail.com / cliente1

## Como levantarlo en EC2 (aws academy)

1. Conectarse por SSH con el comando de la pestaña Cliente SSH.
2. Instalar Node con nvm (sudo apt update y luego los comandos de nvm de la clase 2).
3. Descargar el proyecto: `git clone` con el enlace del repositorio, y entrar a la carpeta.
4. `npm install`
5. `npm run dev -- --host 0.0.0.0`
6. Tener el puerto 5173 abierto en el Security Group y entrar a http://IP_PUBLICA:5173
