import { _decorator, Component, Node, Label, director, resources, Prefab, instantiate, Vec3, Widget, UITransform, Layers, Canvas, find, Acceleration, Button } from 'cc';
import { ResConfig } from '../config/ResConfig';
const { ccclass, property } = _decorator;

/**
 * todo:常驻节点根据层级，动态加入到某个层级中
 */
@ccclass('TipsManager')
export class TipsManager {
    private static _messageManager: TipsManager;

    public static getInstance(): TipsManager {
        if (!this._messageManager) {
            this._messageManager = new TipsManager();
        }
        return this._messageManager;
    }

    /**
     * 消息提示根节点
     */
    private _msgRoot_2D: Node;

    /**
     * 消息节点
     */
    private _tips: Node;
    private _toast: Node;
    private _loading: Node;

    /**
     * 查找场景常驻节点---2D 
     * tips节点 
     * toast节点
     * loading节点
     */
    constructor() {
        this._msgRoot_2D = find("Root2D");
        this._tips = this._msgRoot_2D.getChildByName("Tips");
        this._tips.setSiblingIndex(203);
        this._toast = this._msgRoot_2D.getChildByName("Toast");
        this._toast.setSiblingIndex(201);
        this._loading = this._msgRoot_2D.getChildByName("Loading");
        this._toast.setSiblingIndex(202);

        this._tips.active = false;
        this._toast.active = false;
        this._loading.active = false;
    }

    private tipsTimeoutId = null;
    /**
     * 展示提示文字,自动关闭
     * @param msg 提示文字内容
     * @param timeout 展示时间，单位秒，默认2秒
     * @param callback 关闭提示信息后的回调
     * @returns 
     */
    showTips(msg: string, timeout?: number) {
        if (this.tipsTimeoutId) {
            clearTimeout(this.tipsTimeoutId);
        }
        this._tips.active = false;
        let tipsLabel = this._tips.getChildByName("Msg").getComponent(Label);
        tipsLabel.string = msg;
        setTimeout(() => {
            this._tips.active = true;
            this.tipsTimeoutId = setTimeout(() => {
                this._tips.active = false;
                this.tipsTimeoutId = null;
            }, timeout ? timeout * 1000 : 2000);
        }, 100);
    }

    /**
     * 展示弹窗信息，手动关闭
     * @param msgObj 消息对象，含标题，内容，按钮文字
     * @param btnClick 向按钮注入的点击方法,默认关闭弹窗
     * @param fullClose 是否支持全屏关闭,默认不支持
     */
    showToast(msgObj: { title: string, msg: string, btn: string }, btnClick?: Function, fullClose?: boolean) {
        let titleLabel = this._toast.getChildByName("Title").getComponent(Label);
        let msgLabel = this._toast.getChildByName("Msg").getComponent(Label);
        let btnLabel = this._toast.getChildByName("Btn").getComponent(Label);
        titleLabel.string = msgObj.title;
        msgLabel.string = msgObj.msg;
        btnLabel.string = msgObj.btn;
        this._toast.active = true;

        //向按钮注入点击事件
        let btnComp = btnLabel.getComponent(Button);
        let btnClickEvent = btnClick ? btnClick : this.hideToast;
        btnComp.node.on(Button.EventType.CLICK, btnClickEvent, this);

        if (fullClose) {
            let fullBtn = this._toast.getComponent(Button);
            fullBtn.node.on(Button.EventType.CLICK, this.hideToast, this);
        }
    }

    /**
     * 关闭弹窗信息
     * @returns 
     */
    hideToast() {
        if (!this._toast) {
            return;
        }

        let btnComp = this._toast.getChildByName("Btn").getComponent(Button);
        btnComp.node.off(Button.EventType.CLICK);

        let fullBtn = this._toast.getComponent(Button);
        fullBtn.node.off(Button.EventType.CLICK);

        this._toast.active = false;
    }

    /**
     * 展示加载页面，需主动调用关闭
     * @param msg 加载页面文字信息
     * @returns 
     */
    showLoading(msg: string) {
        let loadingLabel = this._loading.getChildByName("Msg").getComponent(Label);
        loadingLabel.string = msg;
        this._loading.active = true;
    }

    /**
     * 关闭加载页面
     */
    hideLoading() {
        if (!this._loading) {
            return;
        }
        this._loading.active = false;
    }
}


