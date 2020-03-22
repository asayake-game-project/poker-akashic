import { GameMainParameterObject, RPGAtsumaruWindow } from "./parameterObject";

declare const window: RPGAtsumaruWindow;

export function main(param: GameMainParameterObject): void {
	
	const game = new Game(Conf.main.width, Conf.main.height);
    game.preload(Conf.data.loading.image_path);
    game.onload =  () => {
      new Promise((resolve, reject) => {
        SceneRepository.setGameObject(game);
        const loadingScene = new LoadingScene();
        resolve(loadingScene.initializeLoadingScene());
      }).then(sceneObject => {
        SceneRepository.pushScene(sceneObject.getScene());
        return Promise.resolve(GameTitleSceneFactory.generateWithPromise());
      }).then(sceneObject => {
        PlayerModelRepository.register('ai');
        PlayerModelRepository.register('kyouka');
        SceneRepository.pushScene(sceneObject.getScene());
        return Promise.resolve();
      });
    };
    game.start();
    gameObject = game;
	// const scene = new g.Scene({
	// 	game: g.game,
	// 	// このシーンで利用するアセットのIDを列挙し、シーンに通知します
	// 	assetIds: ["player", "shot", "se"]
	// });
	// let time = 60; // 制限時間
	// if (param.sessionParameter.totalTimeLimit) {
	// 	time = param.sessionParameter.totalTimeLimit; // セッションパラメータで制限時間が指定されたらその値を使用します
	// }
	// // 市場コンテンツのランキングモードでは、g.game.vars.gameState.score の値をスコアとして扱います
	// g.game.vars.gameState = { score: 0 };
	// scene.loaded.add(() => {

	// });
	// g.game.pushScene(scene);
}
