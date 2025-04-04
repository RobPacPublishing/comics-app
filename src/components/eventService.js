// src/services/eventService.js

/**
 * Sistema di eventi per la comunicazione tra i componenti dell'applicazione
 */
class EventService {
  constructor() {
    this.events = {};
  }

  // Registra un listener per un evento
  on(eventName, callback) {
    if (!this.events[eventName]) {
      this.events[eventName] = [];
    }
    this.events[eventName].push(callback);

    // Restituisce una funzione per annullare l'iscrizione
    return () => {
      this.events[eventName] = this.events[eventName].filter(
        (eventCallback) => callback !== eventCallback
      );
    };
  }

  // Emette un evento con dati opzionali
  emit(eventName, data) {
    if (this.events[eventName]) {
      this.events[eventName].forEach((callback) => {
        callback(data);
      });
    }
  }

  // Rimuove tutti i listener per un evento
  off(eventName) {
    if (this.events[eventName]) {
      delete this.events[eventName];
    }
  }
}

// Esporta una singola istanza del servizio
export default new EventService();