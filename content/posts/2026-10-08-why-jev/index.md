---
title: "Why Jev? A Decision model from TypeSafe - Part 1"
description: A Decision model capable of taking decision faster and cheaper than LLM.
tags: java, ai, typesafe, decision, classification, jev, langchain4j
author: ankit
image: jev-cover.svg
logo: jev-cover.svg
---

What is a Decision model and why we need a one, when there is already an LLM model like Qwen, Opus, Astra etc.
Which are capable of almost anything and keeps improving on a daily basis. Because of two reasons:

1. **Speed.**
2. **Cost.**

**Jev** is a AI decision model developed by **TypeSafe AI** founded by ChatGPT co-founder **Diogo Almeida**.

It does not generate text, summaries like standard LLM, so it is not a replacement for LLM.
It acts as an **if/switch statement** or classification layer for your software or autonomous agents.

Jev is promising that to complete a single request and response cycle in **ms (200-500 ms)** compared to a frontier LLM
model which normally would take 3-8 seconds to complete (**200x faster**). That is fast.

Jev output token cost is **zero** compared this to LLM frontier models output token cost is 5x to their input token, and
they generate a lot of output with all the reasoning and analysis they do for the task to complete.

---

## Why we would care for a decision model when standard LLM is capable of everything

If you have ever read the book by Nobel laureate psychologist Daniel Kahneman **Thinking fast and slow** our brain has
two ways of thinking fast and slow for different kind of tasks.

Suppose you are driving a car, and you need to take decision whether to turn right or left, follows the traffic light
etc. You need fast thinking, quick decision.

Compared to this when you're planning your trip beforehand you would need proper reasoning, analysis, brochure where you
want to go, what you need to visits according to your friends suggestions, your personal preferences etc. you would
require slow thinking.

Now comparing this with our AI models, Jev falls into thinking fast category and whereas standard LLM falls into slow
thinking.
It does not mean slow thinking is bad or discouraged it is just, not suitable for certain kind of tasks where we would
require fast thinking.

TypeSafe categorizing this fast and slow thinking as **System One** and **System Two**  models.
A decision model like Jev is System One model and a standard reasoning LLM models like Opus, Fable, ChatGPT Astra as a
System Two models

Now just imagine with this level of quick and accurate decision-making what all are the things we can achieve which are
typically not designed for standard LLM:

- You can design a system where Jev is playing game on your behalf in real time.
- You can ask Jev to monitor stock whether to sell and buy accordingly (not promoting).
- Real time classification of support tickets.
- Understanding users sentiment and making analysis accordingly.
- ...

### Isn't a decision model is a old age classification ML models

Short answer yes, but there is a difference old age classification model is specialized version it means it is trained
on
your own custom data, and it's capability is limited to certain tasks only. For ex: from a group of photos tells me
which
one is dog or cat, now this model is only capable of this decision only.

Whereas a decision model like Jev is more of a generalized version of old age classification model.

1. It is pre-trained, you don't have to train.
2. It is capable of answering almost anything.

---

## Interacting with Jev

System One models are a class of AI models built to make fast,structured decisions that software can use directly.
It means Jev is not design to work with free text where human can interact with it to act as a chatbot and gets the
decision
to their query like typical LLM.

Jev uses Http protocol for its request and response model with JSON format as its structured input and output.
Jev evaluates typed questions against a state and returns structured results directly. No text generation, no parsing.
You
get typed values and probability distributions that your code can branch on, sort by, and route with.


Jev supports 3 types of questions that users can ask:

|Question type   |Goal   |Answers   |
|---|---|---|
|  **Choice** |Choose an option from a list   | choice, probabilities, confidence   |
|   **Score**|Score the state on a rubric   |score, probabilities, confidence |
 | **Noul**  | is this statement true/false | noul(0-1)


To invoke a Jev model, you send it a state (the context) and questions about that state. Here’s a single-question  of all the 3 type noul, choice and score.

Here the user give the context (state) of the incident from which Jev will decide what's need to be done
then user asks with providing the name "urgent" which could be anything,"type" (noul, choice and score) of question and "instructions" the actual question.
Now seeing the "type" of question Jev will answer accordingly.


**1. Request/Response of type noul**:

If the question of type of noul is there, you will always get the response in below format, here noul 0.91 is the number between 0..1 which tells you the probabilities of the possible questions, higher the number higher the chances. 

```json
//Requests
{
  "model": "jev-latest",
  "state": "Help! My payouts have been failing for 3 days and nobody answers my emails.",
  "questions": {
    "urgent": {
      "type": "noul",
      "instructions": "Does this need attention today?"
    }
  }
}
```
```json
//Response
{
  "model": "jev-1.13.0",
  "answers": {
    "urgent": {
      "type": "noul",
      "noul": 0.91
    }
  }
}
```

**2. Request/Response of type choice**

In the question of type choice you can give Jev option to choose from the possible choices depending on the question, Jev will answer the appropriate choice with the confidence level, higher the number means higher the confidence and with probabilities of all the choice provided.

```json
//Requests
{
  "model": "jev-latest",
  "state": "Help! My payouts have been failing for 3 days and nobody answers my emails.",
  "questions": {
    "team": {
      "type": "choice",
      "instructions": "Which team should handle this ticket?",
      "criteria": {
        "billing": "Payments, payouts, invoices, refunds",
        "support": "Problems using the product",
        "sales": "Pricing, upgrades, new accounts"
      }
    }
  }
}
```
```json
//Response
{
  "model": "jev-1.13.0",
  "answers": {
    "team": {
      "type": "choice",
      "choice": "billing",
      "confidence": 1.0,
      "probabilities": {
        "support": 0.0,
        "sales": 0.0,
        "billing": 1.0
      }
    }
  }
}
```

**3. Request/Response of type score**

Same goes for question of type score, here instead of getting one selective answer, you will get score on a scale of all the provided levels (criteria) with probabilities and confidence.
```json
//Request
    {
  "model": "jev-latest",
  "state": "Help! My payouts have been failing for 3 days and nobody answers my emails.",
  "questions": {
    "frustration": {
      "type": "score",
      "instructions": "How frustrated is the customer?",
      "criteria": [
        "Calm",
        "Frustrated",
        "Angry"
      ]
    }
  }
}
```
```json
//Response
{
  "model": "jev-1.13.0",
  "answers": {
    "frustration": {
      "type": "score",
      "score": 1.45,
      "confidence": 0.32,
      "legend": {
        "0": "Calm",
        "1": "Frustrated",
        "2": "Angry"
      },
      "probabilities": {
        "0": 0.0,
        "1": 0.55,
        "2": 0.45
      }
    }
  }
}
```
Here we have seen each request of individual type, but we can ask more than one questions in a single request and can also combine different types of questions in a single request. Jev guarantees that the response time of a single request with multiple questions will not add to the latency.

### Conclusion

We have seen what the decision model is, why it is needed and how we can interact with it.
TypeSafe Jev is one of the decision model that we have seen, we have various open-source model today that can perform equally well when compared with Jev.

Standard LLM can perform well when there is a task which required a lot of reasoning, research and tools access.
Whereas a decision model is more appropriate choice when we are looking for a quick and precise decision-making.
Standard LLM and Decision models both are going to work together in the long term for a completion of a task.

In the next part of a series we will see how we can integrate Jev with Java using langchain4j.








