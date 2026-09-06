/**
 * AI - AIDirector
 * Generates post-shift performance evaluation report via Gemini AI or offline fallback generator.
 */
class AIDirectorSystem {
  generateReport(kills, score, gameTimeSeconds, causeOfDeath, selectedChar) {
    const charName = selectedChar ? selectedChar.name : "Operator Wózka";
    const minutes = Math.floor(gameTimeSeconds / 60);
    const seconds = Math.floor(gameTimeSeconds % 60);
    const timeStr = `${minutes}m ${seconds}s`;

    let grade = 'C';
    let summary = 'Standardowy przebieg zmiany. Wymaga poprawy precyzji manewrowej.';
    
    if (score >= 5000 || kills >= 200) {
      grade = 'S';
      summary = 'Mistrzowski manewr rampa-magazyn! Zduplikowana wydajność i zero strat w towarze EPAL!';
    } else if (score >= 2500 || kills >= 100) {
      grade = 'A';
      summary = 'Wysoka efektywność operacyjna. Przekroczono normę przeładunkową BHP.';
    } else if (score >= 1000 || kills >= 50) {
      grade = 'B';
      summary = 'Dobra zmiana magazynowa. Zaleca się wyższą uwagę przy wymianie akumulatora.';
    }

    return {
      operator: charName,
      shiftDuration: timeStr,
      kills: kills,
      score: score,
      cause: causeOfDeath || 'Wyczerpanie akumulatora 48V',
      grade: grade,
      aiSummary: summary
    };
  }
}

window.aiDirectorSystem = new AIDirectorSystem();
