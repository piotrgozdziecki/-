package com.example.ui

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.core.FastOutSlowInEasing
import androidx.compose.animation.core.LinearEasing
import androidx.compose.animation.core.RepeatMode
import androidx.compose.animation.core.animateFloat
import androidx.compose.animation.core.infiniteRepeatable
import androidx.compose.animation.core.rememberInfiniteTransition
import androidx.compose.animation.core.tween
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.navigationBarsPadding
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.statusBarsPadding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.AutoAwesome
import androidx.compose.material.icons.filled.Build
import androidx.compose.material.icons.filled.ElectricBolt
import androidx.compose.material.icons.filled.LocalShipping
import androidx.compose.material.icons.filled.MenuBook
import androidx.compose.material.icons.filled.Person
import androidx.compose.material.icons.filled.PlayArrow
import androidx.compose.material.icons.filled.Security
import androidx.compose.material.icons.filled.VolumeUp
import androidx.compose.material.icons.filled.Warning
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.Icon
import androidx.compose.material3.LinearProgressIndicator
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.scale
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Path
import androidx.compose.ui.graphics.drawscope.DrawScope
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.data.AndroidGameBridge

// --- TACTICAL DATA STRUCTURES ---

data class DecreeItem(
    val id: String,
    val title: String,
    val decreeNumber: String,
    val icon: String,
    val stampText: String,
    val stampColor: Color,
    val text: String,
    val consequences: String
)

val DECREES = listOf(
    DecreeItem(
        id = "uchwala_1",
        title = "DYREKTYWA I: REDUKCJA SYGNAŁU ŚWIETLNEGO",
        decreeNumber = "DTA/TAC/2026/01",
        icon = "💡",
        stampText = "PRIORYTET BOJOWY",
        stampColor = Color(0xFFF59E0B),
        text = "W związku z naruszeniem perymetru o godzinie 03:00 wyłącza się oświetlenie główne w Alei 4 i 6. Wszystkie jednostki operacyjne przechodzą na zintegrowane reflektory dalekosiężne wózków BT. Widoczność ograniczona, sensory akustyczne w pełnej gotowości.",
        consequences = "⚠️ Wpływ taktyczny: Strefy cienia, reflektor wózka rozświetla korytarze ogniowe."
    ),
    DecreeItem(
        id = "uchwala_2",
        title = "DYREKTYWA II: OBRONA RAMY ZAŁADUNKOWEJ 4",
        decreeNumber = "DTA/TAC/2026/02",
        icon = "🚐",
        stampText = "STAN ALARMOWY",
        stampColor = Color(0xFFEF4444),
        text = "Stwierdzono masowe wtargnięcie jednostek transportowych pod rampami. Zezwala się na użycie wszelkich dostępnych środków obronnych: salwy palet EPAL, amunicji pneumatycznej oraz kinetycznych barier z taśmy i streczu przemysłowego.",
        consequences = "⚠️ Wpływ taktyczny: Zwiększona gęstość natarcia na podejściach do doków."
    ),
    DecreeItem(
        id = "uchwala_3",
        title = "DYREKTYWA III: KWARANTANNA SEKTORA BIO",
        decreeNumber = "DTA/TAC/2026/03",
        icon = "☣️",
        stampText = "KWARANTANNA",
        stampColor = Color(0xFF10B981),
        text = "Sektor sanitarny w narożniku hali wykazuje krytyczne skażenie biologiczne. Moduł Mecha-ToiToi przejawia autonomiczną agresję. Obowiązuje całkowity zakaz zbliżania się bez osłony pancerza kompozytowego.",
        consequences = "⚠️ Wpływ taktyczny: Toksyczne wyziewy spowalniające w północnym sektorze."
    ),
    DecreeItem(
        id = "uchwala_4",
        title = "DYREKTYWA IV: RACJONOWANIE ENERGII & DOŁADOWANIE",
        decreeNumber = "DTA/TAC/2026/04",
        icon = "⚡",
        stampText = "AUTORYZOWANO",
        stampColor = Color(0xFF38BDF8),
        text = "Systemy zasilania wózków BT pracują w trybie przeciążenia bojowego. Dostęp do stacji ładowania oraz termonapojów stymulujących przysługuje wyłącznie operatorom utrzymującym integralność perymetru do godziny 07:00.",
        consequences = "⚠️ Wpływ taktyczny: Zastrzyk energii zwiększa prędkość manewrową o 40%."
    )
)

data class HeroInfo(
    val key: String,
    val name: String,
    val icon: String,
    val role: String,
    val skillLabel: String,
    val passiveDesc: String,
    val speedPct: Float,
    val hpPct: Float,
    val magnetPct: Float,
    val quote: String
)

val HEROES_ROSTER = listOf(
    HeroInfo("piotr", "Piotr & K-9 Kluska", "🐺", "Zwiad & Odzysk Polowy", "Miotacz Gazu & Śrut", "K-9 odzyskuje zasoby telemetrii +35% ataku", 0.85f, 0.70f, 0.75f, "Perymetr zabezpieczony. Kluska, osłaniaj lewą flankę!"),
    HeroInfo("mirek", "Inżynier Mirek", "🔧", "Ciężka Konserwacja & Pancerz", "Młot Hydrauliczny 360°", "Autonaprawa pancerza +35% obrażeń maszyn", 0.80f, 0.90f, 0.70f, "Dopóki silnik BT ma olej, żadna horda nie przerwie linii obrony."),
    HeroInfo("klaus", "Audytor Klaus", "🎯", "Koordynator Balistyczny DIN", "Promień Laserowy DIN", "Namierzanie precyzyjne +4 karty taktyczne", 0.88f, 0.75f, 0.85f, "Naruszenie procedur bezpieczeństwa eliminuje się natychmiast."),
    HeroInfo("radek", "Operator Radek", "🚜", "Szturmowiec Wózka BT", "Szarża Kinetyczna V-MAX", "Drift na posadzce, taranowanie hordy", 0.98f, 0.65f, 0.60f, "Prędkość to nasz pancerz. Gaz do oporu!"),
    HeroInfo("pawel", "Brygadzista Paweł", "🪵", "Obrona Kompozytowa EPAL", "Salwa Balistyczna EPAL", "Rotacyjna tarcza kinetyczna +20% baterii", 0.75f, 0.88f, 0.65f, "Certyfikowana twardość EPAL odbije każde uderzenie."),
    HeroInfo("marcin", "Zwiadowca Marcin", "🛡️", "Obrona Obwodowa", "Bariera Odłamkowa", "Wielowarstwowa ochrona perymetru", 0.85f, 0.65f, 0.80f, "Trzy warstwy kompozytu i cisza przed uderzeniem."),
    HeroInfo("kierownik_marcin", "Dowódca Marcin", "📢", "Koordynator Taktyczny", "Impuls Akustyczny", "Ogłuszenie celów w promieniu i aura respektu", 0.80f, 0.98f, 0.60f, "Dyspozycja jest jasna: utrzymać pozycję do świtu!"),
    HeroInfo("przemek_biuro", "Analityk Przemek", "💻", "Specjalista Sieci WMS", "Przeciążenie Impulsem EM", "+80% Zasięgu skanera +30% EXP telemetrii", 0.88f, 0.60f, 1.00f, "Przechwytuję sygnatury wrogów. Przeciążam lokalny węzeł."),
    HeroInfo("ania_biuro", "Koordynator Ania", "📋", "Oficer Odprawy Celnej", "Blokada Kriogeniczna", "+40% Szansy na cios krytyczny, staza hordy", 0.85f, 0.65f, 0.80f, "Brak autoryzacji wstępu. Procedura neutralizacji rozpoczęta."),
    HeroInfo("grzesiek_zastepca", "Oficer Grzesiek", "☕", "Ochrona Perymetru BHP", "Pancerz Kinetyczny BHP", "-40% Obrażeń bezpośrednich, regeneracja", 0.82f, 0.92f, 0.65f, "Zabezpieczenie BHP to fundament przetrwania w strefie zero.")
)

data class GarageItem(
    val key: String,
    val name: String,
    val icon: String,
    val cost: Int,
    val desc: String
)

val GARAGE_UPGRADES = listOf(
    GarageItem("battery", "Ogniwo Baterii Wysokiej Gęstości", "🔋", 150, "+30 Max Integralności Akumulatora Wózka"),
    GarageItem("speed", "Poliuretanowy Układ Napędowy", "⚙️", 200, "+10% Prędkości i zwrotności manewrowej"),
    GarageItem("magnet", "Sonda Magnetyczna WMS", "🧲", 350, "+50% Promienia przechwytywania telemetrii XP"),
    GarageItem("oponyKolcowane", "Bieżnik Taktyczny Na Posadzki", "🛞", 450, "-70% Poślizgu na śliskich powierzchniach | Drift"),
    GarageItem("kogutOstrzegawczy", "Stroboskop Ostrzegawczy BHP", "🚨", 500, "Tłumi prędkość wrogów nacierających od tyłu o 40%"),
    GarageItem("halogenyLed", "Reflektory Taktyczne LED Matrix", "💡", 600, "+60% Zasięgu snopa światła w ciemności"),
    GarageItem("pancerzRabitza", "Pancerz Kompozytowy Siatkowy", "🛡️", 850, "Absorbuje 1 śmiertelne trafienie na zmianę"),
    GarageItem("chiptuning", "Układ Nadprądowy WMS Overclock", "⚡", 1000, "+20% Szybkości przeładowania całego arsenału")
)

data class SynergyEvolution(
    val weaponName: String,
    val weaponIcon: String,
    val passiveName: String,
    val passiveIcon: String,
    val evoName: String,
    val evoIcon: String,
    val evoPower: String
)

val SYNERGY_EVOLUTIONS = listOf(
    SynergyEvolution("Skaner Laserowy", "🔦", "Super Bateria", "🔋", "Przemysłowa Bramka RFID", "⚡", "Permanentna dookolna strefa porażenia w promieniu 240px!"),
    SynergyEvolution("Paleciak Bojowy", "🪵", "Smar Syntetyczny", "🛢️", "Wózek BT High-Stack", "🚜", "Automatyczny taran kinetyczny i plamy poślizgowe oleju!"),
    SynergyEvolution("Pistolet na Taśmę", "🧻", "Certyfikat ISO", "📜", "Automatyczna Owijarka", "🎗️", "Ciągła salwa wiążąca unieruchamia nacierające jednostki!"),
    SynergyEvolution("Aura Odłamkowa", "🌀", "Obuwie Robocze", "🥾", "Pancerz Kompozytowy", "🛡️", "Bariera odbijająca wrogów i zadająca potrójne obrażenia!"),
    SynergyEvolution("Gaśnica PPOŻ", "🧯", "Protokół BHP", "📋", "System Zraszaczowy PPOŻ", "❄️", "Co 8s emituje impuls kriogeniczny zamrażający sektor!"),
    SynergyEvolution("Opaski Zaciskowe", "🔗", "Certyfikat ISO", "📜", "Stalowe Opaski EPAL", "🔗", "Pociski penetrują całe kolumny wrogów i blokują ruch!"),
    SynergyEvolution("Ostrze Stanley", "🔪", "Protokół BHP", "📋", "Ostrze Stanley Max", "🔪", "Wirujące ostrza kinetyczne czyszczące korytarze ogniowe!"),
    SynergyEvolution("Zszywacz Pneumatyczny", "📌", "Super Bateria", "🔋", "Działobit Pneumatyczny", "💥", "Salwa rykoszetujących stalowych klamer przeciwpancernych!"),
    SynergyEvolution("Młot Hydrauliczny", "🔨", "Smar Syntetyczny", "🛢️", "Hydrauliczny Młot Burzący", "🚜", "Fala uderzeniowa 360°, kratery w posadzce i ogłuszenie elit!"),
    SynergyEvolution("Stymulant Zbożowy", "☕", "Furia Operacyjna", "🤬", "Doładowanie Adrenalinowe", "🦅", "Kwasowa ścieżka ognia i stały wzrost prędkości operacyjnej!")
)

data class BestiaryEntry(
    val name: String,
    val icon: String,
    val threat: String,
    val threatColor: Color,
    val hpSpeed: String,
    val behavior: String,
    val weakPoint: String
)

val BESTIARY_CATALOG = listOf(
    BestiaryEntry("Szczur Rampowy", "🐀", "POZIOM I", Color(0xFF10B981), "20 HP | 185 km/h", "Szybka jednostka zwiadowcza atakująca w zwartych rojach flankujących.", "Skuteczna eliminacja bronią obszarową i gazem."),
    BestiaryEntry("Zbłąkana Paczka B2C", "📦", "POZIOM I", Color(0xFF10B981), "15 HP | 80 km/h", "Niska masa, niestabilna trajektoria. Pęka natychmiast od trafienia.", "Wrażliwa na dowolne uderzenie kinetyczne."),
    BestiaryEntry("Dron Skanujący RFID", "🛸", "POZIOM II", Color(0xFF38BDF8), "65 HP | 110 km/h", "Platforma latająca, prowadzi ogień celowniczy wiązką czerwoną.", "Zestrzelenie na średnim dystansie bronią szybkostrzelną."),
    BestiaryEntry("Ogniwo Termiczne Li-Ion", "💥", "ZAGROŻENIE WYBUCHEM", Color(0xFFEF4444), "45 HP | 165 km/h", "Niestabilne ogniwo szarżujące na taran i detonujące przy kontakcie.", "Likwidacja z bezpiecznego dystansu przed zbliżeniem!"),
    BestiaryEntry("Dostawca Niezrzeszony", "🩴", "POZIOM I", Color(0xFF10B981), "35 HP | 90 km/h", "Brak procedur orientacji, chaotyczne manewry między regałami.", "Łatwy cel dla taranu i ognia bezpośredniego."),
    BestiaryEntry("Kurier Gabaryt C", "📦", "OPANCERZONY", Color(0xFFF59E0B), "170 HP | 115 km/h", "Wzmocniona powłoka stali. Wysoka odporność na trafienia bezpośrednie.", "Przebicie amunicją penetrującą lub ewolucją RFID."),
    BestiaryEntry("Inspektor Normy DIN/ISO", "📐", "POZIOM III", Color(0xFFA855F7), "240 HP | 65 km/h", "Generuje rotacyjną strefę kontroli laserowej o wysokich obrażeniach.", "Utrzymanie bezpiecznego dystansu poza strefą laserową."),
    BestiaryEntry("Ciężki Bus Tranzytowy", "🚐", "TARAN BOJOWY", Color(0xFFF97316), "420 HP | 125 km/h", "Masywny pojazd forsujący aleje. Zrzuca przeszkody pod koła.", "Wymaga spowolnienia zraszaczem PPOŻ i ognia skupionego."),
    BestiaryEntry("Główny Inspektor KAS (BOSS)", "🦅", "BOSS SEKTORA ★★★", Color(0xFFEF4444), "2500 HP | 75 km/h", "Stawia laserową barierę rewizyjną SAD i blokuje odnawianie energii.", "Unikanie czerwonych stref kwarantanny i ogień flankujący."),
    BestiaryEntry("Mecha-ToiToi 3000 (BOSS)", "🚽", "BOSS BIOHAZARD ★★★★", Color(0xFF10B981), "4800 HP | 80 km/h", "Autonomiczny moduł skażenia. Rozpyla chmury trującego aerozolu.", "Ciągły ruch kołowy i unikanie chmur aerozolowych."),
    BestiaryEntry("Kontenerowiec 40ft (BOSS)", "🚢", "MEGA-BOSS ★★★★★", Color(0xFF38BDF8), "6000 HP | 35 km/h", "Forteca ładunkowa. Ciągły zrzut fal uderzeniowych wrogów.", "Wymaga w pełni rozwiniętych ewolucji broni."),
    BestiaryEntry("Dyrektor von Audit (FINAŁ)", "💡", "ZAGROŻENIE OSTATECZNE", Color(0xFFC084FC), "8500 HP | 90 km/h", "Wyłącza zasilanie magistrali i pogrąża sektor w całkowitym mroku.", "Wymaga reflektorów LED oraz maksymalnego pancerza!")
)

@Composable
fun IntroComposeScreen(
    bridge: AndroidGameBridge? = null,
    onStartGame: () -> Unit,
    isWebViewLoaded: Boolean = true,
    modifier: Modifier = Modifier
) {
    val infiniteTransition = rememberInfiniteTransition(label = "IntroTransition")

    val radarScanLine by infiniteTransition.animateFloat(
        initialValue = 0f,
        targetValue = 1f,
        animationSpec = infiniteRepeatable(
            animation = tween(durationMillis = 3500, easing = LinearEasing),
            repeatMode = RepeatMode.Restart
        ),
        label = "RadarScan"
    )

    val alertPulse by infiniteTransition.animateFloat(
        initialValue = 0.85f,
        targetValue = 1.0f,
        animationSpec = infiniteRepeatable(
            animation = tween(durationMillis = 800, easing = FastOutSlowInEasing),
            repeatMode = RepeatMode.Reverse
        ),
        label = "AlertPulse"
    )

    var currentMainTab by remember { mutableIntStateOf(0) } // 0: DYSPOZYCJA, 1: ARSENAŁ, 2: EWOLUCJE, 3: ZAGROŻENIA, 4: DYREKTYWY
    var selectedHeroKey by remember { mutableStateOf("piotr") }
    var selectedGameMode by remember { mutableStateOf("standard") } // 'standard' or 'endless'
    var selectedArenaKey by remember { mutableStateOf("main") } // 'main', 'freezer', 'crossdock'
    var currentDecreeIndex by remember { mutableIntStateOf(0) }
    var isAudioEnabled by remember { mutableStateOf(true) }

    val selectedHero = HEROES_ROSTER.find { it.key == selectedHeroKey } ?: HEROES_ROSTER[0]
    val currentDecree = DECREES[currentDecreeIndex]

    Box(
        modifier = modifier
            .fillMaxSize()
            .background(Color(0xFF080C14))
            .testTag("intro_compose_screen")
    ) {
        // --- TACTICAL MILITARY HUD CANVAS BACKGROUND ---
        Canvas(modifier = Modifier.fillMaxSize()) {
            drawTacticalRadarBackground(radarScanLine)
        }

        // --- MAIN TACTICAL CONSOLE ---
        Column(
            modifier = Modifier
                .fillMaxSize()
                .statusBarsPadding()
                .navigationBarsPadding()
                .padding(horizontal = 12.dp, vertical = 6.dp)
                .verticalScroll(rememberScrollState()),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            // TOP STATUS TELEMETRY BAR
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(bottom = 6.dp),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    modifier = Modifier
                        .background(Color(0xFF0D1424).copy(alpha = 0.92f), RoundedCornerShape(4.dp))
                        .border(1.dp, Color(0xFF1E293B), RoundedCornerShape(4.dp))
                        .padding(horizontal = 8.dp, vertical = 4.dp)
                ) {
                    Box(
                        modifier = Modifier
                            .size(6.dp)
                            .background(Color(0xFF10B981), CircleShape)
                    )
                    Spacer(modifier = Modifier.width(6.dp))
                    Text(
                        text = "TERMINAL OPERACYJNY // SEKTOR 8F",
                        color = Color(0xFF94A3B8),
                        fontSize = 9.sp,
                        fontWeight = FontWeight.Bold,
                        letterSpacing = 0.8.sp
                    )
                }

                Row(verticalAlignment = Alignment.CenterVertically) {
                    // Audio Mode
                    Box(
                        modifier = Modifier
                            .background(Color(0xFF0D1424), RoundedCornerShape(4.dp))
                            .border(1.dp, Color(0xFF1E293B), RoundedCornerShape(4.dp))
                            .clickable {
                                isAudioEnabled = !isAudioEnabled
                                bridge?.toggleAudioInGame()
                            }
                            .padding(horizontal = 7.dp, vertical = 4.dp)
                    ) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Icon(
                                imageVector = Icons.Default.VolumeUp,
                                contentDescription = "Audio",
                                tint = if (isAudioEnabled) Color(0xFF38BDF8) else Color(0xFF64748B),
                                modifier = Modifier.size(13.dp)
                            )
                            Spacer(modifier = Modifier.width(4.dp))
                            Text(
                                text = if (isAudioEnabled) "AUDIO: ON" else "AUDIO: OFF",
                                color = if (isAudioEnabled) Color(0xFF38BDF8) else Color(0xFF64748B),
                                fontSize = 8.5.sp,
                                fontWeight = FontWeight.Bold
                            )
                        }
                    }

                    Spacer(modifier = Modifier.width(6.dp))

                    // Threat Alert Pill
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        modifier = Modifier
                            .scale(alertPulse)
                            .background(Color(0xFF450A0A).copy(alpha = 0.9f), RoundedCornerShape(4.dp))
                            .border(1.dp, Color(0xFFDC2626), RoundedCornerShape(4.dp))
                            .padding(horizontal = 7.dp, vertical = 4.dp)
                    ) {
                        Box(
                            modifier = Modifier
                                .size(6.dp)
                                .background(Color(0xFFEF4444), CircleShape)
                        )
                        Spacer(modifier = Modifier.width(5.dp))
                        Text(
                            text = "ALARM: CZERWONY",
                            color = Color(0xFFFCA5A5),
                            fontSize = 8.5.sp,
                            fontWeight = FontWeight.Black,
                            letterSpacing = 0.6.sp
                        )
                    }
                }
            }

            // --- TACTICAL MISSION HEADER ---
            Card(
                modifier = Modifier
                    .fillMaxWidth()
                    .border(1.5.dp, Color(0xFFF59E0B).copy(alpha = 0.8f), RoundedCornerShape(6.dp)),
                colors = CardDefaults.cardColors(
                    containerColor = Color(0xFF0C1322).copy(alpha = 0.95f)
                ),
                shape = RoundedCornerShape(6.dp)
            ) {
                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(horizontal = 12.dp, vertical = 8.dp),
                    horizontalAlignment = Alignment.CenterHorizontally
                ) {
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.Center
                    ) {
                        Text(
                            text = "CRIMSON PROTOCOL: DTA GRANICZNA 8F",
                            color = Color(0xFFF8FAFC),
                            fontSize = 14.sp,
                            fontWeight = FontWeight.Black,
                            letterSpacing = 1.sp
                        )
                    }

                    Spacer(modifier = Modifier.height(2.dp))

                    Text(
                        text = "TAKTYCZNA OBRONA SEKTORA // PROCEDURA PRZETRWANIA HORRDY",
                        color = Color(0xFFF59E0B),
                        fontSize = 8.5.sp,
                        fontWeight = FontWeight.Bold,
                        letterSpacing = 0.9.sp
                    )
                }
            }

            Spacer(modifier = Modifier.height(8.dp))

            // --- 5 TACTICAL NAVIGATION TABS ---
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(3.dp)
            ) {
                val tabs = listOf(
                    Triple(0, "DYSPOZYCJA", Icons.Default.Person),
                    Triple(1, "ARSENAŁ", Icons.Default.Build),
                    Triple(2, "SYNERGIE", Icons.Default.AutoAwesome),
                    Triple(3, "ZAGROŻENIA", Icons.Default.Warning),
                    Triple(4, "DYREKTYWY", Icons.Default.MenuBook)
                )

                tabs.forEach { (index, label, _) ->
                    val isSelected = index == currentMainTab
                    Box(
                        modifier = Modifier
                            .weight(1f)
                            .clip(RoundedCornerShape(4.dp))
                            .background(
                                if (isSelected) Color(0xFF1E293B)
                                else Color(0xFF0D1424)
                            )
                            .border(
                                width = 1.dp,
                                color = if (isSelected) Color(0xFFF59E0B) else Color(0xFF1E293B),
                                shape = RoundedCornerShape(4.dp)
                            )
                            .clickable { currentMainTab = index }
                            .padding(vertical = 6.dp),
                        contentAlignment = Alignment.Center
                    ) {
                        Text(
                            text = label,
                            color = if (isSelected) Color(0xFFF59E0B) else Color(0xFF64748B),
                            fontSize = 8.sp,
                            fontWeight = if (isSelected) FontWeight.Black else FontWeight.Bold,
                            letterSpacing = 0.5.sp
                        )
                    }
                }
            }

            Spacer(modifier = Modifier.height(8.dp))

            // ==========================================
            // TAB CONTENT 0: DEPLOYMENT & LOADOUT
            // ==========================================
            if (currentMainTab == 0) {
                Column(modifier = Modifier.fillMaxWidth()) {
                    Text(
                        text = "OPERATORZY BRYGADY TAKTYCZNEJ:",
                        color = Color(0xFF94A3B8),
                        fontSize = 9.sp,
                        fontWeight = FontWeight.Black,
                        letterSpacing = 0.8.sp,
                        modifier = Modifier.padding(bottom = 5.dp)
                    )

                    // HORIZONTAL ROSTER SELECTOR
                    LazyRow(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(6.dp)
                    ) {
                        items(HEROES_ROSTER) { hero ->
                            val isSelected = hero.key == selectedHeroKey
                            Box(
                                modifier = Modifier
                                    .width(105.dp)
                                    .clip(RoundedCornerShape(6.dp))
                                    .background(if (isSelected) Color(0xFF172554) else Color(0xFF0D1424))
                                    .border(
                                        width = if (isSelected) 1.5.dp else 1.dp,
                                        color = if (isSelected) Color(0xFF38BDF8) else Color(0xFF1E293B),
                                        shape = RoundedCornerShape(6.dp)
                                    )
                                    .clickable {
                                        selectedHeroKey = hero.key
                                        bridge?.setSelectedCharacterInGame(hero.key)
                                    }
                                    .padding(6.dp)
                            ) {
                                Column(
                                    horizontalAlignment = Alignment.CenterHorizontally,
                                    modifier = Modifier.fillMaxWidth()
                                ) {
                                    Text(text = hero.icon, fontSize = 20.sp)
                                    Spacer(modifier = Modifier.height(3.dp))
                                    Text(
                                        text = hero.name,
                                        color = if (isSelected) Color(0xFF38BDF8) else Color(0xFFE2E8F0),
                                        fontSize = 9.sp,
                                        fontWeight = FontWeight.Bold,
                                        textAlign = TextAlign.Center,
                                        maxLines = 1
                                    )
                                    Text(
                                        text = hero.role,
                                        color = Color(0xFF64748B),
                                        fontSize = 7.5.sp,
                                        textAlign = TextAlign.Center,
                                        maxLines = 1
                                    )
                                }
                            }
                        }
                    }

                    Spacer(modifier = Modifier.height(8.dp))

                    // OPERATIVE DOSSIER DETAIL CARD
                    Card(
                        modifier = Modifier
                            .fillMaxWidth()
                            .border(1.dp, Color(0xFF38BDF8).copy(alpha = 0.5f), RoundedCornerShape(6.dp)),
                        colors = CardDefaults.cardColors(
                            containerColor = Color(0xFF0C1322).copy(alpha = 0.95f)
                        ),
                        shape = RoundedCornerShape(6.dp)
                    ) {
                        Column(modifier = Modifier.padding(10.dp)) {
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Row(verticalAlignment = Alignment.CenterVertically) {
                                    Text(text = selectedHero.icon, fontSize = 24.sp)
                                    Spacer(modifier = Modifier.width(8.dp))
                                    Column {
                                        Text(
                                            text = selectedHero.name.uppercase(),
                                            color = Color(0xFFF8FAFC),
                                            fontSize = 12.sp,
                                            fontWeight = FontWeight.Black,
                                            letterSpacing = 0.5.sp
                                        )
                                        Text(
                                            text = "SPECJALIZACJA: ${selectedHero.role.uppercase()}",
                                            color = Color(0xFF38BDF8),
                                            fontSize = 8.5.sp,
                                            fontWeight = FontWeight.Bold
                                        )
                                    }
                                }

                                Box(
                                    modifier = Modifier
                                        .background(Color(0xFF0F172A), RoundedCornerShape(4.dp))
                                        .border(1.dp, Color(0xFF10B981), RoundedCornerShape(4.dp))
                                        .padding(horizontal = 6.dp, vertical = 2.dp)
                                ) {
                                    Text(
                                        text = "STATUS: GOTOWY",
                                        color = Color(0xFF10B981),
                                        fontSize = 7.5.sp,
                                        fontWeight = FontWeight.Black
                                    )
                                }
                            }

                            Spacer(modifier = Modifier.height(6.dp))

                            Box(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .background(Color(0xFF111827), RoundedCornerShape(4.dp))
                                    .padding(6.dp)
                            ) {
                                Column {
                                    Text(
                                        text = "MODUŁ BOJOWY: ${selectedHero.skillLabel}",
                                        color = Color(0xFFF59E0B),
                                        fontSize = 9.sp,
                                        fontWeight = FontWeight.Bold
                                    )
                                    Text(
                                        text = "EFEKT PASYWNY: ${selectedHero.passiveDesc}",
                                        color = Color(0xFFCBD5E1),
                                        fontSize = 8.5.sp
                                    )
                                }
                            }

                            Spacer(modifier = Modifier.height(6.dp))

                            // Telemetry Stat Meters
                            StatMeter(label = "INTEGRALNOŚĆ AKUMULATORA", progress = selectedHero.hpPct, color = Color(0xFF10B981))
                            StatMeter(label = "PRĘDKOŚĆ KINETYCZNA V-MAX", progress = selectedHero.speedPct, color = Color(0xFF38BDF8))
                            StatMeter(label = "ZASIĘG SKANERA WMS", progress = selectedHero.magnetPct, color = Color(0xFFF59E0B))

                            Spacer(modifier = Modifier.height(4.dp))

                            Text(
                                text = "RAPORT POLOWY: \"${selectedHero.quote}\"",
                                color = Color(0xFF64748B),
                                fontSize = 8.5.sp,
                                fontStyle = FontStyle.Italic
                            )
                        }
                    }

                    Spacer(modifier = Modifier.height(8.dp))

                    // OPERATIONAL PARAMETERS (MODE & SECTOR)
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(6.dp)
                    ) {
                        // Game Mode Card
                        Card(
                            modifier = Modifier
                                .weight(1f)
                                .border(1.dp, Color(0xFF1E293B), RoundedCornerShape(6.dp)),
                            colors = CardDefaults.cardColors(containerColor = Color(0xFF0D1424))
                        ) {
                            Column(modifier = Modifier.padding(6.dp)) {
                                Text("TRYB ZADANIA:", color = Color(0xFFF59E0B), fontSize = 8.sp, fontWeight = FontWeight.Black)
                                Spacer(modifier = Modifier.height(4.dp))
                                Row(horizontalArrangement = Arrangement.spacedBy(3.dp)) {
                                    ModeChip(
                                        label = "ZMIANA 10M",
                                        isSelected = selectedGameMode == "standard",
                                        onClick = {
                                            selectedGameMode = "standard"
                                            bridge?.setSelectedGameModeInGame("standard")
                                        }
                                    )
                                    ModeChip(
                                        label = "NIESKOŃCZONY",
                                        isSelected = selectedGameMode == "endless",
                                        onClick = {
                                            selectedGameMode = "endless"
                                            bridge?.setSelectedGameModeInGame("endless")
                                        }
                                    )
                                }
                            }
                        }

                        // Arena Sector Card
                        Card(
                            modifier = Modifier
                                .weight(1f)
                                .border(1.dp, Color(0xFF1E293B), RoundedCornerShape(6.dp)),
                            colors = CardDefaults.cardColors(containerColor = Color(0xFF0D1424))
                        ) {
                            Column(modifier = Modifier.padding(6.dp)) {
                                Text("SEKTOR OPERACJI:", color = Color(0xFF38BDF8), fontSize = 8.sp, fontWeight = FontWeight.Black)
                                Spacer(modifier = Modifier.height(4.dp))
                                Row(horizontalArrangement = Arrangement.spacedBy(2.dp)) {
                                    ModeChip(
                                        label = "GŁÓWNA 8F",
                                        isSelected = selectedArenaKey == "main",
                                        onClick = {
                                            selectedArenaKey = "main"
                                            bridge?.setSelectedArenaInGame("main")
                                        }
                                    )
                                    ModeChip(
                                        label = "CHŁODNIA",
                                        isSelected = selectedArenaKey == "freezer",
                                        onClick = {
                                            selectedArenaKey = "freezer"
                                            bridge?.setSelectedArenaInGame("freezer")
                                        }
                                    )
                                    ModeChip(
                                        label = "CROSS-DOCK",
                                        isSelected = selectedArenaKey == "crossdock",
                                        onClick = {
                                            selectedArenaKey = "crossdock"
                                            bridge?.setSelectedArenaInGame("crossdock")
                                        }
                                    )
                                }
                            }
                        }
                    }
                }
            }

            // ==========================================
            // TAB CONTENT 1: ARSENAL & UPGRADES
            // ==========================================
            if (currentMainTab == 1) {
                Column(modifier = Modifier.fillMaxWidth()) {
                    Text(
                        text = "MODYFIKACJE HARDWARE WÓZKA BT (BAZA ULEPSZEŃ):",
                        color = Color(0xFFF59E0B),
                        fontSize = 9.sp,
                        fontWeight = FontWeight.Black,
                        letterSpacing = 0.8.sp,
                        modifier = Modifier.padding(bottom = 5.dp)
                    )

                    GARAGE_UPGRADES.forEach { item ->
                        Card(
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(vertical = 2.5.dp)
                                .border(1.dp, Color(0xFF1E293B), RoundedCornerShape(6.dp)),
                            colors = CardDefaults.cardColors(containerColor = Color(0xFF0D1424))
                        ) {
                            Row(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .padding(8.dp),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Row(verticalAlignment = Alignment.CenterVertically, modifier = Modifier.weight(1f)) {
                                    Text(text = item.icon, fontSize = 18.sp)
                                    Spacer(modifier = Modifier.width(8.dp))
                                    Column {
                                        Text(text = item.name.uppercase(), color = Color(0xFFF8FAFC), fontSize = 9.5.sp, fontWeight = FontWeight.Bold)
                                        Text(text = item.desc, color = Color(0xFF94A3B8), fontSize = 8.sp)
                                    }
                                }

                                Button(
                                    onClick = { bridge?.buyWorkshopUpgradeInGame(item.key, item.cost) },
                                    colors = ButtonDefaults.buttonColors(containerColor = Color(0xFFD97706)),
                                    shape = RoundedCornerShape(4.dp)
                                ) {
                                    Text("${item.cost} DTA", color = Color(0xFF0F172A), fontSize = 8.5.sp, fontWeight = FontWeight.Black)
                                }
                            }
                        }
                    }
                }
            }

            // ==========================================
            // TAB CONTENT 2: EVOLUTIONS & SYNERGIES
            // ==========================================
            if (currentMainTab == 2) {
                Column(modifier = Modifier.fillMaxWidth()) {
                    Text(
                        text = "PROTOKOŁY EWOLUCJI UZBROJENIA (10 PROJEKTÓW BOJOWYCH):",
                        color = Color(0xFFF59E0B),
                        fontSize = 9.sp,
                        fontWeight = FontWeight.Black,
                        letterSpacing = 0.8.sp,
                        modifier = Modifier.padding(bottom = 5.dp)
                    )

                    SYNERGY_EVOLUTIONS.forEach { evo ->
                        Card(
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(vertical = 2.5.dp)
                                .border(1.dp, Color(0xFF1E293B), RoundedCornerShape(6.dp)),
                            colors = CardDefaults.cardColors(containerColor = Color(0xFF0C1322))
                        ) {
                            Column(modifier = Modifier.padding(8.dp)) {
                                Row(
                                    modifier = Modifier.fillMaxWidth(),
                                    horizontalArrangement = Arrangement.SpaceBetween,
                                    verticalAlignment = Alignment.CenterVertically
                                ) {
                                    Row(verticalAlignment = Alignment.CenterVertically) {
                                        Text("${evo.weaponIcon} ${evo.weaponName}", color = Color(0xFF38BDF8), fontSize = 9.sp, fontWeight = FontWeight.Bold)
                                        Text(" + ", color = Color(0xFF64748B), fontSize = 9.sp, fontWeight = FontWeight.Bold)
                                        Text("${evo.passiveIcon} ${evo.passiveName}", color = Color(0xFF10B981), fontSize = 9.sp, fontWeight = FontWeight.Bold)
                                    }
                                    Text("➔", color = Color(0xFFF59E0B), fontSize = 11.sp, fontWeight = FontWeight.Black)
                                }
                                Spacer(modifier = Modifier.height(3.dp))
                                Row(verticalAlignment = Alignment.CenterVertically) {
                                    Text(evo.evoIcon, fontSize = 14.sp)
                                    Spacer(modifier = Modifier.width(5.dp))
                                    Text(evo.evoName.uppercase(), color = Color(0xFFF59E0B), fontSize = 10.sp, fontWeight = FontWeight.Black)
                                }
                                Text(evo.evoPower, color = Color(0xFF94A3B8), fontSize = 8.sp)
                            }
                        }
                    }
                }
            }

            // ==========================================
            // TAB CONTENT 3: BESTIARY & THREAT INTEL
            // ==========================================
            if (currentMainTab == 3) {
                Column(modifier = Modifier.fillMaxWidth()) {
                    Text(
                        text = "REJESTR ZAGROŻEŃ OPERACYJNYCH (TELEMETRIA HORRDY):",
                        color = Color(0xFFEF4444),
                        fontSize = 9.sp,
                        fontWeight = FontWeight.Black,
                        letterSpacing = 0.8.sp,
                        modifier = Modifier.padding(bottom = 5.dp)
                    )

                    BESTIARY_CATALOG.forEach { enemy ->
                        Card(
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(vertical = 2.5.dp)
                                .border(1.dp, enemy.threatColor.copy(alpha = 0.4f), RoundedCornerShape(6.dp)),
                            colors = CardDefaults.cardColors(containerColor = Color(0xFF0D1424))
                        ) {
                            Column(modifier = Modifier.padding(8.dp)) {
                                Row(
                                    modifier = Modifier.fillMaxWidth(),
                                    horizontalArrangement = Arrangement.SpaceBetween,
                                    verticalAlignment = Alignment.CenterVertically
                                ) {
                                    Text(text = "${enemy.icon} ${enemy.name.uppercase()}", color = Color(0xFFF8FAFC), fontSize = 10.sp, fontWeight = FontWeight.Black)
                                    Box(
                                        modifier = Modifier
                                            .background(enemy.threatColor.copy(alpha = 0.15f), RoundedCornerShape(3.dp))
                                            .border(1.dp, enemy.threatColor, RoundedCornerShape(3.dp))
                                            .padding(horizontal = 4.dp, vertical = 2.dp)
                                    ) {
                                        Text(enemy.threat, color = enemy.threatColor, fontSize = 7.sp, fontWeight = FontWeight.Black)
                                    }
                                }
                                Spacer(modifier = Modifier.height(2.dp))
                                Text(text = "PARAMETRY: ${enemy.hpSpeed}", color = Color(0xFF38BDF8), fontSize = 8.sp, fontWeight = FontWeight.SemiBold)
                                Text(text = enemy.behavior, color = Color(0xFF94A3B8), fontSize = 8.sp)
                                Text(text = "DOKTRYNA OBRONY: ${enemy.weakPoint}", color = Color(0xFFF59E0B), fontSize = 8.sp, fontWeight = FontWeight.SemiBold)
                            }
                        }
                    }
                }
            }

            // ==========================================
            // TAB CONTENT 4: DIRECTIVES
            // ==========================================
            if (currentMainTab == 4) {
                Column(modifier = Modifier.fillMaxWidth()) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(3.dp)
                    ) {
                        DECREES.forEachIndexed { index, decree ->
                            val isSelected = index == currentDecreeIndex
                            Box(
                                modifier = Modifier
                                    .weight(1f)
                                    .clip(RoundedCornerShape(4.dp))
                                    .background(if (isSelected) Color(0xFF1E293B) else Color(0xFF0D1424))
                                    .border(1.dp, if (isSelected) Color(0xFFF59E0B) else Color(0xFF1E293B), RoundedCornerShape(4.dp))
                                    .clickable { currentDecreeIndex = index }
                                    .padding(vertical = 5.dp),
                                contentAlignment = Alignment.Center
                            ) {
                                Text("ROZKAZ 0${index + 1}", color = if (isSelected) Color(0xFFF59E0B) else Color(0xFF64748B), fontSize = 7.5.sp, fontWeight = FontWeight.Bold)
                            }
                        }
                    }

                    Spacer(modifier = Modifier.height(6.dp))

                    Card(
                        modifier = Modifier
                            .fillMaxWidth()
                            .border(1.dp, Color(0xFF334155), RoundedCornerShape(6.dp)),
                        colors = CardDefaults.cardColors(containerColor = Color(0xFF0C1322).copy(alpha = 0.95f))
                    ) {
                        Column(modifier = Modifier.padding(10.dp)) {
                            Text(text = currentDecree.title, color = Color(0xFFF8FAFC), fontSize = 11.sp, fontWeight = FontWeight.Black)
                            Text(text = "KOD ROZKAZU: ${currentDecree.decreeNumber}", color = Color(0xFF64748B), fontSize = 8.sp)
                            Spacer(modifier = Modifier.height(6.dp))
                            Text(text = currentDecree.text, color = Color(0xFFCBD5E1), fontSize = 9.5.sp, lineHeight = 14.sp)
                            Spacer(modifier = Modifier.height(6.dp))
                            Box(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .background(Color(0xFF0F172A), RoundedCornerShape(4.dp))
                                    .border(1.dp, Color(0xFF38BDF8).copy(alpha = 0.5f), RoundedCornerShape(4.dp))
                                    .padding(6.dp)
                            ) {
                                Text(text = currentDecree.consequences, color = Color(0xFF38BDF8), fontSize = 8.5.sp, fontWeight = FontWeight.SemiBold)
                            }
                        }
                    }
                }
            }

            Spacer(modifier = Modifier.height(10.dp))

            // ==========================================
            // CALL TO ACTION: TACTICAL LAUNCH BUTTON
            // ==========================================
            Button(
                enabled = isWebViewLoaded,
                onClick = { onStartGame() },
                modifier = Modifier
                    .fillMaxWidth()
                    .height(48.dp)
                    .border(
                        width = 1.5.dp,
                        brush = Brush.horizontalGradient(
                            if (isWebViewLoaded) {
                                listOf(Color(0xFFF59E0B), Color(0xFFEF4444), Color(0xFF38BDF8), Color(0xFFF59E0B))
                            } else {
                                listOf(Color(0xFF475569), Color(0xFF334155), Color(0xFF475569))
                            }
                        ),
                        shape = RoundedCornerShape(6.dp)
                    )
                    .testTag("btn_launch_game"),
                colors = ButtonDefaults.buttonColors(
                    containerColor = if (isWebViewLoaded) Color(0xFFF59E0B) else Color(0xFF334155),
                    disabledContainerColor = Color(0xFF1E293B)
                ),
                shape = RoundedCornerShape(6.dp)
            ) {
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.Center
                ) {
                    if (isWebViewLoaded) {
                        Icon(
                            imageVector = Icons.Default.PlayArrow,
                            contentDescription = "Start",
                            tint = Color(0xFF080C14),
                            modifier = Modifier.size(20.dp)
                        )
                        Spacer(modifier = Modifier.width(6.dp))
                        Text(
                            text = "INICJUJ PROTOKÓŁ OBRONY // ROZPOCZNIJ MISJĘ",
                            color = Color(0xFF080C14),
                            fontSize = 11.5.sp,
                            fontWeight = FontWeight.Black,
                            letterSpacing = 0.8.sp
                        )
                    } else {
                        CircularProgressIndicator(
                            color = Color(0xFF38BDF8),
                            modifier = Modifier.size(16.dp),
                            strokeWidth = 2.dp
                        )
                        Spacer(modifier = Modifier.width(8.dp))
                        Text(
                            text = "INICJALIZACJA TELEMETRII...",
                            color = Color(0xFF94A3B8),
                            fontSize = 11.sp,
                            fontWeight = FontWeight.Bold
                        )
                    }
                }
            }

            Spacer(modifier = Modifier.height(4.dp))

            Text(
                text = "STATUS: CZAS TRWANIA MISJI 10:00 | RAPORT ZAGROŻEŃ ZSYNCHRONIZOWANY",
                color = Color(0xFF64748B),
                fontSize = 8.sp,
                fontWeight = FontWeight.Bold,
                textAlign = TextAlign.Center
            )
        }
    }
}

@Composable
fun StatMeter(label: String, progress: Float, color: Color) {
    Column(modifier = Modifier.padding(vertical = 1.5.dp)) {
        Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
            Text(text = label, color = Color(0xFF64748B), fontSize = 7.5.sp, fontWeight = FontWeight.Bold)
            Text(text = "${(progress * 100).toInt()}%", color = color, fontSize = 7.5.sp, fontWeight = FontWeight.Black)
        }
        Spacer(modifier = Modifier.height(1.5.dp))
        LinearProgressIndicator(
            progress = { progress },
            modifier = Modifier
                .fillMaxWidth()
                .height(3.dp)
                .clip(RoundedCornerShape(1.dp)),
            color = color,
            trackColor = Color(0xFF1E293B)
        )
    }
}

@Composable
fun ModeChip(label: String, isSelected: Boolean, onClick: () -> Unit) {
    Box(
        modifier = Modifier
            .clip(RoundedCornerShape(3.dp))
            .background(if (isSelected) Color(0xFFF59E0B) else Color(0xFF1E293B))
            .clickable { onClick() }
            .padding(horizontal = 6.dp, vertical = 3.dp),
        contentAlignment = Alignment.Center
    ) {
        Text(
            text = label,
            color = if (isSelected) Color(0xFF0F172A) else Color(0xFF94A3B8),
            fontSize = 7.5.sp,
            fontWeight = FontWeight.Black
        )
    }
}

private fun DrawScope.drawTacticalRadarBackground(radarScanLine: Float) {
    val width = size.width
    val height = size.height

    // Precision Grid
    val gridStep = 44.dp.toPx()
    val gridColor = Color(0xFF1E293B).copy(alpha = 0.25f)
    var x = 0f
    while (x < width) {
        drawLine(gridColor, Offset(x, 0f), Offset(x, height), strokeWidth = 1f)
        x += gridStep
    }
    var y = 0f
    while (y < height) {
        drawLine(gridColor, Offset(0f, y), Offset(width, y), strokeWidth = 1f)
        y += gridStep
    }

    // Moving Radar Scan Line
    val scanY = height * radarScanLine
    drawLine(
        brush = Brush.verticalGradient(
            colors = listOf(
                Color.Transparent,
                Color(0xFF38BDF8).copy(alpha = 0.15f),
                Color(0xFF38BDF8).copy(alpha = 0.45f)
            ),
            startY = scanY - 50f,
            endY = scanY
        ),
        start = Offset(0f, scanY),
        end = Offset(width, scanY),
        strokeWidth = 2f
    )

    // Corner Tactical Brackets
    val cornerColor = Color(0xFFF59E0B).copy(alpha = 0.4f)
    val cornerLen = 16.dp.toPx()
    // Top-Left
    drawLine(cornerColor, Offset(10f, 10f), Offset(10f + cornerLen, 10f), strokeWidth = 2f)
    drawLine(cornerColor, Offset(10f, 10f), Offset(10f, 10f + cornerLen), strokeWidth = 2f)
    // Top-Right
    drawLine(cornerColor, Offset(width - 10f, 10f), Offset(width - 10f - cornerLen, 10f), strokeWidth = 2f)
    drawLine(cornerColor, Offset(width - 10f, 10f), Offset(width - 10f, 10f + cornerLen), strokeWidth = 2f)
}
