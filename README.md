# Rosita’s Candles — catálogo digital

Sitio web estático para mostrar el catálogo real de Rosita’s Candles y recibir pedidos mediante WhatsApp. Incluye 56 productos activos, sus detalles, precios en bolivianos y fotografías.

## Abrir el sitio en la computadora

El catálogo carga `data/products.json`, por lo que debe abrirse con un servidor local. Desde esta carpeta ejecuta:

```bash
python3 -m http.server 8000
```

Luego visita:

- Catálogo: <http://localhost:8000/>
- Administración local privada: <http://localhost:8000/admin.html>

Para detener el servidor presiona `Ctrl + C` en la terminal.

## Administración local

Los archivos `admin.html` y `js/admin.js` son privados, permanecen solo en la computadora de administración y están excluidos del repositorio mediante `.gitignore`.

Desde la administración puedes:

- Agregar un producto con nombre, precio, detalles, disponibilidad y fotografía.
- Editar o eliminar productos.
- Ocultar temporalmente un producto desmarcando “Producto disponible y visible”.
- Exportar el catálogo actualizado como `products.json`.

Los cambios se guardan en `localStorage` y se ven solamente en el administrador del navegador y dispositivo donde se hicieron. Borrar los datos del navegador elimina esos cambios locales.

Para publicar los cambios, usa **Exportar JSON** y reemplaza `data/products.json` por el archivo descargado. Si las fotografías seleccionadas desde administración aparecen como texto largo que comienza con `data:image/`, seguirán funcionando, pero para un sitio más liviano conviene aplicar el procedimiento de la sección siguiente.

## Añadir un producto manualmente

1. Copia la nueva fotografía a `assets/images/`. Usa un nombre corto, sin espacios, por ejemplo `vela-lavanda.jpg`.
2. Abre `data/products.json`.
3. Añade un objeto antes del corchete final:

```json
{
  "id": "vela-lavanda",
  "nombre": "Vela lavanda",
  "precio": 45,
  "imagen": "assets/images/vela-lavanda.jpg",
  "descripcion": "Cera de soya con aroma a lavanda.",
  "disponible": true
}
```

Separa cada producto con una coma. El `id` debe ser único. El campo `precio` puede ser un número o, cuando existen varios tamaños, un texto como `"25 / 30 / 45"`. La web añade automáticamente “Bs”.

## Estructura

```text
index.html              Catálogo público
css/styles.css          Diseño adaptable
js/app.js               Catálogo, buscador, visor y WhatsApp
data/products.json      Datos de productos
assets/images/          Logo y fotografías reales del catálogo
```

La lectura de datos del catálogo público está separada en `loadProducts()` dentro de `js/app.js`.

## Publicar gratis en GitHub Pages

1. Crea un repositorio nuevo en GitHub.
2. Sube todo el contenido de esta carpeta, conservando la estructura.
3. En el repositorio abre **Settings → Pages**.
4. En **Build and deployment**, elige **Deploy from a branch**.
5. Selecciona la rama `main` y la carpeta `/ (root)`, y guarda.
6. GitHub mostrará la dirección pública en unos minutos.

El administrador no se publica en GitHub Pages. Para publicar un cambio debes subir el `products.json` exportado y cualquier fotografía nueva al repositorio.

## Publicar gratis en Netlify

1. Entra en <https://app.netlify.com/drop>.
2. Arrastra esta carpeta completa a la página.
3. Netlify entregará una dirección pública automáticamente.
4. Para actualizar el sitio, vuelve a desplegar la carpeta con los archivos actualizados.

No se necesita comando de compilación ni carpeta especial de publicación: la raíz del proyecto es la carpeta publicable.
