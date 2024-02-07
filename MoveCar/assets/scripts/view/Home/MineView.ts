import { _decorator, Component, Node, Sprite, Label, SpriteFrame, assetManager, ImageAsset, Texture2D, resources, director } from 'cc';
import { ResConfig } from '../../config/ResConfig';
import { UserData } from '../../data/UserData';
import { AdManager, AdType } from '../../manager/AdManager';
import { HttpManager } from '../../manager/HttpManager';
import { UILayer, UIManager } from '../../manager/UIManager';
import { Util } from '../../Util';
const { ccclass, property } = _decorator;

@ccclass('MineView')
export class MineView extends Component {

    @property(Sprite)
    userImgSp: Sprite = null;

    @property(Label)
    userNameLabel: Label = null;

    @property(Label)
    userIdLabel: Label = null;

    @property(Label)
    balanceLabel: Label = null;

    private _hasPassword: boolean = false;

    onEnable() {
        // AdManager.getInstance().hideBanner();
        HttpManager.getUserInfo((res) => {
            let data = JSON.parse(res).data;
            this.init(data);
        }, () => {
            console.error("---获取用户信息失败");
        })
    }

    init(data) {
        this._hasPassword = data.is_payment_password == 1;
        this.userNameLabel.string = data.nickname;
        this.userIdLabel.string = "ID:" + Util.padZero(data.user_id, 6);
        this.balanceLabel.string = data.goldcoin;
        if (UserData.getInstance().userImg) {
            this.userImgSp.spriteFrame = UserData.getInstance().userImg;
        } else {
            this.loadUserImg(data.avatar);
        }
    }

    /**
     * 加载头像
     * @param imgUrl 如果头像地址不存在，则使用默认头像
     */
    loadUserImg(imgUrl) {
        if (!imgUrl || imgUrl == "") {
            resources.load(ResConfig.defaultImgPath, SpriteFrame, (e, asset: SpriteFrame) => {
                if (e) {
                    console.log(e);
                    return;
                }
                this.userImgSp.spriteFrame = asset;
                UserData.getInstance().userImg = asset;
            })
        } else {
            assetManager.loadRemote(imgUrl, { ext: '.jpg' }, (e, asset: ImageAsset) => {
                if (e) {
                    console.log(e);
                    return;
                }
                // console.log("加载头像成功:", asset, typeof (asset));
                let sp = new SpriteFrame();
                let tex = new Texture2D();
                tex.image = asset;
                sp.texture = tex;
                this.userImgSp.spriteFrame = sp;
                UserData.getInstance().userImg = sp;
            })
        }
    }


    /**
     * 提现
     */
    onBtnCashOut() {
        UIManager.getInstance().showUI(UILayer.CASH_OUT);
    }


    /**
     * 分享
     */
    onBtnEditPassword() {
        if (this._hasPassword) {
            UIManager.getInstance().showUI(UILayer.EDIT_PASSWORD);
        } else {
            UIManager.getInstance().showUI(UILayer.SET_PASSWORD);
        }
    }


    /**
     * 提现记录
     */
    onBtnCashRecord() {
        UIManager.getInstance().showUI(UILayer.CASH_RECORD);
    }


    /**
     * 积分记录
     */
    onBtnScoreRecord() {
        UIManager.getInstance().showUI(UILayer.SCORE_RECORD);
    }


    /**
     * 商城
     */
    onBtnShop() {
        UIManager.getInstance().showUI(UILayer.SHOP);
    }

    /**
    * 佣金记录
    */
    onBtnCommisionRecord() {
        UIManager.getInstance().showUI(UILayer.COMMISSION_RECORD);
    }


    /**
     * 联系客服
     */
    onBtnCustomer() {
        UIManager.getInstance().showUI(UILayer.CUSTOMER);
    }


    /**
     * 查看用户协议
     */
    onBtnUserAgreement() {
        // UIManager.getInstance().showUI(UILayer.USEAGENT);
    }


    /**
     * 查看隐私政策
     */
    onBtnPrivacy() {
        // UIManager.getInstance().showUI(UILayer.PRIVACY);
    }


    /**
     * 关于我们
     */
    onBtnAboutUs() {
        UIManager.getInstance().showUI(UILayer.ABOUT_US);
    }


    /**
     * 注销账号
     */
    onBtnQuit() {
        UserData.getInstance().onQuit();
        director.loadScene("Loading");
    }


    onBtnClose() {
        UIManager.getInstance().hideUI(UILayer.MINE);
    }


    onDisable() {
        // AdManager.getInstance().showAd(AdType.banner);
    }
}


