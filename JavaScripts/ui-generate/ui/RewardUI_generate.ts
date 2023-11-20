
/**
 * AUTO GENERATE BY UI EDITOR.
 * WARNING: DO NOT MODIFY THIS FILE,MAY CAUSE CODE LOST.
 * AUTHOR: 今日份的晚安
 * UI: UI/ui/RewardUI.ui
 * TIME: 2023.05.15-17.57.14
 */

 

 @UIBind('UI/ui/RewardUI.ui')
 export default class RewardUI_Generate extends mw.UIScript {
	 @UIWidgetBind('RootCanvas/bg')
    public bg: mw.Image=undefined;
    @UIWidgetBind('RootCanvas/mSellCanvas/mBtnClose')
    public mBtnClose: mw.Button=undefined;
    @UIWidgetBind('RootCanvas/mSellCanvas/mSell/mTexSell')
    public mTexSell: mw.TextBlock=undefined;
    @UIWidgetBind('RootCanvas/mSellCanvas/mSell')
    public mSell: mw.Button=undefined;
    @UIWidgetBind('RootCanvas/mSellCanvas/mSellno')
    public mSellno: mw.Button=undefined;
    @UIWidgetBind('RootCanvas/mSellCanvas/mLeaveTime')
    public mLeaveTime: mw.TextBlock=undefined;
    @UIWidgetBind('RootCanvas/mSellCanvas/mRewardlittle')
    public mRewardlittle: mw.TextBlock=undefined;
    @UIWidgetBind('RootCanvas/mSellCanvas/mRewardAll')
    public mRewardAll: mw.TextBlock=undefined;
    @UIWidgetBind('RootCanvas/mSellCanvas')
    public mSellCanvas: mw.Canvas=undefined;
    @UIWidgetBind('RootCanvas/mTitle')
    public mTitle: mw.TextBlock=undefined;
    

 
	protected onAwake() {
		//设置能否每帧触发onUpdate
		this.canUpdate = false;
		this.layer = mw.UILayerBottom;
		this.initButtons();
	}
	protected initButtons() {
		//按钮添加点击
		
		//按钮添加点击
		
		this.mBtnClose.onClicked.add(()=>{
			Event.dispatchToLocal("PlayButtonClick", "mBtnClose");
		})
		this.mBtnClose.touchMethod = (mw.ButtonTouchMethod.PreciseTap);
		
	
		this.mSell.onClicked.add(()=>{
			Event.dispatchToLocal("PlayButtonClick", "mSell");
		})
		this.mSell.touchMethod = (mw.ButtonTouchMethod.PreciseTap);
		
	
		this.mSellno.onClicked.add(()=>{
			Event.dispatchToLocal("PlayButtonClick", "mSellno");
		})
		this.mSellno.touchMethod = (mw.ButtonTouchMethod.PreciseTap);
		
	

		//按钮多语言
		
		//文本多语言
		
		this.initLanguage(this.mTexSell)
		
	
		this.initLanguage(this.mLeaveTime)
		
	
		this.initLanguage(this.mRewardlittle)
		
	
		this.initLanguage(this.mRewardAll)
		
	
		this.initLanguage(this.mTitle)
		
	
		//文本多语言
		
		this.initLanguage(this.uiWidgetBase.findChildByPath("RootCanvas/mSellCanvas/mSellno/TextBlock_1") as any);
		
	

	}
	private initLanguage(ui: mw.StaleButton | mw.TextBlock) {
        let call = mw.UIScript.getBehavior("lan");
        if (call && ui) {
            call(ui);
        }
    }
 }
 