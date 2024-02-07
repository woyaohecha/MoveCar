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

    @property(Label)
    levelLabel: Label = null;

    private _level: number = 0;
    get level() {
        return this._level;
    }
    set level(value: number) {
        this._level = value;
        this.levelLabel.string = `value`;
    }

    init(level: number, value: boolean, goldCount?: number) {
        if (value) {
            UserData.getInstance().gold += goldCount;
        }
        this._level = level + 1;
        this.node.getChildByName("Win").active = value;
        this.node.getChildByName("Lose").active = !value;
        this.goldCountLabel.string = `x${goldCount ? goldCount : 0}`;
        this.doubleBtn.active = true;
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


