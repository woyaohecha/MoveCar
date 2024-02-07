import { _decorator, Component, Node, EventTarget } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('EventManager')
export class EventManager {
    private static _eventManager: EventManager;
    private _eventTarget: EventTarget;

    public static getInstance() {
        if (!this._eventManager) {
            this._eventManager = new EventManager();
        }
        return this._eventManager;
    }

    private constructor() {
        this._eventTarget = new EventTarget();
    }

    on(type: string, callback: any, target?: any) {
        this._eventTarget.on(type, callback, target)
    }

    once(type: string, callback: any, target?: any) {
        this._eventTarget.once(type, callback, target)
    }

    off(type: string, callback: any, target?: any) {
        this._eventTarget.off(type, callback, target)
    }

    emit(type: string, ...args: any[]) {
        this._eventTarget.emit(type, ...args);
    }
}


