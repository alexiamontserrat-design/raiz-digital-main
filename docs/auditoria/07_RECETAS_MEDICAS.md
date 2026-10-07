# 07. Recetas médicas

## 1. Modelo observado

### Tablas implicadas

- `recetas_medicas`
- `receta_detalle`
- `productos`
- `residentes`

### Archivos clave

- `guardar_receta.php`
- `historial_recetas.php`
- `cambiar_estado_receta.php`
- `eliminar_receta.php`
- `reabastecimiento.php`

## 2. Creación de receta

### Archivo

`guardar_receta.php`

### Entrada de datos

- `$_SESSION['id_usuario']`
- `$_SESSION['id_residente']`
- `fecha_inicio`
- `fecha_fin`
- `observaciones`
- arrays: `producto`, `dosis`, `unidad`, `frecuencia`, `duracion`

### Transacción observada

```php
$conexion->begin_transaction();
...
if (!$conexion->query($sqlReceta)) {
    throw new Exception("Error creando receta");
}
...
if (!$conexion->query($sqlDetalle)) {
    throw new Exception("Error guardando medicamento");
}
$conexion->commit();
```

### Inserción principal

```sql
INSERT INTO recetas_medicas
(id_residente, id_usuario, fecha_inicio, fecha_fin, observaciones)
VALUES
('$id_residente', '$id_usuario', '$fecha_inicio', '$fecha_fin', '$observaciones')
```

### Inserción detalle

```sql
INSERT INTO receta_detalle
(id_receta, id_producto, dosis, unidad_dosis, frecuencia_horas, duracion_dias)
VALUES
('$id_receta', '$id_producto', '$dosis_actual', '$unidad_actual', '$frecuencia_actual', '$duracion_actual')
```

## 3. Estado de la receta

### [CONFIRMADO]

En `cambiar_estado_receta.php` se valida:

```php
$permitidos = ['activa', 'finalizada', 'cancelada'];
```

Y luego:

```sql
UPDATE recetas_medicas SET estado = '$estado' WHERE id_receta = '$id_receta'
```

## 4. Historial de recetas

### Archivo

`historial_recetas.php`

### Consulta real

```sql
SELECT * FROM recetas_medicas
WHERE id_residente = '$id_residente'
```

Con filtro opcional por fechas:

```sql
AND fecha_inicio BETWEEN '$fecha_inicio_filtro' AND '$fecha_fin_filtro'
```

### Detalle asociado

```sql
SELECT rd.*, p.*
FROM receta_detalle rd
INNER JOIN productos p ON rd.id_producto = p.id_producto
WHERE rd.id_receta = ...
```

## 5. Relaciones clave de receta

```text
residentes
  └─ recetas_medicas
       ├─ id_residente
       ├─ id_usuario
       └─ estado

recetas_medicas
  └─ receta_detalle
       ├─ id_producto
       ├─ dosis
       ├─ unidad_dosis
       ├─ frecuencia_horas
       └─ duracion_dias

receta_detalle
  └─ productos
```

## 6. Cómo se usa la receta para reabastecimiento

`reabastecimiento.php` toma la combinación:

- receta activa
- detalle de receta
- producto asociado

Y calcula:

- dosis por día
- consumo total estimado
- restante proyectado
- días restantes
- fecha estimada de agotamiento
- nivel de riesgo

## 7. Observaciones de integridad

- la receta principal y el detalle se guardan en tablas separadas
- el cálculo de reabastecimiento depende de `frecuencia_horas`, `dosis`, `duracion_dias` y `stock_minimo`
- no se observa validación de que el producto exista para el residente correcto
- no se observa control de edición por rol más allá del uso de sesión

## 8. Riesgos

- SQL concatenado en varias acciones
- riesgo de manipulación de `id_receta` / `id_producto`
- posible inconsistencias si se elimina principal sin detalle
- no hay validación fuerte de fechas ni de combinación de medicamentos

## 9. Conclusión

La receta es una entidad central del sistema: guarda el tratamiento y alimenta el módulo de reabastecimiento y alertas. La Fase 2 debe preservarla como un contrato funcional clave.
