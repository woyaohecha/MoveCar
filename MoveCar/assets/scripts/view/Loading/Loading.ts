import { _decorator, Component, Node, director, find, ProgressBar, math, Label, EditBox, sys, debug, profiler } from 'cc';
import { DEBUG } from 'cc/env';
import { GameData } from '../../data/GameData';
import { UserData } from '../../data/UserData';
import { AdManager, AdType } from '../../manager/AdManager';
import { AudioManager } from '../../manager/AudioManager';
import { HttpManager } from '../../manager/HttpManager';
import { TipsManager } from '../../manager/TipsManager';
const { ccclass, property } = _decorator;

@ccclass('Loading')
export class Loading extends Component {

    @property(ProgressBar)
    progressBar: ProgressBar = null;

    @property(Label)
    percentLabel: Label = null;

    @property(Node)
    loginPanel: Node = null;

    private _progress: number = 0;
    private _loading: boolean = false;

    private set progress(value: number) {
        this._progress = value > 1 ? 1 : value;
        this.progressBar.progress = this._progress;
        this.percentLabel.string = (this._progress * 100).toFixed(0) + "%";
    }

    private get progress() {
        return this._progress;
    }

    onLoad() {
        // GameData.getLevelData2();
        profiler.hideStats();

        let root2D = find("Root2D");
        let root3D = find("Root3D");
        director.addPersistRootNode(root2D);
        director.addPersistRootNode(root3D);
        AudioManager.getInstance();
        director.preloadScene("Home")
        // AdManager.getInstance().showAd(AdType.open);
    }

    start() {
        this.init();
    }

    update(dt) {
        this.loadBar(dt);
    }

    init() {
        this.progress = 0;
        this.loginPanel.active = false;
    }

    loadBar(dt: number) {
        if (this._loading) {
            return
        }
        if (this.progress < 1) {
            this.progress += dt * math.random();
        } else {
            this._loading = true;
            this.autoLogin();
        }
    }

    autoLogin() {
        TipsManager.getInstance().showLoading("登录中...");
        HttpManager.autoLogin((res) => {
            UserData.getInstance().accessToken = JSON.parse(res).data.access_token;
            UserData.getInstance().refreshToken = JSON.parse(res).data.refresh_token;
            TipsManager.getInstance().hideLoading();
            TipsManager.getInstance().showTips("登录成功");
            director.loadScene("Home");
        }, () => {
            TipsManager.getInstance().hideLoading();
            this.progressBar.node.active = false;
            this.loginPanel.active = true;
        })
    }
}


