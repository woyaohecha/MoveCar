import { _decorator, Component, Node, assetManager, resources, Prefab, Root, instantiate, Label } from 'cc';
import { ResConfig } from '../../config/ResConfig';
import { GameData } from '../../data/GameData';
import { UserData } from '../../data/UserData';
import { HttpManager } from '../../manager/HttpManager';
import { UILayer, UIManager } from '../../manager/UIManager';
import { TaskItem } from './TaskItem';
const { ccclass, property } = _decorator;

@ccclass('TaskView')
export class TaskView extends Component {

    @property(Node)
    dailyPanel: Node = null;

    @property(Node)
    achievementPanel: Node = null;

    level: number = -1;
    taskItemPrefab: Prefab = null;

    /**
     * 每次打开任务列表，刷新任务
     */
    onEnable() {
        this.level = -1;
        HttpManager.getTaskList(1, (res) => {
            let data = JSON.parse(res).data.list;
            console.log(data);
            if (data.length > 0) {
                for (let i = 0; i < data.length; i++) {
                    if (data[i].name[4] == "0") {
                        continue;
                    }
                    this.createTask(data[i], this.dailyPanel);
                }
            }
        }, (e) => {
            console.error(e);
        })

        HttpManager.getTaskList(2, (res) => {
            let data = JSON.parse(res).data.list;
            console.log(data);
            if (data.length > 0) {
                for (let i = 0; i < data.length; i++) {
                    this.createTask(data[i], this.achievementPanel);
                }
            }
        }, (e) => {
            console.error(e);
        })
    }

    /**
     * 创建任务
     * @param taskData 任务信息
     * @param parent 任务挂载的父节点
     */
    createTask(taskData: any, parent: Node) {
        if (this.taskItemPrefab) {
            let task = instantiate(this.taskItemPrefab);
            if (taskData.name == "通关游戏") {
                if (this.level == -1) {
                    GameData.getUserLevel((level) => {
                        this.level = level;
                        task.getComponent(TaskItem).init(taskData, level);
                        task.setParent(parent);
                    }, (e) => {

                    })
                } else {
                    task.getComponent(TaskItem).init(taskData, this.level);
                    task.setParent(parent);
                }
            } else {
                if (taskData.name[4] != "0") {
                    task.getComponent(TaskItem).init(taskData);
                    task.setParent(parent);
                }
            }
        } else {
            resources.load(ResConfig.taskPrefabPath, (e, taskPrefab: Prefab) => {
                if (e) {
                    console.log(e);
                    return;
                }
                this.taskItemPrefab = taskPrefab;
                this.createTask(taskData, parent);
            })
        }
    }

    onBtnClose() {
        UIManager.getInstance().hideUI(UILayer.TASK);
    }


    onDisable() {
        this.dailyPanel.removeAllChildren();
        this.achievementPanel.removeAllChildren();
    }
}


