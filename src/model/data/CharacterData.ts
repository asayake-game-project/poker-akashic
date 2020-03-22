import { allExpressions } from '../../const/data/CharacterExpression';

const SPRITE_KEY_PREFIX = 'chara_';

export class CharacterData {
  name: string;
  image: string;
  type: string;
  displayName: string;
  serifs: string[];

  constructor(data) {
    this.name = data.name;
    this.image = data.image;
    this.type = data.type;
    this.displayName = data.display_name;
    this.serifs = data.serifs;
  }

  getSpriteData(): any {
    return allExpressions.map(expression => {
      return {
        'sprite_key': SPRITE_KEY_PREFIX + this.name + '_' + expression,
        'image_path': this.image + '_' + expression + '.png'
      }
    });
  }

  getSpriteKey(expression): string {
    return SPRITE_KEY_PREFIX + this.name + '_' + expression;
  }
}
