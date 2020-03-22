import { RankStrength } from '../../const/game/RankStrength';
import { RankModel } from '../../model/game/RankModel';
import { CardModel } from '../../model/game/CardModel';

export class RankUtil {
  static getRank(hands: CardModel[], boardCards: CardModel[]): RankModel {
    let cards = hands.concat(boardCards),
      rank;
    rank = RankUtil.getStraightFlushRank(cards);
    if (rank !== null) {
      //console.log('ストフラ');
      return rank;
    }
    rank = RankUtil.getFourCardRank(cards);
    if (rank !== null) {
      //console.log('くわっず');
      return rank;
    }
    rank = RankUtil.getFullHouseRank(cards);
    if (rank !== null) {
      //console.log('フルハウス');
      return rank;
    }
    rank = RankUtil.getFlushRank(cards);
    if (rank !== null) {
      //console.log('ふらっしゅ');
      return rank;
    }
    rank = RankUtil.getStraightRank(cards);
    if (rank !== null) {
      //console.log('ストレート');
      return rank;
    }
    rank = RankUtil.getThreeCardRank(cards);
    if (rank !== null) {
      //console.log('スリーカード');
      return rank;
    }
    rank = RankUtil.getPairRank(cards);
    //console.log('ペア');
    return rank;
  }

  static getFourCardRank(cards: CardModel[]): RankModel | null {
    let sameCardNums = RankUtil.getSameCardNums(cards),
      fourCards = [],
      others = [];
    for (let index = 0; index < sameCardNums.length; index++) {
      let number = index + 2,
        cardNum = sameCardNums[index];
      if (cardNum === 4) {
        fourCards.unshift(number);
      } else if (cardNum > 0) {
        others.unshift(number);
      }
    }
    return fourCards.length === 0 ? null : new RankModel(RankStrength.FOUR_CARD, fourCards[0], 0, [others[0]]);
  }

  static getFullHouseRank(cards: CardModel[]): RankModel | null {
    let sameCardNums = RankUtil.getSameCardNums(cards),
      threeCards = [],
      pairs = [];
    for (let index = 0; index < sameCardNums.length; index++) {
      let number = index + 2,
        cardNum = sameCardNums[index];
      if (cardNum === 3) {
        threeCards.unshift(number);
      } else if (cardNum == 2) {
        pairs.unshift(number);
      }
    }
    if (threeCards.length > 0 && pairs.length > 0) {
      return new RankModel(RankStrength.FULL_HOUSE, threeCards[0], pairs[0]);
    } else if (threeCards.length === 2) {
      return new RankModel(RankStrength.FULL_HOUSE, threeCards[0], threeCards[1]);
    }
    return null;
  }

  static getThreeCardRank(cards: CardModel[]): RankModel | null {
    let sameCardNums = RankUtil.getSameCardNums(cards),
      threeCards = [],
      others = [];
    for (let index = sameCardNums.length-1; index >= 0; index--) {
      let number = index + 2,
        cardNum = sameCardNums[index];
      if (cardNum === 3 && threeCards.length === 0) {
        threeCards.push(number);
      } else if (cardNum > 0) {
        others.push(number);
      }
    }
    return threeCards.length === 0 ? null : new RankModel(RankStrength.THREE_CARD, threeCards[0], 0, [others[0], others[1]]);
  }

  static getPairRank(cards: CardModel[]): RankModel {
    let sameCardNums = RankUtil.getSameCardNums(cards),
      pairs = [],
      others = [];
    for (let index = sameCardNums.length-1; index >= 0; index--) {
      let number = index + 2,
        cardNum = sameCardNums[index];
      if (cardNum === 2 && pairs.length < 2) {
        pairs.push(number);
      } else if (cardNum > 0) {
        for (let i = 0; i < cardNum; i++) {
          others.push(number);
        }
      }
    }
    if (pairs.length === 2) {
      return new RankModel(RankStrength.TWO_PAIR, pairs[0], pairs[1], [others[0]]);
    } else if(pairs.length === 1) {
      return new RankModel(RankStrength.ONE_PAIR, pairs[0], 0, others.slice(0, 3));
    }
    return new RankModel(RankStrength.NO_PAIR, 0, 0, others.slice(0, 5));
  }

  static getStraightRank(cards: CardModel[], necessaryCardNum: number = 5): RankModel | null {
    let sortedCards = RankUtil.getSortedCards(cards),
      startCardNum = sortedCards[0].number,
      goalCardNum = startCardNum + necessaryCardNum - 1,
      necessaryNumber = startCardNum + 1;
    for (let i = 1; i < sortedCards.length; i++) {
      if (sortedCards[i].number === necessaryNumber) {
        necessaryNumber++;
      } else if (sortedCards[i].number === necessaryNumber - 1) {
        continue;
      } else if (sortedCards.length - i >= necessaryCardNum) {
        startCardNum = sortedCards[i].number;
        goalCardNum = startCardNum + necessaryCardNum - 1,
        necessaryNumber = startCardNum + 1;
      } else {
        break;
      }
    }
    if (necessaryNumber - 1 >= goalCardNum) {
      return new RankModel(RankStrength.STRAIGHT, necessaryNumber - 1, necessaryNumber - necessaryCardNum);
    } else {
      return null;
    }
  }

  static getFlushRank(cards: CardModel[]): RankModel | null {
    let flushRanks = RankUtil.getFlushRanks(cards);
    return flushRanks.length > 0 ? flushRanks[flushRanks.length-1] : null;
  }

  static getStraightFlushRank(cards: CardModel[]): RankModel | null {
    let flushRanks = RankUtil.getFlushRanks(cards),
      straightFlushRank = null;
    for (let rank of flushRanks) {
      if (rank.top - rank.bottom === 4) {
        straightFlushRank = rank;
      }
    }
    if (straightFlushRank !== null) {
      if (straightFlushRank.top === 14) {
        return new RankModel(RankStrength.ROYAL_STRAIGHT_FLUSH, straightFlushRank.top, straightFlushRank.bottom);
      } else {
        return new RankModel(RankStrength.STRAIGHT_FLUSH, straightFlushRank.top, straightFlushRank.bottom);
      }
    }
    return null;
  }

  static isFlushDraw(hands: CardModel[], boardCards: CardModel[]): boolean {
    let cards = hands.concat(boardCards),
      flushDrawRanks = RankUtil.getFlushRanks(cards, 4);
    return flushDrawRanks.length > 0;
  }

  static isStraightDraw(cards: CardModel[], necessaryCardNum: number = 3): boolean {
    let sortedCards = RankUtil.getSortedCards(cards),
      notExistCount = 0,
      connectionsCount = 0,
      startCardNum = 0;
    for (let index = 0; connectionsCount < necessaryCardNum && index < sortedCards.length; index++) {
      if (connectionsCount === 0) {
        connectionsCount++;
        startCardNum = sortedCards[index].number;
      } else if (sortedCards[index].number === startCardNum + connectionsCount) {
        connectionsCount++;
      } else if (sortedCards[index].number === startCardNum + connectionsCount - 1) {
        continue;
      } else {
        if (notExistCount < 1) {
          notExistCount++;
        } else {
          notExistCount = 0;
          connectionsCount = 0;
        }
      }
    }
    return connectionsCount >= necessaryCardNum;
  }

  static getFlushRanks(cards: CardModel[], necessaryCardNum: number = 5): RankModel[] {
    let suits: {[suit: string]: CardModel[]} = {},
      sameSuitCards: CardModel[] = [],
      flushRanks: RankModel[] = [];
    suits["SPADE"] = [];
    suits["HEART"] = [];
    suits["DIAMOND"] = [];
    suits["CLOVER"]  = [];
    cards.forEach((card) => {
      suits[card.suit].push(card);
    });
    for (let suit in suits) {
      if (suits[suit].length >= necessaryCardNum) {
        sameSuitCards = suits[suit];
        break;
      }
    }
    if (sameSuitCards.length === 0) {
      return [];
    }
    sameSuitCards = RankUtil.getSortedCards(sameSuitCards);
    for (let i = 0; i + necessaryCardNum - 1 < sameSuitCards.length; i++) {
      flushRanks.push(new RankModel(RankStrength.FLUSH, sameSuitCards[i + necessaryCardNum - 1].number, sameSuitCards[i].number));
    }
    return flushRanks;
  }

  static getSameCardNums(cards: CardModel[]): number[] {
    // 前から順に2,3,4,5,6,7,8,9,T,J,Q,K,A
    let sameCardNums = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    cards.forEach((card)=>{
      sameCardNums[card.number-2]++;
    });
    return sameCardNums;
  }

  static getSortedCards(cards: CardModel[]): CardModel[] {
    let sortedCards = cards.sort((card1, card2) => card1.number - card2.number),
      maxNumberCard = sortedCards[sortedCards.length-1],
      aceNumber = 14;
    if (maxNumberCard.number === aceNumber)
    {
      sortedCards.unshift(new CardModel(1, maxNumberCard.suit));
    }
    return sortedCards;
  }

  /**
   * rank2の方が強ければ-1, rank1の方が強ければ1, 同じならば0
   */
  static compareRanks(rank1: RankModel, rank2: RankModel, ignoreKicker: boolean = false): number {
    if (rank1.strength !== rank2.strength) {
      return rank2.strength < rank1.strength ? 1 : -1;
    } else if (rank1.top !== rank2.top) {
      return rank2.top < rank1.top ? 1 : -1;
    } else if (rank1.bottom !== rank2.bottom) {
      return rank2.bottom < rank1.bottom ? 1 : -1;
    } else if (ignoreKicker) {
      if (rank1.top >= RankStrength.ONE_PAIR) {
        return 0;
      } else if (rank1.kickers[0] !== rank2.kickers[0]) {
        return rank2.kickers[0] < rank1.kickers[0] ? 1 : -1;
      }
      return 0;
    }
    for (let i = 0; i < rank1.kickers.length; i++) {
      if (rank1.kickers[i] !== rank2.kickers[i]) {
        return rank2.kickers[i] < rank1.kickers[i] ? 1 : -1;
      }
    }
    return 0;
  }

  static getWeakestRank(): RankModel {
    return new RankModel(RankStrength.NO_PAIR, 0, 0);
  }

  static getUsedHandsCount(realRank: RankModel, hands: CardModel[], board: CardModel[]): number {
    const noHandRank = RankUtil.getRank([], board);
    const oneHandRank = RankUtil.getRank([hands[0]], board);
    const otherHandRank = RankUtil.getRank([hands[1]], board);
    if (RankUtil.compareRanks(realRank, noHandRank, true) === 0) {
      return 0;
    } else if (RankUtil.compareRanks(realRank, oneHandRank, true) === 0 || RankUtil.compareRanks(realRank, otherHandRank, true) === 0) {
      return 1;
    } else {
      return 2;
    }
  }

  static isTopHit(hands: CardModel[], board: CardModel[]): boolean {
    const sortedCards = RankUtil.getSortedCards(board);
    const topCardNumber = sortedCards[sortedCards.length-1].number;
    if (hands[0].number === hands[1].number && hands[0].number > topCardNumber) {
      return true;
    }
    if (hands[0].number === topCardNumber || hands[1].number === topCardNumber) {
      return true;
    }
  }

  static isTwoOver(hands: CardModel[], board: CardModel[]): boolean {
    const sortedCards = RankUtil.getSortedCards(board);
    const topCardNumber = sortedCards[sortedCards.length-1].number;
    return hands[0].number > topCardNumber && hands[1].number > topCardNumber;
  }

  static getRealRank(hands: CardModel[], board: CardModel[]): RankStrength {
    let rank = RankUtil.getRank(hands, board),
      highCardThreshold = 12,
      middleCardThreshold = 7;
    if (rank.strength >= RankStrength.STRAIGHT_FLUSH) {
        return RankStrength.STRAIGHT_FLUSH
    } else if (rank.strength >= RankStrength.STRAIGHT) {
      return rank.strength;
    } else if (rank.strength === RankStrength.THREE_CARD) {
      if (rank.top >= highCardThreshold) {
        return RankStrength.HIGH_THREE_CARD;
      } else if (rank.top >= middleCardThreshold) {
        return RankStrength.MIDDLE_THREE_CARD;
      } else {
        return RankStrength.LOW_THREE_CARD;
      }
    } else if (rank.strength === RankStrength.TWO_PAIR) {
      if (rank.top >= highCardThreshold) {
        return RankStrength.HIGH_TWO_PAIR;
      } else if (rank.top >= middleCardThreshold) {
        return RankStrength.MIDDLE_TWO_PAIR;
      } else {
        return RankStrength.LOW_TWO_PAIR;
      }
    } else if (rank.strength === RankStrength.ONE_PAIR) {
      if (rank.top === 14) {
        return RankStrength.ONE_PAIR_A;
      } else if (rank.top === 13) {
        return RankStrength.ONE_PAIR_K;
      } else if (rank.top === 12) {
        return RankStrength.ONE_PAIR_Q;
      } else if (rank.top >= middleCardThreshold) {
        return RankStrength.ONE_PAIR_MIDDLE;
      } else {
        return RankStrength.ONE_PAIR_LOW;
      }
    } else {
      if (rank.kickers[0] === 14) {
        return RankStrength.NO_PAIR_A;
      } else if (rank.kickers[0] === 13) {
        return RankStrength.NO_PAIR_K;
      } else if (rank.kickers[0] === 12) {
        return RankStrength.NO_PAIR_Q;
      } else if (rank.kickers[0] >= middleCardThreshold) {
        return RankStrength.NO_PAIR_MIDDLE;
      } else {
        return RankStrength.NO_PAIR_LOW;
      }
    }
  }

  static getRealRankForMidstream(hands: CardModel[], board: CardModel[]): RankStrength {
    const rank = RankUtil.getRank(hands, board);
    if (rank.strength >= RankStrength.FOUR_CARD) {
        return RankStrength.STRONG_RANK;
    } else if (rank.strength >= RankStrength.THREE_CARD) {
      return rank.strength;
    } else if (rank.strength === RankStrength.TWO_PAIR) {
      if (RankUtil.isTopHit(hands, board)) {
        return RankStrength.TWO_PAIR_TOP;
      } else {
        return RankStrength.TWO_PAIR;
      }
    } else if (rank.strength === RankStrength.ONE_PAIR) {
      if (RankUtil.isTopHit(hands, board)) {
        return RankStrength.ONE_PAIR_TOP;
      } else {
        return RankStrength.ONE_PAIR;
      }
    } else {
      if (RankUtil.isTwoOver(hands, board)) {
        return RankStrength.NO_PAIR_HIGH;
      } else {
        return RankStrength.NO_PAIR;
      }
    }
  }
}
