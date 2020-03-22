import { PlayerModel } from './PlayerModel';
import { TexasHoldemAction } from '../../const/game/TexasHoldemAction';
import { TexasHoldemPhase } from '../../const/game/TexasHoldemPhase';
import { BoardModel } from './BoardModel';

export abstract class AiPlayerModel extends PlayerModel {
  abstract decideAction(
    actionPhase: TexasHoldemPhase,
    enemyPlayerModel: PlayerModel,
    boardModel: BoardModel,
    callValue: number): void;

  fixAction(bigBlind: number): void {
    if (this.action === null) {
      return;
    }
    if (this.action.value > this.stack) {
      // ベット額がスタックを超えていた場合
      this.action.name = "ALLIN";
      this.action.value = this.stack;
    } else if (this.action.name !== "FOLD" &&
      this.action.name !== "CHECK" &&
      this.action.value < bigBlind) {
      // ベット額がビックブラインド額を満たしていない場合
      this.action.value = bigBlind;
    }
  }
}
