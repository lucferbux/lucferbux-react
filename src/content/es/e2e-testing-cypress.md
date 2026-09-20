---
slug: "/e2e-testing-cypress"
date: "2026-04-21"
title: "E2E con Cypress sin acabar odiando los tests"
kicker: "Testing"
excerpt: "Una suite E2E frágil es peor que no tener ninguna. La fragilidad casi siempre viene de las mismas cuatro decisiones."
tags: [testing, cypress, e2e]
featuredImage: "/images/banners/e2e-testing-cypress.svg"
---

Casi todos los equipos que conozco han tenido una suite E2E y la han abandonado. El patrón se repite: se escribe con ilusión, empieza a fallar de forma intermitente, alguien añade un `retry`, luego un `wait`, y a los seis meses está desactivada en CI «temporalmente».

La fragilidad no es inherente al E2E. Viene de cuatro decisiones concretas.

## 1 · Esperar tiempo en lugar de esperar estado

El pecado original.

```js
// Frágil: 500 ms es suficiente hasta que un día no lo es
cy.get("[data-cy=save]").click();
cy.wait(500);
cy.get("[data-cy=toast]").should("contain", "Guardado");
```

Cypress ya reintenta las aserciones hasta que se cumplen o expira el timeout. El `wait` no añade nada salvo lentitud y un fallo aleatorio cuando el CI va cargado.

```js
// Robusto: espera a la condición, no al reloj
cy.get("[data-cy=save]").click();
cy.contains("[data-cy=toast]", "Guardado").should("be.visible");
```

Cuando de verdad necesitas esperar a la red, espera a la **petición**, no a un número:

```js
cy.intercept("POST", "/api/projects").as("createProject");
cy.get("[data-cy=save]").click();
cy.wait("@createProject").its("response.statusCode").should("eq", 201);
```

## 2 · Selectores acoplados al diseño

`cy.get(".btn-primary")` funciona hasta que alguien renombra una clase de Tailwind. Un selector debe describir **qué es**, no cómo se pinta.

```js
// Se rompe con cualquier refactor de estilos
cy.get(".flex > div:nth-child(2) button.btn-primary");

// Sobrevive a los refactors
cy.get("[data-cy=project-save]");
```

Mi orden de preferencia: un rol accesible con su nombre cuando lo hay (`cy.contains("button", "Guardar")`), y `data-cy` cuando no. El atributo dedicado existe precisamente para que nadie lo cambie por motivos visuales.

## 3 · Tests que dependen unos de otros

El error de diseño más caro. Un test que crea un proyecto y otro que lo edita se convierten en un test de 400 líneas disfrazado de dos, y cuando el primero falla el segundo miente.

Cada test debe montar su propio estado, y montarlo por la vía rápida:

```js
beforeEach(() => {
  cy.task("db:seed");            // estado conocido
  cy.loginByApi("admin@test.dev"); // sin pasar por el formulario
  cy.visit("/admin/projects");
});
```

Ese `loginByApi` importa más de lo que parece. Si cada test atraviesa el formulario de login, estás probando el login cien veces y pagando su latencia cien veces. Pruébalo **una vez**, en su propio test, y en el resto entra por la puerta de servicio:

```js
Cypress.Commands.add("loginByApi", (email) => {
  cy.session(email, () => {
    cy.request("POST", "/api/auth/login", { email, password: Cypress.env("pw") })
      .its("body.token")
      .then((token) => window.localStorage.setItem("token", token));
  });
});
```

`cy.session` cachea el resultado entre tests, así que el coste se paga una vez por suite.

## 4 · Probarlo todo por aquí

Un E2E cuesta segundos; un unitario, milisegundos. Si pruebas cada validación de formulario end-to-end, acabas con una suite de cuarenta minutos que nadie espera.

La regla que uso: **E2E sólo para recorridos que atraviesan sistemas**. Iniciar sesión, crear algo y verlo en la lista, completar un pago, recuperar la contraseña. Cinco o seis recorridos bien elegidos detectan casi todo lo que detectaría una suite de doscientos, y tardan tres minutos.

Todo lo demás —permutaciones de validación, estados de error, formato— es más barato y más preciso una capa más abajo.

## Lo que sí compensa depurar

Dos capacidades de Cypress que cambian la relación con la herramienta:

**El time-travel del runner.** Cada comando queda registrado con un snapshot del DOM en ese instante. Cuando un test falla, no adivinas qué había en pantalla: lo ves.

**Los vídeos y capturas en CI.** Un fallo que sólo ocurre en el runner es imposible de arreglar a ciegas. Con el vídeo del intento fallido, suele resolverse en minutos.

```js
// cypress.config.js
export default defineConfig({
  video: true,
  screenshotOnRunFailure: true,
  retries: { runMode: 2, openMode: 0 },
});
```

Ese `retries` merece un matiz. Reintentar en CI oculta la intermitencia en lugar de arreglarla, y a la larga es deuda. Lo uso como red de seguridad mientras la suite madura, con la condición de mirar qué test está reintentando: si uno reintenta de forma sistemática, está roto, no es «flaky».

## El criterio de valor

Un E2E no está ahí para cubrir líneas. Está para responder una pregunta: *¿puede un usuario hacer lo que esta aplicación promete?* Si un test no contribuye a esa respuesta, probablemente pertenece a otra capa.
