# 01. Inventario del repositorio

## Estado de la auditoría

Este documento registra el inventario real del repositorio y deja constancia de lo que sí existe en código. La fuente principal de verdad fue el repositorio actual. No se encontraron archivos de configuración, SQL, `.env`, `composer.json`, `package.json`, ni documentación técnica visible en la raíz.

## Resumen ejecutivo

- Tipo de proyecto: aplicación web PHP monolítica
- Patrón actual: scripts PHP + HTML embebido + consultas MySQL directas
- Persistencia: MySQL/MariaDB vía `mysqli`
- Autenticación: sesiones PHP con `$_SESSION`
- Roles observados en código: `enfermero`, `familiar` y un uso potencial de `admin` en `views/contexto_usuario.php`
- Contexto del residente: se guarda en `$_SESSION['id_residente']`
- Vistas: mezcla de archivos PHP con HTML/CSS inline
- Arquitectura actual: acoplada, sin capa de servicios ni API

## Árbol real observado

### Raíz del proyecto

| Ruta                            | Tipo       | Propósito aparente                              | Observaciones                                     |
| ------------------------------- | ---------- | ----------------------------------------------- | ------------------------------------------------- |
| `login.php`                     | PHP        | Login principal                                 | valida usuario y redirige según rol               |
| `login.html`                    | HTML       | Interfaz de login                               | vista de acceso                                   |
| `registro.php`                  | PHP        | Registro de usuario                             | inserta en `usuarios` y `familiares`/`residentes` |
| `registro_view.html`            | HTML       | View de registro                                | formulario                                        |
| `panel_enfermero.html`          | HTML       | Menú del enfermero                              | posible vista de entrada                          |
| `panel_familiar.php`            | PHP        | Carga panel según familiar                      | consulta `familiares` + `residentes`              |
| `panel_familiar.html`           | HTML       | Vista del familiar                              | posible entrada inicial                           |
| `panel_residente.php`           | PHP        | Panel del residente seleccionado                | muestra menú y contexto                           |
| `seleccionar_residente.php`     | PHP        | Guarda el residente activo en sesión            | decide destino                                    |
| `signos_vitales.php`            | PHP        | Insertar y consultar signos vitales             | endpoint híbrido                                  |
| `signos_vitales.html`           | HTML       | Formulario de signos vitales                    | interfaz                                          |
| `inventario_enfermero.php`      | PHP        | Inventario del enfermero                        | consulta productos                                |
| `inventario_familiar.php`       | PHP        | Inventario del familiar, filtrado por residente |
| `gestion_familiar.php`          | PHP        | Gestión del residente para enfermero            | carga actividades/notas/avisos                    |
| `gestion_familiar_familiar.php` | PHP        | Gestión del residente para familiar             | similar pero orientado al familiar                |
| `historial_familiar.php`        | PHP        | Historial de signos vitales                     |
| `historial_recetas.php`         | PHP        | Historial de recetas                            |
| `guardar_receta.php`            | PHP        | Guardar receta principal y detalle              |
| `cambiar_estado_receta.php`     | PHP        | Actualizar estado de receta                     |
| `eliminar_receta.php`           | PHP        | Eliminar receta                                 |
| `reabastecimiento.php`          | PHP        | cálculo inteligente de reabastecimiento         |
| `atender_alerta.php`            | PHP        | marca alerta como atendida                      |
| `familiar_enterado.php`         | PHP        | marca alerta como enterada por familiar         |
| `crear_actividad.php`           | PHP        | crea actividad                                  |
| `confirmar_actividad.php`       | PHP        | confirma o rechaza actividad                    |
| `crear_nota.php`                | PHP        | crea nota                                       |
| `eliminar_nota.php`             | PHP        | elimina nota                                    |
| `crear_aviso.php`               | PHP        | crea aviso                                      |
| `eliminar_aviso.php`            | PHP        | elimina aviso                                   |
| `crear_producto.php`            | PHP        | crea producto                                   |
| `editar_producto.php`           | PHP        | consulta producto por id                        |
| `actualizar_producto.php`       | PHP        | actualiza producto                              |
| `eliminar_producto.php`         | PHP        | elimina producto                                |
| `actualizar_cantidad.php`       | PHP        | incrementa/decrementa cantidad                  |
| `styles.css`                    | CSS        | estilos globales                                | no se observó dependencia directa clara           |
| `uploads/`                      | Directorio | almacenamiento de imágenes                      | se usa para `imagen` de producto                  |
| `views/`                        | Directorio | vistas/fragmentos HTML/PHP                      | incluye layouts y contexto                        |

### Carpeta `views/`

| Archivo                         | Tipo | Propósito aparente                                    |
| ------------------------------- | ---- | ----------------------------------------------------- |
| `contexto_usuario.php`          | PHP  | Muestra nombre de usuario y residente actual          |
| `panel_enfermero.php`           | PHP  | panel interno del enfermero                           |
| `panel_familiar_view.php`       | PHP  | listado de residentes para familiar                   |
| `gestion_view.php`              | PHP  | vista de gestión general                              |
| `gestion_view_enfermero.php`    | PHP  | vista de gestión con actividades/notas/avisos/alertas |
| `gestion_view_familiar.php`     | PHP  | vista de gestión familiar                             |
| `inventario_view_enfermero.php` | PHP  | vista de inventario del enfermero                     |
| `inventario_view_familiar.php`  | PHP  | vista de inventario del familiar                      |
| `historial_familiar_view.php`   | PHP  | vista tipo historial                                  |
| `crear_receta.php`              | PHP  | formulario para receta                                |
| `crear_actividad.html`          | HTML | formulario de actividad                               |
| `crear_aviso.html`              | HTML | formulario de aviso                                   |
| `crear_nota.html`               | HTML | formulario de nota                                    |
| `crear_producto.html`           | HTML | formulario de producto                                |
| `editar_producto.html`          | HTML | formulario de edición                                 |

## Archivos clave según clasificación

### Autenticación

- `login.php`
- `registro.php`
- `views/contexto_usuario.php`

### Sesiones

- `login.php`
- `panel_familiar.php`
- `panel_residente.php`
- `seleccionar_residente.php`
- `gestion_familiar.php`
- `historial_familiar.php`
- `signos_vitales.php`
- `inventario_enfermero.php`
- `reabastecimiento.php`

### Vistas/HTML

- `login.html`
- `registro_view.html`
- `panel_enfermero.html`
- `panel_familiar.html`
- `panel_residente.php`
- `views/*.php` y `views/*.html`

### Lógica de negocio

- `reabastecimiento.php`
- `guardar_receta.php`
- `historial_recetas.php`
- `gestion_familiar.php`
- `panel_familiar.php`
- `panel_enfermero_ingresar_residente.php`

### Acciones CRUD / endpoints

- `crear_*`, `editar_*`, `actualizar_*`, `eliminar_*`, `confirmar_*`, `cambiar_*`, `atender_*`

## Dependencias observadas

- PHP con `mysqli`
- MySQL/MariaDB en `localhost`
- base de datos: `raizdigital`
- usuario de base de datos: `root`
- sin `composer.json`
- sin `package.json`
- sin `.env`
- sin archivos SQL o migraciones visibles

## Observaciones importantes

- No se encontraron archivos de configuración externos.
- La configuración está hardcodeada directamente en cada script.
- La aplicación no parece tener una capa separada de acceso a datos.
- Hay HTML/CSS/JS embebidos tanto en PHP como en archivos HTML.
- Las vistas se parecen a pantallas acabadas, pero no a un front separado.

## Criterio de clasificación usado

- [CONFIRMADO]: existe en el código
- [INFERIDO]: deducible del patrón del código
- [NO ENCONTRADO]: no apareció durante la auditoría

### Ejemplos

- [CONFIRMADO] `mysqli_connect` y `new mysqli` en decenas de archivos.
- [CONFIRMADO] uso de `$_SESSION['id_residente']`.
- [INFERIDO] existe una relación residente → inventario por uso de `id_residente` en `productos`.
- [NO ENCONTRADO] `README.md`, SQL/schema formal, `.env`, `composer.json`, `package.json`.
