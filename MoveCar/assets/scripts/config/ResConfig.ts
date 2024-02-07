import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ResConfig')
export class ResConfig {

    /**
     * 音效资源path
     */
    public static readonly audioPath = {
        move: "sound/move",
        hit: "sound/hit",
        didi: "sound/didi"
    }

    /**
     * 特效预制体path
     */
    public static readonly effectPath = {
        click: "effect/click",
        boom: "effect/boom",
        win: "effect/win",
        lose: "effect/lose"
    }

    /**
     * 通用消息弹窗预制体path
     */
    public static readonly msgPath = {
        tips: "msg/Tips",
        toast: "msg/Toast",
        loading: "msg/Loading"
    }


    public static readonly layerPath = {
        home: "prefab/layer/HomeLayer",
        mine: "prefab/layer/MineLayer",
        task: "prefab/layer/TaskLayer",
        sign: "prefab/layer/SignLayer",
        lottery: "prefab/layer/LotteryLayer",
        cashOut: "prefab/layer/CashOutLayer",
        accountInfo: "prefab/layer/AccountInfoLayer",
        cashRecord: "prefab/layer/CashRecordLayer",
        customer: "prefab/layer/CustomerLayer",
        aboutUs: "prefab/layer/AboutUsLayer",
        setPassword: "prefab/layer/SetPasswordLayer",
        editPassword: "prefab/layer/EditPasswordLayer",
        privacy: "",
        userAgent: "",
        scoreRecord: "prefab/layer/ScoreRecordLayer",
        shop: "prefab/layer/ShopLayer",
        commissionRecord: "prefab/layer/CommissionRecordLayer"
    }

    public static readonly defaultImgPath = "img/UserImg/spriteFrame";

    public static readonly taskPrefabPath = "prefab/item/TaskItem"

    public static readonly signPrefabPath = "prefab/item/SignItem"

    public static readonly cashItemPrefab = "prefab/item/CashItem"

    public static readonly blockPath = "prefab/blockType/Block_"

    public static readonly carImgPath = "carImg";

    public static readonly gridPath = "prefab/item/GridItem";

    public static readonly cashRecordItemPrefab = "prefab/item/CashRecordItem";

    public static readonly scoreRecordItemPrefab = "prefab/item/ScoreRecordItem";

    public static readonly shopItemPrefab = "prefab/item/ShopItem";

    public static readonly localAdPath = {
        banner: "localAdPrefab/BannerAd",
        open: "localAdPrefab/OpenAd",
        video: "localAdPrefab/VideoAd",
        landing: "localAdPrefab/LandingAd",
    }

    public static readonly ABPath = {

    }
}


