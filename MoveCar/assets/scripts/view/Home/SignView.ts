import { _decorator, Component, Node, Prefab, instantiate, resources } from 'cc';
import { ResConfig } from '../../config/ResConfig';
import { HttpManager } from '../../manager/HttpManager';
import { UILayer, UIManager } from '../../manager/UIManager';
import { SignItem } from './SignItem';
const { ccclass, property } = _decorator;

@ccclass('SignView')
export class SignView extends Component {
    @property(Node)
    panel: Node = null;

    signItemPrefab: Prefab = null;

    /**
     * 每次打开签到列表，刷新签到
     */
    onEnable() {
        HttpManager.getSignList((res) => {
            let data = JSON.parse(res).data.list;
            if (data.length > 0) {
                for (let i = 0; i < data.length; i++) {
                    this.createSign(data[i], this.panel);
                }
            }
        }, (e) => {
            console.error(e);
        })
    }

    /**
     * 创建签到
     * @param signData 签到信息
     * @param parent 签到挂载的父节点
     */
    createSign(signData: any, parent: Node) {
        if (this.signItemPrefab) {
            let signItem = instantiate(this.signItemPrefab);
            signItem.getComponent(SignItem).init(signData);
            signItem.setParent(parent);
        } else {
            resources.load(ResConfig.signPrefabPath, (e, signPrefab: Prefab) => {
                if (e) {
                    console.log(e);
                    return;
                }
                this.signItemPrefab = signPrefab;
                this.createSign(signData, parent);
            })
        }


    }

    onBtnClose() {
        UIManager.getInstance().hideUI(UILayer.SIGN);
    }


    onDisable() {
        this.panel.removeAllChildren();
    }
}


