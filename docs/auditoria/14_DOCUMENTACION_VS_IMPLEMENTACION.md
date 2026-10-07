# 14. Documentación vs implementación

## 1. Contexto

La documentación funcional histórica institucional describe un sistema de gestión de residentes, familiares y enfermeros con un enfoque de control médico, historial, recetas, inventario y alertas. El código actual confirma gran parte de esa intención funcional, pero no todo en forma explícita.

## 2. Funcionalidades confirmadas por código

- login por rol
- sesión de usuario y residente
- identificar residente activo
- listar inventario por residente
- crear products
- crear/consultar recetas
- reabastecimiento con alertas
- actividades
- notas
- avisos
- historial de signos vitales

## 3. Funcionalidades documentadas pero no confirmadas de forma clara

### Rol administrativo

**Documentación**: menciona personal administrativo.

**Código**: `views/contexto_usuario.php` menciona `admin`, pero no se observó flujo funcional completo ni vista específica.

**Estado**: [INFERIDO / NO CONFIRMADO]

### Roles de residente

**Documentación**: a veces se menciona al residente como usuario final.

**Código**: el residente existe como entidad (`residentes`) y se usa como contexto, pero no se observa flujo de login/rol `residente` principal.

**Estado**: [INFERIDO]

### Módulos avanzados de control familiar

**Documentación**: sugiere notificaciones y seguimiento más avanzado.

**Código**: hay alertas, notas y confirmación de familiar, pero no un sistema formal de notificaciones multi-canal.

**Estado**: [PARCIALMENTE CONFIRMADO]

## 4. Diferencia clave

La documentación histórica no debe tomarse como schema exacto. El código actual es la fuente final de verdad para el proyecto actual. Las propuestas funcionales pueden indicar intención, pero no equivalen a implementación real.

## 5. Conclusión

La documentación histórica es útil como contexto de negocio, pero una auditoría técnica debe priorizar la evidencia del código. El sistema actual demuestra una intención funcional fuerte, pero su implementación está incompleta, acoplada y no formalizada.
