# Album: Ubuntu + MySQL

## Implementado ahora

- `DiaryRepository` separa la interfaz de las operaciones `list`, `save` y `remove`.
- El adaptador actual usa IndexedDB del navegador. NO sincroniza telefonos ni se conecta al servidor.
- Importa una sola vez los recuerdos anteriores sin borrar los originales. v2 tiene prioridad sobre v1.
- Las fotos se reducen a un maximo de 1600 px y se guardan en JPEG. No se envian a terceros.
- La descarga genera una copia JSON con textos y fotos. Restaurar desde archivo aun no esta implementado.
- No hay credenciales, conexiones MySQL ni puertos abiertos en este cambio.

## Siguiente etapa acordada

Ubuntu encendido, MySQL para organizar los recuerdos, archivos de fotos en una carpeta privada fuera de `public/` y de Git. MySQL guarda identificador, propietario, dimensiones y ruta interna, no imagenes base64. La propuesta SQL adjunta no ha sido ejecutada.

Un adaptador HTTP implementara el contrato actual:

| Operacion | Ruta propuesta |
| --- | --- |
| Leer paginas | GET /api/album/entries |
| Crear pagina | POST /api/album/entries |
| Editar pagina | PATCH /api/album/entries/:id |
| Eliminar pagina | DELETE /api/album/entries/:id |
| Subir foto | POST /api/album/photos |
| Leer foto privada | GET /api/album/photos/:id |

Todas las operaciones requieren sesion y pertenencia al album. El navegador nunca se conecta directamente a MySQL. Usar permisos minimos y consultas parametrizadas. El adaptador devuelve `image` como URL autenticada para conservar la interfaz actual. Guardar fechas nuevas en UTC y conservar fechas antiguas literalmente en `display_date`.

## Antes de publicar

1. Dos cuentas privadas, sesiones seguras, autorizacion por album y proteccion CSRF.
2. HTTPS. Preferir pagina y API bajo el mismo origen; si se conserva Vercel, resolver cookies y CORS hacia Ubuntu.
3. NO exponer MySQL 3306 a Internet. Definir acceso remoto/VPN o proxy HTTPS cuando conozcamos red y dominio.
4. Validar bytes/tipo de las fotos, limitar tamanos, generar nombres internos y no ejecutar archivos subidos.
5. Copia consistente de MySQL y archivos de fotos a otro disco/equipo, con prueba de restauracion.
6. Revisar actualizaciones antes de exponer el servicio: npm informa vulnerabilidades en el arbol actual. No se aplicaron actualizaciones incompatibles a ciegas.
7. Mostrar fallos sin borrar borradores si el servidor se apaga. Confirmar guardado solamente tras respuesta del servidor.

## Migracion futura

Tras iniciar sesion, ofrecer importar el album local con confirmacion. Verificar paginas y fotos antes de eliminar cualquier copia local. Usar `version` para detectar ediciones simultaneas.

Pendientes: acceso a Ubuntu, version de MySQL, espacio en disco, dominio/red, autenticacion, API, adaptador remoto y respaldos. Nada esta desplegado aun en esa computadora.
