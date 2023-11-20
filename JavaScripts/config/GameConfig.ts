import {ConfigBase, IElementBase} from "./ConfigBase";
import {AudioConfig} from "./Audio";
import {BehaviorConfig} from "./Behavior";
import {EffectConfig} from "./Effect";
import {GlobalConfig} from "./Global";
import {HobbyConfig} from "./Hobby";
import {HorseConfig} from "./Horse";
import {LanguageConfig} from "./Language";
import {LineageConfig} from "./Lineage";
import {NameConfig} from "./Name";
import {NewguideConfig} from "./Newguide";
import {PartsConfig} from "./Parts";
import {PersonaliotyConfig} from "./Personalioty";
import {SkillConfig} from "./Skill";
import {TalkInfoConfig} from "./TalkInfo";
import {TrailingConfig} from "./Trailing";
import {WeatherConfig} from "./Weather";

export class GameConfig{
	private static configMap:Map<string, ConfigBase<IElementBase>> = new Map();
	/**
	* 多语言设置
	* @param languageIndex 语言索引(-1为系统默认语言)
	* @param getLanguageFun 根据key获取语言内容的方法
	*/
	public static initLanguage(languageIndex:number, getLanguageFun:(key:string|number)=>string){
		ConfigBase.initLanguage(languageIndex, getLanguageFun);
		this.configMap.clear();
	}
	public static getConfig<T extends ConfigBase<IElementBase>>(ConfigClass: { new(): T }): T {
		if (!this.configMap.has(ConfigClass.name)) {
			this.configMap.set(ConfigClass.name, new ConfigClass());
		}
		return this.configMap.get(ConfigClass.name) as T;
	}
	public static get Audio():AudioConfig{ return this.getConfig(AudioConfig) };
	public static get Behavior():BehaviorConfig{ return this.getConfig(BehaviorConfig) };
	public static get Effect():EffectConfig{ return this.getConfig(EffectConfig) };
	public static get Global():GlobalConfig{ return this.getConfig(GlobalConfig) };
	public static get Hobby():HobbyConfig{ return this.getConfig(HobbyConfig) };
	public static get Horse():HorseConfig{ return this.getConfig(HorseConfig) };
	public static get Language():LanguageConfig{ return this.getConfig(LanguageConfig) };
	public static get Lineage():LineageConfig{ return this.getConfig(LineageConfig) };
	public static get Name():NameConfig{ return this.getConfig(NameConfig) };
	public static get Newguide():NewguideConfig{ return this.getConfig(NewguideConfig) };
	public static get Parts():PartsConfig{ return this.getConfig(PartsConfig) };
	public static get Personalioty():PersonaliotyConfig{ return this.getConfig(PersonaliotyConfig) };
	public static get Skill():SkillConfig{ return this.getConfig(SkillConfig) };
	public static get TalkInfo():TalkInfoConfig{ return this.getConfig(TalkInfoConfig) };
	public static get Trailing():TrailingConfig{ return this.getConfig(TrailingConfig) };
	public static get Weather():WeatherConfig{ return this.getConfig(WeatherConfig) };
}