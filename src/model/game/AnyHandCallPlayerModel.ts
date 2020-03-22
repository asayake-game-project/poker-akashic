import { AiPlayerModel } from './AiPlayerModel';
import { ActionModel } from './ActionModel';
import { TexasHoldemPhase } from '../../const/game/TexasHoldemPhase';
import { PlayerModel } from './PlayerModel';
import { BoardModel } from './BoardModel';

export class AnyHandCallPlayerModel extends AiPlayerModel {
  // override
  decideAction(
    _actionPhase: TexasHoldemPhase,
    _enemyPlayerModel: PlayerModel,
    _boardModel: BoardModel,
    callValue: number): void {
    // TODO: callValueが0でないとバグるので要修正
    if (this.action === null && callValue === 0) {
      this.action = new ActionModel("CHECK", 0);
    } else if (this.action !== null && this.action.value === callValue) {
      this.action = new ActionModel("CHECK", callValue);
    } else {
      this.action = new ActionModel("CALL", callValue);
    }

    if (this.action.value >= this.stack) {
      this.action = new ActionModel("ALLIN", this.stack);
    }
  }
}
