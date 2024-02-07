import { _decorator, Component, Node, Label } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('CashItem')
export class CashItem extends Component {

    cashId: number = 0;
    restCount: number = 0;
    money: number = 0;

    init(cashData: any, rate: number) {
        this.cashId = cashData.id;
        this.restCount = cashData.accumulated_number;
        this.money = Math.floor(Number(cashData.species) / rate);

        this.node.getChildByName("Value").getComponent(Label).string = `${this.money}元`;
        this.node.getChildByName("Rest").getChildByName("Count").getComponent(Label).string = `剩余${this.restCount}次`;
        this.node.getChildByName("Check").active = cashData.id == 1;
    }

    /**
     * 设置按钮状态
     * @param state 0未选中 1选中 
     */
    setItemState(state: number) {
        this.node.getChildByName("Check").active = state == 1;
    }
}


