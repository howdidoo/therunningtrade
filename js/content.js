/* ============================================================
   THE RUNNING TRADE — Content
   ------------------------------------------------------------
   Edit this file to change the game's text, dialogue, lessons,
   and image / audio references. The engine in engine.js never
   needs to be edited for content changes.

   Scene fields:
     act          — number 1..5; selects the act banner
     title        — heading shown at the top of the scroll
     image        — path to a JPG/PNG in assets/images/
     caption      — italic caption under the picture
     body         — array of strings or {dlg:'NPC', text:'...'}
                    *italic* and **strong** are supported in strings;
                    {{name}} is replaced by the player's name.
     onEnter(state)  — optional, mutates state on first arrival
     choices      — array of choice objects:
        text    — button label (supports {{name}})
        target  — id of next scene OR function(state)->id
        effects — { exposure: ±N, trust: ±N, addItem, removeItem,
                    flags: { someFlag: true } }
        lesson  — IMPORTANT: a 1–3 sentence note shown to the
                  student AFTER they choose, explaining WHY the
                  choice raised or lowered the meters. The teaching
                  moment. Required wherever effects.trust or
                  effects.exposure is non-zero.
        requires — { item, flag, minTrust, maxTrust,
                     minExposure, maxExposure }
     ending       — true marks a terminal scene; opens the overlay
     endingTitle, endingFlag, endingHtml — content for that overlay

   Items are referenced by string key; define new ones freely.
   ============================================================ */

const CONTENT = {

  /* --------------------- CONFIG --------------------- */
  config: {
    title: 'THE RUNNING TRADE',
    subtitle: "A Smuggler's Reckoning — Anno Dom. 1725 *BETA*",
    startSceneId: '1.1_wake',
    fallbackImage: 'assets/images/map.jpg',

    /* ----- Audio paths (drop matching files into assets/audio/) -----
       Three layers are supported:
         * `ambient` (per Act) — a long looping bed for each act.
         * Per-scene `audio:` on any scene below — OVERRIDES the act
           ambient while that scene is on screen (e.g. for the Custom
           House, the courtroom, the stable-yard at three a.m.).
         * Per-scene `sfx:` on any scene — a one-shot played as the
           scene loads, instead of the default ui_scene cue.
       Any file you have not provided is silently skipped. */
    audio: {
      ambient: {
        1: 'assets/audio/ambient_act1.mp3',
        2: 'assets/audio/ambient_act2.mp3',
        3: 'assets/audio/ambient_act3.mp3',
        4: 'assets/audio/ambient_act4.mp3',
        5: 'assets/audio/ambient_act5.mp3'
      },
      sfx: {
        choice: 'assets/audio/ui_choice.mp3',   // quill scratch
        scene:  'assets/audio/ui_scene.mp3',    // page turn / bell
        ending: 'assets/audio/ui_ending.mp3'    // wax-seal thump
      }
    },

    /* ----- Introduction screen ----- */
    intro: {
      title: 'THE RUNNING TRADE',
      subtitle: "A Smuggler's Reckoning — Anno Dom. 1725",
      body: [
        'The British government in 1725 derives almost two-thirds of its revenue from customs and excise duties on goods like tobacco, brandy, tea, and silks. The duties are high and so the temptation to evade them is higher. Some items, including at times French brandy and types of cottons, are even prohibited altogether. Consumers want cheaper, tax-free goods and more selection. Sellers are happy to offer them if they can. Whole communities along the southern coast of England live by what contemporaries call **the running trade**.',
        'Gangs run this transnational business. You have a part to play if you choose. Many of these gangs and criminal organizations have legitimate fronts. **David Boyse** and his partners **John Hatch** and **John Sellers** were among the most important during the period, and they presented themselves as wine merchants. Their organization was real and so was their fate.',
        { html: '<div class="meters-key"><div class="key-exp"><strong>EXPOSURE</strong> — how far the Customs suspect you. Reach 100 and an information will be laid against you in the Court of Exchequer.</div><div class="key-tru"><strong>TRUST</strong> — your standing with your confederates. Fall to 0 and they will sell you to save themselves.</div></div>' },
        'Every choice that moves a meter will be followed by a brief *Reflection* — the historical reasoning behind the consequence.'
        
      ],
      namePrompt: 'Pray, by what surname shall those of the trade know you?'
    },

    /* ----- About / historical note ----- */
    aboutHtml: `
      <p><em>The Running Trade</em> is set in 1725, the year of the prosecution of
      <strong>David Boyse</strong>, a Portsmouth wine merchant who, with his partners
      John Hatch and John Sellers, ran a substantial cross-Channel smuggling syndicate
      until their clerk Isaac Poulsum turned King's evidence.</p>
      <p>The goal of the game is to learn about the dynamics of eighteenth-century smuggling and its underworld.</p>
      <p>The mechanics — debenture frauds, "running" cargoes by moonlight,
      under-declarations, bribery of land-waiters, riding officers patrolling the coast,
      informations in the Court of Exchequer
      — are drawn from the 1733 House of Commons <em>Report on the Frauds and
      Abuses in the Customs</em> and the reports of contemporary writers.</p>
      <p>The gang's three leaders bear their historical names. Other named characters
      (Cooper the master, Hodgkin the keeper, Reeve and Henwood the Customs officers,
      Le Brun the Jerseyman, Lebec the Norman) are invented or composited.</p>
      <p>Two meters track the player's situation. <strong>Exposure</strong> rises
      as the Customs come to suspect you; if it reaches 100, prosecution follows.
      <strong>Trust</strong> is your standing with your confederates; if it drops to
      zero, they will betray you. </p>
      <p> The game was coded using Claude Code and the images generated using DALL-E with prompts based on period descriptions and paintings, and a slightly retro, bitmapped aesthetic. </p>

      <hr style="border:none;border-top:1px dashed var(--ink-soft);margin:14px 0;" />

      <h4 style="font-family:var(--font-sc);font-size:16px;color:var(--wax-red);margin:6px 0 6px;">Version History</h4>
      <p style="font-family:var(--font-sc);font-size:14px;color:var(--ink-soft);margin:0 0 4px;">Current version: <strong>0.5 BETA</strong> (17 May 2026).</p>
      <ul style="margin:4px 0 4px 18px;font-size:15px;line-height:1.45;">
        <li><strong>v.5 BETA</strong> — First Beta version. Five acts.</li>
      </ul>
    `
  },

  /* --------------------- ACTS --------------------- */
  acts: {
    1: { banner: 'ACT I  —  AN AWAKENING AT THE CROWN' },
    2: { banner: 'ACT II  —  MOONSHINE ON THE SUSSEX SHORE' },
    3: { banner: 'ACT III  —  THE LONG ACCOUNT AT THE CUSTOM HOUSE' },
    4: { banner: 'ACT IV  —  THE INFORMATION' },
    5: { banner: 'ACT V  —  THE RECKONING' }
  },

  /* --------------------- ITEMS --------------------- */
  items: {
    purse:        { name: 'Purse of guineas',          description: 'Heavier than a man without business should carry.' },
    ledger:       { name: 'Pocket ledger',             description: 'Names and sums in a clerk\'s hurried hand. The clerk is one Pulsom.' },
    debenture:    { name: 'Tobacco debenture',         description: 'Made out 12 February 1725. The Dolphin, John Smith master, for Dunkirk. 73,157 lbs.' },
    kerchief:     { name: 'Tobacco-stained kerchief',  description: 'The stain smells of Virginia leaf.' },
    note:         { name: 'A folded note',             description: '"At the Crown — Tuesday — ask for J. S. by the back stair."' },
    cocket:       { name: 'Forged cocket',             description: 'A blank export certificate, the seal not yet impressed.' },
    receipt:      { name: 'Receipt for brandy',        description: 'Twenty ankers, paid in coin to one Pierre Lebec at Calais.' },
    pardon:       { name: 'King\'s pardon (sworn)',    description: 'Granted on condition of evidence given against the Boyse gang.' }
  },

  /* --------------------- SCENES --------------------- */
  scenes: {

    /* ====== ACT I ====== */

    '1.1_wake': {
      act: 1,
      title: 'The Crown Inn, near the Quay at Poole',
      image: 'assets/images/act1_inn.jpg',
      caption: 'A chamber above stairs at the Crown, Poole.',
      audio: 'assets/audio/scene_1_1_wake.mp3',   // distant gulls, a creaking shutter
      body: [
        'You wake, and for a long moment you do not know your own name. Then it returns to you in pieces: you are *{{name}}*, of no fixed place; you are at the Crown Inn at Poole; you have been drinking with men whose faces you cannot now recall.',
        'The window-shutter is half-broken; light from the harbour throws a moving grid upon the boards. Your skull rings as if a cooper had been at it with a mallet. A pewter cup, set down at some hour you cannot recall, has stained the table with a dark ring.',
        'Property is scattered all over the room. From the quay below comes the cry of a hawker, and farther off the dull report of a tide-waiter\'s pistol.'
      ],
      choices: [
        { text: 'Search the floorboards beside the bed.',           target: '1.2_search_floor' },
        { text: 'Lift the corner of the bolster.',                  target: '1.2_search_pillow' },
        { text: 'Throw open the door and call for the keeper.',     target: '1.3_innkeeper' }
      ]
    },

    '1.2_search_floor': {
      act: 1,
      title: 'Beneath the Boards',
      image: 'assets/images/act1_inn.jpg',
      caption: 'A loose plank, lifted with the point of a knife.',
      body: [
        'A board comes up easily under your fingers, its nails withdrawn before. Beneath, wrapped in oiled cloth, lies a small *purse of guineas* — too heavy for an honest pocket — and beside it a folded paper with a customs-house seal and a *pocket ledger*, much-thumbed.',
        'The ledger, opened at random, gives initials and sums: "J.S. — 200 lb. Virginia, of Dunkirk run, 8/—". And again, "J.H. — coast bond, 73 cwt., debentured 12 Feb."'
      ],
      choices: [
        { text: 'Pocket the purse and the ledger; read on.',
          target: '1.3_innkeeper',
          effects: { addItem: ['purse','ledger','debenture'], trust: +5 },
          lesson: 'Holding the gang\'s ledger and capital marks you as a person of business in the running trade — these were the tools of a clerk or factor. Smugglers entrusted such books only to those who could read them faithfully and conceal them well.'
        },
        { text: 'Take only the purse; leave the papers where they lie.',
          target: '1.3_innkeeper',
          effects: { addItem: ['purse'], exposure: -3 },
          lesson: 'The first principle of the running trade: avoid carrying paper that might incriminate you.'
        }
      ]
    },

    '1.2_search_pillow': {
      act: 1,
      title: 'Under the Bolster',
      image: 'assets/images/act1_inn.jpg',
      caption: 'A note tucked into the pillow, its corners brown with sweat.',
      body: [
        'Folded and refolded, a *note* in another hand: "At the Crown — Tuesday — ask for J. S. by the back stair." Beside it lies a *kerchief* of cheap printed cotton, marked with a deep brown stain. The smell, when you raise it, is unmistakable: Virginia leaf tobacco.',
        'Whoever you are, you were waiting upon some person at this inn. Whoever drugged you (if drugged you were) did not think you would wake.'
      ],
      onEnter: (s) => { s.flags.searchedPillow = true; },
      choices: [
        { text: 'Pocket the note and the kerchief.',
          target: '1.2_search_floor',
          effects: { addItem: ['note','kerchief'] }
        },
        { text: 'Leave them and rouse the keeper for answers.',
          target: '1.3_innkeeper'
        }
      ]
    },

    '1.3_innkeeper': {
      act: 1,
      title: 'Mrs. Hodgkin, of the Crown',
      image: 'assets/images/act1_innkeeper.jpg',
      caption: 'The keeper of the Crown — a woman who has seen worse than you.',
      body: [
        'Mrs. Hodgkin meets you on the landing with a candle she does not need. She looks you over as a chandler looks over a salt-damp coil of rope, and seems to weigh you light.',
        { dlg: 'Mrs. Hodgkin', text: 'You are awake at last. Your friends were here yesternight. They left word that *the Dolphin* sails on the ebb, and that you are to be aboard her, sober or no. They paid the reckoning.' },
        { dlg: 'Mrs. Hodgkin', text: 'I asked no questions when they brought you up the stairs. I ask none now. But the wind is fair, and the tide will not wait upon anyone\'s headache.' }
      ],
      choices: [
        { text: 'Thank her plainly and leave a guinea on the sideboard.',
          target: '1.4_to_quay',
          effects: { trust: +3, exposure: -2 },
          requires: { item: 'purse' },
          lesson: 'Innkeepers in port towns were essential intermediaries. A few coins well-placed bought information; the same guinea, withheld, was a small savings that could leave you ignorant of danger or opportunity.'
        },
        { text: 'Demand to know who brought you in.',
          target: '1.3a_demand'
        },
        { text: 'Nod, take your coat, and go down without a word.',
          target: '1.4_to_quay'
        }
      ]
    },

    '1.3a_demand': {
      act: 1,
      title: 'A Civil Refusal',
      image: 'assets/images/act1_innkeeper.jpg',
      caption: 'No keeper of an inn at Poole answers such questions.',
      body: [
        { dlg: 'Mrs. Hodgkin', text: 'I keep an inn. I do not keep names. If I did, I should soon keep neither inn nor head.' },
        'She turns and is gone before you can press her further. Whatever she knows, she will not part with it for a hard word.'
      ],
      choices: [
        { text: 'Leave for the quay.',
          target: '1.4_to_quay',
          effects: { exposure: +5 },
          lesson: 'Pressing an innkeeper for names broke the unwritten compact of the smuggling port. Word travelled. Officers took note of strangers who asked too many questions, and one such word reached the Searcher\'s ear at Poole within the day.'
        }
      ]
    },

    '1.4_to_quay': {
      act: 1,
      title: 'Through the Streets to the Quay',
      image: 'assets/images/act1_quay.jpg',
      caption: 'Poole quay — the chief out-port of Dorset, much given to the running trade.',
      audio: 'assets/audio/scene_1_4_quay.mp3',  // hawkers, cordage, harbour bells
      body: [
        'The eighteenth-century writer Daniel Defoe, who passed through this town not three years since, called Poole *"a considerable seaport... here were a good number of ships fitted out every year to the Newfoundland fishing."* He did not write what every Pooleman knows: that more brandy comes ashore here in a fortnight than the Customs see in a twelvemonth.',
        'You walk the lanes between the chandlers and the rope-walks. A *tide-waiter* in the service of the Customs in his blue coat passes without a glance. Beyond him, the Custom House keeps its prim pediment turned to the sea.',
        'A sloop is taking her last casks aboard at the inner basin. Her name, in green paint upon the transom, is *Dolphin*.'
      ],
      choices: [
        { text: 'Walk straight to the Dolphin.', target: '1.5_meet_cooper' },
        { text: 'Pass first by the Custom House and watch a while.',
          target: '1.4a_custom_house',
          effects: { exposure: -4 },
          lesson: 'Reconnoitring the Custom House before a run was professional caution: knowing which officer was on duty, who took bribes, who did not. Smugglers who skipped this step found themselves caught by men whose names they had never bothered to learn.'
        }
      ]
    },

    '1.4a_custom_house': {
      act: 1,
      title: 'The Custom House, Poole',
      image: 'assets/images/act1_customs.jpg',
      caption: 'A clerk at his desk, a searcher in conversation with a master of vessels.',
      body: [
        'You stand a quarter of an hour at the steps, watching. A *searcher* — the officer who attends a vessel out — takes a paper from the master of a Dutch hoy and sets his mark upon it. A boy fetches him beer.',
        'You learn this much: the searchers here are three, of whom one (a Mr. **Reeve**) is much given to "consideration", and another (a Mr. **Henwood**) is not. The third is old and asleep.'
      ],
      onEnter: (s) => { s.flags.knowsOfficers = true; },
      choices: [
        { text: 'Note these names; turn for the quay.',
          target: '1.5_meet_cooper',
          effects: { trust: +3 },
          lesson: 'Identifying the corrupt and honest officers in a port required diligence and careful questions. The smuggler David Boyse is reported to have kept a private list of which Customs men in each port could be "compounded with" and which could not.'
        }
      ]
    },

    '1.5_meet_cooper': {
      act: 1,
      title: 'Aboard the Dolphin',
      image: 'assets/images/act1_dolphin.jpg',
      caption: 'A sloop of forty tons, rigged for the Channel.',
      body: [
        'A man with hands like split firewood is making fast a coil of rope. He glances up; his face does not change.',
        { dlg: 'Tom Cooper, master', text: ' you are late, and uglier than yesterday, but you are aboard. Mr. Boyse sends his particular regards. He says the freight is debentured to Dunkirk — ' },
        { dlg: 'Tom Cooper, master', text: ' though we may find the wind sets rather toward St Helier in the Channel Islands of an evening. Do you take my meaning?' },
        'You take his meaning. The cargo is *tobacco* — declared for export, the duty drawn back, and shortly to be landed again upon some quiet beach in *Jersey* and shipped home as if it had never been British. This was an old and common fraud.'
      ],
      choices: [
        { text: 'Speak as one who knows his business: ask after the cocket and the bond.',
          target: '1.6_passage',
          effects: { trust: +6 },
          lesson: 'A *cocket* was the export certificate, a *bond* the security pledged that the goods would not be re-imported. To ask after them by name was to demonstrate the literacy of a clerk in the trade — Boyse trusted such men with his business.'
        },
        { text: 'Say plainly that you have lost your memory and ask what part you play.',
          target: '1.5a_honest',
          effects: { trust: -15 },
          lesson: 'Smuggling crews abhorred uncertainty in their own. A man confused was a liability — likely to confess, likely to break under questioning. Cooper marks you as such, and Boyse will hear of it.'
        },
        { text: 'Say nothing; nod and go below.',
          target: '1.6_passage'
        }
      ]
    },

    '1.5a_honest': {
      act: 1,
      title: 'A Bad Word Aboard a Bad Vessel',
      image: 'assets/images/act1_dolphin.jpg',
      caption: 'Cooper does not like men who do not know themselves.',
      body: [
        { dlg: 'Tom Cooper, master', text: 'Lost your memory, have you. That is a costly thing to lose at Poole. I am of two minds whether to put you ashore again, and let Mr. Boyse decide what use you are to us.' },
        'He looks long at the water, as if he might. Then he spits into it.',
        { dlg: 'Tom Cooper, master', text: 'Below, sir. Speak to no one. We sail upon the ebb.' }
      ],
      choices: [
        { text: 'Go below.',
          target: '1.6_passage',
          effects: { trust: -10 },
          lesson: 'A confused man on a smuggling deck is a watched man. Cooper will keep his eye upon you until he has answers.'
        }
      ]
    },

    '1.6_passage': {
      act: 1,
      title: 'The Channel, by the Light of the Stern Lantern',
      image: 'assets/images/act1_channel.jpg',
      caption: 'The Dolphin running before a fair westerly, course south by east.',
      sailing: {
        title: 'Poole to St Helier — under sail',
        text: 'Wind: *south-westerly*, fresh and steady. Tide: half-ebb, setting south. Glass: rising. The Dolphin makes seven knots upon a broad reach, course south by east for the Channel Islands. A waning moon will not rise these three hours; the stern lantern is the only light upon the sea.'
      },
      body: [
        'The wind serves; the sloop heels and the lantern at the stern throws its yellow light upon the wake. Cooper is at the tiller. The boy — a thin lad called **Ned**, no more than fifteen — brings up small beer and a wedge of ship\'s cheese.',
        'You have hours before St Helier on the Isle of Jersey. There are matters to consider.'
      ],
      choices: [
        { text: 'Help Ned set up the running gear; show willingness to guide him.',
          target: '1.7_jersey_arrival',
          effects: { trust: +5 },
          lesson: 'The smuggling sloop ran on the cooperation of every hand. Master and clerk who declined rough work were resented, then suspected. Sharing labour was an investment in your shipmates\' loyalty.'
        },
        { text: 'Read the ledger again by the binnacle lamp.',
          target: '1.6a_ledger',
          requires: { item: 'ledger' }
        },
        { text: 'Stay below, out of mind and out of weather.',
          target: '1.7_jersey_arrival',
          effects: { trust: -8 },
          lesson: 'A smuggler keeping to himself undermines the trust of his crew.'
        }
      ]
    },

    '1.6a_ledger': {
      act: 1,
      title: 'The Ledger, Read by Lantern-Light',
      image: 'assets/images/act1_channel.jpg',
      caption: 'A book of names that no man should be holding upon a moonless deck.',
      body: [
        'The pages of the ledger provides the real accounting of the goods. Merchants and smugglers might keep two books: one submitted to officials and a record of frauds, and the other the real account. Names — **Boyse**, **Hatch**, **Sellers** — and against them, sums that grow over years. A clerk\'s hand, careful in some places and shaking in others. The shaking entries are recent.',
        'One name appears in a heavier ink than the rest, and underlined: *Isaac Pulsom*. He is the keeper of this book, then; or was. You wonder if he is still living. But it is clear now whom you work for: a smuggling syndicate led by David Boyse and his partners Hatch and Sellers'
      ],
      onEnter: (s) => { s.flags.knowsPulsom = true; },
      choices: [
        { text: 'Close it and pocket it carefully.',
          target: '1.7_jersey_arrival',
          effects: { trust: +2 },
          lesson: 'You now know what Pulsom knows: every name, every sum. In 1725, the clerk carried just such knowledge to the Solicitor for the Customs, and brought down the entire Boyse syndicate.'
        }
      ]
    },

    '1.7_jersey_arrival': {
      act: 1,
      title: 'St Helier, Isle of Jersey',
      image: 'assets/images/act1_jersey.jpg',
      caption: 'A free-port of the King, in his prerogative — and a great convenience to the trade.',
      body: [
        'You make St Helier at the turn of the tide. Jersey lies under the King\'s rule but pays no English duty: a free-port in fact if not in name, and a most useful warehouse. The running trade used entrepots like Jersey to transship contraband. Legal on the island, the goods would be run on shore or entered fraudulently through ports.',
        'The cargo is unloaded by a Jerseyman by the name of **Le Brun** into a stone cellar above the harbour. From this cellar, in another bottom, the same tobacco will return into England in a fortnight, the duty saved being the whole profit of the voyage.',
        'Le Brun has ledgers of his own. There is a question how the goods shall come home.'
      ],
      choices: [
        { text: 'Insist upon a small, fast wherry — quick, but limited in cargo.',
          target: '1.8_jersey_choice',
          effects: { flags: { jerseyMethod: 'wherry' }, exposure: -6, trust: -3 },
          lesson: 'Wherries — small open boats — slipped into rivulets the customs cutter could not follow. They were the safest landing craft, but their small holds disappointed confederates expecting a full freight, and Boyse paid by tonnage, not by caution.'
        },
        { text: 'Take the cargo back in the Dolphin herself, papers re-made.',
          target: '1.8_jersey_choice',
          effects: { flags: { jerseyMethod: 'sloop' }, exposure: +5, trust: +5 },
          lesson: 'Re-importing in the same hull that exported was the boldest version of the debenture fraud. It worked through the 1720s because the Customs had no central registry of vessels — but a single attentive searcher in Poole, recognising the *Dolphin* on her return, was all it took to spring the mousetrap.'
        },
        { text: 'Subcontract the run to a Guernsey master Le Brun proposes.',
          target: '1.8_jersey_choice',
          effects: { flags: { jerseyMethod: 'guernsey' }, trust: -8 },
          lesson: 'Subcontracting through Guernsey, another Channel Island near Jersey, added a layer of insulation but diluted your share. Boyse preferred his own bottoms because the profit stayed within the gang; deferring to a Channel-Islander\'s arrangement was, in his view, a small disloyalty.'
        }
      ]
    },

    '1.8_jersey_choice': {
      act: 1,
      title: 'A Bargain Struck, a Hand Shaken',
      image: 'assets/images/act1_jersey.jpg',
      caption: 'A glass of brandy, a price agreed, no paper made of it.',
      body: [
        'The bargain is struck. You return aboard the Dolphin (or a quicker boat, or none at all, depending upon your choice) with the same cargo that left Poole the day before yesterday — but it is now, in the eye of the law, a Jersey cargo, and worth a great deal more than it cost.',
        'On the homeward beat Cooper stands a long while at the rail without speaking. When he speaks, it is with a kind of grudging warmth.',
        { dlg: 'Tom Cooper', text: 'You will do, {{name}}, you will do. Mr. Boyse wants you in Sussex next week. Brandy out of Dunkirk. Honest brandy, you might say.' }
      ],
      onEnter: (s) => { s.flags.actOneDone = true; },
      choices: [
        { text: 'To Sussex, and the next voyage.',
          target: '2.1_Calais',
          effects: { trust: +5 },
          lesson: 'Successful first voyages purchased trust by the inch. Smuggling syndicates assessed new men over many runs before sharing the most valuable secrets — the names of corrupt officers, the locations of safehouses inland, the identities of London receivers.'
        }
      ]
    },

    /* ====== ACT II ====== */

    '2.1_Calais': {
      act: 2,
      title: 'Dunkirk — A Tavern by the Mole',
      image: 'assets/images/act2_Calais.jpg',
      caption: 'A French port, much used by the running trade for brandy and tea.',
      body: [
        'The Channel crossing is short and uneventful. At Dunkirk you put up at the Sign of the Three Cranes, where a Norman merchant by the name of **Pierre Lebec** does the business of half the south-coast smugglers without seeming to do any business at all.',
        { dlg: 'Pierre Lebec', text: 'Monsieur {{name}}. Monsieur Boyse sends his regards. The brandy is ready — one hundred and twenty ankers, very fine, of the brandies of Cognac in France. There is also tea, gunpowder green, that I have set aside for those who can pay. And silks, if you have a mind to be bold.' },
        
      ],
      choices: [
        { text: 'Take only the brandy. Bulky but safe to carry; well-known to your buyers.',
          target: '2.2_load',
          effects: { flags: { cargo: 'brandy' }, addItem: 'receipt', exposure: +4 },
          lesson: 'Brandy was the staple of the Sussex running trade — bulky tubs (half-ankers) slung in pairs, easy to land and easier still to sell. But every officer between Beachy Head and Selsey Bill knew the smell of Charente brandy, and the trade was watched accordingly.'
        },
        { text: 'Brandy and tea. Greater profit, greater risk.',
          target: '2.2_load',
          effects: { flags: { cargo: 'brandy_tea' }, addItem: 'receipt', exposure: +8, trust: +3 },
          lesson: 'Tea bore some of the highest duties in the kingdom — up to 119% in some years — and offered great reward to the smuggler. It was also the cargo closely surveilled: the East India Company, which had a monopoly over tea imports, had its own informers, and the Customs were lobbied directly by the Company to seize tea cargoes preferentially.'
        },
        { text: 'A small parcel of silks only — light, dear, and damnable to be caught with.',
          target: '2.2_load',
          effects: { flags: { cargo: 'silks' }, addItem: 'receipt', exposure: +2, trust: -5 },
          lesson: 'Silks were the most concealable cargo and bore prohibitive duties. But they were difficult to source in quantity. Confederates who wanted bulk and reliable buyers for higher volumes thought silk-runners small-scale.'
        }
      ]
    },

    '2.2_load': {
      act: 2,
      title: 'Loading Out',
      image: 'assets/images/act2_loading.jpg',
      caption: 'Tubs slung in the dark; a quiet word, no song.',
      body: [
        'The ankers — half-anker tubs, slung in pairs upon a man\'s shoulders — are brought out from a barn behind the mole and aboard the Dolphin in the small hours. No lantern is shown but a single shielded one. The boy Ned ties on the slings; Cooper checks each knot.',
        'Mr. Lebec takes his payment in coin, and gives a final word of warning: a *cutter of the Customs* has been seen these three nights between Beachy Head and Pevensey, "and the master of her, monsieur, is no friend at all".'
      ],
      choices: [
        { text: 'Sail tonight. The wind is fair and the moon late.',
          target: '2.3_passage',
          effects: { exposure: -2 },
          lesson: 'Smugglers timed their runs to the lunar calendar with the precision of an astronomer. A late or absent moon — "dark of the moon" runs — was the running smuggler\'s best ally; the Customs cutters lost their advantage of sight and became as blind as anyone else.'
        },
        { text: 'Lay over a night and ask Lebec to procure a *false manifest* for an ostensible run to Ostend.',
          target: '2.3_passage',
          effects: { addItem: 'cocket', exposure: -6, trust: -2 },
          lesson: 'A forged manifest was insurance: even if intercepted, you could plead an honest passage to a third port. It cost time and a confederate\'s suspicion (every delay narrowed the gang\'s margin), but it was the device most often used by professional runners and recommended by Boyse himself.'
        }
      ]
    },

    '2.3_passage': {
      act: 2,
      title: 'A Squall in the Mid-Channel',
      image: 'assets/images/act2_storm.jpg',
      caption: 'The Dolphin labouring under reefed mainsail.',
      audio: 'assets/audio/scene_2_3_storm.mp3',   // gale in rigging, rain on deck
      sailing: {
        title: 'Calais to Pevensey — under sail',
        text: 'Wind: *north-westerly*, freshening; the glass is falling. Tide: flood, against. The Dolphin runs eight knots north-north-east under a deep-reefed mainsail. Visibility is a league and lessening. The ankers are double-lashed below; the cutter *Greyhound* is reported between Beachy Head and Pevensey.'
      },
      body: [
        'You are eight leagues off Cape Barfleur when the squall comes on. The sloop heels until the lee gunwale is a-wash. Cooper, with no expression at all, gives the helm half a point free.',
        'A tub breaks loose below. If it is not secured, the cargo will be ruined, and worse, may shift and broach the vessel.'
      ],
      choices: [
        { text: 'Go below at once and lash the tubs yourself.',
          target: '2.4_sighting',
          effects: { trust: +8 },
          lesson: 'Sea-courage in a squall counted for everything in the running trade. Crews remembered, for years, who went below into a working hold and who did not. Such moments were the hidden currency of the smuggling economy: the *trust* on which a verbal contract for thousands of pounds rested.'
        },
        { text: 'Send Ned, and hold the deck.',
          target: '2.4_sighting',
          effects: { trust: -5 },
          lesson: 'Sending the boy where you would not go yourself was a small kind of contempt. Ned will say nothing. Cooper will say nothing. But neither will forget, and Boyse, who hears everything, will hear of it.'
        },
        { text: 'Cut the lashing of the loose anker and let the sea have it; save the rest.',
          target: '2.4_sighting',
          effects: { exposure: -4, trust: -12 },
          lesson: 'A lost anker was lost profit — and a half-anker of brandy, washed ashore, gave a riding officer a tale to write up in his weekly return. Smugglers preferred to risk a vessel rather than throw cargo and its profits.'
        }
      ]
    },

    '2.4_sighting': {
      act: 2,
      title: 'A Sail in the Offing',
      image: 'assets/images/act2_cutter.jpg',
      caption: 'A revenue-cutter, two leagues to windward.',
      body: [
        'The squall passes. With first light comes a sail upon the weather quarter — a topsail cutter, low and rakish, the sort the Customs commission to keep the coast. She has not yet seen you, but the wind is hers.',
        { dlg: 'Tom Cooper', text: 'That is the *Greyhound*, out of Newhaven. Captain **Nathaniel Pigram**. He took the Whitstable men last summer and set some Frensh smugglers to mourn three weeks together. We must lose him before we close the shore.' }
      ],
      choices: [
        { text: 'Run for the offing and lie to behind the Owers, hoping he passes.',
          target: '2.5_landing',
          effects: { exposure: -4, trust: +1 },
          lesson: 'Hiding behind the Owers — a shoal off Selsey Bill — was the sober choice. The cutter would not work the inshore water, and a smuggler who ran for the offing lived to land another night. Patience was a smuggler\'s discipline.'
        },
        { text: 'Crowd on sail and make straight for Pevensey beach — outrun him.',
          target: '2.5_landing',
          effects: { exposure: +8, trust: +5 },
          lesson: 'Running before the Customs at full canvas was glorious to watch and ruinous if the wind shifted. Cooper and the boy will love you for the gamble; the Customs will mark you for it.'
        },
        { text: 'Sink the most damning tubs at the Royal Sovereign buoy, mark them, recover at leisure.',
          target: '2.5_landing',
          effects: { exposure: -8, trust: -10, flags: { sunkTubs: true } },
          lesson: 'Sinking weighted tubs and recovering them later — by "creeping" with grapnels — was a recognised smuggler\'s tactic. It avoided seizure, but the gang counted the cost in lost cargo and crew time, and Boyse paid only on what was landed.'
        }
      ]
    },

    '2.5_landing': {
      act: 2,
      title: 'Pevensey Bay, Two Hours Before Dawn',
      image: 'assets/images/act2_landing.jpg',
      caption: 'A lantern shown thrice from the dunes; the answering sweep of an oar.',
      audio: 'assets/audio/scene_2_5_shingle.mp3',  // breaking surf, low voices, slung tubs
      body: [
        'You make your landing in a long shingle bay east of Pevensey. The shore-party is there: *tubmen* with their slings, and a half-dozen *batsmen* with stout ash poles to dissuade any officer who may have heard the keel grind.',
        'The signal is given. The work is fast. Forty ankers are ashore in twenty minutes; the rest go up onto two pack-horses kept in a fold above the dunes.',
        'And then the lantern of a *riding officer* shows, half a mile down the beach, and a voice cries out the King\'s name.'
      ],
      choices: [
        { text: 'Order the batsmen to give him a thrashing — nothing fatal — and run.',
          target: '2.6_aftermath',
          effects: { exposure: +20, trust: +6, flags: { officerHurt: true } },
          lesson: 'Violence against riding officers was the line that turned smuggling into criminal felony. The 1736 *Smuggling Act* was passed in direct response to the rising count of officers beaten or shot on the south coast. Your gang loves boldness; the gallows in time will love it too.'
        },
        { text: 'Slip away quietly with the cargo — let him write his report; deny everything.',
          target: '2.6_aftermath',
          effects: { exposure: +10 },
          lesson: 'A riding officer\'s report on a "running cargo seen at Pevensey, persons unknown" went into the Collector\'s weekly return and fed, in time, the dossier kept by the Customs solicitors in London. Anonymity slowed the law; it did not stop it.'
        },
        { text: 'Throw a guinea into the sand and tell him to look the other way.',
          target: '2.6_aftermath',
          effects: { exposure: -4, trust: -2 },
          requires: { item: 'purse' },
          lesson: 'The on-the-spot bribe to a riding officer was a recognised practice. But every successful bribe was an expense, and every refused bribe became material evidence in a future prosecution. Confederates resented the cost.'
        }
      ]
    },

    '2.6_aftermath': {
      act: 2,
      title: 'A Safehouse near Hawkhurst',
      image: 'assets/images/act2_safehouse.jpg',
      caption: 'Inland, by the rope-walks; a barn under a chalk down.',
      body: [
        'You are inland by daybreak, the cargo divided among three farms in the wapentake of Henhurst. The men are paid in coin and in tubs both. You pass that day in a barn smelling of old hops and wet wool.',
        'In the evening, a rider brings news from Newhaven: Captain Pigram has logged the chase; the riding officer has had his bandage and his ten guineas from the Customs; a deposition is being taken.',
        'You will not be named, this time. But your face has been seen.'
      ],
      onEnter: (s) => { s.flags.actTwoDone = true; },
      choices: [
        { text: 'Northward, to London — the goods to be disposed of through Mr. Boyse\'s factor.',
          target: '3.1_summons',
          effects: { trust: +2 },
          lesson: 'Inland networks of farmers, carriers and London receivers, inlcuding druggists and innkeepers, turned smuggled goods into cash. They were the distribution network of the smuggling trade.'
        }
      ]
    },

    /* ====== ACT III ====== */

    '3.1_summons': {
      act: 3,
      title: 'A Summons to Portsmouth',
      image: 'assets/images/act3_letter.jpg',
      caption: 'A letter sealed in red wax, the impression a stag\'s head couped.',
      body: [
        'In London, between one tavern and another, you are handed a letter. It is from **David Boyse**, by his clerk Isaac Pulsom\'s hand:',
        { dlg: 'Boyse, by his clerk', text: '{{name}} — You are now sufficiently in our trust. There is a matter of three hundred chests of tea and forty pieces of Bordeaux to come into Poole upon the *Prosperity*, by ordinary course. The under-declaration is to be your particular charge. Mr. Reeve at the Custom House is our man. Mr. Henwood is not. The cocket is enclosed. — Boyse.' },
        'This is an important species of fraud: not running goods upon the beach, but landing them at the legal quay and *under-declaring* what is in the hold.'
      ],
      choices: [
        { text: 'To Poole, then.', target: '3.2_rendezvous' }
      ]
    },

    '3.2_rendezvous': {
      act: 3,
      title: 'A Rendezvous off the Needles',
      image: 'assets/images/act3_rendezvous.jpg',
      caption: 'Two sails meet in the Channel; a transhipment by darkness.',
      sailing: {
        title: 'To the Needles — under sail',
        text: 'Wind: *light airs from the west*, the sea near mirror-flat. Tide: slack water. The Dolphin lies-to under main alone, two leagues south of the Needles, awaiting the topsails of the Bordeaux trader *Prosperity*. No moon; a slow drift of high cloud; lanterns shielded against any chance sail.'
      },
      body: [
        'You meet the *Prosperity*, a regular trader to Bordeaux in France, in the Channel south of the Needles. She carries (by her papers) only forty pieces of wine. In her hold are also the chests of tea, in a false bulkhead aft.',
        'It falls to you to draw the manifest you will present at Poole — how much shall be declared, and how much hidden.'
      ],
      choices: [
        { text: 'Declare the wine in full, and hide all the tea.',
          target: '3.3_customs',
          effects: { flags: { manifest: 'tea_hidden' }, exposure: +6, trust: +6 },
          lesson: 'The boldest under-declaration concealed the most valuable cargo entirely. It produced the largest margin (tea bore far higher duties than wine), but it left the discovery of even one chest fatal: the goods would be condemned and an information *ad personam* laid for triple value.'
        },
        { text: 'Declare the wine, declare a portion of the tea, hide the rest.',
          target: '3.3_customs',
          effects: { flags: { manifest: 'partial' }, exposure: -2, trust: 0 },
          lesson: 'Partial declarations were the professional strategy. Paying *some* duty was credible, kept the gang on the official ledgers, and supplied an answer to any awkward question from officers.'
        },
        { text: 'Declare every chest. Take the duty as the price of safety.',
          target: '3.3_customs',
          effects: { flags: { manifest: 'full' }, exposure: -10, trust: -20 },
          lesson: 'Full declaration was *fair trading* — the practice of merchants who paid all dues and resented the smugglers who undercut them. It was safe; it was honourable; and it was, in a smuggler\'s view, a betrayal of the gang\'s entire economic logic.'
        }
      ]
    },

    '3.3_customs': {
      act: 3,
      title: 'The Custom House, Poole — Forenoon',
      image: 'assets/images/act3_customs.jpg',
      caption: 'A long room, a long table, a long pause.',
      audio: 'assets/audio/scene_3_3_custom_house.mp3', // scratching pens, low murmur, wall-clock
      body: [
        'You climb the steps under the pediment with the manifest in your coat. The clerk takes it; reads it; passes it to a *land-waiter*. The land-waiter is **Mr. Reeve**.',
        { dlg: 'Mr. Reeve, land-waiter', text: '{{name}}. A pleasure. Mr. Boyse has spoken of you. The wine is plain enough. Shall we walk down to the Quay together, to attend the searcher?' },
        'A second officer crosses the room behind him. Older, with a sharp eye and a wig that has not been fresh in some years. This must be **Mr. Henwood**, of whom Mr. Reeve does not speak.'
      ],
      choices: [
        { text: 'Walk down with Mr. Reeve, alone, and trust the arrangement.',
          target: '3.4_reeve',
          effects: { exposure: -5, trust: +2 },
          lesson: 'Trusting a corrupt officer was the smuggler\'s ordinary risk. Reeve\'s "consideration" was an unwritten contract — enforceable only by repetition and reputation. Boyse paid him for years on this footing; the system held until it didn\'t.'
        },
        { text: 'Insist that Mr. Henwood attend also so as to appear above suspicion.',
          target: '3.4_henwood',
          effects: { exposure: -8, trust: -12 },
          lesson: 'Inviting an honest officer into your business was a defensive posture — a fair-trader\'s gambit — that cleared you with the Customs but mortified the gang.'
        }
      ]
    },

    '3.4_reeve': {
      act: 3,
      title: 'Mr. Reeve, in His Element',
      image: 'assets/images/act3_reeve.jpg',
      caption: 'A land-waiter who wishes you well — for a consideration.',
      body: [
        'On the quay Mr. Reeve attends the searcher; the searcher is briefer than usual. The wine is tallied and the holds inspected only as deep as the wine. The bulkhead aft is not opened.',
        { dlg: 'Mr. Reeve', text: 'A simple business, sir. My usual *consideration* is one shilling in the pound on the duty saved. The cargo, I take it, is yours to dispose of. You will find Mr. Boyse well pleased.' }
      ],
      choices: [
        { text: 'Pay him in full, in coin, on the spot.',
          target: '3.5_after',
          effects: { exposure: -4, trust: +6 },
          requires: { item: 'purse' },
          lesson: 'Cash on the quay was the smuggler\'s best receipt: no paper, no debt, no leverage on either side. Boyse always insisted on it.'
        },
        { text: 'Promise him by note — through Mr. Boyse — in three days.',
          target: '3.5_after',
          effects: { exposure: +5, trust: -2 },
          lesson: 'A promised payment created a creditor — and a creditor was a witness. Reeve\'s memory of you and your business now had three days to ferment.'
        },
        { text: 'Refuse, and threaten him with a counter-information if he troubles you.',
          target: '3.5_after',
          effects: { exposure: +20, trust: -10 },
          lesson: 'Threatening a corrupt officer was the worst of both worlds. Reeve now had no incentive to protect you and every incentive to inform on you first — *vexatious* counter-informations were a known smuggler\'s tactic, but only successful when paired with payment, never with threat alone.'
        }
      ]
    },

    '3.4_henwood': {
      act: 3,
      title: 'Mr. Henwood, Honest',
      image: 'assets/images/act3_henwood.jpg',
      caption: 'An officer who does his duty.',
      body: [
        'Mr. Henwood walks the hold with a candle and a sober face. He taps a bulkhead with his knuckle and finds it answers hollow. He sets down his candle; he opens his clasp-knife.',
        { dlg: 'Mr. Henwood, searcher', text: 'I am sorry, sir. I am sworn to His Majesty\'s service of the Revenue. Whatever you have laid up behind this board will be brought out. I shall make you fair return upon the wine.' }
      ],
      choices: [
        { text: 'Submit; admit the partial declaration; pay the duty and triple penalty if levied.',
          target: '3.5_after',
          effects: { exposure: -15, trust: -20, flags: { caughtPartial: true } },
          lesson: 'Voluntary submission brought *civil* penalties — a triple-value penalty for unpaid duty, recoverable as debt, but negotiable. Painful but survivable. The gang, however, treated such submissions as betrayal: every penalty paid by one man revealed the gang\'s tactics to the Customs solicitors.'
        },
        { text: 'Offer him a private gift — ten guineas in his pocket.',
          target: '3.4a_henwood_bribe',
          requires: { item: 'purse' }
        },
        { text: 'Strike the candle from his hand and go.',
          target: '3.4b_henwood_flee',
          effects: { exposure: +30, trust: +4 },
          lesson: 'Assault on a Customs officer was a felony. Boyse will admire the boldness in private and disclaim it in public. Your face is now a face every officer in the south will know.'
        }
      ]
    },

    '3.4a_henwood_bribe': {
      act: 3,
      title: 'A Refusal',
      image: 'assets/images/act3_henwood.jpg',
      caption: 'Mr. Henwood will not be bought.',
      body: [
        { dlg: 'Mr. Henwood', text: 'You mistake me, sir. Put up your purse. I shall pretend you did not offer it, but I shall not pretend the cargo is what it is not.' },
        'He calls for the Mayor\'s constable. The cargo will be condemned by writ of appraisement. Mr. Boyse will not be pleased.'
      ],
      choices: [
        { text: 'Bow, and bear it.',
          target: '3.5_after',
          effects: { exposure: +20, trust: -20, flags: { caughtBribery: true } },
          lesson: 'Honest officers existed in numbers contemporaries underestimated. An attempted bribe to an officer was illegal.'
        }
      ]
    },

    '3.4b_henwood_flee': {
      act: 3,
      title: 'A Run, and a Reckoning Postponed',
      image: 'assets/images/act3_flight.jpg',
      caption: 'Down the quay-stair, into a wherry, into the harbour.',
      body: [
        'You are upon the quay-stair before he has his candle relit. The harbour is full of small craft; you are aboard the Dolphin again.',
        'The cargo, however, is gone. Mr. Henwood will write his report. Your face has been seen by an honest officer.'
      ],
      choices: [
        { text: 'To Mr. Boyse, to give an account.',
          target: '3.5_after',
          effects: { exposure: +20, trust: -2 },
          lesson: 'A person suspected by an honest officer was already half-prosecuted. Henwood\'s report will go to the Collector at Poole, thence to the Solicitor in London who is now alert to your practices.'
        }
      ]
    },

    '3.5_after': {
      act: 3,
      title: 'A Counting House on the High, Portsmouth',
      image: 'assets/images/act3_counting.jpg',
      caption: 'A bare room, a great desk, a man behind it who does not rise.',
      audio: 'assets/audio/scene_3_5_counting_house.mp3', // a single ticking clock, fire
      body: [
        'Mr. **David Boyse** is forty-five years old, a wine-merchant by trade and a trafficker by profession, lately suspected of Jacobitical sympathies. His partners **John Hatch** and **John Sellers** stand at the window. He listens to your account with his hands folded.',
        { dlg: 'David Boyse', text: 'You have done tolerably, {{name}}. There is one further matter on which I require your particular service. Isaac Pulsom — my clerk — has asked leave to speak to me. Alone. I do not care for the look of him these last weeks.' },
        { dlg: 'David Boyse', text: 'Come to my house at Portsea by Thursday. We shall settle all our accounts together.' }
      ],
      onEnter: (s) => { s.flags.actThreeDone = true; },
      choices: [
        { text: 'Promise to attend.',
          target: '4.1_warning',
          effects: { trust: +8 },
          lesson: 'Boyse rewarded loyalty with greater secrets. To be summoned to his Portsea house was, in the gang\'s eyes, a sign of favour. It was also — though you do not yet know it — exactly the invitation that had been extended to a man called Crouch the night before you woke without your memory.'
        }
      ]
    },

    /* ====== ACT IV ====== */

    '4.1_warning': {
      act: 4,
      title: 'Tom Cooper, in a Tavern Yard',
      image: 'assets/images/act4_warning.jpg',
      caption: 'Cooper does not waste words; tonight he wastes very few.',
      audio: 'assets/audio/scene_4_1_tavern_yard.mp3', // wind in elms, distant tavern fiddle
      body: [
        'On the road from Portsmouth Tom Cooper steps from a hedge. He has the look of a man who has been waiting some hours and would rather be drinking.',
        { dlg: 'Tom Cooper', text: 'Pulsom is turned. He has been four days closeted with the Solicitor for the Customs in London, and the Inspector of Prosecutions besides. There is to be an *information* laid against you, against me, against half the men of the gang.' },
        { dlg: 'Tom Cooper', text: 'Mr. Boyse knows. He has known a fortnight. He sent for you to Portsea not for an account but to put you out of the way before you are taken. The same as he did to **Crouch** at the Crown Inn at Poole, the night before you woke without your memory.' },
        'You stand a long moment with no breath in you. You understand at last who you are, and what was done to you, and who did it. {{name}} is a name David Boyse meant should never speak again.*'
      ],
      onEnter: (s) => { s.flags.knowsBoyseTried = true; },
      choices: [
        { text: 'Go on to Portsea anyway. Confront him.',
          target: '5.1_face_boyse'
        },
        { text: 'Flee to Jersey before the writ is served.',
          target: '4.2_flee',
          effects: { trust: -4 },
          lesson: 'Flight was the smuggler\'s last option but a recognised one. The Channel Islands offered legal refuge — English warrants ran there only by special procedure and rarely — but flight signalled to the gang that you had broken faith, and confederates left behind would feel free to inform on a man who was no longer a danger to them.'
        },
        { text: 'Turn the King\'s evidence yourself — before Pulsom\'s deposition can take effect.',
          target: '4.3_inform',
          effects: { trust: -20, exposure: -10 },
          lesson: 'Pre-empting another informer was the cleverest of last resorts. The Crown might still reward you most generously: full pardon, maybe a cash bounty, and protection from prosecution. But turning King\'s evidence destroyed every relationship in the gang at once — and one of them, before nightfall, would try to kill you.'
        }
      ]
    },

    '4.2_flee': {
      act: 4,
      title: 'A Boat from Christchurch',
      image: 'assets/images/act4_flight.jpg',
      caption: 'A small lugger, no papers, the wind contrary.',
      body: [
        'You take a fishing lugger out of Christchurch with a man who asks you no questions because he asks none to any. You make St Helier in two days. Le Brun, the Jerseyman, takes you in.',
        'A letter follows, by another bottom, in a hand you know. It is from David Boyse.',
        { dlg: 'David Boyse', text: '{{name}}, you have run. You have done well. Come to Portsea when the heat is off and we shall yet make a good thing of it. — B.' },
        'You do not believe him. You know now what awaited Crouch at the Crown.'
      ],
      choices: [
        { text: 'Return secretly to England to confront David Boyse.', target: '5.1_face_boyse' },
        { text: 'Stay in Jersey. Forsake the running trade for ever.',
          target: '5.4_honest',
          effects: { flags: { exiledHonest: true } }
        }
      ]
    },

    '4.3_inform': {
      act: 4,
      title: 'The Custom House, London',
      image: 'assets/images/act4_inform.jpg',
      caption: 'Stairs of stone, a long wait, a man with two pens.',
      audio: 'assets/audio/scene_4_3_london_customs.mp3', // rain on lead roof, distant bell
      body: [
        'You walk into the Custom House upon the Thames and ask for the **Solicitor for Criminal Prosecutions**. Pulsom is there before you. He is surprised to see you, and his surprise turns within a quarter of an hour to anger, and then to a kind of rueful nod.',
        { dlg: 'The Solicitor', text: '{{name}}, your information will be received. The terms are these. You will be sworn; you will give evidence against David Boyse, John Hatch, John Sellers, and their confederates upon all the matters within your knowledge. In return, His Majesty will be graciously pleased to issue a pardon for your part in the same matters.' },
        'You sign your name, and another, and another. A clerk fetches you bread and small beer. You receive a *King\'s pardon, sworn,* upon condition.'
      ],
      onEnter: (s) => { s.flags.turnedKingsEvidence = true; s.flags.customsProtected = true; },
      choices: [
        { text: 'On to Portsea. The Customs will move on Boyse\'s house at dawn.',
          target: '4.4_boyse_taken',
          effects: { addItem: 'pardon', exposure: -20, trust: -10 },
          lesson: 'A sworn pardon eliminated nearly all your legal exposure but cost you every friend at once. In the historical case, the clerk Pulsom\'s evidence broke the Boyse syndicate, but looked over his shoulder the rest of his life.'
        }
      ]
    },

    /* ============================================================
       EVIDENCE-TURNED AFTERMATH
       ------------------------------------------------------------
       Once the player has sworn to the King\'s evidence, two things
       follow without further choice on his part:
         (1) Boyse and his confederates are taken upon the warrant
             prepared from the player\'s deposition; and
         (2) the gang — what remains of it — gathers itself for a
             reprisal. Whether that reprisal finds its man is a
             matter of luck, of the player\'s wealth, and of the
             vigilance of the Crown agents charged with his safety.
             It is settled by a roll, weighted by the player\'s
             accumulated standing (Trust) and resources (Purse).
       The protection flag `customsProtected` is by now in force, so
       no auto-threshold can divert the player off this track.
       ============================================================ */

    '4.4_boyse_taken': {
      act: 4,
      title: 'Portsea, Before Dawn — A House Surrounded',
      image: 'assets/images/act5_betray.jpg',
      caption: 'Twenty constables and a serjeant of dragoons in the lane behind the High.',
      audio: 'assets/audio/scene_4_4_arrest.mp3', // hobnails on cobbles, a knock, a calling-out
      body: [
        'The Solicitor moves with the dispatch of a man who has waited some months for this morning. Before the bells of St. Thomas have rung six, *David Boyse* is taken in his own bedchamber, with the warrant of attachment read out at the foot of the bed in the presence of Mrs. Boyse, who does not weep. *John Hatch* is taken at the same hour in his lodgings at Gosport. *John Sellers*, forewarned by no one knows whom, is already past the Solent in a wherry, and will not be seen in England again.',
        'You are not present at the taking. You watch from a closed coach in Portsea Common, in the keeping of a *Mr. Yarrow*, assistant to the Solicitor, who has been instructed not to lose sight of you for any cause whatever. He pours a glass of small beer from a flask and hands it to you without comment.',
        { dlg: 'Mr. Yarrow', text: '{{name}}, it falls to me to say what the Solicitor has not the leisure to. You are now, a person of *considerable danger to certain other persons*, and of *considerable interest* to His Majesty\'s officers. We shall convey you presently into the country under another name. Whether the certain other persons find you there before the Crown can hide you — that is between you, your purse, and your providence.' }
      ],
      onEnter: (s) => { s.flags.boyseArrested = true; },
      choices: [
        { text: 'Set out at once for the safe-house, by the back roads.',
          target: '4.5_evidence_roll',
          effects: { exposure: -10 },
          lesson: 'The Crown\'s practical protection of its principal informers was rudimentary but real: transit by night, lodging in a private house under the supervision of a Customs officer.'
        },
        { text: 'Spend the day in Portsmouth first, settle small debts, and travel by stage at evening.',
          target: '4.5_evidence_roll',
          effects: { trust: -20 },
          lesson: 'An informer who took his leisure in his own port — even to close honest business — gave the gang a window in which to act..'
        }
      ]
    },

    /* The roll. Result depends on three inputs:
         * trust  — paradoxically, the smuggler with high trust has
                    more friends *outside* the gang willing to shelter
                    him; the smuggler with low trust has none.
         * purse  — coin buys silence on the post-roads.
         * a die  — providence, which the Customs do not survey.
       Cumulative score ≥ 50 → safe ending; otherwise kidnap. */

    '4.5_evidence_roll': {
      act: 4,
      title: 'A Coach Out of Portsmouth, by Stages',
      image: 'assets/images/act4_flight.jpg',
      caption: 'Five and forty miles to the next safe roof, and providence between.',
      audio: 'assets/audio/scene_4_5_coach.mp3', // wheel on chalk, harness, the wind in elms
      body: [
        'The coach leaves Portsmouth in the evening. You are conducted as far as Petersfield by Mr. Yarrow, who there delivers you into the hands of a Mr. Page (riding officer of the eastern district, lately reassigned to private duties on the Solicitor\'s order). Page is a sober man, civil, and very alert. He carries a brace of pistols and the address of a parsonage at Mayfield.',
        'You are now on the road, with the night closing in, and somewhere behind you the remnants of a syndicate that has lost everything and has only one piece of business left to settle.'
      ],
      onEnter: (s) => {
        // Settle the roll once; subsequent re-entries return the same outcome.
        if (typeof s.flags.evidenceRoll === 'undefined') {
          const trustScore = Math.max(0, Math.min(40, s.trust * 0.6));
          const purseScore = s.items && s.items.indexOf('purse') >= 0 ? 15 : 0;
          const die        = Math.floor(Math.random() * 40);
          s.flags.evidenceRoll = Math.round(trustScore + purseScore + die);
        }
      },
      choices: [
        { text: 'See what providence has set for you on the road.',
          target: (s) => ((s.flags.evidenceRoll || 0) >= 50 ? '4.6_evidence_safe' : '4.6_evidence_kidnap')
        }
      ]
    },

    '4.6_evidence_safe': {
      act: 4,
      title: 'A Parsonage at Mayfield — Three Months Later',
      image: 'assets/images/act5_honest.jpg',
      caption: 'A small upper room, a window of leaded glass, no name upon the door.',
      audio: 'assets/audio/scene_4_6_parsonage.mp3', // a coal fire, a slow clock, distant rooks
      body: [
        'You are lodged, by the Solicitor\'s contrivance, in the upper room of a parsonage at Mayfield, in the Sussex weald. Under a different name and a face altered by a winter beard. The rector, a man of quiet sympathies and little curiosity, asks no question that does not concern the weather.',
        'In March of 1726 you are conveyed, by another stage, to a small farm at *Stiffkey* in the county of Norfolk, where you are to live out your days as Hollings, late of the Bristol coasting trade. You take a spouse in 1729 and bury them in 1741. Three of your four children survive you. None of them ever hears the name *Boyse* under any roof of yours.',
        'In 1733 a small book reaches you by the post — *The Report of the Committee Appointed to Inquire into the Frauds and Abuses in the Customs*. You read in it the names of every man you ever sailed with. Your own name is not in it. The Solicitor\'s discretion has been complete.',
        'Boyse, you read, escaped from the Fleet and disappeared; Hatch died in prison in 1732; Cooper at sea, of fever, off Antigua, in 1731. Pulsom married a widow in Stepney and kept a small chandlery. Of yourself the *Report* says nothing whatever.'
      ],
      ending: true,
      endingTitle: 'An Ending — A Quiet Norfolk Name',
      endingFlag: 'FINIS — THE WITNESS PRESERVED',
      endingHtml: `
        <p>The Crown protected its principal informers when it could. 
        <p>The historical clerk <strong>Isaac Poulsum</strong> survived his
        evidence and lived to see the
        printed <em>Report</em> of 1733 in which his name appears only as a
        deponent and not as a defendant. Whether he was "made through safe"
        by Crown protection or by sheer providence is a question the records
        do not answer.</p>
      `
    },

    '4.6_evidence_kidnap': {
      act: 4,
      title: 'A Coaching Inn at Petworth, by Lantern-Light',
      image: 'assets/images/act4_betrayed.jpg',
      caption: 'Mr. Page does not return from the stable; the lantern is brought by another hand.',
      audio: 'assets/audio/scene_4_6_kidnap.mp3', // a stable lantern, a horse blowing, no voices
      body: [
        'The coach changes horses at Petworth at half past nine. Mr. Page steps down to see to the harness. He does not return. A lantern presently is held up at the coach window by a man you have never seen, and a voice says, in a level Hampshire accent, *{{name}}, will you alight*.',
        'You alight. There are three men. The fourth (you understand later) is Mr. Page, lying behind the stable with a quiet wound and little breath. The pistols are taken from his belt and from yours. You are walked, very civilly, into the inn-yard and through a side gate into a green lane, and along the lane to a small wood, where there is a horse waiting and a length of rope.',
        'You do not see any face you recognise. They speak very little. One of them tells you, almost kindly, that Mr. Boyse sends his particular regards from the King\'s Bench prison, and that the matter is not personal but professional. *They go quite slowly. They are not in any hurry.*',
        'In the morning, a labourer crossing the wood finds you, and the Solicitor for the Customs writes a careful letter to the Commissioners which is not, in its substance, made public.'
      ],
      ending: true,
      endingTitle: 'An Ending — The Gang\'s Last Errand',
      endingFlag: 'FINIS — THE INFORMER\'S WAGE',
      endingHtml: `
        <p>Informers were murdered or kidnapped in this period.
        The most famous case is that of Daniel Chater and William Galley
        (1748), murdered by the Hawkhurst gang while in the custody of Customs
        officers en route to give evidence. Their deaths produced an aggressive prosecution by the government and the Duke of Richmond.
             </p>
      
      `
    },

    /* ====== ACT V ====== */

    '5.1_face_boyse': {
      act: 5,
      title: "David Boyse's House at Portsea — Thursday",
      image: 'assets/images/act5_boyse.jpg',
      caption: 'A respectable double-fronted house upon the High; a fire in the parlour.',
      audio: 'assets/audio/scene_5_1_boyse_parlour.mp3', // single clock, fire crackling, one voice
      body: [
        'Mr. Boyse greets you with the same folded hands. John Hatch sits in a corner cleaning a pistol. John Sellers stands at the window. Boyse sees in your face that you know.',
        { dlg: 'David Boyse', text: 'Crouch was a fool, {{name}}, and you were the unhappy companion of his folly. He had begun to talk where he should have been silent. The *physic* was meant for him alone; you took the cup he had set down. I am sorry for it. I am not so sorry that I would have undone it.' },
        { dlg: 'David Boyse', text: 'Five things may happen in the next quarter of an hour. Choose carefully, sir. I should be sorry to have you killed; sorrier still, perhaps, to be killed myself.' }
      ],
      choices: [
        { text: 'Betray him to the Customs at the door — for the £500 informer\'s reward.',
          target: '5.3_betray',
          effects: { trust: -60, exposure: -10 },
          lesson: 'Selling Boyse in his own parlour was the most absolute breach the running trade knew. The £500 reward bought the Crown\'s gratitude — and forfeited every friend at once. *Trust falls to nothing*: in the language of the trade, you are now a man whose word no smuggler will take, in any port from Falmouth to the Forth. Defoe observed of such informers that they were "the best paid and least loved of all His Majesty\'s servants".'
        },
        { text: 'Walk out. Take a cottage in the Purbecks. Live honest, however slow.',
          target: '5.4_honest'
        },
        { text: 'Smile. Dissemble. Plan a *private* revenge for what was done to Crouch — and to you.',
          target: '5.6_revenge_plot',
          effects: { trust: +4, exposure: +2 },
          lesson: 'Within the smuggling gangs personal revenge was a form of justice.'
        },
        { text: 'Speak fair to Boyse — propose a *heroic last run* that will put you above suspicion: a passenger out of France, by his own request.',
          target: '5.8_jacobite_offer',
          effects: { trust: +8 },
          lesson: 'A proposal of useful service was the conventional way to recover from a near-fatal breach. Smuggling vessels were the standard conveyance of political fugitives between France and England — the Channel ports were as porous to people as to brandy. To volunteer for such a passage was to ask for the gang\'s last and most dangerous confidence.'
        },
        { text: 'Walk straight from this room to the Custom House in London and place yourself in His Majesty\'s service.',
          target: '5.7_customs_alliance',
          effects: { trust: -30, exposure: -6 },
          lesson: 'A smuggler who walked into the Customs of his own accord — not merely to inform but to *enlist* — was a creature contemporaries thought rarer than he was. But several did and were later appointed to deliver warrants or even as junior officers.'
        }
      ]
    },

    '5.3_betray': {
      act: 5,
      title: 'The Reward, the Cell, the Coast',
      image: 'assets/images/act5_betray.jpg',
      caption: 'A constable\'s lantern at the door; a writ of capias drawn upon a trembling clerk.',
      body: [
        'You whistle. The constables come in from the street. David Boyse, who has lived by anticipating the law, is taken by it at last in his own parlour. John Hatch is taken at the window. John Sellers escapes through the kitchen and is never seen in England again.',
        'The reward of £500 is paid to you in two purses by the Solicitor for Criminal Prosecutions, with the customary discount. Boyse and Hatch are tried in the Court of Exchequer in London. Hatch will die in the Fleet Prison, his estate insufficient to pay the penalties. The records of the prosecution will be sent up to a Committee of the House of Commons in 1733, and printed.',
        'Your name does not appear in the printed *Report*. You have been careful, and you have been useful, and you have been paid. There are quieter towns than Portsmouth, and you mean to find one.'
      ],
      ending: true,
      endingTitle: 'An Ending — The Informer\'s Reward',
      endingFlag: 'FINIS — THE BETRAYAL',
      endingHtml: `
        <p>This ending mirrors the path of <strong>Isaac Poulsum</strong>, Boyse's clerk,
        who became the principal witness in the 1725 prosecution and gave evidence to
        the 1733 Committee.</p>
        <p>Informer's rewards under the revenue laws were substantial — typically a share
        of the condemned goods plus a statutory bounty — but the social cost was
        permanent. Successful informers commonly relocated; some were assaulted, kidnapped or even murdered.</p>
      `
    },

    '5.4_honest': {
      act: 5,
      title: 'A Cottage above Studland, Five Years Hence',
      image: 'assets/images/act5_honest.jpg',
      caption: 'A garden of beans, a view of Old Harry, a small school for the parish boys.',
      body: [
        'You take a cottage in the Purbecks under another name. The work is poor and the bread is plain; the wind is loud at night. From the cliff you can see, on a clear day, the very offing in which the Dolphin used to lie waiting for her signal. You do not lie awake.',
        'In 1733 a small printed book is brought into the village by a peddler — *The Report of the Committee Appointed to Inquire into the Frauds and Abuses in the Customs.* You read it from cover to cover by candle. Your name is not in it. Boyse\'s is. Hatch is dead in the Fleet. Sellers, you read, "is a fugitive, and supposed to be in Jersey".',
        'You shut the book. There is bread to be made, and a Latin lesson to set for a boy who does not yet know how lucky he is.'
      ],
      ending: true,
      endingTitle: 'An Ending — A Quiet Coast',
      endingFlag: 'FINIS — THE HONEST LIFE',
      endingHtml: `
        <p>Most smugglers who survived prosecution did so by retreating into legitimate
        trade or rural obscurity. The 1720s were the pivotal decade in which Parliament
        and the Customs <em>began</em> to criminalise smuggling — earlier, it had been
        prosecuted almost entirely as a civil matter for the recovery of duties.</p>
        <p>The Hawkhurst gang, who landed cargoes on the Sussex coast through the 1730s
        and 1740s, were broken up only after the murder of an officer in 1748.</p>
      `
    },

    '5.5_one_more': {
      act: 5,
      title: 'The Last Run — The Lizard, February 1726',
      image: 'assets/images/act5_lastrun.jpg',
      caption: 'A heavy sea at the Lizard; an East-Indiaman lying-to off the Manacles.',
      sailing: {
        title: 'To the Lizard — under sail',
        text: 'Wind: *gale from the south-west*, force eight and rising. Tide: ebb, running hard along the reef. The Dolphin runs under storm canvas alone, course west by north for the Manacles. Visibility a half-mile and closing. The Lizard light shows now and again through the spray. The East-Indiaman *Bohea* is reported lying-to in the Soundings.'
      },
      body: [
        'You and Boyse make terms. One run, one cargo: three hundred chests of *Bohea* tea, transhipped from an East-Indiaman in the Soundings, to be landed in coves between the Lizard and Mount\'s Bay. The profit will be three thousand pounds at least.',
        'In February, in a sea that has set the very lighthouses asway, you bring the Dolphin up under the lee of the Manacles and take aboard the chests by the lantern of a man whose name you never learn. The shore-party is waiting at Cadgwith Cove. The wind is right. The Customs are watching the Sussex coast, where you are not.',
        'Two miles from the cove, in the worst of the squall, the Dolphin strikes the outer Manacles and goes down in seven fathom.'
      ],
      choices: [
        { text: 'See what becomes of you.',
          target: (s) => (s.trust >= 60 ? '5.5a_lastrun_lucky' : '5.5b_lastrun_unlucky')
        }
      ]
    },

    '5.5a_lastrun_lucky': {
      act: 5,
      title: 'A Survivor, on a Spar',
      image: 'assets/images/act5_lastrun.jpg',
      caption: 'A Cornish farmer drags you up the shingle; you cough out half the Channel.',
      body: [
        'Of the Dolphin\'s company, four are saved. Cooper is one. David Boyse is not. The cargo is wholly lost, but so is the *witness*: with Boyse dead, Pulsom\'s deposition has no head to fall upon, and the prosecutions fall away one by one. John Hatch is held for debt only, and even he, in time, walks free.',
        'You and Cooper take a passage to the Indies upon a Bristol ship and are not seen in England again. You drink, in some distant port, to the memory of the Dolphin and the curious mercy of bad weather.'
      ],
      ending: true,
      endingTitle: 'An Ending — The Last Run',
      endingFlag: 'FINIS — A FUGITIVE TRIUMPH',
      endingHtml: `
        <p>Catastrophic shipwreck was a risk of the running trade.
        
        <p>Real smugglers who fled successfully often went to the colonies — the
        American seaboard, the West Indies, and the Channel Islands — where the trade
        was congenial and English warrants reached only with great delay, if at all.</p>
      `
    },

    '5.5b_lastrun_unlucky': {
      act: 5,
      title: 'The Fleet Prison, London — 1731',
      image: 'assets/images/act5_fleet.jpg',
      caption: 'A debtor\'s gallery; a gaol-fever; a clerk crossing names from a list.',
      body: [
        'You are saved from the Manacles only to be taken at Falmouth, three weeks later, by a constable acting upon Pulsom\'s information. The Court of Exchequer condemns you to the triple value of the cargo lost — £10,500 — which exceeds your estate, your bond, and any reasonable hope of payment.',
        'You are remanded first to Newgate, then to the Marshalsea, and at last to the Fleet, where John Hatch already lies. *The mousetrap had snapped shut.* You hear, in 1733, that a Committee of the House of Commons has begun an inquiry into your sort of business.',
        'You will not see its conclusion.'
      ],
      ending: true,
      endingTitle: 'An Ending — The Fleet',
      endingFlag: 'FINIS — THE MOUSETRAP',
      endingHtml: `
        <p>This ending follows the actual fate of <strong>John Hatch</strong>, Boyse's
        partner, whose combined penalties exceeded £55,000. He spent the last seven
        years of his life in three London debtors\' prisons — Newgate, the Marshalsea,
        and finally the Fleet, where he died in 1732.</p>
        
      `
    },

    /* ====== ACT V — REVENGE ARC ====== */

    '5.6_revenge_plot': {
      act: 5,
      title: 'A Bow Made of Smiles, an Arrow Made of Time',
      image: 'assets/images/act5_boyse.jpg',
      caption: 'You sit by the fire and agree to everything; the agreement is a lie.',
      audio: 'assets/audio/scene_5_6_revenge_fire.mp3',  // a low fire, a clock, a held breath
      body: [
        'You smile. You take Mr. Boyse\'s offered glass. You agree, in plain terms, to forget Crouch and the cup at the Crown. Mr. Boyse, watching you over the brim of his Madeira, judges himself reprieved. He is wrong.',
        'You go out into the evening with your mind already at the work. *Revenge* in the running trade was not a clean business. You will need a confederate; you will need a hook; you will need a place. You walk down to the harbour.',
        { dlg: 'Tom Cooper, met at the slipway', text: 'You have a black look, sir. I have known that look in worse men than you, and it does not lift until something is buried.' }
      ],
      onEnter: (s) => { s.flags.revengeBegun = true; },
      choices: [
        { text: 'Take Cooper into your confidence. The Dolphin\'s master has reasons of his own.',
          target: '5.6a_revenge_recruit',
          effects: { trust: +4 },
          lesson: 'Smuggling masters resented their employers as often as they served them. Cooper has watched Boyse abandon men before — Crouch is only the most recent. To enlist him is to enlist the gang\'s practical knowledge against its head.'
        },
        { text: 'Approach Pulsom in London — the clerk who has already turned — and offer him a private supplement.',
          target: '5.6a_revenge_pulsom',
          effects: { trust: -4, exposure: -4 },
          lesson: 'The historical clerk Isaac Poulsum was already feeding evidence to the Customs Solicitor in 1725. A man who has chosen to inform can usually be persuaded to inform *more* — but the cost is your own further exposure to the same papers and depositions.'
        },
        { text: 'Plant a *forged debenture* in Boyse\'s own counting house, traceable in his own hand.',
          target: '5.6a_revenge_forge',
          requires: { item: 'cocket' },
          effects: { exposure: +6, trust: -2 },
          lesson: 'Forging a customs document and planting it on the principal was the smuggler\'s equivalent of poisoning a well. It was high risk: a clumsy forgery would be detected by anyone familiar with the documents who examined it closely.'
        }
      ]
    },

    '5.6a_revenge_recruit': {
      act: 5,
      title: 'A Bargain in a Cordage Loft',
      image: 'assets/images/act3_counting.jpg',
      caption: 'Two men, a candle, a coil of two-inch hemp.',
      audio: 'assets/audio/scene_5_6_loft.mp3',  // a wick, a slow drip, a creaking floor
      body: [
        { dlg: 'Tom Cooper', text: 'You wish him hanged, sir? I wish him *seen* hanged. He sent Will Banks ashore at Cuckmere Haven last December with a ball in the lungs, and another in the back of the leg, and he did not so much as fetch his widow her stipend. Banks was my cousin.' },
        'Cooper sets out the practical course. Boyse will be in his counting house on Tuesday next, when the Lebec receipts come in from Calais. The clerk Pulsom will be in London. The partners Hatch and Sellers will be at Hatch\'s house at Gosport, three miles distant by water.',
        { dlg: 'Tom Cooper', text: 'It must be the receipts that take him. Coin we can hide, but a Frenchman\'s name in a Frenchman\'s hand is what the Court of Exchequer wants. We get those receipts into Mr. Henwood\'s pocket, sir, and we have him.' }
      ],
      choices: [
        { text: 'Agree. You will get into the counting house yourself, by a forged note from Lebec.',
          target: '5.6b_revenge_strike',
          effects: { trust: +4, exposure: +6 },
          lesson: 'Recovering documentary evidence from a smuggler\'s own counting house was how the 1725 prosecution made its case. The clerk Poulsum carried Lebec\'s receipts and Boyse\'s ledger out the back door at Portsea in November 1725; the Solicitor read them by candlelight for three weeks before the indictment was framed.'
        },
        { text: 'Set Cooper to do it; you will keep clear and provide an alibi.',
          target: '5.6b_revenge_strike',
          effects: { trust: -2, exposure: -2, flags: { revengeAlibi: true } },
          lesson: 'Distance was sometimes wisdom. In the historical case, the prosecution\'s difficulty was always finding a witness who could swear against the accused.'
        }
      ]
    },

    '5.6a_revenge_pulsom': {
      act: 5,
      title: 'A Letter to the Clerk',
      image: 'assets/images/act3_letter.jpg',
      caption: 'Pulsom\'s reply is in the same careful hand that kept Boyse\'s ledger.',
      audio: 'assets/audio/scene_5_6_letter.mp3',  // pen on paper, a fire whisper, no voices
      body: [
        'You send word to Pulsom by a private hand at Salisbury. The clerk, frightened still but no longer surprised at any quarter from which danger comes, writes back within the week:',
        { dlg: 'Isaac Pulsom, by his own hand', text: '{{name}} — The Solicitor in London takes my information slowly, slowly. He wants the *Dunkirk* receipts, which Mr. Boyse keeps in a locked drawer of his counting house at Portsea. If those came into my custody, sir, the Solicitor would press the prosecution within a fortnight.' },
        'He sends with the letter a sketch of the counting house, the position of the drawer, and the form of key. He does not sign his name to the sketch.'
      ],
      onEnter: (s) => { s.flags.pulsomAllied = true; },
      choices: [
        { text: 'Burgle the counting house yourself. Get the receipts. Send them to London.',
          target: '5.6b_revenge_strike',
          effects: { exposure: +10, trust: -2 },
          lesson: 'Burgling a smuggler\'s counting house was not, in the law of 1725, a small thing — it was a felony in addition to whatever revenue matter the documents touched. But the evidentiary value of the Dunkirk receipts would be decisive.'
        }
      ]
    },

    '5.6a_revenge_forge': {
      act: 5,
      title: 'A Forgery in Two Hands',
      image: 'assets/images/act3_letter.jpg',
      caption: 'You have the blank cocket; what you need is Boyse\'s own seal.',
      audio: 'assets/audio/scene_5_6_forgery.mp3',  // a scratching nib, a faint clock, a sigh
      body: [
        'You take the blank cocket you carried out of Calais and you compose, upon it, a fictitious export of three hundred chests of Bohea tea from Portsmouth to Ostend, valued at £4,200, made out in *Mr. David Boyse\'s name* and counter-signed (in your own carefully-imitated hand) by the corrupt Mr. Reeve at the Poole Custom House.',
        'It is good work. It is good enough to be tested. It will be planted in Boyse\'s own counting house, where it will purport to be a paper Boyse had concealed — and then, by an anonymous letter to the Custom House solicitor, it will be discovered.'
      ],
      choices: [
        { text: 'Plant the forgery in Boyse\'s counting house on Tuesday next.',
          target: '5.6b_revenge_strike',
          effects: { addItem: 'cocket', exposure: +4, trust: -4 },
          lesson: 'Counter-forgery was one of the smuggling trade\'s darker arts. The Solicitor learned, by the 1730s, to authenticate any paper produced against a known runner.'
        }
      ]
    },

    '5.6b_revenge_strike': {
      act: 5,
      title: 'A Counting House at Portsea, by Night',
      image: 'assets/images/act3_counting.jpg',
      caption: 'A drawer, a key, a half-page in another man\'s hand.',
      audio: 'assets/audio/scene_5_6_strike.mp3',  // floorboards, the click of a wardstock lock
      body: [
        'On the Tuesday agreed, with a borrowed pick and a borrowed key, the counting house is entered between the small hours of two and four. The drawer, in the corner cabinet, opens. The Calais receipts — or your forgery — pass from one place to another in a single careful movement.',
        'You are out of the house before the dawn chorus. A boy from Gosport carries your packet (sealed with another man\'s seal) up the coach road to London.',
        'Three weeks pass. Then, all at once, the law moves.'
      ],
      choices: [
        { text: 'See what follows.',
          target: (s) => (s.trust >= 45 ? '5.6c_revenge_success' : '5.6c_revenge_blowback')
        }
      ]
    },

    '5.6c_revenge_success': {
      act: 5,
      title: 'Mr. Boyse Taken — A Reading of the Information',
      image: 'assets/images/act5_betray.jpg',
      caption: 'A constable in the doorway; a sealed writ; a great clock that no longer matters.',
      body: [
        'On the morning of the 18th of November 1725, an information *ad personam* is laid against **David Boyse** in the Court of Exchequer, founded upon receipts from one Pierre Lebec of Calais, identified in Mr. Boyse\'s own hand, and corroborated by the deposition of his clerk Isaac Pulsom. John Hatch is indicted in the same suit. The Solicitor moves for committal.',
        'Mr. Boyse is taken at his counting house. He does not resist. He looks once at the constable, once at his locked drawer, and then he asks (with what dignity a man can keep, who has been bested by his own bookkeeping) for an hour to set his affairs.',
        'You stand in the street as he is led out. He sees you. He does not smile.',
        'Three weeks later you receive an anonymous letter, in a hand that resembles Tom Cooper\'s only in being illiterate enough not to be traced. It tells you that John Sellers has fled to Jersey, that Hatch is in the Fleet, and that you are to be at the Bull Inn at Stockbridge on the third Tuesday of next month, if you would receive a portion of what Boyse has paid the Crown by way of forfeiture.'
      ],
      ending: true,
      endingTitle: 'An Ending — A Private Reckoning',
      endingFlag: 'FINIS — REVENGE',
      endingHtml: `
        <p>Revenge prosecutions within the smuggling syndicates were less famous than
        Crown prosecutions but they occured, brought by unhappy confederates or those simply seeking to save themselves. </p>
        <p>In the case of <strong>David Boyse</strong>, the actual prosecution was
        made possible by his own clerk Isaac Poulsum, who
        delivered receipts and ledger pages to the Customs Solicitor in
        1725. Boyse was ultimately convicted in penalties
        far exceeding his estate — a fate from which his partners John Hatch and John Sellers did
        not escape.</p>
        <p>Whether the private hand that closed upon him deserved the reward that the
        Crown paid for the same evidence is a question the Court of Exchequer
        did not concern itself with.</p>
      `
    },

    '5.6c_revenge_blowback': {
      act: 5,
      title: 'A Forgery Detected',
      image: 'assets/images/act4_writ.jpg',
      caption: 'The Solicitor for Criminal Prosecutions reads the paper twice; the second reading is slower.',
      body: [
        'The Solicitor in London is no fool. He compares the planted cocket to two other documents under Boyse\'s hand — one a wine-contract in the Customs records, one a private note from a Bristol receiver — and finds the imitation creditable but not faithful. The flourish on the *B* is wrong. The counter-signature of Mr. Reeve, who is suspected on his own account, is plainly forged: the date is two days after Reeve was confined to his bed with the gout.',
        'A constable comes for *you*, not for Boyse. You have a half-hour\'s warning, by Cooper, and you have lost it twice already in this story. There will not be a third such warning.',
        'You are taken at the Star Inn at Romsey and brought before the Solicitor in person.'
      ],
      ending: true,
      endingTitle: 'An Ending — The Forger Forged',
      endingFlag: 'FINIS — A FALSE COCKET',
      endingHtml: `
        <p>Forgery of customs documents was a separate offence and could bring prosecution against the forger.</p>
    
      `
    },

    /* ====== ACT V — CUSTOMS ALLIANCE ARC ====== */

    '5.7_customs_alliance': {
      act: 5,
      title: 'A Walk to London, a Door at the Custom House',
      image: 'assets/images/act4_inform.jpg',
      caption: 'A long flight of stone stairs; a porter at the head; a clerk with two pens.',
      audio: 'assets/audio/scene_5_7_customs_stairs.mp3',  // hobnails on stone, distant Thames bells
      body: [
        'You leave Mr. Boyse\'s parlour with a civil bow and walk, by coach and stage, the hundred and twelve miles to London. You take a chamber off Tower Hill. You shave. You write, in a careful hand, a letter to the **Solicitor for the Customs**, requesting an audience — not as an informer in the ordinary sense, but as a *practitioner of the trade desirous of His Majesty\'s commission*.',
        'You are received, on the third day, by the Solicitor and by a sober gentleman introduced as **Mr. Carkesse, Comptroller of the King\'s Cocketts**. They listen, with a long professional patience, to what you have to say.',
        { dlg: 'The Solicitor for the Customs', text: '{{name}}. The Crown has from time to time taken into its service persons who have stood, formerly, against its revenues. Such people can be useful, if they bring with them not only knowledge but also discipline. You will be examined. You will be sworn. You will not be paid until you have proved yourself. Do you accept?' }
      ],
      choices: [
        { text: 'I accept. Examine me, sir, upon the running trade of the south coast.',
          target: '5.7a_customs_oath',
          effects: { trust: -4, exposure: -4 },
          lesson: 'The Customs employed former smugglers who had turned evidence throughout the early 18th century.'
        },
        { text: 'I will inform under condition only: I shall not be required to serve the Customs further.',
          target: '5.7a_customs_informer',
          effects: { trust: -2, exposure: -2 },
          lesson: 'There was a fundamental legal distinction between an *informer* (who supplied evidence and received a bounty) and an *officer* of the Customs.'
        }
      ]
    },

    '5.7a_customs_oath': {
      act: 5,
      title: 'The Oath of Office',
      image: 'assets/images/act4_inform.jpg',
      caption: 'A Testament; a printed form; a clerk who has heard the words many times.',
      audio: 'assets/audio/scene_5_7_oath.mp3',  // one voice reading, paper handled, no music
      body: [
        'You are sworn before two Commissioners of the Customs upon the following form:',
        { html: '<p style="font-style:italic;color:var(--ink-soft);padding:8px 12px;border-left:3px solid var(--wax-red);margin:8px 0;">I, {{name}}, do swear that I will faithfully and diligently execute the office of <strong>Surveyor of the Coasts</strong> committed unto me, that I will discover all frauds against the duties of His Majesty\'s Customs that shall come to my knowledge, and that I will neither take, nor cause to be taken, any consideration, gift, or reward, for the breach of His Majesty\'s laws. So help me God.</p>' },
        'You sign. The Solicitor counter-signs. You are paid a half-quarter\'s salary in advance, in coin, and given a *staff of office* tipped in iron and a letter to the Collector at Portsmouth instructing him to receive you upon his establishment.'
      ],
      onEnter: (s) => { s.flags.sworn = true; s.flags.customsProtected = true; },
      choices: [
        { text: 'Return to the south coast as an officer.',
          target: '5.7b_customs_sting',
          effects: { addItem: 'pardon', trust: -10, exposure: -10 },
          lesson: 'The 1725 Customs Establishment listed 1,107 sworn officers in England and Wales, of whom only a few hundred served as riding officers on the south coast — a thin line indeed, against an estimated 20,000 persons who took some part in the running trade. The Crown commissioned every competent former smuggler it could persuade.'
        }
      ]
    },

    '5.7a_customs_informer': {
      act: 5,
      title: 'A Bounty, a Note of Hand, a Quiet Door',
      image: 'assets/images/act4_inform.jpg',
      caption: 'No oath; no staff; only a name in a locked book.',
      body: [
        { dlg: 'The Solicitor', text: 'As you wish, sir. You shall be no officer, but a *private informer* upon a private agreement. The Crown\'s bounty will be in proportion to the goods condemned. The Crown\'s protection extends so far as the bounty, and not, I am bound to say, an inch farther.' },
        'You receive £50 in advance and the address of a Mr. Yarrow, an attorney near Lincoln\'s Inn, through whom your communications shall pass. Your name is written, by another hand, in a book that no smuggler will ever see.'
      ],
      onEnter: (s) => { s.flags.informerOnly = true; s.flags.customsProtected = true; },
      choices: [
        { text: 'Return to the south coast.',
          target: '5.7b_customs_sting',
          effects: { trust: -6, exposure: -4 },
          lesson: 'Private informers were the Customs\' true intelligence service.'
        }
      ]
    },

    '5.7b_customs_sting': {
      act: 5,
      title: 'A Sting at Pevensey, by the Same Beach',
      image: 'assets/images/act2_landing.jpg',
      caption: 'The same shingle; a different signal; a different conclusion.',
      audio: 'assets/audio/scene_5_7_sting.mp3',  // surf, distant horse, an unfamiliar whistle
      body: [
        'You arrange, by your old confederate Cooper (who has been told nothing of your new employment), a landing of brandy at Pevensey on the night of the 9th of December. You are the *clerk*: you will go down to the beach with the gang, set the signal, count the tubs.',
        'What Cooper does not know is that Captain Pigram of the *Greyhound* has been instructed to lie three miles offshore until your second signal, and that twenty-eight dragoons of the King\'s Own are bivouacked behind the dunes.',
        'The Dolphin comes in. The tubs are ashore in twenty minutes. The dragoons rise from the dunes. You whistle once — and once again.'
      ],
      choices: [
        { text: 'Let the trap close. Cooper is taken; the cargo is condemned; you walk away in His Majesty\'s coat.',
          target: '5.7c_customs_ending',
          effects: { trust: -20, exposure: -10, flags: { stingFull: true } },
          lesson: 'Officers, sometimes assisted by military soldiers, might often wait nights watching for the arrival of a rumoured shipment.'
        },
        { text: 'Give the wrong signal. Cooper escapes with the cargo. You report a failed seizure.',
          target: '5.7c_customs_double',
          effects: { trust: +10, exposure: +6, flags: { stingDouble: true } },
          lesson: 'A double agent\'s temptation. The Customs\' great problem was always that they could not see *inside* their informers\' loyalties — and former smugglers, conscious that they would have to live among their old confederates afterwards, were known to sabotage their own operations. The 1733 deposition of an officer at Rye complained that "the informer Wickham hath this six month past given us five signals, of which not one we are now persuaded was sincere".'
        }
      ]
    },

    '5.7c_customs_ending': {
      act: 5,
      title: 'A House at Portsmouth, Five Years Hence',
      image: 'assets/images/act5_honest.jpg',
      caption: 'A garden; a salary; a wife of moderate means; a knock at the door, sometimes.',
      body: [
        'You serve as an **assistant to the Customs** out of Portsmouth from 1726 to 1733. You write, in 1738, a long memorandum to the Treasury on the practical methods of the running trade, which is bound up with the printed *Report* of the Commons committee and consulted thereafter by every Solicitor for the Customs in His Majesty\'s service.',
        'You marry a widow, you have two children, you bury one. Cooper, when he is at last released from the Marshalsea, comes to your house in 1731 with a knife concealed in his coat, but loses his nerve at the door. You give him bread and beer and let him go.',
        'You are not, on the whole, unhappy. You are not, on the whole, loved.'
      ],
      ending: true,
      endingTitle: 'An Ending — The King\'s Coat',
      endingFlag: 'FINIS — A SWORN OFFICER',
      endingHtml: `
        <p>The conversion of a smuggler into the employ of the Customs occurred during the eighteenth century. The most famous was Gabriel Tompkins. Yet there was danger from those who had been wronged: Tompkins was assaulted and nearly kidnapped by his former confederates. </p>
        
      `
    },

    '5.7c_customs_double': {
      act: 5,
      title: 'A Career of Two Hands',
      image: 'assets/images/act5_honest.jpg',
      caption: 'You wear the coat and run the goods; you are paid by both, trusted by neither.',
      body: [
        'You continue, for three years, in His Majesty\'s service. You report some seizures (enough to be paid your salary) and you fail others (enough to keep the gang\'s confidence). You are pulled, on a Friday in March 1729, before the Commissioners of the Customs and asked to account for the discrepancy between your weekly returns and a private intelligence they have received from another quarter.',
        'You give your account; it is not believed. You are dismissed from the service without further proceedings — the Customs preferring, in such cases, to be rid of a man rather than be embarrassed in a trial — and you find yourself with neither salary nor pardon, but also (such are the strange mercies of the eighteenth-century state) without indictment.',
        'You take a small ketch out of Cowes and resume the running trade in earnest. You are at it still, in a small way, when the great Hawkhurst gang is broken up after the murder of an officer in 1748.'
      ],
      ending: true,
      endingTitle: 'An Ending — A Double Profession',
      endingFlag: 'FINIS — TWO COATS',
      endingHtml: `
        <p>The boundary between smuggler and officer was permeable
        in this period — many men crossed it, and some, like the figure imagined
        here, lived on both sides at once. The Customs Establishment regularly
        dismissed officers for "negligence" rather than prosecute them.</p>
        <p>This was the loose, bargained character of early-eighteenth-century
        enforcement that distinguishes it from the harder enforcement
        of the later 18th and 19th centuries.</p>
      `
    },

    /* ====== ACT V — JACOBITE HEROIC ARC ====== */

    '5.8_jacobite_offer': {
      act: 5,
      title: 'A Gentleman from Bordeaux',
      image: 'assets/images/act5_boyse.jpg',
      caption: 'Boyse listens, and then opens a drawer that contains no money.',
      audio: 'assets/audio/scene_5_8_boyse_drawer.mp3',  // a key, a drawer, the same low clock
      body: [
        { dlg: 'David Boyse', text: 'A last run, then. Yes. There is one, {{name}}. Not for brandy nor for tea, but for a man. A gentleman of Scotland, who has been five years in the company of the *Chevalier de St. George* at Rome, lately at Bordeaux upon his particular business. He is to be brought into England by a coast at which the Customs do not expect him.' },
        { dlg: 'David Boyse', text: 'I should not put this work upon you if I did not trust you above the common sort. The *passenger* is a Ms. **Arabella **, late of Pitsligo. The reward is two hundred guineas in hand and the matter of Crouch wiped clean between us, sir. Will you do it?' },
        'You understand at once that this is not the simple piece of smuggling Boyse pretends. *Jacobite* sympathies are the open secret of his counting house. To bring Ms.  ashore is to put yourself, knowingly, into the political traffic between Rome, Paris, and the disaffected gentry of north-east Scotland.'
      ],
      choices: [
        { text: 'Agree, asking only the conditions of the run — the coast, the master, the date.',
          target: '5.8a_jacobite_meeting',
          effects: { trust: +10, exposure: +6 },
          lesson: 'Channel smugglers were the standard conveyance of political fugitives in both directions between France and Britain throughout the period 1715–1750. The Atterbury Plot of 1722 used the same routes; so did the agents who travelled before the Forty-Five. To agree to such work was to step out of the revenue business and into a political conspiracy potentially capital under the Treason Acts.'
        },
        { text: 'Decline. Some things cost too much, even for two hundred guineas.',
          target: '5.4_honest',
          effects: { trust: -8 },
          lesson: 'A smuggler\'s refusal of political work was the wise refusal. Treason was a hanging matter from which no triple-value penalty or coast bond could save a man; the Customs\' civil mousetrap had at least the property of trapping a man for his money, not his neck.'
        }
      ]
    },

    '5.8a_jacobite_meeting': {
      act: 5,
      title: 'Bordeaux, the Sign of the Three Pilgrims',
      image: 'assets/images/act2_Calais.jpg',
      caption: 'A man in a plain blue coat; very quiet eyes; a French servant who is not French.',
      audio: 'assets/audio/scene_5_8_bordeaux.mp3',  // a Gascon street, a church bell at sext
      body: [
        'You meet Ms. **Arabella Murray**, of Pitsligo, at the Sign of the Three Pilgrims in the rue Sainte-Catherine at Bordeaux. She is thirty-eight years old, plain in his dress, courteous in her speech, and very tired. She has been on the road since the feast of St. Andrew. She carries a single portmanteau and a sealed packet of papers which she will not let out of her sight.',
        { dlg: 'Ms. Murray', text: '{{name}}, you have my entire confidence and my entire indebtedness. I shall require to be brought ashore, by your contrivance, at any quiet beach in the north-east. *Banffshire* would suit me, but I take what conveyance is given. I am to be conducted to Edinburgh, then to *Lochiel*, and then to where God wills.' },
        'He gives you his hand. The hand is steady. The fingers are stained, lightly, with the same Indian ink that an exiled court uses for its correspondence with its agents.',
        'Boyse\'s instruction is for a landing at Sussex — Pevensey or Cuckmere — to be followed by an overland transit to Newcastle. You see at once a difficulty. The Sussex coast is watched. The northern coasts are not.'
      ],
      choices: [
        { text: 'Follow Boyse\'s plan. Sussex landing, then by post-horse north.',
          target: '5.8b_jacobite_run',
          effects: { flags: { jacobiteRoute: 'sussex' }, exposure: +10, trust: +4 },
          lesson: 'Following the principal\'s plan was the loyal course but not necessarily the safe one. The Sussex coast in 1725 was as heavily patrolled as any in the kingdom, after a decade of seizures; the prudent agent of the *Chevalier de St. George* in the same period preferred Northumberland, Aberdeenshire, or the rivers of the west of Scotland.'
        },
        { text: 'Improvise. Land her directly upon the Aberdeenshire coast — a long sail, but no patrols.',
          target: '5.8b_jacobite_run',
          effects: { flags: { jacobiteRoute: 'aberdeen' }, exposure: -8, trust: -2 },
          lesson: 'The Aberdeenshire and Banffshire coasts were the historical Jacobite landing grounds throughout the period — Peterhead in 1715, the Spey in 1745. They were lightly patrolled because they were thinly populated and because the local gentry were known to favour the cause. The route was longer but the disembarkation easier.'
        }
      ]
    },

    '5.8b_jacobite_run': {
      act: 5,
      title: 'The Dolphin, Outward Bound on a Quartering Wind',
      image: 'assets/images/act1_channel.jpg',
      caption: 'The Dolphin with a passenger aboard; her papers in two pockets.',
      audio: 'assets/audio/scene_5_8_quarter_wind.mp3',  // a steady wind in canvas, helm creak
      sailing: {
        title: 'Bordeaux to England — under sail',
        text: 'Wind: *south-westerly*, fair and steady. Tide: setting north. Glass: holding. The Dolphin runs eight knots upon a quartering wind. Her papers declare cognac for Holland; her cargo is a man with a sealed packet who reads Latin by the binnacle lamp. No moon for the next three nights.'
      },
      body: [
        'The wind serves. Cooper, who has not been told who the passenger is (only that he is no man\'s business but the gang\'s), keeps a respectful distance from the cabin. Ms. Murray reads Cicero in the watch below and asks the boy Ned, with grave courtesy, after the trim of the topsail.',
        'On the fourth day out, in the latitude of the Lizard, a topsail cutter shows on the weather quarter. It is not the *Greyhound*; it is a vessel new to you, three-masted, perhaps a sloop-of-war out of Plymouth on the King\'s service.',
        { dlg: 'Tom Cooper', text: 'She has us in the offing, sir. If she comes near enough to hail, the papers will pass — the cargo, sir, *will not*. What does the passenger weigh, {{name}}, in your conscience?' }
      ],
      choices: [
        { text: 'Hold the course. Trust the papers. Treat Ms.  as honest a traveller as the Dolphin ever carried.',
          target: '5.8c_jacobite_landing',
          effects: { exposure: +6, trust: +4 },
          lesson: 'Cool nerve in a hailing was a smuggler\'s essential discipline. Most boardings were brief and concerned only with the manifest; the careful runner travelled with papers that would withstand twenty minutes\' interrogation. A passenger who could pass as a clerk had been pre-arranged in dress, demeanour, and small biographical detail.'
        },
        { text: 'Sink Ms. \'s packet, weighted, on a buoy; recover it after the landing.',
          target: '5.8c_jacobite_landing',
          effects: { exposure: -6, trust: 0, flags: { jacobitePacketSunk: true } },
          lesson: 'Sinking papers — like sinking tubs — was the smuggler\'s way of preserving evidence from inspection. The packet, weighted and marked with a buoy, would survive an inshore boarding; the *passenger himself* would still need to pass an examination. The political cargo, however, was the papers more than the man.'
        },
        { text: 'Crowd on sail. Outrun her.',
          target: '5.8c_jacobite_landing',
          effects: { exposure: +20, trust: +6 },
          lesson: 'Flight from a sloop-of-war was a confession of guilt before it was a chase. The Dolphin had the legs of most cutters on most winds, but in this wind she had no certain advantage; running for it would put your description (and the description of every man aboard) into His Majesty\'s naval intelligence within the week.'
        }
      ]
    },

    '5.8c_jacobite_landing': {
      act: 5,
      title: 'A Cove at the Foot of a Cliff',
      image: 'assets/images/act2_landing.jpg',
      caption: 'A boat in the surf; a passenger in the stern; a horse waiting under a thorn-tree.',
      audio: 'assets/audio/scene_5_8_landing.mp3',  // surf, an oar dipping, a horse cropping turf
      body: [
        'The landing is made — by your route, at your hour, in your weather. Ms.  steps from the Dolphin\'s gig into knee-deep surf with the dignity of a woman stepping into a pew. She shakes your hand. She gives you, from the inside of her coat, not coin but a small *enamelled snuffbox* — and presses it upon you with both hands.',
        { dlg: 'Arabella ', text: '{{name}}. I shall not forget this service. There is a Cause to which those of your courage are dear above price; if ever a King over the water finds his way home, he shall hear your name from my mouth. Take this snuff-box, and consider it a *pledge*: with God\'s grace, it shall be redeemed in a better coin than guineas.' },
        'She turns. She walks up the shingle. She is met, beyond the high-water mark, by a man in a blue coat. They mount; they ride inland; they are gone.',
        'You stand a long moment with the snuffbox in your hand. It bears, very small, beneath the enamel, the *insignia of the House of Stuart*.'
      ],
      onEnter: (s) => { s.flags.jacobiteLanded = true; },
      choices: [
        { text: 'Pocket it carefully, return to the Dolphin, sail home.',
          target: '5.8d_jacobite_revelation',
          effects: { trust: +6, exposure: +10 },
          lesson: 'A Stuart cipher in your coat was, in 1725, evidence sufficient to support an examination for treason. A wise courier disposed of such gifts at once. The romance of the running trade depended, very often, on its courier\'s ignorance of what he was carrying.'
        },
        { text: 'Refuse the snuffbox: throw it after him into the surf.',
          target: '5.8d_jacobite_revelation',
          effects: { exposure: -6, trust: -2, flags: { jacobiteSnuffSunk: true } },
          lesson: 'A smuggler who declined a political pledge — even one offered in friendship — was a smuggler who preserved his civil liability and shed his treasonable one.'
        }
      ]
    },

    '5.8d_jacobite_revelation': {
      act: 5,
      title: 'Portsea, Three Weeks On',
      image: 'assets/images/act3_counting.jpg',
      caption: 'Boyse pays the two hundred guineas; he also tells the truth, for once.',
      audio: 'assets/audio/scene_5_8_revelation.mp3',  // the same clock; this time, a softer voice
      body: [
        'You return to Portsea. Boyse counts out two hundred guineas in two purses upon the desk. He sits down. He looks, for a long moment, less the man you have known and more the man he must have been at twenty — bookish, careful, perhaps once even capable of friendship.',
        { dlg: 'David Boyse', text: 'You wonder why a wine-merchant trafficks in such matters, sir. I shall tell you, since you have served me well in it. The Cause has need of *small ships and quiet harbours*, and I have both. There is a network, {{name}}, that goes from Rome to Paris to Bordeaux to *here*, and from here to Edinburgh and to Lochiel. It is not a network of brandy. The brandy is its livery.' },
        { dlg: 'David Boyse', text: 'You have lately carried a man for whom thirty thousand pounds was already offered, by Mr. Walpole\'s government, dead or alive. You have done well, sir. The Crown of England does not know your face yet. Have a care that it never shall.' },
        'You understand at last that the running trade was *never* only the running trade. The same coast, the same sloops, the same masters, served the smuggling economy and a transnational political conspiracy that the British state regarded with greater fear than any private fraud.',
        '*This is the second lesson Boyse will teach you: that a fraud upon the revenue and a treason against the King may use the same beach, the same lantern, and the same boy with the small beer.*'
      ],
      choices: [
        { text: 'Take the two hundred guineas and walk out into a different world from the one you walked in.',
          target: '5.8e_jacobite_ending',
          effects: { trust: +10, exposure: +4 },
          lesson: 'The conflation of smuggling networks with political subversion is one of the central insights of modern historians of the running trade.'
        }
      ]
    },

    '5.8e_jacobite_ending': {
      act: 5,
      title: 'A House at Lymington, Ten Years Hence',
      image: 'assets/images/act5_honest.jpg',
      caption: 'A garden; a vine; a snuff-box on a sideboard that no one ever opens.',
      body: [
        'You retire from the trade upon the two hundred guineas and a private payment from a quarter that does not name itself. You take a small house at Lymington and live quietly. Boyse is taken in 1725, Hatch dies in the Fleet in 1732, Pulsom marries a widow in Stepney, Cooper goes to the Indies.',
        'On the night of the 23rd of July 1745, a man you have not seen in twenty years comes to your door. He is now grey and stooped. He gives you no name, only a date — the 25th of July — and a single word: *Eriskay*. He is gone before you can ask anything.',
        'You sit a long time, after, with the *snuff-box* in your hand. The cipher under the enamel has not faded. You think, very privately, of the young man at the Three Pilgrims at Bordeaux who shook your hand twenty Decembers ago, and of what the running trade can be made to mean when men of a *Cause* are willing to use its coasts.',
        'On the 25th of July 1745, Charles Edward Stuart steps ashore on the Isle of Eriskay. The Forty-Five has begun. Your part is over.'
      ],
      ending: true,
      endingTitle: 'An Ending — The Quieter Passenger',
      endingFlag: 'FINIS — THE RUNNING CAUSE',
      endingHtml: `
        <p>The connection between south-coast smuggling networks and Jacobite
        intelligence is documented in the State Papers Domestic for the entire
        period 1715–1746. Smuggling vessels carried agents, papers, and (after
        1744) French gold; smuggling ports were the principal places of
        disembarkation for Stuart couriers between the risings.</p>
        <p>The historical Boyse syndicate was suspected of Jacobite contacts in
        1725 but never indicted for them — the Customs Solicitor preferred the
        clean civil case over the contestable political one. </p>
        <p>That the running trade might be, in part, the courier service of a
        political conspiracy is the deepest of the lessons this game has tried
        to teach.</p>
      `
    },

    /* ====== INTERRUPT SCENES (auto-routed by thresholds) ====== */

    /* The classic civil-mousetrap interrupt: a fictitious writ of capias.
       Retained as an alias so that any old links to `auto_indicted` still
       resolve — but the principal interrupt is now the multi-scene
       Customs pursuit sequence below. */
    'auto_indicted': {
      act: 4,
      title: 'A Writ of Capias',
      image: 'assets/images/act4_writ.jpg',
      caption: 'The seal of the Court of Exchequer; the constable\'s civil hand.',
      body: [
        'It comes upon you at last. The Customs have laid an *information ad personam* against you in the Court of Exchequer. A constable serves the writ at your door. You are attached for the body until you can find bail.',
        'Your *exposure* has reached the height beyond which no man may stand. Your story turns now upon a single question: shall you flee, or shall you stand?'
      ],
      choices: [
        { text: 'Flee — to Jersey, by the next bottom.', target: '4.2_flee' },
        { text: 'Stand — turn the King\'s evidence at the Custom House.', target: '4.3_inform' }
      ]
    },

    /* ============================================================
       CUSTOMS PURSUIT — a detailed five-scene arrest sequence,
       triggered by either of two failure modes:
         * exposure ≥ 100  (the Customs have evidence enough)
         * exposure ≤ 0 *after* the player has been raising and
           then methodically suppressing suspicion (the Customs
           have noticed the man who is hiding too well)
       ============================================================ */

    'auto_customs_pursuit': {
      act: 4,
      title: 'A Horseman on the Down',
      image: 'assets/images/act4_warning.jpg',
      caption: 'A *riding officer* of the Customs upon the chalk ridge, watching the road.',
      audio: 'assets/audio/scene_pursuit_1_ridge.mp3',  // wind on chalk, distant hoofbeats
      body: [
        '{{name}}, you are upon the post-road between Portsmouth and London when you become aware of a horseman upon the chalk ridge to the north. He has been there a quarter of an hour. He does not approach. He watches.',
        { html: '<p style="font-style:italic;color:var(--ink-soft);padding:8px 12px;border-left:3px solid var(--wax-red);margin:8px 0;">A *riding officer* — one of two hundred and eighty in the King\'s service on the south coast — was paid £30 a year to patrol a "ride" of about ten miles and to take note of strangers, suspicious goods, and unusual movements. He carried a pair of pistols, a brace of dragoon irons, and the authority to detain upon suspicion.</p>' },
        'You realise, with a long cold understanding, what has happened. The man is **Joseph Wickham**, riding officer for the eastern district of Hampshire. He has been put upon you by name. Either (and this is the question the next quarter of an hour will answer) because the Customs have evidence enough to indict you, or because they have noticed that they *cannot find* the evidence they expect, and have decided to fetch you in upon principle.'
      ],
      choices: [
        { text: 'Ride for it. Make the cover of the Forest before he can close.',
          target: 'auto_customs_chase',
          effects: { exposure: +8 },
          lesson: 'Flight from a riding officer was a recognised admission and was logged as such in the officer\'s weekly return. Once a man was "marked as a runner", his description circulated to every Custom House on the south coast within a fortnight.'
        },
        { text: 'Stand. Show your papers. Trust that you have left no thread.',
          target: 'auto_customs_capture',
          effects: { trust: -2 },
          lesson: 'Cool composure was sometimes the wiser course — many riding officers had only suspicion, not warrant, and a confident interview could resolve the encounter on the spot. But composure required a clean conscience visible to a hostile reader, and few smugglers had quite that.'
        },
        { text: 'Hail him as a brother. Offer him refreshment at the next inn.',
          target: 'auto_customs_capture',
          effects: { exposure: -2, trust: +1, flags: { triedBribe: true } },
          requires: { item: 'purse' },
          lesson: 'The roadside bribe was the smuggler\'s commonest device. It worked, often, with riding officers paid £30 a year — but every officer who refused such a bribe was thereafter a hostile witness, and Wickham, of whom you have heard nothing in the trade, may be such an officer.'
        }
      ]
    },

    'auto_customs_chase': {
      act: 4,
      title: 'Through the Forest of Bere',
      image: 'assets/images/act4_flight.jpg',
      caption: 'Two horsemen behind; a soft track beneath; nothing in your favour but the failing light.',
      audio: 'assets/audio/scene_pursuit_2_forest.mp3',  // hoofs on soft ground, breath, branches
      body: [
        'You take the south track into the Forest of Bere. Wickham, who knows this country, sets his horn and is joined within ten minutes by a second rider, a man you take for a *dragoon* by his coat. The light is going. The track is soft from a morning\'s rain. Your horse begins to labour.',
        'Three miles in, near the keepers\' lodge at Soberton, your horse comes down on a hidden root. You are thrown clear but winded. The riders are a quarter of a mile behind, and gaining. You have perhaps four minutes.',
        'Defoe, who travelled this country in 1724, wrote of the Forest of Bere that it was "a great covert and a great refuge for the running trade." It is not, however, infinite.'
      ],
      choices: [
        { text: 'Make for the keepers\' lodge. Throw yourself upon the keeper\'s discretion.',
          target: 'auto_customs_capture',
          effects: { exposure: -4, trust: -2, flags: { soughtCover: true } },
          lesson: 'Forest keepers in the early eighteenth century were ambiguous figures: paid by the Crown but as often in the pay of local landowners (and, in coastal counties, in the pay of the running trade). A keeper at Soberton in this period is recorded in the 1726 Quarter Sessions as having been paid £4 a year by "the gentlemen of the coast" to be slow upon his rounds.'
        },
        { text: 'Cut your saddle, take the bridle and the pistol, and proceed on foot through the thicket.',
          target: 'auto_customs_capture',
          effects: { exposure: +4, trust: +1, flags: { onFoot: true } },
          lesson: 'A man on foot in the Forest of Bere could vanish for hours. But a man on foot in this season, soaked and cold, could also die — and the riding officer\'s warrant was good in adjoining counties. The pursuit became a question of which gave out first, the smuggler\'s strength or the officer\'s patience.'
        }
      ]
    },

    'auto_customs_capture': {
      act: 4,
      title: 'Taken at the Sign of the Wheatsheaf',
      image: 'assets/images/act4_warning.jpg',
      caption: 'A taproom; six men; a pistol upon a deal table.',
      audio: 'assets/audio/scene_pursuit_3_taproom.mp3',  // a hearth, a clock, a cocked hammer
      body: [
        'They take you, in the end, at the Sign of the Wheatsheaf upon the Petersfield road. Wickham is one of three; with him are a second riding officer (a Mr. **Symes** of the Hampshire establishment) and a dragoon corporal who does not give his name. They are very civil. The pistol upon the table is uncocked but loaded.',
        { dlg: 'Joseph Wickham, riding officer', text: '{{name}}, you are detained upon the suspicion of certain offences against the duties of His Majesty\'s Customs, particulars whereof shall be put to you by the Solicitor at Portsmouth in the morning. You will be conducted, sir, under guard, to the *Town Gaol* at Portsmouth, and there held upon a *warrant of detention* until the said particulars are framed in an information.' },
        'Your purse is taken from you (the constable signs a receipt, in the careful eighteenth-century way of these things). Your papers — what you carry — are sealed in a linen bag and counter-signed. You are bound for the gaol by post-chaise, a riding officer\'s pistol against your knee.'
      ],
      onEnter: (s) => { s.flags.customsTaken = true; },
      choices: [
        { text: 'Submit. Speak no word until you can speak to a lawyer.',
          target: 'auto_customs_examination',
          effects: { trust: 0, exposure: -2, flags: { spokeNothing: true } },
          lesson: 'Silence under examination was the established defence of any practised runner. The Solicitor for the Customs could only convict upon evidence brought against the prisoner; what the prisoner declined to say himself was evidence the Crown had to find elsewhere.'
        },
        { text: 'Protest your innocence loudly to anyone in earshot.',
          target: 'auto_customs_examination',
          effects: { exposure: +4, trust: -2 },
          lesson: 'Protestation, in the taproom of the Wheatsheaf, did nothing but circulate your description and your story to every drinker, post-boy, and ostler in earshot — and the Customs had its informers among such men, paid by the piece, recorded in the same ledger that the Solicitor kept locked.'
        }
      ]
    },

    'auto_customs_examination': {
      act: 4,
      title: 'The Examination at the Custom House, Portsmouth',
      image: 'assets/images/act3_customs.jpg',
      caption: 'The Solicitor for the Customs, his clerk, a Bible, a printed form.',
      audio: 'assets/audio/scene_pursuit_4_examination.mp3',  // a clerk\'s pen, no voices, a window
      body: [
        'You are brought, the next forenoon, into the Long Room of the Custom House at Portsmouth. The Solicitor for the Customs sits at the head of a deal table. His clerk reads from a printed form. There is a Bible. There is no jury — this is a Customs examination, not a trial.',
        { dlg: 'The Solicitor', text: '{{name}}, you stand examined upon information laid against you by the Collector at Poole, in the matter of certain tobaccoes debentured for export and re-imported into this kingdom, contrary to the Statute. You are not on this day required to plead; you are required to give such answers, upon oath, as shall enable His Majesty\'s officers to frame their further proceedings against you.' },
        { dlg: 'The Solicitor', text: 'Will you swear, {{name}}, that you were not aboard the sloop *Dolphin*, Tom Cooper master, in the matter of an export bond for 73,157 lbs of Virginia leaf, dated the 12th of February last?' },
        'You feel, very precisely, the *mousetrap* close. Three answers are open to you, and three only. The Solicitor watches your face. His clerk holds his pen above his paper. The mousetrap does not need you to answer; it needs only your *manner* of not answering.'
      ],
      choices: [
        { text: 'Deny everything. Refuse the oath. Demand counsel.',
          target: 'auto_customs_sentence',
          effects: { exposure: -2, trust: +2, flags: { examDeny: true } },
          lesson: 'Refusal of the oath, in a Customs examination of 1725, was not in itself contempt — but it left the Solicitor free to frame the information upon such evidence as he had, without your contradicting it. The course was prudent, slow, and produced a *civil* prosecution for the triple value of the duty saved.'
        },
        { text: 'Bargain. Offer such information as you possess in exchange for the dropping of the information against you.',
          target: '4.3_inform',
          effects: { trust: -30, exposure: -10, flags: { examTurned: true } },
          lesson: 'The bargaining smuggler was the Solicitor\'s preferred customer. The Crown, throughout the 1720s, preferred a confederate inside the prosecution to a felon at the end of it — Pulsom\'s 1725 evidence is the case in point, and the prosecution offered him exactly the bargain you are now offered.'
        },
        { text: 'Confess and submit. Throw yourself upon His Majesty\'s mercy.',
          target: 'auto_customs_sentence',
          effects: { exposure: -8, trust: -8, flags: { examSubmit: true } },
          lesson: 'Submission converted a contested prosecution into an *agreed civil penalty* — typically the triple value of the duty saved, recoverable as a debt. Mr. Hatch, who in 1726 attempted exactly such a submission, found the triple value exceeded his entire estate. Submission was honest; it was not necessarily safer.'
        }
      ]
    },

    'auto_customs_sentence': {
      act: 4,
      title: 'The Court of Exchequer at Westminster — Hilary Term, 1726',
      image: 'assets/images/act5_fleet.jpg',
      caption: 'A great panelled hall; a Baron of the Exchequer; a clerk reading a long list.',
      audio: 'assets/audio/scene_pursuit_5_court.mp3',  // a clerk reading at length, a slow gavel
      body: [
        'In Hilary Term 1726, in the Court of Exchequer at Westminster, an *information* is read upon you in the matter of the *Dolphin*, the *Prosperity*, the receipts of one Pierre Lebec at Calais, the bond debentured the 12th of February, and one other count. *Baron Page* presides. The Solicitor for the Customs appears in person.',
        'You are condemned in the triple value of the goods upon which the duty was saved, viz. *£8,400*, together with the King\'s costs and the costs of the seizure. Your bond is forfeited. Your estate, which is not great, is sequestered. You are remanded — in the customary fashion of those who cannot pay — first to the *King\'s Bench* prison, then to the *Marshalsea*, and at last to the *Fleet*.',
        'There is no felony in the verdict. No man hangs upon your account. But you will be twelve years in the Fleet, and you will be of no use to anyone, including yourself, for the whole of that time.',
        '*The mousetrap, evaded so often, has shut at last.*'
      ],
      ending: true,
      endingTitle: 'An Ending — The Mousetrap',
      endingFlag: 'FINIS — THE CUSTOMS\' DUE',
      endingHtml: `
        <p>The Court of Exchequer was the Crown\'s civil revenue court. Smuggling
        prosecutions in this period were brought there for
        the triple value of duties saved, recoverable as a debt — a punishment
        that did not technically convict the runner of a crime, but routinely
        consigned him or her to a debtors\' prison for the rest of their life.</p>
        
        <p>Your sentence is the historical sentence of <strong>John Hatch</strong>,
        who in 1726 was condemned in penalties of £55,000 and died in the Fleet
        in 1732.</p>
      `
    },

    'auto_betrayed': {
      act: 4,
      title: 'A Knife in the Stable Yard',
      image: 'assets/images/act4_betrayed.jpg',
      caption: 'You have been used so as your confederates may be safe.',
      body: [
        'You have lost the trust of the men who keep you alive. You discover it, as such men always discover it, too late: at three in the morning, in the yard of an inn, with two of your former friends standing between you and the gate.',
        'You wake (you will be told later) in the Marshalsea, nominated upon an information laid that very morning by a man who once called you brother.'
      ],
      ending: true,
      endingTitle: 'An Ending — Betrayed',
      endingFlag: 'FINIS — THE FALSE BROTHER',
      endingHtml: `
        <p>Smuggling syndicates governed themselves by ferocious internal discipline.
         </p>
      `
    }
  }
};
