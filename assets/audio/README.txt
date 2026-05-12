============================================================
THE RUNNING TRADE — Audio Slots
============================================================

Drop MP3 files into this folder using the names below. Any slot
you have not filled is silently skipped — the game runs without it.

Recommended length & loudness:
  Ambient loops:  60–120 seconds, seamless, peaks at -18 dBFS
  UI cues:        0.2–1.0 seconds, peaks at -12 dBFS

The engine fades smoothly between act ambients on every scene
change, plays UI cues at moderate volume, and exposes a Mute
button (also bound to the M key).

------------------------------------------------------------
Ambient (per act — long looped beds)
------------------------------------------------------------
  ambient_act1.mp3   Inn / quay / Channel passage
                     suggestion: tavern murmur, distant
                     gulls, a rope creaking
  ambient_act2.mp3   Open sea / shingle landing
                     suggestion: wind in canvas, breaking
                     waves, distant thunder
  ambient_act3.mp3   Custom house / port / counting house
                     suggestion: scratching pens, low voices,
                     a wall-clock
  ambient_act4.mp3   Tense flight / Custom House in London
                     suggestion: rain on a lead roof, distant
                     constable's bell
  ambient_act5.mp3   Boyse's parlour / final reckoning
                     suggestion: a single clock, fire crackling,
                     one quiet voice

------------------------------------------------------------
UI sound cues (one-shot)
------------------------------------------------------------
  ui_choice.mp3      played when player clicks a choice
                     suggestion: brief quill-on-paper scratch
  ui_scene.mp3       played when a new scene loads
                     suggestion: a small bell or page-turn
  ui_ending.mp3      played when an ending screen opens
                     suggestion: a wax-seal thump or door close

------------------------------------------------------------
Sourcing audio
------------------------------------------------------------
Try freesound.org for royalty-free options. Search terms
that work well:
  "tavern ambience"  "ship rigging"  "page turn"
  "quill writing"    "wax seal"      "shingle waves"

Make sure to check each file's licence (CC-0 or CC-BY are easiest).
If using CC-BY clips, credit the authors in your About section
or in the README.md of the GitHub repo.

You can change the file paths at any time by editing the
config.audio block in js/content.js.
