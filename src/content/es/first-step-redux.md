---
slug: "/first-steps-redux"
date: "2022-11-24"
title: "Primeros pasos en redux"
kicker: "React"
excerpt: "Los conceptos básicos de Redux y React Redux, primero en TypeScript puro y luego en React."
tags: [react, redux, typescript]
featuredImage: "/images/banners/first-steps-redux.svg"
---
Hoy vamos a explicar los conceptos más básicos de Redux y React Redux de la forma más concisa posible, primero explicando los conceptos más importantes y luego viendo su implementación tanto en TypeScript "vanilla" como en React.

## Redux

Redux es una biblioteca muy popular de JavaScript que permite manejar el estado de una aplicación. El estado de aplicación es un objeto global que maneja información heterogénea usada por al aplicación, por poner un ejemplo, el estado para controlar la visibilidad de un *spinner* si estamos cargando datos en nuestra aplicación.

Otro de los grandes objetivos del control de estado es pasar información entre componentes sin caer en el *prop drilling* o el tener que pasar un mismo valor entre múltiples componentes padre-hijos para completar la cadena.

Para todo esto necesitamos bibliotecas de manejo de estados como *Redux*. *Redux* como biblioteca es muy popular porque basa su uso en unos principios muy sencillos e intuitivos, fundamentados en los siguientes patrones:

* **Single Source Of Truth**: O "única fuente de veracidad", que básicamente significa que solo tenemos un lugar (llamado `Store`) donde vamos a guardar el estado de toda la aplicación.
* **Inmutabilidad**: En *Redux* no vamos a cambiar el estado de un objeto y sus propiedades directamente, si no que vamos a crear un nuevo objeto calculando el nuevo estado de la aplicación y así actualizandolo con el nuevo objeto creado.

## Componentes

![Componentes Redux](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/7qs1d2j43o1jmuigcqnh.png)
 
Con estos principios, vamos a ver los componentes esenciales de *Redux*:

### Store

El `Store` o almacenamiento contiene el estado de la aplicación. Este `Store` es un objeto con sus funciones y atributos al que podemos suscribirnos para escuchar eventos cuando el objeto `Store` se actualiza. Este objeto es referenciado muchas veces como el "árbol de estado", ya que es posible almacenar cualquier valor y anidar tanta información como se necesite.

### Actions

Son objetos JavaScript que describen qué a pasado en un estado, pero no como este estado debe cambiar. Simplemente mandamos (dispatch) estas acciones a nuestro objeto `Store` siempre que queramos actualizar el estado. La gestión del cambio será efectuada por los `Reducers`.

Estas acciones son objetos que tienen al menos un atributo, en este caso por convenio es `type`, para indicar la acción, y luego el resto de atributos necesarios para indicar la acción.

### Reducers

Los `Reducers` son **funciones puras** que definen como debe cambiar el estado de la aplicación. Cuando enviamos (dispatch) una `Action` a nuestro `Store`, la acción pasa a un `Reducer` que la interpretará para modificar el estado.

Una función `reducer` toma dos parámetros, el estado previo y la acción que vamos a enviar y devuelve un nuevo estado.

```javascript
let reducer = (previousState, action) => newState
```

Básicamente un reducer computará el nuevo estado de la aplicación basándose en el estado (y su tipo) que vamos a enviar. Lo más normal es que a medida que una *codebase* se vuelve más compleja, los `reducers` aumentarán en funcionalidad y complejidad, es por ello que la mejor estrategia a seguir es dividirlos en múltiples partes y luego combinarlos con la función `combineReducers`.

## Flujo

![Flujo Redux](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/cvq823pa4i07o6f45bsn.png)
 
El flujo de la aplicación es relativamente sencillo conociendo los componentes, solo tenemos que utilizar en conjunto los elementos antes mencionados:

1. Lo primero tendremos que suscribirnos al `Store` y tener un mecanismo para reaccionar.
2. Ahora en cualquier cambio de estado que queramos hacer, solo tenemos que llamar al método `store.dispatch()` con la `Action` que queramos realizar.
3. Redux gestiona esta acción mediante el `Reducer`.
4. Al estar suscritos al `Store`, nos devolverá el nuevo estado que podremos añadir a nuestra aplicación.

Como veis, incorporar *Redux* en nuestra aplicación es relativamente sencillo una vez tenemos todos los conceptos claros. Ahora vamos a ver unos ejemplos prácticos para TypeScript y React.

## Redux + TypeScript

![Aplicación en TypeScript](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/7fcc1jegbtbh8p1fdp9w.png)

Vamos a hacer primero una versión en TypeScript *vanilla* para asentar los conceptos de forma correcta. Esta aplicación consta de un formulario sencillo con el que añadir recordatorios. Cada vez que pulsemos el botón *"Add"*, mandaremos una acción a *Redux* con el recordatorio que queremos crear.

Primero vamos a definir una interfaz para los *reminders*, que constará de un atributo `title` para el título y `description` para la descripción.

```typescript
interface Reminder {
  title: string;
  description: string;
}
```

Ahora vamos a crear nuestra `Action`. De momento solo vamos a crear un acción para añadir nuevos recordatorios a nuestro estado global, es por ello que primero definiremos la `interface` de nuestra acción, seguido del atributo `type` que controlaremos en nuestro `reducer` y atributos adicionales como son `title` y `description` que servirán para crear el recordatorio.

```typescript
// ----------- Action ------------
interface ReminderAction {
  type: string;
  title: string;
  description: string;
}

export const ADD_REMINDER: string = 'ADD_REMINDER';

export function addReminder(title: string, description: string): ReminderAction {
  return { type: ADD_REMINDER, title: title, description: description };
}
```

Ahora generaremos nuestro `reducer`. Como es el primero de todos será nuestro `rootReducer`, en el que controlaremos todas las acciones con un `switch` (en este caso solo tenemos una inicialmente), en la que con un [spread operator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax) añadiremos un nuevo objeto `Reminder` en el array de estados de la aplicación.

```typescript
// ----------- Reducer ------------ 
interface ReminderState {
  reminders: Reminder[];
}
const initialState: ReminderState = {
  reminders: []
};

const rootReducer = (state: ReminderState  = initialState, action: ReminderAction): ReminderState => {
    switch(action.type) {
      case ADD_REMINDER:
        return {
          reminders: [
            ...state.reminders,
            {
              title: action.title,
              description: action.description,
            },
          ],
        };
        
      default:
        return state;
    }
}
```

Ya solo nos falta crear nuestra `store` y añadir nuestro `rootReducer` para tener *Redux* configurado en nuestra aplicación.

```typescript
// ----------- Store ------------ 
const store = createStore(rootReducer);
```

Para la *UI*, lo más destacable es que vamos a tener una función llamada `renderReminders` que básicamente recoge el estado de nuestro `Store` y modifica el DOM de la aplicación para mostrar todos los recordatorios que tengamos guardados. Para que nuestra aplicación reaccione a los cambios vamos a suscribirnos al `Store` mediante el método `store.subscribe(() => {})` al que le pasaremos nuestra función para renderizar los recordatorios.

```javascript
// ----------- UI ------------
let button = document.getElementById("addButton");
let remindersDashboard = document.getElementById("reminder-dashboard");

button.onclick = function (event) {
  const title = document.getElementById("titleInput").value;
  const description = document.getElementById("descriptionInput").value;
  store.dispatch(addReminder(title, description));
};

const renderReminders = () => {
  const reminderState = store.getState().reminders;

  let reminderDom = ``;

  reminderState.forEach((element) => {
    reminderDom += `
    <div class="reminder-card">
            <p class="reminder-title">${element.title}</p>
            <p class="reminder-description">${element.description}</p>
    </div>
    `;
  });

  remindersDashboard.innerHTML = reminderDom;
};

store.subscribe(() => {
  renderReminders();
});
```

https://codepen.io/lucferbux/pen/eYVWaKP

## Redux + React


![React App](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/txhc7idbug2hspqml1rv.png)

Ahora vamos a reutilizar la mayor parte de la estructura del proyecto anterior, ya que las declaraciones de las `Actions`, `Reducers` y `Store` son las mismas. Nuestro objetivo ahora es conectarnos y acceder a nuestro `Store` a través de los componentes funcionales de nuestra aplicación. Para ello vamos a hacer uso de la librería [react-redux](https://react-redux.js.org) y de varios `hooks` que nos facilitarán el trabajo.

Lo primero que vamos a tener que hacer es rodear nuestro componente de aplicación con el `Provider` de *Redux*, al que le pasaremos el objeto `store` que hemos declarado previamente. Con ello ya podremos acceder al `Store` global desde cualquiera de los componentes de nuestra aplicación.

```typescript
ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>, document.querySelector(".container"));
```

Vamos a hablar primero de `useSelector`. Este hook permite devolver una parte del objeto `Store` a nuestro componente. El selector va a hacer una comprobación del estado anterior, y si no es el mismo, el componente accionará un renderizado. Este `hook` acepta un segundo parámetro que permite modificar la estrategia de comparación entre estados, en este caso usaremos `shallowEqual` para que no renderice el componente si en el cambio de estado los valores permanecen igual.

```typescript
const RemindersComponent = () => {
    const reminders = useSelector((state) => state.reminders, shallowEqual);
      
    return (
      <div class="reminders-dashboard">  
        { reminders.map((reminder, index) => (
          <div className="reminder-card">
            <p className="reminder-title">{reminder.title}</p>
            <p className="reminder-description">{reminder.description}</p>
          </div>  
        
        ))}
      </>   
    );
};
```

Por otro lado tenemos `useDispatch()`, que nos permitirá mandar una acción a nuestro `Store` para que lo procese el reducer. Es tan fácil como llamar a la función y pasar la `Action` que ya teníamos generada.

```typescript
const App = () => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const dispatch = useDispatch();
  
    const dispatchReminder = () {
        dispatch(addReminder(title, description));
    }
  
    return (
      <div className="wrapper">
          <HeaderComponent title={"Redux + React"} />
          <FormComponent setTitle={setTitle} title={title} setDescription={setDescription} description={description} submitForm={dispatchReminder}/>
           <RemindersComponent />
      </div>

    );
}
```

Con esto ya tendríamos configurado *Redux* en nuestro proyecto *React*. Como veis una vez dominamos los conceptos esenciales la implementación es relativamente sencilla. Abajo tenemos un codepen con el ejemplo mencionado antes.

https://codepen.io/lucferbux/pen/XWZRQwZ

Saludos 👋