import { RankStrength } from '../../const/game/RankStrength';

export class RankModel {
  readonly strength: RankStrength;
  readonly top: number;
  readonly bottom: number;
  readonly kickers: number[];

  constructor(strength: RankStrength, top: number, bottom: number = 0, kickers: number[] = [0, 0, 0, 0, 0]) {
    this.strength = strength;
    this.top   = top;
    this.bottom = bottom;
    this.kickers = kickers;
  }

  getRankName(): string {
    const rank = Math.floor(this.strength);
    switch(rank) {
      case RankStrength.ROYAL_STRAIGHT_FLUSH:
        return 'ロイヤルストレートフラッシュ';
      case RankStrength.STRAIGHT_FLUSH:
        return 'ストレートフラッシュ';
      case RankStrength.FOUR_CARD:
        return 'フォーカード';
      case RankStrength.FULL_HOUSE:
        return 'フルハウス';
      case RankStrength.FLUSH:
        return 'フラッシュ';
      case RankStrength.STRAIGHT:
        return 'ストレート';
      case RankStrength.THREE_CARD:
        return 'スリーカード';
      case RankStrength.TWO_PAIR:
        return 'ツーペア';
      case RankStrength.ONE_PAIR:
        return 'ワンペア';
      default:
        return 'ブタ';
    }
  }
}
