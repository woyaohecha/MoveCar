import { _decorator, Component, director, Node } from 'cc';
import { AudioManager } from '../../manager/AudioManager';
import { EventManager } from '../../manager/EventManager';
import { GamePage } from './GamePage';
const { ccclass, property } = _decorator;

@ccclass('PauseView')
export class PauseView extends Component {

    @property(Node)
    audioSwitch: Node = null;



    onEnable() {
        this.setAudioSwitch();
    }


    /**
     * 设置音频开关
     * @param value 
     */
    setAudioSwitch(value?: boolean) {
        if (value == true || value == false) {
            AudioManager.getInstance().setAudioSwitch(value);
        }
        this.audioSwitch.getChildByName("On").active = AudioManager.getInstance().getAudioSwitch();
        this.audioSwitch.getChildByName("Off").active = !AudioManager.getInstance().getAudioSwitch();
    }


    onBtnSwitch() {
        this.setAudioSwitch(!AudioManager.getInstance().getAudioSwitch());
    }

    onBtnQuit() {
        EventManager.getInstance().emit("gameQuit");
    }

    onBtnClose() {
        EventManager.getInstance().emit("gameStart");
    }
}


