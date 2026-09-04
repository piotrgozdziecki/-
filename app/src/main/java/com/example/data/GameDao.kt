package com.example.data

import androidx.room.Dao
import androidx.room.Insert
import androidx.room.OnConflictStrategy
import androidx.room.Query
import kotlinx.coroutines.flow.Flow

@Dao
interface GameDao {
    @Query("SELECT * FROM game_scores ORDER BY score DESC LIMIT 20")
    fun getTopScores(): Flow<List<GameScoreEntity>>

    @Query("SELECT * FROM game_scores ORDER BY timestamp DESC LIMIT 20")
    fun getRecentScores(): Flow<List<GameScoreEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertScore(score: GameScoreEntity): Long

    @Query("SELECT * FROM achievements")
    fun getAllAchievements(): Flow<List<AchievementEntity>>

    @Insert(onConflict = OnConflictStrategy.IGNORE)
    suspend fun insertInitialAchievements(achievements: List<AchievementEntity>)

    @Query("UPDATE achievements SET unlocked = 1, unlockedAtTimestamp = :timestamp WHERE `key` = :key AND unlocked = 0")
    suspend fun unlockAchievement(key: String, timestamp: Long): Int

    @Query("SELECT COUNT(*) FROM game_scores")
    suspend fun getTotalGamesPlayed(): Int

    @Query("SELECT MAX(survivalTimeSeconds) FROM game_scores")
    suspend fun getMaxSurvivalTime(): Int?
}
