import { _decorator, Component, Node, Sprite, SpriteFrame, UITransform, Canvas, find, view, v2, size } from 'cc';
import { Util } from '../Util';
const { ccclass, property } = _decorator;

@ccclass('BannerAd')
export class BannerAd extends Component {

    private _adSp: Sprite = null;


    onShow(sp: SpriteFrame, clicked: Function) {
        console.log("bannerAd onShow");
        if (!this._adSp) {
            this._adSp = this.node.getChildByName("Img").getComponent(Sprite);
        }
        let imgSize = Util.getImgAdaptSize(sp);
        this._adSp.node.getComponent(UITransform).setContentSize(imgSize);
        this._adSp.spriteFrame = sp;
        this._adSp.node.setPosition(0, 0);
        this._adSp.node.on(Node.EventType.TOUCH_START, clicked, this);
        this.node.active = true;
    }

    onHide() {
        console.log("bannerAd onHide");
        this._adSp.node.off(Node.EventType.TOUCH_START);
        this.node.active = false;
    }
}


