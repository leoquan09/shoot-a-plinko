// QuotaManager.js
export class QuotaManager {
  constructor() {
    const quota = localStorage.getItem('quota') || 0;
    const savedRound = parseInt(localStorage.getItem('level'), 10);
    this.currentRound = savedRound > 0 ? savedRound : 1;

    this.quotas = [
      500,   
      625,   
      775,   
      975,   
      1225,  
      1550,  
      1950, 
      2500  
    ];
  }

  getTarget() {
    if (this.currentRound <= this.quotas.length) {
      return this.quotas[this.currentRound - 1];
    }
    const extraRounds = this.currentRound - this.quotas.length;
    return Math.round(2500 * Math.pow(1.35, extraRounds));
  }

  isMet(currentCash) {
    return currentCash >= this.getTarget();
  }

  nextRound() {
    this.currentRound++;
    localStorage.setItem('level', this.currentRound);
    localStorage.setItem('quota', this.getTarget());
  }

  reset() {
    this.currentRound = 1;
    localStorage.setItem('level', this.currentRound);
    localStorage.setItem('quota', this.getTarget());
  }
}
