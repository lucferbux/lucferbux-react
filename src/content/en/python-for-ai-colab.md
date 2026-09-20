---
slug: "/python-for-ai-colab"
date: "2026-09-08"
title: "Python for AI: from a notebook to a tool someone uses"
kicker: "Python"
excerpt: "The jump almost nobody teaches: what changes when the notebook stops being yours and starts having users."
tags: [python, ai, colab, gradio]
featuredImage: "/images/banners/python-for-ai-colab.svg"
---

A notebook is a lab book: mutable state, out-of-order execution, everything on display. It's an excellent tool for exploring and a terrible one for delivering. The jump between the two is where almost every Python-for-AI course gets stuck, mine included for a while.

## What the notebook lets you do and later charges you for

Three habits that are convenient while exploring and are bugs in production:

**Out-of-order execution.** A cell defines a variable, you delete the cell, and the code keeps working because the value lives in the kernel. Restart and run top to bottom before trusting anything: it's the only way to know whether the notebook is reproducible.

**Implicit global state.** `df` gets transformed across fourteen different cells. When something goes wrong there's no way to tell where. The discipline that fixes it is writing transformations as pure functions, even inside the notebook:

```python
def clean(df: pd.DataFrame) -> pd.DataFrame:
    return (
        df.dropna(subset=["text"])
          .assign(text=lambda d: d["text"].str.strip().str.lower())
          .drop_duplicates(subset=["text"])
    )

clean_df = clean(raw_df)  # raw_df is untouched
```

This isn't purism: it's what lets you test the transformation and re-run it without fear.

**Secrets in plain sight.** The classic `API_KEY = "sk-..."` pasted into a cell and then committed. Colab has a secrets manager; use it:

```python
from google.colab import userdata
api_key = userdata.get("GOOGLE_API_KEY")
```

And outside Colab, environment variables. Never a literal.

## From notebook to interface in twenty lines

The moment the project changes character is when someone else can use it without reading the code. Gradio makes that nearly free:

```python
import gradio as gr

def classify(text: str) -> dict[str, float]:
    scores = model.predict(text)
    return {label: float(score) for label, score in scores.items()}

demo = gr.Interface(
    fn=classify,
    inputs=gr.Textbox(lines=4, label="Text"),
    outputs=gr.Label(num_top_classes=3),
    title="Sentiment classifier",
    examples=["I loved it", "Nothing works properly"],
)

demo.launch()
```

Those `examples` matter more than they look. An empty interface forces the user to invent a valid input; with examples, they understand what the tool does in two seconds.

## What breaks once it has users

As soon as someone else uses it, problems appear that the notebook never had.

**Unexpected input.** Empty text, 50,000 characters, another language, emoji. A notebook explodes; a tool answers something reasonable.

```python
MAX_CHARS = 5_000

def classify(text: str) -> dict[str, float]:
    text = (text or "").strip()
    if not text:
        raise gr.Error("Please enter some text.")
    if len(text) > MAX_CHARS:
        text = text[:MAX_CHARS]
    ...
```

**The model reloads on every call.** The most common performance mistake. Load it once at module level, not inside the function.

**Unbounded cost.** If a paid API sits behind it, every user spends your money. A length limit and elementary caching handle most of it:

```python
from functools import lru_cache

@lru_cache(maxsize=512)
def embed(text: str) -> tuple[float, ...]:
    return tuple(client.embed(text))
```

`lru_cache` needs hashable arguments and returns, hence the tuple rather than a list.

## Measure before you have opinions

The last habit, and the one separating a class project from a real one: keep a set of test cases from the start. Nothing sophisticated is required.

```python
CASES = [
    ("I loved the service", "positive"),
    ("I've been waiting three days", "negative"),
    ("The order arrived on Tuesday", "neutral"),
]

def accuracy() -> float:
    ok = sum(classify(text)["label"] == expected for text, expected in CASES)
    return ok / len(CASES)
```

Twenty hand-written cases turn "I think it's better now" into a number. Without them, every prompt or model change is an opinion, and opinions can't be compared to each other.

## The summary

The notebook is for finding out **what** you want to build. Once you know, the work is different: pure functions instead of global state, input validation, the model loaded once, secrets out of the code, and a handful of test cases. None of it is advanced, and it's exactly what separates a lab book from a tool.
