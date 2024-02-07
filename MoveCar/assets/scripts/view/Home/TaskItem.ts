import { _decorator, Component, Node, Prefab, resources, instantiate, Label, Button } from 'cc';
import { ResConfig } from '../../config/ResConfig';
import { GameData } from '../../data/GameData';
import { UserData } from '../../data/UserData';
import { HttpManager } from '../../manager/HttpManager';
import { TipsManager } from '../../manager/TipsManager';
const { ccclass, property } = _decorator;

@ccclass('TaskItem')
export class TaskItem extends Component {

    taskData: any = null;

    init(taskData: any, level?: number) {
        this.taskData = taskData;

        this.node.getChildByName("TaskId").getComponent(Label).string = taskData.id;
        this.node.getChildByName("Des").getComponent(Label).string = taskData.content;

        let value: any = null;
        switch (taskData.name) {
            case "分享游戏":
                // value = Number(UserData.getInstance().shared);
                value = 1;
                break;
            case "在线时长":
                value = Math.floor(UserData.getInstance().onlineTimer / 60);
                break;
            case "通关次数":
                value = UserData.getInstance().passCount;
                break;
            case "通关游戏":
                value = level + 1;
                break;
            default:
                break;
        }
        this.node.getChildByName("Percent").getComponent(Label).string = `（${value} /${taskData.maximum} ）`;

        this.node.getChildByName("Gold").getChildByName("Value").getComponent(Label).string = `x${taskData.reward_value}`

        let btns = this.node.getChildByName("Btn");
        btns.getChildByName("Already").active = taskData.is_check == 1;
        btns.getChildByName("Can").active = (taskData.is_check == 0 && value >= taskData.maximum);
        btns.getChildByName("No").active = (taskData.is_check == 0 && value < taskData.maximum);
    }


    /**
     * 设置按钮状态
     * @param state 0未完成 1可领取 2已领取 
     */
    setBtnState(state: number) {
        let btns = this.node.getChildByName("Btn");
        btns.getChildByName("Already").active = state == 2;
        btns.getChildByName("Can").active = state == 1;
        btns.getChildByName("No").active = state == 0;
    }


    onCompletedTask(e) {
        console.log(this.taskData.id);
        HttpManager.completeTask(this.taskData.id, (res) => {
            console.log("完成任务", res);
            TipsManager.getInstance().showTips(`完成任务,获得金币x${this.taskData.reward_value}`);
            this.setBtnState(2);
        }, (e) => {
            console.error("领取失败", e);
            TipsManager.getInstance().showTips(`领取失败`);
        })
    }
}


