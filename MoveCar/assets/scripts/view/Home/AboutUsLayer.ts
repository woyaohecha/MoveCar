import { _decorator, Component, Node, Label, Acceleration } from 'cc';
import { GameData } from '../../data/GameData';
import { TipsManager } from '../../manager/TipsManager';
import { UILayer, UIManager } from '../../manager/UIManager';
import { Util } from '../../Util';
const { ccclass, property } = _decorator;

@ccclass('AboutUsLayer')
export class AboutUsLayer extends Component {
    @property(Label)
    des: Label = null;


    onEnable() {
        GameData.getGameConfig((config) => {
            this.des.string = config.about_us.value;
        }, () => {

        })
    }


    onBtnClose() {
        UIManager.getInstance().hideUI(UILayer.ABOUT_US);
    }
}


