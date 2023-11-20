
/**
 * AUTO GENERATE BY UI EDITOR.
 * WARNING: DO NOT MODIFY THIS FILE,MAY CAUSE CODE LOST.
 * AUTHOR: 今日份的晚安
 * UI: UI/ui/HorseDetail.ui
 * TIME: 2023.05.15-17.57.13
 */

 

 @UIBind('UI/ui/HorseDetail.ui')
 export default class HorseDetail_Generate extends mw.UIScript {
	 @UIWidgetBind('RootCanvas/Canvas_1/btnClose')
    public btnClose: mw.Button=undefined;
    @UIWidgetBind('RootCanvas/Canvas_1/mTexLineage')
    public mTexLineage: mw.TextBlock=undefined;
    @UIWidgetBind('RootCanvas/Canvas_1/textLineage')
    public textLineage: mw.TextBlock=undefined;
    @UIWidgetBind('RootCanvas/Canvas_1/mTexSpeed')
    public mTexSpeed: mw.TextBlock=undefined;
    @UIWidgetBind('RootCanvas/Canvas_1/textSpeed')
    public textSpeed: mw.TextBlock=undefined;
    @UIWidgetBind('RootCanvas/Canvas_1/textName')
    public textName: mw.TextBlock=undefined;
    @UIWidgetBind('RootCanvas/Canvas_1/mTexAccSpeed')
    public mTexAccSpeed: mw.TextBlock=undefined;
    @UIWidgetBind('RootCanvas/Canvas_1/textAcc')
    public textAcc: mw.TextBlock=undefined;
    @UIWidgetBind('RootCanvas/Canvas_1/mTexGrowth')
    public mTexGrowth: mw.TextBlock=undefined;
    @UIWidgetBind('RootCanvas/Canvas_1/textGrowValue')
    public textGrowValue: mw.TextBlock=undefined;
    @UIWidgetBind('RootCanvas/Canvas_1/mTexHobby')
    public mTexHobby: mw.TextBlock=undefined;
    @UIWidgetBind('RootCanvas/Canvas_1/textHobby')
    public textHobby: mw.TextBlock=undefined;
    

 
	protected onAwake() {
		//设置能否每帧触发onUpdate
		this.canUpdate = false;
		this.layer = mw.UILayerBottom;
		this.initButtons();
	}
	protected initButtons() {
		//按钮添加点击
		
		//按钮添加点击
		
		this.btnClose.onClicked.add(()=>{
			Event.dispatchToLocal("PlayButtonClick", "btnClose");
		})
		this.btnClose.touchMethod = (mw.ButtonTouchMethod.PreciseTap);
		
	

		//按钮多语言
		
		//文本多语言
		
		this.initLanguage(this.mTexLineage)
		
	
		this.initLanguage(this.textLineage)
		
	
		this.initLanguage(this.mTexSpeed)
		
	
		this.initLanguage(this.textSpeed)
		
	
		this.initLanguage(this.textName)
		
	
		this.initLanguage(this.mTexAccSpeed)
		
	
		this.initLanguage(this.textAcc)
		
	
		this.initLanguage(this.mTexGrowth)
		
	
		this.initLanguage(this.textGrowValue)
		
	
		this.initLanguage(this.mTexHobby)
		
	
		this.initLanguage(this.textHobby)
		
	
		//文本多语言
		

	}
	private initLanguage(ui: mw.StaleButton | mw.TextBlock) {
        let call = mw.UIScript.getBehavior("lan");
        if (call && ui) {
            call(ui);
        }
    }
 }
 