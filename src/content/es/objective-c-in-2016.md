---
slug: "/objective-c-in-2016"
date: "2026-10-12"
title: "Por qué escribimos una app entera en Objective-C en 2016"
kicker: "Retrospectiva"
excerpt: "Swift llevaba dos años fuera y era la apuesta evidente. Elegimos el lenguaje viejo, y la razón no fue el miedo al cambio."
tags: [retrospectiva, ios, objective-c, swift, decisiones]
featuredImage: "/images/banners/objective-c-in-2016.svg"
---

Esto es de 2016, en mi primer trabajo, y complementa lo que conté sobre
[la marca blanca de aquella app](/blog/ios-white-label-2016).

## La decisión

Una app iOS nueva, desde cero, en 2016. Swift llevaba dos años publicado, Apple
empujaba fuerte y todas las charlas decían lo mismo. Escribimos la aplicación
entera en Objective-C y C.

Visto de lejos parece conservadurismo. Vista de cerca fue una decisión bastante
acotada.

## El motivo concreto

La app hablaba con cámaras IP a través de los SDK de sus fabricantes. Esos SDK
eran bibliotecas en C, con cabeceras en C, punteros, estructuras y callbacks que
devuelven datos en memoria que tú tienes que gestionar.

Objective-C es un superconjunto de C. Incluyes la cabecera y ya está: usas la
función, pasas el puntero y entiendes exactamente qué está pasando con la
memoria.

Swift también interopera con C, pero en 2016 interoperar significaba escribir
una capa de puente. Tipos como `UnsafeMutablePointer<UInt8>`, conversiones para
cada estructura, y cuidado especial con cualquier callback que el SDK invoque
desde su propio hilo. Esa capa es código que no aporta funcionalidad, hay que
mantener, y es exactamente donde aparecen los fallos de memoria que luego cuesta
semanas reproducir.

El cálculo fue: **el riesgo no está en el lenguaje de la app, está en la
frontera con el C.** Y la forma de minimizar esa frontera era no tenerla.

## El contexto que hoy se olvida

Hay dos cosas de 2016 que conviene recordar antes de juzgar la decisión.

**Swift aún rompía el código fuente entre versiones.** La migración de Swift 2 a
Swift 3, a finales de 2016, renombró buena parte de la biblioteca estándar y de
las APIs de Cocoa. Fue un trabajo real para proyectos existentes, con
herramientas de migración que acertaban casi siempre. Para un equipo pequeño con
una app en producción y veintitantas variantes que publicar, «casi siempre» no
es una buena palabra.

**No había estabilidad de ABI.** Llegó con Swift 5, en 2019. Hasta entonces cada
app embebía las bibliotecas del lenguaje en su propio binario, lo que engordaba
cada descarga. Con una app por distribuidor, eso se multiplicaba.

Ninguna de las dos cosas hacía a Swift una mala elección en general. Las dos
pesaban mucho en nuestro caso particular.

## Lo que perdimos

Conviene ser honesto, porque la decisión tuvo coste.

**Seguridad de tipos.** Los opcionales de Swift eliminan una categoría entera de
fallos. En Objective-C, mandar un mensaje a `nil` no explota —simplemente no
hace nada— y eso convierte errores ruidosos en comportamientos silenciosos y
raros.

**Legibilidad.** La sintaxis de Objective-C aleja a quien viene de otros
lenguajes. Incorporar a alguien costaba más.

**La dirección del ecosistema.** Cada año que pasaba, más bibliotecas salían
primero —o solo— en Swift, y más documentación nueva asumía Swift.

## Qué haría hoy

Lo mismo, pero al revés: Swift para todo y un módulo pequeño en Objective-C o en
C aislando el SDK del fabricante, con una interfaz limpia hacia arriba.

Eso es exactamente lo que no era práctico entonces y hoy es rutina. No porque la
idea fuera mala en 2016, sino porque las herramientas la han hecho barata: los
módulos de Swift, la interoperabilidad mejorada y la estabilidad del lenguaje
convierten lo que era una capa de puente frágil en una frontera normal.

## La parte que sigue sirviendo

La pregunta útil no era «¿qué lenguaje es mejor?». Era «¿dónde está el riesgo
de este proyecto en concreto?».

El riesgo estaba en la memoria y en los hilos del SDK de un tercero. Todo lo que
redujera esa frontera ganaba, y todo lo que la ensanchara perdía, por muy
moderno que fuese.

Las decisiones técnicas que envejecen bien casi nunca son las que eligieron lo
nuevo o lo viejo. Son las que identificaron correctamente dónde estaba el
problema.
