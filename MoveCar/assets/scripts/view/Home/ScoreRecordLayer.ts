import { _decorator, Component, Node, Prefab, instantiate, resources } from 'cc';
import { ResConfig } from '../../config/ResConfig';
import { HttpManager } from '../../manager/HttpManager';
import { UILayer, UIManager } from '../../manager/UIManager';
import { CashRecordItem } from './CashRecordItem';
import { ScoreRecordItem } from './ScoreRecordItem';
const { ccclass, property } = _decorator;

@ccclass('ScoreRecordLayer')
export class ScoreRecordLayer extends Component {
    @property(Node)
    recordPanel: Node = null;
    @property(Node)
    tips: Node = null;

    recordItemPrefab: Prefab = null;

    testData = [
        {
            id: 0,
            operation: 1,
            type: "积分互转",
            time: "2024-2-5 23:12:16",
            other: "uid:19452146",
            score: 12
        }, {
            id: 1,
            operation: 2,
            type: "积分互转",
            time: "2024-2-5 23:12:16",
            other: "uid:19452146",
            score: 15
        }, {
            id: 2,
            operation: 1,
            type: "单人闯关奖励",
            time: "2024-2-5 23:12:16",
            other: "官方",
            score: 23
        }, {
            id: 3,
            operation: 1,
            type: "团队比赛奖励",
            other: "官方",
            time: "2024-2-5 23:12:16",
            score: 52
        }, {
            id: 4,
            operation: 1,
            type: "奖励发放",
            other: "官方",
            time: "2024-2-5 23:12:16",
            score: 100
        }, {
            id: 5,
            operation: 2,
            type: "商城兑换",
            other: "官方",
            time: "2024-2-5 23:12:16",
            score: 80
        }, {
            id: 5,
            operation: 1,
            type: "佣金收入",
            other: "uid:54124173",
            time: "2024-2-5 23:12:16",
            score: 5
        }
    ]

    onEnable() {
        this.initPanel();
    }


    initPanel() {
        this.recordPanel.removeAllChildren();
        if (this.recordItemPrefab) {
            // HttpManager.getCashOutRecord((res) => {
            //     console.log(res);
            //     let data = JSON.parse(res).data.list;
            //     if (data.length > 0) {
            //         this.tips.active = false;
            //     } else {
            //         this.tips.active = true;
            //     }
            // }, (e) => {
            //     this.tips.active = true;
            // })
            this.tips.active = this.testData.length == 0;
            for (let i = 0; i < this.testData.length; i++) {
                let recordItem = instantiate(this.recordItemPrefab);
                recordItem.getComponent(ScoreRecordItem).init(this.testData[i]);
                this.recordPanel.addChild(recordItem);
            }
        } else {
            resources.load(ResConfig.scoreRecordItemPrefab, (e, prefab: Prefab) => {
                if (e) {
                    console.log(e);
                    return;
                }
                this.recordItemPrefab = prefab;
                this.initPanel();
            })
        }
    }

    onBtnClose() {
        UIManager.getInstance().hideUI(UILayer.SCORE_RECORD);
    }
}


