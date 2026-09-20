---
slug: "/rag-langchain-ollama"
date: "2026-05-12"
title: "RAG con LangChain y Ollama, de principio a fin"
kicker: "IA"
excerpt: "Qué hace realmente un sistema RAG, dónde se rompe, y cómo montar uno entero en local sin pagar por tokens."
tags: [ia, rag, langchain, ollama, python]
featuredImage: "/images/banners/rag-langchain-ollama.svg"
---

RAG —*retrieval-augmented generation*— tiene una descripción engañosamente simple: busca fragmentos relevantes y pásalos al modelo como contexto. La parte difícil no es esa canalización; es que la calidad del resultado depende casi por completo de la recuperación, y la recuperación es un problema de búsqueda, no de modelos.

## Por qué RAG y no fine-tuning

Es la primera decisión y la que más se equivoca. Un ajuste fino enseña al modelo *cómo comportarse*: un tono, un formato, una tarea. RAG le da *qué saber*.

Si tu problema es «el modelo no conoce nuestra documentación interna», el fine-tuning es una forma cara y lenta de resolverlo, y además hay que repetirlo cada vez que la documentación cambia. RAG resuelve eso cambiando un documento en un índice.

## Las cuatro piezas

```python
# pip install langchain langchain-chroma langchain-ollama
from langchain_community.document_loaders import DirectoryLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_ollama import OllamaEmbeddings, ChatOllama
from langchain_chroma import Chroma
```

**1 · Cargar.** Traer los documentos a texto plano.

```python
docs = DirectoryLoader("./docs", glob="**/*.md").load()
```

**2 · Trocear.** Aquí es donde se gana o se pierde el sistema.

```python
splitter = RecursiveCharacterTextSplitter(
    chunk_size=1000,
    chunk_overlap=200,
)
chunks = splitter.split_documents(docs)
```

`RecursiveCharacterTextSplitter` intenta partir primero por párrafos, luego por frases y sólo al final por caracteres, así que respeta la estructura. El solape de 200 no es decorativo: sin él, una frase que cae justo en la frontera pierde su contexto y deja de ser recuperable.

**3 · Indexar.** Convertir cada fragmento en un vector y guardarlo.

```python
embeddings = OllamaEmbeddings(model="nomic-embed-text")
store = Chroma.from_documents(chunks, embeddings, persist_directory="./chroma")
```

El modelo de *embeddings* no tiene por qué ser el mismo que genera la respuesta, y normalmente no debería serlo: uno pequeño y especializado es más rápido y suele recuperar mejor.

**4 · Recuperar y generar.**

```python
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.runnables import RunnablePassthrough
from langchain_core.output_parsers import StrOutputParser

retriever = store.as_retriever(search_kwargs={"k": 4})
llm = ChatOllama(model="llama3.1")

prompt = ChatPromptTemplate.from_template("""
Responde usando únicamente el contexto. Si el contexto no contiene la
respuesta, di que no lo sabes. Cita la fuente de cada afirmación.

Contexto:
{context}

Pregunta: {question}
""")

chain = (
    {"context": retriever, "question": RunnablePassthrough()}
    | prompt
    | llm
    | StrOutputParser()
)

print(chain.invoke("¿Cómo se despliega el servicio?"))
```

Esa instrucción de «si el contexto no contiene la respuesta, di que no lo sabes» hace más por reducir alucinaciones que cualquier ajuste del modelo. Sin ella, el modelo rellenará el hueco con lo que le parezca plausible.

## Dónde se rompe de verdad

Cuando un RAG da malas respuestas, el reflejo es cambiar de modelo. Casi nunca es el modelo.

**El troceado no respeta el significado.** Si una tabla se parte por la mitad, ninguna de las dos mitades responde a nada. Para documentación estructurada, trocear por secciones (`MarkdownHeaderTextSplitter`) funciona mucho mejor que por número de caracteres.

**La pregunta y el documento no usan las mismas palabras.** La búsqueda vectorial captura similitud semántica, pero falla con nombres propios, códigos de error y siglas. La solución práctica es la búsqueda híbrida: combinar vectores con BM25 y fusionar los resultados.

**`k` es demasiado bajo o demasiado alto.** Con `k=2` te falta contexto; con `k=20` el fragmento bueno se pierde entre ruido y encima pagas latencia. Cuatro a seis suele ser el punto razonable, y si necesitas más, reordena con un *re-ranker* en lugar de ampliar la ventana.

**No sabes si va bien.** Es el fallo más caro. Sin un conjunto de preguntas con respuestas esperadas, cada cambio es una opinión. Veinte pares pregunta-respuesta escritos a mano y medir «¿estaba el fragmento correcto entre los recuperados?» ya te dice más que cualquier impresión.

```python
def recall_at_k(questions, expected_sources, k=4):
    hits = 0
    for q, expected in zip(questions, expected_sources):
        got = [d.metadata["source"] for d in retriever.invoke(q)[:k]]
        hits += expected in got
    return hits / len(questions)
```

Si ese número es bajo, el problema está en la recuperación y cambiar de LLM no va a arreglarlo.

## Por qué en local

Todo lo anterior corre con Ollama en un portátil. Eso importa por tres razones prácticas: los datos no salen de tu máquina, puedes iterar sobre el troceado docenas de veces sin mirar la factura, y cuando lo lleves a producción la canalización es la misma y sólo cambias el proveedor del modelo.

Empezar en local y medir la recuperación antes de tocar nada más es, con diferencia, el camino más corto a un RAG que funcione.
