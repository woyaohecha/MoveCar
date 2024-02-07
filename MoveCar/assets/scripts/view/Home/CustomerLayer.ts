import { _decorator, Component, Node, Label, Acceleration } from 'cc';
import { GameData } from '../../data/GameData';
import { TipsManager } from '../../manager/TipsManager';
import { UILayer, UIManager } from '../../manager/UIManager';
import { Util } from '../../Util';
const { ccclass, property } = _decorator;

@ccclass('CustomerLayer')
export class CustomerLayer extends Component {
    @property(Node)
    wxNode: Node = null;
    @property(Node)
    qqNode: Node = null;
    @property(Node)
    phoneNode: Node = null;

    qq: string = "";
    wx: string = "";
    phone: string = "";

    onEnable() {
        this.qq = "";
        this.wx = "";
        this.phone = "";
        GameData.getGameConfig((config) => {
            let qq = config.customer_qq;
            let wx = config.customer_wx;
            let phone = config.customer_phone;
            if (qq && qq.value != "0") {
                this.qqNode.getChildByName("Value").getComponent(Label).string = qq.value;
                this.qq = qq.value;
                this.qqNode.active = true;
            }
            if (wx && wx.value != "0") {
                this.wxNode.getChildByName("Value").getComponent(Label).string = wx.value;
                this.wx = wx.value;
                this.wxNode.active = true;
            }
            if (phone && phone.value != "0") {
                this.phoneNode.getChildByName("Value").getComponent(Label).string = phone.value;
                this.phone = phone.value;
                this.phoneNode.active = true;
            }
        }, () => {

        })
    }

    onBtnCopy(e, param) {
        switch (param) {
            case "qq":
                Util.onCopyLink(this.qq);
                break;
            case "wx":
                Util.onCopyLink(this.wx);
                break;
            case "phone":
                Util.onCopyLink(this.phone);
                break;
        }
        TipsManager.getInstance().showTips("复制成功");
    }


    onBtnClose() {
        UIManager.getInstance().hideUI(UILayer.CUSTOMER);
    }
}


