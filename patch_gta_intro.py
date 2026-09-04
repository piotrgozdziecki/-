import re

with open('app/src/main/assets/game.html', 'r') as f:
    text = f.read()

intro_old = re.search(r'const INTRO_ART_SCENES = \[.*?\n\];\n', text, re.DOTALL).group(0)

intro_new = """const INTRO_ART_SCENES = [
  {
    badge: '📍 BRAMA 4B | 03:00',
    stamp: '🛑 NADGODZINY ROZPOCZĘTE',
    satire: '„Tylko dwie paletki szefie, zrzucę i spadam!”',
    alertTag: '⚠️ KRYZYS: 18 BUSÓW W KORKU',
    alertType: 'warning',
    speaker: '🎙️ KIEROWNIK',
    color: '#facc15',
    text: 'Słuchaj uważnie! Prezes uciął budżet. Nie ma nadgodzin, ale masz tu zostać do 7:00. Pół załogi poszło na L4, a przed bramą stoi 18 busów z towarem.',
    sound: 'error'
  },
  {
    badge: '📍 STREFA ZWROTÓW | 03:15',
    stamp: '🔥 BRAK KASKU - ŚMIERĆ',
    satire: '„Ochrona wzroku to mit, widzę doskonale.”',
    alertTag: '🚨 STATUS: AUDYT BHP',
    alertType: 'danger',
    speaker: '🎙️ ZASTĘPCA',
    color: '#ef4444',
    text: 'Inspektorzy z BHP zjechali na magazyn! Będą sypać mandatami za brak butów z blachą. Wrogowie to nie tylko kartony, ale i zbłąkani praktykanci bez opieki!',
    sound: 'beep'
  },
  {
    badge: '📍 REGAŁY WYSOKIEGO SKŁADOWANIA',
    stamp: '⚠️ SYSTEM WMS PADŁ',
    satire: '„Dziwne, na moim HS-ie działa.”',
    alertTag: '🛑 ZATOR SYSTEMOWY',
    alertType: 'danger',
    speaker: '🎙️ IT SUPPORT',
    color: '#38bdf8',
    text: 'Serwery leżą! Skanery przestały działać, więc musisz improwizować. Używaj owijarki ze streczem i ręcznego paleciaka żeby przetrwać. Magia magazynu.',
    sound: 'error'
  },
  {
    badge: '📍 STREFA VIP',
    stamp: '☠️ INSPEKTOR KAS NADCIĄGA',
    satire: '„Panie, to nie moje cło...”',
    alertTag: '🚨 KONTROLA SKARBOWA',
    alertType: 'warning',
    speaker: '🎙️ OCHRONA',
    color: '#facc15',
    text: 'Uwaga! Jeśli zobaczysz czerwoną strefę Rewizji Szczegółowej, masz 5 sekund by stamtąd uciec! Urząd Skarbowy nie bierze jeńców!',
    sound: 'bossAlert'
  },
  {
    badge: '📍 WÓZKI WIDŁOWE',
    stamp: '🚀 TRYB VAMPIRE SURVIVOR',
    satire: '„Mam na to uprawnienia... chyba.”',
    alertTag: '🔥 OVERTIME APOCALYPSE',
    alertType: 'danger',
    speaker: '🎙️ KIEROWNIK',
    color: '#ef4444',
    text: 'Zasady są proste: Rób uniki, uciekaj przed chmarą kartonów, a gdy pasek baterii się naładuje - odpalaj wózek BT i rozjeżdżaj ich wszystkich! JAZDA!',
    sound: 'achieve'
  }
];
"""

text = text.replace(intro_old, intro_new)

with open('app/src/main/assets/game.html', 'w') as f:
    f.write(text)
