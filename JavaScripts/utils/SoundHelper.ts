import { SpawnManager, SpawnInfo, } from '../Modified027Editor/ModifiedSpawn';
import { ESceneType } from "../Common";
import { GameConfig } from "../config/GameConfig";
import { PlayerModuleC } from "../module/PlayerModule";
import { Scheduler } from "./Scheduler";
import { Singleton } from "./Singleton";
enum BGMState {
    Stop,
    Playing,
    Pause
}

class BGMInfo {
    guid: string
    soundObj: mw.Sound
    volume: number
    state: BGMState
}

interface Sound {
    uniqueId: number
    soundObj: mw.Sound
}
class SoundInfo {
    soundArr: Sound[] = []
    volume: number
    loop: boolean
    inteval: number
}


const DefaultVolume = 100
const DefaultVolumeScale = 100

export default class SoundHelper extends Singleton {
    /**
     * 背景音乐
     */
    private _bgmMap: Map<string, BGMInfo> = new Map()
    private static _musicVolume: number = DefaultVolumeScale
    private _currentMusic: BGMInfo
    private _musicFadeTween: mw.Tween<{ volume: number }>
    private _musicFadeInCb: () => void = null
    private _musicFadeOutCb: () => void = null
    private _musicLoop: boolean = true

    /**
     * 音效
     */
    private _soundUniqueId: number = 0
    private _soundMap: Map<string, SoundInfo> = new Map()
    private _soundVolume: number = DefaultVolumeScale

    /**
     * 播放背景音乐
     * @param guid 
     * @param volume 
     * @param autoLoop 
     */
    private playMusic(guid: string, volume: number = DefaultVolume, autoLoop: boolean = true, force: boolean = false) {
        this._musicLoop = autoLoop

        let info: BGMInfo
        if (this._bgmMap.has(guid)) {
            info = this._bgmMap.get(guid)
            if (volume != info.volume) {
                info.volume = volume
            }
            if (info.state == BGMState.Stop) {
                this.changeMusic(info, force)
            } else if (info.state == BGMState.Pause) {
                this.remuseMusic()
            } else if (info.state == BGMState.Playing) {
                info.soundObj.volume = this.caculateMusicVolume(volume)
            }
        } else {
            info = new BGMInfo()
            info.guid = guid
            info.volume = volume
            SpawnManager.wornAsyncSpawn(guid).then((sound) => {
                info.soundObj = sound as mw.Sound
                this.changeMusic(info, force)
            })
            this._bgmMap.set(guid, info)
        }
    }

    /**
     * 停止BGM
     */
    stopMusic() {
        if (this._currentMusic) {
            this._currentMusic.soundObj.stop()
            this._currentMusic.state = BGMState.Stop
        }
    }

    /**
     * 暂停BGM
     */
    public pauseMusic() {
        if (this._currentMusic) {
            if (this._currentMusic.state == BGMState.Pause) {
                return
            }
            this._currentMusic.soundObj.pause()
            this._currentMusic.state = BGMState.Pause
        }
    }

    public restoreBGM() {
        if (this._musicFadeTween) {
            this._musicFadeTween.end();
            this._musicFadeTween && this._musicFadeTween.end();
        }
        let scene = ModuleService.getModule(PlayerModuleC).getSceneType();
        SoundHelper.instance().pauseMusic();
        if (scene != ESceneType.Bussiness && scene != ESceneType.Bet && scene != ESceneType.Sign && scene != ESceneType.Shop) {
            SoundHelper.instance().play(1006);
        } else {
            SoundHelper.instance().play(1015);
        }
    }


    /**
     * 恢复音乐
     */
    public remuseMusic() {
        if (this._currentMusic) {
            if (this._currentMusic.state == BGMState.Playing) {
                return
            }
            this._currentMusic.soundObj.play()
            this._currentMusic.state = BGMState.Playing
        }
    }



    /**
     * 设置BGM音量大小
     * @param volume 
     */
    setMusicVolume(volume: number) {
        SoundHelper._musicVolume = volume
        if (this._currentMusic) {
            this._currentMusic.soundObj.volume = this.caculateMusicVolume(volume)
        }
    }
    /**
     * 获取背景音乐的音量大小
     * @returns 
     */
    public getMusicVolume() { return SoundHelper._musicVolume }

    /**
     * 播放音效
     * @param guid 
     * @param volume 音量
     * @param autoLoop 是否循环
     * @param autoLoop 是否覆盖
     */
    private async playSound(guid: string, volume: number = DefaultVolume, autoLoop: boolean = false, canCover: boolean = true) {
        if (!this._soundMap.has(guid)) {
            let info = new SoundInfo()
            info.volume = volume
            info.loop = autoLoop
            info.soundArr = []
            if (autoLoop) {
                info.inteval = Scheduler.TimeStart(() => {
                    for (const sound of info.soundArr) {
                        sound.soundObj.volume = this.caculateSoundVolume(info.volume)
                    }
                }, 0.5, -1)
            }
            this._soundMap.set(guid, info)
        }
        const soundInfo = this._soundMap.get(guid)

        if (!canCover) {
            let flag = true
            soundInfo.soundArr.forEach(e => {
                if (e.soundObj.playState) {
                    flag = false
                }
            })
            if (!flag) {
                return
            }
        }

        if (soundInfo.volume != volume) {
            soundInfo.volume = volume
        }

        let sound: Sound
        for (let i = 0; i < soundInfo.soundArr.length; i++) {
            const element = soundInfo.soundArr[i];
            if (!element.soundObj.playState) {
                sound = element
                break
            }
        }
        if (!sound) {
            const soundObj = await SpawnManager.wornAsyncSpawn(guid) as mw.Sound
            sound = { uniqueId: ++this._soundUniqueId, soundObj: soundObj }
            soundInfo.soundArr.push(sound)
        }

        sound.soundObj.isLoop = soundInfo.loop
        sound.soundObj.volume = this.caculateSoundVolume(soundInfo.volume)
        sound.soundObj.play()
        sound.soundObj.onFinish.add(() => {
            if (soundInfo.soundArr.length > 5) {
                this.deleteSound(sound.uniqueId)
            }
        })
        return sound.uniqueId
    }


    /**
     * 停止音效
     */

    public stopSound(id: number) {
        for (const [guid, soundInfo] of this._soundMap) {
            for (let i = soundInfo.soundArr.length - 1; i >= 0; i--) {
                const sound = soundInfo.soundArr[i];
                if (sound.uniqueId == id) {
                    sound.soundObj.stop()
                    break
                }
            }
        }
    }

    /**
     * 设置音效音量大小
     * @param volume 
     */
    public setSoundVolume(volume: number) { this._soundVolume = volume }

    /**
    * 获取音效音量
    * @returns 
    */
    public getSoundVolume() { return this._soundVolume }


    public printAllSoundCounts() {
        console.log("BMG COUNTS=" + this._bgmMap.size)
        let counts = 0
        this._soundMap.forEach((soundInfo) => {
            counts += soundInfo.soundArr.length
        })
        console.log("Sound COUNTS=" + counts)
    }

    public async play(cfgId: number, force: boolean = false, canCover: boolean = true) {
        let ret: number = -1
        const cfg = GameConfig.Audio.getElement(cfgId)
        if (!cfg) {
            return;
        }
        if (cfg.Type == 1) {
            this.playMusic(cfg.ResGUID, cfg.Volume, Boolean(cfg.IsLoop), force)
        } else {
            ret = await this.playSound(cfg.ResGUID, cfg.Volume, Boolean(cfg.IsLoop), canCover)
        }
        return ret
    }


    /**************************************************私有方法********************************************************************** */

    private caculateMusicVolume(volume: number) {
        return volume / 100 * 5 * SoundHelper._musicVolume / DefaultVolumeScale
    }

    private caculateSoundVolume(volume: number) {
        return volume / 100 * 5 * this._soundVolume / DefaultVolumeScale
    }

    /**
     * 切换背景音乐
     * @param newMusic 
     */
    private changeMusic(newMusic: BGMInfo, force: boolean = false) {
        if (this._musicFadeTween) {
            this._musicFadeTween.end()
            this._musicFadeTween && this._musicFadeTween.end();
        }
        if (force) {
            this.stopMusic();
            newMusic.state = BGMState.Playing
            newMusic.soundObj.isLoop = this._musicLoop
            newMusic.soundObj.play()
            this._currentMusic = newMusic
            newMusic.soundObj.volume = this.caculateMusicVolume(newMusic.volume)
        } else {
            if (this._currentMusic && this._currentMusic.state) {
                this.musicFadeOut(() => {
                    this.musicFadeIn(newMusic)
                })
            } else {
                this.musicFadeIn(newMusic)
            }
        }
    }

    /**
     * 淡出
     * @param callback 
     */
    private musicFadeOut(callback?: () => void) {
        callback && (this._musicFadeOutCb = callback)
        this._musicFadeTween = new mw.Tween({ volume: this._currentMusic.volume })
            .to({ volume: 0 }, 1500)
            .onUpdate((obj) => {
                this._currentMusic.soundObj.volume = this.caculateMusicVolume(obj.volume)
            })
            .onComplete(() => {
                this._musicFadeTween = null
                this._currentMusic.state = BGMState.Stop
                this._currentMusic.soundObj.stop()
                this._musicFadeOutCb && this._musicFadeOutCb()
            })
            .start()
    }

    /**
     * 淡入
     * @param callback 
     */
    private musicFadeIn(newMusic: BGMInfo, callback?: () => void) {
        callback && (this._musicFadeInCb = callback)
        this._musicFadeTween = new mw.Tween({ volume: 0 })
            .to({ volume: newMusic.volume }, 1500)
            .onStart(() => {
                newMusic.state = BGMState.Playing
                newMusic.soundObj.isLoop = this._musicLoop
                newMusic.soundObj.play()
                this._currentMusic = newMusic
            })
            .onUpdate((obj) => {
                newMusic.soundObj.volume = this.caculateMusicVolume(obj.volume)
            })
            .onComplete(() => {
                this._musicFadeTween = null
                this._musicFadeInCb && this._musicFadeInCb()
            })
            .start()
    }

    /**
     * 销毁一个音效
     * @param id 
     */
    private deleteSound(id: number) {
        for (const [guid, soundInfo] of this._soundMap) {
            for (let i = soundInfo.soundArr.length - 1; i >= 0; i--) {
                const sound = soundInfo.soundArr[i];
                if (sound.uniqueId == id) {
                    sound.soundObj.destroy()
                    soundInfo.soundArr.splice(i, 1)
                    break
                }
            }
        }
    }
}