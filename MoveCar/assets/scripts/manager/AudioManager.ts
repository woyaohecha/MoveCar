import { _decorator, Component, Node, AudioSource, director, AudioClip, resources } from 'cc';
const { ccclass, property } = _decorator;

/**
 * 音频管理单例
 */
@ccclass('AudioManager')
export class AudioManager {

    private static _audioManager: AudioManager;

    public static getInstance(): AudioManager {
        if (!this._audioManager) {
            this._audioManager = new AudioManager();
        }
        return this._audioManager;
    }

    /**
     * 音效、短音频管理器
     */
    private _shortAudioSource: AudioSource;
    /**
     * 背景音乐、长音频管理器
     */
    private _longAudioSource: AudioSource;

    /**
     * 音频开关
     */
    private _audioSwitch: boolean = true;

    /**
     * 添加场景常驻节点 -shortAudioNode -name-audioShort
     * 短音频管理节点 -longAudioNode -name-audioLong
     * 长音频管理节点
     */
    private constructor() {
        let shortAudioNode = new Node();
        shortAudioNode.name = "audioShort";
        director.getScene().addChild(shortAudioNode);
        director.addPersistRootNode(shortAudioNode);
        this._shortAudioSource = shortAudioNode.addComponent(AudioSource);
        console.log("创建音效节点");

        let longAudioNode = new Node();
        longAudioNode.name = "audioLong";
        director.getScene().addChild(longAudioNode);
        director.addPersistRootNode(longAudioNode);
        this._longAudioSource = longAudioNode.addComponent(AudioSource);
        console.log("创建音乐节点");
    }


    /**
     * 播放短音频、音效
     * @param sound 音频或动态资源地址
     * @param volume 音量
     */
    playShort(sound: AudioClip | string, volume: number = 1.0) {
        // this._shortAudioSource.stop();
        if (!this._audioSwitch) {
            return;
        }
        if (sound instanceof AudioClip) {
            // this._shortAudioSource.playOneShot(sound, volume);
            this._shortAudioSource.clip = sound;
            this._shortAudioSource.play();
            this._shortAudioSource.volume = volume;
        } else {
            resources.load(sound, (e, clip: AudioClip) => {
                if (e) {
                    console.log(e);
                    return;
                }
                // this._shortAudioSource.playOneShot(clip, volume);
                this._shortAudioSource.clip = clip;
                this._shortAudioSource.play();
                this._shortAudioSource.volume = volume;
            })
        }
    }

    /**
     * 播放长音频、背景音乐
     * @param sound 音频或动态资源地址
     * @param volume 音量
     */
    playLong(sound: AudioClip | string, volume: number = 1.0) {
        if (!this._audioSwitch) {
            return;
        }
        if (sound instanceof AudioClip) {
            this._longAudioSource.clip = sound;
            this._longAudioSource.play();
            this._longAudioSource.volume = volume;
        }
        else {
            resources.load(sound, (err, clip: AudioClip) => {
                if (err) {
                    console.log(err);
                    return;
                }
                this._longAudioSource.clip = clip;
                this._longAudioSource.play();
                this._longAudioSource.volume = volume;
            });
        }
    }

    /**
     * 设置短音频、音效的音量
     * @param value 音量大小，0~1
     * @returns 
     */
    setShortVolume(value: number) {
        if (value < 0 || value > 1) {
            return;
        }
        this._shortAudioSource.volume = value;
    }

    /**
     * 设置长音频、背景音乐的音量
     * @param value 音量大小，0~1
     * @returns 
     */
    setLongVolume(value: number) {
        if (value < 0 || value > 1) {
            return;
        }
        this._longAudioSource.volume = value;
    }

    /**
     * 设置音频开关
     * @param value 开关
     */
    setAudioSwitch(value: boolean) {
        this._audioSwitch = value;
        console.log(`set aduio-switch:${this._audioSwitch}`)
        if (!value) {
            this.stopShort();
        }
    }

    /**
     * 获取音频开关
     * @returns 
     */
    getAudioSwitch() {
        return this._audioSwitch;
    }


    /**
     * 停止播放短音频、音效
     */
    stopShort() {
        this._shortAudioSource.stop();
    }

    /**
     * 停止播放长音频、音效
     */
    stopLong() {
        this._longAudioSource.stop();
    }

    /**
     * 暂停播放短音频、音效
     */
    pauseShort() {
        this._shortAudioSource.pause();
    }

    /**
     * 暂停播放长音频、音效
     */
    pauseLong() {
        this._longAudioSource.pause();
    }

    /**
     * 恢复播放短音频、音效
     */
    resumeShort() {
        if (!this._audioSwitch) {
            return;
        }
        this._shortAudioSource.play();
    }

    /**
     * 恢复播放长音频、音效
     */
    resumeLong() {
        if (!this._audioSwitch) {
            return;
        }
        this._longAudioSource.play();
    }


}


