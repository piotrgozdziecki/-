package com.example.data

enum class CardType(val label: String, val icon: String, val colorHex: Long) {
    ACTIVE("BROŃ", "⚔️", 0xFF38BDF8),
    PASSIVE("PERK BHP", "🛡️", 0xFF22C55E),
    DEBUFF("RYZYKO", "⚠️", 0xFFEF4444),
    EVOLUTION("EWOLUCJA", "⚡", 0xFFF59E0B)
}

enum class CardRarity(val label: String, val colorHex: Long) {
    COMMON("ZWYKŁA", 0xFF94A3B8),
    RARE("RZADKA", 0xFF38BDF8),
    EPIC("EPICKA", 0xFFA855F7),
    LEGENDARY("LEGENDARNA", 0xFFF59E0B)
}

data class UpgradeCard(
    val id: String,
    val title: String,
    val cardType: CardType,
    val icon: String,
    val description: String,
    val statBonus: String,
    val debuffPenalty: String? = null,
    val rarity: CardRarity = CardRarity.COMMON,
    val maxLevel: Int = 5,
    val currentLevel: Int = 1,
    val synergyReq: String? = null
)

object UpgradeCardPool {
    val ALL_CARDS = listOf(
        // ==========================================
        // ⚔️ ACTIVE WEAPONS & EQUIPMENT (13 CARDS)
        // ==========================================
        UpgradeCard(
            id = "scanner_active",
            title = "Skaner Kodów DTA",
            cardType = CardType.ACTIVE,
            icon = "🔦",
            description = "Promień laserowy wypalający najwścieklejszych wrogów.",
            statBonus = "+15 Obrażeń | Promień laserowy | +1 Pierce",
            rarity = CardRarity.RARE,
            synergyReq = "Ewolucja z: Super Bateria 🔋"
        ),
        UpgradeCard(
            id = "toilet_paper_active",
            title = "Pistolet na Taśmę Pakową",
            cardType = CardType.ACTIVE,
            icon = "🧻",
            description = "Szybka salwa cewek taśmy klejącej spowalniającej i niszczącej busiarzy.",
            statBonus = "+2 Pociski taśmowe | +20% Szybkość ognia",
            rarity = CardRarity.COMMON,
            synergyReq = "Ewolucja z: Certyfikat ISO 📜"
        ),
        UpgradeCard(
            id = "stretch_aura_active",
            title = "Aura z Folii Stretch",
            cardType = CardType.ACTIVE,
            icon = "🌀",
            description = "Wirujące rolki folii tnące wrogów podchodzących za blisko wózka.",
            statBonus = "+1 Rolka folii | +12 Obrażeń cięcia",
            rarity = CardRarity.COMMON,
            synergyReq = "Ewolucja z: Buty Robocze 🥾"
        ),
        UpgradeCard(
            id = "pallet_truck_active",
            title = "Ręczny Paleciak BT",
            cardType = CardType.ACTIVE,
            icon = "🪵",
            description = "Stalowy taran taranujący i odpychający całe chmary wrogów przed sobą.",
            statBonus = "+30 Obrażeń taranowania | MOCNE ODPYCHANIE",
            rarity = CardRarity.EPIC,
            synergyReq = "Ewolucja z: Smar Syntetyczny 🛢️"
        ),
        UpgradeCard(
            id = "extinguisher_active",
            title = "Gaśnica Proszkowa PPOŻ",
            cardType = CardType.ACTIVE,
            icon = "🧯",
            description = "Mrożący stożek zamrażający wrogów w promieniu przed wózkiem.",
            statBonus = "Zamrożenie na 2.5s | +18 Obrażeń chłodu",
            rarity = CardRarity.RARE,
            synergyReq = "Ewolucja z: Protokół BHP 📋"
        ),
        UpgradeCard(
            id = "zip_ties_active",
            title = "Trytytki Samozaciskowe",
            cardType = CardType.ACTIVE,
            icon = "🔗",
            description = "Wystrzeliwuje taśmy blokujące wrogów w miejscu.",
            statBonus = "+1 Taśma blokująca | Dłuższe spowolnienie",
            rarity = CardRarity.COMMON,
            synergyReq = "Ewolucja z: Certyfikat ISO 📜"
        ),
        UpgradeCard(
            id = "cutter_active",
            title = "Nóż do Tapet Stanley",
            cardType = CardType.ACTIVE,
            icon = "🔪",
            description = "Przecina wrogów na pół, przenikając przez całą aleję.",
            statBonus = "+1 Przebicie | +15 Obrażeń gilotyny",
            rarity = CardRarity.RARE,
            synergyReq = "Ewolucja z: Protokół BHP 📋"
        ),
        UpgradeCard(
            id = "stapler_active",
            title = "Zszywacz Pneumatyczny",
            cardType = CardType.ACTIVE,
            icon = "📌",
            description = "Szybka seria stalowych zszywek magazynowych.",
            statBonus = "+2 Zszywki | Szybsza salwa klamrowa",
            rarity = CardRarity.COMMON,
            synergyReq = "Ewolucja z: Super Bateria 🔋"
        ),
        UpgradeCard(
            id = "sledgehammer_active",
            title = "Młot Konserwatora BHP",
            cardType = CardType.ACTIVE,
            icon = "🔨",
            description = "Potężne uderzenie w posadzkę niszczące wrogów w 360°.",
            statBonus = "+40 Obrażeń fali | Efekt ogłuszenia 1.5s",
            rarity = CardRarity.EPIC,
            synergyReq = "Ewolucja z: Smar Syntetyczny 🛢️"
        ),
        UpgradeCard(
            id = "faktura_active",
            title = "Faktura Korygująca",
            cardType = CardType.ACTIVE,
            icon = "📄",
            description = "Latające papiery tnące wrogów i nakładające podatek od strat.",
            statBonus = "+1 Faktura | Większa prędkość rotacji",
            rarity = CardRarity.RARE,
            synergyReq = "Ewolucja z: Unik przed Alkomatem 🍺"
        ),
        UpgradeCard(
            id = "kawa_active",
            title = "Toksyczna Kawa z Automatu",
            cardType = CardType.ACTIVE,
            icon = "☕",
            description = "Rozlewa wrzący, kaustyczny kwas pod koła busiarzy.",
            statBonus = "Większa plama kaustyczna | +12 Obrażeń/s",
            rarity = CardRarity.COMMON,
            synergyReq = "Ewolucja z: Furia Magazyniera 🤬"
        ),
        UpgradeCard(
            id = "hydrant_active",
            title = "Hydrant Magazynowy PPOŻ",
            cardType = CardType.ACTIVE,
            icon = "🚰",
            description = "Silne strumienie wody zmywające całe aleje z natrętnych kierowców.",
            statBonus = "+40 Obrażeń fali | Zasięg całej alei",
            rarity = CardRarity.LEGENDARY,
            synergyReq = "Ewolucja z: Stoperan 💊"
        ),
        UpgradeCard(
            id = "megafon_active",
            title = "Megafon Kierownika Hali",
            cardType = CardType.ACTIVE,
            icon = "📢",
            description = "Fala dźwiękowa 'DO ROBOTY!' ogłuszająca wszystkich wrogów.",
            statBonus = "+20% Zasięgu ogłuszenia | Szybsza syrena",
            rarity = CardRarity.EPIC,
            synergyReq = "Ewolucja z: Karta Multisport 💳"
        ),

        // ==========================================
        // 🛡️ PASSIVE BUFFS & PERKS (12 CARDS)
        // ==========================================
        UpgradeCard(
            id = "perk_no_brakes",
            title = "Brak Hamulców w Wózku",
            cardType = CardType.PASSIVE,
            icon = "🏎️",
            description = "Wózek gna z zawrotną prędkością bez możliwości zatrzymania! Taranowanie niszczy wrogów.",
            statBonus = "+60% Prędkości | +400% Obrażeń Taranowania",
            debuffPenalty = "⚠️ KARA: Brak hamowania (wózek ciągle jedzie)",
            rarity = CardRarity.LEGENDARY
        ),
        UpgradeCard(
            id = "perk_drunken_udt",
            title = "Pijany Mistrz UDT",
            cardType = CardType.PASSIVE,
            icon = "🍺",
            description = "Absurdalne manewry operatora: każdy cios ma 30% szans na rykoszetującą eksplozję!",
            statBonus = "30% Szans na eksplozję oleju | +25% Krytyk",
            debuffPenalty = "⚠️ KARA: Losowe znoszenie kierownicy",
            rarity = CardRarity.LEGENDARY
        ),
        UpgradeCard(
            id = "perk_radioactive_adr",
            title = "Radioaktywne ADR",
            cardType = CardType.PASSIVE,
            icon = "☣️",
            description = "Wszystkie plamy oleju i kawy na stałe płoną kwasem ADR niszczącym wrogów.",
            statBonus = "Plamy podłogowe płoną kwasem ADR",
            debuffPenalty = "⚠️ KARA: -15 Max Baterii",
            rarity = CardRarity.LEGENDARY
        ),
        UpgradeCard(
            id = "perk_pip_bribe",
            title = "Łapówka dla PIP",
            cardType = CardType.PASSIVE,
            icon = "💼",
            description = "Przy zerowej baterii wózek nie ginie – zyskujesz 10s niezniszczalności!",
            statBonus = "10s Ochrony Kontrolnej przy 0 HP | Taran 300%",
            rarity = CardRarity.LEGENDARY
        ),
        UpgradeCard(
            id = "perk_kamikaze_intern",
            title = "Samobójczy Praktykant",
            cardType = CardType.PASSIVE,
            icon = "💣",
            description = "Zagubiony praktykant biega po alejach i wysadza się w powietrze wśród wrogów.",
            statBonus = "Eksplozje praktykanta co 5 sekund",
            rarity = CardRarity.EPIC
        ),
        UpgradeCard(
            id = "iso_cert_passive",
            title = "Certyfikat ISO 9001",
            cardType = CardType.PASSIVE,
            icon = "📜",
            description = "Zwiększa zasięg przyciągania kodów XP oraz gotówki DTA.",
            statBonus = "+75% Zasięgu Przyciągania Magnesu",
            rarity = CardRarity.COMMON
        ),
        UpgradeCard(
            id = "safety_bhp_passive",
            title = "Protokół Bezpieczeństwa BHP",
            cardType = CardType.PASSIVE,
            icon = "📋",
            description = "Wzmacnia siłę taranowania oraz czas trwania efektów.",
            statBonus = "+40% Obrażeń Taranowania | +25% Czasu Efektów",
            rarity = CardRarity.RARE
        ),
        UpgradeCard(
            id = "synthetic_oil_passive",
            title = "Smar Syntetyczny BT",
            cardType = CardType.PASSIVE,
            icon = "🛢️",
            description = "Redukuje opory toczenia wózka i pozwala na większą prędkość.",
            statBonus = "+18% Prędkości Ruchu | -1.0s Cooldown Skilla",
            rarity = CardRarity.COMMON
        ),
        UpgradeCard(
            id = "super_battery_passive",
            title = "Super Bateria Akumulatorowa",
            cardType = CardType.PASSIVE,
            icon = "🔋",
            description = "Pojemniejsze ogniwa litowe wydłużające czas pracy wózka widłowego.",
            statBonus = "+35 Max Baterii | Natychmiastowa regeneracja +40 HP",
            rarity = CardRarity.RARE
        ),
        UpgradeCard(
            id = "furia_passive",
            title = "Furia Zmęczonego Magazyniera",
            cardType = CardType.PASSIVE,
            icon = "🤬",
            description = "Czysty gniew podnosi częstotliwość wystrzeliwania wszystkich broni.",
            statBonus = "+25% Szybkości Ataku Wszystkich Broni",
            rarity = CardRarity.EPIC
        ),
        UpgradeCard(
            id = "alkomat_passive",
            title = "Unik przed Alkomatem",
            cardType = CardType.PASSIVE,
            icon = "🍺",
            description = "Niezwykły refleks pozwalający ignorować ciosy i kolizje.",
            statBonus = "+15% Szansy na Całkowity Unik Obrażeń",
            rarity = CardRarity.RARE
        ),
        UpgradeCard(
            id = "stoperan_passive",
            title = "Stoperan Przed Zmianą",
            cardType = CardType.PASSIVE,
            icon = "💊",
            description = "Zapobiega nagłym przerwom i zwiększa wytrzymałość baterii.",
            statBonus = "+30 do Max Baterii | +30 Natychmiastowej Baterii",
            rarity = CardRarity.COMMON
        ),
        UpgradeCard(
            id = "safety_shoes_passive",
            title = "Buty Robocze S3 ze Stalowym Noskiem",
            cardType = CardType.PASSIVE,
            icon = "🥾",
            description = "Chronią stopy i zadają obrażenia odbite wrogom, którzy wejdą pod wózek.",
            statBonus = "+25 Obrażeń Cierni (Thorns) | -10% Obrażeń",
            rarity = CardRarity.EPIC
        ),
        UpgradeCard(
            id = "multisport_passive",
            title = "Karta Multisport z Zakładu",
            cardType = CardType.PASSIVE,
            icon = "💳",
            description = "Lepsza kondycja operatora: szybszy sprint wózka i regeneracja.",
            statBonus = "+15 Prędkości ruchu | +30% Regeneracji staminy",
            rarity = CardRarity.COMMON
        ),
        UpgradeCard(
            id = "paczek_passive",
            title = "Pączek z Biedronki",
            cardType = CardType.PASSIVE,
            icon = "🍩",
            description = "Cukrowy zastrzyk energii dający częstsze krytyki i drop jedzenia.",
            statBonus = "+20% Szansy na Krytyk | +25% Dropu Kawy/Jedzenia",
            rarity = CardRarity.RARE
        ),
        UpgradeCard(
            id = "kamizelka_passive",
            title = "Kamizelka Odblaskowa Hi-Vis",
            cardType = CardType.PASSIVE,
            icon = "🦺",
            description = "Redukuje otrzymywane obrażenia i oślepia wrogów w nocy.",
            statBonus = "-25% Otrzymywanych Obrażeń | Oślepienie wrogów",
            rarity = CardRarity.EPIC
        ),
        UpgradeCard(
            id = "umowa_passive",
            title = "Umowa na Czas Nieokreślony",
            cardType = CardType.PASSIVE,
            icon = "📜",
            description = "Pełne bezpieczeństwo socjalne: darmowa szansa na drugie życie!",
            statBonus = "+25% XP | 1x EXTRA LIFE (Ochrona przed śmiercią)",
            rarity = CardRarity.LEGENDARY
        ),

        // ==========================================
        // ⚡ GOLDEN EVOLUTION CARDS (10 CARDS)
        // ==========================================
        UpgradeCard(
            id = "bramka_rfid_evo",
            title = "📡 Przemysłowa Bramka RFID",
            cardType = CardType.EVOLUTION,
            icon = "⚡",
            description = "Emituje stałą, obrotową siatkę laserową. Wrogowie dropią +50% XP!",
            statBonus = "100 Obrażeń/s | Stała Siatka Laserowa | +50% XP Drop",
            rarity = CardRarity.LEGENDARY,
            synergyReq = "Skaner LV5 + Bateria LV1"
        ),
        UpgradeCard(
            id = "owijarka_evo",
            title = "🌀 Automatyczna Owijarka Hali",
            cardType = CardType.EVOLUTION,
            icon = "🧻",
            description = "Stały pierścień ze streczu unieruchamia i detonuje wrogów wokół ciebie!",
            statBonus = "60 Obrażeń | Pierścień Detonujący | Zamrażanie",
            rarity = CardRarity.LEGENDARY,
            synergyReq = "Taśma LV5 + Certyfikat ISO LV1"
        ),
        UpgradeCard(
            id = "bt_highstack_evo",
            title = "🚜 Wózek BT High-Stack",
            cardType = CardType.EVOLUTION,
            icon = "🪵",
            description = "Zostawia ślad śliskiego oleju i automatycznie taranuje wrogów!",
            statBonus = "90 Obrażeń | Ślad Oleju | Szybki Taran Cooldown 0.5s",
            rarity = CardRarity.LEGENDARY,
            synergyReq = "Paleciak LV5 + Smar Syntetyczny LV1"
        ),
        UpgradeCard(
            id = "zraszacz_evo",
            title = "❄️ System Zraszaczowy PPOŻ",
            cardType = CardType.EVOLUTION,
            icon = "🧯",
            description = "Co 10 sekund mrozi i razi prądem WSZYSTKICH wrogów na ekranie!",
            statBonus = "150 Obrażeń Ekranowych | Globalne Zamrożenie",
            rarity = CardRarity.LEGENDARY,
            synergyReq = "Gaśnica LV5 + Protokół BHP LV1"
        ),
        UpgradeCard(
            id = "steel_ties_evo",
            title = "🔗 Stalowe Trytytki Przemysłowe",
            cardType = CardType.EVOLUTION,
            icon = "🔗",
            description = "Zatrzymuje wrogów na zawsze i przebija całe tłumy!",
            statBonus = "60 Obrażeń | Nieskończone Przebicie | Wieczna Blokada",
            rarity = CardRarity.LEGENDARY,
            synergyReq = "Trytytki LV5 + Certyfikat ISO LV1"
        ),
        UpgradeCard(
            id = "machete_evo",
            title = "🔪 Ostrze Stanley Max",
            cardType = CardType.EVOLUTION,
            icon = "🔪",
            description = "Ostre jak brzytwa ostrza latające po całej hali magazynowej!",
            statBonus = "45 Obrażeń | Tornado Ostrzy | Cooldown 0.35s",
            rarity = CardRarity.LEGENDARY,
            synergyReq = "Nóż LV5 + Protokół BHP LV1"
        ),
        UpgradeCard(
            id = "stapler_gun_evo",
            title = "💥 Pneumatyczny Działobit",
            cardType = CardType.EVOLUTION,
            icon = "📌",
            description = "Nieustanna salwa rykoszetujących klamer stalowych!",
            statBonus = "70 Obrażeń | 6 Salw Rykoszetujących | Cooldown 0.45s",
            rarity = CardRarity.LEGENDARY,
            synergyReq = "Zszywacz LV5 + Super Bateria LV1"
        ),
        UpgradeCard(
            id = "hydraulic_hammer_evo",
            title = "🚜 Hydrauliczny Młot Burzący",
            cardType = CardType.EVOLUTION,
            icon = "🔨",
            description = "Wstrząsa całym ekranem, miażdży przeszkody i tworzy kratery!",
            statBonus = "180 Obrażeń Obszarowych | Kratery 240px",
            rarity = CardRarity.LEGENDARY,
            synergyReq = "Młot LV5 + Smar Syntetyczny LV1"
        ),
        UpgradeCard(
            id = "urzad_skarbowy_evo",
            title = "🏢 Urząd Skarbowy (KAS)",
            cardType = CardType.EVOLUTION,
            icon = "📄",
            description = "Wystrzeliwuje zmasowane, samonaprowadzające wezwania do zapłaty!",
            statBonus = "120 Obrażeń | Samonaprowadzanie | Speed 600px/s",
            rarity = CardRarity.LEGENDARY,
            synergyReq = "Faktura LV5 + Alkomat LV1"
        ),
        UpgradeCard(
            id = "redbull_evo",
            title = "🦅 Energetyk z Żabki",
            cardType = CardType.EVOLUTION,
            icon = "☕",
            description = "Rozlewa radioaktywny kwas niszczący bossów i daje permanentny sprint!",
            statBonus = "60 Obrażeń/s | Permanentny Boost Prędkości +30",
            rarity = CardRarity.LEGENDARY,
            synergyReq = "Kawa LV5 + Furia Magazyniera LV1"
        ),

        // ==========================================
        // ⚠️ DEBUFF & RISK/REWARD CARDS (4 CARDS)
        // ==========================================
        UpgradeCard(
            id = "overtime_debuff",
            title = "Nadgodziny na Nocnej Zmianie",
            cardType = CardType.DEBUFF,
            icon = "⚠️",
            description = "Dostajesz ogromny zastrzyk siły ataku, ale zmęczenie spowalnia wózek.",
            statBonus = "+45% Obrażeń Wszystkich Broni",
            debuffPenalty = "⚠️ KARA: -18% Prędkości Ruchu Wózka",
            rarity = CardRarity.EPIC
        ),
        UpgradeCard(
            id = "kas_audit_debuff",
            title = "Niespodziewana Kontrola KAS",
            cardType = CardType.DEBUFF,
            icon = "🏢",
            description = "Zgromadzona gotówka rośnie pod presją celników, lecz bateria szybciej się zużywa.",
            statBonus = "+60% DTA Coins & Dropu Zebranych Przedmiotów",
            debuffPenalty = "⚠️ KARA: -20 Max Baterii Wózka",
            rarity = CardRarity.RARE
        ),
        UpgradeCard(
            id = "leaking_hydraulics_debuff",
            title = "Awaria Wycieku Oleju",
            cardType = CardType.DEBUFF,
            icon = "🛢️",
            description = "Rozlany olej razi i poślizguje wrogów na wielkim obszarze, ale wózek traci sterowność.",
            statBonus = "+40% Zasięgu i Promienia Efektów Obszarowych",
            debuffPenalty = "⚠️ KARA: +15% Szansy na Otrzymanie Obrażeń",
            rarity = CardRarity.LEGENDARY
        ),
        UpgradeCard(
            id = "fruit_thursday_passive",
            title = "Owocowe Czwartki",
            cardType = CardType.PASSIVE,
            icon = "🍎",
            description = "Darmowe witaminy dla zespołu! Stała regeneracja baterii co sekundę.",
            statBonus = "+2 HP/s Regeneracji | +10 Max Baterii",
            rarity = CardRarity.RARE
        ),
        UpgradeCard(
            id = "team_building_passive",
            title = "Team Building w Bieszczadach",
            cardType = CardType.PASSIVE,
            icon = "⛺",
            description = "Wspólne ognisko podnosi morale. Zwiększa siłę wszystkich broni.",
            statBonus = "+15% Obrażeń Globalnych | +10% Szybkości Ataku",
            rarity = CardRarity.EPIC
        ),
        UpgradeCard(
            id = "asap_debuff",
            title = "Projekt na ASAP!",
            cardType = CardType.DEBUFF,
            icon = "⏰",
            description = "Wszystko musi być gotowe na wczoraj! Szybciej strzelasz, ale stres niszczy baterię.",
            statBonus = "+50% Szybkości Ataku",
            debuffPenalty = "⚠️ KARA: -5 HP co 3 sekundy (Stres)",
            rarity = CardRarity.EPIC
        ),
        UpgradeCard(
            id = "coffee_spill_active",
            title = "Rozlana Kawa Prezesa",
            cardType = CardType.ACTIVE,
            icon = "☕",
            description = "Wyjątkowo lepka i gorąca kawa parzy wrogów i spowalnia ich do zera.",
            statBonus = "+20 Obrażeń/s | 80% Spowolnienia",
            rarity = CardRarity.RARE,
            synergyReq = "Ewolucja z: Energetyk z Żabki 🦅"
        ),
    )

    fun getRandomCards(count: Int = 3, filterType: CardType? = null): List<UpgradeCard> {
        val pool = if (filterType != null) ALL_CARDS.filter { it.cardType == filterType } else ALL_CARDS
        return pool.shuffled().take(count)
    }

    fun getCardsForCategory(type: CardType): List<UpgradeCard> {
        return ALL_CARDS.filter { it.cardType == type }
    }
}
