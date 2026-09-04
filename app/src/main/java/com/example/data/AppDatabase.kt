package com.example.data

import android.content.Context
import androidx.room.Database
import androidx.room.Room
import androidx.room.RoomDatabase
import androidx.sqlite.db.SupportSQLiteDatabase
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch

@Database(
    entities = [GameScoreEntity::class, AchievementEntity::class],
    version = 1,
    exportSchema = false
)
abstract class AppDatabase : RoomDatabase() {
    abstract fun gameDao(): GameDao

    companion object {
        @Volatile
        private var INSTANCE: AppDatabase? = null

        fun getDatabase(context: Context, scope: CoroutineScope): AppDatabase {
            return INSTANCE ?: synchronized(this) {
                val instance = Room.databaseBuilder(
                    context.applicationContext,
                    AppDatabase::class.java,
                    "dta_survivor_database"
                )
                .addCallback(DatabaseCallback(scope))
                .build()
                INSTANCE = instance
                instance
            }
        }

        private class DatabaseCallback(
            private val scope: CoroutineScope
        ) : RoomDatabase.Callback() {
            override fun onCreate(db: SupportSQLiteDatabase) {
                super.onCreate(db)
                INSTANCE?.let { database ->
                    scope.launch(Dispatchers.IO) {
                        populateInitialAchievements(database.gameDao())
                    }
                }
            }

            suspend fun populateInitialAchievements(dao: GameDao) {
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
                    AchievementEntity("fast_picker", "Ekspresowy Magazynier x20", "Zbierz 20 paczek w szybkiej serii combo z nitro doładowaniem wózka Toyota BT.", "📦", false),
                    AchievementEntity("combo_god", "Mistrz Epoksydu x50", "Osiągnij mnożnik kombosów x50 za nieprzerwany pogrom.", "🔥", false),
                    AchievementEntity("shift_master", "07:00 - Fajrant Marzeń", "Dotrwaj do końca nocnej zmiany i odjedź na ładowarkę.", "🏆", false)
                )
                dao.insertInitialAchievements(initialAchievements)
            }
        }
    }
}
