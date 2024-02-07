import { _decorator, Component, Node, SpriteFrame, Sprite, EventTouch, Vec2, v2, BoxCollider, Contact2DType, TriggerEventType, ITriggerEvent, UITransform, BoxCollider2D, absMax, AudioSource, AudioClip, resources } from 'cc';
import { ResConfig } from '../config/ResConfig';
import { AudioManager } from '../manager/AudioManager';
import { EventManager } from '../manager/EventManager';
const { ccclass, property } = _decorator;

export enum CarDir {
    UP,
    DOWN,
    LEFT,
    RIGHT
}

export const carSpeed = 600;

@ccclass('CarLogic')
export class CarLogic extends Component {
    @property(AudioClip)
    didi: AudioClip = null;
    @property(AudioClip)
    run: AudioClip = null;
    @property(AudioClip)
    hit: AudioClip = null;

    dir: CarDir = null;
    location: Vec2[] = null;
    canMove: boolean = false;
    speed: Vec2 = v2(0, 0);
    audioSource: AudioSource = null;

    onLoad() {
        this.audioSource = this.node.getComponent(AudioSource);
    }

    /**
     * 重置数据
     */
    init(initData: any) {
        this.canMove = false;
        this.dir = initData.dir;
        this.location = initData.location;
        let rotationZ: number = 0;
        switch (this.dir) {
            case CarDir.LEFT:
                rotationZ = 90;
                this.speed = v2(-carSpeed, 0);
                break;
            case CarDir.RIGHT:
                rotationZ = -90;
                this.speed = v2(carSpeed, 0);
                break;
            case CarDir.UP:
                rotationZ = 0;
                this.speed = v2(0, carSpeed);
                break;
            case CarDir.DOWN:
                rotationZ = 180;
                this.speed = v2(0, -carSpeed);
                break;
        }
        this.node.setRotationFromEuler(0, 0, rotationZ);
        this.node.setPosition(initData.pos);
        this.node.setParent(initData.parent);
        this.node.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
        let collider = this.getComponent(BoxCollider)
        collider.on('onTriggerEnter', this.onTriEnter, this);
        collider.on('onTriggerExit', this.onTriExit, this);
    }

    onTouchStart(e: EventTouch) {
        // console.log(this.node.position.x, this.node.position.y);
        this.canMove = true;
        // console.log("on touch start");
        this.playShort(this.run);
        // EventManager.getInstance().emit("updataLevelData",)
    }


    onTriEnter(e: ITriggerEvent) {
        // console.log("on trigger enter", e);
        if (this.canMove) {
            this.canMove = false;
            let posOffset: Vec2 = v2(0, 0);
            switch (this.dir) {
                case CarDir.LEFT:
                    posOffset.x = Math.abs(this.node.position.x % 30) > 15 ? 30 - Math.abs(this.node.position.x % 30) : Math.abs(this.node.position.x % 30)
                    break;
                case CarDir.RIGHT:
                    posOffset.x = -(Math.abs(this.node.position.x % 30) > 15 ? 30 - Math.abs(this.node.position.x % 30) : Math.abs(this.node.position.x % 30))
                    break;
                case CarDir.UP:
                    posOffset.y = -(Math.abs(this.node.position.y % 30) > 15 ? 30 - Math.abs(this.node.position.y % 30) : Math.abs(this.node.position.y % 30));
                    break;
                case CarDir.DOWN:
                    posOffset.y = Math.abs(this.node.position.y % 30) > 15 ? 30 - Math.abs(this.node.position.y % 30) : Math.abs(this.node.position.y % 30);
                    break;
            }
            this.node.setPosition(this.node.position.x + posOffset.x, this.node.position.y + posOffset.y);
            this.playShort(this.hit);
            EventManager.getInstance().emit("checkFail");
        }

    }

    onTriExit(e: ITriggerEvent) {
        // console.log("on trigger exit", e);
    }


    stopMove(pos: Vec2) {

    }


    update(dt) {
        if (this.canMove) {
            let x = this.node.position.x + this.speed.x * dt;
            let y = this.node.position.y + this.speed.y * dt;
            this.node.setPosition(x, y);
            if (this.node.position.x < -500 || this.node.position.x > 500 || this.node.position.y < -900 || this.node.position.y > 900) {
                this.scheduleOnce(() => {
                    this.node.destroy();
                }, 2)
            }
        }
    }


    /**
     * 设置block的颜色
     * @param sp 颜色图片sp
     */
    setImg(sp: SpriteFrame) {
        this.node.getComponent(Sprite).spriteFrame = sp;
    }


    onDestroy() {
        console.log("onDestroy");
        this.node.off(Node.EventType.TOUCH_START, this.onTouchStart, this);
        let collider = this.getComponent(BoxCollider)
        collider.off('onTriggerEnter', this.onTriEnter, this);
        collider.off('onTriggerExit', this.onTriExit, this);
    }


    playShort(sound: AudioClip, callback?: Function) {
        this.audioSource.stop();
        this.audioSource.clip = sound;
        this.audioSource.volume = 0.7;
        this.audioSource.play();
        this.audioSource.node.once(AudioSource.EventType.ENDED, callback, this);
    }

    stopShort() {
        this.audioSource.clip = null;
        this.audioSource.stop();
    }
}


