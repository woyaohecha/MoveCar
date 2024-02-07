import { _decorator, Component, Node, Label, Prefab, resources, instantiate, NodeEventType, EventTouch, UITransform } from 'cc';
import { ResConfig } from '../../config/ResConfig';
import { GameData } from '../../data/GameData';
import { HttpManager } from '../../manager/HttpManager';
import { TipsManager } from '../../manager/TipsManager';
import { UILayer, UIManager } from '../../manager/UIManager';
import { CashItem } from './CashItem';
import { HomePage } from './HomePage';
const { ccclass, property } = _decorator;

@ccclass('CashOutView')
export class CashOutView extends Component {

    @property(Label)
    goldLabel: Label = null;

    @property(Label)
    cashLabel: Label = null;

    @property(Node)
    cashItemPanel: Node = null;

    cashItemPrefab: Prefab = null;
    private _selectItem: CashItem = null;
    private _rate: number = 100;
    private _money: number = 0;
    private _hasPassword: boolean = false;

    onEnable() {
        console.log(this.node)
        this._selectItem = null;
        this.initBalance();
        this.initCashPanel();
    }

    initBalance() {
        this._hasPassword = false;
        HttpManager.getUserInfo((res) => {
            let data = JSON.parse(res).data;
            this.goldLabel.string = `${data.goldcoin}`;
            this._hasPassword = data.is_payment_password == 1;
            GameData.getGameConfig((config) => {
                this._rate = Number(config.coins_rmb.value);
                this._money = Math.floor(Number(data.goldcoin) / this._rate);
                this.cashLabel.string = `${this._money}`;
            }, () => {
                this._money = 0;
                this.cashLabel.string = `${this._money}`;
            })
        }, () => {
            console.error("---获取用户信息失败");
            this.goldLabel.string = `0`;
            this.cashLabel.string = `0`;
        })
    }

    initCashPanel() {
        if (this.cashItemPanel.children.length > 0) {
            this.cashItemPanel.removeAllChildren();
        }
        if (!this.cashItemPrefab) {
            resources.load(ResConfig.cashItemPrefab, (e, cashPrefab: Prefab) => {
                if (e) {
                    console.log(e);
                    return;
                }
                this.cashItemPrefab = cashPrefab;
                this.initCashPanel();
            })
        } else {
            HttpManager.getCashConfig((res) => {
                let config = JSON.parse(res).data.list;
                if (config.length > 0) {
                    for (let i = 0; i < config.length; i++) {
                        let cashItem = instantiate(this.cashItemPrefab);
                        cashItem.getComponent(CashItem).init(config[i], this._rate);
                        cashItem.on(Node.EventType.TOUCH_START, this.onClickItem, this);
                        this.cashItemPanel.addChild(cashItem);
                        if (i == 0) {
                            this._selectItem = cashItem.getComponent(CashItem);
                        }
                    }
                }
            }, (e) => {
                TipsManager.getInstance().showTips("暂时不能提现");
            })

        }
    }


    onClickItem(e: EventTouch) {
        this._selectItem = e.target.getComponent(CashItem);
        for (let item of this.cashItemPanel.children) {
            let cashItem: CashItem = item.getComponent(CashItem);
            if (cashItem == this._selectItem) {
                cashItem.setItemState(1);
            } else {
                cashItem.setItemState(0);
            }
        }
    }

    onBtnCashOut() {
        if (!this._selectItem) {
            TipsManager.getInstance().showTips("暂时不能提现");
            return;
        }
        if (this._selectItem.money > this._money) {
            TipsManager.getInstance().showTips("可提现余额不足");
            return;
        }
        if (this._hasPassword) {
            console.log("有密码");
            UIManager.getInstance().showUI(UILayer.ACCOUNT_INFO);
        } else {
            console.log("无密码");
            UIManager.getInstance().showUI(UILayer.SET_PASSWORD);
        }

    }

    onBtnClose() {
        UIManager.getInstance().hideUI(UILayer.CASH_OUT);
    }
}


