---
slug: "/owasp-top-10-node-react"
date: "2026-04-14"
title: "OWASP Top 10 en una aplicación Node y React"
kicker: "Seguridad"
excerpt: "Las vulnerabilidades más comunes, con el código concreto que las introduce y el que las arregla."
tags: [seguridad, owasp, node, react]
featuredImage: "/images/banners/owasp-top-10-node-react.svg"
---

El OWASP Top 10 se lee muchas veces como una lista de conceptos abstractos. En una aplicación normal de Node y React, casi todas las categorías se concretan en unas pocas líneas de código muy reconocibles.

## A01 · Control de acceso roto

Es la categoría número uno por frecuencia, y casi siempre tiene la misma forma: el servidor comprueba **que estás autenticado** pero no **que ese recurso sea tuyo**.

```js
// Vulnerable: cualquiera autenticado lee cualquier pedido
app.get("/api/orders/:id", requireAuth, async (req, res) => {
  const order = await db.orders.findById(req.params.id);
  res.json(order);
});

// Corregido: la propiedad forma parte de la consulta
app.get("/api/orders/:id", requireAuth, async (req, res) => {
  const order = await db.orders.findOne({
    _id: req.params.id,
    userId: req.user.id,
  });
  if (!order) return res.sendStatus(404);
  res.json(order);
});
```

Devolver 404 y no 403 es deliberado: un 403 confirma que el recurso existe.

Y el corolario que se olvida: **ocultar un botón en el frontend no es control de acceso**. El cliente es territorio del atacante. Cualquier comprobación que importe tiene que estar en el servidor.

## A03 · Inyección

SQL, NoSQL y comandos del sistema, todos con la misma raíz: concatenar entrada del usuario dentro de algo que luego se interpreta.

```js
// Vulnerable
db.query(`SELECT * FROM users WHERE email = '${email}'`);

// Corregido: la consulta y los datos viajan por separado
db.query("SELECT * FROM users WHERE email = ?", [email]);
```

En MongoDB la inyección tiene una variante que sorprende, porque no hace falta ninguna cadena rara. Si el cuerpo llega como `{"password": {"$ne": null}}`, esto autentica a cualquiera:

```js
// Vulnerable
const user = await User.findOne({ email, password });

// Corregido: fuerza el tipo antes de consultar
const user = await User.findOne({
  email: String(email),
  password: String(password),
});
```

La defensa estructural es validar el esquema en el borde, con Zod o Joi, y rechazar lo que no encaje en lugar de intentar limpiarlo.

### XSS en React

React escapa el contenido por defecto, así que el XSS clásico no aplica. Quedan dos huecos:

```jsx
// 1. dangerouslySetInnerHTML — el nombre es la advertencia
<div dangerouslySetInnerHTML={{ __html: comment }} />
// Si tienes que renderizar HTML, sanitiza primero:
<div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(comment) }} />

// 2. URLs controladas por el usuario
<a href={userUrl}>Perfil</a>
// javascript:alert(1) ejecuta al hacer clic
```

Para el segundo caso, valida el protocolo:

```js
function safeUrl(value) {
  try {
    const url = new URL(value);
    return ["http:", "https:"].includes(url.protocol) ? url.href : "#";
  } catch {
    return "#";
  }
}
```

## A02 · Fallos criptográficos

Dos errores que siguen apareciendo: guardar contraseñas con un hash rápido, y comparar secretos con `===`.

```js
// Vulnerable: SHA-256 está diseñado para ser rápido, que es justo lo que no quieres
const hash = crypto.createHash("sha256").update(password).digest("hex");

// Corregido: un algoritmo con coste ajustable
const hash = await bcrypt.hash(password, 12);
const ok = await bcrypt.compare(password, hash);
```

`bcrypt.compare` además es de tiempo constante. Comparar tokens con `===` filtra información por el tiempo de respuesta; para eso está `crypto.timingSafeEqual`.

## A05 · Configuración insegura

Lo barato y efectivo, en tres líneas:

```js
import helmet from "helmet";
import rateLimit from "express-rate-limit";

app.disable("x-powered-by");            // deja de anunciar la pila
app.use(helmet());                       // cabeceras de seguridad
app.use("/api/auth", rateLimit({ windowMs: 15 * 60_000, max: 10 }));
```

El rate limit en los endpoints de autenticación es la diferencia entre una contraseña débil que aguanta y una que cae en una tarde de fuerza bruta.

Y `cors()` sin argumentos permite cualquier origen. Enumera los tuyos:

```js
app.use(cors({ origin: ["https://miapp.com"], credentials: true }));
```

## A07 · Fallos de identificación y autenticación

El debate eterno de dónde guardar el JWT tiene una respuesta razonable: en una cookie, no en `localStorage`.

```js
res.cookie("token", jwt, {
  httpOnly: true,   // JavaScript no puede leerla, así el XSS no la roba
  secure: true,     // sólo por HTTPS
  sameSite: "lax",  // mitiga CSRF
  maxAge: 3600_000,
});
```

`localStorage` es legible por cualquier script de la página, incluido el que entre por una dependencia comprometida. Con `httpOnly` la cookie deja de estar al alcance de JavaScript, a cambio de tener que pensar en CSRF — que es lo que resuelve `sameSite`.

## A06 · Componentes vulnerables

La categoría más fácil de atender y la más olvidada:

```bash
npm audit
npm audit fix
```

En este mismo sitio, el `npm audit` pasó de 39 vulnerabilidades a cero, y una de ellas venía de un `overrides` que fijaba una versión **vulnerable** de una dependencia transitiva. Merece la pena mirar qué hay en `overrides` antes de dar por bueno el resultado: una cadena de dependencias es tan segura como el pin más antiguo que alguien dejó ahí.

## Lo mínimo viable

Si sólo puedes hacer cinco cosas: valida la entrada con un esquema en el borde, incluye la propiedad del recurso en la consulta, `helmet` y rate limit en auth, cookies `httpOnly` y `sameSite`, y `npm audit` en CI. Cubre la mayor parte del riesgo real de una aplicación web normal, y todo cabe en una tarde.
