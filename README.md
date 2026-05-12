# The Running Trade — A Smuggler's Reckoning, 1725

An educational, browser-based interactive fiction set in the smuggling economy
of 1720s Britain. Built in plain HTML / CSS / JavaScript so it can be hosted
free on **GitHub Pages** and embedded in a Wix site by **iframe**.

The game has five acts (the inn at Poole → the run to Jersey → the Sussex
landing → under-declaration at the Custom House → indictment → the
reckoning), with two persistent meters — **Exposure** and **Trust** — that
shape the branching outcomes.

---

## File layout

```
smuggling-game/
├── index.html          ← entry point (the iframe loads this)
├── css/
│   └── style.css       ← parchment + bitmap aesthetic
├── js/
│   ├── engine.js       ← scene loop, meters, intro, lessons (rarely edit)
│   └── content.js      ← ALL the game's text, dialogue, choices, lessons
└── assets/
    ├── images/
    │   ├── README.txt  ← list of every JPG slot the game references
    │   └── map.jpg     ← supplied (fallback for any missing image)
    └── audio/
        └── README.txt  ← list of every audio slot (drop in MP3s)
```

You will spend most of your time in **`js/content.js`** and
**`assets/`**. The engine is intentionally hands-off.

## How a turn works (the educational design)

1. The player reads a scene and chooses an option.
2. **If the choice changes Trust or Exposure**, the game pauses and
   shows a *Reflection* — the historical reasoning behind the
   consequence. The student reads this; *the reading is the game*.
3. The player clicks **Continue**, and the next scene loads.

Choices that change only inventory or flags advance directly to the
next scene without a Reflection.

## Player name

On launch the game shows an **Introduction screen** with a name input.
The player's entered name is substituted wherever `{{name}}` appears
in scene titles, body text, dialogue, choice text, and ending screens.
Default if blank: `Bowden`.

---

## Hosting on GitHub Pages

1. Create a new public repository on GitHub (e.g. `smuggling-game`).
2. Upload the entire contents of this folder to the root of the repository.
3. In the repo, go to **Settings → Pages**, and set:
   - **Source:** *Deploy from a branch*
   - **Branch:** `main` / `(root)`
4. After ~1 minute the game will be live at:
   `https://<your-username>.github.io/smuggling-game/`

## Embedding in Wix

In the Wix editor, add an **HTML iframe / Embed Code** element and paste:

```html
<iframe
  src="https://<your-username>.github.io/smuggling-game/"
  width="100%"
  height="800"
  style="border:0; max-width:1140px;"
  allow="autoplay"
  title="The Running Trade — a smuggling game">
</iframe>
```

The game is mobile-aware; on narrow widths the meters tuck under the picture.

---

## Editing the game

### Change text or dialogue

Open `js/content.js`. Each scene is an object keyed by id, e.g.:

```js
'1.1_wake': {
  act: 1,
  title: 'The Crown Inn, near the Quay at Poole',
  image: 'assets/images/act1_inn.jpg',
  caption: 'A chamber above stairs at the Crown, Poole.',
  body: [
    'Mr. {{name}}, you wake, and for a long moment...',
    { dlg: 'Mrs. Hodgkin', text: 'You are awake at last, sir...' }
  ],
  choices: [
    { text: 'Search the floorboards beside the bed.',
      target: '1.2_search_floor',
      effects: { exposure: -2, trust: +1 },
      lesson: 'Smugglers prized those who would investigate before acting...' }
  ]
}
```

- A plain string in `body` becomes narration.
- An object `{ dlg: 'Name', text: '…' }` becomes styled NPC dialogue
  (italic, marked with the wax-red bar).
- In any string (body, dialogue, choice text, lesson), `*word*` → italic,
  `**word**` → bold, and `{{name}}` is replaced by the player's entered name.

### Add or edit a Reflection lesson

The `lesson` field on a choice is the **educational payoff**. It is shown
on a separate "REFLECTION" card, with the meter deltas, after the player
makes that choice — but only if the choice actually changed Trust or
Exposure. Aim for one to three sentences grounded in a specific
historical fact.

### Add a picture

1. Save your JPG (any size; ~800×600 looks best) into `assets/images/`.
2. Reference it from a scene with `image: 'assets/images/your_file.jpg'`.

If the file is missing, the engine quietly falls back to `map.jpg` so the
game is always playable while you build out art.

### Adjust the meters

`effects` can include any of:

```
exposure:  ±N        // Customs suspicion (0–100)
trust:     ±N        // standing with confederates (0–100)
addItem:   'id' or ['id1','id2']
removeItem:'id'
flags:     { someFlag: true }
```

The two interrupt thresholds are wired automatically:
- **Exposure ≥ 100** → routes to scene `auto_indicted`.
- **Trust ≤ 0** → routes to ending `auto_betrayed`.

### Lock a choice behind a condition

```js
{ text: 'Pay him in coin on the spot.',
  target: '3.5_after',
  requires: { item: 'purse', minTrust: 30 },
  effects: { exposure: -4, trust: +6 } }
```

Disabled choices appear struck-through.

---

## Historical sources

The game is built on three primary sources:

1. *The Report of the Committee Appointed to Inquire into the Frauds
   and Abuses in the Customs* (House of Commons, 1733), especially the
   appendix on tobacco debentures and the deposition of Isaac Poulsum.
2. David Chan Smith, *The Strength of Weak States: Law, Bargaining and the
   Making of the Criminal in Eighteenth-century Smuggling* (the user's own
   article on the Boyse / Hatch / Sellers prosecution of 1725).
3. Daniel Defoe, *A Tour Thro' the Whole Island of Great Britain*
   (1724–27), used for tone, place-detail, and turns of phrase.

The principal characters (Boyce, Pulsom, Cooper, Hodgkin, Reeve, Henwood,
Lebec) are composites or invented; the locations, the legal mechanics
(*ad rem* vs *ad personam* informations, debentures, coast bonds, the
Court of Exchequer, drawbacks, riding officers, tide-waiters, searchers,
the Customs cutters), and the prices and prison itineraries (Newgate /
Marshalsea / Fleet) are documentary.

---

## Audio

Drop MP3 files into `assets/audio/` using the names listed in
`assets/audio/README.txt`. The engine plays:

- a looping ambient track per act (auto-fades on act change);
- short UI cues for choice clicks, scene changes, and endings;
- nothing at all if a file is missing.

A **Mute** button is in the footer; the **M** key also toggles audio.

## What is *not* persisted

There is no save / load. Refreshing the page restarts the game from
the introduction screen. (Wix iframe sandboxes can be flaky about
storage, so we keep the experience deliberately session-only.)

## Console hooks (for development only)

```js
RT.state()                 // print current state
RT.go('3.1_summons')       // jump to a scene
RT.set('exposure', 90)
RT.skipIntro('Bowden')     // bypass the intro for testing
RT.restart()
```
