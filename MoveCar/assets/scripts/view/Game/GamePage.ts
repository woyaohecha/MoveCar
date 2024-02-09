import { _decorator, Component, Node, director, sys } from 'cc';
import { GameData } from '../../data/GameData';
import { UserData } from '../../data/UserData';

import { EventManager } from '../../manager/EventManager';
import { HttpManager } from '../../manager/HttpManager';
import { TipsManager } from '../../manager/TipsManager';
import { PlayView } from './PlayView';
import { SettleView } from './SettleView';
const { ccclass, property } = _decorator;

export const enum View {
    PLAY = "Play",
    PAUSE = "Pause",
    SETTLE = "Settle"
}

@ccclass('GamePage')
export class GamePage extends Component {

    @property(Node)
    playView: Node = null;

    @property(Node)
    pauseView: Node = null;

    @property(Node)
    settleView: Node = null;

    inGame: boolean = false;

    onLoad() {
        EventManager.getInstance().on("gameStart", this.onStart, this);
        EventManager.getInstance().on("gamePause", this.onPause, this);
        EventManager.getInstance().on("gameContinue", this.onContinue, this);
        EventManager.getInstance().on("gameNext", this.onNext, this);
        EventManager.getInstance().on("gameRelive", this.onRelive, this);
        EventManager.getInstance().on("gameSettle", this.onSettle, this);
        EventManager.getInstance().on("gameQuit", this.onQuit, this);
    }

    start() {
        this.onStart();
    }


    /**
     * 游戏开始
     */
    onStart() {
        console.log("gamePage onStart");
        this.playView.active = true;
        this.pauseView.active = false;
        this.settleView.active = false;
        this.inGame = true;
        let race = sys.localStorage.getItem("race");
        EventManager.getInstance().emit("initGame", race);
    }


    /**
     * 复活
     */
    onRelive() {
        console.log("gamePage onRelive");
        this.playView.active = true;
        this.pauseView.active = false;
        this.settleView.active = false;
        this.inGame = true;
    }

    /**
     * 暂停
     */
    onPause() {
        console.log("gamePage onPause");
        this.pauseView.active = true;
    }


    /**
     * 继续游戏
     */
    onContinue() {
        console.log("gamePage onContinue");
        this.pauseView.active = false;
    }


    /**
     * 结算
     * @param value win-true lose-false
     * @param goldCount 获胜时的奖励
     */
    onSettle(value: boolean, goldCount: number) {
        if (!this.inGame) {
            return;
        }
        console.log("gamePage onSettle:", value);
        this.inGame = false;
        this.settleView.getComponent(SettleView).init(value, goldCount)
    }

    /**
     * 下一关
     */
    onNext() {
        this.onStart();
    }


    /**
     * 退出游戏
     */
    onQuit() {
        this.inGame = false;
        console.log("gamePage onQuit");
        director.loadScene("Home");
    }
}


