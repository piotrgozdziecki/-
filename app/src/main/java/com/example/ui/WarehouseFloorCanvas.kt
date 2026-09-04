package com.example.ui

import androidx.compose.animation.core.LinearEasing
import androidx.compose.animation.core.RepeatMode
import androidx.compose.animation.core.animateFloat
import androidx.compose.animation.core.infiniteRepeatable
import androidx.compose.animation.core.rememberInfiniteTransition
import androidx.compose.animation.core.tween
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.gestures.detectDragGestures
import androidx.compose.foundation.gestures.detectTapGestures
import androidx.compose.foundation.gestures.detectTransformGestures
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.BoxWithConstraints
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ElectricBolt
import androidx.compose.material.icons.filled.Info
import androidx.compose.material.icons.filled.Layers
import androidx.compose.material.icons.filled.LocalShipping
import androidx.compose.material.icons.filled.Refresh
import androidx.compose.material.icons.filled.Warning
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableFloatStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.geometry.CornerRadius
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Rect
import androidx.compose.ui.geometry.RoundRect
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.BlendMode
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Path
import androidx.compose.ui.graphics.PathEffect
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.graphics.StrokeJoin
import androidx.compose.ui.graphics.drawscope.DrawScope
import androidx.compose.ui.graphics.drawscope.Fill
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.graphics.drawscope.rotate
import androidx.compose.ui.graphics.nativeCanvas
import androidx.compose.ui.input.pointer.pointerInput
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import kotlin.math.PI
import kotlin.math.cos
import kotlin.math.sin
import kotlin.math.sqrt
import kotlin.random.Random

/**
 * Logistics Terminal Sector Theme
 */
enum class TerminalSector(
    val title: String,
    val subtitle: String,
    val floorBaseColor: Color,
    val gridColor: Color,
    val laneColor: Color,
    val accentColor: Color,
    val specularity: Float
) {
    CROSSDOCK_MAIN(
        title = "Sektor A: Cross-Docking & Doki 1-8",
        subtitle = "DTA Graniczna 8f - Główny Korytarz Przeładunkowy",
        floorBaseColor = Color(0xFF0D131F),
        gridColor = Color(0xFF1E293B),
        laneColor = Color(0xFFF59E0B),
        accentColor = Color(0xFF38BDF8),
        specularity = 0.85f
    ),
    HIGH_BAY_RACKS(
        title = "Sektor B: Regały Wysokiego Składowania",
        subtitle = "Alei R1-R16 - Precyzyjne Linie Prowadzące BT",
        floorBaseColor = Color(0xFF090D16),
        gridColor = Color(0xFF192231),
        laneColor = Color(0xFFE2E8F0),
        accentColor = Color(0xFF818CF8),
        specularity = 0.70f
    ),
    FREEZER_MINUS25(
        title = "Sektor C: Chłodnia Mrożonek -25°C",
        subtitle = "Strefa Kontrolowanej Temperatury - Posadzka Antypoślizgowa",
        floorBaseColor = Color(0xFF04101E),
        gridColor = Color(0xFF0E2A47),
        laneColor = Color(0xFF67E8F9),
        accentColor = Color(0xFF38BDF8),
        specularity = 0.95f
    ),
    ADR_HAZARDOUS(
        title = "Sektor D: Magazyn Chemiczny & ADR",
        subtitle = "Strefa Materiałów Niebezpiecznych - Żywica Chemioodporna",
        floorBaseColor = Color(0xFF150A0A),
        gridColor = Color(0xFF2E1313),
        laneColor = Color(0xFFEF4444),
        accentColor = Color(0xFFF97316),
        specularity = 0.80f
    ),
    CUSTOMS_DEPOT(
        title = "Sektor E: Skład Celny DTA Agencja",
        subtitle = "Magazyn Czasowego Składowania - Perymetr Chroniony",
        floorBaseColor = Color(0xFF0A121A),
        gridColor = Color(0xFF132232),
        laneColor = Color(0xFF10B981),
        accentColor = Color(0xFF34D399),
        specularity = 0.75f
    )
}

/**
 * Procedural Tile Data Representation
 */
data class ProceduralTile(
    val col: Int,
    val row: Int,
    val worldX: Float,
    val worldY: Float,
    val size: Float,
    val wearFactor: Float, // 0.0 to 1.0
    val sheenFactor: Float,
    val hasCrack: Boolean,
    val crackAngle: Float,
    val crackLength: Float,
    val tileId: String
)

/**
 * Staging Bay (Pole Odstawcze Palet)
 */
data class StagingBay(
    val bayId: String,
    val x: Float,
    val y: Float,
    val width: Float,
    val height: Float,
    val capacityKg: Int,
    val isOccupied: Boolean,
    val palletType: String
)

/**
 * Tire Drift Skid Mark
 */
data class SkidTrack(
    val startX: Float,
    val startY: Float,
    val endX: Float,
    val endY: Float,
    val angle: Float,
    val intensity: Float
)

/**
 * Procedural Floor Map State & Generator
 */
class ProceduralWarehouseFloor(
    val tileSize: Float = 140f,
    val worldCols: Int = 16,
    val worldRows: Int = 16,
    val seed: Long = 42L
) {
    val tiles = mutableListOf<ProceduralTile>()
    val stagingBays = mutableListOf<StagingBay>()
    val skidTracks = mutableListOf<SkidTrack>()
    val worldWidth = worldCols * tileSize
    val worldHeight = worldRows * tileSize

    init {
        generate(seed)
    }

    fun generate(newSeed: Long) {
        tiles.clear()
        stagingBays.clear()
        skidTracks.clear()
        val random = Random(newSeed)

        // 1. Generate Concrete Expansion Tiles (Płyty posadzki bezspoinowej z dylatacją)
        for (r in 0 until worldRows) {
            for (c in 0 until worldCols) {
                val wx = c * tileSize
                val wy = r * tileSize
                val wear = random.nextFloat() * 0.4f
                val sheen = 0.5f + random.nextFloat() * 0.5f
                val hasCrack = random.nextFloat() < 0.12f
                val crackAng = random.nextFloat() * 2 * PI.toFloat()
                val crackLen = 15f + random.nextFloat() * 35f

                tiles.add(
                    ProceduralTile(
                        col = c,
                        row = r,
                        worldX = wx,
                        worldY = wy,
                        size = tileSize,
                        wearFactor = wear,
                        sheenFactor = sheen,
                        hasCrack = hasCrack,
                        crackAngle = crackAng,
                        crackLength = crackLen,
                        tileId = "DTA-T${c}_${r}"
                    )
                )
            }
        }

        // 2. Generate Pallet Staging Bays (Pola odstawcze P1-P12)
        val bayWidth = tileSize * 1.8f
        val bayHeight = tileSize * 1.2f
        var bayCounter = 1

        for (r in 2 until worldRows - 2 step 3) {
            for (c in 1 until worldCols - 2 step 4) {
                stagingBays.add(
                    StagingBay(
                        bayId = "DTA-P%02d".format(bayCounter++),
                        x = c * tileSize + 20f,
                        y = r * tileSize + 20f,
                        width = bayWidth,
                        height = bayHeight,
                        capacityKg = if (random.nextBoolean()) 1200 else 1500,
                        isOccupied = random.nextFloat() < 0.6f,
                        palletType = if (random.nextBoolean()) "EPAL 1 (1200x800)" else "EPAL 2 (1200x1000)"
                    )
                )
            }
        }

        // 3. Generate Forklift Drift & Skid Tracks (Ślady opon wózków wysokiego składu)
        for (i in 0 until 18) {
            val sx = random.nextFloat() * (worldWidth - 100f) + 50f
            val sy = random.nextFloat() * (worldHeight - 100f) + 50f
            val length = 60f + random.nextFloat() * 120f
            val angle = random.nextFloat() * 2 * PI.toFloat()
            val ex = sx + cos(angle) * length
            val ey = sy + sin(angle) * length

            skidTracks.add(
                SkidTrack(
                    startX = sx,
                    startY = sy,
                    endX = ex,
                    endY = ey,
                    angle = angle,
                    intensity = 0.35f + random.nextFloat() * 0.45f
                )
            )
        }
    }
}

/**
 * Main Composable: High-Performance Procedural Warehouse Floor Tile System
 */
@Composable
fun WarehouseFloorCanvas(
    modifier: Modifier = Modifier,
    sector: TerminalSector = TerminalSector.CROSSDOCK_MAIN,
    isInteractive: Boolean = true,
    showTelemetryOverlay: Boolean = true,
    onTileInspected: ((String) -> Unit)? = null
) {
    var currentSector by remember { mutableStateOf(sector) }
    val floorModel = remember { ProceduralWarehouseFloor(seed = 12345L) }

    // Camera Pan & Zoom Transform State
    var cameraX by remember { mutableFloatStateOf(0f) }
    var cameraY by remember { mutableFloatStateOf(0f) }
    var zoomScale by remember { mutableFloatStateOf(0.85f) }
    var selectedBay by remember { mutableStateOf<StagingBay?>(null) }
    var selectedTileInfo by remember { mutableStateOf<String?>(null) }

    // Ambient Lighting Animation (Industrial Fluorescent Flicker & Strobe)
    val infiniteTransition = rememberInfiniteTransition(label = "ambient_light")
    val lightFlicker by infiniteTransition.animateFloat(
        initialValue = 0.92f,
        targetValue = 1.08f,
        animationSpec = infiniteRepeatable(
            animation = tween(2200, easing = LinearEasing),
            repeatMode = RepeatMode.Reverse
        ),
        label = "light_flicker"
    )

    val strobeAngle by infiniteTransition.animateFloat(
        initialValue = 0f,
        targetValue = 360f,
        animationSpec = infiniteRepeatable(
            animation = tween(3500, easing = LinearEasing),
            repeatMode = RepeatMode.Restart
        ),
        label = "strobe_sweep"
    )

    BoxWithConstraints(
        modifier = modifier
            .fillMaxSize()
            .background(currentSector.floorBaseColor)
            .testTag("warehouse_floor_canvas_container")
    ) {
        val viewWidth = constraints.maxWidth.toFloat()
        val viewHeight = constraints.maxHeight.toFloat()

        Canvas(
            modifier = Modifier
                .fillMaxSize()
                .testTag("warehouse_procedural_floor_canvas")
                .pointerInput(isInteractive) {
                    if (!isInteractive) return@pointerInput
                    detectTransformGestures { _, pan, zoom, _ ->
                        zoomScale = (zoomScale * zoom).coerceIn(0.35f, 2.2f)
                        cameraX += pan.x
                        cameraY += pan.y
                    }
                }
                .pointerInput(isInteractive) {
                    if (!isInteractive) return@pointerInput
                    detectTapGestures { tapOffset ->
                        // Convert screen touch to world coordinates
                        val worldX = (tapOffset.x - cameraX) / zoomScale
                        val worldY = (tapOffset.y - cameraY) / zoomScale

                        // Check if tapped on a staging bay
                        val clickedBay = floorModel.stagingBays.find { bay ->
                            worldX >= bay.x && worldX <= bay.x + bay.width &&
                                    worldY >= bay.y && worldY <= bay.y + bay.height
                        }

                        if (clickedBay != null) {
                            selectedBay = clickedBay
                            val info = "LOKALIZACJA: ${clickedBay.bayId} | PALETY: ${clickedBay.palletType} | MAX: ${clickedBay.capacityKg} kg | STATUS: ${if (clickedBay.isOccupied) "ZAJĘTE" else "WOLNE"}"
                            selectedTileInfo = info
                            onTileInspected?.invoke(info)
                        } else {
                            val col = (worldX / floorModel.tileSize).toInt().coerceIn(0, floorModel.worldCols - 1)
                            val row = (worldY / floorModel.tileSize).toInt().coerceIn(0, floorModel.worldRows - 1)
                            val info = "PŁYTA DYLATACYJNA: DTA-S${col + 1}R${row + 1} | POSADZKA: ŻYWICA EPOKSYDOWA BEZSPOINOWA | NOŚNOŚĆ: 5.0 T/m²"
                            selectedTileInfo = info
                            selectedBay = null
                            onTileInspected?.invoke(info)
                        }
                    }
                }
        ) {
            drawWarehouseFloor(
                floor = floorModel,
                sector = currentSector,
                cameraX = cameraX,
                cameraY = cameraY,
                zoom = zoomScale,
                lightFlicker = lightFlicker,
                strobeAngle = strobeAngle,
                viewW = size.width,
                viewH = size.height,
                selectedBay = selectedBay
            )
        }

        // Tactical Sector Selector and Telemetry Bar (if enabled)
        if (showTelemetryOverlay) {
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .align(Alignment.TopCenter)
                    .padding(12.dp)
            ) {
                // Top Sector Selector Tabs
                Card(
                    colors = CardDefaults.cardColors(
                        containerColor = Color(0xDD0B132B)
                    ),
                    shape = RoundedCornerShape(12.dp),
                    border = CardDefaults.outlinedCardBorder().copy(
                        brush = Brush.horizontalGradient(
                            listOf(currentSector.accentColor.copy(alpha = 0.8f), Color(0xFF1E293B))
                        ),
                        width = 1.5.dp
                    ),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Column(
                        modifier = Modifier.padding(10.dp)
                    ) {
                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.SpaceBetween,
                            modifier = Modifier.fillMaxWidth()
                        ) {
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                Box(
                                    modifier = Modifier
                                        .size(10.dp)
                                        .clip(CircleShape)
                                        .background(currentSector.laneColor)
                                )
                                Spacer(modifier = Modifier.width(8.dp))
                                Text(
                                    text = currentSector.title,
                                    color = Color.White,
                                    fontSize = 13.sp,
                                    fontWeight = FontWeight.Black
                                )
                            }

                            Text(
                                text = "ZOOM: ${(zoomScale * 100).toInt()}%",
                                color = currentSector.accentColor,
                                fontSize = 11.sp,
                                fontFamily = FontFamily.Monospace,
                                fontWeight = FontWeight.Bold
                            )
                        }

                        Text(
                            text = currentSector.subtitle,
                            color = Color(0xFF94A3B8),
                            fontSize = 11.sp,
                            fontWeight = FontWeight.Normal,
                            modifier = Modifier.padding(top = 2.dp, bottom = 8.dp)
                        )

                        // Sector Selection Chips
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.spacedBy(6.dp)
                        ) {
                            TerminalSector.values().forEach { sec ->
                                val isSelected = sec == currentSector
                                Surface(
                                    color = if (isSelected) sec.accentColor.copy(alpha = 0.25f) else Color(0xFF0F172A),
                                    shape = RoundedCornerShape(6.dp),
                                    border = androidx.compose.foundation.BorderStroke(
                                        1.dp,
                                        if (isSelected) sec.accentColor else Color(0xFF334155)
                                    ),
                                    modifier = Modifier
                                        .weight(1f)
                                        .clickable {
                                            currentSector = sec
                                        }
                                        .testTag("sector_chip_${sec.name.lowercase()}")
                                ) {
                                    Text(
                                        text = sec.name.take(4),
                                        color = if (isSelected) Color.White else Color(0xFF94A3B8),
                                        fontSize = 10.sp,
                                        fontWeight = FontWeight.Bold,
                                        textAlign = androidx.compose.ui.text.style.TextAlign.Center,
                                        modifier = Modifier.padding(vertical = 5.dp)
                                    )
                                }
                            }
                        }
                    }
                }

                // Tile Inspection Telemetry Banner
                if (selectedTileInfo != null) {
                    Spacer(modifier = Modifier.height(6.dp))
                    Card(
                        colors = CardDefaults.cardColors(
                            containerColor = Color(0xEE020617)
                        ),
                        shape = RoundedCornerShape(8.dp),
                        border = androidx.compose.foundation.BorderStroke(1.dp, currentSector.laneColor.copy(alpha = 0.6f)),
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            modifier = Modifier.padding(horizontal = 10.dp, vertical = 6.dp)
                        ) {
                            Icon(
                                imageVector = Icons.Default.Info,
                                contentDescription = "Info",
                                tint = currentSector.laneColor,
                                modifier = Modifier.size(16.dp)
                            )
                            Spacer(modifier = Modifier.width(8.dp))
                            Text(
                                text = selectedTileInfo ?: "",
                                color = Color(0xFFF1F5F9),
                                fontSize = 11.sp,
                                fontFamily = FontFamily.Monospace,
                                fontWeight = FontWeight.SemiBold
                            )
                        }
                    }
                }
            }

            // Bottom Right Controls (Reset View, Re-seed)
            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(16.dp),
                contentAlignment = Alignment.BottomEnd
            ) {
                Row(
                    horizontalArrangement = Arrangement.spacedBy(8.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Surface(
                        color = Color(0xDD0F172A),
                        shape = RoundedCornerShape(8.dp),
                        border = androidx.compose.foundation.BorderStroke(1.dp, Color(0xFF38BDF8)),
                        modifier = Modifier.clickable {
                            cameraX = 0f
                            cameraY = 0f
                            zoomScale = 0.85f
                            selectedTileInfo = null
                            selectedBay = null
                        }
                    ) {
                        Row(
                            modifier = Modifier.padding(horizontal = 10.dp, vertical = 6.dp),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Icon(
                                imageVector = Icons.Default.Refresh,
                                contentDescription = "Reset",
                                tint = Color(0xFF38BDF8),
                                modifier = Modifier.size(14.dp)
                            )
                            Spacer(modifier = Modifier.width(4.dp))
                            Text(
                                text = "RESET WIDOKU",
                                color = Color.White,
                                fontSize = 10.5.sp,
                                fontWeight = FontWeight.Bold,
                                fontFamily = FontFamily.Monospace
                            )
                        }
                    }

                    Surface(
                        color = Color(0xDD0F172A),
                        shape = RoundedCornerShape(8.dp),
                        border = androidx.compose.foundation.BorderStroke(1.dp, currentSector.laneColor),
                        modifier = Modifier.clickable {
                            floorModel.generate(Random.nextLong())
                        }
                    ) {
                        Row(
                            modifier = Modifier.padding(horizontal = 10.dp, vertical = 6.dp),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Icon(
                                imageVector = Icons.Default.Layers,
                                contentDescription = "Generate",
                                tint = currentSector.laneColor,
                                modifier = Modifier.size(14.dp)
                            )
                            Spacer(modifier = Modifier.width(4.dp))
                            Text(
                                text = "LOSUJ DTA 8F",
                                color = Color.White,
                                fontSize = 10.5.sp,
                                fontWeight = FontWeight.Bold,
                                fontFamily = FontFamily.Monospace
                            )
                        }
                    }
                }
            }
        }
    }
}

/**
 * Pure Canvas Rendering Function for the Logistics Terminal
 */
fun DrawScope.drawWarehouseFloor(
    floor: ProceduralWarehouseFloor,
    sector: TerminalSector,
    cameraX: Float,
    cameraY: Float,
    zoom: Float,
    lightFlicker: Float,
    strobeAngle: Float,
    viewW: Float,
    viewH: Float,
    selectedBay: StagingBay?
) {
    // Fill overall background
    drawRect(color = sector.floorBaseColor)

    // 1. Render Concrete Tile Grid with Expansion Joints (Dylatacje)
    floor.tiles.forEach { tile ->
        val screenX = tile.worldX * zoom + cameraX
        val screenY = tile.worldY * zoom + cameraY
        val size = tile.size * zoom

        // Culling: only draw visible tiles
        if (screenX + size >= 0 && screenX <= viewW && screenY + size >= 0 && screenY <= viewH) {
            // Subtle per-tile concrete shade variation
            val baseColor = sector.floorBaseColor
            val tileTint = if (tile.sheenFactor > 0.8f) {
                Color(
                    red = (baseColor.red + 0.04f * sector.specularity).coerceIn(0f, 1f),
                    green = (baseColor.green + 0.04f * sector.specularity).coerceIn(0f, 1f),
                    blue = (baseColor.blue + 0.05f * sector.specularity).coerceIn(0f, 1f),
                    alpha = 1.0f
                )
            } else {
                baseColor
            }

            drawRect(
                color = tileTint,
                topLeft = Offset(screenX, screenY),
                size = Size(size, size)
            )

            // Expansion Joint Border (Elastyczna masa dylatacyjna)
            drawRect(
                color = sector.gridColor,
                topLeft = Offset(screenX, screenY),
                size = Size(size, size),
                style = Stroke(width = 1.5f * zoom)
            )

            // Micro hairline crack if tile has wear
            if (tile.hasCrack) {
                val cx = screenX + size * 0.5f
                val cy = screenY + size * 0.5f
                val crackDx = cos(tile.crackAngle) * tile.crackLength * zoom
                val crackDy = sin(tile.crackAngle) * tile.crackLength * zoom

                drawLine(
                    color = Color(0x33000000),
                    start = Offset(cx, cy),
                    end = Offset(cx + crackDx, cy + crackDy),
                    strokeWidth = 1.0f * zoom
                )
            }
        }
    }

    // 2. High-Speed Reach Truck Highway Lines (Główne ciągi komunikacyjne wózków)
    val dashEffect = PathEffect.dashPathEffect(floatArrayOf(24f * zoom, 16f * zoom), 0f)
    val laneStroke = 3.5f * zoom

    // Vertical Transit Corridor 1
    val lane1X = (floor.tileSize * 3.5f) * zoom + cameraX
    if (lane1X >= -50 && lane1X <= viewW + 50) {
        drawLine(
            color = sector.laneColor.copy(alpha = 0.55f),
            start = Offset(lane1X, cameraY),
            end = Offset(lane1X, floor.worldHeight * zoom + cameraY),
            strokeWidth = laneStroke,
            pathEffect = dashEffect
        )
    }

    // Vertical Transit Corridor 2
    val lane2X = (floor.tileSize * 8.5f) * zoom + cameraX
    if (lane2X >= -50 && lane2X <= viewW + 50) {
        drawLine(
            color = sector.laneColor.copy(alpha = 0.55f),
            start = Offset(lane2X, cameraY),
            end = Offset(lane2X, floor.worldHeight * zoom + cameraY),
            strokeWidth = laneStroke,
            pathEffect = dashEffect
        )
    }

    // Horizontal Loading Dock Highway
    val dockLaneY = (floor.tileSize * 1.5f) * zoom + cameraY
    if (dockLaneY >= -50 && dockLaneY <= viewH + 50) {
        drawLine(
            color = sector.laneColor.copy(alpha = 0.65f),
            start = Offset(cameraX, dockLaneY),
            end = Offset(floor.worldWidth * zoom + cameraX, dockLaneY),
            strokeWidth = laneStroke * 1.2f,
            pathEffect = dashEffect
        )
    }

    // 3. Loading Dock Ramp Hazard Chevron Bands (Żółto-czarna jodełka rampowa)
    val rampStartX = (floor.tileSize * 0.5f) * zoom + cameraX
    val rampEndX = (floor.worldWidth - floor.tileSize * 0.5f) * zoom + cameraX
    val rampY = (floor.tileSize * 0.4f) * zoom + cameraY
    val rampH = 22f * zoom

    if (rampY + rampH >= 0 && rampY <= viewH) {
        drawRect(
            color = Color(0xFF0F172A),
            topLeft = Offset(rampStartX, rampY),
            size = Size(rampEndX - rampStartX, rampH)
        )

        // Chevron Stripes
        val chevronStep = 20f * zoom
        var cx = rampStartX
        while (cx < rampEndX) {
            val chevronPath = Path().apply {
                moveTo(cx, rampY)
                lineTo(cx + chevronStep * 0.5f, rampY)
                lineTo(cx + chevronStep * 0.2f, rampY + rampH)
                lineTo(cx - chevronStep * 0.3f, rampY + rampH)
                close()
            }
            drawPath(chevronPath, color = Color(0xFFF59E0B).copy(alpha = 0.85f))
            cx += chevronStep
        }
    }

    // 4. Drift Skid & Forklift Tire Marks
    floor.skidTracks.forEach { skid ->
        val sx = skid.startX * zoom + cameraX
        val sy = skid.startY * zoom + cameraY
        val ex = skid.endX * zoom + cameraX
        val ey = skid.endY * zoom + cameraY

        if (sx in -100f..(viewW + 100f) && sy in -100f..(viewH + 100f)) {
            // Dual wheel tracks
            val trackDist = 14f * zoom
            val perpAngle = skid.angle + PI.toFloat() / 2f
            val offX = cos(perpAngle) * trackDist
            val offY = sin(perpAngle) * trackDist

            // Left tire mark
            drawLine(
                color = Color(0x99050811).copy(alpha = skid.intensity * 0.7f),
                start = Offset(sx - offX, sy - offY),
                end = Offset(ex - offX, ey - offY),
                strokeWidth = 3.5f * zoom,
                cap = StrokeCap.Round
            )
            // Right tire mark
            drawLine(
                color = Color(0x99050811).copy(alpha = skid.intensity * 0.7f),
                start = Offset(sx + offX, sy + offY),
                end = Offset(ex + offX, ey + offY),
                strokeWidth = 3.5f * zoom,
                cap = StrokeCap.Round
            )
        }
    }

    // 5. Pallet Staging Bays (Pola odstawcze z obrysem i oznaczeniem EPAL)
    floor.stagingBays.forEach { bay ->
        val bx = bay.x * zoom + cameraX
        val by = bay.y * zoom + cameraY
        val bw = bay.width * zoom
        val bh = bay.height * zoom

        if (bx + bw >= 0 && bx <= viewW && by + bh >= 0 && by <= viewH) {
            val isSelected = selectedBay == bay

            // Bay Fill Area
            drawRoundRect(
                color = if (isSelected) sector.accentColor.copy(alpha = 0.20f)
                else if (bay.isOccupied) Color(0x331E293B)
                else Color(0x180F172A),
                topLeft = Offset(bx, by),
                size = Size(bw, bh),
                cornerRadius = CornerRadius(4f * zoom, 4f * zoom)
            )

            // Staging Bay Border Demarcation
            drawRoundRect(
                color = if (isSelected) sector.accentColor
                else if (bay.isOccupied) Color(0xFFF59E0B).copy(alpha = 0.7f)
                else Color(0xFF94A3B8).copy(alpha = 0.45f),
                topLeft = Offset(bx, by),
                size = Size(bw, bh),
                cornerRadius = CornerRadius(4f * zoom, 4f * zoom),
                style = Stroke(width = if (isSelected) 2.5f * zoom else 1.8f * zoom)
            )

            // EPAL Pallet footprint indicator if occupied
            if (bay.isOccupied) {
                val palletMargin = 8f * zoom
                val pw = (bw - palletMargin * 3) / 2f
                val ph = bh - palletMargin * 2f

                // Pallet 1 (Left)
                drawRect(
                    color = Color(0x99B45309),
                    topLeft = Offset(bx + palletMargin, by + palletMargin),
                    size = Size(pw, ph)
                )
                drawRect(
                    color = Color(0xFFFDE68A),
                    topLeft = Offset(bx + palletMargin, by + palletMargin),
                    size = Size(pw, ph),
                    style = Stroke(width = 1.2f * zoom)
                )

                // Pallet 2 (Right)
                drawRect(
                    color = Color(0x99B45309),
                    topLeft = Offset(bx + palletMargin * 2 + pw, by + palletMargin),
                    size = Size(pw, ph)
                )
                drawRect(
                    color = Color(0xFFFDE68A),
                    topLeft = Offset(bx + palletMargin * 2 + pw, by + palletMargin),
                    size = Size(pw, ph),
                    style = Stroke(width = 1.2f * zoom)
                )
            }

            // Draw Bay Text Stencil using nativeCanvas
            drawContext.canvas.nativeCanvas.apply {
                val paint = android.graphics.Paint().apply {
                    color = if (isSelected) android.graphics.Color.WHITE else android.graphics.Color.LTGRAY
                    textSize = (10f * zoom).coerceIn(8f, 22f)
                    isFakeBoldText = true
                    isAntiAlias = true
                }
                drawText(bay.bayId, bx + 6f * zoom, by + 14f * zoom, paint)
            }
        }
    }

    // 6. Overhead Industrial Linear Lamp Reflections (Odbicia lamp świetlówkowych)
    val numLampsX = 4
    val numLampsY = 4
    for (ly in 0 until numLampsY) {
        for (lx in 0 until numLampsX) {
            val worldLampX = (lx + 0.5f) * (floor.worldWidth / numLampsX)
            val worldLampY = (ly + 0.5f) * (floor.worldHeight / numLampsY)
            val lampScreenX = worldLampX * zoom + cameraX
            val lampScreenY = worldLampY * zoom + cameraY

            if (lampScreenX in -150f..(viewW + 150f) && lampScreenY in -150f..(viewH + 150f)) {
                val lampRadius = 160f * zoom * lightFlicker
                val lampBrush = Brush.radialGradient(
                    colors = listOf(
                        sector.accentColor.copy(alpha = 0.16f * sector.specularity),
                        Color(0xFF38BDF8).copy(alpha = 0.05f * sector.specularity),
                        Color.Transparent
                    ),
                    center = Offset(lampScreenX, lampScreenY),
                    radius = lampRadius
                )

                drawCircle(
                    brush = lampBrush,
                    radius = lampRadius,
                    center = Offset(lampScreenX, lampScreenY)
                )

                // High-specular core line of the fluorescent tube
                drawLine(
                    color = Color.White.copy(alpha = 0.22f * lightFlicker),
                    start = Offset(lampScreenX - 30f * zoom, lampScreenY),
                    end = Offset(lampScreenX + 30f * zoom, lampScreenY),
                    strokeWidth = 3f * zoom
                )
            }
        }
    }

    // 7. Rotating Emergency Hazard Strobe Light Reflection (Kogut ostrzegawczy DTA)
    val strobeCenterWorldX = floor.worldWidth * 0.5f
    val strobeCenterWorldY = floor.worldHeight * 0.5f
    val strobeScreenX = strobeCenterWorldX * zoom + cameraX
    val strobeScreenY = strobeCenterWorldY * zoom + cameraY

    val rad = strobeAngle * (PI / 180f).toFloat()
    val sweepDist = 280f * zoom
    val sweepX = strobeScreenX + cos(rad) * sweepDist
    val sweepY = strobeScreenY + sin(rad) * sweepDist

    val strobeCone = Path().apply {
        moveTo(strobeScreenX, strobeScreenY)
        lineTo(
            strobeScreenX + cos(rad - 0.35f) * sweepDist,
            strobeScreenY + sin(rad - 0.35f) * sweepDist
        )
        lineTo(
            strobeScreenX + cos(rad + 0.35f) * sweepDist,
            strobeScreenY + sin(rad + 0.35f) * sweepDist
        )
        close()
    }

    drawPath(
        path = strobeCone,
        brush = Brush.radialGradient(
            colors = listOf(
                Color(0xFFF59E0B).copy(alpha = 0.22f),
                Color(0xFFF59E0B).copy(alpha = 0.04f),
                Color.Transparent
            ),
            center = Offset(strobeScreenX, strobeScreenY),
            radius = sweepDist
        )
    )

    // Strobe center bulb
    drawCircle(
        color = Color(0xFFF59E0B).copy(alpha = 0.8f),
        radius = 5f * zoom,
        center = Offset(strobeScreenX, strobeScreenY)
    )

    // 8. Perimeter Industrial Edge Ambient Occlusion (Cieniowanie krawędzi hali)
    val wallThickness = 6f * zoom
    drawRect(
        color = Color(0xFF020617),
        topLeft = Offset(cameraX, cameraY),
        size = Size(floor.worldWidth * zoom, floor.worldHeight * zoom),
        style = Stroke(width = wallThickness)
    )
}
