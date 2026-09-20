---
slug: "/modular-frontend-architecture"
date: "2026-07-07"
title: "Arquitectura modular en el frontend: qué compensa y qué no"
kicker: "Arquitectura"
excerpt: "Los micro-frontends resuelven un problema organizativo, no técnico. Merece la pena tener claro cuál es antes de adoptarlos."
tags: [arquitectura, micro-frontends, react, kubernetes]
featuredImage: "/images/banners/modular-frontend-architecture.svg"
---

Un monolito de frontend no falla por razones técnicas. Falla cuando ocho equipos comparten un repositorio, un pipeline de release y una ventana de despliegue, y cualquiera de ellos puede bloquear a los demás. Si tu problema no es ese, los micro-frontends te van a costar más de lo que te den.

## La señal de que ha llegado el momento

Hay tres síntomas que aparecen juntos:

- Un test en verde de un equipo bloquea el despliegue de otro que no tocó nada.
- La cadencia de release la marca el equipo más lento, no el producto.
- Añadir una funcionalidad nueva requiere modificar código que no es tuyo.

Lo importante es que ninguno de los tres es un problema de rendimiento o de tamaño de bundle. Son problemas de **acoplamiento organizativo**, y la solución es aislar el ciclo de vida, no el código.

## Lo que hay que decidir primero

Antes de elegir herramienta, hay tres contratos que definen si esto va a funcionar.

**Cuándo se compone.** En build, cada módulo es un paquete npm: sencillo, con tipos compartidos, y con la pega de que publicar requiere rebuild del contenedor. En runtime (Module Federation, import maps) cada módulo se despliega solo, a costa de que los errores de integración aparecen en producción y no en CI.

La pregunta que decide es sencilla: *¿un equipo necesita desplegar sin coordinarse con los demás?* Si la respuesta es no, la composición en build es más barata en todos los sentidos.

**Qué es compartido.** Esto es lo que más problemas da. React, el router y el sistema de diseño tienen que ser *singletons*: dos copias de React en la misma página rompen los hooks, y dos routers compiten por la URL.

```js
// Module Federation: una sola instancia, compartida
shared: {
  react: { singleton: true, requiredVersion: "^18.3.0" },
  "react-dom": { singleton: true, requiredVersion: "^18.3.0" },
  "react-router-dom": { singleton: true },
}
```

Todo lo demás debería ser privado de cada módulo. La tentación de compartir utilidades para «no duplicar» es exactamente la que reintroduce el acoplamiento que estabas eliminando.

**Cómo se comunican.** La respuesta aburrida es la correcta: por la URL y por eventos, no por estado compartido. Un módulo que lee el store de otro es un monolito con más pasos.

## La librería compartida es el producto

Si hay una pieza que decide si esto escala, es la librería común. No por los componentes: por el andamiaje.

Cuando la librería aporta el enrutado, la autenticación, la obtención de datos y el manejo de errores, un módulo nuevo es un `package.json` y una ruta. Cuando no los aporta, cada equipo reimplementa su versión, salen ocho formas distintas de mostrar un error de red, y alguien del equipo de plataforma acaba en cada incorporación.

La medida real del éxito no es el número de módulos. Es **cuánta gente de plataforma hace falta para añadir uno**. Cuando esa cifra llega a cero, la arquitectura funciona.

## Lo que se paga

Conviene ser honesto sobre el coste, porque no es pequeño.

**El bundle crece.** Aunque compartas React, cada módulo trae sus propias dependencias. Sin un presupuesto de tamaño medido en CI, esto se degrada solo.

**Depurar cruza fronteras.** Un fallo visible en un módulo puede venir de la versión de la librería común que cargó otro. Los source maps y una versión visible en la UI dejan de ser un lujo.

**El versionado se vuelve real.** En un monolito, un cambio incompatible se arregla en el mismo commit. Con módulos desplegados por separado, tienes dos versiones conviviendo en producción y necesitas un periodo de compatibilidad.

**Hace falta contrato de tests.** Los tests unitarios de cada módulo no dicen nada sobre la integración. Hace falta una capa —tests de contrato, o un smoke end-to-end del contenedor con los módulos reales— que sí lo diga.

## El patrón que mejor ha funcionado

En la plataforma sobre la que trabajo, la combinación que ha resultado sostenible es:

- **Un contenedor delgado**: layout, autenticación, enrutado de primer nivel. Nada de lógica de negocio.
- **Módulos con su propio backend-for-frontend**, cada uno desplegado en su propio pod. Aislar el despliegue del frontend sin aislar el del backend deja el acoplamiento donde estaba.
- **Una librería común versionada** con el andamiaje, no sólo componentes.
- **Un operador de Kubernetes** que decide qué módulos existen en cada instalación, de modo que activar uno es un cambio de configuración y no un rebuild.

Esa última pieza es la que convierte «desplegamos juntos» en «se despliegan solos», y es también la que más tarda en construirse.

## La pregunta previa

Antes de todo esto: ¿cuántos equipos tocan hoy el frontend? Si la respuesta es uno o dos, un monolito bien estructurado —con fronteras claras por carpeta y una regla de lint que impida importar a través de ellas— te da casi todas las ventajas sin ninguno de los costes. Y si algún día hacen falta módulos de verdad, esas fronteras son exactamente por donde se corta.
