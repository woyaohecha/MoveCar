import { _decorator, Component, Node, Label } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('CashRecordItem')
export class CashRecordItem extends Component {

    init(data: any) {
        let toLabel = this.node.getChildByName("To").getChildByName("Value").getComponent(Label);
        let goldLabel = this.node.getChildByName("Gold").getChildByName("Value").getComponent(Label);
        let timeLabel = this.node.getChildByName("Time").getChildByName("Value").getComponent(Label);
        let reasonLabel = this.node.getChildByName("Reason").getChildByName("Value").getComponent(Label);
        let success = this.node.getChildByName("Result").getChildByName("Success");
        let fail = this.node.getChildByName("Result").getChildByName("Fail");
        let moneyLabel = this.node.getChildByName("Result").getChildByName("Value").getComponent(Label);

        toLabel.string = data.to;
        goldLabel.string = data.gold;
        timeLabel.string = data.time;
        reasonLabel.string = data.reason;
        success.active = data.result == "成功";
        fail.active = data.result == "失败";
        moneyLabel.string = data.money;
    }
}


