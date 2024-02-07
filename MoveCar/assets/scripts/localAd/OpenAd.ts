import { _decorator, Component, Node, Sprite, SpriteFrame, Label } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('OpenAd')
export class OpenAd extends Component {

    private _adSp: Sprite = null;

    onShow(sp: SpriteFrame, showTime: number, clicked: Function) {
        console.log("openAd onShow")
        if (!this._adSp) {
            this._adSp = this.node.getChildByName("Img").getComponent(Sprite);
        }
        let timeCountLabel = this.node.getChildByName("CloseTips").getChildByName("Time").getComponent(Label);
        this._adSp.spriteFrame = sp;
        timeCountLabel.string = `${showTime}s后关闭`;
        this._adSp.node.on(Node.EventType.TOUCH_START, clicked, this);
        this.node.active = true;
        let timer = this.schedule(() => {
            showTime--;
            timeCountLabel.string = `${showTime}s后关闭`;
            if (showTime == 0) {
                this.onHide();
                this.unschedule(timer);
            }
        }, 1)
    }

    onHide() {
        console.log("openAd onHide")
        this._adSp.node.off(Node.EventType.TOUCH_START);
        this.unscheduleAllCallbacks();
        this.node.active = false;
    }
}


