import { _decorator, Component, Node, Label, Sprite } from 'cc';
import { TipsManager } from '../../manager/TipsManager';
const { ccclass, property } = _decorator;

@ccclass('ShopItem')
export class ShopItem extends Component {

    itemId: number = 0;
    restCount: number = 0;

    init(data: any) {
        let nameLabel = this.node.getChildByName("Name").getComponent(Label);
        let img = this.node.getChildByName("Img").getComponent(Sprite);
        let restLabel = this.node.getChildByName("Rest").getChildByName("Value").getComponent(Label);
        let priceLabel = this.node.getChildByName("BtnBuy").getChildByName("Price").getComponent(Label);

        this.itemId = data.id;
        this.restCount = data.restCount;
        nameLabel.string = data.itemName;
        restLabel.string = `剩余${data.restCount}件`;
        priceLabel.string = data.price;
    }



    onBtnBuy() {
        if (this.restCount == 0) {
            TipsManager.getInstance().showTips("库存不足,兑换失败");
        } else {
            TipsManager.getInstance().showTips("金币不足,兑换失败");
        }
    }
}


