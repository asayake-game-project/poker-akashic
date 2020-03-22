import { QValue } from "../../../model/game/learn/QValue";

const INVERSE_TEMPERATURE: number = 0.2; //逆温度
export class QValueUtil {
  // 各Q値が選択される確率を返す
  static getQValueProbabilities(qvalues: QValue[]): number[] {
    let probabilities: number[] = [],
      all = 0;
    //expを全部足した値を導く
    for (let qvalue of qvalues) {
      all += QValueUtil.getRealScore(qvalue.getScore()); //逆温度を使用
    }
    //全て足し合わせた値が0ならば選ばれる確率は皆均等にする
    if (all === 0) {
      for (let i = 0; i < qvalues.length; i++) {
        probabilities.push(1.0 / qvalues.length);
      }
    } else {
      for (let qvalue of qvalues) {
        probabilities.push(QValueUtil.getRealScore(qvalue.getScore()) / all);  //逆温度を使用
      }
    }
    return probabilities;
  }

  static getRealScore(score: number): number {
    return Math.exp(score / INVERSE_TEMPERATURE);
  }

  static getDividedScore(score: number, num: number): number {
    return INVERSE_TEMPERATURE * Math.log(Math.exp(score / INVERSE_TEMPERATURE) / num);
  }
}