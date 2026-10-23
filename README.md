# Pasteleria 1000 sabores

Tienda online hecha con React, Vite, React Bootstrap y React Router.
Los datos (productos, usuarios, ordenes y carrito) se guardan en el navegador con localStorage y sessionStorage.

## Como usarlo en Windows

1. Haz doble clic en `iniciar.bat` (la primera vez instala todo y tarda unos minutos).
2. Se abre la tienda en http://localhost:5173
3. Para correr las pruebas haz doble clic en `probar.bat` (necesita Google Chrome o Microsoft Edge).

## Como usarlo con comandos

    npm install
    npm run dev
    npm test

Si PowerShell bloquea npm, usa el Simbolo del sistema (CMD) o `npm.cmd` en vez de `npm`.

## Usuarios de prueba

- Administrador: admin@duoc.cl / admin123 (entra al panel en /admin)
- Cliente: cliente@gmail.com / cliente1

## Como levantarlo en EC2 (AWS Academy)

1. Conectarse por SSH con el comando de la pestaña Cliente SSH.
2. Instalar Node con nvm (sudo apt update y luego los comandos de nvm de la clase 2).
3. Descargar el proyecto: `git clone` con el enlace del repositorio, y entrar a la carpeta.
4. `npm install`
5. `npm run dev -- --host 0.0.0.0`
6. Tener el puerto 5173 abierto en el Security Group y entrar a http://IP_PUBLICA:5173

## Cambios de la Forma C (Pasteleria Mil Sabores)

- Diseno: fondo crema #FFF5E1, acentos rosa #FFC0CB y chocolate #8B4513, texto #5D4037 y gris #B0BEC5, fuentes Lato y Pacifico (src/styles.css e index.html). Logo y foto del equipo en public/img.
- Catalogo: los 16 productos y las 8 categorias del enunciado. Los 8 productos nuevos usan ilustraciones en public/img (se pueden cambiar por fotos reales desde Admin > Productos > Editar).
- Filtros de busqueda por nombre, categoria, tipo de torta (cuadrada o circular) y tamano.
- Detalle del producto: tamano, origen de la receta, mensaje personalizado para tortas y botones para compartir en redes sociales (tambien en Ofertas).
- Registro con fecha de nacimiento y codigo promocional (opcionales): mayores de 50 años 50% de descuento, codigo FELICES50 10% de por vida (no se suman, se aplica el mayor) y torta gratis el dia del cumpleaños para correos @duoc.cl. Las reglas estan en src/data/db.js.
- Checkout: resumen con descuentos y fecha de entrega preferida. Cada pedido tiene estado (En preparacion, Listo para despacho, En camino, Entregado): el administrador lo cambia en Admin > Ordenes y el cliente lo ve en Mis pedidos y en su boleta.
- Perfil del cliente (/perfil) con datos personales y categoria favorita, que se usa en las recomendaciones de la portada.
- Nosotros: historia de la pasteleria, equipo e impacto comunitario.
- Si el navegador ya tenia productos guardados de la version anterior, los productos y categorias nuevos se agregan solos una vez.

## Carpetas

- src/components: piezas reutilizables (barra de navegacion, tarjeta de producto, campo de formulario, tablas)
- src/views: pantallas de la tienda y src/views/admin: panel de administracion
- src/data: datos iniciales y funciones de lectura y escritura (db.js), validaciones, regiones y blogs
- src/tests: pruebas unitarias con Jasmine y Karma
