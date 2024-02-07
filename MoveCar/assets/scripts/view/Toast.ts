import { _decorator, Component, Node } from 'cc';
import { TipsManager } from '../manager/TipsManager';
const { ccclass, property } = _decorator;

@ccclass('Toast')
export class Toast extends Component {

    msgManager: TipsManager;


    start() {
        this.msgManager = TipsManager.getInstance();
    }

    onClose() {
        this.msgManager.hideToast();
    }
}


