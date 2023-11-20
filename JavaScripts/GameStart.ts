import { PlayerModuleC, PlayerModuleData, PlayerModuleS } from "./module/PlayerModule";
import { RacingData, RacingModuleC, RacingModuleS } from "./module/RacingModule";
import { CommonAssets, ESceneType, GlobalVar } from "./Common";
import { SyntheticModuleC, SyntheticModuleS } from "./module/SyntheticModule";
import { Scheduler } from "./utils/Scheduler";
import { GameConfig } from "./config/GameConfig";
import { GuessModuleC, GuessModuleS } from "./module/GuessModule";
import { BagModuleData, BagMouduleC, BagMouduleS } from "./module/BagMoudule";
import { WeatherData, WeatherModuleC, WeatherModuleS } from "./module/WeatherModule";
import { StableModuleC, StableModuleS } from "./module/StableModule";
import { GMModuleC, GMModuleS } from "./module/GMModule";
import { WorldUIModuleC, WorldUIModuleS } from "./module/WorldUIModule";
import { GuideData, NewGuideModuleC, NewGuideModuleS } from "./module/GuideModule";
import { ShopModuleC, ShopModuleData, ShopModuleS } from "./module/ShopModule";
import { BreedModuleC, BreedModuleData, BreedModuleS } from "./module/BreedModule";

@Component
export default class GameStart extends mw.Script {

    @mw.Property()
    isOnline: boolean = false;

    @mw.Property({ displayName: "马匹最大速度" })
    max_speed: number = 500;

    @mw.Property({ displayName: "马匹最大加速度" })
    max_accelerated_speed: number = 100;

    @mw.Property({ displayName: "AI马匹合成所用数量" })
    ai_synthetic_num: number = 3;

    @mw.Property({ displayName: "繁育加成" })
    breed_addition: number = 1.05;

    @mw.Property({ displayName: "默认每匹马下注" })
    bet_default: number = 500;

    /** 当脚本被实例后，会在第一帧更新前调用此函数 */
    public onStart(): void {
        super.onStart()

        this.setGlobalVar();

        //设置配置表语言
        GameConfig.initLanguage(-1, (key) => {
            let ele = GameConfig.Language.getElement(key);
            if (ele == null) return "unknow_" + key;
            return ele.Value;
        });

        mw.UIScript.addBehavior("lan", (ui: mw.StaleButton | mw.TextBlock) => {
            let key: string = ui.text;
            if (key) {
                let arr = GameConfig.Language.findElement("Name", key);
                if (arr) {
                    //查表， GameConfig.Language.getElement(key);
                    let lan = GameConfig.Language.getElement(key);
                    ui.text = (lan.Value);
                }
            }
        })

        if (mw.SystemUtil.isServer()) {
            DataStorage.setTemporaryStorage(!this.isOnline)
            Player.onPlayerJoin.add((player) => {
                player.character.collisionWithOtherCharacterEnabled = false
            })
        }

        this.onRegisterModule();
    }

    private setGlobalVar() {
        GlobalVar.MAX_SPEED = this.max_speed;
        GlobalVar.MAX_ACCELERATED_SPEED = this.max_accelerated_speed;
        GlobalVar.AI_SYNTHETIC_NUM = this.ai_synthetic_num;
        GlobalVar.BREED_ADDITION_MAX = this.breed_addition;
        GlobalVar.BET_DEFAULT = this.bet_default;

        GlobalVar.RECOVERY_ENERGY_TIME = GameConfig.Global.getElement(1033).Parameter1
        GlobalVar.RECOVERY_FEED_CD = GameConfig.Global.getElement(1028).Parameter1
        GlobalVar.Duration_Competition_Interval = GameConfig.Global.getElement(1009).Parameter1
        GlobalVar.Duration_Competition_SignUp = GameConfig.Global.getElement(1012).Parameter1
        GlobalVar.Duration_Competition_Bet = GameConfig.Global.getElement(1008).Parameter1
        GlobalVar.Duration_Competition_Ready = GameConfig.Global.getElement(1007).Parameter1
        GlobalVar.Duration_Competition_CountDown = GameConfig.Global.getElement(1006).Parameter1
        GlobalVar.Duration_Competition_End = GameConfig.Global.getElement(1013).Parameter1
        GlobalVar.Duration_Competition_Settle = GameConfig.Global.getElement(1014).Parameter1

        GlobalVar.Duration_Weather_Morning = GameConfig.Global.getElement(1015).Parameter1
        GlobalVar.Duration_Weather_Match = GameConfig.Global.getElement(1016).Parameter1
        GlobalVar.Duration_Weather_Dust = GameConfig.Global.getElement(1017).Parameter1
        GlobalVar.Duration_Weather_Night = GameConfig.Global.getElement(1018).Parameter1

        GlobalVar.QTE_CLICK_TIMES = GameConfig.Global.getElement(1020).Parameter2
        GlobalVar.QTE_MAX_CLICK = GameConfig.Global.getElement(1021).Parameter1
        GlobalVar.QTE_CONDITIONS = GameConfig.Global.getElement(1022).Parameter2
        GlobalVar.VARIATION = GameConfig.Global.getElement(1024).Parameter2
        GlobalVar.GRADE_GRADE = GameConfig.Global.getElement(1026).Parameter2
        GlobalVar.TRAIL_STAGE = GameConfig.Global.getElement(1034).Parameter2
        GlobalVar.RATE_FONT_COLOR = GameConfig.Global.getElement(1041).Parameter4[0]
        GlobalVar.RATE_DESCRIBE = GameConfig.Global.getElement(1040).Parameter4
        GlobalVar.SIGN_UP_COST = GameConfig.Global.getElement(1042).Parameter1
        GlobalVar.TIME_AWARD_COEFFICIENT = GameConfig.Global.getElement(1048).Parameter1
        GlobalVar.CAMREA_MOVE_TIME = GameConfig.Global.getElement(1049).Parameter2[0];
        GlobalVar.CAMREA_NEAR_TIME = GameConfig.Global.getElement(1049).Parameter2[1];
        GlobalVar.CAMREA_FAT_TIME = GameConfig.Global.getElement(1049).Parameter2[2];
        GlobalVar.SPECIAL_SKILL_INTERVAL = GameConfig.Global.getElement(1050).Parameter2[0];
        GlobalVar.SPECIAL_SKILL_CD = GameConfig.Global.getElement(1050).Parameter2[1];
    }

    public onRegisterModule(): void {
        ModuleService.registerModule(PlayerModuleS, PlayerModuleC, PlayerModuleData)
        ModuleService.registerModule(NewGuideModuleS, NewGuideModuleC, GuideData);
        ModuleService.registerModule(GMModuleS, GMModuleC, null);
        ModuleService.registerModule(WeatherModuleS, WeatherModuleC, WeatherData);
        ModuleService.registerModule(RacingModuleS, RacingModuleC, RacingData);
        ModuleService.registerModule(SyntheticModuleS, SyntheticModuleC, null);
        ModuleService.registerModule(GuessModuleS, GuessModuleC, null);
        ModuleService.registerModule(BagMouduleS, BagMouduleC, BagModuleData);
        ModuleService.registerModule(StableModuleS, StableModuleC, null);
        ModuleService.registerModule(WorldUIModuleS, WorldUIModuleC, null);
        ModuleService.registerModule(ShopModuleS, ShopModuleC, ShopModuleData);
        ModuleService.registerModule(BreedModuleS, BreedModuleC, BreedModuleData);

        ModuleService.ready().then(() => {
            this.useUpdate = true;
            if (SystemUtil.isClient()) {
                ModuleService.getModule(PlayerModuleC).reqEnterGame()
            }
        })
    }

    /**
     * 周期函数 每帧执行
     * 此函数执行需要将this.bUseUpdate赋值为true
     * @param dt 当前帧与上一帧的延迟 / 秒
     */
    public onUpdate(dt: number): void {
        super.onUpdate(dt)
        Scheduler.Tick(dt)
        mw.TweenUtil.TWEEN.update()
    }

    /** 脚本被销毁时最后一帧执行完调用此函数 */
    public onDestroy(): void {

    }

    /**
     * 当客户端需要显示loading调用，需要请重写
     * @param msg 显示的提示内容
     * @param progress 进度条进度(0-1)
     * @param completeAotoClose 完成后是否自动关闭
     */
    public onClientLoading(msg: string, progress: number, completeAotoClose: boolean) {
        // Loading.showLoading(msg, progress, completeAotoClose);
        console.log("加载界面", progress)

        if (progress >= 1) {
            ModuleService.getModule(PlayerModuleC).reqEnterGame()
        }
    }

}