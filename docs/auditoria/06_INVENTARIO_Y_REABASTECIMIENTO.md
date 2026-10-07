# 06. Inventario y reabastecimiento

## 1. Inventario real

### Tabla observada

- `productos`

### Campos observados en código

- `id_producto`
- `nombre`
- `cantidad`
- `tipo`
- `imagen`
- `especificaciones`
- `id_residente`
- `stock_minimo`

### Archivos que lo usan

- `crear_producto.php`
- `inventario_enfermero.php`
- `inventario_familiar.php`
- `editar_producto.php`
- `actualizar_producto.php`
- `actualizar_cantidad.php`
- `eliminar_producto.php`
- `reabastecimiento.php`
- `guardar_receta.php`

## 2. Cómo se crea y consulta

### Crear producto

`crear_producto.php`

```php
INSERT INTO productos (nombre, cantidad, tipo, imagen, especificaciones, id_residente)
VALUES ('$nombre', '$cantidad', '$tipo', '$imagen', '$esp', '$id_residente')
```

### Consulta por residente

```php
SELECT * FROM productos WHERE id_residente = '$id_residente'
```

### Observación

En `inventario_enfermero.php` se observa una sobrescritura de la consulta:

```php
$sql = "SELECT * FROM productos WHERE id_residente = '$id_residente'";
$sql = "SELECT * FROM productos";
```

Esto significa que la vista del enfermero puede estar mostrando todos los productos sin filtrar por residente.

## 3. Reabastecimiento inteligente

### Archivo base

`reabastecimiento.php`

### Entrada de flujo

- `$_SESSION['id_residente']`
- consulta de recetas activas con detalle

### Consulta principal

```sql
SELECT rm.id_receta, rd.*, p.id_producto, p.nombre, p.cantidad, p.stock_minimo, p.tipo
FROM recetas_medicas rm
INNER JOIN receta_detalle rd ON rm.id_receta = rd.id_receta
INNER JOIN productos p ON rd.id_producto = p.id_producto
WHERE rm.id_residente = '$id_residente'
AND rm.estado = 'activa'
```

## 4. Cálculos observados

Los cálculos están explícitos en `reabastecimiento.php`.

```php
$dosis_por_dia = (24 / $r['frecuencia_horas']) * $r['dosis'];
$consumo_total = $dosis_por_dia * $r['duracion_dias'];
$restante = $r['cantidad'] - $consumo_total;
```

El sistema también calcula:

```php
$dias_restantes = $r['cantidad'] / $dosis_por_dia;
```

y la fecha estimada de agotamiento con:

```php
$fecha = new DateTime();
$fecha->modify("+" . floor($dias_restantes) . " days");
$fecha_agotamiento = $fecha->format("d/m/Y");
```

## 5. Regla de alerta observada

### [CONFIRMADO]

La lógica de alerta evalúa varios escenarios:

- si `restante < 0` → nivel `danger`
- si `dias_restantes <= 3` → nivel `warning`
- si `restante <= stock_minimo` → nivel `warning`
- si todo está bien → `ok`

### Mensajes generados

- `"No alcanzará para completar tratamiento"`
- `"Se agotará en menos de 3 días"`
- `"Reabastecer pronto"`

### Inserción/actualización

```sql
INSERT INTO alertas_reabastecimiento (...) VALUES (...)
UPDATE alertas_reabastecimiento SET ... WHERE id_residente = ... AND id_producto = ...
```

## 6. Estado de alertas

Campos observados:

- `alerta_activa`
- `familiar_enterado`
- `atendida`
- `nivel`

Acciones:

- `atender_alerta.php` actualiza `atendida = 1`
- `familiar_enterado.php` actualiza `familiar_enterado = 1`

## 7. Flujo real del reabastecimiento

```text
Receta activa
  ↓
Detalle de receta (dosis + frecuencia + duración)
  ↓
Producto asociado
  ↓
Cálculo de consumo diario / total / restante
  ↓
Comparación con stock mínimo
  ↓
Generación/actualización de alerta_reabastecimiento
  ↓
Acción del familiar o enfermero
```

## 8. Riesgos detectados

- no hay validación de que la receta pertenezca al residente autenticado
- no hay validación del producto frente a ese residente
- no hay control de permisos para generar alertas
- no hay prevención de duplicados real más allá de `SELECT` + `UPDATE`
- no hay señal de algoritmo de reorden más sofisticado que el que aparece en la vista

## 9. Conclusión

El módulo de reabastecimiento está implementado como un cálculo práctico de consumo y agotamiento, pero no como una regla de negocio formalizada. Esta parte es importante para la Fase 2 porque está muy ligada a recetas y alertas, y debería conservarse exactamente en su comportamiento actual.
