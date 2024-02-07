import { _decorator, Component, Node, director, CCObject, Vec3, resources, Prefab, instantiate, find } from 'cc';
const { ccclass, property } = _decorator;

/**
 * 特效管理单例
 */
@ccclass('EffectManager')
export class EffectManager {
    private static _effectManager: EffectManager;

    /**
     * 特效根节点
     */
    private effectRoot_2D: Node;
    private effectRoot_3D: Node;


    public static getInstance(): EffectManager {
        if (!this._effectManager) {
            this._effectManager = new EffectManager();
        }
        return this._effectManager;
    }

    /**
     * 构造函数
     * 查找特效根节点为常驻节点
     */
    private constructor() {
        this.effectRoot_2D = find("2D");
        this.effectRoot_3D = find("3D");
    }

    /**
     * 
     * @param effectPath 特效资源路径
     * @param pos 特效位置
     * @param callback 返回创建好的特效节点，回调中处理不同特效播放方式
     */
    playEffect(effectPath: string, is2D: boolean, pos: Vec3, callback: Function) {
        resources.load(effectPath, (e, effectPrefab: Prefab) => {
            if (e) {
                console.log(e);
                return;
            }
            let effect = instantiate(effectPrefab);
            effect.setParent(is2D ? this.effectRoot_2D : this.effectRoot_3D)
            effect.setPosition(pos);
            callback(effect);
        })
    }

    /**
     * 清除特效节点
     * @param effect 需要清除的特效节点
     * @returns 
     */
    removeEffect(effect: Node) {
        effect.parent.removeChild(effect);
    }
}


