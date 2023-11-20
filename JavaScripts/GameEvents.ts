/*
 * @Author: jiezhong.zhang
 * @Date: 2022-09-30 11:16:08
 * @LastEditors: 代纯 chun.dai@appshahe.com
 * @LastEditTime: 2022-12-13 21:20:15
 */
export class GameEvents {
	//合成成功
	static readonly EVENT_COMPOSE_SUCEESS = 'EVENT_COMPOSE_SUCEESS'

	//赛事状态改变
	static readonly EVENT_COMPETITION_STATE_CHANGE = 'EVENT_COMPETITION_STATE_CHANGE'

	//金币变动
	static readonly EVNET_MONEY_CHANGE = 'EVNET_MONEY_CHANGE'
	//钻石变动
	static readonly EVNET_DIAMOND_CHANGE = 'EVNET_DIAMOND_CHANGE'

	/** 显示UIdefault */
	static readonly EVNET_SHOW_DEFAULT = "EVNET_SHOW_DEFAULT";

	//天气消息
	static readonly EVENT_WEATHER_INFO = 'EVENT_WEATHER_INFO'

	//小马吃完饭
	static readonly EVENT_HORSE_ENDEAT = 'EVENT_HORSE_ENDEAT'

	//小马长大
	static readonly EVENT_HORSE_GROWUP = 'EVENT_HORSE_GROWUP'

	//触发买卖粪便
	static readonly EVENT_SELL_FAT = 'EVENT_TRIGGER_SELL_FAT'

	//比赛事件广播
	static readonly EVENT_COMPETITION_BROCAST = 'EVENT_COMPETITION_BROCAST'

	//预设赛道
	static readonly EVENT_PRESET_RACE_WAY = 'EVENT_PRESET_RACE_WAY'

	//添加buff
	static readonly EVENT_HORSE_ADD_BUFF = 'EVENT_HORSE_ADD_BUFF'
	//按钮点击
	static readonly EVENT_BUTTON_CLICK = "PlayButtonClick"

	//传递当前剩余的恢复精力时间
	static readonly EVENT_SHOW_RECOVERY_ENERGY_TIME = "EVENT_SHOW_RECOVERY_ENERGY_TIME"
	//传递当前剩余的进食恢复时间
	static readonly EVENT_SHOW_RECOVERY_FEED_TIME = "EVENT_SHOW_RECOVERY_FEED_TIME"

}