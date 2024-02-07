import { _decorator, Component, Node, math, Vec2, v2 } from 'cc';
import { HttpManager } from '../manager/HttpManager';
import { UserData } from './UserData';
const { ccclass, property } = _decorator;

@ccclass('GameData')
export class GameData {


    private static _levelList: any[] = [];

    /**
     * 获取关卡数据
     * @param success 返回关卡数据
     * @param fail 
     */
    public static getLevelData(level: number, success: Function, fail: Function) {
        let levelData;
        if (this._levelList.length == 0) {
            HttpManager.getLevelList((res) => {
                this._levelList = JSON.parse(res).data.list;
                this.getLevelData(level, success, fail);
            }, (e) => {
                console.log(e);
                fail();
            })
        } else {
            if (level >= this._levelList.length) {
                levelData = this._levelList[level % this._levelList.length]
            } else {
                levelData = this._levelList[level];
            }
            success(levelData);
        }

    }


    private static _taskData: any[] = [];
    public static passLevel(success: Function, fail: Function) {
        if (UserData.getInstance().level + 14 > 19) {
            fail();
            return;
        }
        if (this._taskData.length == 0) {
            HttpManager.getTaskList(1, (res) => {
                let data = JSON.parse(res).data.list;
                console.log(data);
                if (data.length > 0) {
                    for (let i = 0; i < data.length; i++) {
                        if (data[i].name[4] == "0") {
                            this._taskData[Number(data[i].name[5]) - 1] = data[i];
                        }
                    }
                    this.passLevel(success, fail);
                }
            }, (e) => {
                console.error(e);
            })
        } else {
            console.log(this._taskData[UserData.getInstance().level].id);
            HttpManager.completeTask(this._taskData[UserData.getInstance().level].id, (res) => {
                success();
            }, (e) => {
                fail();
                console.error("领取失败", e);
            })
        }


    }

    private static _gameConfig: any = null;
    public static getGameConfig(success: Function, fail: Function) {
        if (!this._gameConfig) {
            HttpManager.getGameConfig((res) => {
                this._gameConfig = JSON.parse(res).data.list;
                console.log("_gameConfig:", this._gameConfig)
                this.getGameConfig(success, fail);
            }, (e) => {
                console.error(e);
                fail();
            })
        } else {
            success(this._gameConfig);
        }
    }

    public static getUserLevel(success: Function, fail: Function) {
        console.log("level", UserData.getInstance().level);
        success(UserData.getInstance().level);
    }

    public static getLevelMapData(level?: number) {
        let row = level * 3 + 4 > 17 ? 17 : level * 3 + 4;
        let col = level * 2 + 4 > 10 ? 10 : level * 2 + 4;
        let data = [];
        let temp = 1;
        for (let i = 0; i < row; i++) {
            data[i] = [];
            for (let j = 0; j < col; j++) {
                data[i][j] = 0;
            }
        }
        for (let i = 0; i < row; i++) {
            let dir = Math.random() > 0.5 ? 1 : -1;
            for (let j = 0; j < col - 1; j++) {
                if (Math.random() > 0.7) {
                    data[i][j] = dir * temp;
                    data[i][j + 1] = dir * temp;
                    temp++;
                    j++;
                }
            }
        }
        for (let i = 0; i < col; i++) {
            let dir = Math.random() > 0.5 ? 1 : -1;
            for (let j = 0; j < row - 1; j++) {
                if (Math.random() > 0 && data[j][i] == 0 && data[j + 1][i] == 0) {
                    data[j][i] = dir * temp;
                    data[j + 1][i] = dir * temp;
                    temp++;
                    j++;
                }
            }

        }
        // this.visited = [];
        // for (let i = 0; i < 17; i++) {
        //     for (let j = 0; j < 9; j++) {
        //         console.log("start:", [i, j], this.visited.length);
        //         let dataa = this.checkData2(data, i, j)
        //         console.log([i, j], "end:", this.checkData2(data, i, j), data.length);
        //         if (dataa) {
        //             this._quesitionLocation.push(dataa);
        //         }
        //     }
        // }
        // console.log(this._quesitionLocation)
        console.log(data);
        console.log(JSON.stringify(data));
        return data;
    }

    private static visited: any[] = [];
    public static checkData(data, i, j) {
        console.log("check:", [i, j], data[i][j]);
        if (this.visited.includes(data[i][j])) {
            this.visited = [];
            return [i, j];
        } else {
            if (data[i][j] != 0) {
                if (i - 1 > 0 && data[i][j] == data[i - 1][j]) {
                    //竖向 向上找到了另一段
                    if (data[i][j] < 0) {
                        //车头是data[i][j] 方向下
                        this.visited.push(data[i][j])
                        if (i + 1 < 17) {
                            this.checkData(data, i + 1, j);
                            // if (j - 1 > 0 && data[i + 1][j - 1] == data[i + 1][j] && data[i + 1][j] > 0) {
                            //     //车头顶着左向的车头 需要再向左check一格
                            //     this.checkData(data, i + 1, j - 1)
                            // } else if (j + 1 < 10 && data[i + 1][j + 1] == data[i + 1][j] && data[i + 1][j] < 0) {
                            //     this.checkData(data, i + 1, j + 1)
                            // }
                        } else {
                            this.visited = [];
                            return null;
                        }
                    } else {
                        //车头是data[i-1][j]
                        // this.visited.push(data[i - 1][j])
                        if (i - 2 > 0) {
                            this.checkData(data, i - 2, j);
                        } else {
                            this.visited = [];
                            return null;
                        }
                    }
                } else if (i + 1 < 17 && data[i][j] == data[i + 1][j]) {
                    //竖向 向下找到了另一段
                    if (data[i][j] > 0) {
                        //车头是data[i][j] 方向上
                        this.visited.push(data[i][j])
                        if (i - 1 > 0) {
                            this.checkData(data, i - 1, j);
                        } else {
                            this.visited = [];
                            return null;
                        }
                    } else {
                        //车头是data[i+1][j]
                        // this.visited.push(data[i + 1][j])
                        if (i + 2 < 17) {
                            this.checkData(data, i + 2, j);
                        } else {
                            this.visited = [];
                            return null;
                        }
                    }
                } else if (j - 1 > 0 && data[i][j] == data[i][j - 1]) {
                    //横向 向左找到了另一段
                    if (data[i][j] < 0) {
                        //车头是data[i][j] 方向左
                        this.visited.push(data[i][j])
                        if (j + 1 < 10) {
                            this.checkData(data, i, j + 1);
                        } else {
                            this.visited = [];
                            return null;
                        }
                    } else {
                        //车头是data[i][j-1]
                        // this.visited.push(data[i][j - 1])
                        if (j - 2 > 0) {
                            this.checkData(data, i, j - 2);
                        } else {
                            this.visited = [];
                            return null;
                        }
                    }

                } else if (j + 1 < 10 && data[i][j] == data[i][j + 1]) {
                    //横向 向右找到了另一段 方向右
                    if (data[i][j] > 0) {
                        //车头是data[i][j]
                        this.visited.push(data[i][j])
                        if (j - 1 > 0) {
                            this.checkData(data, i, j - 1);
                        } else {
                            this.visited = [];
                            return null;
                        }
                    } else {
                        //车头是data[i][j+1]
                        // this.visited.push(data[i][j + 1])
                        if (j + 2 < 10) {
                            this.checkData(data, i, j + 2);
                        } else {
                            this.visited = [];
                            return null;
                        }
                    }

                } else {
                    this.visited = [];
                    return null;
                }
            } else {
                this.visited = [];
                return null;
            }
        }

    }

    private static checked: any[] = [];
    public static checkData2(data, i, j, next?) {
        console.log("check:", [i, j], data[i][j]);
        if (this.visited.includes(data[i][j])) {
            this.visited = [];
            console.log("---------------");
            return data[i][j];
        } else {
            if (data[i][j] != 0) {
                if (i - 1 > 0 && data[i][j] == data[i - 1][j]) {
                    //竖向 向上找到了另一段
                    if (data[i][j] < 0) {
                        //车头是data[i][j] 方向下
                        this.visited.push(data[i][j])
                        if (i + 1 < 17) {
                            if ((j - 1 > 0 && data[i + 1][j - 1] == data[i + 1][j]) || (j + 1 < 10 && data[i + 1][j + 1] == data[i + 1][j])) {
                                //车头顶着横向的车头 需要多check一格
                                this.checkData2(data, i + 1, j, true)
                            } else {
                                this.checkData2(data, i + 1, j);
                            }
                        } else {
                            if (next && i + 2 < 17) {
                                this.checkData2(data, i + 2, j);
                            } else {
                                this.visited = [];
                                return null;
                            }
                        }
                    } else {
                        //车头是data[i-1][j] 方向上
                        // this.visited.push(data[i - 1][j])
                        if (i - 2 > 0) {
                            this.checkData2(data, i - 2, j);
                        } else {
                            this.visited = [];
                            return null;
                        }
                    }
                } else if (i + 1 < 17 && data[i][j] == data[i + 1][j]) {
                    //竖向 向下找到了另一段
                    if (data[i][j] > 0) {
                        //车头是data[i][j] 方向上
                        this.visited.push(data[i][j])
                        if (i - 1 > 0) {
                            if ((j - 1 > 0 && data[i - 1][j - 1] == data[i - 1][j]) || (j + 1 < 10 && data[i - 1][j + 1] == data[i - 1][j])) {
                                //车头顶着横向的车头 需要多check一格
                                this.checkData2(data, i - 1, j, true)
                            } else {
                                this.checkData2(data, i - 1, j);
                            }
                            // this.checkData(data, i - 1, j);
                        } else {
                            if (next && i - 2 > 0) {
                                this.checkData2(data, i - 2, j);
                            } else {
                                this.visited = [];
                                return null;
                            }

                        }
                    } else {
                        //车头是data[i+1][j]
                        // this.visited.push(data[i + 1][j])
                        if (i + 2 < 17) {
                            this.checkData2(data, i + 2, j);
                        } else {
                            this.visited = [];
                            return null;
                        }
                    }
                } else if (j - 1 > 0 && data[i][j] == data[i][j - 1]) {
                    //横向 向左找到了另一段
                    if (data[i][j] < 0) {
                        //车头是data[i][j] 方向右
                        this.visited.push(data[i][j])
                        if (j + 1 < 10) {
                            if ((i - 1 > 0 && data[i - 1][j + 1] == data[i][j + 1]) || (i + 1 < 17 && data[i + 1][j + 1] == data[i][j + 1])) {
                                //车头顶着竖向的车头 需要多check一格
                                this.checkData2(data, i, j + 1, true);
                            } else {
                                this.checkData2(data, i, j + 1);
                            }
                            // this.checkData2(data, i, j + 1);
                        } else {
                            if (next && j + 2 < 10) {
                                this.checkData2(data, i, j + 2);
                            } else {
                                this.visited = [];
                                return null;
                            }
                        }
                    } else {
                        //车头是data[i][j-1]
                        // this.visited.push(data[i][j - 1])
                        if (j - 2 > 0) {
                            this.checkData2(data, i, j - 2);
                        } else {
                            this.visited = [];
                            return null;
                        }
                    }

                } else if (j + 1 < 10 && data[i][j] == data[i][j + 1]) {
                    //横向 向右找到了另一段 方向左
                    if (data[i][j] > 0) {
                        //车头是data[i][j]
                        this.visited.push(data[i][j])
                        if (j - 1 > 0) {
                            if ((i - 1 > 0 && data[i - 1][j - 1] == data[i][j - 1]) || (i + 1 < 17 && data[i + 1][j - 1] == data[i][j - 1])) {
                                //车头顶着竖向的车头 需要多check一格
                                this.checkData2(data, i, j - 1, true);
                            } else {
                                this.checkData2(data, i, j - 1);
                            }
                            // this.checkData(data, i, j - 1);
                        } else {
                            if (next && j - 2 > 0) {
                                this.checkData2(data, i, j - 2);
                            } else {
                                this.visited = [];
                                return null;
                            }

                        }
                    } else {
                        //车头是data[i][j+1]
                        // this.visited.push(data[i][j + 1])
                        if (j + 2 < 10) {
                            this.checkData2(data, i, j + 2);
                        } else {
                            this.visited = [];
                            return null;
                        }
                    }

                } else {
                    this.visited = [];
                    return null;
                }
            } else {
                this.visited = [];
                return null;
            }
        }

    }
}


