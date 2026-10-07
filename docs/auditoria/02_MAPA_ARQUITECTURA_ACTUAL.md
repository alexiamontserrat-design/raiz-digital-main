# 02. Mapa de arquitectura actual

## Arquitectura actual observada

La aplicación actual no tiene una separación clara entre capas. El código revela una arquitectura monolítica PHP con lógica de negocio, presentación y acceso a BD en el mismo nivel de abstracción.

## Diagrama textual real

```text
Usuario
  ↓
Navegador / HTML
  ↓
PHP scripts (login, paneles, CRUD, vistas)
  ↓
SQL directo con mysqli
  ↓
MySQL (base de datos: raizdigital)
  ↓
HTML renderizado / redirecciones / sesiones
```

## Qué está mezclado

### Presentación + lógica

Los archivos PHP no solo ejecutan consultas; también incluyen bloques HTML completos y CSS inline. Ejemplos:

- `panel_residente.php`
- `reabastecimiento.php`
- `historial_recetas.php`
- `views/panel_familiar_view.php`
- `views/gestion_view_enfermero.php`

### Negocio + acceso a datos

Cada archivo decide qué consultar y qué insertar. No existe servicio centralizado.

### Configuración + credenciales

Credenciales hardcodeadas en casi todos los archivos:

```php
$conexion = new mysqli("localhost", "root", "", "raizdigital");
```

### Autenticación + contexto

La sesión PHP es el mecanismo principal de identidad y contexto del usuario. Se usa como:

- `$_SESSION['id_usuario']`
- `$_SESSION['rol']`
- `$_SESSION['id_residente']`

## Capa funcional observada

### 1) Entrada y autenticación

- `login.php`
- `login.html`
- `registro.php`

### 2) Selección de contexto del residente

- `seleccionar_residente.php`
- `panel_enfermero_ingresar_residente.php`
- `panel_residente.php`
- `views/contexto_usuario.php`

### 3) Paneles por rol

- `panel_familiar.php`
- `panel_residente.php`
- `panel_enfermero.html`
- `views/panel_familiar_view.php`

### 4) Gestión de datos

- `crear_*`, `eliminar_*`, `actualizar_*`, `confirmar_*`, `guardar_*`

### 5) Vistas auxiliares

- `views/*.php`

## Nivel de acoplamiento

### Acoplado

- cada acción conoce la tabla exacta y la base de datos
- cada acción usa el mismo nombre de BD y host
- cada pantalla usa `$_SESSION` sin un contexto centralizado

### Duplicado

Se observa lógica repetida en:

- múltiples conexiones `new mysqli(...)`
- consultas similares por `id_residente`
- HTML repetido en varias vistas
- filtros por fecha duplicados

## Arquitectura funcional inferida

```text
Usuarios
 ├─ login / registro
 ├─ rol
 └─ sesión

Residentes
 ├─ selección
 ├─ panel
 └─ contexto por sesión

Operaciones por módulo
 ├─ inventario
 ├─ signos vitales
 ├─ recetas
 ├─ actividades
 ├─ notas
 ├─ avisos
 └─ alertas
```

## Diagnóstico

### [CONFIRMADO]

La aplicación actual está construida como un monolito PHP clásico.

### [CONFIRMADO]

No existe una API REST ni una capa separada de servicios.

### [CONFIRMADO]

La UI y la lógica están mezcladas.

### [INFERIDO]

La arquitectura responde a una necesidad de prototipo local más que a una solución modular.

### [NO ENCONTRADO]

No hubo evidencia de estructura tipo `src/`, `app/`, `api/`, `services/`, ni rutas organizadas por dominio.

## Implicaciones para Fase 2

Antes de migrar, se necesitará:

- mapear cada acción a un endpoint o caso de uso
- definir un modelo de dominio
- establecer un contrato de datos con el frontend
- separar autenticación de UI y negocio
- migrar la sesión a un sistema más seguro y compatible con React/Expo
