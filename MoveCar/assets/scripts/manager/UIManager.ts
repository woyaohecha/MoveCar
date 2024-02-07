import { _decorator, Component, Node, find, resources, Prefab, instantiate, Vec3, Acceleration, UITransform } from 'cc';
import { ResConfig } from '../config/ResConfig';
const { ccclass, property } = _decorator;

export enum UILayer {
    HOME = "home",
    SIGN = "sign",
    MINE = "mine",
    LOTTERY = "lottery",
    TASK = "task",
    ABOUT_US = "aboutUs",
    SET_PASSWORD = "setPassword",
    EDIT_PASSWORD = "editPassword",
    CASH_RECORD = "cashRecord",
    CUSTOMER = "customer",
    PRIVACY = "privacy",
    USEAGENT = "userAgent",
    ACCOUNT_INFO = "accountInfo",
    CASH_OUT = "cashOut",
    SCORE_RECORD = "scoreRecord",
    SHOP = "shop",
    COMMISSION_RECORD = "commissionRecord"

}

@ccclass('UIManager')
export class UIManager {
    private static _UIManager: UIManager;

    public static getInstance(): UIManager {
        if (!this._UIManager) {
            this._UIManager = new UIManager();
        }
        return this._UIManager;
    }

    private _zIndex = {
        home: 1,
        sign: 2,
        mine: 2,
        lottery: 2,
        task: 2,
        customer: 3,
        privacy: 3,
        userAgent: 3,
        cashRecord: 3,
        scoreRecord: 3,
        commissionRecord: 3,
        shop: 3,
        aboutUs: 3,
        cashOut: 3,
        accountInfo: 4,
        setPassword: 5,
        editPassword: 5
    }

    /**
     * 消息提示根节点
     */
    private _UIRoot_2D: Node;
    private _layers: any = {};

    initUIManager() {
        for (let key in this._layers) {
            if (this._layers[key] && this._layers[key].isValid) {
                this._layers[key].destroy();
            }
        }
        this._layers = {};
        this._UIRoot_2D = find("Canvas");
        this._layers.home = this._UIRoot_2D.getChildByName("HomeLayer");
        this._layers.home.setSiblingIndex(this._zIndex.home);
    }


    /**
     * 展示UI
     * @param uiLayer 
     */
    showUI(uiLayer: UILayer) {
        if (this._layers[uiLayer]) {
            this._layers[uiLayer].active = true;
        } else {
            resources.load(ResConfig.layerPath[uiLayer], (e, prefab: Prefab) => {
                if (e) {
                    console.error(e);
                    return;
                }
                if (this._layers[uiLayer]) {
                    return;
                }
                let layer = instantiate(prefab);
                this._UIRoot_2D.addChild(layer);
                layer.getComponent(UITransform).priority = this._zIndex[uiLayer];
                layer.setPosition(Vec3.ZERO);
                this._layers[uiLayer] = layer;
                this.showUI(uiLayer);
            })
        }
    }


    /**
     * 隐藏UI
     * @param uiLayer 
     */
    hideUI(uiLayer: UILayer) {
        if (this._layers[uiLayer]) {
            this._layers[uiLayer].active = false;
        }
    }


    /**
     * 隐藏所有UI
     */
    hideAllUI() {
        for (let key in this._layers) {
            this._layers[key].active = false;
        }
    }
}


