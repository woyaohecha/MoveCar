import { _decorator, Component, Node, Prefab, instantiate, resources } from 'cc';
import { ResConfig } from '../../config/ResConfig';
import { HttpManager } from '../../manager/HttpManager';
import { UILayer, UIManager } from '../../manager/UIManager';
import { CashRecordItem } from './CashRecordItem';
const { ccclass, property } = _decorator;

@ccclass('CashRecordLayer')
export class CashRecordLayer extends Component {
    @property(Node)
    recordPanel: Node = null;
    @property(Node)
    tips: Node = null;

    recordItemPrefab: Prefab = null;

    onEnable() {
        this.initPanel();
    }


    initPanel() {
        this.recordPanel.removeAllChildren();
        if (this.recordItemPrefab) {
            HttpManager.getCashOutRecord((res) => {
                console.log(res);
                let data = JSON.parse(res).data.list;
                if (data.length > 0) {
                    this.tips.active = false;
                } else {
                    this.tips.active = true;
                }
            }, (e) => {
                this.tips.active = true;
            })
        } else {
            resources.load(ResConfig.cashRecordItemPrefab, (e, prefab: Prefab) => {
                if (e) {
                    console.log(e);
                    return;
                }
                this.recordItemPrefab = prefab;
                this.initPanel();
            })
        }
        // if (this.testData.length > 0) {
        //     if (this.recordItemPrefab) {
        //         for (let i = 0; i < this.testData.length; i++) {
        //             let recordItem = instantiate(this.recordItemPrefab);
        //             recordItem.getComponent(CashRecordItem).init(this.testData[i]);
        //             this.recordPanel.addChild(recordItem);
        //         }
        //     } else {

        //     }
        // }
    }

    onBtnClose() {
        UIManager.getInstance().hideUI(UILayer.CASH_RECORD);
    }
}


