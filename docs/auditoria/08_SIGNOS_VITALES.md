# 08. Signos vitales

## 1. Archivos observados

- `signos_vitales.php`
- `historial_familiar.php`
- `panel_residente.php`
- `views/contexto_usuario.php`

## 2. Ingreso de signos vitales

### Archivo

`signos_vitales.php`

### Entrada de POST

- `presion`
- `temperatura`
- `frecuencia_cardiaca`
- `frecuencia_respiratoria`
- `oxigeno`
- `glucosa`
- `observaciones`

### Inserción observada

```sql
INSERT INTO signos_vitales
(id_residente, id_usuario, presion, temperatura, frecuencia_cardiaca, frecuencia_respiratoria, oxigeno, glucosa, observaciones)
VALUES
('$id_residente', '$id_usuario', '$presion', '$temperatura', '$fc', '$fr', '$oxigeno', '$glucosa', '$observaciones')
```

### Sesiones usadas

- `$_SESSION['id_residente']`
- `$_SESSION['id_usuario']`

## 3. Consulta de historial

### Consulta principal

```sql
SELECT * FROM signos_vitales WHERE id_residente = '$id_residente'
```

### Filtro por fechas

```sql
AND fecha BETWEEN '$fecha_inicio' AND '$fecha_fin'
```

### Orden

```sql
ORDER BY fecha DESC, hora DESC
```

## 4. Campos observados

Se confirmaron los siguientes datos:

- `presion`
- `temperatura`
- `frecuencia_cardiaca`
- `frecuencia_respiratoria`
- `oxigeno`
- `glucosa`
- `observaciones`
- `fecha`
- `hora`
- `id_residente`
- `id_usuario`

## 5. ¿Qué no se confirmó?

No se encontró evidencia de:

- validación de rangos mínimos/máximos
- que se almacene la unidad de cada medida
- que exista un catalogo de “signos válidos” por tipo de paciente
- auditoría ni trazabilidad del médico que lo registra aparte del `id_usuario`

## 6. Historial y visualización

`historial_familiar.php` filtra por `id_residente` y luego muestra los registros para el residente actual. La lógica consulta la misma tabla `signos_vitales`.

## 7. Riesgos

- no hay sanitización ni prepared statement
- no hay validación de valores numéricos
- no existe uniformidad de formatos de fecha/hora en la aplicación
- cualquier usuario con acceso a la sesión puede potencialmente consultar/escribir signos de otro residente si bypassa la validación de `id_residente`

## 8. Conclusión

Los signos vitales son un módulo confirmado y funcional del prototipo. Es un punto clave para la Fase 2 porque provoca la integración entre historial clínico, contexto del residente y consultas del familiar/enfermero.
