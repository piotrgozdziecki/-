import re

with open('app/src/main/assets/game.html', 'r') as f:
    text = f.read()

names_old = """  const regularCards = [
    { id: 'scanner', name: 'Laserowy Skaner Kodów', icon: '🔦', desc: 'Razi laserem i odprawia paczki.', cat: 'weapon' },
    { id: 'toiletPaper', name: 'Rzuty Papierem Toaletowym', icon: '🧻', desc: 'Obrzuca kierowców i blokuje ich ruch.', cat: 'weapon' },
    { id: 'stretchAura', name: 'Aura z Folii Stretch', icon: '🌀', desc: 'Wirujące rolki folii tnące wrogów.', cat: 'weapon' },
    { id: 'pallets', name: 'Miotacz Palet EPAL', icon: '🪵', desc: 'Wystrzeliwuje ciężkie drewniane palety.', cat: 'weapon' },
    { id: 'extinguisher', name: 'Gaśnica Śniegowa CO2', icon: '🧯', desc: 'Mrozi wrogów i tworzy lodowy stożek.', cat: 'weapon' },
    { id: 'zipTies', name: 'Trytytki Samozaciskowe', icon: '🔗', desc: 'Wystrzeliwuje taśmy blokujące wrogów.', cat: 'weapon' },
    { id: 'cutter', name: 'Nóż do Tapet (Gilotyna)', icon: '🔪', desc: 'Przecina wrogów na pół, przenikając ich.', cat: 'weapon' },"""

names_new = """  const regularCards = [
    { id: 'scanner', name: 'Skaner Kodów Kreskowych', icon: '🔦', desc: 'Promień laserowy w najbliższego wroga.', cat: 'weapon' },
    { id: 'toiletPaper', name: 'Pistolet na Taśmę "Pakowa"', icon: '🧻', desc: 'Wystrzeliwuje lepkie taśmy niszczące wrogów.', cat: 'weapon' },
    { id: 'stretchAura', name: 'Aura z Folii Stretch', icon: '🌀', desc: 'Wirujące rolki folii tnące wrogów.', cat: 'weapon' },
    { id: 'pallets', name: 'Ręczny Paleciak', icon: '🪵', desc: 'Taran odpychający wrogów przed graczem.', cat: 'weapon' },
    { id: 'extinguisher', name: 'Gaśnica Proszkowa PPOŻ', icon: '🧯', desc: 'Stożek zamrażający/spowalniający.', cat: 'weapon' },
    { id: 'zipTies', name: 'Trytytki Samozaciskowe', icon: '🔗', desc: 'Wystrzeliwuje taśmy blokujące wrogów.', cat: 'weapon' },
    { id: 'cutter', name: 'Nóż do Tapet (Gilotyna)', icon: '🔪', desc: 'Przecina wrogów na pół, przenikając ich.', cat: 'weapon' },"""

text = text.replace(names_old, names_new)

with open('app/src/main/assets/game.html', 'w') as f:
    f.write(text)
