# 17. Recomendaciones de migración (sin implementar)

## 1. Orden conceptual recomendado para la Fase 2

### FASE 2A — Base de datos y configuración

- definir schema real y migraciones
- separar configuración de entorno
- quitar credenciales hardcodeadas
- documentar tablas y relaciones

### FASE 2B — Seguridad y autenticación

- reemplazar comparación directa de contraseñas
- definir estrategia de autenticación segura
- centralizar permisos por rol
- verificar acceso por `id_residente`

### FASE 2C — API

- exponer endpoints por módulo
- definir contratos de entrada/salida
- convertir operaciones actuales en API con validación

### FASE 2D — Migración progresiva de lógica

- mover lógica de negocio a servicios
- mantener compatibilidad con flujo principal
- conservar nombres y comportamiento funcional

### FASE 2E — Frontend web / React

- consumir API con React
- separar datos de presentación
- mantener el flujo del residente como eje central

### FASE 2F — React Native / Expo (si aplica)

- reutilizar misma API
- separar autenticación y contexto del residente en client móvil
- mantener la lógica de negocio del backend como fuente de verdad

## 2. Recomendación estratégica

La migración debe comenzar por el dominio de negocio y la base de datos. No conviene arrancar refactorizando la UI sin antes decidir:

- qué es un usuario
- qué es un residente
- cómo se autentica
- qué permisos tiene cada rol
- qué reglas de negocio se conservan

## 3. Recomendación segura

La mejor estrategia para este proyecto es:

- preservar los módulos actuales como baseline funcional
- documentar cada flujo de negocio
- mapear cada flujo a endpoints
- migrar de a poco, no reemplazar todo a la vez

## 4. Conclusión

El proyecto actual ya tiene una base funcional útil; lo que falta es estructurarla. La migración no debería “reimaginar” el sistema, sino traducir la lógica existente a una arquitectura segura y mantenible.
