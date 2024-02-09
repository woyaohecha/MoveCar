import { _decorator } from 'cc';
const { ccclass, property } = _decorator;

export const enum ApiUrl {
    /**
     * 发送短信
     */
    SEND_MSG = "sms/send",
    /**
     * 登录
     */
    LOGIN = "mobile_login",
    /**
     * 自动登录
     */
    AUTO_LOGIN = "refreshToken",
    /**
     * 获取用户信息
     */
    USER_INFO = "userinfo",
    /**
     * 获取提现记录
     */
    CASH_RECORD = "WithdrawalRecords",
    /**
     * 设置提现密码
     */
    SET_PASSWORD = "PaymentPasswordSettings",
    /**
     * 修改提现密码
     */
    NEW_PASSWORD = "new_password",
    /**
     * 获取提现配置
     */
    CASH_CONFIG = "withdrawal_index",
    /**
     * 发起提现
     */
    POST_CASHOUT = "withdrawal",
    /**
     * 获取地图数据
     */
    GET_MAPDATA = "get_map",
    /**
     * 通关成功
     */
    LEVEL_PASS = "pass_level",
    /**
     * 双倍领取
     */
    GET_DOUBLE = "game/superposition",
    /**
     * 广告列表
     */
    AD_LIST = "ad/list",
    /**
     * 签到列表
     */
    SIGN_LIST = "game/signup",
    /**
     * 抽奖列表
     */
    LOTTERY_LIST = "game/raffle",
    /**
     * 关卡列表
     */
    LEVEL_LIST = "game/barrier",
    /**
     * 系统配置
     */
    GAME_CONFIG = "game/config",
    /**
     * 任务列表
     */
    TASK_LIST = "job/list",
    /**
     * 点击签到
     */
    CLICK_SIGN = "clickCheck",
    /**
     * 点击抽奖
     */
    CLICK_LOTTERY = "raffle",
    /**
     * 完成任务
     */
    COMPLETE_TASK = "taskRewardCollection"
}

/**
 * 网络接口相关url配置
 */
@ccclass('HttpConfig')
export class HttpConfig {
    /**
     * 接口地址
     */
    public static readonly httpUrl: string = "http://ceshi.api.mosttop.top/api/";

    public static readonly downloadUrl: string = "http://ceshi.mosttop.top";
    /**
     * bundle下载地址
     */
    public static readonly bundleUrl: string = "";
    /**
     * 相关远程配置地址
     */
    public static readonly gameConfigUrl: string = "";
}


