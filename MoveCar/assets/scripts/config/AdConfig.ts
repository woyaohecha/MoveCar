import { _decorator } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('AdConfig')
export class AdConfig {
    /**
     * vivo小游戏平台广告id
     */
    public static readonly vivoAdID = {
        bannerID: "",
        videoID: "",//激励视频
        insertID: "",//插屏
        customID1: "",//上图下文
        customID2: "",//横板纯图
        boxID: "",//九宫格
        bannerBoxID: ""//横幅
    }

    /**
     * qq小游戏平台广告id
     */
    public static readonly qqAdID = {
        videoID: "",
        bannerID: "",
        insertID: "",
        boxID: "",
        blockID: ""
    }

    /**
     * 快手小游戏平台广告id
     */
    public static readonly ksAdID = {
        videoID: "",
        insertID: ""
    }

    /**
     * 抖音小游戏平台广告id
     */
    public static readonly ttAdID = {
        videoID: "",
        insertID: "",
        bannerID: ""
    }

    /**
     * 穿山甲广告
     */
    public static readonly csjAd = {

    }
}


