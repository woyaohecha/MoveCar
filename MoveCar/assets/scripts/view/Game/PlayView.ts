import { _decorator, Component, Label, Node, tween, Vec2, Vec3, Tween } from 'cc';
import { GameData } from '../../data/GameData';
import { EventManager } from '../../manager/EventManager';
const { ccclass, property } = _decorator;

@ccclass('PlayView')
export class PlayView extends Component {

    @property(Label)
    levelLabel: Label = null;

    @property(Label)
    rankLabel: Label = null;

    @property(Node)
    levelInfo: Node = null;

    /**
     * 当前关卡
     */
    private _level: string = "第1关";
    set level(value: string) {
        this._level = value;
        this.levelLabel.string = value;
    }
    get level() {
        return this._level;
    }

    /**
     * 当前关卡目标
     */
    private _rank: string = "第999名";
    set rank(value: string) {
        this._rank = value;
        this.rankLabel.string = value;
    }
    get rank() {
        return this._rank;
    }

    onLoad() {
        EventManager.getInstance().on("initGame", this.initGamePage, this);
    }


    initGamePage(race) {
        console.log("PlayView init");
        this.levelInfo.active = false;
        if (race == "1") {
            this.level = "团队比赛";
            this.rank = "第999名";
        } else {
            GameData.getUserLevel((level) => {
                this.level = `第${level + 1}关`;
                this.rank = "第999名";
            }, (e) => {

            })
        }
    }


    onBtnLevelInfo() {
        this.levelInfo.active = true;
    }


    onBtnCloseLevelInfo() {
        this.levelInfo.active = false;
    }



    onBtnPause() {
        EventManager.getInstance().emit("gamePause");
    }

    onBtnFresh() {

    }
}


