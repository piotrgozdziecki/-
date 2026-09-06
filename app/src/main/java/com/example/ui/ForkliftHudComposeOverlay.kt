package com.example.ui

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.animateColorAsState
import androidx.compose.animation.core.FastOutSlowInEasing
import androidx.compose.animation.core.LinearEasing
import androidx.compose.animation.core.RepeatMode
import androidx.compose.animation.core.animateFloat
import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.animation.core.infiniteRepeatable
import androidx.compose.animation.core.rememberInfiniteTransition
import androidx.compose.animation.core.tween
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.Image
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
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.statusBarsPadding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.layout.widthIn
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.R
import com.example.data.AndroidGameBridge
import com.example.data.HudTelemetryState

@Composable
fun ForkliftHudComposeOverlay(
    bridge: AndroidGameBridge?,
    modifier: Modifier = Modifier,
    isVisible: Boolean = true
) {
    if (!isVisible || bridge == null) return

    val hudState by bridge.hudState.collectAsState()

    // Smooth telemetry animation values
    val animatedXp by animateFloatAsState(
        targetValue = hudState.xpProgress,
        animationSpec = tween(durationMillis = 200, easing = FastOutSlowInEasing),
        label = "xpAnim"
    )

    val animatedBattery by animateFloatAsState(
        targetValue = hudState.batteryPct,
        animationSpec = tween(durationMillis = 250, easing = FastOutSlowInEasing),
        label = "batteryAnim"
    )

    val infiniteTransition = rememberInfiniteTransition(label = "pulseTransition")
    val alertAlpha by infiniteTransition.animateFloat(
        initialValue = 0.4f,
        targetValue = 1.0f,
        animationSpec = infiniteRepeatable(
            animation = tween(450, easing = LinearEasing),
            repeatMode = RepeatMode.Reverse
        ),
        label = "alertAlpha"
    )

    val batteryColor by animateColorAsState(
        targetValue = when {
            hudState.batteryPct > 50f -> Color(0xFF22C55E) // Lime Green
            hudState.batteryPct > 25f -> Color(0xFFF59E0B) // Amber
            else -> Color(0xFFEF4444) // Emergency Red
        },
        animationSpec = tween(300),
        label = "batteryColor"
    )

    Box(
        modifier = modifier
            .fillMaxWidth()
            .statusBarsPadding()
            .padding(horizontal = 8.dp, vertical = 4.dp),
        contentAlignment = Alignment.TopCenter
    ) {
        Column(
            modifier = Modifier.fillMaxWidth(),
            verticalArrangement = Arrangement.spacedBy(4.dp)
        ) {
            // 1. TOP EDGE-TO-EDGE XP & SHIFT LEVEL PROGRESS BAR
            XpLevelProgressBar(
                level = hudState.level,
                xpProgress = animatedXp,
                modifier = Modifier
                    .fillMaxWidth()
                    .testTag("compose_xp_bar")
            )

            // 2. MAIN INDUSTRIAL TELEMETRY GRID (Auto-scaled for Poco F6 / 120 FPS)
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                // Left Block: Toyota BT Reflex 48V Battery & Vehicle Status
                ToyotaBatteryStatusCard(
                    batteryPct = animatedBattery,
                    voltageText = hudState.voltageText,
                    batteryColor = batteryColor,
                    isLowBattery = hudState.isLowBattery,
                    alertAlpha = alertAlpha,
                    modifier = Modifier
                        .weight(1.3f)
                        .testTag("compose_battery_card")
                )

                Spacer(modifier = Modifier.width(6.dp))

                // Center Block: Current Weapon / Industrial Tool Deck
                ActiveWeaponStatusCard(
                    weaponName = hudState.weaponName,
                    weaponLevel = hudState.weaponLevel,
                    weaponIcon = hudState.weaponIcon,
                    modifier = Modifier
                        .weight(1.3f)
                        .testTag("compose_weapon_card")
                )

                Spacer(modifier = Modifier.width(6.dp))

                // Right Block: Shift Sector, Clock & Dispatched Units
                ShiftTelemetryCard(
                    sector = hudState.sector,
                    shiftTime = hudState.shiftTime,
                    kills = hudState.kills,
                    comboCount = hudState.comboCount,
                    comboMultiplier = hudState.comboMultiplier,
                    onPauseClick = { bridge.togglePauseInGame() },
                    onZoomClick = { bridge.toggleZoomInGame() },
                    onFpsClick = { bridge.toggleFpsInGame() },
                    modifier = Modifier
                        .weight(1.6f)
                        .testTag("compose_shift_card")
                )
            }

            // 3. HORDE PROXIMITY RADAR STRIP (if active threat)
            AnimatedVisibility(
                visible = hudState.threatLevel != "CZYSTY",
                enter = fadeIn(tween(200)),
                exit = fadeOut(tween(200))
            ) {
                ThreatRadarStrip(
                    threatLevel = hudState.threatLevel,
                    threatDistance = hudState.threatDistance,
                    alertAlpha = alertAlpha,
                    modifier = Modifier
                        .fillMaxWidth()
                        .testTag("compose_threat_radar")
                )
            }
        }
    }
}

@Composable
private fun XpLevelProgressBar(
    level: Int,
    xpProgress: Float,
    modifier: Modifier = Modifier
) {
    Surface(
        modifier = modifier
            .height(18.dp)
            .clip(RoundedCornerShape(3.dp))
            .border(1.dp, Color(0xFF0284C7).copy(alpha = 0.6f), RoundedCornerShape(3.dp)),
        color = Color(0xDD030712)
    ) {
        Box(modifier = Modifier.fillMaxSize()) {
            // Animated XP Fill Gradient
            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .fillMaxWidth(xpProgress)
                    .background(
                        Brush.horizontalGradient(
                            colors = listOf(
                                Color(0xFF0284C7),
                                Color(0xFF38BDF8),
                                Color(0xFFF59E0B)
                            )
                        )
                    )
            )

            // Text Label Overlay
            Row(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(horizontal = 6.dp),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Text(
                    text = "DTA LOGISTICS SYSTEM",
                    color = Color(0xFF94A3B8),
                    fontSize = 9.sp,
                    fontFamily = FontFamily.Monospace,
                    fontWeight = FontWeight.Bold,
                    letterSpacing = 0.5.sp
                )
                Text(
                    text = "POZIOM OPERATORA: $level",
                    color = Color(0xFFFEF08A),
                    fontSize = 10.sp,
                    fontFamily = FontFamily.Monospace,
                    fontWeight = FontWeight.Black,
                    letterSpacing = 0.5.sp
                )
                Text(
                    text = "${(xpProgress * 100).toInt()}%",
                    color = Color(0xFFF8FAFC),
                    fontSize = 9.sp,
                    fontFamily = FontFamily.Monospace,
                    fontWeight = FontWeight.Bold
                )
            }
        }
    }
}

@Composable
private fun ToyotaBatteryStatusCard(
    batteryPct: Float,
    voltageText: String,
    batteryColor: Color,
    isLowBattery: Boolean,
    alertAlpha: Float,
    modifier: Modifier = Modifier
) {
    Card(
        modifier = modifier
            .shadow(4.dp, RoundedCornerShape(4.dp)),
        colors = CardDefaults.cardColors(
            containerColor = if (isLowBattery) Color(0xEE1E1111) else Color(0xDD090D16)
        ),
        shape = RoundedCornerShape(4.dp),
        border = BorderStroke(
            1.dp,
            if (isLowBattery) Color(0xFFEF4444).copy(alpha = alertAlpha) else Color(0xFF38BDF8).copy(alpha = 0.35f)
        )
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 6.dp, vertical = 4.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(5.dp)
        ) {
            // Toyota Forklift Mini Thumbnail Avatar
            Image(
                painter = painterResource(id = R.drawable.img_toyota_bt_reflex),
                contentDescription = "Toyota BT Reflex",
                contentScale = ContentScale.Crop,
                modifier = Modifier
                    .size(26.dp)
                    .clip(RoundedCornerShape(3.dp))
                    .border(1.dp, Color(0xFFF97316), RoundedCornerShape(3.dp))
            )

            Column(modifier = Modifier.weight(1f)) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = "BT 48V",
                        color = Color(0xFFF97316),
                        fontSize = 9.sp,
                        fontFamily = FontFamily.Monospace,
                        fontWeight = FontWeight.Black
                    )
                    Text(
                        text = "${batteryPct.toInt()}%",
                        color = batteryColor,
                        fontSize = 10.sp,
                        fontFamily = FontFamily.Monospace,
                        fontWeight = FontWeight.Black
                    )
                }

                // Battery Gauge Fill
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(5.dp)
                        .clip(RoundedCornerShape(2.dp))
                        .background(Color(0xFF1E293B))
                ) {
                    Box(
                        modifier = Modifier
                            .fillMaxWidth(batteryPct / 100f)
                            .height(5.dp)
                            .background(batteryColor)
                    )
                }

                Text(
                    text = voltageText,
                    color = Color(0xFF64748B),
                    fontSize = 8.sp,
                    fontFamily = FontFamily.Monospace,
                    fontWeight = FontWeight.Bold
                )
            }
        }
    }
}

@Composable
private fun ActiveWeaponStatusCard(
    weaponName: String,
    weaponLevel: Int,
    weaponIcon: String,
    modifier: Modifier = Modifier
) {
    Card(
        modifier = modifier.shadow(4.dp, RoundedCornerShape(4.dp)),
        colors = CardDefaults.cardColors(containerColor = Color(0xDD090D16)),
        shape = RoundedCornerShape(4.dp),
        border = BorderStroke(1.dp, Color(0xFF0284C7).copy(alpha = 0.35f))
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 6.dp, vertical = 4.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(5.dp)
        ) {
            // Weapon Icon Badge
            Box(
                modifier = Modifier
                    .size(26.dp)
                    .background(Color(0xFF0F172A), RoundedCornerShape(3.dp))
                    .border(1.dp, Color(0xFF0284C7), RoundedCornerShape(3.dp)),
                contentAlignment = Alignment.Center
            ) {
                Text(
                    text = weaponIcon.ifBlank { "⚡" },
                    fontSize = 14.sp
                )
            }

            Column(modifier = Modifier.weight(1f)) {
                Text(
                    text = weaponName.uppercase(),
                    color = Color(0xFF38BDF8),
                    fontSize = 9.sp,
                    fontFamily = FontFamily.Monospace,
                    fontWeight = FontWeight.Black,
                    maxLines = 1,
                    overflow = TextOverflow.Ellipsis
                )

                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = "TIER $weaponLevel",
                        color = Color(0xFFFEF08A),
                        fontSize = 8.sp,
                        fontFamily = FontFamily.Monospace,
                        fontWeight = FontWeight.Bold
                    )
                    Text(
                        text = "DPS ACTIVE",
                        color = Color(0xFF22C55E),
                        fontSize = 8.sp,
                        fontFamily = FontFamily.Monospace,
                        fontWeight = FontWeight.Bold
                    )
                }
            }
        }
    }
}

@Composable
private fun ShiftTelemetryCard(
    sector: String,
    shiftTime: String,
    kills: Int,
    comboCount: Int,
    comboMultiplier: Float,
    onPauseClick: () -> Unit,
    onZoomClick: () -> Unit,
    onFpsClick: () -> Unit,
    modifier: Modifier = Modifier
) {
    Card(
        modifier = modifier.shadow(4.dp, RoundedCornerShape(4.dp)),
        colors = CardDefaults.cardColors(containerColor = Color(0xDD090D16)),
        shape = RoundedCornerShape(4.dp),
        border = BorderStroke(1.dp, Color(0xFFF59E0B).copy(alpha = 0.35f))
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 6.dp, vertical = 3.dp),
            verticalArrangement = Arrangement.spacedBy(2.dp)
        ) {
            // Row 1: Sector, Time, Kills
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = sector,
                    color = Color(0xFFFEF08A),
                    fontSize = 9.sp,
                    fontFamily = FontFamily.Monospace,
                    fontWeight = FontWeight.Black
                )
                Text(
                    text = shiftTime,
                    color = Color(0xFF38BDF8),
                    fontSize = 9.sp,
                    fontFamily = FontFamily.Monospace,
                    fontWeight = FontWeight.Black
                )
                Text(
                    text = "DISP: $kills",
                    color = Color(0xFFFCA5A5),
                    fontSize = 9.sp,
                    fontFamily = FontFamily.Monospace,
                    fontWeight = FontWeight.Black
                )
            }

            // Row 2: Combo & Action Buttons
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                // Combo Badge
                Surface(
                    shape = RoundedCornerShape(2.dp),
                    color = if (comboCount > 5) Color(0xFFB45309) else Color(0xFF1E293B),
                    border = BorderStroke(
                        0.5.dp,
                        if (comboCount > 5) Color(0xFFF59E0B) else Color(0xFF475569)
                    )
                ) {
                    Text(
                        text = "x$comboCount (${String.format("%.1f", comboMultiplier)}X)",
                        color = Color(0xFFFEF08A),
                        fontSize = 8.sp,
                        fontFamily = FontFamily.Monospace,
                        fontWeight = FontWeight.Black,
                        modifier = Modifier.padding(horizontal = 4.dp, vertical = 1.dp)
                    )
                }

                // Interactive Quick Actions
                Row(horizontalArrangement = Arrangement.spacedBy(3.dp)) {
                    HudActionButton(
                        label = "CAM",
                        color = Color(0xFF38BDF8),
                        onClick = onZoomClick,
                        testTag = "btn_hud_cam"
                    )
                    HudActionButton(
                        label = "120FPS",
                        color = Color(0xFF22C55E),
                        onClick = onFpsClick,
                        testTag = "btn_hud_fps"
                    )
                    HudActionButton(
                        label = "PAUSE",
                        color = Color(0xFFA855F7),
                        onClick = onPauseClick,
                        testTag = "btn_hud_pause"
                    )
                }
            }
        }
    }
}

@Composable
private fun HudActionButton(
    label: String,
    color: Color,
    onClick: () -> Unit,
    testTag: String
) {
    Surface(
        modifier = Modifier
            .clickable(onClick = onClick)
            .testTag(testTag),
        shape = RoundedCornerShape(2.dp),
        color = Color(0xFF0F172A),
        border = BorderStroke(0.5.dp, color)
    ) {
        Text(
            text = label,
            color = color,
            fontSize = 8.sp,
            fontFamily = FontFamily.Monospace,
            fontWeight = FontWeight.Black,
            modifier = Modifier.padding(horizontal = 4.dp, vertical = 2.dp)
        )
    }
}

@Composable
private fun ThreatRadarStrip(
    threatLevel: String,
    threatDistance: Float,
    alertAlpha: Float,
    modifier: Modifier = Modifier
) {
    Surface(
        modifier = modifier
            .height(18.dp)
            .clip(RoundedCornerShape(3.dp))
            .border(
                1.dp,
                Color(0xFFEF4444).copy(alpha = alertAlpha),
                RoundedCornerShape(3.dp)
            ),
        color = Color(0xEE1E0B0B)
    ) {
        Row(
            modifier = Modifier
                .fillMaxSize()
                .padding(horizontal = 8.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.SpaceBetween
        ) {
            Row(
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy(4.dp)
            ) {
                Box(
                    modifier = Modifier
                        .size(6.dp)
                        .background(Color(0xFFEF4444), CircleShape)
                )
                Text(
                    text = "RADAR ZAGROŻENIA: $threatLevel",
                    color = Color(0xFFFCA5A5),
                    fontSize = 9.sp,
                    fontFamily = FontFamily.Monospace,
                    fontWeight = FontWeight.Black
                )
            }
            Text(
                text = "DYSTANS: ${threatDistance.toInt()}M",
                color = Color(0xFFFEF08A),
                fontSize = 9.sp,
                fontFamily = FontFamily.Monospace,
                fontWeight = FontWeight.Bold
            )
        }
    }
}
