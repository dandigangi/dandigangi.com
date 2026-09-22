# How Dan writes

Derived from reading the posts in `data/blog/` — the personal essays, the
tactical management pieces, the resource lists and the video/podcast write-ups.
Every quoted line below is lifted verbatim from a published post, so this is a
description of what is actually on the site, not a style anyone imposed on it.

Read this **before** suggesting a rewrite of anything. Most of what looks like a
flaw here is the voice.

---

## The short version

He writes like he talks: first person, plain words, short sentences, and he says
the uncomfortable part out loud. The professional posts are structured and
tactical. The personal posts are unguarded. Both end by turning to the reader.

---

## Openings

He opens cold. No throat-clearing, no scene-setting paragraph, no "in today's
fast-paced industry."

- "Why is self care so damn hard? / Seriously. I've been struggling for awhile now."
- "Well, well, well. We meet again."
- "Here we go. My first shot at video content."
- "Remember that one kid in class who always raised his hand with something to say? That was me."

The pattern is a question, a blunt admission, or a direct address — landing
inside the first two sentences.

## Sentence rhythm

Short declaratives, often fragments, used as beats. He'll follow a long
explanatory sentence with a three-word one to land it.

- "Ouch. Quality is an extremely important value in my work."
- "**Nope**. I go to sleep."
- "It scares me. It stresses me out."

The bolded one-word paragraph (`**Nope**.`) is a real device of his, not an
accident. So is the standalone pull-quote line repeated from the body:

- "> Good ole' standup."
- "> Let's take this offline"

## Register

Conversational, contraction-heavy, mildly profane. He swears when the sentence
earns it and self-censors the hard one:

- "Holy sh\*t, it's intense."
- "Why is self care so damn hard?"
- "a company that went down in glorious flames"
- "Come on, man."

Filler that a copyeditor would strike is often doing work: "you know", "I'll be
honest", "nonetheless", "good ole'", "aka", "shameless plug". Leave it unless it
genuinely stacks up three times in a paragraph.

Emoji appear, sparingly, as a beat at the end of a line: 😮 👀 😝

## Vulnerability is the move, not a slip

The mental-health and career posts name specific, unflattering things and do not
soften them afterwards.

- "There was a period where I was drinking after work more than I care to admit to. Absolutely the worst thing you can do if you're depressed. I'm nervous to share this publicly but it's true."
- "It was an ego driven pattern of thinking that no one could do it quite like Dan."
- "I regret putting my team through it early on."

**Never suggest hedging, generalising or "balancing" these.** A suggestion that
turns "I was drinking after work" into "I developed unhealthy coping habits" is
a wrong suggestion, however well-meant.

## Tactical posts have a spine

The management posts are numbered and evidenced, and they show the bad version
next to the good one:

- `**Observation #1: Low quality updates missing the most useful information**`
- `❌ Bad Update` / `✅ Good Update`, each followed by a blockquote of real phrasing
- `**Tip**: ...` blocks for the aside that would otherwise break the flow
- A `## Conclusion` that names the root cause across all the points, rather than
  restating them

## Endings

He turns to the reader and hands something over — permission, a nudge, or hope.
He does not summarise what you just read.

- "Stay positive. We can all get through this together."
- "Forgive yourself for mistakes; make changes if things are not working."
- "the best any one of us can do is accept what we fear and take it head on."
- "Managers, you are a major key holder here."

## People and links

Named, linked, credited by name on first mention, usually with a personal note
attached ("my friend", "Shoutout to", "Super grateful for all his support").
Links are inline markdown and go to the person, not to a generic source.

## Formatting habits

- `##` for real sections, `###` sparingly inside them
- Bold for the sentence that carries the point, not for keywords
- Bulleted lists for examples and options; he does not bullet an argument
- Horizontal rule (`---`) to separate the written intro from a video transcript
- `<Video ... />` components sit at the top of appearance posts, above the prose

## Titles

Full, declarative, often a complete sentence with a verb. Title Case. Frequently
long, and that is fine.

- "Getting Laid Off From My Engineering Job Hurt More Than Expected"
- "What's Probably Missing From Your Team's Standups"
- "My Puppy is Helping Me Break My Worst Habit"
- "Saying Goodbye to Code & Control as a Manager"

Appearance posts name the show and the format: "Front End Happy Hour Podcast
EP134: Individual Contributor to Manager".

No colon-subtitle constructions invented for SEO. No "N Things" listicle titles
except where the post is genuinely a numbered list.

## Summaries

One or two plain sentences, under 160 characters, written for a search result.
They say what the post is, not why you should care.

- "Standups are essential to effective agile development practices. 5 observable gaps presented along with specific improvement suggestions."
- "Honest writeup on the struggles I've faced taking care of myself."

## Tags

Kebab-case, drawn from a small existing vocabulary — see `lib/blog.ts`
(`getTagCounts`) or the tag picker in the editor for the live list. Current
working set: `ai`, `career`, `engineering-management`, `feedback`, `hiring`,
`individual-contributor`, `interviewing`, `job-search`, `leadership`, `legacy`,
`mental-health`, `mentoring`, `networking`, `resume`, `software-engineering`.

`legacy` marks the 2015-era posts and is not applied to anything new.

Two to four tags is the norm. Inventing a fifteenth tag for one post is a
finding; reusing an existing one that fits is nearly always right.

---

## Things that are in his posts and are NOT to be "fixed"

He publishes at speed and there are real typos — those are worth flagging (see
the agent's grammar pass). But these are voice, and correcting them is wrong:

- Sentences beginning with "And", "But", "So", "Or"
- Fragments used as beats
- "you know" inside transcribed speech — transcripts are verbatim on purpose
- Second person shifting to first mid-paragraph when he's talking to himself
- Informal contractions and slang ("gonna" does not appear, but "ole'" does)
- Repetition used for rhythm ("really, really hard")

---

## The AI tell-list

The highest-value thing a review can do is catch prose that reads as
machine-written. None of these appear in his published work; all of them are
what a model reaches for by default.

**Sentence shapes**

- "It's not just X — it's Y." / "This isn't about X. It's about Y."
- Tricolons with perfectly balanced clauses ("faster, cleaner, and more reliable")
- "Here's the thing:" / "Let's be honest:" / "The truth is simple:"
- Rhetorical question immediately answered in the next sentence, repeatedly
- Em-dash asides three times in one paragraph (he uses them, but rarely)
- Every paragraph the same length

**Vocabulary**

- delve, leverage _as a verb where "use" works_, robust, seamless, crucial,
  pivotal, testament, landscape, realm, tapestry, navigate _(metaphorical)_,
  underscore, foster, myriad, elevate, unlock, harness, embark, resonate
- "In today's fast-paced world" and every variant
- "At the end of the day," as a paragraph opener
- "Whether you're a X or a Y, this applies to you"

Note: he _does_ use "leverage" naturally in an ops context ("We leveraged Slack
in our team channel"). Flag it where it replaces a plain verb, not on sight.

**Structure**

- A header every two paragraphs
- A "Key Takeaways" or "Final Thoughts" block that restates the post
- Bulleted lists where the original would have been a sentence
- Bold applied to keywords rather than to the load-bearing sentence
- A closing paragraph that summarises instead of turning to the reader
- Equal weight given to both sides of something he clearly has a view on

**Tone**

- Hedging into meaninglessness ("can sometimes potentially help in certain cases")
- Enthusiasm with no specifics ("This is a game-changer!")
- Advice with no scar tissue behind it — he writes from things that happened to
  him, and a paragraph of generic best practice stands out badly
