---
slug: "/bff-per-module-go"
date: "2026-10-12"
title: "Un BFF por módulo, escrito en Go"
kicker: "Arquitectura"
excerpt: "Si cada módulo de una consola habla con Kubernetes desde el navegador, acabas repartiendo permisos que no deberías. Un backend por módulo cambia esa conversación."
tags: [go, bff, kubernetes, arquitectura, seguridad]
featuredImage: "/images/banners/bff-per-module-go.svg"
---

Esto describe el patrón que usamos durante 2025 y que está documentado en
abierto en [`mod-arch-library`](https://github.com/opendatahub-io/mod-arch-library).

## Por qué un backend si ya tienes una API

La tentación, cuando construyes una consola sobre Kubernetes, es hablar con la
API del clúster directamente desde el navegador. Existe, es REST, tiene
autenticación. ¿Para qué meter un servicio en medio?

Por tres razones que aparecen todas a la vez:

**Los permisos.** Para que el navegador liste unos recursos, el token del
usuario tiene que poder listarlos. Eso significa dar permisos sobre objetos del
clúster a cualquiera que abra la consola, y esos permisos no se pueden acotar a
«solo para pintar esta tabla».

**La forma de los datos.** Una pantalla casi nunca se corresponde con un
recurso. Una vista de un modelo necesita el objeto, su despliegue, su estado y
dos o tres cosas más. Hacer cinco peticiones desde el navegador y juntarlas allí
es lento y frágil.

**Lo que se filtra.** La respuesta de la API lleva campos que el usuario no
necesita y a veces no debería ver. Filtrar en el cliente es filtrar después de
haberlo enviado.

Un BFF —*backend for frontend*— es un servicio pequeño cuyo único cliente es una
interfaz concreta. No es una API de propósito general: es el backend de esa
pantalla.

## La pieza central: un cliente por usuario

Esta es la decisión que más define el diseño, y la que más se hace mal.

El BFF **no** tiene una cuenta de servicio con permisos amplios con la que
atiende a todo el mundo. Cada petición llega con el token del usuario, y el BFF
construye con ese token un cliente de Kubernetes efímero para esa petición:

```go
func (a *App) clientFor(r *http.Request) (client.Client, error) {
    token := bearerToken(r)
    if token == "" {
        return nil, errNoIdentity
    }
    cfg := rest.CopyConfig(a.baseConfig)
    cfg.BearerToken = token
    cfg.BearerTokenFile = ""   // si no, el fichero gana sobre el token
    return client.New(cfg, client.Options{Scheme: a.scheme})
}
```

La consecuencia es la que importa: **el BFF no puede hacer nada que el usuario
no pudiera hacer por su cuenta.** Si no tiene permiso para leer un recurso, la
petición falla en el servidor de la API, no en una comprobación nuestra. No
estamos implementando autorización; estamos dejando que la implemente quien ya
la tiene.

Ese `BearerTokenFile = ""` de la cuarta línea es un detalle que cuesta una tarde
descubrir: si el pod tiene montado el token de su cuenta de servicio y no lo
borras explícitamente de la copia de la configuración, el cliente usa el fichero
y te encuentras atendiendo peticiones con los permisos del pod. Es decir,
exactamente lo que querías evitar, y funcionando aparentemente bien.

## El `App` como contenedor de dependencias

Go no trae inyección de dependencias y tampoco hace falta. Una estructura con lo
que el servicio necesita, construida en el arranque, llega:

```go
type App struct {
    config     Config
    logger     *slog.Logger
    baseConfig *rest.Config
    repos      Repositories   // interfaces, no implementaciones
}
```

Que `repos` sean interfaces es lo que permite levantar el servicio en modo
simulado, sin clúster, con datos de mentira. Eso no es un lujo para los tests:
es lo que permite que alguien del equipo de interfaz trabaje en su portátil sin
tener que provisionar nada.

## Middleware por niveles

Rutas distintas necesitan garantías distintas, y conviene que eso se lea en el
enrutado y no dentro de cada manejador:

```go
router.GET("/healthcheck",            app.public(app.HealthHandler))
router.GET("/api/v1/models",          app.secure(app.ListModelsHandler))
router.POST("/api/v1/settings",       app.admin(app.UpdateSettingsHandler))
```

`public` no pide identidad. `secure` exige un token válido y construye el
cliente del usuario. `admin` además comprueba pertenencia al grupo
administrador. Son tres envoltorios de pocas líneas, y su valor no es técnico:
es que al leer el fichero de rutas ves el nivel de acceso de cada endpoint sin
abrir nada más.

## Un sobre para las respuestas

Todas las respuestas van envueltas:

```go
type Envelope[T any] struct {
    Data  T      `json:"data"`
    Error *Error `json:"error,omitempty"`
}
```

Parece ceremonia y ahorra discusiones. El cliente tiene una única forma de
distinguir éxito de error, y añadir metadatos —paginación, avisos— más adelante
no rompe a nadie.

## Lo que costó

**Un BFF por módulo son muchos BFF.** Diez módulos son diez servicios, diez
despliegues, diez imágenes que parchear cuando sale un CVE de Go. La librería
compartida existe por eso: sin ella, cada equipo reinventa el middleware y la
mitad lo hace mal.

**El modo simulado se degrada si no se usa.** Si la ruta de datos falsos no está
en la integración continua, deja de funcionar en un mes y nadie se entera hasta
que un compañero nuevo intenta arrancar el proyecto.

Si tuviera que quedarme con una idea: el BFF no está ahí para añadir lógica.
Está para que el navegador no tenga que tener permisos.
