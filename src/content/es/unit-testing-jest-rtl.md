---
slug: "/unit-testing-jest-rtl"
date: "2026-03-24"
title: "Testing unitario que no se rompe al refactorizar"
kicker: "Testing"
excerpt: "La diferencia entre un test que protege y uno que estorba está en qué decides observar."
tags: [testing, jest, react-testing-library]
featuredImage: "/images/banners/unit-testing-jest-rtl.svg"
---

Casi todo el mundo que se queja de que «los tests frenan» tiene la misma suite: tests acoplados a la implementación. Se rompen cuando renombras una función interna, y no se enteran cuando el botón deja de funcionar. Es el peor de los dos mundos.

## La regla que lo cambia todo

> Cuanto más se parezcan tus tests a cómo se usa el software, más confianza te darán.

Es el principio de Testing Library, y no es una frase motivacional: tiene una consecuencia operativa directa. Prueba **lo que el usuario observa**, no cómo está construido.

Un ejemplo. Este componente muestra una lista y permite filtrarla:

```tsx
export function UserList({ users }: { users: User[] }) {
  const [query, setQuery] = useState("");
  const visible = users.filter((u) =>
    u.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <>
      <label htmlFor="q">Buscar</label>
      <input id="q" value={query} onChange={(e) => setQuery(e.target.value)} />
      <ul>
        {visible.map((u) => <li key={u.id}>{u.name}</li>)}
      </ul>
    </>
  );
}
```

El test malo mira el estado:

```tsx
// No hagas esto
const { result } = renderHook(() => useState(""));
expect(result.current[0]).toBe("");
```

El test bueno hace lo que haría una persona:

```tsx
it("filtra por nombre", async () => {
  const user = userEvent.setup();
  render(<UserList users={[{id:"1",name:"Ana"},{id:"2",name:"Luis"}]} />);

  await user.type(screen.getByLabelText("Buscar"), "an");

  expect(screen.getByText("Ana")).toBeInTheDocument();
  expect(screen.queryByText("Luis")).not.toBeInTheDocument();
});
```

Si mañana cambias `useState` por `useReducer`, o mueves el filtrado a un hook, este test sigue pasando. Y si rompes el filtrado, falla. Eso es exactamente lo que quieres de un test.

## `getBy`, `queryBy`, `findBy`

Las tres familias de consultas no son intercambiables y elegir mal produce tests que fallan de forma confusa:

- **`getBy`** — lo espero ahora y debe existir. Lanza si no lo encuentra, con un volcado del DOM muy útil.
- **`queryBy`** — puede no existir. Devuelve `null`. **Es el único válido para afirmar ausencia.**
- **`findBy`** — aparecerá pronto. Devuelve una promesa y reintenta. Para todo lo asíncrono.

```tsx
expect(screen.queryByText("Error")).not.toBeInTheDocument();   // bien
expect(screen.getByText("Error")).not.toBeInTheDocument();     // nunca pasa: getBy ya lanzó

expect(await screen.findByText("Guardado")).toBeInTheDocument(); // tras una petición
```

## El orden de prioridad de las consultas

Testing Library ordena sus consultas a propósito, y ese orden es una herramienta de accesibilidad disfrazada de API de testing:

1. `getByRole` — lo que usa un lector de pantalla. `getByRole("button", { name: /guardar/i })`.
2. `getByLabelText` — para campos de formulario.
3. `getByText` — para contenido no interactivo.
4. `getByTestId` — último recurso.

Cuando no consigues seleccionar un botón por su rol y su nombre accesible, el test te está diciendo que ese botón tampoco es alcanzable para alguien con un lector de pantalla. Arreglar el test arregla la accesibilidad. Por eso `getByTestId` es una derrota pequeña: funciona, pero has silenciado la señal.

## Qué mockear y qué no

La regla que uso: **mockea la frontera del sistema, no las piezas de dentro**.

```tsx
// Bien: la red es una frontera
vi.mock("@/api/client", () => ({ fetchUsers: vi.fn() }));

// Mal: formatDate es tuyo, es puro, es rápido
vi.mock("@/utils/formatDate");
```

Mockear utilidades internas convierte el test en una descripción de tu propio código, y entonces el refactor lo rompe sin que nada haya dejado de funcionar.

## Cobertura: una señal, no un objetivo

La cobertura sólo sabe responder «¿se ejecutó esta línea?». No sabe si comprobaste algo. Este test da 100% de cobertura y no verifica nada:

```tsx
it("renderiza", () => {
  render(<Checkout total={100} />);
});
```

Por eso un umbral global del 90% suele producir tests basura escritos para subir el número. Un 70% global con umbrales altos donde vive la lógica —utilidades, hooks, reducers— dice mucho más. Lo útil de la cobertura no es el porcentaje: es abrir el informe y encontrar la rama de error que nunca nadie probó.

## Un test que falla cuando debe

La última comprobación, y la que casi nadie hace: **rompe el código a propósito y confirma que el test falla**. Un test que nunca ha fallado no ha demostrado nada. Yo lo hago siempre al escribir el primer test de un módulo, y me ha ahorrado más de una suite verde que no comprobaba absolutamente nada.
