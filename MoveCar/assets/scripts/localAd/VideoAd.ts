import { _decorator, Component, Node, VideoPlayer, UITransform, size, find, sys, Label } from 'cc';
import { AdManager } from '../manager/AdManager';
import { Util } from '../Util';
const { ccclass, property } = _decorator;

@ccclass('VideoAd')
export class VideoAd extends Component {

    private _videoPlayer: VideoPlayer = null;
    private _closeBtn: Node = null;
    private _timeCountLabel: Label = null;
    private _showCompleted: boolean = false;
    private _onCompleted: Function = null;
    private _canvas: Node = null;


    onShow(videoUrl: string, showTime: number, completed: Function, clicked: Function, fail: Function) {
        console.log("video onShow");
        if (!this._videoPlayer) {
            this._videoPlayer = this.node.getChildByName("VideoPlayer").getComponent(VideoPlayer);
            this._closeBtn = this.node.getChildByName("BtnClose");
            this._timeCountLabel = this._closeBtn.getChildByName("Time").getComponent(Label);
            this._canvas = find("Canvas");
        }
        this._showCompleted = false;
        this._closeBtn.on(Node.EventType.TOUCH_START, this.onCloseBtn, this);
        this._onCompleted = completed;
        this._timeCountLabel.string = `${showTime}s后可关闭`;
        this.node.active = true;
        this.schedule(() => {
            showTime--;
            this._timeCountLabel.string = `${showTime}s后可关闭`;
            if (showTime == 0) {
                this._showCompleted = true;
                this.unscheduleAllCallbacks();
            }
        }, 1)

        this._videoPlayer.remoteURL = videoUrl;
        this._videoPlayer.node.on(VideoPlayer.EventType.READY_TO_PLAY, () => {
            this._canvas.active = false;
            this._videoPlayer.play();
        })
        this._videoPlayer.node.on(VideoPlayer.EventType.COMPLETED, completed)
        this._videoPlayer.node.on(VideoPlayer.EventType.CLICKED, clicked)
        this._videoPlayer.node.on(VideoPlayer.EventType.STOPPED, fail)
        this._videoPlayer.node.on(VideoPlayer.EventType.ERROR, fail)
    }


    onCloseBtn() {
        if (this._showCompleted) {
            this.onHide();
            this._onCompleted();
        }
    }


    onHide() {
        console.log("video onHide");
        this._videoPlayer.remoteURL = null;
        this._videoPlayer.node.off(VideoPlayer.EventType.READY_TO_PLAY)
        this._videoPlayer.node.off(VideoPlayer.EventType.COMPLETED)
        this._videoPlayer.node.off(VideoPlayer.EventType.CLICKED)
        this._videoPlayer.node.off(VideoPlayer.EventType.STOPPED)
        this._videoPlayer.node.off(VideoPlayer.EventType.ERROR)
        this._closeBtn.off(Node.EventType.TOUCH_START);
        this.unscheduleAllCallbacks();
        this._canvas.active = true;
        this.node.active = false;
    }
}


