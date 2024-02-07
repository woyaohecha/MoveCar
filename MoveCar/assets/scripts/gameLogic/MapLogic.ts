import { _decorator, Component, Node, Color, Sprite, Prefab, resources, instantiate, v2, v3, CCObject, Vec2 } from 'cc';
import { GameData } from '../data/GameData';
import { UserData } from '../data/UserData';
import { EventManager } from '../manager/EventManager';
import { UIManager } from '../manager/UIManager';
import { CarDir } from './CarLogic';
import { CarPool } from './CarPool';
const { ccclass, property } = _decorator;



@ccclass('MapLogic')
export class MapLogic extends Component {

    private _settle: boolean = false;
    private _start: boolean = false;
    private _levelData: any = null;

    onLoad() {
        EventManager.getInstance().on("initGame", this.initMap, this);
        EventManager.getInstance().on("checkFail", this.checkFail, this);
        EventManager.getInstance().on("updateLevelData", this.updataLevelData, this);
    }

    initMap(race: string) {
        this._settle = false;
        this._start = false;
        let levelData: any = null;
        GameData.getGameConfig((gameConfig) => {
            if (race == "1") {
                levelData = gameConfig.level_6.value;
                console.log("level_6-levelData:", levelData)
                this.initLevelMap(JSON.parse(levelData));
            } else {
                levelData = gameConfig[`level_${UserData.getInstance().level + 1}`].value;
                this.initLevelMap(JSON.parse(levelData));
            }
        }, () => {
            levelData = GameData.getLevelMapData(4);
            this.initLevelMap(levelData);
        })
    }


    update() {
        if (this.node.children.length != 0 && !this._start) {
            this._start = true;
        }
        if (this.node.children.length == 0 && !this._settle && this._start) {
            this._settle = true;
            let passGold = 0;
            GameData.getLevelData(UserData.getInstance().level, (leveData) => {
                console.log("settle");
                passGold = leveData.pass_goldcoin;
                EventManager.getInstance().emit("gameSettle", true, passGold);
            }, () => {

            })

        }
    }


    initLevelMap(levelData) {
        this._levelData = levelData;
        for (let i = 0; i < levelData.length; i++) {
            for (let j = 0; j < levelData[i].length - 1; j++) {
                if (levelData[i][j] != 0 && levelData[i][j] == levelData[i][j + 1]) {
                    let initData = {
                        dir: levelData[i][j] > 0 ? CarDir.LEFT : CarDir.RIGHT,
                        location: [v2(i, j), v2(i, j + 1)],
                        pos: v3((j + 1) * 60 - (levelData[0].length * 60) / 2, (levelData.length * 60) / 2 - (i + i + 1) * 30, 0),
                        parent: this.node
                    }
                    CarPool.getInstance().getCar(initData);
                }
            }
        }

        for (let i = 0; i < levelData[0].length; i++) {
            for (let j = 0; j < levelData.length - 1; j++) {
                if (levelData[j][i] != 0 && levelData[j][i] == levelData[j + 1][i]) {
                    let initData = {
                        dir: levelData[j][i] > 0 ? CarDir.UP : CarDir.DOWN,
                        location: [v2(j, i), v2(j + 1, i)],
                        pos: v3((i + i + 1) * 30 - (levelData[0].length * 60) / 2, (levelData.length * 60) / 2 - (j + 1) * 60, 0),
                        parent: this.node
                    }
                    CarPool.getInstance().getCar(initData);
                }
            }
        }
    }


    updataLevelData(updateLocation: Vec2) {
        this._levelData[updateLocation.x][updateLocation.y] = 0;
    }


    allCantMove: boolean = false;
    checkFail() {
        this.allCantMove = true;
        for (let i = 0; i < this._levelData.length; i++) {
            for (let j = 0; j < this._levelData[i].length; j++) {
                console.log(i, j, this.allCantMove);
                if (this._levelData[i][j] != 0) {
                    if (!(
                        (i - 1 > 0 && this._levelData[i][j] == this._levelData[i - 1][j] && this._levelData[i][j] < 0) && (i + 1 < 17 && this._levelData[i + 1][j] != 0) ||
                        (i + 1 < 17 && this._levelData[i][j] == this._levelData[i + 1][j] && this._levelData[i][j] > 0) && (i - 1 > 0 && this._levelData[i - 1][j] != 0) ||
                        (j - 1 > 0 && this._levelData[i][j] == this._levelData[i][j - 1] && this._levelData[i][j] < 0 && j + 1 < 10 && this._levelData[i][j + 1] != 0) ||
                        (j + 1 < 10 && this._levelData[i][j] == this._levelData[i][j + 1] && this._levelData[i][j] > 0 && j - 1 > 0 && this._levelData[i][j - 1] != 0)
                    )) {
                        console.log("this.allCantMove changed");
                        this.allCantMove = false;
                        return;
                    } else {
                        continue;
                    }
                } else {
                    continue;
                }
            }
            if (i = this._levelData.length && j == this._levelData[i].length && this.allCantMove) {
                console.log("lose---");
            }

        }
        console.log("out for", this.allCantMove);

    }


    getCarPos(levelData, i, j) {
        return v3((i + i + 1) * 30 - (levelData[0].length * 60) / 2, (levelData.length * 60) / 2 - (j + 1) * 60, 0);
    }

    getCarLocation(levelData, pos) {
        return v2(((pos.x + (levelData[0].length * 60) / 2) / 30 - 1) / 2,)
    }


    onDestroy() {
        EventManager.getInstance().off("gameStart", this.initMap, this);
    }
}


