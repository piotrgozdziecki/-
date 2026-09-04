package com.example.data

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "achievements")
data class AchievementEntity(
    @PrimaryKey val key: String,
    val title: String,
    val description: String,
    val icon: String,
    val isSecret: Boolean,
    val unlocked: Boolean = false,
    val unlockedAtTimestamp: Long? = null
)
