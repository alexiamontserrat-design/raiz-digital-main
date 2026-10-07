# 04. Autenticación y autorización

## 1. Cómo se autentica actualmente un usuario

### [CONFIRMADO]

La autenticación se realiza en `login.php`.

```php
$correo = $_POST['correo'];
$contrasena = $_POST['password'];
$sql = "SELECT * FROM usuarios WHERE correo = '$correo'";
```

Luego se hace una comparación directa:

```php
if ($usuario['contraseña'] == $contrasena) {
```

Esto significa que:

- no hay hash
- no hay `password_verify`
- no hay sal
- no hay validación mínima de contraseña
- no hay bloqueo por intentos

## 2. Cómo se identifica al usuario

### [CONFIRMADO]

Cuando el usuario es correcto se crea la sesión:

```php
$_SESSION['id_usuario'] = $usuario['id_usuario'];
$_SESSION['rol'] = $usuario['rol'];
```

## 3. Cómo se identifica el rol

### [CONFIRMADO]

El rol se guarda en `usuarios.rol` y se consulta con `$_SESSION['rol']`.

Ejemplo observado:

```php
if ($usuario['rol'] == "enfermero") {
    header("Location: panel_enfermero.html");
} else if ($usuario['rol'] == "familiar") {
    header("Location: panel_familiar.php");
}
```

### [INFERIDO]

El proyecto contempla un rol `admin` en `views/contexto_usuario.php`:

```php
if ($rolActual == 'enfermero' || $rolActual == 'admin')
```

Pero no se encontró evidencia suficiente del flujo administrativo en la lógica principal del sistema. Por tanto:

- `enfermero`: [CONFIRMADO]
- `familiar`: [CONFIRMADO]
- `admin`: [INFERIDO] desde `contexto_usuario.php`, pero no validado como flujo activo
- `residente`: [INFERIDO] posible, pero no confirmado como rol del sistema principal

## 4. Cómo se identifica al residente

### [CONFIRMADO]

El contexto del residente se guarda en sesión:

```php
$_SESSION['id_residente'] = $_GET['id_residente'];
```

en `seleccionar_residente.php` y también en `panel_enfermero_ingresar_residente.php`.

## 5. Cómo se mantiene ese contexto

### [CONFIRMADO]

Se usa `$_SESSION` como estado global del navegador para:

- usuario actual
- rol actual
- residente actual

### [CONFIRMADO]

Se recupera en múltiples archivos:

- `views/contexto_usuario.php`
- `panel_residente.php`
- `historial_familiar.php`
- `inventario_familiar.php`
- `gestion_familiar.php`
- `signos_vitales.php`

## 6. Qué páginas comprueban sesión

### [CONFIRMADO]

Se observa comprobación de sesión en varios archivos:

- `panel_familiar.php`
- `panel_residente.php`
- `signos_vitales.php`
- `crear_actividad.php`
- `crear_nota.php`
- `guardar_receta.php`
- `reabastecimiento.php`
- `panel_enfermero_ingresar_residente.php`

Ejemplo:

```php
if (!isset($_SESSION['id_usuario'])) {
    die(" No hay sesión");
}
```

## 7. Qué páginas comprueban rol

### [CONFIRMADO]

Hay comprobaciones parciales de rol en el flujo de selección y de redirección, pero no en todas las acciones.

Ejemplo:

```php
$rol = $_SESSION['rol'] ?? null;
if ($rol == "enfermero") { ... }
else if ($rol == "familiar") { ... }
```

### [CONTRADICCIÓN]

No se observa un mecanismo central de autorización por permisos. Hay decisiones de acceso dispersas y varias acciones activas sin comprobación del rol. Esto hace que el control real dependa más de la navegación y de la validación de sesión que de un modelo de permisos definido.

## 8. Qué acciones no comprueban rol

### [CONFIRMADO]

Muchas acciones parecen ejecutarse por ID y sin comprobar que el usuario actual tenga derecho a ese recurso.

Ejemplos:

- `eliminar_producto.php` usa `id_producto` directo
- `actualizar_cantidad.php` usa `id_producto` directo
- `confirmar_actividad.php` usa `id_actividad` directo
- `familiar_enterado.php` usa `id_alerta` directo
- `atender_alerta.php` usa `id_alerta` directo

No se observa un control previo como: "verificar que ese producto pertenece al residente actual" o "verificar que el usuario tiene permiso para ese residente".

## 9. Protección de páginas y acciones

### [CONFIRMADO]

Se protege parcialmente acceso a páginas con:

```php
if (!isset($_SESSION['id_usuario'])) { ... }
```

### [CONTRADICCIÓN]

La protección no es uniforme ni centralizada. Hay páginas con comprobación de sesión y otras que no la tienen o la realizan parcialmente.

## 10. Riesgos de autenticación y autorización

- comparación de contraseña directa
- ausencia de hashing
- SQL concatenado en login
- roles definidos solo por valor de sesión
- no hay autorización por recurso o residente
- posibilidad de manipular IDs por URL a otras entidades
- no hay logout explícito visible en la auditoría

## 11. Conclusión

La autenticación actual funciona como un prototipo local: identifica al usuario por sesión y por `rol`, pero no ofrece un modelo seguro ni robusto de autorización. La Fase 2 debe tratar esto como una prioridad crítica antes de todo refactor de frontend o backend.
