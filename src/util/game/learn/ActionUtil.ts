import { MachineActionNum } from '../../../const/game/learn/MachineActionNum';
import { ActionModel } from '../../../model/game/ActionModel';

export class ActionUtil {
  static getNoBetValue(action: ActionModel): number {
    return action === null ? 0 : action.value;
  }

  static getMachineBetValue(machineActionNum: MachineActionNum, potValue: number, callValue: number): number {
    let bigRaiseValue,
      middleRaiseValue,
      smallRaiseValue;
    if (callValue === 0) {
      bigRaiseValue = potValue;
      middleRaiseValue = Math.round(potValue / 2);
      smallRaiseValue = Math.round(potValue / 4);
    } else {
      bigRaiseValue = 4 * callValue;
      middleRaiseValue = 3 * callValue;
      smallRaiseValue = 2 * callValue;
    }
    if (machineActionNum === MachineActionNum.BIG_RAISE) {
      return bigRaiseValue;
    } else if (machineActionNum === MachineActionNum.MIDDLE_RAISE) {
      return middleRaiseValue;
    } else if (machineActionNum === MachineActionNum.SMALL_RAISE) {
      return smallRaiseValue;
    }
    return 0;
  }
}
