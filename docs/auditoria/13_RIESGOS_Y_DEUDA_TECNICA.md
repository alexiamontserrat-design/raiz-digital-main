# 13. Riesgos y deuda técnica

## 1. Riesgos de seguridad

| ID     | Problema                                | Archivo                                            | Severidad | Impacto                      |
| ------ | --------------------------------------- | -------------------------------------------------- | --------- | ---------------------------- |
| SEG-01 | SQL concatenado en consultas            | todos los `*.php` con `mysqli`                     | CRÍTICO   | inyección SQL                |
| SEG-02 | contraseñas sin hash                    | `login.php`, `registro.php`                        | CRÍTICO   | compromiso de credenciales   |
| SEG-03 | acceso directo por `id_residente`       | `seleccionar_residente.php`, `panel_residente.php` | ALTO      | acceso cruzado a información |
| SEG-04 | ausencia de control central de permisos | múltiples archivos                                 | ALTO      | autorización débil           |
| SEG-05 | sesiones sin renovación/TTL explícitos  | varios archivos                                    | MEDIO     | riesgo de sesión prolongada  |
| SEG-06 | validación insuficiente de formularios  | varios archivos                                    | ALTO      | entrada inválida             |

## 2. Riesgos de arquitectura

- monolito PHP acoplado
- lógica de negocio y UI mezcladas
- duplicación de consultas
- conexiones repetidas a MySQL
- no existe servicio ni API
- no existe patrón de repositorio o capa de dominio

## 3. Riesgos de datos

- faltan constraints y migraciones
- no hay normalización formal en schema
- no hay integridad referencial explícita
- no hay validación de fechas ni de rangos
- no hay histórico/versionado de cambios de entidades

## 4. Duplicación observada

### Crítica

- múltiples conexiones repetidas a la misma BD
- consultas por `id_residente` repetidas
- HTML/CSS embebidos duplicados en varios archivos

### Media

- vistas para enfermero y familiar muy parecidas
- dos paneles/cargadores de gestión similares

## 5. Deuda técnica observable

- no hay configuración por entorno
- no hay pruebas automatizadas
- no hay documentacion técnica del schema
- no hay log de errores ni monitoreo
- no hay manejo estructurado de excepciones
- no hay API

## 6. Riesgos para la Fase 2

La migración a React/Expo o a una nueva arquitectura sin resolver estos riesgos puede causar:

- ruptura funcional
- fuga de información
- cambios no previstos en permisos
- inconsistencias en historial y recetas

## 7. Estado de estos riesgos

Todos los riesgos anteriores están marcados como pendientes para la Fase 2. No se corrigen en esta auditoría.
