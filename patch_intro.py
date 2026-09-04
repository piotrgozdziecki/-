import re

with open('app/src/main/assets/game.html', 'r', encoding='utf-8') as f:
    content = f.read()

new_intro = """const INTRO_ART_SCENES = [
  {
    badge: '📍 BRAMA 4B | 03:00',
    stamp: '🛑 KOSZMAR NA JAWIE',
    satire: '„Szefie, awizo mi się zmyło w praniu...”',
    alertTag: '⚠️ KRYZYS: 40 TIRÓW, JEDEN WÓZEK',
    alertType: 'warning',
    speaker: '🎙️ KIEROWNIK',
    color: '#facc15',
    text: 'Słuchaj uważnie! Prezes pojechał na Malediwy i obciął prąd na hali. Masz tu zostać do 7:00. Przed bramą stoi 40 ukraińskich tirów, a my mamy tylko jeden naładowany wózek BT!',
    sound: 'error'
  },
  {
    badge: '📍 STREFA ZWROTÓW | 03:15',
    stamp: '🔥 PROTOKÓŁ ZNISZCZENIA',
    satire: '„Ochrona słuchu to dla słabych.”',
    alertTag: '🚨 STATUS: INWAZJA AUDYTORÓW',
    alertType: 'danger',
    speaker: '🎙️ ZASTĘPCA',
    color: '#ef4444',
    text: 'Urząd Skarbowy i Państwowa Inspekcja Pracy przeprowadzają równoległy nalot z orbity! Celnicy sprawdzają każdą paczkę, a awaria chłodni zalała magazyn toksyczną kawą z automatu!',
    sound: 'beep'
  },
  {
    badge: '📍 REGAŁY WYSOKIEGO SKŁADOWANIA',
    stamp: '⚠️ ŚMIERĆ Z GÓRY',
    satire: '„Dziwne, na moim terminalu działa.”',
    alertTag: '🛑 SYSTEM WMS PŁONIE',
    alertType: 'danger',
    speaker: '🎙️ IT SUPPORT',
    color: '#38bdf8',
"""

content = re.sub(r'const INTRO_ART_SCENES = \[\s*\{\s*badge: \'📍 BRAMA 4B \| 03:00\',[^\}]+}[^\}]+}[^\}]+speaker: \'🎙️ IT SUPPORT\',\s*color: \'#38bdf8\',', new_intro.strip() + ",", content)


with open('app/src/main/assets/game.html', 'w', encoding='utf-8') as f:
    f.write(content)

