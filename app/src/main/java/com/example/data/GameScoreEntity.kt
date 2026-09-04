package com.example.data

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "game_scores")
data class GameScoreEntity(
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    val score: Int,
    val kills: Int,
    val level: Int,
    val survivalTimeSeconds: Int,
    val shiftTimeFormatted: String,
    val isWin: Boolean,
    val timestamp: Long = System.currentTimeMillis()
)
