
/**
 * AUTO GENERATE BY UI EDITOR.
 * WARNING: DO NOT MODIFY THIS FILE,MAY CAUSE CODE LOST.
 * AUTHOR: 今日份的晚安
 * UI: UI/ui/RaceUI.ui
 * TIME: 2023.05.15-17.57.13
 */

 

 @UIBind('UI/ui/RaceUI.ui')
 export default class RaceUI_Generate extends mw.UIScript {
	 @UIWidgetBind('RootCanvas/baseCanvas/rank_BG')
    public rank_BG: mw.Image=undefined;
    @UIWidgetBind('RootCanvas/baseCanvas/image_weather')
    public image_weather: mw.Image=undefined;
    @UIWidgetBind('RootCanvas/baseCanvas/rankRoot/image_rank1')
    public image_rank1: mw.Image=undefined;
    @UIWidgetBind('RootCanvas/baseCanvas/rankRoot/image_rank123_1')
    public image_rank123_1: mw.Image=undefined;
    @UIWidgetBind('RootCanvas/baseCanvas/rankRoot/image_rank123_2')
    public image_rank123_2: mw.Image=undefined;
    @UIWidgetBind('RootCanvas/baseCanvas/rankRoot/scroll_rank/canvas_rank/Canvas_1/mFirst')
    public mFirst: mw.TextBlock=undefined;
    @UIWidgetBind('RootCanvas/baseCanvas/rankRoot/scroll_rank/canvas_rank/Canvas_1/mSecond')
    public mSecond: mw.TextBlock=undefined;
    @UIWidgetBind('RootCanvas/baseCanvas/rankRoot/scroll_rank/canvas_rank/Canvas_1/mThird')
    public mThird: mw.TextBlock=undefined;
    @UIWidgetBind('RootCanvas/baseCanvas/rankRoot/scroll_rank/canvas_rank')
    public canvas_rank: mw.Canvas=undefined;
    @UIWidgetBind('RootCanvas/baseCanvas/rankRoot/scroll_rank')
    public scroll_rank: mw.ScrollBox=undefined;
    @UIWidgetBind('RootCanvas/baseCanvas/rankRoot/canvas_tittle/mRaceUI_Title')
    public mRaceUI_Title: mw.TextBlock=undefined;
    @UIWidgetBind('RootCanvas/baseCanvas/rankRoot/canvas_tittle/mRaceuihorsename')
    public mRaceuihorsename: mw.TextBlock=undefined;
    @UIWidgetBind('RootCanvas/baseCanvas/rankRoot/canvas_tittle/mRaceuispeed')
    public mRaceuispeed: mw.TextBlock=undefined;
    @UIWidgetBind('RootCanvas/baseCanvas/rankRoot/canvas_tittle/mRaceUITime')
    public mRaceUITime: mw.TextBlock=undefined;
    @UIWidgetBind('RootCanvas/baseCanvas/rankRoot/canvas_tittle')
    public canvas_tittle: mw.Canvas=undefined;
    @UIWidgetBind('RootCanvas/baseCanvas/rankRoot')
    public rankRoot: mw.Canvas=undefined;
    @UIWidgetBind('RootCanvas/baseCanvas/text_time')
    public text_time: mw.TextBlock=undefined;
    @UIWidgetBind('RootCanvas/baseCanvas/panelBrocast/brocastBg')
    public brocastBg: mw.Image=undefined;
    @UIWidgetBind('RootCanvas/baseCanvas/panelBrocast/scroll_report')
    public scroll_report: mw.ScrollBox=undefined;
    @UIWidgetBind('RootCanvas/baseCanvas/panelBrocast')
    public panelBrocast: mw.Canvas=undefined;
    @UIWidgetBind('RootCanvas/baseCanvas/canvas_setting/button_setting')
    public button_setting: mw.Button=undefined;
    @UIWidgetBind('RootCanvas/baseCanvas/canvas_setting')
    public canvas_setting: mw.Canvas=undefined;
    @UIWidgetBind('RootCanvas/baseCanvas/canvas_leave/button_leave')
    public button_leave: mw.Button=undefined;
    @UIWidgetBind('RootCanvas/baseCanvas/canvas_leave')
    public canvas_leave: mw.Canvas=undefined;
    @UIWidgetBind('RootCanvas/baseCanvas/panel_guide/btnFinger')
    public btnFinger: mw.Button=undefined;
    @UIWidgetBind('RootCanvas/baseCanvas/panel_guide')
    public panel_guide: mw.Canvas=undefined;
    @UIWidgetBind('RootCanvas/baseCanvas')
    public baseCanvas: mw.Canvas=undefined;
    @UIWidgetBind('RootCanvas/topCanvas')
    public topCanvas: mw.Canvas=undefined;
    

 
	protected onAwake() {
		//设置能否每帧触发onUpdate
		this.canUpdate = false;
		this.layer = mw.UILayerBottom;
		this.initButtons();
	}
	protected initButtons() {
		//按钮添加点击
		
		//按钮添加点击
		
		this.button_setting.onClicked.add(()=>{
			Event.dispatchToLocal("PlayButtonClick", "button_setting");
		})
		this.button_setting.touchMethod = (mw.ButtonTouchMethod.PreciseTap);
		
	
		this.button_leave.onClicked.add(()=>{
			Event.dispatchToLocal("PlayButtonClick", "button_leave");
		})
		this.button_leave.touchMethod = (mw.ButtonTouchMethod.PreciseTap);
		
	
		this.btnFinger.onClicked.add(()=>{
			Event.dispatchToLocal("PlayButtonClick", "btnFinger");
		})
		this.btnFinger.touchMethod = (mw.ButtonTouchMethod.PreciseTap);
		
	

		//按钮多语言
		
		//文本多语言
		
		this.initLanguage(this.mFirst)
		
	
		this.initLanguage(this.mSecond)
		
	
		this.initLanguage(this.mThird)
		
	
		this.initLanguage(this.mRaceUI_Title)
		
	
		this.initLanguage(this.mRaceuihorsename)
		
	
		this.initLanguage(this.mRaceuispeed)
		
	
		this.initLanguage(this.mRaceUITime)
		
	
		this.initLanguage(this.text_time)
		
	
		//文本多语言
		
		this.initLanguage(this.uiWidgetBase.findChildByPath("RootCanvas/baseCanvas/rankRoot/scroll_rank/canvas_rank/Canvas_1/TextBlock_4") as any);
		
	
		this.initLanguage(this.uiWidgetBase.findChildByPath("RootCanvas/baseCanvas/rankRoot/scroll_rank/canvas_rank/Canvas_1/TextBlock_5") as any);
		
	
		this.initLanguage(this.uiWidgetBase.findChildByPath("RootCanvas/baseCanvas/rankRoot/scroll_rank/canvas_rank/Canvas_1/TextBlock_6") as any);
		
	
		this.initLanguage(this.uiWidgetBase.findChildByPath("RootCanvas/baseCanvas/rankRoot/scroll_rank/canvas_rank/Canvas_1/TextBlock_7") as any);
		
	
		this.initLanguage(this.uiWidgetBase.findChildByPath("RootCanvas/baseCanvas/rankRoot/scroll_rank/canvas_rank/Canvas_1/TextBlock_8") as any);
		
	
		this.initLanguage(this.uiWidgetBase.findChildByPath("RootCanvas/baseCanvas/panel_guide/TextBlock_1") as any);
		
	

	}
	private initLanguage(ui: mw.StaleButton | mw.TextBlock) {
        let call = mw.UIScript.getBehavior("lan");
        if (call && ui) {
            call(ui);
        }
    }
 }
 