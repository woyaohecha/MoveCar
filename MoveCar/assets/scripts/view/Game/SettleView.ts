import { _decorator, Component, Node, Label, game, director } from 'cc';
import { UserData } from '../../data/UserData';
import { AdManager, AdType } from '../../manager/AdManager';
import { EventManager } from '../../manager/EventManager';
import { HttpManager } from '../../manager/HttpManager';
import { TipsManager } from '../../manager/TipsManager';
import { GamePage } from './GamePage';
const { ccclass, property } = _decorator;

@ccclass('SettleView')
export class SettleView extends Component {

    @property(Label)
    goldCountLabel: Label = null;

    @property(Node)
    doubleBtn: Node = null;


    init(value: boolean, goldCount: number) {
        this.node.getChildByName("Win").active = value;
        this.node.getChildByName("Lose").active = !value;
        this.goldCountLabel.string = `x${goldCount ? goldCount : 0}`;
        this.doubleBtn.active = true;
        this.node.active = true;
    }

    onBtnDouble() {
        //todo:play vedio end call function 
        // AdManager.getInstance().hideBanner();
        // AdManager.getInstance().showAd(AdType.video, () => {

        // }, () => {

        // }, () => {
        //     AdManager.getInstance().showAd(AdType.banner);
        //     HttpManager.getDouble(this.level, () => {
        //         console.log("get double success!");
        //         TipsManager.getInstance().showTips("双倍领取成功");
        //         EventManager.getInstance().emit("gameStart");
        //     }, () => {

        //     })
        // })

    }

    onBtnBack() {
        EventManager.getInstance().emit("gameQuit");
    }

    onBtnNext() {
        EventManager.getInstance().emit("gameNext");
    }


    onBtnRelive() {
        // AdManager.getInstance().hideBanner();
        // AdManager.getInstance().showAd(AdType.video, () => {

        // }, () => {

        // }, () => {
        //     AdManager.getInstance().showAd(AdType.banner);
        //     EventManager.getInstance().emit("gameRelive");
        // })

    }

    onBtnRetry() {
        EventManager.getInstance().emit("gameStart");
    }
}


