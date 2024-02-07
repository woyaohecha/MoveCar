import { _decorator, Component, Node, EditBox, Label } from 'cc';
import { HttpManager } from '../../manager/HttpManager';
import { TipsManager } from '../../manager/TipsManager';
import { UILayer, UIManager } from '../../manager/UIManager';
const { ccclass, property } = _decorator;

@ccclass('EditPasswordView')
export class EditPasswordView extends Component {
    @property(EditBox)
    oldEdit: EditBox = null;

    @property(EditBox)
    newEdit: EditBox = null;

    @property(Node)
    oldBoxPanel: Node = null;

    @property(Node)
    newBoxPanel: Node = null;

    private _old: string = "";
    private _new: string = "";

    onEnable() {
        for (let box of this.oldBoxPanel.children) {
            box.getChildByName("Value").getComponent(Label).string = ``;
        }
        for (let box of this.newBoxPanel.children) {
            box.getChildByName("Value").getComponent(Label).string = ``;
        }
        this._old = "";
        this._new = "";
    }


    onOldEditChange(editBox) {
        let str = editBox;
        if (str.length >= 0) {
            for (let i = 0; i < this.oldBoxPanel.children.length; i++) {
                this.oldBoxPanel.children[i].getChildByName("Value").getComponent(Label).string = str[i];
            }
        } else {
            for (let i = 0; i < this.oldBoxPanel.children.length; i++) {
                this.oldBoxPanel.children[i].getChildByName("Value").getComponent(Label).string = ``;
            }
        }
        this._old = str;
        console.log(str);
    }


    onNewEditChange(editBox) {
        let str = editBox;
        if (str.length >= 0) {
            for (let i = 0; i < this.newBoxPanel.children.length; i++) {
                this.newBoxPanel.children[i].getChildByName("Value").getComponent(Label).string = str[i];
            }
        } else {
            for (let i = 0; i < this.newBoxPanel.children.length; i++) {
                this.newBoxPanel.children[i].getChildByName("Value").getComponent(Label).string = ``;
            }
        }
        this._new = str;
        console.log(str);
    }

    onBtnSubmit() {
        TipsManager.getInstance().showLoading("请等待...");
        if (this._old.length < 6 || this._new.length < 6) {
            TipsManager.getInstance().hideLoading();
            TipsManager.getInstance().showTips("请重新输入");
            return;
        }
        console.log("修改提现密码");
        HttpManager.newPassword(this._old, this._new, () => {
            TipsManager.getInstance().hideLoading();
            TipsManager.getInstance().showTips("提现密码修改成功");
        }, () => {
            TipsManager.getInstance().hideLoading();
            TipsManager.getInstance().showTips("提现密码修改失败");
        })
    }

    onBtnClose() {
        UIManager.getInstance().hideUI(UILayer.EDIT_PASSWORD);
    }
}


