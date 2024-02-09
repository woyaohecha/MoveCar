import { SpriteFrame, sys, utils, _decorator } from 'cc';
import { Util } from '../Util';
const { ccclass, property } = _decorator;

@ccclass('UserData')
export class UserData {

    private static _userData: UserData;

    /**
     * 登录后获取的凭证
     */
    loginInfo: any = null;

    /**
     * 登录态token
     */
    private _refreshToken: string = null;
    set refreshToken(value: string) {
        this._refreshToken = value;
        sys.localStorage.setItem("refreshToken", JSON.stringify(this._refreshToken));
    }
    get refreshToken() {
        return this._refreshToken;
    }

    /**
     * 校验token
     */
    private _accessToken: any = null;
    set accessToken(value) {
        this._accessToken = value;
        sys.localStorage.setItem("accessToken", JSON.stringify(this._accessToken));
    }
    get accessToken() {
        return this._accessToken;
    }
    /**
     * 用户头像
     */
    userImg: SpriteFrame = null;

    /**
     * 今日在线时长
     */
    private _onlineTimer: number = 0;
    set onlineTimer(value: number) {
        this._onlineTimer = value;
        sys.localStorage.setItem("onlineTimer", JSON.stringify(this.onlineTimer));
    }
    get onlineTimer() {
        return this._onlineTimer > 600 ? 600 : this._onlineTimer;
    }
    /**
     * 今日通关次数
     */
    private _passCount: number = 0;
    set passCount(value: number) {
        this._passCount = value;
        sys.localStorage.setItem("passCount", JSON.stringify(this.passCount));
    }
    get passCount() {
        return this._passCount;
    }


    private constructor() {
        this.startOnlineTimer();
        this.accessToken = sys.localStorage.getItem("accessToken") ? JSON.parse(sys.localStorage.getItem("accessToken")) : null;
        this.refreshToken = sys.localStorage.getItem("refreshToken") ? JSON.parse(sys.localStorage.getItem("refreshToken")) : null;

        let lastLoginData = sys.localStorage.getItem("lastLoginData");
        if (lastLoginData && Util.isNewDay(JSON.parse(lastLoginData))) {
            console.log("new day");
            sys.localStorage.setItem("lastLoginData", JSON.stringify(new Date()))
            this.onlineTimer = 0;
            this.passCount = 0;
        } else {
            console.log("not new day");
            this.onlineTimer = sys.localStorage.getItem("onlineTimer") ? JSON.parse(sys.localStorage.getItem("onlineTimer")) : 0;
            this.passCount = sys.localStorage.getItem("passCount") ? JSON.parse(sys.localStorage.getItem("passCount")) : 0;
        }
    }

    public static getInstance() {
        if (!this._userData) {
            this._userData = new UserData();
        }
        return this._userData;
    }


    /**
     * 启动在线计时器
     */
    startOnlineTimer() {
        let timer = setInterval(() => {
            this.onlineTimer++;
            if (this.onlineTimer >= 600) {
                clearInterval(timer);
            }
        }, 1000);
    }


    onQuit() {
        this.accessToken = "";
        this.refreshToken = "";
        sys.localStorage.removeItem("accessToken");
        sys.localStorage.removeItem("refreshToken");
    }
}


