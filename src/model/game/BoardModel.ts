import { CardModel } from "./CardModel";

export interface ChipPot {
  id: number;
  chip: number;
}

export class BoardModel {
  openedCards: CardModel[] = [];
  chipPots: ChipPot[] = [];

  getOpenedCards(): CardModel[] {
    return this.openedCards;
  }

  setCard(card: CardModel): void {
    this.openedCards.push(card);
  }

  addChip(pot: ChipPot): void {
    let index;
    for (index = 0; index < this.chipPots.length; index++) {
      if (pot.id === this.chipPots[index].id) {
        break;
      }
    }
    if (index === this.chipPots.length) {
      this.chipPots.push(pot);
    } else {
      this.chipPots[index].chip += pot.chip;
    }
  }

  getPotForOne(id: number): ChipPot[] {
    let targetPot = this.getPotById(id),
      chip = targetPot.chip,
      totalValue = 0;
    this.chipPots.forEach((pot) => {
      if (id !== pot.id) {
        if (pot.chip <= chip) {
          totalValue += pot.chip;
          pot.chip = 0;
        } else {
          totalValue += chip;
          pot.chip -= chip;
        }
      }
    });
    targetPot.chip += totalValue;
    return this.chipPots;
  }

  getPotForMulti(ids: number[]): ChipPot[] {
    let totalValue = 0;
    this.chipPots.forEach((pot) => {
      totalValue += pot.chip;
      pot.chip = 0;
    });
    this.chipPots.forEach((pot) => {
      if (ids.indexOf(pot.id) !== -1) {
        pot.chip = Math.round(totalValue / ids.length);
      }
    });
    return this.chipPots;
  }

  getPotById(id: number): ChipPot {
    let pots = this.chipPots.filter(pot => id === pot.id);
    return pots[0];
  }

  getChipPots(): ChipPot[] {
    return this.chipPots;
  }

  getPotValue(): number {
    let totalValue = 0;
    this.chipPots.forEach((pot) => {
      totalValue += pot.chip;
    });
    return totalValue;
  }

  clear(): void {
    this.openedCards = [];
    this.chipPots = [];
  }
}
