# 11. Matriz de roles y permisos

## Matriz real observada

| Funcionalidad                   | Enfermero | Familiar | Administrativo | Residente | Evidencia                                             |
| ------------------------------- | --------- | -------- | -------------- | --------- | ----------------------------------------------------- |
| Login                           | ✅        | ✅       | ?              | ?         | `login.php`                                           |
| Registro general                | ✅        | ✅       | ?              | ?         | `registro.php`                                        |
| Buscar residente                | ✅        | ❌       | ?              | ❌        | `panel_enfermero_ingresar_residente.php`              |
| Seleccionar residente           | ✅        | ✅       | ?              | ?         | `seleccionar_residente.php`                           |
| Ver panel de residente          | ✅        | ✅       | ?              | ?         | `panel_residente.php`                                 |
| Añadir signos vitales           | ✅        | ❌       | ?              | ?         | `signos_vitales.php`                                  |
| Ver historial de signos vitales | ✅        | ✅       | ?              | ?         | `historial_familiar.php`                              |
| Crear producto                  | ✅        | ❌       | ?              | ?         | `crear_producto.php`                                  |
| Ver inventario                  | ✅        | ✅       | ?              | ?         | `inventario_enfermero.php`, `inventario_familiar.php` |
| Crear receta                    | ✅        | ❌       | ?              | ?         | `guardar_receta.php`                                  |
| Cambiar estado de receta        | ✅        | ❌       | ?              | ?         | `cambiar_estado_receta.php`                           |
| Ver historial de receta         | ✅        | ✅       | ?              | ?         | `historial_recetas.php`                               |
| Crear actividad                 | ✅        | ❌       | ?              | ?         | `crear_actividad.php`                                 |
| Confirmar actividad             | ✅        | ✅       | ?              | ?         | `confirmar_actividad.php`                             |
| Crear nota                      | ✅        | ✅       | ?              | ?         | `crear_nota.php`                                      |
| Eliminar nota                   | ✅        | ✅       | ?              | ?         | `eliminar_nota.php`                                   |
| Crear aviso                     | ✅        | ❌       | ?              | ?         | `crear_aviso.php`                                     |
| Eliminar aviso                  | ✅        | ❌       | ?              | ?         | `eliminar_aviso.php`                                  |
| Ver alertas de reabastecimiento | ✅        | ✅       | ?              | ?         | `reabastecimiento.php`, `gestion_view_enfermero.php`  |
| Marcar alerta como atendida     | ✅        | ❌       | ?              | ?         | `atender_alerta.php`                                  |
| Marcar alerta como enterada     | ✅        | ✅       | ?              | ?         | `familiar_enterado.php`                               |

## Observaciones clave

### [CONFIRMADO]

El sistema distingue claramente entre `enfermero` y `familiar`.

### [INFERIDO]

El rol `admin` aparece en `views/contexto_usuario.php`, pero no se observó un flujo funcional de administrador verificable y completo.

### [NO ENCONTRADO]

No se observó una entidad de permisos separada ni un sistema formal de roles por recurso.

### [CONTRADICCIÓN]

La documentación funcional histórica menciona más roles que los que se verifican claramente en el código actual. La auditoría no los confirma si no aparece implementación real.

## Conclusión

El sistema actual aplica permisos de manera práctica, por sesión y por `id_residente`, pero no de modo robusto ni declarativo. Esto debe documentarse como un punto crítico de la Fase 2.
