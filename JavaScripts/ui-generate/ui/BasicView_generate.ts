
/**
 * AUTO GENERATE BY UI EDITOR.
 * WARNING: DO NOT MODIFY THIS FILE,MAY CAUSE CODE LOST.
 * AUTHOR: 今日份的晚安
 * UI: UI/ui/BasicView.ui
 * TIME: 2023.05.15-17.57.12
 */

 

 @UIBind('UI/ui/BasicView.ui')
 export default class BasicView_Generate extends mw.UIScript {
	 @UIWidgetBind('RootCanvas/panel_diamond/mTextDiamond')
    public mTextDiamond: mw.TextBlock=undefined;
    @UIWidgetBind('RootCanvas/panel_diamond')
    public panel_diamond: mw.Canvas=undefined;
    @UIWidgetBind('RootCanvas/panel_money/mTextMoney')
    public mTextMoney: mw.TextBlock=undefined;
    @UIWidgetBind('RootCanvas/panel_money')
    public panel_money: mw.Canvas=undefined;
    @UIWidgetBind('RootCanvas/mainCanvas/panelShot/buttonGoBattle/mTex_Battle')
    public mTex_Battle: mw.TextBlock=undefined;
    @UIWidgetBind('RootCanvas/mainCanvas/panelShot/buttonGoBattle')
    public buttonGoBattle: mw.Button=undefined;
    @UIWidgetBind('RootCanvas/mainCanvas/panelShot/buttonBag/mTex_Bag')
    public mTex_Bag: mw.TextBlock=undefined;
    @UIWidgetBind('RootCanvas/mainCanvas/panelShot/buttonBag')
    public buttonBag: mw.Button=undefined;
    @UIWidgetBind('RootCanvas/mainCanvas/panelShot/buttonShop/mTexShop')
    public mTexShop: mw.TextBlock=undefined;
    @UIWidgetBind('RootCanvas/mainCanvas/panelShot/buttonShop')
    public buttonShop: mw.Button=undefined;
    @UIWidgetBind('RootCanvas/mainCanvas/panelShot/button_breed/mTex_Breed')
    public mTex_Breed: mw.TextBlock=undefined;
    @UIWidgetBind('RootCanvas/mainCanvas/panelShot/button_breed')
    public button_breed: mw.Button=undefined;
    @UIWidgetBind('RootCanvas/mainCanvas/panelShot/setCanvas/mBtnSet')
    public mBtnSet: mw.Button=undefined;
    @UIWidgetBind('RootCanvas/mainCanvas/panelShot/setCanvas')
    public setCanvas: mw.Canvas=undefined;
    @UIWidgetBind('RootCanvas/mainCanvas/panelShot')
    public panelShot: mw.Canvas=undefined;
    @UIWidgetBind('RootCanvas/mainCanvas/buttonHide')
    public buttonHide: mw.Button=undefined;
    @UIWidgetBind('RootCanvas/mainCanvas/button_weather/textWeather')
    public textWeather: mw.TextBlock=undefined;
    @UIWidgetBind('RootCanvas/mainCanvas/button_weather/textDaily')
    public textDaily: mw.TextBlock=undefined;
    @UIWidgetBind('RootCanvas/mainCanvas/button_weather')
    public button_weather: mw.Button=undefined;
    @UIWidgetBind('RootCanvas/mainCanvas/canvas_raceProgress/progress_race')
    public progress_race: mw.ProgressBar=undefined;
    @UIWidgetBind('RootCanvas/mainCanvas/canvas_raceProgress/canvas_sign/text_sign')
    public text_sign: mw.TextBlock=undefined;
    @UIWidgetBind('RootCanvas/mainCanvas/canvas_raceProgress/canvas_sign/image_sign')
    public image_sign: mw.Image=undefined;
    @UIWidgetBind('RootCanvas/mainCanvas/canvas_raceProgress/canvas_sign')
    public canvas_sign: mw.Canvas=undefined;
    @UIWidgetBind('RootCanvas/mainCanvas/canvas_raceProgress/canvas_guess/text_guess')
    public text_guess: mw.TextBlock=undefined;
    @UIWidgetBind('RootCanvas/mainCanvas/canvas_raceProgress/canvas_guess/image_guess')
    public image_guess: mw.Image=undefined;
    @UIWidgetBind('RootCanvas/mainCanvas/canvas_raceProgress/canvas_guess')
    public canvas_guess: mw.Canvas=undefined;
    @UIWidgetBind('RootCanvas/mainCanvas/canvas_raceProgress/canvas_race/text_race')
    public text_race: mw.TextBlock=undefined;
    @UIWidgetBind('RootCanvas/mainCanvas/canvas_raceProgress/canvas_race/image_race')
    public image_race: mw.Image=undefined;
    @UIWidgetBind('RootCanvas/mainCanvas/canvas_raceProgress/canvas_race')
    public canvas_race: mw.Canvas=undefined;
    @UIWidgetBind('RootCanvas/mainCanvas/canvas_raceProgress/canvas_wait/text_wait')
    public text_wait: mw.TextBlock=undefined;
    @UIWidgetBind('RootCanvas/mainCanvas/canvas_raceProgress/canvas_wait/image_wait')
    public image_wait: mw.Image=undefined;
    @UIWidgetBind('RootCanvas/mainCanvas/canvas_raceProgress/canvas_wait')
    public canvas_wait: mw.Canvas=undefined;
    @UIWidgetBind('RootCanvas/mainCanvas/canvas_raceProgress')
    public canvas_raceProgress: mw.Canvas=undefined;
    @UIWidgetBind('RootCanvas/mainCanvas/canvas_notice/clippingNode/text_notice')
    public text_notice: mw.TextBlock=undefined;
    @UIWidgetBind('RootCanvas/mainCanvas/canvas_notice/clippingNode')
    public clippingNode: mw.Canvas=undefined;
    @UIWidgetBind('RootCanvas/mainCanvas/canvas_notice/button_join/mTex_takeIn')
    public mTex_takeIn: mw.TextBlock=undefined;
    @UIWidgetBind('RootCanvas/mainCanvas/canvas_notice/button_join')
    public button_join: mw.Button=undefined;
    @UIWidgetBind('RootCanvas/mainCanvas/canvas_notice/text_time')
    public text_time: mw.TextBlock=undefined;
    @UIWidgetBind('RootCanvas/mainCanvas/canvas_notice')
    public canvas_notice: mw.Canvas=undefined;
    @UIWidgetBind('RootCanvas/mainCanvas')
    public mainCanvas: mw.Canvas=undefined;
    

 
	protected onAwake() {
		//设置能否每帧触发onUpdate
		this.canUpdate = false;
		this.layer = mw.UILayerBottom;
		this.initButtons();
	}
	protected initButtons() {
		//按钮添加点击
		
		//按钮添加点击
		
		this.buttonGoBattle.onClicked.add(()=>{
			Event.dispatchToLocal("PlayButtonClick", "buttonGoBattle");
		})
		this.buttonGoBattle.touchMethod = (mw.ButtonTouchMethod.PreciseTap);
		
	
		this.buttonBag.onClicked.add(()=>{
			Event.dispatchToLocal("PlayButtonClick", "buttonBag");
		})
		this.buttonBag.touchMethod = (mw.ButtonTouchMethod.PreciseTap);
		
	
		this.buttonShop.onClicked.add(()=>{
			Event.dispatchToLocal("PlayButtonClick", "buttonShop");
		})
		this.buttonShop.touchMethod = (mw.ButtonTouchMethod.PreciseTap);
		
	
		this.button_breed.onClicked.add(()=>{
			Event.dispatchToLocal("PlayButtonClick", "button_breed");
		})
		this.button_breed.touchMethod = (mw.ButtonTouchMethod.PreciseTap);
		
	
		this.mBtnSet.onClicked.add(()=>{
			Event.dispatchToLocal("PlayButtonClick", "mBtnSet");
		})
		this.mBtnSet.touchMethod = (mw.ButtonTouchMethod.PreciseTap);
		
	
		this.buttonHide.onClicked.add(()=>{
			Event.dispatchToLocal("PlayButtonClick", "buttonHide");
		})
		this.buttonHide.touchMethod = (mw.ButtonTouchMethod.PreciseTap);
		
	
		this.button_weather.onClicked.add(()=>{
			Event.dispatchToLocal("PlayButtonClick", "button_weather");
		})
		this.button_weather.touchMethod = (mw.ButtonTouchMethod.PreciseTap);
		
	
		this.button_join.onClicked.add(()=>{
			Event.dispatchToLocal("PlayButtonClick", "button_join");
		})
		this.button_join.touchMethod = (mw.ButtonTouchMethod.PreciseTap);
		
	

		//按钮多语言
		
		this.initLanguage(this.uiWidgetBase.findChildByPath("RootCanvas/panel_diamond/StaleButton_1") as any);
		
	
		//文本多语言
		
		this.initLanguage(this.mTextDiamond)
		
	
		this.initLanguage(this.mTextMoney)
		
	
		this.initLanguage(this.mTex_Battle)
		
	
		this.initLanguage(this.mTex_Bag)
		
	
		this.initLanguage(this.mTexShop)
		
	
		this.initLanguage(this.mTex_Breed)
		
	
		this.initLanguage(this.textWeather)
		
	
		this.initLanguage(this.textDaily)
		
	
		this.initLanguage(this.text_sign)
		
	
		this.initLanguage(this.text_guess)
		
	
		this.initLanguage(this.text_race)
		
	
		this.initLanguage(this.text_wait)
		
	
		this.initLanguage(this.text_notice)
		
	
		this.initLanguage(this.mTex_takeIn)
		
	
		this.initLanguage(this.text_time)
		
	
		//文本多语言
		
		this.initLanguage(this.uiWidgetBase.findChildByPath("RootCanvas/mainCanvas/buttonHide/TextBlock_6") as any);
		
	

	}
	private initLanguage(ui: mw.StaleButton | mw.TextBlock) {
        let call = mw.UIScript.getBehavior("lan");
        if (call && ui) {
            call(ui);
        }
    }
 }
 