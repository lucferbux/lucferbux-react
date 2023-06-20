---
slug: "/react-solid"
date: "2023-06-20"
title: "Aplicando principios SOLID en React"
featuredImage: "https://user-images.githubusercontent.com/16117276/247105761-2230962c-4a03-458f-820d-a8721c21551a.png"
---
En el mundo del desarrollo de software, siempre buscamos seguir buenas prácticas y principios para crear aplicaciones escalables, mantenibles y robustas. Uno de los conjuntos de principios más conocidos y ampliamente adoptados es SOLID, propuesto por Robert C. Martin. Estos principios ayudan a los desarrolladores a diseñar código de alta calidad y fácil de mantener. En este artículo, exploraremos cómo aplicar los principios SOLID en el contexto de React y proporcionaremos ejemplos de cómo aplicarlos en componentes funcionales tipados.

## Principio de Responsabilidad Única (SRP)

Un componente debe tener una única responsabilidad y propósito. Al utilizar componentes funcionales y TypeScript, podemos lograr fácilmente este principio.

```tsx
// Antes: Un componente que maneja la entrada de texto y la validación
const InputWithValidation: React.FC = () => {
  /* código de validación y renderizado */
}

// Después: Separar en dos componentes
const TextInput: React.FC = () => {
  /* solo renderizado de entrada de texto */
}

const InputValidation: React.FC = () => {
  /* solo validación */
}
```

## Principio de abierto / cerrado (OCP)

Los componentes deben estar abiertos para extenderse pero cerrados para modificarse. Esto significa que no debe ser necesario modificar un componente existente para extenderlo. En su lugar, podemos crear un nuevo componente que extienda el comportamiento del componente existente.

```tsx
// Antes: Un componente cerrado para modificación
// Button.tsx
import React from 'react';

interface ButtonProps {
  onClick: () => void;
  label: string;
}

const Button: React.FC<ButtonProps> = ({ onClick, label }) => {
  return (
    <button onClick={onClick}>
      {label}
    </button>
  );
};

export default Button;

// Después: Un componente abierto para extensión
import React from 'react';
import Button from './Button';

interface IconButtonProps extends ButtonProps {
  icon: string;
}

const IconButton: React.FC<IconButtonProps> = ({ onClick, label, icon }) => {
  return (
    <Button onClick={onClick} label={label}>
      <span className="icon">{icon}</span>
    </Button>
  );
};

export default IconButton;
```

## Principio de sustitución de Liskov (LSP)

Los componentes deben poder ser reemplazados por sus subtipos sin alterar el comportamiento del programa. Esto significa que los componentes deben ser intercambiables con sus subtipos sin afectar el comportamiento de la aplicación. En el caso de componentes funcionales y TypeScript, podemos lograr esto utilizando la composición en lugar de la herencia.

```tsx
// Componente base
interface ButtonProps {
  className?: string;
}

const Button: React.FC<ButtonProps> = (props) => {
  /* código del componente base */
}

// Componente derivado
const IconButton: React.FC<ButtonProps> = (props) => {
  return <Button {...props} />;
}
```

## Principio de segregación de interfaz (ISP)

Una entidad no debe verse obligada a depender de interfaces que no utiliza. En React y TypeScript, esto se traduce en no pasar props innecesarias a los componentes.

```tsx
// Antes: Pasar props innecesarias
interface Person {
  name: string;
  age: number;
  address: string;
}

interface PersonComponentProps {
  person: Person;
}

function PersonComponent(props: PersonComponentProps) {
  return (
    <div>
      <div>{props.person.name}</div>
      <div>{props.person.age}</div>
    </div>
  );
}

// Después: Pasar solo las props necesarias
interface PersonComponentProps {
  name: string;
  age: number;
}

function PersonComponent(props: PersonComponentProps) {
  return (
    <div>
      <div>{props.name}</div>
      <div>{props.age}</div>
    </div>
  );
}
```

## Principio de inversión de dependencia (DIP)

Los componentes de alto nivel no deben depender de los componentes de bajo nivel. Ambos deben depender de abstracciones. En React y TypeScript, esto significa que los componentes de alto nivel no deben depender de los componentes de bajo nivel. En su lugar, ambos deben depender de abstracciones como interfaces o tipos.

```tsx
// Antes: Componente de alto nivel depende de componente de bajo nivel
import api from '~/common/api'

const DashboardComponent = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
        api.get('/dashboard').then((response) => {
            setData(response.data);
        });
    }, []);

    return (
        <div>
            {data.map((item) => (
                <div>{item.name}</div>
            ))}
        </div>
    );
}

// Después: Ambos componentes dependen de una abstracción
const DashboardComponent = () => {
    const { data, isLoading, error } = useFetchData(apiClient.getDashboardInfo);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    return (
        <div>
            {data.map((item) => (
                <div>{item.name}</div>
            ))}
        </div>
    );
}
```
