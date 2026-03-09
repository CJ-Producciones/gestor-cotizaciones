# Manual de Usuario — Gestor de Cotizaciones
## CJ Producciones

> **Versión del documento:** 1.0 | **Última actualización:** 2026-03-09
> **Nota para el desarrollador:** Los bloques `<!-- IMAGEN: descripción -->` indican dónde insertar capturas de pantalla.

---

## Tabla de Contenidos

1. [Acceso al Sistema](#1-acceso-al-sistema)
2. [Recuperar Contraseña](#2-recuperar-contraseña)
3. [Activar Cuenta por Invitación](#3-activar-cuenta-por-invitación)
4. [Navegación Principal](#4-navegación-principal)
5. [Historial de Cotizaciones](#5-historial-de-cotizaciones)
6. [Nueva Cotización](#6-nueva-cotización)
7. [Detalle de una Cotización](#7-detalle-de-una-cotización)
8. [Plantillas de Cotización](#8-plantillas-de-cotización)
9. [Configuración](#9-configuración)
   - [Perfil](#91-perfil)
   - [Cambiar Contraseña](#92-cambiar-contraseña)
   - [Usuarios e Invitaciones](#93-usuarios-e-invitaciones-solo-admin)
10. [Flujo Completo — Crear una Cotización desde Cero](#10-flujo-completo--crear-una-cotización-desde-cero)
11. [Flujo Completo — Crear una Cotización desde Plantilla](#11-flujo-completo--crear-una-cotización-desde-plantilla)
12. [Flujo Completo — Invitar un Nuevo Usuario](#12-flujo-completo--invitar-un-nuevo-usuario)
13. [Diferencias por Rol de Usuario](#13-diferencias-por-rol-de-usuario)

---

## 1. Acceso al Sistema

La pantalla de inicio de sesión es lo primero que ve el usuario al ingresar a la aplicación. Solo los usuarios registrados pueden acceder.

<!-- IMAGEN: Pantalla completa de Login con logo, campos y botón -->

### Elementos de la pantalla

| Elemento | Descripción |
|----------|-------------|
| **Logo CJ Producciones** | Identidad visual de la aplicación |
| **Título "Gestor de Cotizaciones"** | Nombre del sistema |
| **Campo "Correo electrónico"** | Ingresar el email registrado |
| **Campo "Contraseña"** | Ingresar la contraseña. El ícono del ojo a la derecha permite mostrar u ocultar el texto |
| **Botón "Iniciar Sesión"** | Confirma el acceso. Se deshabilita mientras carga |
| **Enlace "¿Olvidaste tu contraseña?"** | Despliega el formulario de recuperación |

### Pasos para iniciar sesión

1. Ingresar el **correo electrónico** en el primer campo.
2. Ingresar la **contraseña** en el segundo campo.
3. (Opcional) Hacer clic en el ícono del ojo para ver la contraseña en texto plano.
4. Hacer clic en el botón **"Iniciar Sesión"**.
5. Si los datos son correctos, el sistema redirige al **Historial de Cotizaciones**.

### Mensajes posibles

- `"¡Bienvenido!"` — Acceso exitoso.
- `"Credenciales incorrectas"` — El email o la contraseña no coinciden.
- `"Por favor completa todos los campos"` — Se dejó algún campo vacío.

---

## 2. Recuperar Contraseña

Si el usuario no recuerda su contraseña, puede solicitar un email de restablecimiento directamente desde la pantalla de login.

<!-- IMAGEN: Sección de recuperación desplegada debajo del botón de iniciar sesión -->

### Pasos

1. En la pantalla de **Login**, hacer clic en **"¿Olvidaste tu contraseña?"**.
2. Se despliega un formulario adicional con el campo **"Tu correo electrónico"**.
3. Ingresar el correo con el que está registrado.
4. Hacer clic en **"Enviar email de restablecimiento"**.
5. Revisar la bandeja de entrada y seguir el enlace recibido.

### Mensajes posibles

- `"Te enviamos un email para restablecer tu contraseña"` — El email fue enviado.
- `"Ingresá tu correo"` — Se dejó el campo vacío.

---

## 3. Activar Cuenta por Invitación

Cuando el administrador envía una invitación, el usuario nuevo recibe un email con un enlace especial. Al hacer clic en ese enlace, accede a la pantalla de activación de cuenta.

<!-- IMAGEN: Pantalla de aceptar invitación con los cuatro campos -->

### Elementos de la pantalla

| Elemento | Descripción |
|----------|-------------|
| **Campo "Nombre completo"** | El nombre con el que quedará registrado en el sistema |
| **Campo "Correo electrónico"** | Se muestra el email de la invitación, no es editable |
| **Campo "Contraseña"** | Crear la contraseña de acceso |
| **Campo "Confirmar contraseña"** | Repetir la contraseña para verificar |
| **Botón "Crear cuenta"** | Finaliza la configuración y accede al sistema |

### Requisitos de la contraseña

La contraseña debe cumplir:
- Mínimo **8 caracteres**
- Al menos **una letra mayúscula**
- Al menos **un número**
- Al menos **un carácter especial** (por ejemplo: `!`, `@`, `#`, `$`)

### Pasos

1. Abrir el email de invitación recibido.
2. Hacer clic en el enlace de invitación.
3. En la pantalla de activación, completar el campo **"Nombre completo"**.
4. Crear y confirmar una contraseña que cumpla los requisitos.
5. Hacer clic en **"Crear cuenta"**.
6. El sistema redirige al **Historial de Cotizaciones**.

> **Importante:** Si el enlace aparece como "inválido o expirado", contactar al administrador para que reenvíe la invitación.

---

## 4. Navegación Principal

Una vez dentro del sistema, la barra de navegación en la parte superior es el punto central para moverse entre secciones.

<!-- IMAGEN: Header completo mostrando logo, links de navegación, toggle de tema y avatar de usuario -->

### Elementos del header

| Elemento | Descripción | Acción |
|----------|-------------|--------|
| **Logo CJ Producciones** | En el extremo izquierdo | Clic → va al Historial de Cotizaciones |
| **"Plantillas"** | Link de navegación | Clic → abre la página de Plantillas |
| **"Nueva Cotización"** | Link de navegación | Clic → abre el formulario de nueva cotización |
| **"Historial"** | Link de navegación | Clic → abre el listado de todas las cotizaciones |
| **Ícono de tema** (sol/luna) | Botón en la derecha | Alterna entre modo claro y oscuro |
| **Avatar / email del usuario** | Botón en la derecha | Clic → abre el menú de cuenta |

### Menú de cuenta (clic sobre el avatar)

<!-- IMAGEN: Dropdown del menú de usuario abierto -->

| Opción | Descripción |
|--------|-------------|
| **Email del usuario** | Muestra el correo del usuario logueado (enlace al perfil) |
| **"Configuración"** | Accede a la sección de configuración |
| **"Cerrar Sesión"** | Cierra la sesión y redirige al Login |

### Navegación en móvil

En dispositivos móviles, los links de navegación se ocultan. En su lugar aparece el **ícono de menú (☰)** a la izquierda del logo.

<!-- IMAGEN: Header en móvil con botón de menú -->
<!-- IMAGEN: Panel lateral de navegación móvil abierto -->

Al hacer clic en el ícono ☰ se abre un panel lateral izquierdo con:
- Los mismos links: Plantillas, Nueva Cotización, Historial
- Los datos del usuario y accesos a Perfil, Configuración y Cerrar Sesión

---

## 5. Historial de Cotizaciones

Esta es la pantalla principal del sistema. Aquí se visualizan todas las cotizaciones guardadas.

**Ruta:** `/` (página de inicio luego del login)

<!-- IMAGEN: Pantalla completa del Historial con tabla, filtros y botón de nueva cotización -->

### Elementos de la pantalla

#### Encabezado

| Elemento | Descripción |
|----------|-------------|
| **Título "Historial de Cotizaciones"** | Nombre de la sección |
| **Botón "+ Nueva Cotización"** | Clic → navega al formulario de nueva cotización |

#### Panel de filtros

<!-- IMAGEN: Panel de filtros desplegado con los tres campos -->

| Filtro | Descripción |
|--------|-------------|
| **Filtro por cliente** | Desplegable con todos los clientes existentes. Seleccionar uno filtra las cotizaciones |
| **Fecha desde** | Campo de fecha. Filtra cotizaciones a partir de esa fecha |
| **Fecha hasta** | Campo de fecha. Filtra cotizaciones hasta esa fecha |
| **Botón "Limpiar filtros"** | Aparece solo cuando hay filtros activos. Clic → restablece todos los filtros |

> **Nota:** Si la "Fecha desde" es posterior a la "Fecha hasta", ambos campos se marcan en rojo con el mensaje `"La fecha hasta debe ser mayor a la fecha desde"`.

#### Tabla de cotizaciones

<!-- IMAGEN: Tabla con filas de cotizaciones -->

| Columna | Descripción |
|---------|-------------|
| **N° Cotización** | Número único asignado a la cotización |
| **Cliente** | Nombre del cliente o empresa |
| **Fecha** | Fecha de creación de la cotización |
| **Monto Total** | Valor total en pesos colombianos (COP) |
| **Ícono de eliminar** (solo admin) | Botón con papelera. Solo visible para administradores |

**Clic sobre una fila:** Abre el detalle de esa cotización en modo edición (carga los datos en `/nueva`).

> **Solo para administradores:** A la derecha de cada fila aparece un botón con ícono de papelera. Hacer clic inicia el proceso de eliminación.

#### Confirmación de eliminación

<!-- IMAGEN: Diálogo modal de confirmación de eliminación -->

Al hacer clic en eliminar una cotización, aparece un cuadro de diálogo con:
- El mensaje: `"¿Estás seguro de que quieres eliminar la cotización del cliente [nombre]? Esta acción no se puede deshacer."`
- **Botón "Cancelar"** → cierra el diálogo sin eliminar
- **Botón "Eliminar"** (rojo) → confirma y elimina definitivamente

#### Paginación

Cuando hay más de 10 cotizaciones, aparece la paginación al pie de la tabla.

<!-- IMAGEN: Barra de paginación con botones de página -->

| Elemento | Descripción |
|----------|-------------|
| **"Mostrando X–Y de Z resultados"** | Indica el rango visible |
| **Botón ‹** | Ir a la página anterior |
| **Números de página** | Hacer clic en cualquier número para ir a esa página directamente |
| **Botón ›** | Ir a la página siguiente |

#### Estado vacío

Si no hay cotizaciones creadas, la pantalla muestra un mensaje de bienvenida con el botón **"Crear primera cotización"**.

<!-- IMAGEN: Estado vacío con botón de crear primera cotización -->

---

## 6. Nueva Cotización

Pantalla para crear o editar una cotización. Está dividida en dos columnas: el formulario a la izquierda y la vista previa a la derecha.

**Ruta:** `/nueva`

<!-- IMAGEN: Vista completa de la página Nueva Cotización con ambas columnas -->

### Encabezado

| Elemento | Descripción |
|----------|-------------|
| **Título "Nueva Cotización"** | Nombre de la sección |
| **Botón "Limpiar"** (ícono de recarga) | Reinicia todos los campos del formulario a sus valores por defecto |

---

### Panel: Información de la cotización

<!-- IMAGEN: Panel de información con todos los campos -->

| Campo | Descripción | Obligatorio |
|-------|-------------|-------------|
| **Cliente / Empresa** | Nombre del cliente o razón social | Sí |
| **Evento** | Nombre del evento a cotizar | No |
| **Consideraciones** | Notas o condiciones del servicio, una por línea | No |
| **Descuento (%)** | Porcentaje de descuento a aplicar (0–100) | No |
| **IVA (%)** | Porcentaje de IVA. Por defecto es 19% | No |
| **Toggle IVA (On/Off)** | Activa o desactiva el IVA. Cuando está en Off, el campo se deshabilita y el IVA se pone en 0 | No |
| **Fecha** | Fecha de la cotización | No |
| **Encargado** | Nombre del responsable de la cotización | No |
| **Cargo** | Cargo del responsable | No |

---

### Panel: Servicios y Productos

<!-- IMAGEN: Panel de servicios con el selector y la tabla de productos disponibles -->

#### Selector de servicio

1. Hacer clic en el desplegable **"Seleccioná un servicio"**.
2. Elegir el servicio deseado de la lista.
3. La tabla de abajo se actualiza automáticamente con los productos de ese servicio.

#### Tabla "Productos disponibles"

| Elemento | Descripción |
|----------|-------------|
| **Nombre del producto** | Nombre y descripción del ítem |
| **Precio unitario** | Valor en COP |
| **Botón "+ Agregar"** | Agrega ese producto a la cotización. Desaparece cuando el producto ya fue agregado |
| **Botón "Agregar todos"** | Agrega todos los productos del servicio seleccionado de una vez |

> Los productos ya agregados aparecen con opacidad reducida y sin el botón de agregar.

#### Tabla "Productos en la cotización"

Una vez que hay al menos un producto agregado, aparece esta segunda tabla.

<!-- IMAGEN: Tabla de productos en la cotización con campo de cantidad y botón de eliminar -->

| Elemento | Descripción |
|----------|-------------|
| **Nombre del producto** | Descripción del ítem agregado |
| **Campo de cantidad** | Campo numérico editable. El mínimo es 1 |
| **Subtotal** | Se calcula automáticamente: cantidad × precio unitario |
| **Botón de eliminar** (papelera) | Quita ese producto de la cotización |

---

### Vista previa

<!-- IMAGEN: Vista previa de la cotización en el lado derecho -->

A la derecha del formulario se muestra en tiempo real cómo quedará el documento de la cotización con todos los datos ingresados. Se actualiza automáticamente al modificar cualquier campo.

---

### Botones de acción

<!-- IMAGEN: Barra de botones al pie de la vista previa -->

| Botón | Descripción |
|-------|-------------|
| **"Descargar Word"** | Genera y descarga el documento `.docx` de la cotización |
| **"Guardar Plantilla"** | Abre un diálogo para guardar la configuración actual como plantilla reutilizable |
| **"Guardar Cotización"** | Guarda la cotización en el historial del sistema |

#### Diálogo "Guardar como Plantilla"

<!-- IMAGEN: Modal de guardar plantilla con campos de nombre y descripción -->

| Campo | Descripción |
|-------|-------------|
| **Nombre** (obligatorio) | Nombre que identifica la plantilla, por ejemplo: "Evento Corporativo Estándar" |
| **Descripción** (opcional) | Breve descripción de para qué sirve la plantilla |
| **Botón "Cancelar"** | Cierra el diálogo sin guardar |
| **Botón "Guardar Plantilla"** | Confirma el guardado |

---

## 7. Detalle de una Cotización

Pantalla de solo lectura que muestra toda la información de una cotización guardada.

**Ruta:** `/cotizaciones/:id`
**Cómo acceder:** Hacer clic en cualquier fila del Historial de Cotizaciones.

<!-- IMAGEN: Pantalla de detalle de cotización con cards de información -->

### Elementos de la pantalla

#### Encabezado

| Elemento | Descripción |
|----------|-------------|
| **Botón "← Volver"** | Regresa a la pantalla anterior |
| **Botón "Crear cotización a partir de esta"** (ícono de copiar) | Carga todos los datos de esta cotización en el formulario de Nueva Cotización para editarla o duplicarla |

#### Card: Información general

<!-- IMAGEN: Card con los datos generales de la cotización -->

Muestra en una fila los campos:
- **Cliente**
- **Evento**
- **Fecha**
- **Descuento (%)**
- **Total** (resaltado en color primario)

#### Card: Productos incluidos

<!-- IMAGEN: Tabla de productos del detalle -->

Tabla con las columnas:
- **Producto** (con descripción en gris debajo si la tiene)
- **Servicio** al que pertenece
- **Cant.** (cantidad)
- **Precio** unitario
- **Subtotal**

#### Card: Consideraciones

Muestra las notas o condiciones de la cotización como lista con viñetas. Si no hay consideraciones, muestra el mensaje "No hay consideraciones."

---

## 8. Plantillas de Cotización

Biblioteca de configuraciones predefinidas que agilizan la creación de nuevas cotizaciones.

**Ruta:** `/plantillas`

<!-- IMAGEN: Pantalla de plantillas con grilla de tarjetas -->

### Elementos de la pantalla

#### Encabezado

| Elemento | Descripción |
|----------|-------------|
| **Título "Plantillas de Cotización"** | Nombre de la sección |
| **Botón "+ Nueva Cotización"** | Navega directamente al formulario de nueva cotización |

#### Grilla de plantillas

<!-- IMAGEN: Tarjetas de plantillas con nombre, productos y acciones -->

Cada tarjeta muestra:

| Elemento | Descripción |
|----------|-------------|
| **Ícono y nombre** | Identifica la plantilla |
| **Descripción** | Breve descripción de la plantilla (si tiene) |
| **Badge de descuento** | Aparece si la plantilla tiene un descuento configurado, por ejemplo `-15%` |
| **Lista "Incluye"** | Primeros 3 productos de la plantilla. Si hay más, muestra `+N más` |
| **Precio base** | Suma de todos los productos de la plantilla |
| **Autor** | Usuario que creó la plantilla |
| **"Usar plantilla →"** | Aparece al pasar el mouse. Clic en la tarjeta → carga la plantilla en el formulario de Nueva Cotización |
| **Botón de editar** (lápiz) | Abre el diálogo para renombrar la plantilla |
| **Botón de eliminar** (papelera) | Inicia el proceso de eliminación |

#### Diálogo "Editar Plantilla"

<!-- IMAGEN: Modal de edición de plantilla -->

| Campo | Descripción |
|-------|-------------|
| **Nombre** (obligatorio) | Nuevo nombre para la plantilla |
| **Descripción** (opcional) | Nueva descripción |
| **Botón "Cancelar"** | Cierra sin guardar |
| **Botón "Guardar Cambios"** | Confirma la edición |

#### Diálogo "Eliminar Plantilla"

<!-- IMAGEN: Modal de confirmación de eliminación de plantilla -->

Muestra el mensaje `"¿Estás seguro de que querés eliminar la plantilla [nombre]? Esta acción no se puede deshacer."` con opciones:
- **Botón "Cancelar"** → cierra sin eliminar
- **Botón "Eliminar"** (rojo) → elimina definitivamente

#### Estado vacío

Si no hay plantillas, la pantalla muestra el mensaje "No hay plantillas guardadas" con el botón **"Crear Nueva Cotización"**.

<!-- IMAGEN: Estado vacío de plantillas -->

---

## 9. Configuración

Sección de ajustes del sistema, accesible desde el menú de usuario en el header.

**Ruta:** `/configuracion`

La página se divide en dos partes:
- **Sidebar izquierdo** con las opciones de navegación
- **Área de contenido** a la derecha que cambia según la opción seleccionada

<!-- IMAGEN: Layout de configuración con sidebar y contenido -->

### Sidebar de configuración

| Sección (grupo) | Opción | Visible para |
|-----------------|--------|-------------|
| **Usuarios** | Perfil | Admin y Empleado |
| **Usuarios** | Usuarios | Solo Admin |
| **Configuración** | Productos | Solo Admin |
| **Configuración** | Servicios | Solo Admin |

> En móvil, el sidebar se oculta y aparece un botón para abrirlo como panel deslizante.

---

### 9.1. Perfil

**Ruta:** `/configuracion/perfil`

Muestra y permite actualizar la información personal del usuario autenticado.

<!-- IMAGEN: Card de perfil con campos nombre, email y rol -->

#### Card "Perfil"

| Campo | Descripción |
|-------|-------------|
| **Nombre** | Nombre de usuario registrado (editable) |
| **Email** | Correo electrónico (no editable) |
| **Rol** | Rol asignado en el sistema (no editable) |
| **Botón "Guardar"** | Guarda los cambios del perfil |

---

### 9.2. Cambiar Contraseña

En la misma página de Perfil, más abajo, aparece el formulario para cambiar la contraseña.

<!-- IMAGEN: Card de cambio de contraseña con los tres campos -->

| Campo | Descripción |
|-------|-------------|
| **Contraseña actual** | La contraseña vigente (ícono del ojo para mostrar/ocultar) |
| **Nueva contraseña** | La nueva contraseña que se desea establecer |
| **Confirmar nueva contraseña** | Repetir la nueva contraseña para verificar |
| **Botón "Cambiar contraseña"** | Valida y actualiza la contraseña |

**Requisitos de la nueva contraseña:**
- Mínimo 8 caracteres
- Al menos una mayúscula
- Al menos un número
- Al menos un carácter especial

---

### 9.3. Usuarios e Invitaciones _(solo Admin)_

**Ruta:** `/configuracion/usuarios`

Panel de gestión de accesos al sistema. Organizado en tres pestañas.

<!-- IMAGEN: Panel de usuarios con las tres pestañas -->

#### Pestaña "Usuarios"

<!-- IMAGEN: Tabla de usuarios activos -->

Tabla con todos los usuarios registrados:

| Columna | Descripción |
|---------|-------------|
| **Nombre** | Nombre del usuario |
| **Email** | Correo electrónico |
| **Rol** | Badge con el rol asignado (Admin o Empleado) |
| **Botón eliminar** (papelera) | Elimina al usuario. No aparece sobre la propia cuenta del administrador |

Al hacer clic en eliminar, aparece un diálogo de confirmación:
`"¿Estás seguro de que querés eliminar a [email]? Esta acción no se puede deshacer y el usuario perderá el acceso al sistema."`

<!-- IMAGEN: Modal de confirmación de eliminación de usuario -->

#### Pestaña "Invitar"

<!-- IMAGEN: Formulario de invitación -->

Formulario para agregar nuevos usuarios al sistema:

| Campo | Descripción |
|-------|-------------|
| **Correo electrónico** | Email del nuevo usuario a invitar |
| **Rol** | Seleccionar entre "Admin" o "Empleado" |
| **Botón "Enviar invitación"** | Envía el email de invitación |

> El sistema no permite enviar una invitación a un email que ya tiene una invitación pendiente. En ese caso, usar el botón de reenvío en la pestaña "Invitaciones".

#### Pestaña "Invitaciones"

<!-- IMAGEN: Tabla de invitaciones enviadas con estados -->

Historial de todas las invitaciones enviadas:

| Columna | Descripción |
|---------|-------------|
| **Email** | Destinatario de la invitación |
| **Rol** | Rol asignado |
| **Enviada** | Fecha de envío |
| **Estado** | `Pendiente` (amarillo), `Aceptada` (verde) o `Expirada` (rojo) |
| **Botón de reenvío** (ícono de recarga) | Solo aparece en invitaciones no aceptadas. Reenvía el email de invitación |

---

## 10. Flujo Completo — Crear una Cotización desde Cero

Este es el flujo más habitual del sistema.

```
Login
  → Historial de Cotizaciones (pantalla principal)
    → Clic en "+ Nueva Cotización"
      → Completar panel "Información de la cotización"
          • Nombre del cliente (obligatorio)
          • Evento, consideraciones, descuento, IVA, fecha, encargado, cargo
        → Seleccionar un servicio en el desplegable
          → Agregar productos uno a uno (botón "+ Agregar")
            o todos juntos (botón "Agregar todos")
          → Ajustar cantidades en la tabla "Productos en la cotización"
          → Verificar la vista previa en tiempo real
        → Elegir acción:
          • "Guardar Cotización" → queda registrada en el historial
          • "Descargar Word" → descarga el documento .docx
          • "Guardar Plantilla" → abre diálogo para guardarla como plantilla
```

---

## 11. Flujo Completo — Crear una Cotización desde Plantilla

Flujo para usar una configuración existente como base.

```
Login
  → Clic en "Plantillas" en la barra de navegación
    → Ver la grilla de plantillas disponibles
      → Clic en la tarjeta de la plantilla deseada
        → Se carga la pantalla Nueva Cotización con los datos de la plantilla prellenados
          → Modificar el cliente, evento, fechas o productos según corresponda
          → Ajustar cantidades si es necesario
          → Verificar la vista previa
          → Hacer clic en "Guardar Cotización"
```

---

## 12. Flujo Completo — Invitar un Nuevo Usuario

Solo disponible para administradores.

```
Login (con cuenta Admin)
  → Clic en el avatar de usuario (esquina superior derecha)
    → Clic en "Configuración"
      → En el sidebar izquierdo, clic en "Usuarios"
        → Clic en la pestaña "Invitar"
          → Ingresar el correo electrónico del nuevo usuario
          → Seleccionar el rol: Admin o Empleado
          → Clic en "Enviar invitación"
            → El nuevo usuario recibe un email con un enlace
              → El usuario hace clic en el enlace del email
                → Completa la pantalla "Crear cuenta":
                    • Nombre completo
                    • Contraseña (cumpliendo los requisitos)
                    • Confirmación de contraseña
                  → Clic en "Crear cuenta"
                    → Accede al sistema automáticamente
```

Para verificar el estado de la invitación:
```
Configuración → Usuarios → pestaña "Invitaciones"
  → Ver columna "Estado": Pendiente / Aceptada / Expirada
  → Si expiró: clic en el botón de reenvío (ícono de recarga) en la fila correspondiente
```

---

## 13. Diferencias por Rol de Usuario

El sistema tiene dos roles con permisos diferentes:

| Funcionalidad | Admin | Empleado |
|---------------|:-----:|:--------:|
| Ver historial de cotizaciones | ✅ | ✅ |
| Crear cotizaciones | ✅ | ✅ |
| Descargar Word | ✅ | ✅ |
| Guardar plantillas | ✅ | ✅ |
| Ver plantillas | ✅ | ✅ |
| Editar plantillas | ✅ | ✅ |
| **Eliminar cotizaciones** | ✅ | ❌ |
| **Eliminar plantillas** | ✅ | ✅ |
| Ver y editar perfil propio | ✅ | ✅ |
| Cambiar propia contraseña | ✅ | ✅ |
| **Gestionar usuarios** | ✅ | ❌ |
| **Enviar invitaciones** | ✅ | ❌ |
| **Sección Configuración > Usuarios** | ✅ | ❌ |
| **Sección Configuración > Productos** | ✅ | ❌ |
| **Sección Configuración > Servicios** | ✅ | ❌ |

---

*Fin del Manual de Usuario — Gestor de Cotizaciones CJ Producciones*
