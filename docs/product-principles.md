# Product Principles

These are the principles we check every product decision against. When a feature idea, a prompt change, or a UI choice doesn't clearly serve one of these, that's a sign it doesn't belong in Potential — no matter how useful it might seem in isolation.

They all serve one purpose: **Potential exists to help interviewers uncover genuine capability by collecting better evidence — not by making better hiring decisions.**

---

## 1. Evidence over confidence

A confident-sounding answer and a well-supported one are not the same thing, and most interviews conflate them. Potential is built to separate the two: it looks for the specific thing a candidate said that actually demonstrates a competency — a decision, a trade-off, a moment of disagreement they navigated — and holds onto that, rather than an overall impression of how the conversation felt.

Evidence can be checked. A feeling can only be trusted. We build for the former.

## 2. The interviewer decides everything

Potential's AI notices, organizes, and surfaces. It does not conclude. There is no point in the product where a number, a rank, or a recommendation stands in for the interviewer's own judgment — not as a missing feature, but as a line we don't cross. The person who ran the interview is the one who decides what it meant, every time.

## 3. Narrow scope, held firmly

Each AI engine in Potential does exactly one thing: notice what evidence a response contains, notice what's still missing, or suggest the single most useful next question. None of them do more than that, and none of them do each other's job. A gap-analysis engine that started suggesting questions, or a follow-up engine that started implying a verdict, would be quietly expanding its role in a direction we don't want to go — so we design against that at the boundary, not just in the prompt.

## 4. Explainability is not a feature, it's a requirement

Every piece of evidence Potential surfaces comes with the quote it's grounded in and the reasoning that connects it to a competency. If we can't show our work, we don't show the output. This isn't a UI nicety — it's what makes the evidence trustworthy enough to override on. An interviewer should always be able to read what the AI read and disagree with it.

## 5. One suggestion, not a menu

When Potential proposes a follow-up question, it proposes exactly one — the question that would do the most to close a known gap, grounded in what was actually said. It is not a brainstorming tool. Offering several options quietly shifts the work from "ask a good question" to "pick from a list," which is a worse use of an interviewer's attention, not a better one.

## 6. Say what's missing, plainly

A gap in the evidence should be described in terms of what's actually absent — "no evidence of leading through disagreement yet" — not softened into something vaguer. Precision about what's missing is what makes it possible to go get it. Vague uncertainty just produces more vague uncertainty.

## 7. Structure protects judgment, it doesn't replace it

Typed evidence, validated schemas, and a fixed set of competencies per interview all exist to keep the AI honest and its output predictable — not to make the interview mechanical. The structure is there so a human's judgment has something solid to stand on, not so the judgment can be automated away.

## 8. Candidates should be understood in their own words

The product is built around what a candidate actually says, not a summary of it, not a keyword match against a job description. Genuine capability tends to come out in specifics — how someone actually describes what they did — and Potential is designed to catch that, rather than paraphrase it into something blander and easier to process.

## 9. When in doubt, say less

If the evidence doesn't clearly support a competency, if a gap analysis can't be grounded in what was actually collected, or if a follow-up can't be tied to something the candidate said, the right output is an honest "not enough yet" — not a plausible-sounding guess. An AI that fills silence with invented confidence is worse than one that admits it doesn't know.
