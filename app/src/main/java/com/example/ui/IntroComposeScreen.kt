package com.example.ui

import androidx.compose.animation.AnimatedContent
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
import androidx.compose.animation.slideInVertically
import androidx.compose.animation.slideOutVertically
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
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
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.lazy.itemsIndexed
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.AutoAwesome
import androidx.compose.material.icons.filled.Build
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material.icons.filled.Close
import androidx.compose.material.icons.filled.KeyboardArrowLeft
import androidx.compose.material.icons.filled.KeyboardArrowRight
import androidx.compose.material.icons.filled.MenuBook
import androidx.compose.material.icons.filled.PlayArrow
import androidx.compose.material.icons.filled.Security
import androidx.compose.material.icons.filled.VolumeOff
import androidx.compose.material.icons.filled.VolumeUp
import androidx.compose.material.icons.filled.Warning
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.LinearProgressIndicator
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateMapOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.rotate
import androidx.compose.ui.draw.scale
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.PathEffect
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.R
import com.example.data.AndroidGameBridge

// --- LORE & DATA CATALOGS ---

data class HeroInfo(
    val key: String,
    val name: String,
    val icon: String,
    val role: String,
    val weaponName: String,
    val passiveDesc: String,
    val speedPct: Float,
    val hpPct: Float,
    val magnetPct: Float,
    val quote: String,
    val themeColor: Color
)

val HEROES_ROSTER = listOf(
    HeroInfo("piotr", "Piotr & K-9 Kluska", "🐺", "Zwiad & Odzysk Polowy", "Miotacz Gazu & Śrut", "K-9 odzyskuje telemetrię +35% ataku", 0.85f, 0.70f, 0.75f, "Perymetr zabezpieczony. Kluska, osłaniaj lewą flankę!", Color(0xFF00F0FF)),
    HeroInfo("radek", "Operator Radek", "🚜", "Szturmowiec Wózka BT", "Szarża Kinetyczna V-MAX", "Drift na posadzce, taranowanie wrogów", 0.98f, 0.65f, 0.60f, "Prędkość to nasz pancerz. Gaz do oporu!", Color(0xFFFFB800)),
    HeroInfo("mirek", "Inżynier Mirek", "🔧", "Ciężka Konserwacja", "Młot Hydrauliczny 360°", "Autonaprawa pancerza +35% obrażeń maszyn", 0.80f, 0.90f, 0.70f, "Dopóki silnik BT ma olej, żadna horda nie przejdzie.", Color(0xFF10B981)),
    HeroInfo("klaus", "Audytor Klaus", "🎯", "Koordynator Balistyczny DIN", "Promień Laserowy DIN", "Namierzanie precyzyjne +4 karty taktyczne", 0.88f, 0.75f, 0.85f, "Naruszenie procedur bezpieczeństwa eliminuje się natychmiast.", Color(0xFFA855F7)),
    HeroInfo("pawel", "Brygadzista Paweł", "🪵", "Obrona Kompozytowa EPAL", "Salwa Balistyczna EPAL", "Rotacyjna tarcza kinetyczna +20% baterii", 0.75f, 0.88f, 0.65f, "Certyfikowana twardość EPAL odbije każde uderzenie.", Color(0xFFF97316)),
    HeroInfo("marcin", "Zwiadowca Marcin", "🛡️", "Obrona Obwodowa", "Bariera Odłamkowa", "Wielowarstwowa ochrona perymetru", 0.85f, 0.65f, 0.80f, "Trzy warstwy kompozytu i cisza przed uderzeniem.", Color(0xFF38BDF8)),
    HeroInfo("kierownik_marcin", "Dowódca Marcin", "📢", "Koordynator Taktyczny", "Impuls Akustyczny", "Ogłuszenie celów w promieniu i aura respektu", 0.80f, 0.98f, 0.60f, "Dyspozycja jest jasna: utrzymać pozycję do świtu!", Color(0xFFEF4444)),
    HeroInfo("przemek_biuro", "Analityk Przemek", "💻", "Specjalista Sieci WMS", "Przeciążenie Impulsem EM", "+80% Zasięgu skanera +30% EXP telemetrii", 0.88f, 0.60f, 1.00f, "Przechwytuję sygnatury wrogów. Przeciążam węzeł.", Color(0xFF06B6D4)),
    HeroInfo("ania_biuro", "Koordynator Ania", "📋", "Oficer Odprawy Celnej", "Blokada Kriogeniczna", "+40% Szansy na cios krytyczny, staza hordy", 0.85f, 0.65f, 0.80f, "Brak autoryzacji wstępu. Rozpoczynam kwarantannę.", Color(0xFFEC4899)),
    HeroInfo("grzesiek_zastepca", "Oficer Grzesiek", "☕", "Ochrona Perymetru BHP", "Pancerz Kinetyczny BHP", "-40% Obrażeń bezpośrednich, regeneracja", 0.82f, 0.92f, 0.65f, "Zabezpieczenie BHP to fundament przetrwania.", Color(0xFFEAB308))
)

data class GarageItem(
    val key: String,
    val name: String,
    val icon: String,
    val baseCost: Int,
    val desc: String,
    val maxLvl: Int = 5
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
    BestiaryEntry("Ogniwo Termiczne Li-Ion", "💥", "WYBUCHOWE", Color(0xFFEF4444), "45 HP | 165 km/h", "Niestabilne ogniwo szarżujące na taran i detonujące przy kontakcie.", "Likwidacja z bezpiecznego dystansu przed zbliżeniem!"),
    BestiaryEntry("Dostawca Niezrzeszony", "🩴", "POZIOM I", Color(0xFF10B981), "35 HP | 90 km/h", "Brak procedur orientacji, chaotyczne manewry między regałami.", "Łatwy cel dla taranu i ognia bezpośredniego."),
    BestiaryEntry("Kurier Gabaryt C", "📦", "OPANCERZONY", Color(0xFFF59E0B), "170 HP | 115 km/h", "Wzmocniona powłoka stali. Wysoka odporność na trafienia bezpośrednie.", "Przebicie amunicją penetrującą lub ewolucją RFID."),
    BestiaryEntry("Inspektor Normy DIN/ISO", "📐", "POZIOM III", Color(0xFFA855F7), "240 HP | 65 km/h", "Generuje rotacyjną strefę kontroli laserowej o wysokich obrażeniach.", "Utrzymanie bezpiecznego dystansu poza strefą laserową."),
    BestiaryEntry("Ciężki Bus Tranzytowy", "🚐", "TARAN BOJOWY", Color(0xFFF97316), "420 HP | 125 km/h", "Masywny pojazd forsujący aleje. Zrzuca przeszkody pod koła.", "Wymaga spowolnienia zraszaczem PPOŻ i ognia skupionego."),
    BestiaryEntry("Główny Inspektor KAS", "🦅", "BOSS SEKTORA ★★★", Color(0xFFEF4444), "2500 HP | 75 km/h", "Stawia laserową barierę rewizyjną SAD i blokuje odnawianie energii.", "Unikanie czerwonych stref kwarantanny i ogień flankujący."),
    BestiaryEntry("Mecha-ToiToi 3000", "🚽", "BOSS BIOHAZARD ★★★★", Color(0xFF10B981), "4800 HP | 80 km/h", "Autonomiczny moduł skażenia. Rozpyla chmury trującego aerozolu.", "Ciągły ruch kołowy i unikanie chmur aerozolowych."),
    BestiaryEntry("Kontenerowiec 40ft", "🚢", "MEGA-BOSS ★★★★★", Color(0xFF38BDF8), "6000 HP | 35 km/h", "Forteca ładunkowa. Ciągły zrzut fal uderzeniowych wrogów.", "Wymaga w pełni rozwiniętych ewolucji broni."),
    BestiaryEntry("Dyrektor von Audit", "💡", "ZAGROŻENIE OSTATECZNE", Color(0xFFC084FC), "8500 HP | 90 km/h", "Wyłącza zasilanie magistrali i pogrąża sektor w całkowitym mroku.", "Wymaga reflektorów LED oraz maksymalnego pancerza!")
)

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

enum class ModalType {
    NONE, GARAGE, SYNERGIES, BESTIARY, DECREES
}

// --- WOW-EFFECT IMMERSIVE FULL-SCREEN MENU ---

@Composable
fun IntroComposeScreen(
    bridge: AndroidGameBridge? = null,
    onStartGame: () -> Unit,
    isWebViewLoaded: Boolean = true,
    modifier: Modifier = Modifier
) {
    var heroIndex by remember { mutableIntStateOf(0) }
    val currentHero = HEROES_ROSTER[heroIndex]

    var selectedGameMode by remember { mutableStateOf("standard") } // standard / endless
    var selectedArenaKey by remember { mutableStateOf("main") }     // main / freezer
    var isAudioEnabled by remember { mutableStateOf(true) }
    var activeModal by remember { mutableStateOf(ModalType.NONE) }

    // Workshop local progression tracking
    val workshopLevels = remember {
        mutableStateMapOf<String, Int>().apply {
            GARAGE_UPGRADES.forEach { put(it.key, 0) }
        }
    }
    var playerCredits by remember { mutableIntStateOf(1450) }

    // Infinite animations for the "WOW" effect
    val infiniteTransition = rememberInfiniteTransition(label = "HangarFx")

    // Pulsing reactor core
    val reactorPulse by infiniteTransition.animateFloat(
        initialValue = 0.94f,
        targetValue = 1.06f,
        animationSpec = infiniteRepeatable(
            animation = tween(900, easing = FastOutSlowInEasing),
            repeatMode = RepeatMode.Reverse
        ),
        label = "ReactorPulse"
    )

    // Hologram rotation
    val holoRotation by infiniteTransition.animateFloat(
        initialValue = 0f,
        targetValue = 360f,
        animationSpec = infiniteRepeatable(
            animation = tween(16000, easing = LinearEasing),
            repeatMode = RepeatMode.Restart
        ),
        label = "HoloRotation"
    )

    // Holographic radar sweep
    val radarSweep by infiniteTransition.animateFloat(
        initialValue = 0f,
        targetValue = 1f,
        animationSpec = infiniteRepeatable(
            animation = tween(3500, easing = LinearEasing),
            repeatMode = RepeatMode.Restart
        ),
        label = "RadarSweep"
    )

    // Neon Scanline beam
    val scanlineY by infiniteTransition.animateFloat(
        initialValue = 0f,
        targetValue = 1f,
        animationSpec = infiniteRepeatable(
            animation = tween(4000, easing = LinearEasing),
            repeatMode = RepeatMode.Restart
        ),
        label = "ScanlineY"
    )

    val scrollState = rememberScrollState()

    // Sync default hero with bridge on initial composition
    LaunchedEffect(Unit) {
        bridge?.setSelectedCharacterInGame(currentHero.key)
    }

    // Root Container with 3D Warehouse Background and dynamic FX
    Box(
        modifier = modifier
            .fillMaxSize()
            .background(Color(0xFF030712))
    ) {
        // Layer 1: Atmospheric Warehouse Hangar Image
        Image(
            painter = painterResource(id = R.drawable.warehouse_bg_1788686732876),
            contentDescription = null,
            contentScale = ContentScale.Crop,
            modifier = Modifier
                .fillMaxSize()
                .scale(1.08f)
        )

        // Layer 2: Deep Cyber Vignette & Sci-Fi Tint
        Box(
            modifier = Modifier
                .fillMaxSize()
                .background(
                    Brush.radialGradient(
                        colors = listOf(
                            Color(0x66030712),
                            Color(0xCC050A18),
                            Color(0xFC02050E)
                        ),
                        radius = 1200f
                    )
                )
        )

        // Layer 3: Interactive Canvas: 3D Floor Grid + Drifting Cyber Embers + Holographic Podium Rings
        Canvas(modifier = Modifier.fillMaxSize()) {
            val w = size.width
            val h = size.height

            // 1. Perspective 3D Cyber Floor Grid
            val horizonY = h * 0.52f
            val floorPathColor = Color(0xFF00F0FF).copy(alpha = 0.12f)
            val vanishingPointX = w * 0.5f

            for (i in -8..8) {
                val spreadX = vanishingPointX + (i * w * 0.15f)
                drawLine(
                    color = floorPathColor,
                    start = Offset(vanishingPointX, horizonY),
                    end = Offset(spreadX, h),
                    strokeWidth = 1.2f
                )
            }

            // Horizontal depth perspective lines
            val depthSteps = 7
            for (step in 1..depthSteps) {
                val progress = (step.toFloat() / depthSteps)
                val lineY = horizonY + (progress * progress * (h - horizonY))
                drawLine(
                    color = Color(0xFF00F0FF).copy(alpha = 0.05f + 0.15f * progress),
                    start = Offset(0f, lineY),
                    end = Offset(w, lineY),
                    strokeWidth = 1.2f + (progress * 1.5f)
                )
            }

            // 2. Holographic Rings under Hero Podium
            val podiumCenter = Offset(w * 0.5f, h * 0.38f)
            val baseRadius = w * 0.32f

            // Pulsing Hologram Wave
            drawCircle(
                color = currentHero.themeColor.copy(alpha = 0.06f * (1f - radarSweep)),
                radius = baseRadius * (0.6f + radarSweep * 0.8f),
                center = podiumCenter
            )

            // Outer Dashed Tech Ring
            drawCircle(
                color = currentHero.themeColor.copy(alpha = 0.45f),
                radius = baseRadius,
                center = podiumCenter,
                style = Stroke(
                    width = 2.5f,
                    pathEffect = PathEffect.dashPathEffect(floatArrayOf(30f, 15f, 10f, 15f), holoRotation * 2f)
                )
            )

            // Inner Ring
            drawCircle(
                color = Color(0xFFFFB800).copy(alpha = 0.35f),
                radius = baseRadius * 0.72f,
                center = podiumCenter,
                style = Stroke(
                    width = 1.5f,
                    pathEffect = PathEffect.dashPathEffect(floatArrayOf(18f, 18f), -holoRotation * 3f)
                )
            )

            // Drifting Cyber Embers (Simulated floating dust)
            val emberCount = 28
            for (i in 0 until emberCount) {
                val seedX = ((i * 137.5f) % w)
                val speed = 0.3f + ((i % 5) * 0.15f)
                val yProgress = ((scanlineY * speed + (i * 0.07f)) % 1f)
                val emberY = h - (yProgress * h)
                val emberAlpha = (0.2f + 0.6f * (1f - (yProgress - 0.5f).let { it * it * 4f }.coerceIn(0f, 1f)))

                val emberColor = if (i % 3 == 0) Color(0xFFFFB800) else if (i % 3 == 1) Color(0xFF00F0FF) else Color(0xFF10B981)
                drawCircle(
                    color = emberColor.copy(alpha = emberAlpha * 0.6f),
                    radius = (1.5f + (i % 3)),
                    center = Offset(seedX, emberY)
                )
            }

            // Laser Scanline beam
            val laserY = h * scanlineY
            drawLine(
                brush = Brush.horizontalGradient(
                    colors = listOf(
                        Color.Transparent,
                        Color(0xFF00F0FF).copy(alpha = 0.18f),
                        Color(0xFF00F0FF).copy(alpha = 0.4f),
                        Color(0xFF00F0FF).copy(alpha = 0.18f),
                        Color.Transparent
                    )
                ),
                start = Offset(0f, laserY),
                end = Offset(w, laserY),
                strokeWidth = 2.dp.toPx()
            )
        }

        // Layer 4: Main Interactive Cyber-HUD Structure with Adaptive Scroll
        Column(
            modifier = Modifier
                .fillMaxSize()
                .statusBarsPadding()
                .navigationBarsPadding()
                .padding(horizontal = 14.dp, vertical = 6.dp)
                .verticalScroll(scrollState),
            verticalArrangement = Arrangement.spacedBy(8.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {

            // --- SECTION 1: TOP SCI-FI TACTICAL APP BAR ---
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(vertical = 2.dp),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                // Tactical Location Capsule
                Surface(
                    shape = RoundedCornerShape(16.dp),
                    color = Color(0xFF0B1326).copy(alpha = 0.88f),
                    border = androidx.compose.foundation.BorderStroke(1.2.dp, Color(0xFF00F0FF).copy(alpha = 0.45f)),
                    shadowElevation = 8.dp
                ) {
                    Row(
                        modifier = Modifier.padding(horizontal = 12.dp, vertical = 6.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Box(
                            modifier = Modifier
                                .size(8.dp)
                                .background(Color(0xFF10B981), CircleShape)
                                .shadow(4.dp, CircleShape, spotColor = Color(0xFF10B981))
                        )
                        Spacer(modifier = Modifier.width(8.dp))
                        Column {
                            Text(
                                text = "DTA GRANICZNA // SEKTOR 8F",
                                color = Color(0xFFF1F5F9),
                                fontSize = 10.sp,
                                fontWeight = FontWeight.Black,
                                letterSpacing = 1.sp
                            )
                            Text(
                                text = "VULKAN RT • 120 FPS READY",
                                color = Color(0xFF00F0FF),
                                fontSize = 8.sp,
                                fontWeight = FontWeight.Bold,
                                letterSpacing = 0.5.sp
                            )
                        }
                    }
                }

                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    // Audio Toggle Pill
                    Surface(
                        shape = RoundedCornerShape(16.dp),
                        color = Color(0xFF0B1326).copy(alpha = 0.88f),
                        border = androidx.compose.foundation.BorderStroke(
                            1.dp,
                            if (isAudioEnabled) Color(0xFFFFB800).copy(alpha = 0.5f) else Color(0xFF334155)
                        ),
                        modifier = Modifier.clickable {
                            isAudioEnabled = !isAudioEnabled
                            bridge?.toggleAudioInGame()
                            bridge?.vibrate(25)
                        }
                    ) {
                        Row(
                            modifier = Modifier.padding(horizontal = 10.dp, vertical = 6.dp),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Icon(
                                imageVector = if (isAudioEnabled) Icons.Default.VolumeUp else Icons.Default.VolumeOff,
                                contentDescription = "Dźwięk",
                                tint = if (isAudioEnabled) Color(0xFFFFB800) else Color(0xFF64748B),
                                modifier = Modifier.size(16.dp)
                            )
                            Spacer(modifier = Modifier.width(4.dp))
                            Text(
                                text = if (isAudioEnabled) "AUDIO" else "MUTE",
                                color = if (isAudioEnabled) Color(0xFFFFB800) else Color(0xFF64748B),
                                fontSize = 10.sp,
                                fontWeight = FontWeight.Bold
                            )
                        }
                    }

                    // Night Shift Alarm Indicator
                    Surface(
                        shape = RoundedCornerShape(16.dp),
                        color = Color(0xFF450A0A).copy(alpha = 0.85f),
                        border = androidx.compose.foundation.BorderStroke(1.2.dp, Color(0xFFEF4444).copy(alpha = 0.7f))
                    ) {
                        Row(
                            modifier = Modifier.padding(horizontal = 10.dp, vertical = 6.dp),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Text(
                                text = "🚨 03:00",
                                color = Color(0xFFFCA5A5),
                                fontSize = 10.sp,
                                fontWeight = FontWeight.Black
                            )
                        }
                    }
                }
            }

            // --- SECTION 2: HERO 3D HOLOGRAPHIC STAGE (CENTERPIECE) ---
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(285.dp),
                contentAlignment = Alignment.Center
            ) {
                // Floating Background Forklift Blueprint Holo Silhouette
                Image(
                    painter = painterResource(id = R.drawable.img_toyota_bt_reflex),
                    contentDescription = null,
                    contentScale = ContentScale.Fit,
                    alpha = 0.18f,
                    modifier = Modifier
                        .fillMaxWidth(0.9f)
                        .height(200.dp)
                )

                // The Central Interactive Operator Stage
                Column(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalAlignment = Alignment.CenterHorizontally,
                    verticalArrangement = Arrangement.Center
                ) {
                    // Operator Avatar with Next / Prev Interactive Sci-Fi Chevrons
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        // Previous Hero Button
                        Surface(
                            shape = CircleShape,
                            color = Color(0xFF0F172A).copy(alpha = 0.8f),
                            border = androidx.compose.foundation.BorderStroke(1.5.dp, Color(0xFF00F0FF).copy(alpha = 0.4f)),
                            modifier = Modifier
                                .size(42.dp)
                                .clickable {
                                    heroIndex = (heroIndex - 1 + HEROES_ROSTER.size) % HEROES_ROSTER.size
                                    val h = HEROES_ROSTER[heroIndex]
                                    bridge?.setSelectedCharacterInGame(h.key)
                                    bridge?.vibrate(20)
                                }
                        ) {
                            Box(contentAlignment = Alignment.Center) {
                                Icon(
                                    imageVector = Icons.Default.KeyboardArrowLeft,
                                    contentDescription = "Poprzedni",
                                    tint = Color(0xFF00F0FF),
                                    modifier = Modifier.size(26.dp)
                                )
                            }
                        }

                        // Central Hero Hologram Podium
                        Box(
                            modifier = Modifier.size(130.dp),
                            contentAlignment = Alignment.Center
                        ) {
                            // Rotating Outer Energy Halo
                            Canvas(modifier = Modifier.fillMaxSize()) {
                                drawCircle(
                                    brush = Brush.sweepGradient(
                                        listOf(
                                            currentHero.themeColor.copy(alpha = 0.8f),
                                            Color(0xFFFFB800).copy(alpha = 0.8f),
                                            Color.Transparent,
                                            currentHero.themeColor.copy(alpha = 0.8f)
                                        )
                                    ),
                                    style = Stroke(width = 3.dp.toPx())
                                )
                            }

                            // Glowing Pedestal Base
                            Box(
                                modifier = Modifier
                                    .size(105.dp)
                                    .scale(reactorPulse)
                                    .shadow(22.dp, CircleShape, ambientColor = currentHero.themeColor, spotColor = currentHero.themeColor)
                                    .background(
                                        Brush.radialGradient(
                                            listOf(
                                                currentHero.themeColor.copy(alpha = 0.25f),
                                                Color(0xFF050B18)
                                            )
                                        ),
                                        CircleShape
                                    )
                                    .border(2.dp, currentHero.themeColor, CircleShape),
                                contentAlignment = Alignment.Center
                            ) {
                                Text(
                                    text = currentHero.icon,
                                    fontSize = 54.sp,
                                    modifier = Modifier.padding(bottom = 4.dp)
                                )
                            }

                            // Class Role Badge Pill overlapping podium
                            Surface(
                                shape = RoundedCornerShape(12.dp),
                                color = Color(0xFF0B1326),
                                border = androidx.compose.foundation.BorderStroke(1.dp, currentHero.themeColor),
                                modifier = Modifier
                                    .align(Alignment.BottomCenter)
                            ) {
                                Text(
                                    text = "LVL 1 • READY",
                                    color = currentHero.themeColor,
                                    fontSize = 8.sp,
                                    fontWeight = FontWeight.Black,
                                    modifier = Modifier.padding(horizontal = 8.dp, vertical = 2.dp)
                                )
                            }
                        }

                        // Next Hero Button
                        Surface(
                            shape = CircleShape,
                            color = Color(0xFF0F172A).copy(alpha = 0.8f),
                            border = androidx.compose.foundation.BorderStroke(1.5.dp, Color(0xFF00F0FF).copy(alpha = 0.4f)),
                            modifier = Modifier
                                .size(42.dp)
                                .clickable {
                                    heroIndex = (heroIndex + 1) % HEROES_ROSTER.size
                                    val h = HEROES_ROSTER[heroIndex]
                                    bridge?.setSelectedCharacterInGame(h.key)
                                    bridge?.vibrate(20)
                                }
                        ) {
                            Box(contentAlignment = Alignment.Center) {
                                Icon(
                                    imageVector = Icons.Default.KeyboardArrowRight,
                                    contentDescription = "Następny",
                                    tint = Color(0xFF00F0FF),
                                    modifier = Modifier.size(26.dp)
                                )
                            }
                        }
                    }

                    Spacer(modifier = Modifier.height(6.dp))

                    // Hero Name & Class Title
                    Text(
                        text = currentHero.name.uppercase(),
                        color = Color(0xFFF8FAFC),
                        fontSize = 17.sp,
                        fontWeight = FontWeight.Black,
                        letterSpacing = 1.2.sp,
                        textAlign = TextAlign.Center
                    )
                    Text(
                        text = "⭐ ${currentHero.role.uppercase()}",
                        color = currentHero.themeColor,
                        fontSize = 9.5.sp,
                        fontWeight = FontWeight.Bold,
                        letterSpacing = 0.8.sp,
                        textAlign = TextAlign.Center
                    )

                    Spacer(modifier = Modifier.height(6.dp))

                    // Holographic Weapon & Passive Module Box
                    Surface(
                        shape = RoundedCornerShape(14.dp),
                        color = Color(0xFF0B1324).copy(alpha = 0.9f),
                        border = androidx.compose.foundation.BorderStroke(1.dp, Color(0xFF1E293B)),
                        modifier = Modifier
                            .fillMaxWidth(0.95f)
                    ) {
                        Column(modifier = Modifier.padding(horizontal = 12.dp, vertical = 7.dp)) {
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Row(verticalAlignment = Alignment.CenterVertically) {
                                    Text(text = "⚡ BROŃ:", color = Color(0xFFFFB800), fontSize = 9.5.sp, fontWeight = FontWeight.Black)
                                    Spacer(modifier = Modifier.width(6.dp))
                                    Text(text = currentHero.weaponName, color = Color(0xFFF8FAFC), fontSize = 9.5.sp, fontWeight = FontWeight.Bold)
                                }

                                Surface(
                                    shape = RoundedCornerShape(8.dp),
                                    color = currentHero.themeColor.copy(alpha = 0.15f),
                                    border = androidx.compose.foundation.BorderStroke(0.8.dp, currentHero.themeColor)
                                ) {
                                    Text(
                                        text = "TAKTYCZNA",
                                        color = currentHero.themeColor,
                                        fontSize = 7.5.sp,
                                        fontWeight = FontWeight.Bold,
                                        modifier = Modifier.padding(horizontal = 5.dp, vertical = 2.dp)
                                    )
                                }
                            }

                            Spacer(modifier = Modifier.height(3.dp))

                            Text(
                                text = "🛡️ ${currentHero.passiveDesc}",
                                color = Color(0xFF94A3B8),
                                fontSize = 9.sp,
                                maxLines = 1
                            )
                        }
                    }

                    Spacer(modifier = Modifier.height(6.dp))

                    // Fast 3-Meter Telemetry Gauges (Bateria HP, V-MAX, Skaner EXP)
                    Row(
                        modifier = Modifier.fillMaxWidth(0.95f),
                        horizontalArrangement = Arrangement.spacedBy(6.dp)
                    ) {
                        HoloStatBar(
                            modifier = Modifier.weight(1f),
                            label = "AKUMULATOR HP",
                            percent = currentHero.hpPct,
                            color = Color(0xFF10B981)
                        )
                        HoloStatBar(
                            modifier = Modifier.weight(1f),
                            label = "PRĘDKOŚĆ V-MAX",
                            percent = currentHero.speedPct,
                            color = Color(0xFF00F0FF)
                        )
                        HoloStatBar(
                            modifier = Modifier.weight(1f),
                            label = "SKANER EXP",
                            percent = currentHero.magnetPct,
                            color = Color(0xFFFFB800)
                        )
                    }

                    Spacer(modifier = Modifier.height(4.dp))

                    // Quote Bar
                    Text(
                        text = "💬 \"${currentHero.quote}\"",
                        color = Color(0xFF64748B),
                        fontSize = 8.5.sp,
                        fontStyle = FontStyle.Italic,
                        textAlign = TextAlign.Center,
                        maxLines = 1
                    )
                }
            }

            // --- SECTION 2B: QUICK-SELECT OPERATOR HORIZONTAL CAROUSEL ---
            Column(
                modifier = Modifier.fillMaxWidth(),
                horizontalAlignment = Alignment.Start
            ) {
                Text(
                    text = "WYBIERZ OPERATORA // 10 JEDNOSTEK",
                    color = Color(0xFF94A3B8),
                    fontSize = 8.5.sp,
                    fontWeight = FontWeight.Bold,
                    letterSpacing = 0.8.sp,
                    modifier = Modifier.padding(start = 4.dp, bottom = 4.dp)
                )

                LazyRow(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(8.dp),
                    contentPadding = PaddingValues(horizontal = 2.dp)
                ) {
                    itemsIndexed(HEROES_ROSTER) { idx, hero ->
                        val isSelected = idx == heroIndex
                        Surface(
                            shape = RoundedCornerShape(12.dp),
                            color = if (isSelected) hero.themeColor.copy(alpha = 0.2f) else Color(0xFF0B1324).copy(alpha = 0.85f),
                            border = androidx.compose.foundation.BorderStroke(
                                1.5.dp,
                                if (isSelected) hero.themeColor else Color(0xFF1E293B)
                            ),
                            modifier = Modifier
                                .clickable {
                                    heroIndex = idx
                                    bridge?.setSelectedCharacterInGame(hero.key)
                                    bridge?.vibrate(25)
                                }
                        ) {
                            Row(
                                modifier = Modifier.padding(horizontal = 8.dp, vertical = 6.dp),
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Text(text = hero.icon, fontSize = 16.sp)
                                Spacer(modifier = Modifier.width(6.dp))
                                Column {
                                    Text(
                                        text = hero.name.split(" ").firstOrNull() ?: hero.name,
                                        color = if (isSelected) Color.White else Color(0xFF94A3B8),
                                        fontSize = 9.sp,
                                        fontWeight = if (isSelected) FontWeight.Black else FontWeight.Bold
                                    )
                                    Text(
                                        text = hero.role.split("&", " ").firstOrNull() ?: "",
                                        color = hero.themeColor,
                                        fontSize = 7.5.sp
                                    )
                                }
                            }
                        }
                    }
                }
            }

            // --- SECTION 3: FLOATING CYBER-DOCK (QUICK ACCESS NAVIGATION) ---
            Surface(
                shape = RoundedCornerShape(20.dp),
                color = Color(0xFF070D1C).copy(alpha = 0.95f),
                border = androidx.compose.foundation.BorderStroke(1.2.dp, Color(0xFF00F0FF).copy(alpha = 0.35f)),
                shadowElevation = 12.dp,
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(vertical = 2.dp)
            ) {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(horizontal = 6.dp, vertical = 7.dp),
                    horizontalArrangement = Arrangement.SpaceEvenly,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    DockButton(
                        icon = Icons.Default.Build,
                        label = "WARSZTAT",
                        color = Color(0xFFFFB800),
                        onClick = {
                            activeModal = ModalType.GARAGE
                            bridge?.vibrate(25)
                        }
                    )
                    DockButton(
                        icon = Icons.Default.AutoAwesome,
                        label = "EWOLUCJE",
                        color = Color(0xFF00F0FF),
                        onClick = {
                            activeModal = ModalType.SYNERGIES
                            bridge?.vibrate(25)
                        }
                    )
                    DockButton(
                        icon = Icons.Default.Warning,
                        label = "BESTIARIUSZ",
                        color = Color(0xFFEF4444),
                        onClick = {
                            activeModal = ModalType.BESTIARY
                            bridge?.vibrate(25)
                        }
                    )
                    DockButton(
                        icon = Icons.Default.MenuBook,
                        label = "DYREKTYWY",
                        color = Color(0xFF10B981),
                        onClick = {
                            activeModal = ModalType.DECREES
                            bridge?.vibrate(25)
                        }
                    )
                }
            }

            // --- SECTION 4: MISSION LAUNCH COCKPIT & SECTOR TOGGLE ---
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(top = 2.dp),
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                // Tactical Mode & Arena Switcher
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    // Mission Mode Toggle Pill
                    Surface(
                        shape = RoundedCornerShape(14.dp),
                        color = Color(0xFF0B1326).copy(alpha = 0.9f),
                        border = androidx.compose.foundation.BorderStroke(
                            1.2.dp,
                            if (selectedGameMode == "standard") Color(0xFFFFB800) else Color(0xFF10B981)
                        ),
                        modifier = Modifier
                            .weight(1f)
                            .clickable {
                                selectedGameMode = if (selectedGameMode == "standard") "endless" else "standard"
                                bridge?.setSelectedGameModeInGame(selectedGameMode)
                                bridge?.vibrate(20)
                            }
                    ) {
                        Row(
                            modifier = Modifier.padding(horizontal = 10.dp, vertical = 7.dp),
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.Center
                        ) {
                            Text(
                                text = if (selectedGameMode == "standard") "⏱️ ZMIANA 10 MIN" else "♾️ NIESKOŃCZONY",
                                color = if (selectedGameMode == "standard") Color(0xFFFFB800) else Color(0xFF34D399),
                                fontSize = 10.sp,
                                fontWeight = FontWeight.Black
                            )
                        }
                    }

                    // Arena Sector Toggle Pill
                    Surface(
                        shape = RoundedCornerShape(14.dp),
                        color = Color(0xFF0B1326).copy(alpha = 0.9f),
                        border = androidx.compose.foundation.BorderStroke(
                            1.2.dp,
                            if (selectedArenaKey == "main") Color(0xFF00F0FF) else Color(0xFF38BDF8)
                        ),
                        modifier = Modifier
                            .weight(1f)
                            .clickable {
                                selectedArenaKey = if (selectedArenaKey == "main") "freezer" else "main"
                                bridge?.setSelectedArenaInGame(selectedArenaKey)
                                bridge?.vibrate(20)
                            }
                    ) {
                        Row(
                            modifier = Modifier.padding(horizontal = 10.dp, vertical = 7.dp),
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.Center
                        ) {
                            Text(
                                text = if (selectedArenaKey == "main") "🏭 HALA 8F GŁÓWNA" else "❄️ CHŁODNIA -24°C",
                                color = if (selectedArenaKey == "main") Color(0xFF00F0FF) else Color(0xFF38BDF8),
                                fontSize = 10.sp,
                                fontWeight = FontWeight.Black
                            )
                        }
                    }
                }

                Spacer(modifier = Modifier.height(8.dp))

                // HIGH-VOLTAGE AAA LAUNCH COMMAND BUTTON
                Button(
                    enabled = isWebViewLoaded,
                    onClick = {
                        bridge?.vibrate(40)
                        onStartGame()
                    },
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(58.dp)
                        .scale(if (isWebViewLoaded) reactorPulse.coerceIn(0.98f, 1.02f) else 1f)
                        .shadow(
                            elevation = if (isWebViewLoaded) 22.dp else 0.dp,
                            shape = RoundedCornerShape(18.dp),
                            ambientColor = Color(0xFFFFB800),
                            spotColor = Color(0xFFFF3300)
                        )
                        .border(
                            width = 2.dp,
                            brush = Brush.horizontalGradient(
                                listOf(
                                    Color(0xFFFFB800),
                                    Color(0xFFFF3300),
                                    Color(0xFF00F0FF),
                                    Color(0xFFFFB800)
                                )
                            ),
                            shape = RoundedCornerShape(18.dp)
                        )
                        .testTag("btn_launch_game"),
                    colors = ButtonDefaults.buttonColors(
                        containerColor = if (isWebViewLoaded) Color(0xFFFF9900) else Color(0xFF1E293B),
                        disabledContainerColor = Color(0xFF1E293B)
                    ),
                    shape = RoundedCornerShape(18.dp)
                ) {
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.Center
                    ) {
                        if (isWebViewLoaded) {
                            Icon(
                                imageVector = Icons.Default.PlayArrow,
                                contentDescription = "Start",
                                tint = Color(0xFF090E17),
                                modifier = Modifier.size(26.dp)
                            )
                            Spacer(modifier = Modifier.width(8.dp))
                            Column(horizontalAlignment = Alignment.CenterHorizontally) {
                                Text(
                                    text = "ROZPOCZNIJ ZMIANĘ // DEPLOY",
                                    color = Color(0xFF090E17),
                                    fontSize = 14.sp,
                                    fontWeight = FontWeight.Black,
                                    letterSpacing = 1.2.sp
                                )
                                Text(
                                    text = "KLIKNIJ ABY ROZPOCZĄĆ PATROL PERYMETRU",
                                    color = Color(0xFF331100),
                                    fontSize = 8.sp,
                                    fontWeight = FontWeight.Bold
                                )
                            }
                        } else {
                            CircularProgressIndicator(
                                color = Color(0xFF00F0FF),
                                modifier = Modifier.size(22.dp),
                                strokeWidth = 2.5.dp
                            )
                            Spacer(modifier = Modifier.width(10.dp))
                            Text(
                                text = "INICJALIZACJA SILNIKA...",
                                color = Color(0xFF94A3B8),
                                fontSize = 12.sp,
                                fontWeight = FontWeight.Bold
                            )
                        }
                    }
                }

                Spacer(modifier = Modifier.height(10.dp))

                Text(
                    text = "DTA GRANICZNA 8F • HYBRID 2.5D OPENGL • 120 FPS",
                    color = Color(0xFF64748B),
                    fontSize = 8.5.sp,
                    fontWeight = FontWeight.SemiBold,
                    textAlign = TextAlign.Center
                )
            }
        }

        // --- FULL-SCREEN HOLOGRAPHIC MODAL OVERLAYS (WARSZTAT, EWOLUCJE, BESTIARIUSZ, KODEKS) ---
        AnimatedVisibility(
            visible = activeModal != ModalType.NONE,
            enter = slideInVertically(initialOffsetY = { it }) + fadeIn(),
            exit = slideOutVertically(targetOffsetY = { it }) + fadeOut()
        ) {
            Surface(
                modifier = Modifier.fillMaxSize(),
                color = Color(0xFA050914)
            ) {
                Column(
                    modifier = Modifier
                        .fillMaxSize()
                        .statusBarsPadding()
                        .navigationBarsPadding()
                        .padding(16.dp)
                ) {
                    // Modal Header
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Surface(
                                shape = CircleShape,
                                color = Color(0xFF0B1324),
                                border = androidx.compose.foundation.BorderStroke(1.dp, Color(0xFF00F0FF))
                            ) {
                                Icon(
                                    imageVector = when (activeModal) {
                                        ModalType.GARAGE -> Icons.Default.Build
                                        ModalType.SYNERGIES -> Icons.Default.AutoAwesome
                                        ModalType.BESTIARY -> Icons.Default.Warning
                                        ModalType.DECREES -> Icons.Default.MenuBook
                                        else -> Icons.Default.Security
                                    },
                                    contentDescription = null,
                                    tint = Color(0xFF00F0FF),
                                    modifier = Modifier
                                        .padding(8.dp)
                                        .size(20.dp)
                                )
                            }
                            Spacer(modifier = Modifier.width(10.dp))
                            Column {
                                Text(
                                    text = when (activeModal) {
                                        ModalType.GARAGE -> "WARSZTAT TUNINGU WÓZKA BT"
                                        ModalType.SYNERGIES -> "MATRYCA EWOLUCJI I SYNERGII"
                                        ModalType.BESTIARY -> "RADAR I BESTIARIUSZ ZAGROŻEŃ"
                                        ModalType.DECREES -> "KODEKS I DYREKTYWY ZARZĄDU"
                                        else -> ""
                                    },
                                    color = Color(0xFFF8FAFC),
                                    fontSize = 13.sp,
                                    fontWeight = FontWeight.Black,
                                    letterSpacing = 0.8.sp
                                )
                                Text(
                                    text = if (activeModal == ModalType.GARAGE) "KREDYTY WMS: 💰 $playerCredits XP" else "TERMINAL DTA // DOSTĘP AUTORYZOWANY",
                                    color = if (activeModal == ModalType.GARAGE) Color(0xFFFFB800) else Color(0xFF00F0FF),
                                    fontSize = 9.sp,
                                    fontWeight = FontWeight.Bold
                                )
                            }
                        }

                        // Close Button
                        IconButton(
                            onClick = {
                                activeModal = ModalType.NONE
                                bridge?.vibrate(15)
                            },
                            modifier = Modifier
                                .background(Color(0xFF1E293B).copy(alpha = 0.6f), CircleShape)
                                .size(36.dp)
                        ) {
                            Icon(
                                imageVector = Icons.Default.Close,
                                contentDescription = "Zamknij",
                                tint = Color(0xFFF1F5F9),
                                modifier = Modifier.size(20.dp)
                            )
                        }
                    }

                    Spacer(modifier = Modifier.height(14.dp))

                    // Modal Body Content
                    Box(modifier = Modifier.fillMaxSize()) {
                        when (activeModal) {
                            ModalType.GARAGE -> {
                                LazyColumn(
                                    modifier = Modifier.fillMaxSize(),
                                    verticalArrangement = Arrangement.spacedBy(8.dp)
                                ) {
                                    items(GARAGE_UPGRADES) { item ->
                                        val curLvl = workshopLevels[item.key] ?: 0
                                        val cost = (item.baseCost * Math.pow(1.5, curLvl.toDouble())).toInt()
                                        val isMax = curLvl >= item.maxLvl
                                        val canAfford = playerCredits >= cost && !isMax

                                        Card(
                                            modifier = Modifier
                                                .fillMaxWidth()
                                                .border(1.dp, if (isMax) Color(0xFF10B981).copy(alpha = 0.5f) else Color(0xFF1E293B), RoundedCornerShape(16.dp)),
                                            shape = RoundedCornerShape(16.dp),
                                            colors = CardDefaults.cardColors(containerColor = Color(0xFF0B1324))
                                        ) {
                                            Row(
                                                modifier = Modifier
                                                    .fillMaxWidth()
                                                    .padding(12.dp),
                                                horizontalArrangement = Arrangement.SpaceBetween,
                                                verticalAlignment = Alignment.CenterVertically
                                            ) {
                                                Row(
                                                    verticalAlignment = Alignment.CenterVertically,
                                                    modifier = Modifier.weight(1f)
                                                ) {
                                                    Text(text = item.icon, fontSize = 28.sp)
                                                    Spacer(modifier = Modifier.width(12.dp))
                                                    Column {
                                                        Row(verticalAlignment = Alignment.CenterVertically) {
                                                            Text(
                                                                text = item.name,
                                                                color = Color(0xFFF8FAFC),
                                                                fontSize = 11.sp,
                                                                fontWeight = FontWeight.Bold
                                                            )
                                                            Spacer(modifier = Modifier.width(6.dp))
                                                            Text(
                                                                text = "($curLvl/${item.maxLvl})",
                                                                color = if (isMax) Color(0xFF10B981) else Color(0xFF00F0FF),
                                                                fontSize = 9.5.sp,
                                                                fontWeight = FontWeight.Black
                                                            )
                                                        }
                                                        Text(
                                                            text = item.desc,
                                                            color = Color(0xFF94A3B8),
                                                            fontSize = 9.sp
                                                        )
                                                    }
                                                }

                                                Spacer(modifier = Modifier.width(8.dp))

                                                Button(
                                                    enabled = canAfford,
                                                    onClick = {
                                                        if (canAfford) {
                                                            playerCredits -= cost
                                                            workshopLevels[item.key] = curLvl + 1
                                                            bridge?.buyWorkshopUpgradeInGame(item.key, cost)
                                                            bridge?.vibrate(30)
                                                        }
                                                    },
                                                    colors = ButtonDefaults.buttonColors(
                                                        containerColor = if (isMax) Color(0xFF10B981) else Color(0xFFFFB800),
                                                        disabledContainerColor = Color(0xFF1E293B)
                                                    ),
                                                    shape = RoundedCornerShape(12.dp),
                                                    contentPadding = PaddingValues(horizontal = 10.dp, vertical = 6.dp)
                                                ) {
                                                    if (isMax) {
                                                        Row(verticalAlignment = Alignment.CenterVertically) {
                                                            Icon(Icons.Default.CheckCircle, contentDescription = null, tint = Color.White, modifier = Modifier.size(12.dp))
                                                            Spacer(modifier = Modifier.width(4.dp))
                                                            Text(text = "MAKS", color = Color.White, fontSize = 9.5.sp, fontWeight = FontWeight.Black)
                                                        }
                                                    } else {
                                                        Text(
                                                            text = "$cost XP",
                                                            color = if (canAfford) Color(0xFF090E17) else Color(0xFF64748B),
                                                            fontSize = 10.sp,
                                                            fontWeight = FontWeight.Black
                                                        )
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }

                            ModalType.SYNERGIES -> {
                                LazyColumn(
                                    modifier = Modifier.fillMaxSize(),
                                    verticalArrangement = Arrangement.spacedBy(8.dp)
                                ) {
                                    items(SYNERGY_EVOLUTIONS) { evo ->
                                        Card(
                                            modifier = Modifier
                                                .fillMaxWidth()
                                                .border(1.dp, Color(0xFF00F0FF).copy(alpha = 0.3f), RoundedCornerShape(16.dp)),
                                            shape = RoundedCornerShape(16.dp),
                                            colors = CardDefaults.cardColors(containerColor = Color(0xFF0B1324))
                                        ) {
                                            Column(modifier = Modifier.padding(12.dp)) {
                                                Row(
                                                    modifier = Modifier.fillMaxWidth(),
                                                    verticalAlignment = Alignment.CenterVertically,
                                                    horizontalArrangement = Arrangement.SpaceBetween
                                                ) {
                                                    Row(verticalAlignment = Alignment.CenterVertically) {
                                                        Text(text = "${evo.weaponIcon} ${evo.weaponName}", color = Color(0xFFF8FAFC), fontSize = 10.sp, fontWeight = FontWeight.Bold)
                                                        Text(text = " + ", color = Color(0xFFFFB800), fontSize = 11.sp, fontWeight = FontWeight.Black)
                                                        Text(text = "${evo.passiveIcon} ${evo.passiveName}", color = Color(0xFF38BDF8), fontSize = 10.sp, fontWeight = FontWeight.Bold)
                                                    }

                                                    Text(text = "➔", color = Color(0xFF00F0FF), fontSize = 12.sp)

                                                    Surface(
                                                        shape = RoundedCornerShape(8.dp),
                                                        color = Color(0xFF00F0FF).copy(alpha = 0.15f),
                                                        border = androidx.compose.foundation.BorderStroke(1.dp, Color(0xFF00F0FF))
                                                    ) {
                                                        Text(
                                                            text = "${evo.evoIcon} ${evo.evoName}",
                                                            color = Color(0xFF00F0FF),
                                                            fontSize = 9.5.sp,
                                                            fontWeight = FontWeight.Black,
                                                            modifier = Modifier.padding(horizontal = 6.dp, vertical = 3.dp)
                                                        )
                                                    }
                                                }

                                                Spacer(modifier = Modifier.height(6.dp))

                                                Text(
                                                    text = "⚡ ${evo.evoPower}",
                                                    color = Color(0xFFFFB800),
                                                    fontSize = 9.5.sp,
                                                    fontWeight = FontWeight.SemiBold
                                                )
                                            }
                                        }
                                    }
                                }
                            }

                            ModalType.BESTIARY -> {
                                LazyColumn(
                                    modifier = Modifier.fillMaxSize(),
                                    verticalArrangement = Arrangement.spacedBy(8.dp)
                                ) {
                                    items(BESTIARY_CATALOG) { b ->
                                        Card(
                                            modifier = Modifier
                                                .fillMaxWidth()
                                                .border(1.dp, b.threatColor.copy(alpha = 0.4f), RoundedCornerShape(16.dp)),
                                            shape = RoundedCornerShape(16.dp),
                                            colors = CardDefaults.cardColors(containerColor = Color(0xFF0B1324))
                                        ) {
                                            Row(
                                                modifier = Modifier
                                                    .fillMaxWidth()
                                                    .padding(12.dp),
                                                verticalAlignment = Alignment.CenterVertically
                                            ) {
                                                Text(text = b.icon, fontSize = 32.sp)
                                                Spacer(modifier = Modifier.width(12.dp))
                                                Column(modifier = Modifier.weight(1f)) {
                                                    Row(
                                                        modifier = Modifier.fillMaxWidth(),
                                                        horizontalArrangement = Arrangement.SpaceBetween,
                                                        verticalAlignment = Alignment.CenterVertically
                                                    ) {
                                                        Text(text = b.name, color = Color(0xFFF8FAFC), fontSize = 11.sp, fontWeight = FontWeight.Black)
                                                        Surface(
                                                            shape = RoundedCornerShape(8.dp),
                                                            color = b.threatColor.copy(alpha = 0.2f),
                                                            border = androidx.compose.foundation.BorderStroke(1.dp, b.threatColor)
                                                        ) {
                                                            Text(
                                                                text = b.threat,
                                                                color = b.threatColor,
                                                                fontSize = 7.5.sp,
                                                                fontWeight = FontWeight.Black,
                                                                modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp)
                                                            )
                                                        }
                                                    }
                                                    Spacer(modifier = Modifier.height(2.dp))
                                                    Text(text = "STATY: ${b.hpSpeed}", color = Color(0xFF00F0FF), fontSize = 9.sp, fontWeight = FontWeight.Bold)
                                                    Text(text = b.behavior, color = Color(0xFF94A3B8), fontSize = 9.sp)
                                                    Text(text = "SŁABOŚĆ: ${b.weakPoint}", color = Color(0xFFFFB800), fontSize = 9.sp)
                                                }
                                            }
                                        }
                                    }
                                }
                            }

                            ModalType.DECREES -> {
                                LazyColumn(
                                    modifier = Modifier.fillMaxSize(),
                                    verticalArrangement = Arrangement.spacedBy(10.dp)
                                ) {
                                    items(DECREES) { d ->
                                        Card(
                                            modifier = Modifier
                                                .fillMaxWidth()
                                                .border(1.dp, d.stampColor.copy(alpha = 0.4f), RoundedCornerShape(16.dp)),
                                            shape = RoundedCornerShape(16.dp),
                                            colors = CardDefaults.cardColors(containerColor = Color(0xFF0B1324))
                                        ) {
                                            Column(modifier = Modifier.padding(14.dp)) {
                                                Row(
                                                    modifier = Modifier.fillMaxWidth(),
                                                    horizontalArrangement = Arrangement.SpaceBetween,
                                                    verticalAlignment = Alignment.CenterVertically
                                                ) {
                                                    Row(verticalAlignment = Alignment.CenterVertically) {
                                                        Text(text = d.icon, fontSize = 20.sp)
                                                        Spacer(modifier = Modifier.width(8.dp))
                                                        Column {
                                                            Text(text = d.title, color = Color(0xFFF8FAFC), fontSize = 10.sp, fontWeight = FontWeight.Black)
                                                            Text(text = d.decreeNumber, color = Color(0xFF64748B), fontSize = 8.sp)
                                                        }
                                                    }
                                                    Surface(
                                                        shape = RoundedCornerShape(8.dp),
                                                        color = d.stampColor.copy(alpha = 0.2f),
                                                        border = androidx.compose.foundation.BorderStroke(1.dp, d.stampColor)
                                                    ) {
                                                        Text(
                                                            text = d.stampText,
                                                            color = d.stampColor,
                                                            fontSize = 8.sp,
                                                            fontWeight = FontWeight.Black,
                                                            modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp)
                                                        )
                                                    }
                                                }
                                                Spacer(modifier = Modifier.height(8.dp))
                                                Text(text = d.text, color = Color(0xFFCBD5E1), fontSize = 9.5.sp, lineHeight = 13.sp)
                                                Spacer(modifier = Modifier.height(6.dp))
                                                Text(text = d.consequences, color = Color(0xFFFFB800), fontSize = 9.sp, fontWeight = FontWeight.Bold)
                                            }
                                        }
                                    }
                                }
                            }

                            else -> {}
                        }
                    }
                }
            }
        }
    }
}

// --- MICRO SCI-FI COMPOSABLES ---

@Composable
fun HoloStatBar(
    modifier: Modifier = Modifier,
    label: String,
    percent: Float,
    color: Color
) {
    Surface(
        shape = RoundedCornerShape(10.dp),
        color = Color(0xFF0B1324).copy(alpha = 0.85f),
        border = androidx.compose.foundation.BorderStroke(1.dp, Color(0xFF1E293B)),
        modifier = modifier
    ) {
        Column(modifier = Modifier.padding(horizontal = 6.dp, vertical = 5.dp)) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Text(text = label, color = Color(0xFF94A3B8), fontSize = 7.sp, fontWeight = FontWeight.Bold)
                Text(text = "${(percent * 100).toInt()}%", color = color, fontSize = 7.5.sp, fontWeight = FontWeight.Black)
            }
            Spacer(modifier = Modifier.height(3.dp))
            LinearProgressIndicator(
                progress = { percent },
                modifier = Modifier
                    .fillMaxWidth()
                    .height(4.dp)
                    .clip(RoundedCornerShape(2.dp)),
                color = color,
                trackColor = Color(0xFF1E293B)
            )
        }
    }
}

@Composable
fun DockButton(
    icon: androidx.compose.ui.graphics.vector.ImageVector,
    label: String,
    color: Color,
    onClick: () -> Unit
) {
    Surface(
        shape = RoundedCornerShape(14.dp),
        color = Color(0xFF0F1B33).copy(alpha = 0.7f),
        border = androidx.compose.foundation.BorderStroke(1.dp, color.copy(alpha = 0.35f)),
        modifier = Modifier
            .clickable { onClick() }
    ) {
        Row(
            modifier = Modifier.padding(horizontal = 9.dp, vertical = 6.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Icon(
                imageVector = icon,
                contentDescription = label,
                tint = color,
                modifier = Modifier.size(14.dp)
            )
            Spacer(modifier = Modifier.width(4.dp))
            Text(
                text = label,
                color = Color(0xFFF1F5F9),
                fontSize = 8.5.sp,
                fontWeight = FontWeight.Black,
                letterSpacing = 0.5.sp
            )
        }
    }
}
