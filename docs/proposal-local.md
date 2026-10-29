# Propuesta local aislada

- La version actual sigue en `/`. No se modifico su entrada, su escena ni sus textos al crear esta propuesta.
- La prueba esta en `/propuesta` y responde 404 fuera de desarrollo. No se hizo commit ni push.
- Se hizo un ZIP de codigo y recursos antes de empezar: `C:/Users/Danny/Documents/ChatGPT/app de cumpleaños/respaldo-jardin-antes-propuesta-2026-10-27.zip`.
- El ZIP excluye dependencias, compilaciones, historial Git y archivos `.env`; NO es respaldo de fotos guardadas en el navegador. Para estas, usar la descarga del album.
- El album de la propuesta usa otra base IndexedDB: `nuestro-jardin-proposal-only`. No lee, modifica ni migra el album real.
- Se reutilizan los componentes de carta y album sin cambiar su contenido. Las frases se copiaron literalmente a `src/components/proposal/messages.ts` para no modificar archivos de la version actual.
- Ilustracion de fondo para vertical y horizontal, tulipan transparente separado, peces y efectos animados en PixiJS. Casa y flores del fondo tienen zonas interactivas accesibles; no todos los objetos son capas separadas aun.
- Las tres imagenes WebP suman aproximadamente 287 KB. Las imagenes se cargan antes de activar las interacciones.

Para volver ahora, abrir `/` o usar la flecha superior izquierda. No hay que restaurar archivos ni modificar Git.

Para continuar: aprobar la composicion en telefono real antes de integrar esta escena al flujo de bienvenida. Decidir si se separaran tambien casa y vegetacion para futuras animaciones. La sincronizacion Ubuntu/MySQL sigue pendiente.
