import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('AssetBundleManager')
export class AssetBundleManager {
    private static _abManager: AssetBundleManager;

    public static getInstance(): AssetBundleManager {
        if (!this._abManager) {
            this._abManager = new AssetBundleManager();
        }
        return this._abManager;
    }

    
}


