# Responsible AI

Hiring is one of the places AI can do the most damage quietly. A biased score looks like data. A ranked list looks objective. A model trained on historical hiring patterns will happily reproduce whatever bias was baked into those patterns, dressed up in the authority of a number. None of that requires the AI to be malicious — it only requires the product to hand a human a conclusion instead of a reason, and for the human to reasonably trust it.

This document is about how Potential is built to avoid that, and where its responsibility actually sits.

## The risk we're designing against

The failure mode isn't "the AI is wrong sometimes." Every system is wrong sometimes, including human interviewers. The failure mode we care about most is **false precision** — a system that produces something that looks more certain than it is, and in doing so, quietly discourages the human next to it from checking it.

A score of 7.2 out of 10 feels like a fact. A sentence that says "this response doesn't demonstrate conflict resolution because no disagreement was described" is not a fact — it's a claim, and it's written so you can go check whether it's true. We think the second one is what responsible AI in hiring actually looks like: not fewer opinions, but opinions that show their evidence and invite disagreement.

## What we've built structurally, not just promised

It would be easy to write a policy that says "our AI doesn't make hiring decisions" while still shipping a feature that quietly does — a "match score," a "recommended candidates" sort order, anything that lets a number stand in for a judgment. We haven't done that. Potential's data model has no field for a score. No engine in the system produces a rank. No prompt asks the model to weigh in on fit. This is described in full in the [AI Charter](./ai-charter.md); the point here is narrower: these are architectural facts, not settings someone could accidentally leave off.

The same discipline applies to how information flows. Gap analysis and follow-up generation never see a raw transcript — only the structured, already-validated evidence from the stage before. That's a safety property as much as a design one: it means a later stage can't be swayed by tone, phrasing, or anything in the transcript that isn't actually evidence of a competency.

## Human accountability, by construction

Every hiring decision made using Potential is made by a person, and that person is accountable for it — not the model, and not Potential as a product. The system is built so that this isn't just a disclaimer: there is no output anywhere in Potential that a person could point to and say "the AI told me to." At most, the AI says "here's what was said, and here's what still seems to be missing." What that means for whether to hire someone is a judgment only a human is positioned to make, because only a human is accountable for making it.

We think this is the right way to draw the line, and also the honest one. A model can process language faster and more consistently than a person mid-conversation can. It cannot take responsibility for a hiring outcome, and no amount of engineering changes that. So we don't ask it to.

## Transparency toward the people involved

Both sides of the interview should be able to understand what the system is doing:

- **Interviewers** always see the evidence and reasoning behind any gap or follow-up suggestion — never just a conclusion. Nothing Potential surfaces should require the interviewer to "trust the AI"; it should be something they can independently agree or disagree with in seconds.
- **Candidates** are being evaluated on what they actually say, in their own words, against competencies that are known and fixed ahead of time — not on inferred traits, tone, or anything not directly tied to a stated objective for the interview.

## What Potential doesn't claim to solve

We don't claim that Potential removes bias from hiring. No product honestly can. What we claim is narrower and, we think, more honest: Potential makes the evidence behind a hiring conversation visible and checkable, instead of collapsing it into an impression or a score. That's a meaningfully different problem than "solving bias," and we'd rather be precise about which one we're working on.

We also don't claim the AI's read of the evidence is infallible. It can miss something a human would have caught, or under-credit a good answer that was said unusually. That's exactly why the AI's output is always shown, never hidden behind a summary — so a human is positioned to catch it when it happens.

## Ongoing responsibility

This document describes commitments, not a one-time compliance checkbox. As Potential adds capability, every new feature is checked against the same standard the rest of the product already meets: does it give the interviewer better evidence, or does it start deciding for them. If it's the latter, it doesn't ship — regardless of how good the underlying model has gotten.
