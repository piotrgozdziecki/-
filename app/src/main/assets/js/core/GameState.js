/**
 * CORE - GameState
 * Strict Game State Machine enforcing valid state transitions:
 * STOPPED -> RUNNING -> PAUSED -> RUNNING
 * RUNNING -> LEVELUP -> RUNNING
 * RUNNING -> CHEST -> RUNNING
 * RUNNING -> GAMEOVER -> STOPPED / RUNNING
 */
const GAME_STATES = Object.freeze({
  STOPPED: 'STOPPED',
  RUNNING: 'RUNNING',
  PAUSED: 'PAUSED',
  LEVELUP: 'LEVELUP',
  CHEST: 'CHEST',
  GAMEOVER: 'GAMEOVER',
  WIN: 'WIN',
  STAGE_TRANSITION: 'STAGE_TRANSITION'
});

class GameStateManager {
  constructor() {
    this.currentState = GAME_STATES.STOPPED;
    this.previousState = GAME_STATES.STOPPED;
  }

  getState() {
    return this.currentState;
  }

  is(state) {
    return this.currentState === state;
  }

  isRunning() {
    return this.currentState === GAME_STATES.RUNNING;
  }

  isPaused() {
    return this.currentState === GAME_STATES.PAUSED;
  }

  transitionTo(newState) {
    if (this.currentState === newState) return true;

    // Validate state transitions
    const valid = this.isValidTransition(this.currentState, newState);
    if (!valid) {
      console.warn(`GameState: Invalid transition from ${this.currentState} to ${newState}`);
      return false;
    }

    this.previousState = this.currentState;
    this.currentState = newState;

    if (window.eventBus) {
      window.eventBus.emit('gameStateChanged', {
        from: this.previousState,
        to: this.currentState
      });
    }

    console.log(`GameState: ${this.previousState} ➔ ${this.currentState}`);
    return true;
  }

  isValidTransition(from, to) {
    switch (from) {
      case GAME_STATES.STOPPED:
        return to === GAME_STATES.RUNNING || to === GAME_STATES.STOPPED;
      case GAME_STATES.RUNNING:
        return to === GAME_STATES.PAUSED || to === GAME_STATES.LEVELUP ||
               to === GAME_STATES.CHEST || to === GAME_STATES.GAMEOVER ||
               to === GAME_STATES.WIN || to === GAME_STATES.STAGE_TRANSITION ||
               to === GAME_STATES.STOPPED;
      case GAME_STATES.PAUSED:
        return to === GAME_STATES.RUNNING || to === GAME_STATES.STOPPED || to === GAME_STATES.GAMEOVER;
      case GAME_STATES.LEVELUP:
      case GAME_STATES.CHEST:
      case GAME_STATES.STAGE_TRANSITION:
        return to === GAME_STATES.RUNNING || to === GAME_STATES.GAMEOVER || to === GAME_STATES.STOPPED;
      case GAME_STATES.GAMEOVER:
      case GAME_STATES.WIN:
        return to === GAME_STATES.RUNNING || to === GAME_STATES.STOPPED;
      default:
        return true;
    }
  }
}

window.GAME_STATES = GAME_STATES;
window.gameStateManager = new GameStateManager();
