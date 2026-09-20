---
slug: "/promises-async-await"
date: "2026-02-24"
title: "Promesas y async/await: el modelo mental"
kicker: "JavaScript"
excerpt: "Una promesa no es una función que espera: es un objeto con estado. Entender eso arregla la mayoría de los bugs asíncronos."
tags: [javascript, promesas, async-await]
featuredImage: "/images/banners/promises-async-await.svg"
---

La mayoría de los errores con código asíncrono vienen de una idea equivocada: pensar que una promesa *hace* algo. No hace nada. Una promesa es un objeto con estado que representa un valor que todavía no está.

## Tres estados, una transición

Una promesa está en uno de tres estados: **pendiente**, **cumplida** o **rechazada**. La transición ocurre **una sola vez** y es irreversible.

```js
const p = new Promise((resolve, reject) => {
  setTimeout(() => resolve(42), 1000);
  setTimeout(() => resolve(99), 2000); // se ignora por completo
});
```

La segunda llamada a `resolve` no hace nada. La promesa ya resolvió. Esto es una garantía útil: quien consuma la promesa sabe que el callback se ejecutará como mucho una vez.

Y ojo con algo que sorprende: **el ejecutor se ejecuta de forma síncrona**.

```js
console.log("antes");
new Promise(() => console.log("dentro"));
console.log("después");
// antes, dentro, después
```

Lo asíncrono no es crear la promesa. Es el `.then`.

## `.then` devuelve una promesa nueva

Esta es la parte que hace que el encadenado funcione, y la que más se malinterpreta.

```js
fetchUser()
  .then((user) => user.id)        // devuelve una promesa de id
  .then((id) => fetchOrders(id))  // devuelve una promesa de pedidos
  .then((orders) => orders.length);
```

Cada `.then` crea una promesa nueva. Si el callback devuelve un valor, la nueva promesa se cumple con ese valor. Si devuelve una promesa, **se espera a esa promesa** antes de continuar. Si lanza, la nueva promesa se rechaza.

De ahí sale el error más común del encadenado: olvidar el `return`.

```js
// Mal: la cadena no espera a fetchOrders
.then((id) => { fetchOrders(id); })

// Bien
.then((id) => { return fetchOrders(id); })
.then((id) => fetchOrders(id))  // equivalente
```

Sin `return`, el callback devuelve `undefined`, la cadena continúa inmediatamente y el siguiente `.then` recibe `undefined` mientras la petición sigue en vuelo.

## `async/await` es la misma máquina

`async/await` no añade capacidades. Es azúcar sintáctico, y saberlo evita esperar magia.

- Una función `async` **siempre** devuelve una promesa, aunque hagas `return 1`.
- `await` no bloquea el hilo. Pausa *esa función*, devuelve el control al event loop, y programa el resto como microtarea.

```js
async function total() {
  const user = await fetchUser();
  const orders = await fetchOrders(user.id);
  return orders.length;
}
// equivale a la cadena de .then de arriba
```

La ganancia real es que `try/catch` vuelve a funcionar, y con él las variables intermedias:

```js
try {
  const user = await fetchUser();
  const orders = await fetchOrders(user.id);
  // aquí `user` sigue estando en ámbito, cosa que en .then cuesta
} catch (error) {
  // captura el rechazo de cualquiera de las dos
}
```

## El `await` secuencial que no debería serlo

El error de rendimiento más frecuente:

```js
// 600 ms: espera una, luego la otra
const user = await fetchUser();     // 300 ms
const config = await fetchConfig(); // 300 ms
```

Si `fetchConfig` no depende de `user`, estás esperando de más. Lánzalas a la vez:

```js
// 300 ms: ambas en vuelo
const [user, config] = await Promise.all([fetchUser(), fetchConfig()]);
```

La diferencia es *cuándo llamas a la función*, no dónde pones el `await`. `Promise.all` recibe promesas ya iniciadas.

Atención a la semántica: `Promise.all` **rechaza en cuanto una falla**, descartando el resto. Cuando quieras el resultado de todas pase lo que pase, usa `Promise.allSettled`:

```js
const results = await Promise.allSettled([a(), b(), c()]);
// [{status: "fulfilled", value}, {status: "rejected", reason}, ...]
```

Y para carreras: `Promise.race` resuelve con la primera que termine, sea éxito o fallo; `Promise.any` con la primera que **tenga éxito**.

## Rechazos sin capturar

Una promesa rechazada sin `catch` es un error silencioso en muchos entornos, y una excepción no capturada en Node moderno. Dos sitios donde se escapa:

```js
// El catch no cubre nada: el error ocurre después
try {
  setTimeout(() => { throw new Error("perdido"); }, 0);
} catch { }

// forEach no espera a nada
items.forEach(async (item) => {
  await save(item); // el rechazo no llega a ningún sitio
});

// En su lugar
await Promise.all(items.map((item) => save(item)));
```

`forEach` ignora el valor de retorno del callback, así que las promesas quedan huérfanas: ni se esperan ni se capturan sus errores.

## Lo que hay que llevarse

Una promesa es **un valor futuro**, no una tarea en ejecución. La tarea ya arrancó cuando llamaste a la función; la promesa sólo es el recibo. En cuanto piensas así, dos cosas se vuelven obvias: por qué `Promise.all` va más rápido —las tareas ya estaban en marcha— y por qué olvidar un `return` rompe la cadena —te has quedado con el recibo pero lo has tirado.
