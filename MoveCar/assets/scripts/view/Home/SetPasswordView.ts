import { _decorator, Component, Node, EditBox, Label } from 'cc';
import { HttpManager } from '../../manager/HttpManager';
import { TipsManager } from '../../manager/TipsManager';
import { UILayer, UIManager } from '../../manager/UIManager';
const { ccclass, property } = _decorator;

@ccclass('SetPassword')
export class SetPassword extends Component {
    @property(EditBox)
    putEdit: EditBox = null;

    @property(EditBox)
    confirmEdit: EditBox = null;

    @property(Node)
    putBoxPanel: Node = null;

    @property(Node)
    confirmBoxPanel: Node = null;

    private _put: string = "";
    private _confirm: string = "";

    onEnable() {
        for (let box of this.putBoxPanel.children) {
            box.getChildByName("Value").getComponent(Label).string = ``;
        }
        for (let box of this.confirmBoxPanel.children) {
            box.getChildByName("Value").getComponent(Label).string = ``;
        }
        this._put = "";
        this._confirm = "";
    }


    onPutEditChange(editBox) {
        let str = editBox;
        if (str.length >= 0) {
            for (let i = 0; i < this.putBoxPanel.children.length; i++) {
                this.putBoxPanel.children[i].getChildByName("Value").getComponent(Label).string = str[i];
            }
        } else {
            for (let i = 0; i < this.putBoxPanel.children.length; i++) {
                this.putBoxPanel.children[i].getChildByName("Value").getComponent(Label).string = ``;
            }
        }
        this._put = str;
    }


    onConfirmEditChange(editBox) {
        let str = editBox;
        if (str.length >= 0) {
            for (let i = 0; i < this.confirmBoxPanel.children.length; i++) {
                this.confirmBoxPanel.children[i].getChildByName("Value").getComponent(Label).string = str[i];
            }
        } else {
            for (let i = 0; i < this.confirmBoxPanel.children.length; i++) {
                this.confirmBoxPanel.children[i].getChildByName("Value").getComponent(Label).string = ``;
            }
        }
        this._confirm = str;
    }

    onBtnSubmit() {
        TipsManager.getInstance().showLoading("请等待...");
        if (this._put.length < 6) {
            TipsManager.getInstance().hideLoading();
            TipsManager.getInstance().showTips("请重新输入");
            return;
        }
        if (this._put != this._confirm) {
            TipsManager.getInstance().hideLoading();
            TipsManager.getInstance().showTips("密码不一致，请重新输入");
            return;
        }
        console.log("设置提现密码");
        HttpManager.setPassword(this._confirm, () => {
            TipsManager.getInstance().hideLoading();
            TipsManager.getInstance().showTips("提现密码设置成功");
        }, () => {
            TipsManager.getInstance().hideLoading();
            TipsManager.getInstance().showTips("提现密码设置失败");
        })
    }

    onBtnClose() {
        UIManager.getInstance().hideUI(UILayer.SET_PASSWORD);
    }
}


