import { _decorator, Component, Node, Prefab, resources, Label } from 'cc';
import { ResConfig } from '../../config/ResConfig';
import { UserData } from '../../data/UserData';
import { HttpManager } from '../../manager/HttpManager';
import { TipsManager } from '../../manager/TipsManager';
import { UILayer, UIManager } from '../../manager/UIManager';
const { ccclass, property } = _decorator;

@ccclass('SignItem')
export class SignItem extends Component {
    signData: any = null;

    init(signData: any) {
        this.signData = signData;
        this.node.getChildByName("Des").getComponent(Label).string = signData.name;
        this.node.getChildByName("Gold").getChildByName("Value").getComponent(Label).string = `x${signData.reward_value}`
        this.setBtnState(signData.is_check);
    }

    /**
     * 设置按钮状态
     * @param state 0不能签到 1已签到 2可以签到 
     */
    setBtnState(state: number) {
        let btns = this.node.getChildByName("Btn");
        btns.getChildByName("Already").active = state == 1;
        btns.getChildByName("Can").active = state == 2;
        btns.getChildByName("No").active = state == 0;
    }


    onCompletedTask() {
        let sign_id = this.signData.id;
        HttpManager.sign(sign_id, (res) => {
            if (JSON.parse(res).code == 1) {
                TipsManager.getInstance().showTips(`签到成功,获得金币x${this.signData.reward_value}`);
                this.setBtnState(1);
            } else {
                console.error("签到失败", JSON.parse(res).msg);
                TipsManager.getInstance().showTips(`签到失败`);
            }
        }, (e) => {
            console.error("签到失败", e);
            TipsManager.getInstance().showTips(`签到失败`);
        })
    }
}


