import { _decorator, Component, Node, assetManager, ImageAsset, SpriteFrame, Texture2D, instantiate, resources, Prefab, find } from 'cc';
import { HttpConfig } from '../config/HttpConfig';
import { ResConfig } from '../config/ResConfig';
import { GameData } from '../data/GameData';
import { BannerAd } from '../localAd/BannerAd';
import { LandingAd } from '../localAd/LandingAd';
import { OpenAd } from '../localAd/OpenAd';
import { VideoAd } from '../localAd/VideoAd';
import { Util } from '../Util';
import { HttpManager } from './HttpManager';
const { ccclass, property } = _decorator;

export enum AdType {
    banner = 1, //图片
    video = 2,  //视频
    open = 3,   //图片
    landing = 4 //链接
}

@ccclass('AdManager')
export class AdManager {

    private static _adManager: AdManager = null;

    public static getInstance(): AdManager {
        if (!this._adManager) {
            this._adManager = new AdManager();
        }
        return this._adManager;
    }

    // 1.兼容模式   先内再外
    // 2.内部广告   
    // 3.外部广告   
    // 4.关闭广告   
    private _adMode: number = null;
    /**
     * 广告根节点
     */
    private _adRoot: Node = null;

    constructor() {
        this._adRoot = find("Root2D");
        this._localAdNode.bannerNode = this._adRoot.getChildByName("Banner");
        this._localAdNode.bannerNode.setSiblingIndex(100);
        this._localAdNode.openAdNode = this._adRoot.getChildByName("Open");
        this._localAdNode.openAdNode.setSiblingIndex(100);
        this._localAdNode.landingAdNode = this._adRoot.getChildByName("Landing");
        this._localAdNode.landingAdNode.setSiblingIndex(100);
        this._localAdNode.videoAdNode = this._adRoot.getChildByName("Video");
        this._localAdNode.videoAdNode.setSiblingIndex(100);

        this._localAdNode.bannerNode.active = false;
        this._localAdNode.openAdNode.active = false;
        this._localAdNode.landingAdNode.active = false;
        this._localAdNode.videoAdNode.active = false;
    }

    /**
     * 根据后台配置获取的广告资源，banner图片，落地页链接，视频链接等，以及对应的跳转链接和
     */
    private _localAdRes = {
        openSps: [] as SpriteFrame[],
        bannerSps: [] as SpriteFrame[]
    }

    private _localAdNode = {
        openAdNode: null as Node,
        bannerNode: null as Node,
        videoAdNode: null as Node,
        landingAdNode: null as Node,
    }

    /**
     * 后台广告配置
     */
    private _localAdList = {
        openAd: [] as any[],
        bannerAd: [] as any[],
        videoAd: [] as any[],
        landingAd: [] as any[]
    }


    /**
     * 展示广告
     * @param adType 
     * @param success 
     * @param fail 
     */
    public showAd(adType: AdType, success?: Function, fail?: Function, completed?: Function) {
        if (!this._adMode) {
            this._adMode = 1;
        } else {
            switch (this._adMode) {
                case 1:
                    this.showLocalAd(adType, success, () => {
                        this.showCsjAd(adType, success, fail, completed);
                    }, completed);
                    console.log(`兼容模式`);
                    break;
                case 2:
                    this.showLocalAd(adType, success, fail, completed);
                    console.log(`内部广告`);
                    break;
                case 3:
                    this.showCsjAd(adType, success, fail, completed);
                    console.log(`外部广告`);
                    break;
                case 4:
                    console.log(`关闭广告`);
                    break;
            }
        }
    }


    private showLocalAd(adType: AdType, success: Function, fail?: Function, completed?: Function) {
        if (this._localAdList.bannerAd.length > 0 || this._localAdList.openAd.length > 0 || this._localAdList.landingAd.length > 0 || this._localAdList.videoAd.length > 0) {
            switch (adType) {
                case AdType.banner:
                    this.showLocalBannerAd(fail);
                    break;
                case AdType.open:
                    this.showLocalOpenAd(fail);
                    break;
                case AdType.landing:
                    this.showLocalLandingAd();
                    break;
                case AdType.video:
                    this.showLocalVideoAd(completed, fail);
                    break;
            }
        } else {
            HttpManager.getAdList((res) => {
                let adList = JSON.parse(res).data.list;
                console.log("adList:", adList);
                if (adList.length > 0) {
                    for (let ad of adList) {
                        switch (ad.ad_type_id) {
                            case AdType.banner:
                                this._localAdList.bannerAd.push(ad);
                                break;
                            case AdType.video:
                                this._localAdList.videoAd.push(ad);
                                break;
                            case AdType.open:
                                this._localAdList.openAd.push(ad);
                                break;
                            case AdType.landing:
                                this._localAdList.landingAd.push(ad);
                                break;
                        }
                    }
                    this.showLocalAd(adType, success, fail, completed);
                } else {
                    fail();
                }
            }, (e) => {
                console.error(e);
                fail();
            })
        }
    }

    private showLocalBannerAd(fail?: Function) {
        if (this._localAdList.bannerAd.length > 0) {
            if (this._localAdNode.bannerNode) {
                let spIndex = Util.getRandomInt(0, this._localAdList.bannerAd.length - 1);
                if (this._localAdRes.bannerSps[spIndex]) {
                    this._localAdNode.bannerNode.getComponent(BannerAd).onShow(this._localAdRes.bannerSps[spIndex], () => {
                        this.showLocalLandingAd(this._localAdList.bannerAd[spIndex].url);
                    });

                } else {
                    let self = this;
                    let imgUrl = this._localAdList.bannerAd[spIndex].image_text;
                    // let imgUrl = "https://yomier-res-1257053852.cos.ap-nanjing.myqcloud.com/AdRes/BannerAd.png"
                    // let imgUrl = "http://ceshi.api.mosttop.top/e4e98fec3eaa053536feced73c9e45d6.jpg"
                    assetManager.loadRemote(imgUrl, { tex: ".png" }, (err, imageAsset: ImageAsset) => {
                        if (err) {
                            console.error(err);
                            return;
                        }
                        let spriteFrame = new SpriteFrame();
                        let texture = new Texture2D();
                        texture.image = imageAsset;
                        spriteFrame.texture = texture;
                        self._localAdRes.bannerSps[spIndex] = spriteFrame;
                        self.showLocalBannerAd(fail);
                    });
                }
            }
        }
    }

    private showLocalOpenAd(fail?: Function) {
        if (this._localAdList.openAd.length > 0) {
            if (this._localAdNode.openAdNode) {
                let spIndex = Util.getRandomInt(0, this._localAdList.openAd.length - 1);
                if (this._localAdRes.openSps[spIndex]) {
                    this._localAdNode.openAdNode.getComponent(OpenAd).onShow(this._localAdRes.openSps[spIndex], this._localAdList.openAd[spIndex].display_seconds, () => {
                        this.showLocalLandingAd(this._localAdList.openAd[spIndex].url);
                    });
                } else {
                    let self = this;
                    let imgUrl = this._localAdList.openAd[spIndex].image_text;
                    // let imgUrl = "https://yomier-res-1257053852.cos.ap-nanjing.myqcloud.com/AdRes/OpenAd.jpg";
                    assetManager.loadRemote<ImageAsset>(imgUrl, { ext: '.jpg' }, function (err, imageAsset) {
                        if (err) {
                            console.error(err);
                            return;
                        }
                        const spriteFrame = new SpriteFrame();
                        const texture = new Texture2D();
                        texture.image = imageAsset;
                        spriteFrame.texture = texture;
                        self._localAdRes.openSps[spIndex] = spriteFrame;
                        self.showLocalOpenAd();
                    });
                }
            } else {
                let adPrefabPath = ResConfig.localAdPath.open;
                resources.load(adPrefabPath, (e, adPrefab: Prefab) => {
                    if (e) {
                        console.error(e);
                        return;
                    }
                    this._localAdNode.openAdNode = instantiate(adPrefab);
                    this._adRoot = find("Root2D");
                    this._adRoot.addChild(this._localAdNode.openAdNode);
                    this._localAdNode.openAdNode.setSiblingIndex(10);
                    this.showLocalOpenAd();
                })
            }
        }
    }

    private showLocalLandingAd(url?: string) {
        if (this._localAdList.landingAd.length > 0) {
            let urlIndex = Util.getRandomInt(0, this._localAdList.landingAd.length - 1);
            if (this._localAdNode.landingAdNode) {
                let webUrl = url ? url : this._localAdList.landingAd[urlIndex].url;
                console.log(webUrl, url)
                this._localAdNode.landingAdNode.getComponent(LandingAd).onShow(webUrl);
            } else {
                let adPrefabPath = ResConfig.localAdPath.landing;
                resources.load(adPrefabPath, (e, adPrefab: Prefab) => {
                    if (e) {
                        console.error(e);
                        return;
                    }
                    this._localAdNode.landingAdNode = instantiate(adPrefab);
                    this._adRoot = find("Root2D");
                    this._adRoot.addChild(this._localAdNode.landingAdNode);
                    this._localAdNode.landingAdNode.setSiblingIndex(10);
                    this.showLocalLandingAd(url);
                })
            }
        }
    }

    private showLocalVideoAd(completed: Function, fail: Function) {
        if (this._localAdList.videoAd.length > 0) {
            if (this._localAdNode.videoAdNode) {
                let urlIndex = Util.getRandomInt(0, this._localAdList.videoAd.length - 1);
                let url = HttpConfig.downloadUrl + this._localAdList.videoAd[urlIndex].file;
                // let url = "https://yomier-res-1257053852.cos.ap-nanjing.myqcloud.com/video/1.mp4";
                this._localAdNode.videoAdNode.getComponent(VideoAd).onShow(url, this._localAdList.videoAd[urlIndex].display_seconds, completed, () => {
                    console.log("video click");
                }, fail);
            } else {
                let adPrefabPath = ResConfig.localAdPath.video;
                resources.load(adPrefabPath, (e, adPrefab: Prefab) => {
                    if (e) {
                        console.error(e);
                        fail();
                        return;
                    }
                    this._localAdNode.videoAdNode = instantiate(adPrefab);
                    this._adRoot = find("Root2D");
                    this._adRoot.addChild(this._localAdNode.videoAdNode);
                    this._localAdNode.videoAdNode.setSiblingIndex(10);
                    this.showLocalVideoAd(completed, fail);
                })
            }
        } else {
            fail();
        }
    }

    public hideBanner() {
        if (this._localAdNode.bannerNode) {
            this._localAdNode.bannerNode.getComponent(BannerAd).onHide();
        }
    }


    private showCsjAd(adType: AdType, success: Function, fail: Function, completed?: Function) {

    }

}


