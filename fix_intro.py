import re

with open('app/src/main/assets/game.html', 'r') as f:
    text = f.read()

intro_old_regex = r"const INTRO_ART_SCENES = \[.*?\];"

intro_new = """const INTRO_ART_SCENES = [
  {
    badge: '📍 MAGAZYN GŁÓWNY DTA | 03:15',
    stamp: '🛑 KRYZYS NADGODZINOWY',
    satire: '„Panie kierowniku, tylko dwie paletki! Ja na chwilę!”',
    alertTag: '🛑 STAN: ZATOR (30 BUSÓW)',
    alertType: 'danger',
    speaker: '🎙️ KIEROWNIK ZMIANY',
    color: '#ef4444',
    text: 'Słuchajcie załoga! Prezes ogłosił Bezpłatne Nadgodziny! Mamy 30 busów pod rampą, a Praktykanci znowu zgubili skanery. Każdy bierze paleciaka w dłoń, wózek BT na plecy i do boju!',
    sound: 'bossAlert'
  },
  {
    badge: '📍 STREFA KAWY | 03:16',
    stamp: '⚠️ PRZECIĄŻENIE SYSTEMU WMS',
    satire: '„Brak sygnału WiFi... Spróbuj ponownie.”',
    alertTag: '⚠️ STAN: ODBICIE Z NÓG',
    alertType: 'warning',
    speaker: '🎙️ PRZEMEK Z BIURA',
    color: '#f59e0b',
    text: 'System WMS znowu padł. Audytorzy BHP już krążą po hali i wlepiają mandaty za brak kamizelek. Uważajcie na latające paczki i tajemnicze zguby z HSa - mogą wam pomóc, albo całkowicie uziemić!',
    sound: 'error'
  },
  {
    badge: '📍 BRAMA WYJŚCIOWA | 03:17',
    stamp: '🔥 TRYB PRZETRWANIA AKTYWNY',
    satire: '„Nie płacą mi wystarczająco za to...”',
    alertTag: '🔥 STAN: VAMPIRE SURVIVOR',
    alertType: 'danger',
    speaker: '🎙️ ZASTĘPCA GRZESIEK',
    color: '#0284c7',
    text: 'Zasady są proste. Przetrwaj do 07:00, zdobywaj Kody Kreskowe, żeby awansować. Ewolucje broni uratują Ci życie, więc łącz je ze sobą! Ogień z rury z wózka i jedziemy z towarem!',
    sound: 'achieve'
  }
];"""

text = re.sub(r'const INTRO_ART_SCENES = \[.*?\];', intro_new, text, flags=re.DOTALL)
# Also fix currentIntroIndex === INTRO_SCENES.length
text = text.replace('currentIntroIndex >= INTRO_SCENES.length', 'currentIntroIndex >= INTRO_ART_SCENES.length')

with open('app/src/main/assets/game.html', 'w') as f:
    f.write(text)
