const ALPHA_VALUE: number = 0.1; //学習率(0.1が普通)
const GAMMA_VALUE: number = 0.9; //割引値(0.9が普通)
const LAMBDA_VALUE: number = 0.5;  //減衰率

export class QValue {
  stateId: number;
  actionId: number;
  score: number;

  constructor(stateId: number, actionId: number, score: number = 0) {
    this.stateId = stateId;
    this.actionId = actionId;
    this.score = score;
  }

  /** Q値を返す */
  getScore(): number {
    return this.score;
  }

  /** Q値の更新その１ */
  updatedScore(comp: number, next: number): void {
    this.score = (1 - ALPHA_VALUE) * this.score + ALPHA_VALUE * (comp + GAMMA_VALUE * next);
  }

  /** Q値の更新その２ */
  updatedScoreByTdError(td: number): void {
    this.score = this.score + ALPHA_VALUE * td;
  }

  /** TD誤差を返す */
  getError(comp: number, next: number): number {
    return comp + GAMMA_VALUE * next - this.score;
  }

  getCsvData(): string {
    return this.stateId + ',' + this.actionId + ',' + this.score;
  }

  static getLambdaValue(): number {
    return LAMBDA_VALUE;
  }
}
