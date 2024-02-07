import { _decorator, Component, Node, Prefab, instantiate, resources } from 'cc';
import { ResConfig } from '../../config/ResConfig';
import { HttpManager } from '../../manager/HttpManager';
import { UILayer, UIManager } from '../../manager/UIManager';
import { CashRecordItem } from './CashRecordItem';
import { ScoreRecordItem } from './ScoreRecordItem';
import { ShopItem } from './ShopItem';
const { ccclass, property } = _decorator;

@ccclass('ShopLayer')
export class ShopLayer extends Component {
    @property(Node)
    shopPanel: Node = null;
    @property(Node)
    tips: Node = null;

    shopItemPrefab: Prefab = null;

    testData = [
        {
            id: 0,
            itemName: "一号货物",
            price: 2200,
            restCount: 12,
            imgUrl: "uid:19452146"
        }, {
            id: 1,
            itemName: "二号货物",
            price: 4100,
            restCount: 0,
            imgUrl: "uid:19452146"
        }, {
            id: 2,
            itemName: "三号货物",
            price: 6200,
            restCount: 23,
            imgUrl: "uid:19452146"
        }, {
            id: 3,
            itemName: "四号货物",
            price: 8400,
            restCount: 11,
            imgUrl: "uid:19452146"
        }, {
            id: 4,
            itemName: "五号货物",
            price: 9900,
            restCount: 32,
            imgUrl: "uid:19452146"
        }, {
            id: 5,
            itemName: "六号货物",
            price: 2000,
            restCount: 108,
            imgUrl: "uid:19452146"
        }, {
            id: 6,
            itemName: "七号货物",
            price: 2000,
            restCount: 21,
            imgUrl: "uid:19452146"
        }
    ]

    onEnable() {
        this.initPanel();
    }


    initPanel() {
        this.shopPanel.removeAllChildren();
        if (this.shopItemPrefab) {
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
                let recordItem = instantiate(this.shopItemPrefab);
                recordItem.getComponent(ShopItem).init(this.testData[i]);
                this.shopPanel.addChild(recordItem);
            }
        } else {
            resources.load(ResConfig.shopItemPrefab, (e, prefab: Prefab) => {
                if (e) {
                    console.log(e);
                    return;
                }
                this.shopItemPrefab = prefab;
                this.initPanel();
            })
        }
    }


    onBtnClose() {
        UIManager.getInstance().hideUI(UILayer.SHOP);
    }
}


