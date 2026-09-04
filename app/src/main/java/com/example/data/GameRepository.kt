package com.example.data

import kotlinx.coroutines.flow.Flow

class GameRepository(private val gameDao: GameDao) {
    val topScores: Flow<List<GameScoreEntity>> = gameDao.getTopScores()
    val recentScores: Flow<List<GameScoreEntity>> = gameDao.getRecentScores()
    val allAchievements: Flow<List<AchievementEntity>> = gameDao.getAllAchievements()

    suspend fun insertScore(score: GameScoreEntity): Long {
        return gameDao.insertScore(score)
    }

    suspend fun unlockAchievement(key: String, timestamp: Long = System.currentTimeMillis()): Boolean {
        return gameDao.unlockAchievement(key, timestamp) > 0
    }

    suspend fun initAchievementsIfNeeded() {
        val initialAchievements = listOf(
            AchievementEntity("first_blood", "Pierwsza Odprawa", "Zneutralizuj pierwszego niecierpliwego kierowcę.", "📦", false),
            AchievementEntity("drift_king", "Drift Master DTA", "Zrób 50 poślizgów wózkiem Toyota BT po epoksydzie.", "🛞", false),
            AchievementEntity("coffee_addict", "Klawo-Kawa Espresso", "Użyj Szarży Widłami 10 razy w trakcie jednej zmiany.", "☕", false),
            AchievementEntity("kinder_defender", "Obrońca Kinder Bueno", "Zbierz legendarne Kinder Bueno z lodówki.", "🍫", false),
            AchievementEntity("bhp_rebel", "Mandat? Jaki Mandat?!", "Zniszcz 10 pachołków BHP rozstawionych przez Grześka.", "⚠️", true),
            AchievementEntity("lights_out", "Ciemność, widzę ciemność", "Przetrwaj spotkanie z Udziałowcem Igorem w ciemnościach.", "🕶️", true),
            AchievementEntity("battery_critical", "Na Oparach Prądu", "Przetrwaj 15 sekund mając poniżej 10% baterii.", "⚡", true),
            AchievementEntity("kontener_1559", "Kontener o 15:58", "Przetrwaj wjazd spóźnionego kontenera 40ft przed końcem zmiany.", "🚢", true),
            AchievementEntity("toitoi_evolution", "Zasłana Ewolucja", "Pokonaj zmutowanego Mecha-ToiToia o 05:00 rano.", "🚽", true),
            AchievementEntity("dwie_paletki", "Ja tylko dwie paletki!", "Przetrwaj taranujący atak kierowcy busa pod rampą.", "🚐", false),
            AchievementEntity("ukrainska_ekipa", "Dawaj! Dawaj!", "Zneutralizuj ekspresową brygadę ze Wschodu.", "💨", false),
            AchievementEntity("weapon_evolution", "Ewolucja Magazynowa", "Połącz broń i przedmiot pasywny w ewolucję poziomu MAX!", "💥", false),
            AchievementEntity("combo_god", "Mistrz Epoksydu x50", "Osiągnij mnożnik kombosów x50 za nieprzerwany pogrom.", "🔥", false),
            AchievementEntity("shift_master", "07:00 - Fajrant Marzeń", "Dotrwaj do końca nocnej zmiany i odjedź na ładowarkę.", "🏆", false)
        )
        gameDao.insertInitialAchievements(initialAchievements)
    }
}
