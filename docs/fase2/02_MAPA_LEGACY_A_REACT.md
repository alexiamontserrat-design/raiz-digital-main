# 02. Mapa Legacy → React

## MODELO RECONSTRUIDO A PARTIR DEL CÓDIGO LEGACY

Este documento mapea cada archivo funcional del sistema PHP legacy a su equivalente en la nueva arquitectura React + Node.

## Leyenda de Estado

- ✅ MIGRADO — funcionalidad completamente trasladada
- 🔄 EN PROGRESO — parcialmente implementado
- ⏳ PENDIENTE — planificado, no iniciado
- ❌ NO APLICA — archivo que no necesita equivalente directo

---

## 1. AUTENTICACIÓN Y REGISTRO

| Archivo Legacy | Función | Frontend (React) | Backend (API) | Estado |
|---|---|---|---|---|
| `login.html` | Vista de login | `pages/LoginPage.tsx` | — | ✅ |
| `login.php` | Lógica de login | — | `POST /api/auth/login` → `index.ts` | ✅ |
| `registro_view.html` | Vista de registro | `pages/LoginPage.tsx` | — | ✅ |
| `registro.php` | Lógica de registro | — | `POST /api/auth/register` → `index.ts` | ✅ |

---

## 2. PANELES Y NAVEGACIÓN

| Archivo Legacy | Función | Frontend (React) | Backend (API) | Estado |
|---|---|---|---|---|
| `panel_enfermero.html` | Panel principal enfermero | `pages/NurseDashboard.tsx` | `GET /api/residents` | ✅ |
| `views/panel_enfermero.php` | Include del panel enfermero | Integrado en `NurseDashboard.tsx` | — | ✅ |
| `panel_familiar.php` | Carga datos del familiar | `pages/FamilyDashboard.tsx` | `GET /api/residents/:id` | ✅ |
| `panel_familiar.html` | Vista del familiar con residentes | Integrado en `FamilyDashboard.tsx` | — | ✅ |
| `views/panel_familiar_view.php` | Vista listado residentes familiar | `pages/FamilyDashboard.tsx` | `GET /api/residents` | ✅ |
| `panel_residente.php` | Panel del residente seleccionado | `pages/ResidentDashboard.tsx` | `GET /api/residents/:id` | ✅ |
| `views/contexto_usuario.php` | Barra contexto usuario/residente | `components/Navbar.tsx` | `GET /api/auth/me` | ✅ |

---

## 3. SELECCIÓN DE RESIDENTE

| Archivo Legacy | Función | Frontend (React) | Backend (API) | Estado |
|---|---|---|---|---|
| `panel_enfermero_ingresar_residente.php` | Buscar/seleccionar residente | `pages/NurseDashboard.tsx` | `GET /api/residents?search=` | ✅ |
| `panel_enfermero_crear_residente.php` | Crear nuevo residente | `pages/NurseDashboard.tsx` (Modal) | `POST /api/residents` | ✅ |
| `seleccionar_residente.php` | Guardar residente en sesión | `context/ResidentContext.tsx` | — (lógica frontend) | ✅ |

---

## 4. SIGNOS VITALES

| Archivo Legacy | Función | Frontend (React) | Backend (API) | Estado |
|---|---|---|---|---|
| `signos_vitales.html` | Formulario signos vitales | `pages/VitalSignsPage.tsx` | — | ✅ |
| `signos_vitales.php` | INSERT + GET historial | — | `POST /api/residents/:id/vitals` + `GET /api/residents/:id/vitals` | ✅ |
| `historial_familiar.php` | Historial signos | `pages/VitalSignsPage.tsx` | `GET /api/residents/:id/vitals` | ✅ |
| `views/historial_familiar_view.php` | Vista historial | Integrado en `VitalSignsPage.tsx` | — | ✅ |

---

## 5. INVENTARIO

| Archivo Legacy | Función | Frontend (React) | Backend (API) | Estado |
|---|---|---|---|---|
| `inventario_enfermero.php` | Carga inventario (corregido filtro) | `pages/InventoryPage.tsx` | `GET /api/residents/:id/products` | ✅ |
| `inventario_familiar.php` | Inventario vista familiar | `pages/InventoryPage.tsx` | `GET /api/residents/:id/products` | ✅ |
| `views/inventario_view_enfermero.php` | Vista inventario enfermero | `pages/InventoryPage.tsx` | — | ✅ |
| `crear_producto.php` | Crear producto | — | `POST /api/residents/:id/products` | ✅ |
| `actualizar_cantidad.php` | +1 / -1 cantidad | — | `PATCH /api/residents/:id/products/:productId/quantity` | ✅ |

---

## 6. RECETAS MÉDICAS

| Archivo Legacy | Función | Frontend (React) | Backend (API) | Estado |
|---|---|---|---|---|
| `views/crear_receta.php` | Formulario crear receta | `pages/RecipesPage.tsx` | — | ✅ |
| `guardar_receta.php` | Guardar receta + detalle | — | `POST /api/residents/:id/recipes` | ✅ |
| `historial_recetas.php` | Historial de recetas con detalle | `pages/RecipesPage.tsx` | `GET /api/residents/:id/recipes` | ✅ |

---

## 7. REABASTECIMIENTO Y ALERTAS

| Archivo Legacy | Función | Frontend (React) | Backend (API) | Estado |
|---|---|---|---|---|
| `reabastecimiento.php` | Cálculo consumo + alertas | `pages/ReplenishmentPage.tsx` | `GET /api/residents/:id/alerts` | ✅ |
| `atender_alerta.php` | Marcar alerta atendida | — | `PATCH /api/residents/:id/alerts/:alertId/attend` | ✅ |
| `familiar_enterado.php` | Marcar familiar enterado | — | `PATCH /api/residents/:id/alerts/:alertId/acknowledge` | ✅ |
