# 16. Precondiciones para Fase 2

## Información mínima que faltaría antes de iniciar la Fase 2

### 1) Schema definitivo de base de datos

- tabla `usuarios`
- tabla `familiares`
- tabla `residentes`
- tabla `productos`
- tabla `recetas_medicas`
- tabla `receta_detalle`
- tabla `signos_vitales`
- tabla `actividades`
- tabla `notas`
- tabla `avisos`
- tabla `alertas_reabastecimiento`

Se necesita un schema real con PK/FK, tipos, índices y restricciones.

### 2) Contratos de datos

- request/response para login
- request/response para registro
- request/response para obtener historial
- formato de recetas
- formato de productos
- formato de alertas

### 3) Definición definitiva de roles

- `enfermero`
- `familiar`
- `admin` (si aplica)
- `residente` (si aplica)
- permisos por módulo y recurso

### 4) Reglas de negocio de inventario

- stock mínimo
- consumo esperado
- criterio de alerta
- políticas de reabastecimiento

### 5) Reglas de negocio de recetas

- duración por medicamento
- frecuencia por horas
- dosis por unidad
- posible tratamiento activo/finalizado/cancelado

### 6) Contexto de residente

- cómo se valida que el residente pertenece al usuario
- qué pasa si el usuario intenta forzar un `id_residente`

### 7) Estrategia de autenticación

- elegir entre sesiones, JWT o una combinación
- definir expiración
- definir refresh token o cookie strategy

### 8) Configuración

- variables de entorno
- host BD, user, pass, nombre de base de datos
- entorno local/desarrollo/producción

### 9) Documentación de flujo de negocio

- cómo se usa cada módulo en producción
- qué casos de uso necesitan preservación extrema

### 10) Evidencia funcional adicional

- pruebas manuales actuales
- captura de pantallas del prototipo
- resultados esperados por caso de uso

## Conclusión

Antes de construir la nueva arquitectura, esta información debe quedar explícita para no perder funcionalidad ni inventar un comportamiento que el sistema actual no tiene.
