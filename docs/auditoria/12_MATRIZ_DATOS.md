# 12. Matriz de datos

| Entidad           | Tabla                      | PK                    | FK                                     | Quién crea                 | Quién consulta                 | Quién modifica                 | Quién elimina        |
| ----------------- | -------------------------- | --------------------- | -------------------------------------- | -------------------------- | ------------------------------ | ------------------------------ | -------------------- |
| Usuario           | `usuarios`                 | `id_usuario`          | -                                      | Registro / login           | Login / contexto               | no determinado                 | no determinado       |
| Familiar          | `familiares`               | `id_familiar`         | `id_usuario`                           | Registro                   | Panel familiar                 | no determinado                 | no determinado       |
| Residente         | `residentes`               | `id_residente`        | `id_usuario`, `id_familiar` (inferido) | Registro / enfermero       | Paneles, historial, inventario | no determinado                 | no determinado       |
| Producto          | `productos`                | `id_producto`         | `id_residente`                         | Enfermero                  | Enfermero / Familiar           | Enfermero                      | Enfermero            |
| Receta            | `recetas_medicas`          | `id_receta`           | `id_residente`, `id_usuario`           | Enfermero                  | Familiar / Enfermero           | Enfermero                      | Enfermero            |
| Detalle de receta | `receta_detalle`           | no determinado        | `id_receta`, `id_producto`             | Enfermero                  | Reabastecimiento / historial   | Enfermero                      | no determinado       |
| Signos vitales    | `signos_vitales`           | `id_signo` (inferido) | `id_residente`, `id_usuario`           | Enfermero                  | Familiar / Enfermero           | no determinado                 | no determinado       |
| Actividad         | `actividades`              | `id_actividad`        | `id_residente`, `id_enfermero`         | Enfermero                  | Familiar / Enfermero           | Enfermero                      | Enfermero            |
| Nota              | `notas`                    | `id_nota`             | `id_residente`, `id_usuario`           | Enfermero / Familiar       | Familiar / Enfermero           | no determinado                 | Enfermero / Familiar |
| Aviso             | `avisos`                   | `id_aviso`            | `id_residente`, `id_usuario`           | Enfermero                  | Familiar / Enfermero           | no determinado                 | Enfermero            |
| Alerta            | `alertas_reabastecimiento` | `id_alerta`           | `id_residente`, `id_producto`          | Sistema (reabastecimiento) | Enfermero / Familiar           | Sistema / Enfermero / Familiar | no determinado       |

## Comentarios

### [CONFIRMADO]

Las entidades principales están conectadas por `id_residente` y `id_usuario`.

### [INFERIDO]

Existe una estructura de familiar → residente que se confirma parcialmente por `panel_familiar.php`.

### [NO ENCONTRADO]

No se encontró `CREATE TABLE`, schema SQL ni documentación de BD que defina columnas exactas, constraints o índices.

## Conclusión

El modelo de datos se puede reconstruir con bastante precisión, pero la fuente definitiva sigue siendo el código y no el modelo formal de BD. Para la Fase 2, esta matriz sirve como base para migración y contrato.
