import { _decorator, Component, Node, NodePool, instantiate, resources, Prefab, SpriteFrame } from 'cc';
import { ResConfig } from '../config/ResConfig';
import { Util } from '../Util';
import { CarLogic } from './CarLogic';
const { ccclass, property } = _decorator;

@ccclass('CarPool')
export class CarPool {
    private static _carPool: CarPool = null;

    public static getInstance() {
        if (!this._carPool) {
            this._carPool = new CarPool();
        }
        return this._carPool;
    }

    carPrefab: Prefab = null;
    carImgs: SpriteFrame[] = [];


    /**
     * 获取一个car
     * @param initData carInitData
     * @param success 
     */
    public getCar(initData: any) {
        let index = Util.getRandomInt(1, 6);
        this.getImg(index, (img) => {
            this.createCar((car: Node) => {
                let carLogic = car.getComponent(CarLogic);
                carLogic.init(initData);
                carLogic.setImg(img);
            })
        })
    }

    /**
     * 创建一个car
     * @param success 
     */
    private createCar(success: Function) {
        if (this.carPrefab) {
            let car = instantiate(this.carPrefab);
            success(car);
        } else {
            resources.load("prefab/item/CarItem", (e, carPrefab: Prefab) => {
                if (e) {
                    console.error(e);
                    return;
                }
                this.carPrefab = carPrefab;
                this.createCar(success);
            })
        }
    }


    /**
     * 获取一个颜色的sp
     * @param index img序号
     * @param success 
     */
    private getImg(index: number, success?: Function) {
        if (this.carImgs[index]) {
            success(this.carImgs[index]);
        } else {
            resources.load(`${ResConfig.carImgPath}/car_${index}/spriteFrame`, (e, blockImg: SpriteFrame) => {
                if (e) {
                    console.error(e);
                    return;
                }
                this.carImgs[index] = blockImg;
                this.getImg(index, success);
            })
        }
    }
}


