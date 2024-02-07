import { _decorator, Component, Node, director } from 'cc';
import { UILayer, UIManager } from '../../manager/UIManager';
const { ccclass, property } = _decorator;

@ccclass('HomePage')
export class HomePage extends Component {
    onLoad() {
        UIManager.getInstance().initUIManager();
        director.preloadScene("Game");
    }

    start() {
        UIManager.getInstance().showUI(UILayer.HOME);
    }
}


