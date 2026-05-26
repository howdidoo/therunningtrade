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
    subtitle: "A Smuggler's Reckoning &mdash; Anno Dom. 1725",
    startSceneId: '1.1_wake',
    fallbackImage: 'assets/images/map.jpg',

    /* ----- Audio paths (drop matching files into assets/audio/) ----- */
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
      subtitle: "A Smuggler's Reckoning &mdash; Anno Dom. 1725",
      body: [
        'Britain in 1725 is a *fiscal-military state* — almost two-thirds of His Majesty\'s revenue is gathered through customs and excise duties on goods like tobacco, brandy, tea, and silks. The duties are high; the temptation to evade them is higher. Whole communities along the south coast live by what contemporaries call **the running trade**.',
        'You play a man who has fallen in with **the Boyse gang**, a Portsmouth syndicate run by the wine-merchant **David Boyse** with his partners **John Hatch** and **John Sellers**. The gang is real; its prosecution in 1725, on the evidence of its own clerk Isaac Poulsum, is the historical spine of this game.',
        { html: '<div class="meters-key"><div class="key-exp"><strong>EXPOSURE</strong> &mdash; how far the Customs suspect you. Reach 100 and an information will be laid against you in the Court of Exchequer.</div><div class="key-tru"><strong>TRUST</strong> &mdash; your standing with your confederates. Fall to 0 and they will sell you to save themselves.</div></div>' },
        'Every choice that moves a meter will be followed by a brief *Reflection* — the historical reasoning behind the consequence. Read it. The reading is the game.',
        '*Daniel Defoe, who passed through these towns only the year before, wrote that the Channel ports were "much given to private trade, and the gentlemen of the running business." You are now of their number.*'
      ],
      namePrompt: 'Pray, sir, by what surname shall the gentlemen of the trade know you?'
    },

    /* ----- About / historical note ----- */
    aboutHtml: `
      <p><em>The Running Trade</em> is set in 1725, the year of the prosecution of
      <strong>David Boyse</strong>, a Portsmouth wine merchant who, with his partners
      John Hatch and John Sellers, ran a substantial cross-Channel smuggling syndicate
      until their clerk Isaac Poulsum turned King's evidence.</p>
      <p>The mechanics &mdash; debenture frauds, "running" cargoes by moonlight,
      under-declarations, bribery of land-waiters, riding officers patrolling the coast,
      informations <em>ad rem</em> and <em>ad personam</em> in the Court of Exchequer
      &mdash; are drawn from the 1733 House of Commons <em>Report on the Frauds and
      Abuses in the Customs</em> and contemporary writers including Daniel Defoe.</p>
      <p>The gang's three leaders bear their historical names. Other named characters
      (Cooper the master, Hodgkin the keeper, Reeve and Henwood the Customs officers,
      Le Brun the Jerseyman, Lebec the Norman) are invented or composited.</p>
      <p>Two meters track the player's situation. <strong>Exposure</strong> rises
      as the Customs come to suspect you; if it reaches 100, prosecution follows.
      <strong>Trust</strong> is your standing with your confederates; if it drops to
      zero, they will betray you.</p>
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
    receipt:      { name: 'Receipt for brandy',        description: 'Twenty ankers, paid in coin to one Pierre Lebec at Cherbourg.' },
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
        'A board comes up easy under your fingers, its nails withdrawn before. Beneath, wrapped in oiled cloth, lies a small *purse of guineas* — too heavy for an honest pocket — and beside it a folded paper with a customs-house seal and a *pocket ledger*, much-thumbed.',
        'The ledger, opened at random, gives initials and sums: "J.S. — 200 lb. Virginia, of Dunkirk run, 8/—". And again, "J.H. — coast bond, 73 cwt., debentured 12 Feb."'
      ],
      choices: [
        { text: 'Pocket the purse and the ledger; read on.',
          target: '1.3_innkeeper',
          effects: { addItem: ['purse','ledger','debenture'], trust: +5 },
          lesson: 'Holding the gang\'s ledger and capital marks you as a man of business in the running trade — these were the tools of a clerk or factor. Smugglers entrusted such books only to those who could read them faithfully and conceal them well.'
        },
        { text: 'Take only the purse; leave the papers where they lie.',
          target: '1.3_innkeeper',
          effects: { addItem: ['purse'], exposure: -3 },
          lesson: 'The first principle of the running trade: never carry paper. The 1733 Committee unravelled whole networks through ledgers and letters seized from clerks. A man with no documents was a man hard to indict.'
        }
      ]
    },

    '1.2_search_pillow': {
      act: 1,
      title: 'Under the Bolster',
      image: 'assets/images/act1_inn.jpg',
      caption: 'A note tucked into the pillow, its corners brown with sweat.',
      body: [
        'Folded and refolded, a *note* in another hand: "At the Crown — Tuesday — ask for J. S. by the back stair." Beside it lies a *kerchief* of cheap printed cotton, marked with a deep brown stain. The smell, when you raise it, is unmistakable: Virginia leaf.',
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
        { dlg: 'Mrs. Hodgkin', text: 'Mr. {{name}}, sir. You are awake at last. Your friends were here yesternight. They left word that *the Dolphin* sails on the ebb, and that you were to be aboard her, sober or no. They paid the reckoning.' },
        { dlg: 'Mrs. Hodgkin', text: 'I asked no questions when they brought you up the stairs. I ask none now. But the wind is fair, and the tide will not wait upon any gentleman\'s headache.' }
      ],
      choices: [
        { text: 'Thank her plainly and leave a guinea on the sideboard.',
          target: '1.4_to_quay',
          effects: { trust: +3, exposure: -2 },
          requires: { item: 'purse' },
          lesson: 'Innkeepers in port towns were essential intermediaries. A guinea well-placed bought silence about your face and your traffic; the same guinea, withheld, was a small economy that could send you to the Marshalsea later by way of a deposition.'
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
        { dlg: 'Mrs. Hodgkin', text: 'Sir, I keep an inn. I do not keep men\'s names. If I did, I should soon keep neither inn nor head.' },
        'She turns and is gone before you can press her further. Whatever she knows, she will not part with it for a hard word.'
      ],
      choices: [
        { text: 'Leave for the quay.',
          target: '1.4_to_quay',
          effects: { exposure: +3 },
          lesson: 'Pressing an innkeeper for names broke the unwritten compact of the smuggling port. Word travelled. Officers took note of strangers who asked too many questions, and one such word reached the Searcher\'s ear at Poole within the hour.'
        }
      ]
    },

    '1.4_to_quay': {
      act: 1,
      title: 'Through the Streets to the Quay',
      image: 'assets/images/act1_quay.jpg',
      caption: 'Poole quay — the chief out-port of Dorset, much given to the running trade.',
      body: [
        'Defoe, who passed through this town not three years since, called Poole *"a sea-port and town of trade, and considerable for the Newfoundland fishery."* He did not write what every Pooleman knows: that more brandy comes ashore here in a fortnight than the Customs see in a twelvemonth.',
        'You walk the lanes between the chandlers and the rope-walks. A *tide-waiter* in his blue coat passes without a glance — he is paid by the day to watch a tide that brings him nothing. Beyond him, the Custom House keeps its prim pediment turned to the sea.',
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
        'You stand a quarter of an hour at the steps, watching. A *searcher* &mdash; the officer who attends a vessel out &mdash; takes a paper from the master of a Dutch hoy and sets his mark upon it. A boy fetches him beer.',
        'You learn this much: the searchers here are three, of whom one (a Mr. **Reeve**) is much given to "consideration", and another (a Mr. **Henwood**) is not. The third is old and asleep.'
      ],
      onEnter: (s) => { s.flags.knowsOfficers = true; },
      choices: [
        { text: 'Note these names; turn for the quay.',
          target: '1.5_meet_cooper',
          effects: { trust: +3 },
          lesson: 'Naming the corrupt and honest officers in a port was hard intelligence. Boyse is reported, in the 1733 deposition, to have kept a private list of which Customs men in each port could be "compounded with" and which could not.'
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
        { dlg: 'Tom Cooper, master', text: 'Mr. {{name}}, you are late, and uglier than yesterday, but you are aboard. Mr. Boyse sends his particular regards. He says the freight is debentured to Dunkirk &mdash; ' },
        { dlg: 'Tom Cooper, master', text: ' &mdash; though we may find the wind sets rather toward St Helier of an evening. Do you take my meaning?' },
        'You take his meaning. The cargo is *tobacco* &mdash; declared for export, the duty drawn back, and shortly to be landed again upon some quiet beach in *Jersey* and shipped home as if it had never been British. It is the oldest fraud in the *Report*, and the most lucrative.'
      ],
      choices: [
        { text: 'Speak as one who knows his business: ask after the cocket and the bond.',
          target: '1.6_passage',
          effects: { trust: +6 },
          lesson: 'A *cocket* was the export certificate, a *bond* the security pledged that the goods would not be re-imported. To ask after them by name was to demonstrate the literacy of a clerk in the trade — Boyse trusted such men with his business.'
        },
        { text: 'Say plainly that you have lost your memory and ask what part you play.',
          target: '1.5a_honest',
          effects: { trust: -8 },
          lesson: 'Smuggling crews abhorred uncertainty in their own. A man who did not know himself was a liability — likely to confess, likely to break under questioning. Cooper marks you as such, and Boyse will hear of it.'
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
          effects: { exposure: +5 },
          lesson: 'A confused man on a smuggling deck is a watched man. Cooper will keep his eye upon you until he has answers; the watch becomes a story; the story may travel ashore. Exposure rises whether the Customs are present or not.'
        }
      ]
    },

    '1.6_passage': {
      act: 1,
      title: 'The Channel, by the Light of the Stern Lantern',
      image: 'assets/images/act1_channel.jpg',
      caption: 'The Dolphin running before a fair westerly, course south by east.',
      body: [
        'The wind serves; the sloop heels and the lantern at the stern throws its yellow shudder upon the wake. Cooper is at the tiller. The boy &mdash; a thin lad called **Ned**, no more than fifteen &mdash; brings up small beer and a wedge of ship\'s cheese.',
        'You have hours before St Helier. There are matters to consider.'
      ],
      choices: [
        { text: 'Help Ned set up the running gear &mdash; show willing.',
          target: '1.7_jersey_arrival',
          effects: { trust: +5 },
          lesson: 'The smuggling sloop ran on the cooperation of every hand. Master and clerk who declined the rough work were resented, then suspected, and in time betrayed. Sharing labour was an investment in your shipmates\' loyalty.'
        },
        { text: 'Read the ledger again by the binnacle lamp.',
          target: '1.6a_ledger',
          requires: { item: 'ledger' }
        },
        { text: 'Stay below, out of mind and out of weather.',
          target: '1.7_jersey_arrival',
          effects: { exposure: -2 },
          lesson: 'A passenger seen rarely and remembered dimly was harder for an informer to describe. Discretion below decks was a defensive posture in the running trade.'
        }
      ]
    },

    '1.6a_ledger': {
      act: 1,
      title: 'The Ledger, Read by Lantern-Light',
      image: 'assets/images/act1_channel.jpg',
      caption: 'A book of names that no man should be holding upon a moonless deck.',
      body: [
        'The pages give what the *Report* will one day call "the running trade in the round". Names &mdash; **Boyse**, **Hatch**, **Sellers** &mdash; and against them, sums that grow over years. A clerk\'s hand, careful in some places and shaking in others. The shaking entries are recent.',
        'One name appears in a heavier ink than the rest, and underlined: *Pulsom*. He is the keeper of this book, then; or was. You wonder if he is still living.'
      ],
      onEnter: (s) => { s.flags.knowsPulsom = true; },
      choices: [
        { text: 'Close it and pocket it carefully.',
          target: '1.7_jersey_arrival',
          effects: { trust: +2 },
          lesson: 'You now know what Pulsom knows: every name, every sum. In the historical case, the clerk Isaac Poulsum carried just such knowledge to the Solicitor for the Customs in 1725, and brought down the entire Boyse syndicate.'
        }
      ]
    },

    '1.7_jersey_arrival': {
      act: 1,
      title: 'St Helier, Isle of Jersey',
      image: 'assets/images/act1_jersey.jpg',
      caption: 'A free-port of the King, in his prerogative — and a great convenience to the trade.',
      body: [
        'You make St Helier at the turn of the tide. Jersey lies under the King\'s prerogative but pays no English duty: a free-port in fact if not in name, and the most useful warehouse south of the Solent.',
        'The cargo is unloaded by a Jerseyman by the name of **Le Brun** into a stone cellar above the harbour. From this cellar, in another bottom, under another flag, the same tobacco will return into England in a fortnight, the duty saved being the whole profit of the voyage.',
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
          effects: { flags: { jerseyMethod: 'guernsey' }, trust: -2 },
          lesson: 'Subcontracting through Guernsey added a layer of insulation but diluted your share. Boyse preferred his own bottoms because the profit stayed within the gang; deferring to a Channel-Islander\'s arrangement was, in his view, a small disloyalty.'
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
        { dlg: 'Tom Cooper', text: 'You will do, Mr. {{name}}, you will do. Mr. Boyse wants you in Sussex next week. Brandy out of Cherbourg. Honest brandy, you might say.' }
      ],
      onEnter: (s) => { s.flags.actOneDone = true; },
      choices: [
        { text: 'To Sussex, and the next voyage.',
          target: '2.1_cherbourg',
          effects: { trust: +3 },
          lesson: 'Successful first voyages purchased trust by the inch. Smuggling syndicates assessed new men over many runs before sharing the most valuable secrets — the names of corrupt officers, the locations of safehouses inland, the identities of London receivers.'
        }
      ]
    },

    /* ====== ACT II ====== */

    '2.1_cherbourg': {
      act: 2,
      title: 'Cherbourg — A Tavern by the Mole',
      image: 'assets/images/act2_cherbourg.jpg',
      caption: 'A French port, much used by the running trade for brandy and tea.',
      body: [
        'The Channel crossing is short and uneventful. At Cherbourg you put up at the Sign of the Three Cranes, where a Norman merchant by the name of **Pierre Lebec** does the business of half the south-coast smugglers without seeming to do any business at all.',
        { dlg: 'Pierre Lebec', text: 'Monsieur {{name}}. Monsieur Boyse sends his regards. The brandy is ready &mdash; one hundred and twenty ankers, very fine, of the brandies of Charente. There is also tea, gunpowder green, that I have set aside for those who can pay. And silks, if you have a mind to be bold.' },
        'Defoe wrote of this trade that it "had been the constant complaint of the fair trader" how the dutied goods were undersold by the smuggled. Lebec smiles to remember it.'
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
          lesson: 'Tea bore the highest duties in the kingdom — up to 119% in some years — and offered the greatest reward to the smuggler. It was also the cargo most surveilled: the East India Company had its own informers, and the Customs were lobbied directly by the Company to seize tea cargoes preferentially.'
        },
        { text: 'A small parcel of silks only — light, dear, and damnable to be caught with.',
          target: '2.2_load',
          effects: { flags: { cargo: 'silks' }, addItem: 'receipt', exposure: +6, trust: -2 },
          lesson: 'Silks were the most concealable cargo and bore prohibitive duties — but they were *prohibited*, not merely dutied, which made any seizure a criminal matter rather than a civil one. Confederates who wanted bulk and reliable buyers thought silk-runners reckless.'
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
          lesson: 'A forged manifest was insurance: even if intercepted, you could plead an honest passage to a third port. It cost time and a confederate\'s suspicion (every delay narrowed the gang\'s margin), but it was the device most often used by professional runners and recommended by Boyse himself in the 1733 deposition.'
        }
      ]
    },

    '2.3_passage': {
      act: 2,
      title: 'A Squall in the Mid-Channel',
      image: 'assets/images/act2_storm.jpg',
      caption: 'The Dolphin labouring under reefed mainsail.',
      body: [
        'You are eight leagues off Cape Barfleur when the squall comes on. The sloop heels until the lee gunwale is a-wash. Cooper, with no expression at all, gives the helm half a point free.',
        'A tub breaks loose below. If it is not secured, the cargo will be ruined, and worse, may shift and broach the vessel.'
      ],
      choices: [
        { text: 'Go below at once and lash the tubs yourself.',
          target: '2.4_sighting',
          effects: { trust: +6 },
          lesson: 'Sea-courage in a squall counted for everything in the running trade. Crews remembered, for years, who went below into a working hold and who did not. Such moments were the hidden currency of the smuggling economy: the *trust* on which a verbal contract for thousands of pounds rested.'
        },
        { text: 'Send Ned, and hold the deck.',
          target: '2.4_sighting',
          effects: { trust: -3 },
          lesson: 'Sending the boy where you would not go yourself was a small kind of contempt. Ned will say nothing. Cooper will say nothing. But neither will forget, and Boyse, who hears everything, will hear of it.'
        },
        { text: 'Cut the lashing of the loose anker and let the sea have it; save the rest.',
          target: '2.4_sighting',
          effects: { exposure: -4, trust: -4 },
          lesson: 'A lost anker was lost profit — and a half-anker of brandy, washed ashore, gave a riding officer a tale to write up in his weekly return. Smugglers preferred to risk a vessel rather than throw cargo, because evidence on the beach travelled to the Custom House faster than evidence at the bottom of the Channel.'
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
        { dlg: 'Tom Cooper', text: 'That is the *Greyhound*, out of Newhaven. Captain **Pigram**. He took the Whitstable men last summer and set the Hawkhurst boys to mourn three weeks together. We must lose him before we close the shore.' }
      ],
      choices: [
        { text: 'Run for the offing and lie to behind the Owers, hoping he passes.',
          target: '2.5_landing',
          effects: { exposure: -4, trust: +1 },
          lesson: 'Hiding behind the Owers — a shoal off Selsey Bill — was the sober choice. The cutter could not work the inshore water, and a smuggler who ran for the offing lived to land another night. Patience was a smuggler\'s discipline.'
        },
        { text: 'Crowd on sail and make straight for Pevensey beach &mdash; outrun him.',
          target: '2.5_landing',
          effects: { exposure: +6, trust: +5 },
          lesson: 'Running before the Customs at full canvas was glorious to watch and ruinous if the wind shifted. Cooper and the boy will love you for the gamble; the Customs will mark you for it. Boyse made his name on such runs, and his prosecution on them too.'
        },
        { text: 'Sink the most damning tubs at the Royal Sovereign buoy, mark them, recover at leisure.',
          target: '2.5_landing',
          effects: { exposure: -8, trust: -4, flags: { sunkTubs: true } },
          lesson: 'Sinking weighted tubs and recovering them later — by "creeping" with grapnels — was a recognised smuggler\'s tactic. It avoided seizure, but the gang counted the cost in lost cargo and crew time, and Boyse paid only on what was landed.'
        }
      ]
    },

    '2.5_landing': {
      act: 2,
      title: 'Pevensey Bay, Two Hours Before Dawn',
      image: 'assets/images/act2_landing.jpg',
      caption: 'A lantern shown thrice from the dunes; the answering sweep of an oar.',
      body: [
        'You make your landing in a long shingle bay east of Pevensey. The shore-party is there: *tubmen* with their slings, and a half-dozen *batsmen* with stout ash poles to dissuade any officer who may have heard the keel grind.',
        'The signal is given. The work is fast. Forty ankers are ashore in twenty minutes; the rest go up onto two pack-horses kept in a fold above the dunes.',
        'And then the lantern of a *riding officer* shows, half a mile down the beach, and a voice cries out the King\'s name.'
      ],
      choices: [
        { text: 'Order the batsmen to give him a thrashing &mdash; nothing fatal &mdash; and run.',
          target: '2.6_aftermath',
          effects: { exposure: +12, trust: +6, flags: { officerHurt: true } },
          lesson: 'Violence against riding officers was the line that turned smuggling into criminal felony. The 1736 *Smuggling Act* was passed in direct response to the rising count of officers beaten or shot on the south coast. Your gang loves boldness; the gallows in time will love it too.'
        },
        { text: 'Slip away quietly with the cargo &mdash; let him write his report; deny everything.',
          target: '2.6_aftermath',
          effects: { exposure: +6 },
          lesson: 'A riding officer\'s report on a "running cargo seen at Pevensey, persons unknown" went into the Collector\'s weekly return and fed, in time, the dossier kept by the Customs solicitors in London. Anonymity slowed the law; it did not stop it.'
        },
        { text: 'Throw a guinea into the sand and tell him to look the other way.',
          target: '2.6_aftermath',
          effects: { exposure: -4, trust: -2 },
          requires: { item: 'purse' },
          lesson: 'The on-the-spot bribe to a riding officer was a recognised practice — Pulsom\'s 1733 evidence describes officers receiving "a piece" to walk on. But every successful bribe was an expense, and every refused bribe became material evidence in a future prosecution. Confederates resented the cost.'
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
        { text: 'Northward, to London &mdash; the goods to be disposed of through Mr. Boyse\'s factor.',
          target: '3.1_summons',
          effects: { trust: +2 },
          lesson: 'Inland networks of farmers, carriers and London receivers turned smuggled goods into cash. Boyse\'s factor was a respectable wine-merchant in the City who paid in bills of exchange — no different in form from any merchant\'s account, except that it was illegal at every step.'
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
        'In London, between one tavern and another, you are handed a letter. It is from **David Boyse**, by his clerk Pulsom\'s hand:',
        { dlg: 'Boyse, by his clerk', text: 'Mr. {{name}} &mdash; You are now sufficiently in our trust. There is a matter of three hundred chests of tea and forty pieces of Bordeaux to come into Poole upon the *Prosperity*, by ordinary course. The under-declaration is to be your particular charge. Mr. Reeve at the Custom House is our man. Mr. Henwood is not. The cocket is enclosed. &mdash; Boyse.' },
        'This is the third species of fraud described in the *Report*: not running goods upon the beach, but landing them at the legal quay and *under-declaring* what is in the hold.'
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
      body: [
        'You meet the *Prosperity*, a Bordeaux trader, in the Channel south of the Needles. She carries (by her papers) only forty pieces of wine. In her hold are also the chests of tea, in a false bulkhead aft.',
        'It falls to you to draw the manifest you will present at Poole &mdash; how much shall be declared, and how much hidden.'
      ],
      choices: [
        { text: 'Declare the wine in full, and hide all the tea.',
          target: '3.3_customs',
          effects: { flags: { manifest: 'tea_hidden' }, exposure: +4, trust: +6 },
          lesson: 'The boldest under-declaration concealed the most valuable cargo entirely. It produced the largest margin (tea bore far higher duties than wine), but it left the discovery of even one chest fatal: the goods would be condemned and an information *ad personam* laid for triple value.'
        },
        { text: 'Declare the wine, declare a portion of the tea, hide the rest.',
          target: '3.3_customs',
          effects: { flags: { manifest: 'partial' }, exposure: -2, trust: 0 },
          lesson: 'Partial declarations were the professional strategy. Paying *some* duty was credible, kept the gang on the official ledgers, and supplied an answer to any awkward question. The historian David Chan Smith calls this the "bargaining" character of smuggling enforcement — a managed compromise rather than absolute evasion.'
        },
        { text: 'Declare every chest. Take the duty as the price of safety.',
          target: '3.3_customs',
          effects: { flags: { manifest: 'full' }, exposure: -10, trust: -10 },
          lesson: 'Full declaration was *fair trading* — the practice of merchants who paid all dues and resented the smugglers who undercut them. It was safe; it was honourable; and it was, in Boyse\'s view, a betrayal of the gang\'s entire economic logic.'
        }
      ]
    },

    '3.3_customs': {
      act: 3,
      title: 'The Custom House, Poole — Forenoon',
      image: 'assets/images/act3_customs.jpg',
      caption: 'A long room, a long table, a long pause.',
      body: [
        'You climb the steps under the pediment with the manifest in your coat. The clerk takes it; reads it; passes it to a *land-waiter*. The land-waiter is **Mr. Reeve**.',
        { dlg: 'Mr. Reeve, land-waiter', text: 'Mr. {{name}}. A pleasure. Mr. Boyse has spoken of you. The wine is plain enough. Shall we walk down to the Quay together, to attend the searcher?' },
        'A second officer crosses the room behind him. Older, with a sharp eye and a wig that has not been fresh in some years. This must be **Mr. Henwood**, of whom Mr. Reeve does not speak.'
      ],
      choices: [
        { text: 'Walk down with Mr. Reeve, alone, and trust the arrangement.',
          target: '3.4_reeve',
          effects: { exposure: -2, trust: +2 },
          lesson: 'Trusting a corrupt officer was the smuggler\'s ordinary risk. Reeve\'s "consideration" was an unwritten contract — enforceable only by repetition and reputation. Boyse paid him for years on this footing; the system held until it didn\'t.'
        },
        { text: 'Insist that Mr. Henwood attend also &mdash; appear above suspicion.',
          target: '3.4_henwood',
          effects: { exposure: -8, trust: -8 },
          lesson: 'Inviting an honest officer into your business was a defensive posture — a fair-trader\'s gambit — that cleared you with the Customs but mortified the gang. The 1733 deposition recorded that Boyse "took it amiss" when his men volunteered for honest searches.'
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
          lesson: 'Cash on the quay was the smuggler\'s best receipt: no paper, no debt, no leverage on either side. Boyse always insisted on it. The Customs solicitor in the 1725 prosecution noted ruefully that "no monies passed by note that we could trace".'
        },
        { text: 'Promise him by note &mdash; through Mr. Boyse &mdash; in three days.',
          target: '3.5_after',
          effects: { exposure: +3, trust: +2 },
          lesson: 'A promised payment created a creditor — and a creditor was a witness. Reeve\'s memory of you and your business now had three days to ferment. In Pulsom\'s evidence, several officers turned informant precisely because their promised "considerations" had gone unpaid.'
        },
        { text: 'Refuse, and threaten him with a counter-information if he troubles you.',
          target: '3.5_after',
          effects: { exposure: +12, trust: -8 },
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
          effects: { exposure: -10, trust: -12, flags: { caughtPartial: true } },
          lesson: 'Voluntary submission converted a *criminal* matter into a *civil* one — a triple-value penalty for unpaid duty, recoverable as debt. Painful but survivable. The gang, however, treated such submissions as betrayal: every penalty paid by one man revealed the gang\'s tactics to the Customs solicitors.'
        },
        { text: 'Offer him a private gift &mdash; ten guineas in his pocket.',
          target: '3.4a_henwood_bribe',
          requires: { item: 'purse' }
        },
        { text: 'Strike the candle from his hand and go.',
          target: '3.4b_henwood_flee',
          effects: { exposure: +20, trust: +4 },
          lesson: 'Assault on a Customs officer was a felony from the 1736 Act onwards; even in 1725 it was a hanging matter under earlier statutes. Boyse will admire the boldness in private and disclaim it in public. Your face is now a face every officer in the south will know.'
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
        'He calls for the Mayor\'s constable. The cargo is condemned by writ of appraisement. Mr. Boyse will not be pleased.'
      ],
      choices: [
        { text: 'Bow, and bear it.',
          target: '3.5_after',
          effects: { exposure: +14, trust: -10, flags: { caughtBribery: true } },
          lesson: 'Honest officers existed in numbers contemporaries underestimated. The 1733 Report named several "diligent and do their duty" — Henwood is composited from such men. An attempted bribe to an honest officer became, by his own deposition, hard evidence of corrupt intent.'
        }
      ]
    },

    '3.4b_henwood_flee': {
      act: 3,
      title: 'A Run, and a Reckoning Postponed',
      image: 'assets/images/act3_flight.jpg',
      caption: 'Down the quay-stair, into a wherry, into the harbour.',
      body: [
        'You are upon the quay-stair before he has his candle relit. The harbour is full of small craft; you are aboard the Dolphin again before the alarm-gun is fired from the Custom House battery.',
        'The cargo, however, is gone. Mr. Henwood will write his report. Your face has been seen by an honest man, and that is the most dangerous kind of seeing.'
      ],
      choices: [
        { text: 'To Mr. Boyse, to give an account.',
          target: '3.5_after',
          effects: { exposure: +12, trust: -2 },
          lesson: 'A man pursued by an honest officer\'s memory was a man already half-prosecuted. Henwood\'s report will go to the Collector at Poole, thence to the Solicitor in London, and within a fortnight your description will be in every Customs office on the south coast.'
        }
      ]
    },

    '3.5_after': {
      act: 3,
      title: 'A Counting House on the High, Portsmouth',
      image: 'assets/images/act3_counting.jpg',
      caption: 'A bare room, a great desk, a man behind it who does not rise.',
      body: [
        'Mr. **David Boyse** is forty-five years old, a wine-merchant by trade and a trafficker by profession, lately suspected of Jacobitical sympathies but never indicted for it. His partners **John Hatch** and **John Sellers** stand at the window. He listens to your account with his hands folded.',
        { dlg: 'David Boyse', text: 'You have done tolerably, Mr. {{name}}. The Customs are a mousetrap, and you have not yet sprung it. There is one further matter on which I require your particular service. Pulsom — my clerk — has asked leave to speak to me. Alone. I do not care for the look of him these last weeks.' },
        { dlg: 'David Boyse', text: 'Come to my house at Portsea by Thursday. We shall settle all our accounts together.' }
      ],
      onEnter: (s) => { s.flags.actThreeDone = true; },
      choices: [
        { text: 'Promise to attend.',
          target: '4.1_warning',
          effects: { trust: +3 },
          lesson: 'Boyse rewarded loyalty with greater secrets. To be summoned to his Portsea house was, in the gang\'s grammar, a sign of full inclusion. It was also — though you do not yet know it — exactly the invitation that had been extended to a man called Crouch the night before you woke without your memory.'
        }
      ]
    },

    /* ====== ACT IV ====== */

    '4.1_warning': {
      act: 4,
      title: 'Tom Cooper, in a Tavern Yard',
      image: 'assets/images/act4_warning.jpg',
      caption: 'Cooper does not waste words; tonight he wastes very few.',
      body: [
        'On the road from Portsmouth Tom Cooper steps from a hedge as if grown there. He has the look of a man who has been waiting some hours and would rather be drinking.',
        { dlg: 'Tom Cooper', text: 'Pulsom is turned. He has been four days closeted with the Solicitor for the Customs in London, and the Inspector of Prosecutions besides. There is to be an *information* laid &mdash; *ad personam* &mdash; against you, against me, against half the men of the Dolphin.' },
        { dlg: 'Tom Cooper', text: 'Mr. Boyse knows. He has known a fortnight. He sent for you to Portsea not for an account but to put you out of the way before you are taken. The same as he did to **Crouch** at the Crown Inn at Poole, the night before you woke without your memory.' },
        'You stand a long moment with no breath in you. You understand at last who you are, and what was done to you, and who did it. *Mr. {{name}} is a name David Boyse meant should never speak again.*'
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
        { text: 'Turn the King\'s evidence yourself &mdash; before Pulsom\'s deposition can take effect.',
          target: '4.3_inform',
          effects: { trust: -20, exposure: -10 },
          lesson: 'Pre-empting another informer was the cleverest of last resorts. The Crown rewarded the *first* deponent most generously: full pardon, often a cash bounty, and protection from prosecution. But turning King\'s evidence destroyed every relationship in the gang at once — and one of them, before nightfall, would try to kill you.'
        }
      ]
    },

    '4.2_flee': {
      act: 4,
      title: 'A Boat from Christchurch',
      image: 'assets/images/act4_flight.jpg',
      caption: 'A small lugger, no papers, the wind contrary.',
      body: [
        'You take a fishing lugger out of Christchurch with a man who asks you no questions because he asks no man any. You make St Helier in two days. Le Brun, the Jerseyman, takes you in.',
        'A letter follows, by another bottom, in a hand you know. It is from David Boyse.',
        { dlg: 'David Boyse', text: 'Mr. {{name}}, you have run, sir. You have done well. Come to Portsea when the heat is off and we shall yet make a good thing of it. &mdash; B.' },
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
      body: [
        'You walk into the Custom House upon the Thames and ask for the **Solicitor for Criminal Prosecutions** &mdash; an office created only this year, in the wake of the recent crimes. Pulsom is there before you. He is surprised to see you, and his surprise turns within a quarter of an hour to anger, and then to a kind of rueful nod.',
        { dlg: 'The Solicitor', text: 'Mr. {{name}}, your information will be received. The terms are these. You will be sworn; you will give evidence against David Boyse, John Hatch, John Sellers, and their confederates upon all the matters within your knowledge. In return, His Majesty will be graciously pleased to issue a pardon for your part in the same matters.' },
        'You sign your name, and another, and another. A clerk fetches you bread and small beer. You receive a *King\'s pardon, sworn,* upon condition.'
      ],
      onEnter: (s) => { s.flags.turnedKingsEvidence = true; },
      choices: [
        { text: 'On to Portsea. The Customs will move on Boyse\'s house at dawn.',
          target: '5.1_face_boyse',
          effects: { addItem: 'pardon', exposure: -20, trust: -10 },
          lesson: 'A sworn pardon eliminated nearly all your legal exposure but cost you every confederate at once. In the historical case, the clerk Pulsom\'s evidence broke the Boyse syndicate, but Pulsom himself was thereafter a man without a country — informers were, in Defoe\'s phrase, "the best paid and least loved of all His Majesty\'s servants".'
        }
      ]
    },

    /* ====== ACT V ====== */

    '5.1_face_boyse': {
      act: 5,
      title: "David Boyse's House at Portsea — Thursday",
      image: 'assets/images/act5_boyse.jpg',
      caption: 'A respectable double-fronted house upon the High; a fire in the parlour.',
      body: [
        'Mr. Boyse greets you with the same folded hands. John Hatch sits in a corner cleaning a pistol. John Sellers stands at the window. Boyse sees in your face that you know.',
        { dlg: 'David Boyse', text: 'Crouch was a fool, Mr. {{name}}, and you, sir, were the unhappy companion of his folly. He had begun to talk where he should have been silent. The *physic* was meant for him alone; you took the cup he had set down. I am sorry for it. I am not so sorry that I would have undone it.' },
        { dlg: 'David Boyse', text: 'Three things may happen in the next quarter of an hour. Choose carefully, sir. I should be sorry to have you killed; sorrier still, perhaps, to be killed myself.' }
      ],
      choices: [
        { text: 'Betray him to the Customs at the door &mdash; for the £500 informer\'s reward.',
          target: '5.3_betray'
        },
        { text: 'Walk out. Take a cottage in the Purbecks. Live honest, however slow.',
          target: '5.4_honest'
        },
        { text: 'Propose one last great run together &mdash; East India tea, in February, by the Lizard.',
          target: '5.5_one_more'
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
        'The reward of £500 is paid to you in two purses by the Solicitor for Criminal Prosecutions, with the customary discount. Boyse and Hatch are tried in the Court of Exchequer in Hilary Term. Hatch will die in the Fleet Prison, his estate insufficient to pay the penalties. The records of the prosecution will be sent up to a Committee of the House of Commons in 1733, and printed.',
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
        permanent. Successful informers commonly relocated; some were murdered.</p>
      `
    },

    '5.4_honest': {
      act: 5,
      title: 'A Cottage above Studland, Five Years Hence',
      image: 'assets/images/act5_honest.jpg',
      caption: 'A garden of beans, a view of Old Harry, a small school for the parish boys.',
      body: [
        'You take a cottage in the Purbecks under another name. The work is poor and the bread is plain; the wind is loud at night. From the cliff you can see, on a clear day, the very offing in which the Dolphin used to lie waiting for her signal. You do not lie awake.',
        'In 1733 a small printed book is brought into the village by a peddler &mdash; *The Report of the Committee Appointed to Inquire into the Frauds and Abuses in the Customs.* You read it from cover to cover by candle. Your name is not in it. Boyse\'s is. Hatch is dead in the Fleet. Sellers, you read, "is a fugitive, and supposed to be in Jersey".',
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
        and 1740s, were broken up only after the murder of an excise officer in 1748.</p>
      `
    },

    '5.5_one_more': {
      act: 5,
      title: 'The Last Run — The Lizard, February 1726',
      image: 'assets/images/act5_lastrun.jpg',
      caption: 'A heavy sea at the Lizard; an East-Indiaman lying-to off the Manacles.',
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
        'You and Cooper take a passage to the Indies upon a Bristol ship and are not seen in England again. You drink, in some hot port, to the memory of the Dolphin and the curious mercy of bad weather.'
      ],
      ending: true,
      endingTitle: 'An Ending — The Last Run',
      endingFlag: 'FINIS — A FUGITIVE TRIUMPH',
      endingHtml: `
        <p>Catastrophic shipwreck was an ordinary risk of the running trade.
        The <em>Albion</em>, a smuggling cutter, was lost off the Manacles in 1731 with
        her whole company; her cargo of brandy and tea washed ashore for a fortnight
        afterwards.</p>
        <p>Real smugglers who fled successfully often went to the colonies — the
        American seaboard, the West Indies, and the Channel Islands — where the trade
        was congenial and English warrants reached only with great delay.</p>
      `
    },

    '5.5b_lastrun_unlucky': {
      act: 5,
      title: 'The Fleet Prison, London — 1731',
      image: 'assets/images/act5_fleet.jpg',
      caption: 'A debtor\'s gallery; a gaol-fever; a clerk crossing names from a list.',
      body: [
        'You are saved from the Manacles only to be taken at Falmouth, three weeks later, by a constable acting upon Pulsom\'s information. The Court of Exchequer condemns you to the triple value of the cargo lost &mdash; £10,500 &mdash; which exceeds your estate, your bond, and any reasonable hope of payment.',
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
        <p>Civil prosecution under the revenue laws was, as the historian David Chan
        Smith has put it, "a mousetrap, often evaded, but with catastrophic consequences
        for those caught."</p>
      `
    },

    /* ====== INTERRUPT SCENES (auto-routed by thresholds) ====== */

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
        { text: 'Flee &mdash; to Jersey, by the next bottom.', target: '4.2_flee' },
        { text: 'Stand &mdash; turn the King\'s evidence at the Custom House.', target: '4.3_inform' }
      ]
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
        Members who lost the trust of the gang were typically informed upon by their
        own associates as a way of disposing of a liability. Boyse himself was said
        in 1733 to have paid "upwards of £200" in bribes and jury entertainments to
        manage exactly such a risk.</p>
      `
    }
  }
};
