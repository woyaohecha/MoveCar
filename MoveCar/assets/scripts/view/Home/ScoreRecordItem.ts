import { _decorator, Component, Node, Label } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ScoreRecordItem')
export class ScoreRecordItem extends Component {

    init(data: any) {
        let operation = this.node.getChildByName("Operation");
        let typeLabel = this.node.getChildByName("Type").getChildByName("Value").getComponent(Label);
        let timeLabel = this.node.getChildByName("Time").getChildByName("Value").getComponent(Label);
        let otherLabel = this.node.getChildByName("Other").getChildByName("Value").getComponent(Label);
        let scoreLabel = this.node.getChildByName("Score").getComponent(Label);

        operation.getChildByName("Get").active = data.operation == 1;
        operation.getChildByName("Pay").active = data.operation == 2;
        typeLabel.string = data.type;
        timeLabel.string = data.time;
        otherLabel.string = data.other;
        scoreLabel.string = data.score + "积分";
    }
}


