import { director, _decorator } from 'cc';
import { AppConfig } from '../config/AppConfig';
import { ApiUrl, HttpConfig } from '../config/HttpConfig';
import { UserData } from '../data/UserData';
import { TipsManager } from './TipsManager';
const { ccclass, property } = _decorator;

@ccclass('HttpManager')
export class HttpManager {

    /**
     * 请求超时时间
     */
    private static timeout: number = 5000;
    /**
     * 通用http请求方法
     * @param method 方式 get post
     * @param url 地址
     * @param params 参数
     * @param success 成功回调
     */
    private static httpRequest(method: string, url: string, params: object = {}, auth: boolean, success: Function, fail: Function) {
        let xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
                let code = JSON.parse(xhr.responseText).code;
                switch (code) {
                    case 1:
                        success(xhr.responseText);
                        break;
                    case 401:
                        TipsManager.getInstance().showTips(JSON.parse(xhr.responseText).msg);
                        if (url == HttpConfig.httpUrl + ApiUrl.AUTO_LOGIN) {
                            fail();
                        } else {
                            UserData.getInstance().onQuit();
                            TipsManager.getInstance().hideLoading();
                            director.loadScene("Loading");
                        }
                        break;
                    default:
                        TipsManager.getInstance().showTips(JSON.parse(xhr.responseText).msg);
                        fail();
                }
            }
            if (xhr.status >= 400) {
                fail();
            }
        };
        xhr.onerror = function (e) {
            console.log(e);
            console.log("err");
            fail(e);
        }
        if (method == "GET") {
            let dataStr = "";
            Object.keys(params).forEach(key => {
                dataStr += key + "=" + encodeURIComponent(params[key]) + "&";
            })
            if (dataStr) {
                dataStr = dataStr.substring(0, dataStr.lastIndexOf("&"));
                url = url + "?" + dataStr;
            }
            xhr.open("GET", url, true);
            xhr.timeout = this.timeout;
            xhr.send();
        } else {
            let data = JSON.stringify(params);
            xhr.open("POST", url, true);
            xhr.setRequestHeader("Content-type", "application/json");
            if (auth) {
                if (url == HttpConfig.httpUrl + ApiUrl.AUTO_LOGIN) {
                    xhr.setRequestHeader("Authorization", "Bearer " + UserData.getInstance().refreshToken)
                } else {
                    xhr.setRequestHeader("Authorization", "Bearer " + UserData.getInstance().accessToken)
                }

            }
            xhr.send(data);
        }

    }

    public static autoLogin(success, fail) {
        let url = HttpConfig.httpUrl + ApiUrl.AUTO_LOGIN;
        let params = {
            game_id: AppConfig.game_id
        }
        this.httpRequest("POST", url, params, true, success, fail);
    }



    /**
     * 发送手机验证码
     * @param phoneNum 
     * @param success 
     * @param fail 
     */
    public static sendPhoneMsg(phoneNum: string, success: Function, fail: Function) {
        let url = HttpConfig.httpUrl + ApiUrl.SEND_MSG;
        let params = {
            mobile: phoneNum,
            sms_type: "login",
            game_id: AppConfig.game_id
        }
        this.httpRequest("POST", url, params, false, success, fail);
    }


    /**
     * 手机验证码登录
     * @param phone 手机号
     * @param code 验证码
     * @param success 
     * @param fail 
     */
    public static login(phone: string, code: string, success: Function, fail: Function) {
        let url = HttpConfig.httpUrl + ApiUrl.LOGIN;
        let params = {
            mobile: phone,
            sms_type: "login",
            game_id: AppConfig.game_id,
            code: code
        }
        this.httpRequest("POST", url, params, false, success, fail);
    }


    /**
     * 获取用户信息
     * @param success 
     * @param fail 
     */
    public static getUserInfo(success: Function, fail: Function) {
        let url = HttpConfig.httpUrl + ApiUrl.USER_INFO;
        let params = {
            game_id: AppConfig.game_id
        }
        this.httpRequest("POST", url, params, true, success, fail);
    }


    public static getMapData(level: number, success: Function, fail: Function) {
        let url = HttpConfig.httpUrl + ApiUrl.GET_MAPDATA;
        let params = {
            game_id: AppConfig.game_id,
            level: level
        }
        this.httpRequest("POST", url, params, true, success, fail);
    }


    /**
     * 通关时调用
     * @param level 当前关卡id
     * @param success 
     * @param fail 
     */
    public static passLevel(level: number, success: Function, fail: Function) {
        let url = HttpConfig.httpUrl + ApiUrl.LEVEL_PASS;
        let params = {
            game_id: AppConfig.game_id,
            level: level
        }
        this.httpRequest("POST", url, params, true, success, fail);
    }


    public static getDouble(level: number, success: Function, fail: Function) {
        let url = HttpConfig.httpUrl + ApiUrl.GET_DOUBLE;
        let params = {
            game_id: AppConfig.game_id,
            barrier_id: level
        }
        this.httpRequest("POST", url, params, true, success, fail);
    }


    /**
     * 获取后台配置的广告列表
     * @param success 
     * @param fail 
     */
    public static getAdList(success: Function, fail: Function) {
        let url = HttpConfig.httpUrl + ApiUrl.AD_LIST;
        let params = {
            game_id: AppConfig.game_id
        }
        this.httpRequest("POST", url, params, false, success, fail);
    }


    /**
     * 获取后台配置的签到列表
     * @param success 
     * @param fail 
     */
    public static getSignList(success: Function, fail: Function) {
        let url = HttpConfig.httpUrl + ApiUrl.SIGN_LIST;
        let params = {
            game_id: AppConfig.game_id
        }
        this.httpRequest("POST", url, params, true, success, fail);
    }


    /**
     * 获取后台配置的抽奖列表
     * @param success 
     * @param fail 
     */
    public static getLotteryList(success: Function, fail: Function) {
        let url = HttpConfig.httpUrl + ApiUrl.LOTTERY_LIST;
        let params = {
            game_id: AppConfig.game_id
        }
        this.httpRequest("POST", url, params, true, success, fail);
    }


    /**
     * 获取后台配置的关卡列表
     * @param success 
     * @param fail 
     */
    public static getLevelList(success: Function, fail: Function) {
        let url = HttpConfig.httpUrl + ApiUrl.LEVEL_LIST;
        let params = {
            game_id: AppConfig.game_id
        }
        this.httpRequest("POST", url, params, true, success, fail);
    }


    /**
     * 获取任务列表
     * @param taskType 1-每日任务 2-成就任务
     * @param success 
     * @param fail 
     */
    public static getTaskList(taskType: number, success: Function, fail: Function) {
        let url = HttpConfig.httpUrl + ApiUrl.TASK_LIST;
        let params = {
            game_id: AppConfig.game_id,
            task_type_id: taskType
        }
        this.httpRequest("POST", url, params, true, success, fail);
    }


    /**
     * 获取其他游戏配置
     * @param success 
     * @param fail 
     */
    public static getGameConfig(success: Function, fail: Function) {
        let url = HttpConfig.httpUrl + ApiUrl.GAME_CONFIG;
        let params = {
            game_id: AppConfig.game_id
        }
        this.httpRequest("POST", url, params, false, success, fail);
    }


    /**
     * 签到
     * @param success 
     * @param fail 
     */
    public static sign(sign_id: string, success: Function, fail: Function) {
        let url = HttpConfig.httpUrl + ApiUrl.CLICK_SIGN;
        let params = {
            game_id: AppConfig.game_id,
            signup_id: sign_id
        }
        this.httpRequest("POST", url, params, true, success, fail);
    }


    /**
     * 抽奖
     * @param success 
     * @param fail 
     */
    public static lottery(success: Function, fail: Function) {
        let url = HttpConfig.httpUrl + ApiUrl.CLICK_LOTTERY;
        let params = {
            game_id: AppConfig.game_id
        }
        this.httpRequest("POST", url, params, true, success, fail);
    }

    /**
     * 完成任务
     * @param taskId 任务id
     * @param success 
     * @param fail 
     */
    public static completeTask(taskId: number, success: Function, fail: Function) {
        let url = HttpConfig.httpUrl + ApiUrl.COMPLETE_TASK;
        let params = {
            game_id: AppConfig.game_id,
            task_id: taskId
        }
        this.httpRequest("POST", url, params, true, success, fail);
    }

    /**
     * 获取提现配置
     * @param success 
     * @param fail 
     */
    public static getCashConfig(success: Function, fail: Function) {
        let url = HttpConfig.httpUrl + ApiUrl.CASH_CONFIG;
        let params = {
            game_id: AppConfig.game_id
        }
        this.httpRequest("POST", url, params, true, success, fail);
    }


    /**
     * 设置提现密码
     * @param password 
     * @param success 
     * @param fail 
     */
    public static setPassword(password: string, success: Function, fail: Function) {
        let url = HttpConfig.httpUrl + ApiUrl.SET_PASSWORD;
        let params = {
            game_id: AppConfig.game_id,
            password: password
        }
        this.httpRequest("POST", url, params, true, success, fail);
    }

    /**
     * 修改提现密码
     * @param password 
     * @param success 
     * @param fail 
     */
    public static newPassword(oldPassword: string, newPassword: string, success: Function, fail: Function) {
        let url = HttpConfig.httpUrl + ApiUrl.NEW_PASSWORD;
        let params = {
            game_id: AppConfig.game_id,
            old_password: oldPassword,
            new_password: newPassword
        }
        this.httpRequest("POST", url, params, true, success, fail);
    }

    /**
     * 发起提现
     * @param success 
     * @param fail 
     */
    public static postCashOut(cashId: number, account: string, username: string, password: string, success: Function, fail: Function) {
        let url = HttpConfig.httpUrl + ApiUrl.POST_CASHOUT;
        let params = {
            game_id: AppConfig.game_id,
            withdrawal_configuration_id: cashId,
            account: account,
            username: username,
            password: password
        }
        this.httpRequest("POST", url, params, true, success, fail);
    }


    /**
     * 获取提现记录
     * @param success 
     * @param fail 
     */
    public static getCashOutRecord(success: Function, fail: Function) {
        let url = HttpConfig.httpUrl + ApiUrl.CASH_RECORD;
        let params = {
            game_id: AppConfig.game_id,
            page: "1"
        }
        this.httpRequest("POST", url, params, true, success, fail);
    }

}


