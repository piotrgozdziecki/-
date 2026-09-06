/**
 * ENTITIES - Catalogs
 * Data catalogs for Characters, Sectors, Upgrades, Evolutions, Bestiary, Weapons, and Enemy Types.
 */

window.CHARACTERS = {
  piotr: {
    key: 'piotr',
    name: 'Piotr & K-9 Kluska',
    icon: '🐺',
    role: 'Zwiad & Odzysk Polowy',
    weaponName: 'Miotacz Gazu & Śrut',
    passiveDesc: 'K-9 odzyskuje telemetrię +35% ataku',
    speed: 175,
    maxBattery: 120,
    magnet: 140,
    critBonus: 0.15,
    attackSpeedMult: 1.15,
    quote: 'Perymetr zabezpieczony. Kluska, osłaniaj lewą flankę!'
  },
  radek: {
    key: 'radek',
    name: 'Operator Radek',
    icon: '🚜',
    role: 'Szturmowiec Wózka BT',
    weaponName: 'Szarża Kinetyczna V-MAX',
    passiveDesc: 'Drift na posadzce, taranowanie wrogów',
    speed: 210,
    maxBattery: 110,
    magnet: 110,
    critBonus: 0.10,
    attackSpeedMult: 1.0,
    quote: 'Prędkość to nasz pancerz. Gaz do oporu!'
  },
  mirek: {
    key: 'mirek',
    name: 'Inżynier Mirek',
    icon: '🔧',
    role: 'Ciężka Konserwacja',
    weaponName: 'Młot Hydrauliczny 360°',
    passiveDesc: 'Autonaprawa pancerza +35% obrażeń maszyn',
    speed: 160,
    maxBattery: 160,
    magnet: 120,
    critBonus: 0.05,
    attackSpeedMult: 0.85,
    quote: 'Dopóki silnik BT ma olej, żadna horda nie przejdzie.'
  },
  klaus: {
    key: 'klaus',
    name: 'Audytor Klaus',
    icon: '🎯',
    role: 'Koordynator Balistyczny DIN',
    weaponName: 'Promień Laserowy DIN',
    passiveDesc: 'Namierzanie precyzyjne +4 karty taktyczne',
    speed: 180,
    maxBattery: 125,
    magnet: 150,
    critBonus: 0.25,
    attackSpeedMult: 1.1,
    quote: 'Naruszenie procedur bezpieczeństwa eliminuje się natychmiast.'
  },
  pawel: {
    key: 'pawel',
    name: 'Brygadzista Paweł',
    icon: '🪵',
    role: 'Obrona Kompozytowa EPAL',
    weaponName: 'Salwa Balistyczna EPAL',
    passiveDesc: 'Rotacyjna tarcza kinetyczna +20% baterii',
    speed: 155,
    maxBattery: 150,
    magnet: 115,
    critBonus: 0.08,
    attackSpeedMult: 0.9,
    quote: 'Certyfikowana twardość EPAL odbije każde uderzenie.'
  }
};

window.WAREHOUSE_SECTORS = [
  { id: 1, name: "RAMPA PRZYJĘĆ B2B", bg: "01_rampa", hazardColor: "#10b981", bossTime: 120, bossKey: "KAS_INSPECTOR" },
  { id: 2, name: "ALEJA REGAŁÓW WYSOKIEGO SKŁADOWANIA", bg: "02_highstack", hazardColor: "#38bdf8", bossTime: 120, bossKey: "TOITOI_3000" },
  { id: 3, name: "SEKTOR COLD-STORAGE (CHŁODNIA -24°C)", bg: "03_chlodnia", hazardColor: "#06b6d4", bossTime: 120, bossKey: "KONTENEROWIEC_40FT" },
  { id: 4, name: "SORTOWNIA GABARYTÓW & AGD", bg: "04_sortownia", hazardColor: "#f59e0b", bossTime: 120, bossKey: "KAS_INSPECTOR" },
  { id: 5, name: "CENTRALA DYREKCJI & GABINET ZARZĄDU", bg: "05_zarzad", hazardColor: "#ef4444", bossTime: 120, bossKey: "DYREKTOR_VON_AUDIT" }
];

window.GARAGE_UPGRADES = [
  { key: 'battery', name: 'Ogniwo Baterii Wysokiej Gęstości', icon: '🔋', baseCost: 150, desc: '+30 Max Integralności Akumulatora Wózka' },
  { key: 'speed', name: 'Poliuretanowy Układ Napędowy', icon: '⚙️', baseCost: 200, desc: '+10% Prędkości i zwrotności manewrowej' },
  { key: 'magnet', name: 'Sonda Magnetyczna WMS', icon: '🧲', baseCost: 350, desc: '+50% Promienia przechwytywania telemetrii XP' },
  { key: 'oponyKolcowane', name: 'Bieżnik Taktyczny Na Posadzki', icon: '🛞', baseCost: 450, desc: '-70% Poślizgu na śliskich powierzchniach | Drift' },
  { key: 'kogutOstrzegawczy', name: 'Stroboskop Ostrzegawczy BHP', icon: '🚨', baseCost: 500, desc: 'Tłumi prędkość wrogów nacierających od tyłu o 40%' },
  { key: 'halogenyLed', name: 'Reflektory Taktyczne LED Matrix', icon: '💡', baseCost: 600, desc: '+60% Zasięgu snopa światła w ciemności' },
  { key: 'pancerzRabitza', name: 'Pancerz Kompozytowy Siatkowy', icon: '🛡️', baseCost: 850, desc: 'Absorbuje 1 śmiertelne trafienie na zmianę' },
  { key: 'chiptuning', name: 'Układ Nadprądowy WMS Overclock', icon: '⚡', baseCost: 1000, desc: '+20% Szybkości przeładowania całego arsenału' }
];

window.SYNERGY_EVOLUTIONS = [
  { weaponName: 'Skaner Laserowy', passiveName: 'Super Bateria', evoName: 'Przemysłowa Bramka RFID', evoIcon: '⚡', evoPower: 'Permanentna dookolna strefa porażenia w promieniu 240px!' },
  { weaponName: 'Paleciak Bojowy', passiveName: 'Smar Syntetyczny', evoName: 'Wózek BT High-Stack', evoIcon: '🚜', evoPower: 'Automatyczny taran kinetyczny i plamy poślizgowe oleju!' },
  { weaponName: 'Pistolet na Taśmę', passiveName: 'Certyfikat ISO', evoName: 'Automatyczna Owijarka', evoIcon: '🎗️', evoPower: 'Ciągła salwa wiążąca unieruchamia nacierające jednostki!' },
  { weaponName: 'Gaśnica PPOŻ', passiveName: 'Protokół BHP', evoName: 'System Zraszaczowy PPOŻ', evoIcon: '❄️', evoPower: 'Co 8s emituje impuls kriogeniczny zamrażający sektor!' }
];

window.WEAPON_CATALOG = {
  scanner: { id: 'scanner', name: 'Skaner Laserowy DS3678', icon: '🔦', type: 'beam', baseDamage: 18, baseCd: 0.6, range: 280, color: '#38bdf8' },
  pallet: { id: 'pallet', name: 'Paleciak Bojowy EPAL', icon: '🪵', type: 'orbit', baseDamage: 32, baseCd: 1.2, range: 180, color: '#f97316' },
  tape: { id: 'tape', name: 'Pistolet na Taśmę Strecz', icon: '🧻', type: 'projectile', baseDamage: 14, baseCd: 0.35, range: 350, color: '#fef08a' },
  extinguisher: { id: 'extinguisher', name: 'Gaśnica PPOŻ Proszkowa', icon: '🧯', type: 'cone', baseDamage: 10, baseCd: 0.15, range: 160, color: '#38bdf8' }
};

window.ENEMY_TYPES = {
  RAT: { key: 'RAT', name: 'Szczur Rampowy', icon: '🐀', hp: 20, speed: 135, radius: 12, damage: 6, score: 10, color: '#10b981' },
  KARTON_B2C: { key: 'KARTON_B2C', name: 'Zbłąkana Paczka B2C', icon: '📦', hp: 15, speed: 80, radius: 14, damage: 4, score: 5, color: '#10b981' },
  DRON_RFID: { key: 'DRON_RFID', name: 'Dron Skanujący RFID', icon: '🛸', hp: 65, speed: 100, radius: 16, damage: 12, score: 25, color: '#38bdf8' },
  LI_ION: { key: 'LI_ION', name: 'Ogniwo Li-Ion', icon: '💥', hp: 45, speed: 150, radius: 15, damage: 25, score: 20, color: '#ef4444', explosive: true },
  KURIER_C: { key: 'KURIER_C', name: 'Kurier Gabaryt C', icon: '📦', hp: 170, speed: 90, radius: 22, damage: 18, score: 50, color: '#f59e0b' },
  INSPEKTOR_DIN: { key: 'INSPEKTOR_DIN', name: 'Inspektor DIN/ISO', icon: '📐', hp: 240, speed: 60, radius: 25, damage: 22, score: 80, color: '#a855f7' },
  BUS_TRANZYTOWY: { key: 'BUS_TRANZYTOWY', name: 'Bus Tranzytowy', icon: '🚐', hp: 420, speed: 110, radius: 32, damage: 35, score: 150, color: '#f97316' },
  KAS_INSPECTOR: { key: 'KAS_INSPECTOR', name: 'Główny Inspektor KAS', icon: '🦅', hp: 2500, speed: 70, radius: 45, damage: 40, score: 1000, isBoss: true, color: '#ef4444' },
  TOITOI_3000: { key: 'TOITOI_3000', name: 'Mecha-ToiToi 3000', icon: '🚽', hp: 4800, speed: 75, radius: 50, damage: 50, score: 2000, isBoss: true, color: '#10b981' },
  KONTENEROWIEC_40FT: { key: 'KONTENEROWIEC_40FT', name: 'Kontenerowiec 40ft', icon: '🚢', hp: 6000, speed: 35, radius: 65, damage: 60, score: 3000, isBoss: true, color: '#38bdf8' },
  DYREKTOR_VON_AUDIT: { key: 'DYREKTOR_VON_AUDIT', name: 'Dyrektor von Audit', icon: '💡', hp: 8500, speed: 85, radius: 55, damage: 75, score: 5000, isBoss: true, color: '#c084fc' }
};
