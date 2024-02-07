import { _decorator, Component, Node, EditBox, sys, Toggle, director, Label, Sprite, Color, Button } from 'cc';
import { UserData } from '../../data/UserData';
import { AdManager, AdType } from '../../manager/AdManager';
import { HttpManager } from '../../manager/HttpManager';
import { TipsManager } from '../../manager/TipsManager';
const { ccclass, property } = _decorator;

@ccclass('Login')
export class Login extends Component {

    @property(EditBox)
    phoneEditBox: EditBox = null;

    @property(Toggle)
    checkToggle: Toggle = null;

    @property(Node)
    btnSendMsg: Node = null;

    tipsManager: TipsManager = null;
    phone: string = "";
    code: string = "";

    onLoad() {
        this.tipsManager = TipsManager.getInstance();
    }

    start() {
        this.init();
    }


    getPhoneCache() {
        let phoneCache = sys.localStorage.getItem("phone");
        return phoneCache;
    }

    setPhoneCache(value: string) {
        sys.localStorage.setItem("phone", value);
    }


    init() {
        if (this.getPhoneCache()) {
            this.phone = this.getPhoneCache();
            this.phoneEditBox.string = this.phone;
        }
        this.checkToggle.isChecked = false;
        this.btnSendMsg.getChildByName("Des").getComponent(Label).string = "获取验证码";
        this.btnSendMsg.getComponent(Sprite).color = new Color().fromHEX("#00ADFF");
        this.btnSendMsg.getComponent(Button).interactable = true;
    }

    /**
     * 设置按钮点击状态
     * @param state 是否可以点击
     */
    setSendMsgBtn(state: boolean) {
        this.btnSendMsg.getChildByName("Des").getComponent(Label).string = state ? "获取验证码" : this.timer + "s";
        this.btnSendMsg.getComponent(Sprite).color = state ? new Color().fromHEX("#00ADFF") : new Color().fromHEX("#ADADAD");
        this.btnSendMsg.getComponent(Button).interactable = state;
    }

    /**
     * 输入框失去焦点时
     * @param editBox 当前输入框
     * @param customData phone或者code
     * @returns 
     */
    onEditEnd(editBox: EditBox, customData: any) {
        let str = editBox.string;
        if (customData == "phone") {
            if (str.length != 11 || str[0] != "1") {
                console.log("---请输入正确的手机号")
                this.tipsManager.showTips("请输入正确的手机号");
                return;
            }
            this.phone = str;
        } else {
            if (str.length != 4) {
                console.log("---请输入正确的验证码")
                this.tipsManager.showTips("请输入正确的验证码");
                return;
            }
            this.code = str;
        }
    }

    /**
     * 获取验证码
     * @returns 
     */
    onBtnSendMsg() {
        if (this.waitMsg) {
            console.log("---发送短信过于频繁，请稍后再试");
            this.tipsManager.showTips("发送短信过于频繁，请稍后再试");
            return;
        }
        if (this.phone.length != 11 || this.phone[0] != "1") {
            console.log("---请输入正确的手机号")
            this.tipsManager.showTips("请输入正确的手机号");
            return;
        }
        HttpManager.sendPhoneMsg(this.phone, (res) => {
            let data = JSON.parse(res);
            if (data.code == 0) {
                this.tipsManager.showTips(data.msg);
            } else {
                console.log("---短信发送成功")
                this.tipsManager.showTips("短信发送成功");
                this.startTimer();
            }
        }, () => {
            console.error("---短信发送失败")
            this.tipsManager.showTips("短信发送失败");
        })
        // this.startTimer();
    }

    timer: number = 5;
    waitMsg: boolean = false;
    startTimer() {
        this.timer = 5;
        this.waitMsg = true;
        this.setSendMsgBtn(false);
        let callback = () => {
            this.timer--;
            this.btnSendMsg.getChildByName("Des").getComponent(Label).string = this.timer + "s";
            if (this.timer == 0) {
                this.unschedule(callback);
                this.setSendMsgBtn(true);
                this.waitMsg = false;
            }
        }
        this.schedule(callback, 1);
    }

    clickBtn: boolean = false;
    onBtnLogin() {
        if (this.clickBtn) {
            return;
        }
        if (this.phone.length != 11 || this.phone[0] != "1") {
            this.tipsManager.showTips("请输入正确的手机号");
            return;
        }
        if (this.code.length != 4) {
            this.tipsManager.showTips("请输入正确的验证码");
            return;
        }
        if (!this.checkToggle.isChecked) {
            this.tipsManager.showTips("请阅读并勾选用户协议及隐私政策");
            return;
        }
        this.clickBtn = true;
        this.tipsManager.showLoading("正在登录...");
        HttpManager.login(this.phone, this.code, (res) => {
            let data = JSON.parse(res).data;
            this.tipsManager.showTips("登录成功");
            this.setPhoneCache(this.phone);
            UserData.getInstance().accessToken = data.access_token;
            UserData.getInstance().refreshToken = data.refresh_token;
            director.loadScene("Home");
            this.clickBtn = false;
            this.tipsManager.hideLoading();
        }, (e) => {
            console.error("---登录失败", e)
            this.clickBtn = false;
            this.tipsManager.hideLoading();
        })
    }
}


