import { SpawnManager, SpawnInfo, } from '../Modified027Editor/ModifiedSpawn';
import { CommonAssets, ECompetitionState, ESceneType, GlobalVar } from '../Common'
import { GameConfig } from '../config/GameConfig'
import BasicView from '../ui/BasicView'
import BreedUI from '../ui/BreedUI'
import GetMoneyUI from '../ui/GetMoneyUI'
import GuessResultUI from '../ui/GuessResultUI'
import GuidanceUI from '../ui/GuidanceUI'
import HorseBagUI from '../ui/HorseBagUI'
import InteractiveUI from '../ui/InteractiveUI'
import RaceUI from '../ui/RaceUI'
import SettlementUI from '../ui/SettlementUI'
import ShopInnerUI from '../ui/ShopInnerUI'
import ShopUI from '../ui/ShopUI'
import { ActionMgr } from '../utils/ActionMgr'
import SoundHelper from '../utils/SoundHelper'
import { PlayerModuleC, PlayerModuleS } from './PlayerModule'
import { RacingModuleC } from './RacingModule'
import { BreedModuleC } from './BreedModule'
import GrowUI from '../ui/GrowUI'
import PopWindowUI from '../ui/PopWindowUI'
import DefaultUI from '../ui/DefaultUI'
import { BagMouduleC } from './BagMoudule'
import CameraUtils from '../utils/CameraUtils';

export enum EGuideType {
    Letter,
}

const SceneObject_Boat = '6F092627'

export class GuideData extends Subdata {

    /**
     * 强制引导部分
     */
    @Decorator.persistence()
    forceGuideID: number
    /**是否强制引导完成 */
    @Decorator.persistence()
    finishForce: boolean

    /**
     * 强制引导
     * @returns 
     */
    public getForceGuideId() { return this.forceGuideID }
    public saveForceGuideId(id: number) {
        this.forceGuideID = id
    }
    public isFinishedForce() {
        return this.finishForce
    }
    public finishForceTrue() {
        this.finishForce = true
    }
}


interface GuideTask {
    index: number
    stats: number
    func: () => void
    condition(): boolean
}

export class NewGuideModuleC extends ModuleC<NewGuideModuleS, GuideData> {
    private _guideUI: GuidanceUI

    private _taskIndex: number = 0
    private _focusTasks: GuideTask[] = []
    private _pendingRemoveTasks: GuideTask[] = []
    private _currentGuidingID: number = 0

    private _distnationEffect: mw.Effect
    private _guideArrow: mw.GameObject
    private _arrowEndAnchor: mw.GameObject

    public getCurrentGuidingID() {
        return this._currentGuidingID;
    }

    /** 当脚本被实例后，会在第一帧更新前调用此函数 */
    public onStart(): void {
        // emitter.on(GameEvents.EVENT_COMPETITION_STATE_CHANGE, (state: ECompetitionState) => {
        //     if (state == ECompetitionState.Running) {
        //         if (!this.data.isComplete()) {
        //             // this.reqEndGuide(1012)
        //         }

        //     }
        // }, this)
    }

    /**
     * 周期函数 每帧执行
     * 此函数执行需要将this.useUpdate赋值为true
     * @param dt 当前帧与上一帧的延迟 / 秒
     */
    public onUpdate(dt: number): void {
        for (const task of this._focusTasks) {
            if (task.stats == 0 && task.condition()) {
                task.stats = 1
                task.func()
                this._pendingRemoveTasks.push(task)
            }
        }

        for (const removetask of this._pendingRemoveTasks) {
            for (let i = this._focusTasks.length - 1; i >= 0; i--) {
                const task = this._focusTasks[i];
                if (task.index == removetask.index) {
                    this._focusTasks.splice(i, 1)
                    break
                }
            }
        }
        if (this._arrowEndAnchor) {
            this.updateArrow()
        }
    }

    /** 脚本被销毁时最后一帧执行完调用此函数 */
    public onDestroy(): void {

    }


    /********************************************************************************** */

    /**
     * 检查是否引导
     */
    public checkGuide() {
        return;
        if (this.data.isFinishedForce()) {
            return;
        }
        let currentId = this.data.getForceGuideId()
        if (!currentId) {
            this.reqStartGuide(1001)
        } else {
            let cfg = GameConfig.Newguide.getElement(currentId)
            let root = cfg.Root;
            if (root) {
                let gudieID = root;
                if (root == 1014) {
                    let horseNum = ModuleService.getModule(BagMouduleC).getAllMatureHorse().length;
                    if (horseNum < 2) {
                        gudieID = 1007;
                    }
                }
                console.log("gudieID   :", gudieID);
                this.reqStartGuide(gudieID)
            }
        }
    }

    /**
     * 是否完成引导
     * @returns 
     */
    public isCompleteForce() {
        return this.data.isFinishedForce()
    }

    /**
     * 请求开始引导
     * @param guideId 
     */
    public async reqStartGuide(guideId: number) {
        console.log("请求开始引导", guideId)
        if (guideId < this._currentGuidingID && this._currentGuidingID > 0) {
            let curCfg = GameConfig.Newguide.getElement(this._currentGuidingID)
            if (curCfg.next != guideId) {
                return
            }
        }

        if (!this._guideUI) {
            this._guideUI = mw.UIService.show(GuidanceUI)
            this._guideUI.reset()
        }
        let cfg = GameConfig.Newguide.getElement(guideId)
        let player = Player.localPlayer;
        if (cfg.CanMove) {
            player.character.movementEnabled = true
        } else {
            player.character.movementEnabled = false
        }
        this.server.net_startGuide(guideId)
    }

    public async onStartGuide_1001() {
        ModuleService.getModule(PlayerModuleC).hideBasicUI();
        let cfg = GameConfig.Newguide.getElement(1001)
        let anchorStart = await GameObject.asyncFindGameObjectById(cfg.CameraStart)
        CameraUtils.changeCamera(anchorStart);
        if (cfg.CameraEnd) {
            let anchorEnd = await GameObject.asyncFindGameObjectById(cfg.CameraEnd)
            ActionMgr.instance().moveTo3D(anchorStart, anchorEnd.worldTransform.position, 3000, this, () => {
                this.reqEndGuide(1001)
            })
        }
    }
    public async onStartGuide_1002() {
        let cfg = GameConfig.Newguide.getElement(1002)
        this._guideUI.showLetter(cfg.Letter, () => {
            this.reqEndGuide(1002)
        })
    }

    /**
     * 开船
     */
    public async onStartGuide_1003() {
        let cfg = GameConfig.Newguide.getElement(1003)
        let boat = await GameObject.asyncFindGameObjectById(SceneObject_Boat)
        let boatStart = await GameObject.asyncFindGameObjectById(cfg.BoatStart)
        boat.worldTransform.position = boatStart.worldTransform.position.clone()
        if (cfg.BoatEnd) {
            let boatEnd = await GameObject.asyncFindGameObjectById(cfg.BoatEnd)
            boat.worldTransform.rotation = boatEnd.worldTransform.position.clone().subtract(boatStart.worldTransform.position.clone()).toRotation().clone()

            SoundHelper.instance().play(1025)

            ActionMgr.instance().moveTo3D(boat, boatEnd.worldTransform.position.clone(), 5000, this, () => {
                this.reqEndGuide(1003)
            })
        }
        if (cfg.Dialog) {
            this._guideUI.showDialog(cfg.Dialog, 5, () => {
                // this.reqEndGuide(1003)
            })
        }

        let anchorStart = await GameObject.asyncFindGameObjectById(cfg.CameraStart)
        CameraUtils.changeCamera(anchorStart);
    }

    /**
     * 对话
     */
    public async onStartGuide_1004() {
        let cfg = GameConfig.Newguide.getElement(1004)
        CameraUtils.resetCamera();
        if (cfg.Dialog) {

            this._guideUI.showDialog(cfg.Dialog, 1, () => {
                this.reqEndGuide(1004)
            })
        }
    }

    /**
     * 引导去马厩
     */
    public async onStartGuide_1005() {
        let cfg = GameConfig.Newguide.getElement(1005)
        CameraUtils.resetCamera();
        GameObject.asyncFindGameObjectById(cfg.Distination).then(anchor => {
            let defaultUI = mw.UIService.show(DefaultUI);
            defaultUI.showGuide();
            this.createNewTask(() => {
                let sqrLength = anchor.worldTransform.position.subtract(Player.localPlayer.character.worldTransform.position).sqrLength
                if (sqrLength < 40000) {
                    return true
                }
                return false
            }, () => {
                if (anchor instanceof mw.Trigger) {
                    anchor.onEnter.broadcast(Player.localPlayer.character)
                }
                defaultUI.hideGuide();
                this.reqEndGuide(1005)
            })
        })
    }

    /**
     * 独白
     */
    public async onStartGuide_1006() {
        let cfg = GameConfig.Newguide.getElement(1006)
        this._guideUI.showDialog(cfg.Dialog, 1, () => {
            this.reqEndGuide(1006)
        })
    }

    /**
     * 点击商店
     */
    public async onStartGuide_1007() {
        let cfg = GameConfig.Newguide.getElement(1007)
        let basic = mw.UIService.show(BasicView)
        this.createNewTask(() => {
            if (basic.visible) {
                return true
            }
            return false
        }, () => {
            this._guideUI.focusWidget(basic.buttonShop, cfg.Focus, 400, () => {
                this.reqEndGuide(1007)
            })
        })
    }

    /**
     * 对话
     */
    public async onStartGuide_1008() {
        let cfg = GameConfig.Newguide.getElement(1008)
        let interactive = mw.UIService.getUI(InteractiveUI)
        this.createNewTask(() => {
            if (interactive.visible) {
                return true
            }
            return false
        }, () => {
            this._guideUI.focusWidget(interactive.button_yes, cfg.Focus, 400, () => {
                this.reqEndGuide(1008)
            })
        })
        mw.UIService.hide(BasicView)
    }

    /**
     * 选择血统
     */
    public async onStartGuide_1009() {
        let cfg = GameConfig.Newguide.getElement(1009)
        let shopUI = mw.UIService.getUI(ShopUI)
        this.createNewTask(() => {
            if (shopUI.visible) {
                return true
            }
            return false
        }, () => {
            this._guideUI.focusWidget(shopUI['_lineageBtns'][0].button, cfg.Focus, 400, () => {
                this.reqEndGuide(1009)
            })
        })
    }

    /**
    * 就选它了
    */
    public async onStartGuide_1010() {
        let cfg = GameConfig.Newguide.getElement(1010)
        let shopUI = mw.UIService.getUI(ShopUI)
        this.createNewTask(() => {
            if (shopUI.visible) {
                return true
            }
            return false
        }, () => {
            this._guideUI.focusWidget(shopUI.mBtnOK, cfg.Focus, 400, () => {
                this.reqEndGuide(1010)
            })
        })
    }

    /**
     * 选择马
     */
    public async onStartGuide_1011() {
        let cfg = GameConfig.Newguide.getElement(1011)
        let shopInner = mw.UIService.getUI(ShopInnerUI)
        this.createNewTask(() => {
            if (shopInner.visible) {
                shopInner.mBtnClose.visibility = mw.SlateVisibility.Hidden
                if (shopInner.mDetailCanvas.visible) {
                    return true
                }
            }
            return false
        }, () => {
            shopInner.mBtnClose.visibility = mw.SlateVisibility.Visible
            this._guideUI.focusWidget(shopInner.mSelect, cfg.Focus, 400, () => {
                this.reqEndGuide(1011)
            })
        })
    }

    /**
     * 牵走
     */
    public async onStartGuide_1012() {
        let cfg = GameConfig.Newguide.getElement(1012)
        let shopInner = mw.UIService.getUI(ShopInnerUI)
        this.createNewTask(() => {
            if (shopInner.visible, shopInner.mBtnTake.visible) {
                return true
            }
            return false
        }, () => {
            this._guideUI.focusWidget(shopInner.mBtnTake, cfg.Focus, 400, () => {
                this.reqEndGuide(1012)
            })
        })
    }

    /**
     * 独白
     */
    public async onStartGuide_1013() {
        mw.UIService.hide(InteractiveUI)
        let cfg = GameConfig.Newguide.getElement(1013)
        this._guideUI.showDialog(cfg.Dialog, 1, () => {
            this.reqEndGuide(1013)
        })
    }

    /**
    * 引导点击繁育按钮
    */
    public async onStartGuide_1014() {
        let cfg = GameConfig.Newguide.getElement(1014)
        mw.UIService.show(BasicView)
        let basic = mw.UIService.getUI(BasicView)
        this.createNewTask(() => {
            if (basic.visible) {
                return true
            }
            return false
        }, () => {
            this._guideUI.focusWidget(basic.button_breed, cfg.Focus, 400, () => {
                this.reqEndGuide(1014)
            })
        })
    }

    /**
     * 和繁育NPC对话
     */
    public async onStartGuide_1015() {
        let cfg = GameConfig.Newguide.getElement(1015)
        mw.UIService.hide(BasicView)
        let interactive = mw.UIService.getUI(InteractiveUI)
        this.createNewTask(() => {
            if (interactive.visible) {
                return true
            }
            return false
        }, () => {
            this._guideUI.focusWidget(interactive.button_yes, cfg.Focus, 400, () => {
                this.reqEndGuide(1015)
            })
        })
    }

    /**
     * 选择插槽1
     */
    public async onStartGuide_1016() {
        let cfg = GameConfig.Newguide.getElement(1016)
        let breed = mw.UIService.getUI(BreedUI)
        this.createNewTask(() => {
            if (breed.visible) {
                return true
            }
            return false
        }, () => {
            this._guideUI.focusWidget(breed.button_icon1, cfg.Focus, 400, () => {
                this.reqEndGuide(1016)
            })
            this._guideUI.showIntroduce(cfg.Introduce, cfg.IntroducePos)
        })
    }
    /**
    * 选择马匹
    */
    public async onStartGuide_1017() {
        let cfg = GameConfig.Newguide.getElement(1017)
        let horseUI = mw.UIService.getUI(HorseBagUI)
        this.createNewTask(() => {
            if (horseUI.visible) {
                return true
            }
            return false
        }, () => {
            this._guideUI.focusWidget(horseUI.button_choose, cfg.Focus, 400, () => {
                this.reqEndGuide(1017)
            })
        })
    }

    /**
     * 选择插槽2
     */
    public async onStartGuide_1018() {
        let cfg = GameConfig.Newguide.getElement(1018)
        let breed = mw.UIService.getUI(BreedUI)
        this.createNewTask(() => {
            if (breed.visible) {
                return true
            }
            return false
        }, () => {
            this._guideUI.focusWidget(breed.button_icon2, cfg.Focus, 400, () => {
                this.reqEndGuide(1018)
            })
            this._guideUI.showIntroduce(cfg.Introduce, cfg.IntroducePos)
        })
    }
    /**
    * 选择马匹
    */
    public async onStartGuide_1019() {
        let cfg = GameConfig.Newguide.getElement(1019)
        let horseUI = mw.UIService.getUI(HorseBagUI)
        this.createNewTask(() => {
            if (horseUI.visible) {
                return true
            }
            return false
        }, () => {
            this._guideUI.focusWidget(horseUI.button_choose, cfg.Focus, 400, () => {
                this.reqEndGuide(1019)
            })
        })
    }

    /**
     * 点击繁育
     */
    public async onStartGuide_1020() {
        let cfg = GameConfig.Newguide.getElement(1020)
        let breed = mw.UIService.getUI(BreedUI)
        this.createNewTask(() => {
            if (breed.visible) {
                return true
            }
            return false
        }, () => {
            this._guideUI.focusWidget(breed.button_breed, cfg.Focus, 400, () => {
                this.reqEndGuide(1020)
            })
            this._guideUI.showIntroduce(cfg.Introduce, cfg.IntroducePos)
        })
    }

    /**
     * 独白
     */
    public async onStartGuide_1021() {
        mw.UIService.hide(InteractiveUI)
        mw.UIService.hide(BasicView)
        let cfg = GameConfig.Newguide.getElement(1021)
        this.createNewTask(() => {
            // if (BreedMgr.instance().isBreedFinished()) {
            if (ModuleService.getModule(BreedModuleC).isBreedFinished()) {
                return true
            }
            return false
        }, () => {
            if (cfg.Dialog) {
                this._guideUI.showDialog(cfg.Dialog, 1, () => {
                    this.reqEndGuide(1021)
                })
            }
        })
    }


    /**
    * 走近小马
    */
    public async onStartGuide_1022() {
        let cfg = GameConfig.Newguide.getElement(1022)
        mw.UIService.hide(BasicView)
        mw.UIService.hide(InteractiveUI)
        GameObject.asyncFindGameObjectById(cfg.Distination).then(anchor => {
            this.createNewTask(() => {
                let sqrLength = anchor.worldTransform.position.clone().subtract(Player.localPlayer.character.worldTransform.position).sqrLength
                if (sqrLength < 25600) {
                    return true
                }
                return false
            }, () => {
                if (anchor instanceof mw.Trigger) {
                    anchor.onEnter.broadcast(Player.localPlayer.character)
                }
                this.reqEndGuide(1022)
            })
        })
    }

    /**
     * 放入马厩对话
     */
    public async onStartGuide_1023() {
        let cfg = GameConfig.Newguide.getElement(1023)
        let interactive = mw.UIService.getUI(InteractiveUI)
        this.createNewTask(() => {
            if (interactive.visible) {
                return true
            }
            return false
        }, () => {
            this._guideUI.focusWidget(interactive.button_talk, cfg.Focus, 400, () => {
                this.reqEndGuide(1023)
            })
        })
    }

    /**
    * 放入马厩是
    */
    public async onStartGuide_1024() {
        let cfg = GameConfig.Newguide.getElement(1024)
        let interactive = mw.UIService.getUI(InteractiveUI)
        this.createNewTask(() => {
            if (interactive.visible) {
                return true
            }
            return false
        }, () => {
            this._guideUI.focusWidget(interactive.button_yes, cfg.Focus, 400, () => {
                this.reqEndGuide(1024)
            })
        })
        mw.UIService.show(BasicView)
    }

    /**
     * 引导进入马厩
     */
    public async onStartGuide_1025() {

        let cfg = GameConfig.Newguide.getElement(1025)
        let basic = mw.UIService.show(BasicView)
        this.createNewTask(() => {
            if (basic.visible) {
                return true
            }
            return false
        }, () => {
            this._guideUI.focusWidget(basic.buttonBag, cfg.Focus, 400, () => {
                this.reqEndGuide(1025)
            })
        })
    }
    /**
     * 显示信封
     */
    public async onStartGuide_1026() {
        mw.UIService.hide(BasicView)
        let cfg = GameConfig.Newguide.getElement(1026)
        this._guideUI.showLetter(cfg.Letter, () => {
            this.reqEndGuide(1026)
        })
    }
    /**
     * 选择马出战
     */
    public async onStartGuide_1027() {
        let cfg = GameConfig.Newguide.getElement(1027)
        let horseBagUI = mw.UIService.getUI(HorseBagUI)
        this.createNewTask(() => {
            if (horseBagUI.visible) {
                return true
            }
            return false
        }, () => {
            Player.localPlayer.character.movementEnabled = false;
            this._guideUI.focusWidget(horseBagUI.mBtnSelect, cfg.Focus, 400, () => {
                mw.UIService.show(BasicView)
                this.reqEndGuide(1027)
            })
        })
    }

    /**
     * 点击参与
     */
    public async onStartGuide_1028() {

        let cfg = GameConfig.Newguide.getElement(1028)
        let basicView = mw.UIService.show(BasicView)
        // basicView.panelShot.visibility = mw.SlateVisibility.Hidden
        this.createNewTask(() => {
            // console.log("fsafasfasf1", basicView.mainCanvas.visible, basicView.mainCanvas.visibility)
            // console.log("fsafasfasf2", basicView.canvas_notice.visible, basicView.canvas_notice.visibility)
            if (basicView.visible
                && basicView.button_join.visible && basicView.mainCanvas.visible
                && ModuleService.getModule(RacingModuleC).getCompotitionState() == ECompetitionState.Sign) {
                return true
            }
            return false
        }, () => {
            this._guideUI.focusWidget(basicView.button_join, cfg.Focus, 400, () => {
                this.reqEndGuide(1028)
            })
        })
    }

    /**
     * 对话是
     */
    public async onStartGuide_1029() {
        let cfg = GameConfig.Newguide.getElement(1029)
        let interactive = mw.UIService.getUI(InteractiveUI)
        this.createNewTask(() => {
            if (interactive.visible && interactive.button_yes.visible) {
                return true
            }
            return false
        }, () => {
            this._guideUI.focusWidget(interactive.button_yes, cfg.Focus, 400, () => {
                this.reqEndGuide(1029)
            })
        })
    }

    /**
     * 介绍跑道
     */
    public async onStartGuide_1030() {
        let cfg = GameConfig.Newguide.getElement(1030)
        let racingUI = mw.UIService.getUI(RaceUI)
        this.createNewTask(() => {
            if (racingUI.visible && racingUI.scroll_rank.visible) {
                return true
            }
            return false
        }, () => {
            // this._guideUI.focusWidget(racingUI.rankRoot, cfg.Focus, 400)
            // this._guideUI.showIntroduce(cfg.Introduce, cfg.IntroducePos)
            // Scheduler.TimeStart(() => {
            //     this.reqEndGuide(1030)
            // }, 5)
            racingUI.panel_guide.visibility = mw.SlateVisibility.SelfHitTestInvisible
            setTimeout(() => {
                racingUI.panel_guide.visibility = mw.SlateVisibility.Hidden
                setTimeout(() => {
                    racingUI.panel_guide.visibility = mw.SlateVisibility.SelfHitTestInvisible
                }, 10);
            }, 10);
            this.reqEndGuide(1030)
        })
    }

    /**
     * 又搜到信
     */
    public async onStartGuide_1033() {

        let cfg = GameConfig.Newguide.getElement(1033)
        const settle = mw.UIService.getUI(SettlementUI)
        const guessResult = mw.UIService.getUI(GuessResultUI)
        const getMoney = mw.UIService.getUI(GetMoneyUI)
        this.createNewTask(() => {
            if ((ModuleService.getModule(RacingModuleC).getCompotitionState() == ECompetitionState.Free
                || ModuleService.getModule(RacingModuleC).getCompotitionState() == ECompetitionState.Wait)
                && !settle.visible && !guessResult.visible && !getMoney.visible) {
                return true
            }
            return false
        }, () => {
            let racingUI = mw.UIService.getUI(RaceUI)
            racingUI.panel_guide.visibility = mw.SlateVisibility.Hidden

            this._guideUI.showLetter(cfg.Letter, () => {
                this.reqEndGuide(1033)
            })
        })
    }
    public async onStartGuide_1034() {
        let cfg = GameConfig.Newguide.getElement(1034)
        if (ModuleService.getModule(PlayerModuleC).getSceneType() == ESceneType.Stable) {
            this.reqEndGuide(1034)
        } else {
            let basic = mw.UIService.getUI(BasicView)
            this.createNewTask(() => {
                if (basic.visible) {
                    return true
                }
                return false
            }, () => {
                this._guideUI.focusWidget(basic.buttonBag, cfg.Focus, 400, () => {
                    this.reqEndGuide(1034)
                })
            })
        }
    }

    /**
    * 引导靠近马粪
    */
    public async onStartGuide_1035() {
        let cfg = GameConfig.Newguide.getElement(1035)
        GameObject.asyncFindGameObjectById(cfg.Distination).then(anchor => {
            this.createNewTask(() => {
                let sqrLength = anchor.worldTransform.position.subtract(Player.localPlayer.character.worldTransform.position).sqrLength
                if (sqrLength < 15000) {
                    return true
                }
                return false
            }, () => {
                if (anchor instanceof mw.Trigger) {
                    anchor.onEnter.broadcast(Player.localPlayer.character)
                }
                this.reqEndGuide(1035)
            })
        })
    }

    /**
    * 引导靠近马粪管理员
    */
    public async onStartGuide_1036() {
        let cfg = GameConfig.Newguide.getElement(1036)
        GameObject.asyncFindGameObjectById(cfg.Distination).then(anchor => {
            this.createNewTask(() => {
                let sqrLength = anchor.worldTransform.position.subtract(Player.localPlayer.character.worldTransform.position).sqrLength
                if (sqrLength < 15000) {
                    return true
                }
                return false
            }, () => {
                if (anchor instanceof mw.Trigger) {
                    anchor.onEnter.broadcast(Player.localPlayer.character)
                }
                this.reqEndGuide(1036)
            })
        })
    }

    /**
     * 对话
     */
    public async onStartGuide_1037() {
        let cfg = GameConfig.Newguide.getElement(1037)
        let interactive = mw.UIService.getUI(InteractiveUI)
        this.createNewTask(() => {
            if (interactive.visible && interactive.button_talk.visible) {
                return true
            }
            return false
        }, () => {
            this._guideUI.focusWidget(interactive.button_talk, cfg.Focus, 400, () => {
                this.reqEndGuide(1037)
            })
        })
    }

    /**
     * 对话是
     */
    public async onStartGuide_1038() {
        let cfg = GameConfig.Newguide.getElement(1038)
        let interactive = mw.UIService.getUI(InteractiveUI)
        this.createNewTask(() => {
            if (interactive.visible && interactive.button_yes.visible) {
                return true
            }
            return false
        }, () => {
            this._guideUI.focusWidget(interactive.button_yes, cfg.Focus, 400, () => {
                this.reqEndGuide(1038)
            })
        })
    }

    /**
    * 点击卖出
    */
    public async onStartGuide_1039() {
        mw.UIService.show(BasicView)
        let cfg = GameConfig.Newguide.getElement(1039)
        let popWindowUI = mw.UIService.getUI(PopWindowUI)
        this.createNewTask(() => {
            if (popWindowUI.visible) {
                return true
            }
            return false
        }, () => {
            this._guideUI.focusWidget(popWindowUI.btnComfirm, cfg.Focus, 400, () => {
                this.reqEndGuide(1039)
            })
        })
    }


    /**
     * 引导去马厩
     */
    public async onStartGuide_1040() {
        let cfg = GameConfig.Newguide.getElement(1040)
        let basic = mw.UIService.show(BasicView)
        this.createNewTask(() => {
            if (basic.visible) {
                return true
            }
            return false
        }, () => {
            this._guideUI.focusWidget(basic.button_breed, cfg.Focus, 400, () => {
                this.reqEndGuide(1040)
            })
        })
    }
    /**
     * 引导点击喂养
     */
    public async onStartGuide_1041() {
        let cfg = GameConfig.Newguide.getElement(1041)
        mw.UIService.hide(BasicView)
        let growUI = mw.UIService.getUI(GrowUI)
        this.createNewTask(() => {
            if (growUI.visible) {
                return true
            }
            return false
        }, () => {
            Player.localPlayer.character.movementEnabled = false
            this._guideUI.focusWidget(growUI.mBtnFeed, cfg.Focus, 400, () => {
                this.reqEndGuide(1041)
            })
        })
    }

    /**
     * 引导玩家点击确定
     */
    public async onStartGuide_1042() {
        let cfg = GameConfig.Newguide.getElement(1042)
        let popWindowUI = mw.UIService.getUI(PopWindowUI)
        this.createNewTask(() => {
            if (popWindowUI.visible) {
                return true
            }
            return false
        }, () => {
            this._guideUI.focusWidget(popWindowUI.btnComfirm, cfg.Focus, 400, () => {
                this.reqEndGuide(1042)
                setTimeout(() => {
                    mw.UIService.hide(GrowUI)
                }, 1500);
            })
        })
    }

    /**
     * 引导进入马厩
     */
    public async onStartGuide_1043() {
        let cfg = GameConfig.Newguide.getElement(1043)
        let basic = mw.UIService.show(BasicView)
        this.createNewTask(() => {
            if (basic.visible) {
                return true
            }
            return false
        }, () => {
            this._guideUI.focusWidget(basic.buttonBag, cfg.Focus, 400, () => {
                this.reqEndGuide(1043)
            })
        })
    }

    public async net_onStartGuide(guideId: number) {
        this._currentGuidingID = guideId
        let cfg = GameConfig.Newguide.getElement(guideId)
        console.log("开始引导" + guideId)
        if (cfg.Pos) {
            GameObject.asyncFindGameObjectById(cfg.Pos).then(anchor => {
                Player.localPlayer.character.worldTransform.rotation = anchor.worldTransform.rotation.clone()
            })
        }
        if (cfg.Distination) {
            GameObject.asyncFindGameObjectById(cfg.Distination).then(anchor => {
                this.showGuideArrow(anchor)
                if (this._distnationEffect) {
                    this._distnationEffect.worldTransform.position = anchor.worldTransform.position.clone()
                    this._distnationEffect.play()
                    this._distnationEffect.setVisibility(mw.PropertyStatus.On)
                } else {
                    SpawnManager.wornAsyncSpawn(CommonAssets.GuideWorldTargetEffectGuid).then((obj) => {
                        console.log("创建指引特效")
                        this._distnationEffect = obj as mw.Effect
                        this._distnationEffect.play()
                        this._distnationEffect.worldTransform.position = anchor.worldTransform.position.clone()

                    })
                }
            })
        } else {
            if (this._distnationEffect) {
                this._distnationEffect.stop()
                this._distnationEffect.setVisibility(mw.PropertyStatus.Off)
            }
            this.hideGuideArrow()
        }

        if (cfg.Mask) {
            this._guideUI.showBlackMask()
        } else {
            this._guideUI.hideBlackMask()
        }

        if (cfg.Hide) {
            for (let i = 0; i < cfg.Hide.length; i++) {
                GameObject.asyncFindGameObjectById(cfg.Hide[i]).then((obj) => {
                    obj.setVisibility(mw.PropertyStatus.Off)
                    if (obj instanceof mw.Trigger) {
                        obj.enabled = (false)
                    }
                })
            }
        }
        if (cfg.Show) {
            for (let i = 0; i < cfg.Show.length; i++) {
                GameObject.asyncFindGameObjectById(cfg.Show[i]).then((obj) => {
                    obj.setVisibility(mw.PropertyStatus.FromParent)
                    if (obj instanceof mw.Trigger) {
                        obj.enabled = (true)
                    }
                })
            }
        }

        this['onStartGuide_' + guideId]()
    }

    private createNewTask(condition: () => boolean, fn: () => void) {
        let task: GuideTask = {
            index: this._taskIndex++,
            stats: 0,
            func: fn,
            condition: condition
        }
        this._focusTasks.push(task)
    }

    /**
     * 请求结束引导
     * @param id 
     */
    public reqEndGuide(guideId: number) {
        if (guideId != this._currentGuidingID) {
            return
        }
        let curCfg = GameConfig.Newguide.getElement(guideId);
        if (curCfg && curCfg.next) {
            let nextCfg = GameConfig.Newguide.getElement(curCfg.next);
            if (nextCfg && !nextCfg.CanMove) {
                Player.localPlayer.character.movementEnabled = false;
            }
        }
        this.server.net_endGuide(guideId)
    }

    /**
     * 请求结束引导
     * @param guideId 
     */
    public net_onEndGuide(guideId: number) {
        this._guideUI.reset()

        let cfg = GameConfig.Newguide.getElement(guideId)
        if (cfg.Translate) {
            this._guideUI.showTranslate(() => {
                this._guideUI.hideLetter()
                this.guideNext(guideId)
            })
        } else {
            this.guideNext(guideId)
        }
    }

    /**
     * 引导下一步
     */
    public guideNext(guideId: number) {
        if (guideId == 1042) {
            setTimeout(() => {
                let curCfg = GameConfig.Newguide.getElement(guideId)
                let next = 0
                if (curCfg.next) {
                    next = curCfg.next;
                } else {
                    next = guideId + 1
                }
                let cfg = GameConfig.Newguide.getElement(next)
                if (cfg) {
                    this.reqStartGuide(next)
                } else {
                    mw.UIService.hide(GuidanceUI)
                }
            }, 5000);
            return;
        }
        let curCfg = GameConfig.Newguide.getElement(guideId)
        let next = 0
        if (curCfg.next) {
            next = curCfg.next;
        }
        if (next) {
            this.reqStartGuide(next)
        } else {
            mw.UIService.hide(GuidanceUI)
        }
    }

    /**
     * 引导参赛
     */
    public guideRacing(guideId) {
        this.reqStartGuide(guideId)
    }

    /**
     * 显示引导箭头
     */
    public showGuideArrow(endAnchor: mw.GameObject) {
        const start = Player.localPlayer.character.worldTransform.position.clone()
        start.z -= 70
        const end = endAnchor.worldTransform.position.clone()
        end.z -= 40
        const offset = end.clone().subtract(start)
        const middle = new mw.Vector((start.x + end.x) / 2, (start.y + end.y) / 2, (start.z + end.z) / 2,)
        if (!this._guideArrow) {
            SpawnManager.wornAsyncSpawn(CommonAssets.GuideArrowGuid).then((obj) => {
                obj.worldTransform.scale = new mw.Vector(offset.length / 100, 1, 0.01)
                obj.worldTransform.position = middle
                obj.worldTransform.rotation = offset.toRotation()
                if (obj instanceof mw.Model) {
                    obj.setMaterial(CommonAssets.GuideArrowMartialGuid)
                }
                this._guideArrow = obj
                this._arrowEndAnchor = endAnchor
            })
        } else {
            this._guideArrow.setVisibility(mw.PropertyStatus.On)
            this._guideArrow.worldTransform.scale = new mw.Vector(offset.length / 100, 1, 0.01)
            this._guideArrow.worldTransform.position = middle
            this._guideArrow.worldTransform.rotation = offset.toRotation()
            this._arrowEndAnchor = endAnchor
        }
    }

    /**
     * 隐藏引导箭头
     */
    public hideGuideArrow() {
        this._arrowEndAnchor = null
        this._guideArrow && this._guideArrow.setVisibility(mw.PropertyStatus.Off)
    }

    public updateArrow() {
        const start = Player.localPlayer.character.worldTransform.position.clone()
        start.z -= 70
        const end = this._arrowEndAnchor.worldTransform.position.clone()
        end.z -= 40
        const offset = end.clone().subtract(start)
        const middle = new mw.Vector((start.x + end.x) / 2, (start.y + end.y) / 2, (start.z + end.z) / 2,)

        this._guideArrow.worldTransform.scale = new mw.Vector(offset.length / 100, 1, 0.01)
        this._guideArrow.worldTransform.position = middle
        this._guideArrow.worldTransform.rotation = offset.toRotation()
    }
}

export class NewGuideModuleS extends ModuleS<NewGuideModuleC, GuideData> {
    private _guidingMap: Map<number, number> = new Map()

    /** 当脚本被实例后，会在第一帧更新前调用此函数 */
    public onStart(): void {

    }

    /**
     * 周期函数 每帧执行
     * 此函数执行需要将this.useUpdate赋值为true
     * @param dt 当前帧与上一帧的延迟 / 秒
     */
    public onUpdate(dt: number): void {

    }

    /** 脚本被销毁时最后一帧执行完调用此函数 */
    public onDestroy(): void {

    }

    /************************************************************************************************ */

    /**
     * 开始引导
     * @param guideId 
     */
    public async net_startGuide(guideId: number) {
        console.log("服务器开始引导" + guideId)
        let playerId = this.currentPlayerId
        let cfg = GameConfig.Newguide.getElement(guideId)
        if (cfg.Pos) {
            await GameObject.asyncFindGameObjectById(cfg.Pos).then(anchor => {
                Player.getPlayer(playerId).character.worldTransform.position = anchor.worldTransform.position.clone()
                Player.getPlayer(playerId).character.worldTransform.rotation = anchor.worldTransform.rotation.clone()
            })
        }
        if (cfg.CanMove) {
            Player.getPlayer(playerId).character.movementEnabled = true
        } else {
            Player.getPlayer(playerId).character.movementEnabled = false
        }

        this._guidingMap.set(playerId, guideId)

        /** 买马引导的时候将钻石恢复到400 */
        if (guideId == 1007) {
            ModuleService.getModule(PlayerModuleS).setDiamon(this.currentPlayerId, 400);
        }

        this.getClient(playerId).net_onStartGuide(guideId)
    }

    /**
    * 结束引导
    * @param guideID 
    */
    public net_endGuide(guideID: number) {
        this.endGuide(this.currentPlayerId, guideID)
    }

    public endGuide(playerID: number, guideID: number) {
        if (guideID < this._guidingMap.get(playerID)) {
            return
        }
        let guideData = this.getPlayerData(playerID)
        let cfg = GameConfig.Newguide.getElement(guideID)
        if (cfg.Root && cfg.next) {
            guideData.saveForceGuideId(guideID)
        } else {
            guideData.finishForceTrue()
        }

        guideData.save(true)

        this._guidingMap.delete(playerID)
        this.getClient(playerID).net_onEndGuide(guideID)
    }

    /**
     * 获取正等待参赛的玩家
     */
    public getStartersOfWaittingForCompetition() {
        let playerIDs: number[] = []
        console.log('获取正等待参赛的玩家', this._guidingMap)
        this._guidingMap.forEach((guideId, playerId) => {
            if (Player.getPlayer(playerId)) {
                if (guideId == 1028 || guideId == 1029) {
                    playerIDs.push(playerId)
                }
            }
        })
        return playerIDs
    }

    /**
     * 获取玩家是否在进行新手引导
     * @param playerID 玩家ID
     * @returns 是否在引导
     */
    public getPlayerGuide(playerID: number): boolean {
        if (this._guidingMap.has(playerID)) {
            return true;
        }
        return false;
    }
}