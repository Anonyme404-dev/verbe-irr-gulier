/* ============================================================
   Verbes irréguliers : les données du site
   ------------------------------------------------------------
   Un verbe par ligne :  Base|Prétérit|Participe passé|Traduction

   - Plusieurs formes possibles : sépare-les par « / »   (Burnt/burned)
   - Plusieurs traductions : sépare-les par une virgule   (Voler, dérober)
   - Une précision entre parenthèses est ignorée à la correction   (Porter (habits))
   - Chaque base doit être UNIQUE. La liste est triée automatiquement.
   ============================================================ */
const RAW = `Arise|Arose|Arisen|Surgir, se lever
Awake|Awoke|Awoken|Se réveiller
Be|Was/were|Been|Être
Bear|Bore|Borne/born|Supporter, mettre au monde
Beat|Beat|Beaten|Battre
Become|Became|Become|Devenir
Begin|Began|Begun|Commencer
Behold|Beheld|Beheld|Apercevoir, contempler
Bend|Bent|Bent|Plier, courber
Bet|Bet|Bet|Parier
Bid|Bid|Bid|Enchérir, offrir
Bind|Bound|Bound|Lier, attacher
Bite|Bit|Bitten|Mordre
Bleed|Bled|Bled|Saigner
Blow|Blew|Blown|Souffler
Break|Broke|Broken|Casser
Breed|Bred|Bred|Élever (animaux)
Bring|Brought|Brought|Apporter
Broadcast|Broadcast|Broadcast|Diffuser
Build|Built|Built|Construire
Burn|Burnt/burned|Burnt/burned|Brûler
Burst|Burst|Burst|Éclater
Buy|Bought|Bought|Acheter
Cast|Cast|Cast|Jeter, lancer
Catch|Caught|Caught|Attraper
Choose|Chose|Chosen|Choisir
Cling|Clung|Clung|S'accrocher
Come|Came|Come|Venir
Cost|Cost|Cost|Coûter
Creep|Crept|Crept|Ramper
Cut|Cut|Cut|Couper
Deal|Dealt|Dealt|Traiter, distribuer
Dig|Dug|Dug|Creuser
Dive|Dived/dove|Dived|Plonger
Do|Did|Done|Faire
Draw|Drew|Drawn|Dessiner, tirer
Dream|Dreamt/dreamed|Dreamt/dreamed|Rêver
Drink|Drank|Drunk|Boire
Drive|Drove|Driven|Conduire
Dwell|Dwelt|Dwelt|Habiter, demeurer
Eat|Ate|Eaten|Manger
Fall|Fell|Fallen|Tomber
Feed|Fed|Fed|Nourrir
Feel|Felt|Felt|Ressentir
Fight|Fought|Fought|Se battre
Find|Found|Found|Trouver
Fit|Fit/fitted|Fit/fitted|Convenir, aller (taille)
Flee|Fled|Fled|Fuir
Fling|Flung|Flung|Lancer, jeter
Fly|Flew|Flown|Voler (dans les airs)
Forbid|Forbade|Forbidden|Interdire
Forecast|Forecast|Forecast|Prévoir (météo)
Foresee|Foresaw|Foreseen|Prévoir, anticiper
Foretell|Foretold|Foretold|Prédire
Forget|Forgot|Forgotten|Oublier
Forgive|Forgave|Forgiven|Pardonner
Forsake|Forsook|Forsaken|Abandonner
Freeze|Froze|Frozen|Geler
Get|Got|Got/gotten|Obtenir, avoir
Give|Gave|Given|Donner
Go|Went|Gone|Aller
Grind|Ground|Ground|Moudre
Grow|Grew|Grown|Grandir, pousser
Hang|Hung|Hung|Accrocher, suspendre
Have|Had|Had|Avoir
Hear|Heard|Heard|Entendre
Hide|Hid|Hidden|(se) cacher
Hit|Hit|Hit|Frapper
Hold|Held|Held|Tenir
Hurt|Hurt|Hurt|Blesser, faire mal
Keep|Kept|Kept|Garder
Kneel|Knelt/kneeled|Knelt/kneeled|S'agenouiller
Knit|Knit/knitted|Knit/knitted|Tricoter
Know|Knew|Known|Savoir, connaître
Lay|Laid|Laid|Poser, déposer
Lead|Led|Led|Mener, guider
Lean|Leant/leaned|Leant/leaned|Se pencher, s'appuyer
Leap|Leapt/leaped|Leapt/leaped|Bondir
Learn|Learnt/learned|Learnt/learned|Apprendre
Leave|Left|Left|Partir, quitter
Lend|Lent|Lent|Prêter
Let|Let|Let|Laisser, permettre
Lie|Lay|Lain|S'allonger
Light|Lit/lighted|Lit/lighted|Allumer
Lose|Lost|Lost|Perdre
Make|Made|Made|Faire, fabriquer
Mean|Meant|Meant|Signifier, vouloir dire
Meet|Met|Met|Rencontrer
Mislay|Mislaid|Mislaid|Égarer
Mistake|Mistook|Mistaken|Se tromper
Misunderstand|Misunderstood|Misunderstood|Mal comprendre
Mow|Mowed|Mown/mowed|Tondre
Outdo|Outdid|Outdone|Surpasser
Overcome|Overcame|Overcome|Vaincre, surmonter
Override|Overrode|Overridden|Annuler, passer outre
Oversee|Oversaw|Overseen|Superviser
Overtake|Overtook|Overtaken|Dépasser, doubler
Partake|Partook|Partaken|Prendre part
Pay|Paid|Paid|Payer
Prove|Proved|Proven/proved|Prouver
Put|Put|Put|Mettre, poser
Quit|Quit/quitted|Quit/quitted|Quitter, arrêter
Read|Read|Read|Lire
Rebuild|Rebuilt|Rebuilt|Reconstruire
Redo|Redid|Redone|Refaire
Repay|Repaid|Repaid|Rembourser
Retell|Retold|Retold|Raconter de nouveau
Rethink|Rethought|Rethought|Repenser
Rewrite|Rewrote|Rewritten|Réécrire
Rid|Rid|Rid|Débarrasser
Ride|Rode|Ridden|Monter (cheval, vélo)
Ring|Rang|Rung|Sonner
Rise|Rose|Risen|Se lever, monter
Run|Ran|Run|Courir
Saw|Sawed|Sawn/sawed|Scier
Say|Said|Said|Dire
See|Saw|Seen|Voir
Seek|Sought|Sought|Chercher
Sell|Sold|Sold|Vendre
Send|Sent|Sent|Envoyer
Set|Set|Set|Placer, régler
Sew|Sewed|Sewn/sewed|Coudre
Shake|Shook|Shaken|Secouer
Shear|Sheared|Shorn/sheared|Tondre (moutons)
Shed|Shed|Shed|Répandre, perdre (feuilles)
Shine|Shone|Shone|Briller
Shoot|Shot|Shot|Tirer (arme), filmer
Show|Showed|Shown/showed|Montrer
Shrink|Shrank|Shrunk|Rétrécir
Shut|Shut|Shut|Fermer
Sing|Sang|Sung|Chanter
Sink|Sank|Sunk|Couler
Sit|Sat|Sat|S'asseoir
Slay|Slew|Slain|Tuer
Sleep|Slept|Slept|Dormir
Slide|Slid|Slid|Glisser
Slit|Slit|Slit|Fendre, entailler
Smell|Smelt/smelled|Smelt/smelled|Sentir (odeur)
Sow|Sowed|Sown/sowed|Semer
Speak|Spoke|Spoken|Parler
Speed|Sped/speeded|Sped/speeded|Aller vite
Spell|Spelt/spelled|Spelt/spelled|Épeler
Spend|Spent|Spent|Dépenser, passer (temps)
Spill|Spilt/spilled|Spilt/spilled|Renverser
Spin|Spun|Spun|Faire tourner, filer
Spit|Spat|Spat|Cracher
Split|Split|Split|Fendre, diviser
Spoil|Spoilt/spoiled|Spoilt/spoiled|Gâcher, abîmer
Spread|Spread|Spread|Étaler, répandre
Spring|Sprang|Sprung|Bondir, jaillir
Stand|Stood|Stood|Se tenir debout
Steal|Stole|Stolen|Voler, dérober
Stick|Stuck|Stuck|Coller, rester coincé
Sting|Stung|Stung|Piquer
Stink|Stank|Stunk|Puer
Stride|Strode|Stridden|Marcher à grands pas
Strike|Struck|Struck|Frapper
Strive|Strove|Striven|S'efforcer
Swear|Swore|Sworn|Jurer
Sweep|Swept|Swept|Balayer
Swell|Swelled|Swollen/swelled|Gonfler
Swim|Swam|Swum|Nager
Swing|Swung|Swung|Se balancer
Take|Took|Taken|Prendre
Teach|Taught|Taught|Enseigner
Tear|Tore|Torn|Déchirer
Tell|Told|Told|Dire, raconter
Think|Thought|Thought|Penser
Throw|Threw|Thrown|Lancer
Thrust|Thrust|Thrust|Enfoncer, pousser
Tread|Trod|Trodden/trod|Marcher sur, piétiner
Undergo|Underwent|Undergone|Subir
Understand|Understood|Understood|Comprendre
Undertake|Undertook|Undertaken|Entreprendre
Undo|Undid|Undone|Défaire
Unwind|Unwound|Unwound|Dérouler, se détendre
Uphold|Upheld|Upheld|Défendre, maintenir
Upset|Upset|Upset|Bouleverser, contrarier
Wake|Woke|Woken|Se réveiller
Wear|Wore|Worn|Porter (habits)
Weave|Wove|Woven|Tisser
Weep|Wept|Wept|Pleurer
Wet|Wet/wetted|Wet/wetted|Mouiller
Win|Won|Won|Gagner
Wind|Wound|Wound|Enrouler, remonter
Withdraw|Withdrew|Withdrawn|Retirer
Withhold|Withheld|Withheld|Retenir
Withstand|Withstood|Withstood|Résister à
Wring|Wrung|Wrung|Tordre, essorer
Write|Wrote|Written|Écrire`;

const verbsData = RAW.trim().split('\n')
  .map(line => {
    const [base, preterit, participle, french] = line.split('|').map(x => x.trim());
    return { base, preterit, participle, french };
  })
  .sort((a, b) => a.base.localeCompare(b.base));
