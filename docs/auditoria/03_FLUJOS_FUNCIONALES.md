# 03. Flujos funcionales reales

## Regla de la auditoría

Este documento describe flujos observados en el código. No se asume que una funcionalidad exista si no se encontró evidencia directa en el repo.

## FLUJO 1: Login

### Punto de entrada

`login.html` → `login.php`

### Datos recibidos

- `$_POST['correo']`
- `$_POST['password']`

### Validaciones observadas

- verifica si la conexión a MySQL funciona
- busca usuario por correo
- compara la contraseña con valor directo (`$usuario['contraseña'] == $contrasena`)

### Consulta SQL

```php
$sql = "SELECT * FROM usuarios WHERE correo = '$correo'";
```

### Tabla involucrada

- `usuarios`

### Acción

- si coincide la contraseña:
  - `$_SESSION['id_usuario'] = $usuario['id_usuario']`
  - `$_SESSION['rol'] = $usuario['rol']`
  - redirige según rol

### Redirección

- `enfermero` → `panel_enfermero.html`
- `familiar` → `panel_familiar.php`

### Riesgos

- comparación directa de contraseña
- SQL concatenado
- no hay hashing
- no hay bloqueo ni validación robusta

---

## FLUJO 2: Registro de usuario

### Archivo inicial

`registro.php`

### Datos recibidos

- `nombre`, `correo`, `password`, `rol`
- si rol es `familiar`: `telefono`
- si rol es `residente`: `edad`, `diagnostico`, `habitacion`

### Inserciones

```php
INSERT INTO usuarios (nombre, correo, contraseña, rol)
INSERT INTO familiares (id_usuario, telefono)
INSERT INTO residentes (id_usuario, nombre, edad, diagnostico, habitacion)
```

### Observación

El sistema admite distintos tipos de usuario en la misma tabla `usuarios` y crea un registros paralelo según el rol.

---

## FLUJO 3: Selección de rol

### Archivo

`login.php`

### Estado actual

Se valida el valor de `$_SESSION['rol']` y se redirige.

### Evidencia

```php
if ($usuario['rol'] == "enfermero") { ... }
else if ($usuario['rol'] == "familiar") { ... }
```

---

## FLUJO 4: Entrada del enfermero

### Archivo inicial

`panel_enfermero.html` y `panel_enfermero_ingresar_residente.php`

### Acción

- sesión `id_usuario`
- búsqueda de residente por ID o nombre
- selección del residente
- `$_SESSION['id_residente'] = $id_residente`
- redirección a `panel_residente.php`

### SQL relevante

```php
SELECT * FROM residentes WHERE id_residente = '$busqueda'
SELECT * FROM residentes WHERE nombre LIKE '%$busqueda%'
```

---

## FLUJO 5: Entrada del familiar

### Archivo inicial

`panel_familiar.php`

### Lógica

1. confirma que exista `$_SESSION['id_usuario']`
2. consulta `familiares WHERE id_usuario = '$id_usuario'`
3. obtiene `id_familiar`
4. consulta `residentes WHERE id_familiar = '$id_familiar'`
5. incluye `views/panel_familiar_view.php`

### SQL relevante

```php
SELECT * FROM familiares WHERE id_usuario = '$id_usuario';
SELECT * FROM residentes WHERE id_familiar = '$id_familiar';
```

### Vista final

`views/panel_familiar_view.php`

---

## FLUJO 6: Selección de residente

### Archivo

`seleccionar_residente.php`

### Entrada

`$_GET['id_residente']` y `$_GET['destino']`

### Acción

- guarda `$_SESSION['id_residente']`
- según rol y destino:
  - `historial` → `historial_familiar.php` o inventario alternativo para enfermero
  - `inventario` → `inventario_familiar.php`
  - `gestion` → `gestion_familiar.php` o `gestion_familiar_familiar.php`

### Riesgo

No se valida que el residente pertenezca al usuario actual.

---

## FLUJO 7: Registro de residente

### Archivo

`panel_enfermero_crear_residente.php`

### Observar

Se comprueba si el `id_familiar` existe antes de crear al residente.

### Inserción

```php
INSERT INTO residentes (...)
```

### Observación

En `registro.php` también existe un flujo para crear residente directamente, pero la evidencia de flujo real del panel es la del archivo `panel_enfermero_crear_residente.php`.

---

## FLUJO 8: Panel del residente

### Archivo

`panel_residente.php`

### Entrada

`$_SESSION['id_residente']`

### Acción

- busca el nombre del residente en `residentes`
- muestra tarjetas de opciones (signos vitales, inventario, gestión familiar)

### Vista final

- `signos_vitales.html`
- `inventario_enfermero.php`
- `gestion_familiar.php`

---

## FLUJO 9: Signos vitales

### Archivo

`signos_vitales.php`

### Entrada

- `$_SESSION['id_residente']`
- `$_SESSION['id_usuario']`
- `POST` con `presion`, `temperatura`, `frecuencia_cardiaca`, `frecuencia_respiratoria`, `oxigeno`, `glucosa`, `observaciones`

### Inserción

```sql
INSERT INTO signos_vitales (...) VALUES (...)
```

### Consulta histórica

```sql
SELECT * FROM signos_vitales WHERE id_residente = '$id_residente'
```

### Filtro por fechas

```sql
AND fecha BETWEEN '$fecha_inicio' AND '$fecha_fin'
```

### Output

JSON con historial cuando no es `POST`.

---

## FLUJO 10: Historial de signos vitales

### Archivo

`historial_familiar.php`

### Entrada

`$_SESSION['id_residente']`

### Consulta

```sql
SELECT * FROM signos_vitales WHERE id_residente = '$id_residente'
```

### Orden

```sql
ORDER BY fecha DESC, hora DESC
```

### Observación

Se usa una vista de historial pero no se observó un esquema de validación de firma ni autorizaciones distintas.

---

## FLUJO 11: Inventario

### Archivos

- `inventario_enfermero.php`
- `inventario_familiar.php`
- `crear_producto.php`
- `editar_producto.php`
- `actualizar_producto.php`
- `eliminar_producto.php`
- `actualizar_cantidad.php`

### Consulta base

```sql
SELECT * FROM productos WHERE id_residente = '$id_residente'
```

### Observación

En `inventario_enfermero.php` hay una línea adicional que sobrescribe el SQL con `SELECT * FROM productos` sin `WHERE`.

### Riesgos

- no hay validación de tipo
- no hay control de permisos por rol fuerte
- se asume que cada producto está asociado a un residente

---

## FLUJO 12: Crear producto

### Archivo

`crear_producto.php`

### Datos

- nombre
- cantidad
- tipo
- imagen
- especificaciones
- `id_residente` de sesión

### Inserción

```sql
INSERT INTO productos (nombre, cantidad, tipo, imagen, especificaciones, id_residente)
```

### Acción

- mueve archivo cargado a `uploads/`
- redirige a `inventario_enfermero.php`

---

## FLUJO 13: Editar / actualizar producto

### Archivos

- `editar_producto.php`
- `actualizar_producto.php`

### Comportamiento

- `editar_producto.php` carga producto por `id_producto`
- `actualizar_producto.php` actualiza campos del producto con `UPDATE productos ...`

### Riesgo

No se observa validación de pertenencia del producto al residente actual.

---

## FLUJO 14: Eliminar producto

### Archivo

`eliminar_producto.php`

### Acción

```php
DELETE FROM productos WHERE id_producto = '$id'
```

### Riesgo

Se elimina por ID sin verificación de rol ni relación residente.

---

## FLUJO 15: Actualizar cantidad

### Archivo

`actualizar_cantidad.php`

### Acción

```php
UPDATE productos SET cantidad = cantidad + 1 WHERE id_producto = '$id'
UPDATE productos SET cantidad = GREATEST(cantidad - 1, 0) WHERE id_producto = '$id'
```

### Observación

Se incrementa/disminuye cantidad sin validación del contexto.

---

## FLUJO 16: Reabastecimiento

### Archivo

`reabastecimiento.php`

### Entrada

`$_SESSION['id_residente']`

### Consulta principal

Se obtiene la receta activa y el detalle con productos.

### Fórmulas observadas

```php
$dosis_por_dia = (24 / $r['frecuencia_horas']) * $r['dosis'];
$consumo_total = $dosis_por_dia * $r['duracion_dias'];
$restante = $r['cantidad'] - $consumo_total;
$dias_restantes = $r['cantidad'] / $dosis_por_dia;
```

### Alertas

Se genera/actualiza en `alertas_reabastecimiento` con:

- `mensaje`
- `nivel`
- `familiar_enterado`
- `alerta_activa`

### Tablas relacionadas

- `recetas_medicas`
- `receta_detalle`
- `productos`
- `alertas_reabastecimiento`

---

## FLUJO 17: Alertas de inventario

### Archivos

- `reabastecimiento.php`
- `atender_alerta.php`
- `familiar_enterado.php`

### Acción

- `atender_alerta.php` actualiza `atendida = 1`
- `familiar_enterado.php` actualiza `familiar_enterado = 1`

### Observación

Existen dos mecanismos distintos para “resolver” la alerta: una por personal y otra por familiar.

---

## FLUJO 18: Crear receta

### Archivo

`guardar_receta.php`

### Entrada

- `$_SESSION['id_usuario']`
- `$_SESSION['id_residente']`
- `fecha_inicio`, `fecha_fin`, `observaciones`
- arrays: `producto`, `dosis`, `unidad`, `frecuencia`, `duracion`

### Inserción principal

```sql
INSERT INTO recetas_medicas (...) VALUES (...)
```

### Detalle

```sql
INSERT INTO receta_detalle (...) VALUES (...)
```

### Transacción

Se usa `begin_transaction()` y `commit()`/`rollback()`.

---

## FLUJO 19: Historial de recetas

### Archivo

`historial_recetas.php`

### Consulta principal

```sql
SELECT * FROM recetas_medicas WHERE id_residente = '$id_residente'
```

### Relación con producto

```sql
INNER JOIN receta_detalle rd ON rm.id_receta = rd.id_receta
INNER JOIN productos p ON rd.id_producto = p.id_producto
```

### Acciones

- cambiar estado
- visualizar detalle
- eliminar receta

---

## FLUJO 20: Cambiar estado de receta

### Archivo

`cambiar_estado_receta.php`

### Entrada

`$_GET['id']` y `$_GET['estado']`

### Validación

solo admite: `activa`, `finalizada`, `cancelada`

### Acción

```sql
UPDATE recetas_medicas SET estado = '$estado' WHERE id_receta = '$id_receta'
```

---

## FLUJO 21: Eliminar receta

### Archivo

`eliminar_receta.php`

### Acción

```sql
DELETE FROM recetas_medicas WHERE id_receta = '$id_receta'
```

### Observación

Se observa que el modelo de datos usa receta principal + detalle, pero no se ve un borrado en cascada ni validación de seguridad.

---

## FLUJO 22: Actividades

### Archivos

- `crear_actividad.php`
- `confirmar_actividad.php`
- `eliminar_actividad.php`
- `gestion_familiar.php`
- `views/gestion_view_enfermero.php`

### Inserción

```sql
INSERT INTO actividades (id_residente, id_enfermero, titulo, descripcion, fecha, hora, estado)
```

### Estados observados

- `pendiente`
- `confirmado`
- `rechazado`

### Confirmación

```sql
UPDATE actividades SET estado='$estado' WHERE id_actividad='$id'
```

---

## FLUJO 23: Notas

### Archivos

- `crear_nota.php`
- `eliminar_nota.php`
- `gestion_familiar.php`
- `views/gestion_view_enfermero.php`

### Inserción

```sql
INSERT INTO notas (id_residente, id_usuario, contenido, tipo, fecha)
```

### Observación

El campo `tipo` parece usarse para guardar el rol (`enfermero` / `familiar`).

---

## FLUJO 24: Avisos

### Archivos

- `crear_aviso.php`
- `eliminar_aviso.php`
- `gestion_familiar.php`

### Inserción

```sql
INSERT INTO avisos (id_residente, id_usuario, titulo, descripcion, cantidad, fecha)
```

### Observación

La estructura parece orientada a avisos de cantidad o recordatorios del residente.

---

## FLUJO 25: Historial familiar

### Archivo

`historial_familiar.php`

### Funcionalidad

consulta signos vitales del residente para familiares/enfermero.

### Observación

El flujo usa `$_SESSION['id_residente']`, no `id_familiar`.

---

## FLUJO 26: Contexto del residente

### Archivos

- `seleccionar_residente.php`
- `panel_enfermero_ingresar_residente.php`
- `panel_residente.php`
- `views/contexto_usuario.php`

### Acción real

Se guarda `$_SESSION['id_residente']` al seleccionar un residente y se reutiliza en casi todos los módulos del sistema.

### Riesgo

No hay comprobación que haga match entre ese residente y el usuario autenticado.

---

## Conclusión de flujos

Se observa una app funcional en sentido de prototipo, con flujo real de:

- login
- registro
- selección de residente
- tratamiento de signos vitales
- recetas
- inventario
- actividades/notas/avisos
- alertas

La arquitectura actual es operativa, pero no segura ni modular.
