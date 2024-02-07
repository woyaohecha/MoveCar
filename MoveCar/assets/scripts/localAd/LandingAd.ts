import { _decorator, Component, Node, WebView } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('LandingAd')
export class LandingAd extends Component {

    private _webView: WebView = null;
    private _backBtn: Node = null;

    onLoad() {

    }

    onShow(url: string) {
        console.log("LandingAd onShow", url);
        if (!this._webView) {
            this._webView = this.node.getChildByName("WebView").getComponent(WebView);
            this._backBtn = this.node.getChildByName("BtnBack");
            this._backBtn.setSiblingIndex(20);
            this._backBtn.on(Node.EventType.TOUCH_START, this.onBackBtn, this);
        }
        this._webView.url = url;
        this.node.active = true;
    }

    onHide() {
        console.log("LandingAd onHide");
        this.node.active = false;
        this._webView.url = null;
        this._backBtn.off(Node.EventType.TOUCH_START);
    }

    onBackBtn() {
        this.node.active = false;
    }
}


