# 09. Gestión familiar

## 1. Alcance real observado

La gestión familiar se compone de:

- actividades
- notas
- avisos
- alertas de reabastecimiento
- visualización de historial del residente

### Archivos clave

- `gestion_familiar.php`
- `gestion_familiar_familiar.php`
- `views/gestion_view_enfermero.php`
- `views/gestion_view_familiar.php`
- `crear_actividad.php`
- `crear_nota.php`
- `crear_aviso.php`
- `confirmar_actividad.php`
- `familiar_enterado.php`

## 2. Actividades

### Inserción observada

```sql
INSERT INTO actividades
(id_residente, id_enfermero, titulo, descripcion, fecha, hora, estado)
VALUES
('$id_residente', '$id_enfermero', '$titulo', '$descripcion', '$fecha', '$hora', 'pendiente')
```

### Consulta

```sql
SELECT * FROM actividades WHERE id_residente = '$id_residente' ORDER BY fecha ASC, hora ASC
```

### Estados observados

- `pendiente`
- `confirmado`
- `rechazado`

### Confirmación

```sql
UPDATE actividades SET estado='$estado' WHERE id_actividad='$id'
```

## 3. Notas

### Inserción

```sql
INSERT INTO notas (id_residente, id_usuario, contenido, tipo, fecha)
VALUES ('$id_residente', '$id_usuario', '$contenido', '$rol', NOW())
```

### Consulta

```sql
SELECT n.*, u.nombre
FROM notas n
INNER JOIN usuarios u ON n.id_usuario = u.id_usuario
WHERE n.id_residente = '$id_residente'
```

### Observación

El campo `tipo` parece representar el rol del autor (`enfermero` o `familiar`), y la vista muestra mensajes a la izquierda o derecha según ese valor.

## 4. Avisos

### Inserción

```sql
INSERT INTO avisos
(id_residente, id_usuario, titulo, descripcion, cantidad, fecha)
VALUES
('$id_residente', '$id_usuario', '$titulo', '$descripcion', '$cantidad', '$fecha')
```

### Consulta

```sql
SELECT * FROM avisos WHERE id_residente = '$id_residente'
```

## 5. Alertas de reabastecimiento

### Consulta real

```sql
SELECT ar.*, p.nombre
FROM alertas_reabastecimiento ar
INNER JOIN productos p ON ar.id_producto = p.id_producto
WHERE ar.id_residente = '$id_residente'
AND ar.alerta_activa = 1
ORDER BY ar.fecha_generada DESC
```

### Observación

La vista muestra si la alerta ya fue atendida por el enfermero (`atendida`) y si fue confirmada por el familiar (`familiar_enterado`).

## 6. Diferencia entre familiar y enfermero

### Enfermero

Observado en `views/gestion_view_enfermero.php`:

- puede crear actividades
- puede confirmar/rechazar actividades
- puede crear notas
- puede crear avisos
- puede crear recetas
- puede revisar alertas de reabastecimiento
- puede filtrar por fecha

### Familiar

Observado en `gestion_familiar_familiar.php` y `views/gestion_view_familiar.php`:

- consulta actividades y avisos del residente
- puede crear notas
- puede confirmar que recibe la alerta (`familiar_enterado.php`)
- no se observa creación de receta ni administración del inventario

## 7. Permisos reales

### [CONFIRMADO]

El sistema usa la sesión de usuario y residente para decidir qué puede acceder. Sin embargo, no se observó un esquema formal de permisos por rol y recurso.

### [INFERIDO]

Las decisiones se basan principalmente en:

- `$_SESSION['rol']`
- `$_SESSION['id_residente']`
- consultas a tablas por `id_residente`

## 8. Riesgos

- falta de autorización granular
- cualquier URL con un `id_residente` válido puede ser manipulado
- la detección de permisos no está centralizada
- el familiar puede ejecutar acciones que no deberían estar permitidas si el flujo del navegador es manipulado

## 9. Conclusión

La gestión familiar es un módulo funcional y muy importante del sistema, con un enfoque práctico de comunicación y seguimiento del residente. Es un núcleo para la Fase 2 porque conecta la relación residente–familia–enfermero.
