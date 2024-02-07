import { _decorator, Component, Node, director, sys } from 'cc';
import { GameData } from '../../data/GameData';
import { AdManager, AdType } from '../../manager/AdManager';
import { UILayer, UIManager } from '../../manager/UIManager';
const { ccclass, property } = _decorator;

@ccclass('HomeLayer')
export class HomeLayer extends Component {

    onEnable() {
        // AdManager.getInstance().showAd(AdType.banner);
    }

    onBtnMine() {
        UIManager.getInstance().showUI(UILayer.MINE);
    }

    onBtnSign() {
        UIManager.getInstance().showUI(UILayer.SIGN);
    }

    onBtnTask() {
        UIManager.getInstance().showUI(UILayer.TASK);
    }

    onBtnLottery() {
        UIManager.getInstance().showUI(UILayer.LOTTERY);
    }

    onBtnCashOut() {
        UIManager.getInstance().showUI(UILayer.CASH_OUT);
    }

    onBtnMakeMoney() {
        UIManager.getInstance().showUI(UILayer.MINE);
    }

    onBtnStartGame(e, param) {
        if (param) {
            sys.localStorage.setItem("race", "1");
        } else {
            sys.localStorage.setItem("race", "0");
        }
        director.loadScene("Game");
    }

    onDisable() {
        // AdManager.getInstance().hideBanner();
    }

}


