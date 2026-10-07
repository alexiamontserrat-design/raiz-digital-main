# 05. Modelo de datos real

## Regla

Este documento reconstruye el modelo de datos a partir del código real. No se encontraron migrations ni `CREATE TABLE` en el repositorio, por lo que este es un modelo observado, no el esquema oficial.

## Tablas observadas

### 1) `usuarios`

**Columnas observadas**

- `id_usuario` (PK inferida)
- `nombre`
- `correo`
- `contraseña`
- `rol`

**Uso confirmado**

- login
- guardado de sesión
- registro

**Evidencia**

- `login.php`
- `registro.php`

---

### 2) `familiares`

**Columnas observadas**

- `id_familiar` (PK inferida)
- `id_usuario` (FK inferida a `usuarios.id_usuario`)
- `telefono`

**Uso confirmado**

- panel familiar
- registro de familiar

**Evidencia**

- `registro.php`
- `panel_familiar.php`

---

### 3) `residentes`

**Columnas observadas**

- `id_residente` (PK inferida)
- `id_usuario` (FK inferida a `usuarios` o a un usuario de alto nivel)
- `nombre`
- `edad`
- `diagnostico`
- `habitacion`
- posiblemente `id_familiar` (inferido por uso en `panel_familiar.php`)

**Uso confirmado**

- selección del residente
- panel del residente
- inventario
- recetas
- actividades
- notas
- avisos
- signos vitales

**Evidencia**

- `panel_enfermero_ingresar_residente.php`
- `panel_familiar.php`
- `panel_residente.php`

---

### 4) `productos`

**Columnas observadas**

- `id_producto` (PK inferida)
- `nombre`
- `cantidad`
- `tipo`
- `imagen`
- `especificaciones`
- `id_residente` (FK inferida a `residentes.id_residente`)
- `stock_minimo` (se usa en reabastecimiento)

**Uso confirmado**

- inventario
- crear producto
- reabastecimiento
- recetas

**Evidencia**

- `crear_producto.php`
- `reabastecimiento.php`
- `inventario_enfermero.php`

---

### 5) `recetas_medicas`

**Columnas observadas**

- `id_receta` (PK inferida)
- `id_residente`
- `id_usuario`
- `fecha_inicio`
- `fecha_fin`
- `observaciones`
- `estado` (se usa en `cambiar_estado_receta.php`)
- `created_at` (aparece en `historial_recetas.php`)

**Uso confirmado**

- creación
- consulta historial
- cambio de estado
- eliminacion

**Evidencia**

- `guardar_receta.php`
- `historial_recetas.php`
- `cambiar_estado_receta.php`

---

### 6) `receta_detalle`

**Columnas observadas**

- `id_receta`
- `id_producto`
- `dosis`
- `unidad_dosis`
- `frecuencia_horas`
- `duracion_dias`

**Uso confirmado**

- cálculo del reabastecimiento
- detalle de receta

**Evidencia**

- `guardar_receta.php`
- `reabastecimiento.php`

---

### 7) `signos_vitales`

**Columnas observadas**

- `id_signo` (PK inferida)
- `id_residente`
- `id_usuario`
- `presion`
- `temperatura`
- `frecuencia_cardiaca`
- `frecuencia_respiratoria`
- `oxigeno`
- `glucosa`
- `observaciones`
- `fecha`
- `hora`

**Uso confirmado**

- registro de signos vitales
- historial por residente y fechas

**Evidencia**

- `signos_vitales.php`
- `historial_familiar.php`

---

### 8) `actividades`

**Columnas observadas**

- `id_actividad`
- `id_residente`
- `id_enfermero`
- `titulo`
- `descripcion`
- `fecha`
- `hora`
- `estado`

**Uso confirmado**

- agenda de actividades
- confirmación/rechazo
- eliminación

**Evidencia**

- `crear_actividad.php`
- `confirmar_actividad.php`
- `gestion_familiar.php`

---

### 9) `notas`

**Columnas observadas**

- `id_nota`
- `id_residente`
- `id_usuario`
- `contenido`
- `tipo`
- `fecha`

**Uso confirmado**

- notas del residente
- visualización con autor por `usuarios`

**Evidencia**

- `crear_nota.php`
- `gestion_familiar.php`

---

### 10) `avisos`

**Columnas observadas**

- `id_aviso`
- `id_residente`
- `id_usuario`
- `titulo`
- `descripcion`
- `cantidad`
- `fecha`

**Uso confirmado**

- avisos a familiares o care team

**Evidencia**

- `crear_aviso.php`
- `gestion_familiar.php`

---

### 11) `alertas_reabastecimiento`

**Columnas observadas**

- `id_alerta`
- `id_residente`
- `id_producto`
- `mensaje`
- `nivel`
- `familiar_enterado`
- `alerta_activa`
- `atendida`
- `fecha_generada`

**Uso confirmado**

- alertas por producto con stock bajo o agotamiento
- seguimiento del familiar

**Evidencia**

- `reabastecimiento.php`
- `atender_alerta.php`
- `familiar_enterado.php`

---

## Relaciones observadas

### Usuarios

- `usuarios` → `familiares` (1 a 1 o 1 a muchos)
- `usuarios` → `residentes` (inferido)

### Residentes

- `residentes` → `productos` (obvio por `id_residente`)
- `residentes` → `signos_vitales`
- `residentes` → `actividades`
- `residentes` → `notas`
- `residentes` → `avisos`
- `residentes` → `recetas_medicas`
- `residentes` → `alertas_reabastecimiento`

### Recetas

- `recetas_medicas` → `receta_detalle`
- `receta_detalle` → `productos`

### Familiar y residente

- `familiares` → `residentes` (inferido por `id_familiar` usado en `panel_familiar.php`)

## Mapa simplificado

```text
usuarios
  ├─ familiares
  ├─ residentes
  └─ registros de sesión / rol

residentes
  ├─ signos_vitales
  ├─ productos
  ├─ recetas_medicas
  ├─ receta_detalle
  ├─ actividades
  ├─ notas
  ├─ avisos
  └─ alertas_reabastecimiento
```

## Observaciones de integridad

- El patrón dominante es: `id_residente` como eje principal.
- No se encontró schema con PK/FK explícitas ni constraints SQL.
- La capa de BD se modela con relaciones implícitas en código, no en SQL.
- El nivel de confianza del modelo es [CONFIRMADO] para tablas principales y [INFERIDO] para campos secundarios y relaciones no explícitas.
