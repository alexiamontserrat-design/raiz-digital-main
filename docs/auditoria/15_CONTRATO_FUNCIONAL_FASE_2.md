# 15. Contrato funcional para Fase 2

## Objetivo

Esta lista recoge las funcionalidades que actualmente existen y que deben preservarse durante cualquier refactor o migración.

## Contrato mínimo

### Autenticación

- login con correo + contraseña
- sesión con `id_usuario` y `rol`
- redirección según rol

### Residentes

- búsqueda por ID o nombre
- selección de residente activo mediante sesión
- uso de `$_SESSION['id_residente']` como contexto global

### Enfermero

- buscar residentes
- seleccionar residente
- registrar signos vitales
- crear/editar/eliminar productos
- crear recetas
- cambiar estado de receta
- ver historial de recetas
- crear actividades
- confirmar/rechazar actividades
- gestionar avisos y notas del residente
- revisar alertas de reabastecimiento

### Familiar

- acceder al panel según familiar asociado al usuario
- listar residentes del familiar
- ver historial del residente
- ver inventario del residente
- ver gestión familiar
- crear notas
- confirmar la recepción de alerta

### Inventario

- almacenar productos por residente
- consultar productos
- actualizar cantidad
- eliminar producto
- crear producto con imagen

### Recetas

- guardar receta principal
- guardar detalle por medicamento
- consultar historial por residente
- cambiar estado activo/finalizado/cancelado

### Reabastecimiento

- calcular dosis diaria y consumo estimado
- calcular días restantes
- generar alertas por stock bajo o agotamiento

### Alertas

- alerta activa por producto
- estado `atendida` y `familiar_enterado`

### Gestión familiar

- actividades, notas y avisos por residente
- consulta por fecha

## Qué no se debe romper

Durante la Fase 2 no se debe perder la lógica funcional actual del sistema. Esto incluye especialmente:

- selección de residente
- sesión por usuario/rol
- relación residente → recetas → productos
- generación de alertas basadas en tratamiento
- flujo de actividades y avisos del familiar
- necesidad de contexto por `id_residente`

## Observación

Se debe considerar que este contrato está basado en evidencia del código actual, no en una especificación idealizada.
