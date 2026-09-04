package com.example.ui

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.core.FastOutSlowInEasing
import androidx.compose.animation.core.RepeatMode
import androidx.compose.animation.core.animateFloat
import androidx.compose.animation.core.infiniteRepeatable
import androidx.compose.animation.core.rememberInfiniteTransition
import androidx.compose.animation.core.tween
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.animation.scaleIn
import androidx.compose.animation.scaleOut
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
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.AutoAwesome
import androidx.compose.material.icons.filled.Close
import androidx.compose.material.icons.filled.FastForward
import androidx.compose.material.icons.filled.Info
import androidx.compose.material.icons.filled.Refresh
import androidx.compose.material.icons.filled.Star
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.ScrollableTabRow
import androidx.compose.material3.Tab
import androidx.compose.material3.TabRowDefaults
import androidx.compose.material3.TabRowDefaults.tabIndicatorOffset
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
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.data.CardRarity
import com.example.data.CardType
import com.example.data.UpgradeCard
import com.example.data.UpgradeCardPool

@Composable
fun CardSelectionComposeScreen(
    currentLevel: Int = 1,
    initialCards: List<UpgradeCard> = remember { UpgradeCardPool.getRandomCards(3) },
    onCardSelected: (UpgradeCard) -> Unit,
    onClose: () -> Unit,
    modifier: Modifier = Modifier
) {
    var cards by remember(currentLevel) { mutableStateOf(UpgradeCardPool.getRandomCards(3)) }
    var rerollsLeft by remember(currentLevel) { mutableIntStateOf(2) }
    var selectedCardId by remember(currentLevel) { mutableStateOf<String?>(null) }
    var inspectedCard by remember { mutableStateOf<UpgradeCard?>(null) }
    var selectedFilterIndex by remember { mutableIntStateOf(0) }

    val filterTypes = listOf<CardType?>(null, CardType.ACTIVE, CardType.PASSIVE, CardType.EVOLUTION, CardType.DEBUFF)
    val filterNames = listOf("WSZYSTKIE", "UZBROJENIE", "SYSTEMY", "PROTOKOŁY", "RYZYKO")

    val infiniteTransition = rememberInfiniteTransition(label = "CardGlow")
    val glowAlpha by infiniteTransition.animateFloat(
        initialValue = 0.45f,
        targetValue = 0.95f,
        animationSpec = infiniteRepeatable(
            animation = tween(durationMillis = 1100, easing = FastOutSlowInEasing),
            repeatMode = RepeatMode.Reverse
        ),
        label = "Glow"
    )

    val bgOffset by infiniteTransition.animateFloat(
        initialValue = 0f,
        targetValue = 2000f,
        animationSpec = infiniteRepeatable(
            animation = tween(20000, easing = androidx.compose.animation.core.LinearEasing),
            repeatMode = RepeatMode.Restart
        ),
        label = "BgOffset"
    )

    Box(
        modifier = modifier
            .fillMaxSize()
            .background(
                Brush.linearGradient(
                    colors = listOf(Color(0xFF070B12), Color(0xFF0F172A), Color(0xFF070B12)),
                    start = androidx.compose.ui.geometry.Offset(bgOffset, 0f),
                    end = androidx.compose.ui.geometry.Offset(bgOffset + 1000f, 1000f),
                    tileMode = androidx.compose.ui.graphics.TileMode.Mirror
                )
            )
            .padding(14.dp)
            .testTag("card_selection_compose_screen"),
        contentAlignment = Alignment.Center
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .verticalScroll(rememberScrollState()),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            // HEADER TITLE BANNER
            Row(
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.Center,
                modifier = Modifier
                    .background(Color(0xFF0F172A), RoundedCornerShape(12.dp))
                    .border(1.5.dp, Color(0xFF38BDF8), RoundedCornerShape(12.dp))
                    .padding(horizontal = 14.dp, vertical = 6.dp)
            ) {
                Icon(
                    imageVector = Icons.Default.AutoAwesome,
                    contentDescription = "Awans",
                    tint = Color(0xFFFBBF24),
                    modifier = Modifier.size(18.dp)
                )
                Spacer(modifier = Modifier.width(6.dp))
                Text(
                    text = "MODUŁ BOJOWY // POZIOM TAKTYCZNY $currentLevel",
                    color = Color(0xFF38BDF8),
                    fontSize = 12.sp,
                    fontWeight = FontWeight.Black,
                    letterSpacing = 0.8.sp
                )
            }

            Spacer(modifier = Modifier.height(6.dp))

            Text(
                text = "Wybierz ulepszenie systemów operacyjnych wózka:",
                color = Color(0xFF94A3B8),
                fontSize = 11.sp,
                fontWeight = FontWeight.Medium,
                textAlign = TextAlign.Center
            )

            Spacer(modifier = Modifier.height(10.dp))

            // CATEGORY FILTER TABS
            ScrollableTabRow(
                selectedTabIndex = selectedFilterIndex,
                containerColor = Color(0xFF0F172A),
                contentColor = Color(0xFF38BDF8),
                edgePadding = 0.dp,
                modifier = Modifier
                    .fillMaxWidth()
                    .clip(RoundedCornerShape(10.dp))
                    .border(1.dp, Color(0xFF334155), RoundedCornerShape(10.dp))
            ) {
                filterNames.forEachIndexed { index, title ->
                    Tab(
                        selected = selectedFilterIndex == index,
                        onClick = {
                            selectedFilterIndex = index
                            val filter = filterTypes[index]
                            cards = UpgradeCardPool.getRandomCards(3, filter)
                        },
                        text = {
                            Text(
                                text = title,
                                fontSize = 11.sp,
                                fontWeight = if (selectedFilterIndex == index) FontWeight.Black else FontWeight.Normal,
                                color = if (selectedFilterIndex == index) Color(0xFF38BDF8) else Color(0xFF94A3B8)
                            )
                        }
                    )
                }
            }

            Spacer(modifier = Modifier.height(12.dp))

            // 3 CARDS CONTAINER
            Column(
                modifier = Modifier.fillMaxWidth(),
                verticalArrangement = Arrangement.spacedBy(10.dp)
            ) {
                cards.forEach { card ->
                    val isSelected = card.id == selectedCardId
                    UpgradeCardItem(
                        card = card,
                        isSelected = isSelected,
                        glowAlpha = glowAlpha,
                        onSelect = {
                            selectedCardId = card.id
                            onCardSelected(card)
                        },
                        onInspect = {
                            inspectedCard = card
                        }
                    )
                }
            }

            Spacer(modifier = Modifier.height(14.dp))

            // ACTION BUTTONS (REROLL & SKIP)
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(10.dp)
            ) {
                // REROLL BUTTON
                OutlinedButton(
                    onClick = {
                        if (rerollsLeft > 0) {
                            rerollsLeft--
                            val filter = filterTypes[selectedFilterIndex]
                            cards = UpgradeCardPool.getRandomCards(3, filter)
                        }
                    },
                    enabled = rerollsLeft > 0,
                    modifier = Modifier
                        .weight(1f)
                        .height(46.dp)
                        .testTag("btn_reroll_compose"),
                    shape = RoundedCornerShape(10.dp),
                    colors = ButtonDefaults.outlinedButtonColors(
                        contentColor = Color(0xFF38BDF8)
                    ),
                    border = androidx.compose.foundation.BorderStroke(
                        width = 1.5.dp,
                        color = if (rerollsLeft > 0) Color(0xFF38BDF8) else Color(0xFF64748B)
                    )
                ) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Icon(
                            imageVector = Icons.Default.Refresh,
                            contentDescription = "Reroll",
                            modifier = Modifier.size(16.dp)
                        )
                        Spacer(modifier = Modifier.width(4.dp))
                        Text(
                            text = if (rerollsLeft > 0) "PRZELOSUJ ($rerollsLeft)" else "BRAK REROLLI",
                            fontSize = 11.sp,
                            fontWeight = FontWeight.Black
                        )
                    }
                }

                // SKIP BUTTON
                Button(
                    onClick = { onClose() },
                    modifier = Modifier
                        .weight(1f)
                        .height(46.dp)
                        .testTag("btn_skip_compose"),
                    shape = RoundedCornerShape(10.dp),
                    colors = ButtonDefaults.buttonColors(
                        containerColor = Color(0xFF3F3F46)
                    ),
                    border = androidx.compose.foundation.BorderStroke(1.5.dp, Color(0xFFEAB308))
                ) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Icon(
                            imageVector = Icons.Default.FastForward,
                            contentDescription = "Skip",
                            tint = Color(0xFFFACC15),
                            modifier = Modifier.size(16.dp)
                        )
                        Spacer(modifier = Modifier.width(4.dp))
                        Text(
                            text = "POMIŃ (+50💰)",
                            color = Color(0xFFFACC15),
                            fontSize = 11.sp,
                            fontWeight = FontWeight.Black
                        )
                    }
                }
            }
        }

        // INSPECTOR MODAL DIALOG
        inspectedCard?.let { card ->
            CardInspectorModal(
                card = card,
                onDismiss = { inspectedCard = null },
                onSelect = {
                    onCardSelected(card)
                    inspectedCard = null
                }
            )
        }
    }
}

@Composable
fun UpgradeCardItem(
    card: UpgradeCard,
    isSelected: Boolean,
    glowAlpha: Float,
    onSelect: () -> Unit,
    onInspect: () -> Unit
) {
    val typeColor = Color(card.cardType.colorHex)

    val bgGradient = when (card.cardType) {
        CardType.ACTIVE -> listOf(Color(0xFF0E7490).copy(alpha = 0.45f), Color(0xFF0F172A))
        CardType.PASSIVE -> listOf(Color(0xFF15803D).copy(alpha = 0.45f), Color(0xFF0F172A))
        CardType.EVOLUTION -> listOf(Color(0xFFB45309).copy(alpha = 0.65f), Color(0xFF1E3A8A).copy(alpha = 0.95f))
        CardType.DEBUFF -> listOf(Color(0xFF991B1B).copy(alpha = 0.45f), Color(0xFF0F172A))
    }

    Card(
        modifier = Modifier
            .fillMaxWidth()
            .shadow(
                elevation = if (isSelected || card.cardType == CardType.EVOLUTION) 12.dp else 4.dp,
                shape = RoundedCornerShape(14.dp),
                spotColor = typeColor
            )
            .border(
                width = if (isSelected) 2.5.dp else 1.5.dp,
                color = typeColor.copy(alpha = if (isSelected) 1f else glowAlpha),
                shape = RoundedCornerShape(14.dp)
            )
            .clickable { onSelect() }
            .testTag("upgrade_card_${card.id}"),
        colors = CardDefaults.cardColors(
            containerColor = Color(0xFF0F172A)
        ),
        shape = RoundedCornerShape(14.dp)
    ) {
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .background(Brush.linearGradient(bgGradient))
                .padding(12.dp)
        ) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                verticalAlignment = Alignment.CenterVertically
            ) {
                // ICON WRAPPER
                Box(
                    modifier = Modifier
                        .size(48.dp)
                        .clip(RoundedCornerShape(12.dp))
                        .background(Color(0xFF070B12))
                        .border(1.dp, typeColor.copy(alpha = 0.6f), RoundedCornerShape(12.dp)),
                    contentAlignment = Alignment.Center
                ) {
                    Text(
                        text = card.icon,
                        fontSize = 26.sp
                    )
                }

                Spacer(modifier = Modifier.width(10.dp))

                // CARD DETAILS
                Column(modifier = Modifier.weight(1f)) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        // TYPE BADGE
                        Box(
                            modifier = Modifier
                                .background(typeColor.copy(alpha = 0.2f), RoundedCornerShape(4.dp))
                                .border(1.dp, typeColor.copy(alpha = 0.5f), RoundedCornerShape(4.dp))
                                .padding(horizontal = 6.dp, vertical = 2.dp)
                        ) {
                            Text(
                                text = "${card.cardType.icon} ${card.cardType.label}",
                                color = typeColor,
                                fontSize = 9.sp,
                                fontWeight = FontWeight.Black
                            )
                        }

                        Row(verticalAlignment = Alignment.CenterVertically) {
                            // RARITY BADGE
                            Text(
                                text = card.rarity.label,
                                color = Color(card.rarity.colorHex),
                                fontSize = 9.sp,
                                fontWeight = FontWeight.Black,
                                letterSpacing = 0.5.sp
                            )
                            Spacer(modifier = Modifier.width(6.dp))
                            // INSPECT INFO BUTTON
                            Icon(
                                imageVector = Icons.Default.Info,
                                contentDescription = "Inspect",
                                tint = Color(0xFF94A3B8),
                                modifier = Modifier
                                    .size(16.dp)
                                    .clickable { onInspect() }
                            )
                        }
                    }

                    Spacer(modifier = Modifier.height(3.dp))

                    Text(
                        text = card.title,
                        color = Color(0xFFF8FAFC),
                        fontSize = 14.sp,
                        fontWeight = FontWeight.Black
                    )

                    Text(
                        text = card.description,
                        color = Color(0xFFCBD5E1),
                        fontSize = 11.5.sp,
                        lineHeight = 15.sp,
                        fontWeight = FontWeight.Normal
                    )

                    Spacer(modifier = Modifier.height(4.dp))

                    // STAT BONUS
                    Text(
                        text = card.statBonus,
                        color = if (card.cardType == CardType.PASSIVE) Color(0xFF4ADE80) else Color(0xFF38BDF8),
                        fontSize = 11.sp,
                        fontWeight = FontWeight.Bold
                    )

                    // DEBUFF PENALTY (IF ANY)
                    if (card.debuffPenalty != null) {
                        Text(
                            text = card.debuffPenalty,
                            color = Color(0xFFFCA5A5),
                            fontSize = 10.5.sp,
                            fontWeight = FontWeight.ExtraBold
                        )
                    }

                    // SYNERGY REQUIREMENT (IF ANY)
                    if (card.synergyReq != null) {
                        Text(
                            text = "🔗 ${card.synergyReq}",
                            color = Color(0xFFFDE047),
                            fontSize = 10.sp,
                            fontWeight = FontWeight.Bold
                        )
                    }
                }
            }
        }
    }
}

@Composable
fun CardInspectorModal(
    card: UpgradeCard,
    onDismiss: () -> Unit,
    onSelect: () -> Unit
) {
    val typeColor = Color(card.cardType.colorHex)

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(Color.Black.copy(alpha = 0.75f))
            .clickable { onDismiss() }
            .padding(24.dp),
        contentAlignment = Alignment.Center
    ) {
        Card(
            modifier = Modifier
                .fillMaxWidth()
                .border(2.dp, typeColor, RoundedCornerShape(16.dp))
                .clickable(enabled = false) {},
            colors = CardDefaults.cardColors(containerColor = Color(0xFF0F172A)),
            shape = RoundedCornerShape(16.dp)
        ) {
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(20.dp),
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = "🔍 INSPEKTOR KARTY",
                        color = typeColor,
                        fontSize = 12.sp,
                        fontWeight = FontWeight.Black
                    )
                    IconButton(onClick = onDismiss, modifier = Modifier.size(24.dp)) {
                        Icon(imageVector = Icons.Default.Close, contentDescription = "Zamknij", tint = Color.White)
                    }
                }

                Spacer(modifier = Modifier.height(12.dp))

                Box(
                    modifier = Modifier
                        .size(64.dp)
                        .clip(RoundedCornerShape(16.dp))
                        .background(Color(0xFF070B12))
                        .border(2.dp, typeColor, RoundedCornerShape(16.dp)),
                    contentAlignment = Alignment.Center
                ) {
                    Text(text = card.icon, fontSize = 36.sp)
                }

                Spacer(modifier = Modifier.height(10.dp))

                Text(
                    text = card.title,
                    color = Color.White,
                    fontSize = 18.sp,
                    fontWeight = FontWeight.Black,
                    textAlign = TextAlign.Center
                )

                Text(
                    text = "${card.cardType.icon} ${card.cardType.label} • ${card.rarity.label}",
                    color = Color(card.rarity.colorHex),
                    fontSize = 12.sp,
                    fontWeight = FontWeight.Bold
                )

                Spacer(modifier = Modifier.height(12.dp))

                Text(
                    text = card.description,
                    color = Color(0xFFCBD5E1),
                    fontSize = 13.sp,
                    textAlign = TextAlign.Center,
                    lineHeight = 18.sp
                )

                Spacer(modifier = Modifier.height(12.dp))

                // LEVEL PROGRESSION STARS
                Row(
                    horizontalArrangement = Arrangement.Center,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    for (i in 1..card.maxLevel) {
                        Icon(
                            imageVector = Icons.Default.Star,
                            contentDescription = "Star",
                            tint = if (i <= card.currentLevel) Color(0xFFFACC15) else Color(0xFF475569),
                            modifier = Modifier.size(18.dp)
                        )
                    }
                }

                Spacer(modifier = Modifier.height(12.dp))

                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .background(Color(0xFF1E293B), RoundedCornerShape(8.dp))
                        .padding(10.dp)
                ) {
                    Column {
                        Text(text = "⚡ EFEKT I PREMIE STATYSTYK:", color = Color(0xFF94A3B8), fontSize = 10.sp, fontWeight = FontWeight.Bold)
                        Text(text = card.statBonus, color = Color(0xFF38BDF8), fontSize = 12.sp, fontWeight = FontWeight.Black)
                        if (card.debuffPenalty != null) {
                            Spacer(modifier = Modifier.height(4.dp))
                            Text(text = card.debuffPenalty, color = Color(0xFFEF4444), fontSize = 11.sp, fontWeight = FontWeight.Black)
                        }
                        if (card.synergyReq != null) {
                            Spacer(modifier = Modifier.height(4.dp))
                            Text(text = "🔗 SYNERGIA: ${card.synergyReq}", color = Color(0xFFFDE047), fontSize = 11.sp, fontWeight = FontWeight.Bold)
                        }
                    }
                }

                Spacer(modifier = Modifier.height(16.dp))

                Button(
                    onClick = onSelect,
                    modifier = Modifier.fillMaxWidth().height(44.dp),
                    shape = RoundedCornerShape(10.dp),
                    colors = ButtonDefaults.buttonColors(containerColor = typeColor)
                ) {
                    Text(text = "WYBIERZ TĘ KARTĘ", color = Color.Black, fontWeight = FontWeight.Black)
                }
            }
        }
    }
}
