
/**
 * AUTO GENERATE BY UI EDITOR.
 * WARNING: DO NOT MODIFY THIS FILE,MAY CAUSE CODE LOST.
 * AUTHOR: 今日份的晚安
 * UI: UI/ui/ShopInnerUI.ui
 * TIME: 2023.05.15-17.57.14
 */

 

 @UIBind('UI/ui/ShopInnerUI.ui')
 export default class ShopInnerUI_Generate extends mw.UIScript {
	 @UIWidgetBind('RootCanvas/mDetailCanvas/mItem')
    public mItem: mw.UserWidget=undefined;
    @UIWidgetBind('RootCanvas/mDetailCanvas/mSelect')
    public mSelect: mw.Button=undefined;
    @UIWidgetBind('RootCanvas/mDetailCanvas/Canvas_1/mBlockLast')
    public mBlockLast: mw.Button=undefined;
    @UIWidgetBind('RootCanvas/mDetailCanvas/Canvas_1/mBtnLast/mTexLast')
    public mTexLast: mw.TextBlock=undefined;
    @UIWidgetBind('RootCanvas/mDetailCanvas/Canvas_1/mBtnLast')
    public mBtnLast: mw.Button=undefined;
    @UIWidgetBind('RootCanvas/mDetailCanvas/Canvas_2/mBlockNext')
    public mBlockNext: mw.Button=undefined;
    @UIWidgetBind('RootCanvas/mDetailCanvas/Canvas_2/mBtnNext/mTexNext')
    public mTexNext: mw.TextBlock=undefined;
    @UIWidgetBind('RootCanvas/mDetailCanvas/Canvas_2/mBtnNext')
    public mBtnNext: mw.Button=undefined;
    @UIWidgetBind('RootCanvas/mDetailCanvas/mBtnReturn')
    public mBtnReturn: mw.Button=undefined;
    @UIWidgetBind('RootCanvas/mDetailCanvas/mPrice')
    public mPrice: mw.TextBlock=undefined;
    @UIWidgetBind('RootCanvas/mDetailCanvas')
    public mDetailCanvas: mw.Canvas=undefined;
    @UIWidgetBind('RootCanvas/mSearchCanvas/mTotalNum')
    public mTotalNum: mw.TextBlock=undefined;
    @UIWidgetBind('RootCanvas/mSearchCanvas/mLook1/tt1')
    public tt1: mw.TextBlock=undefined;
    @UIWidgetBind('RootCanvas/mSearchCanvas/mLook1')
    public mLook1: mw.Button=undefined;
    @UIWidgetBind('RootCanvas/mSearchCanvas/mLook2/tt3')
    public tt3: mw.TextBlock=undefined;
    @UIWidgetBind('RootCanvas/mSearchCanvas/mLook2')
    public mLook2: mw.Button=undefined;
    @UIWidgetBind('RootCanvas/mSearchCanvas/mLook3/tt2')
    public tt2: mw.TextBlock=undefined;
    @UIWidgetBind('RootCanvas/mSearchCanvas/mLook3')
    public mLook3: mw.Button=undefined;
    @UIWidgetBind('RootCanvas/mSearchCanvas')
    public mSearchCanvas: mw.Canvas=undefined;
    @UIWidgetBind('RootCanvas/blackMask')
    public blackMask: mw.Image=undefined;
    @UIWidgetBind('RootCanvas/mBtnTake/mShopinnerui_take')
    public mShopinnerui_take: mw.TextBlock=undefined;
    @UIWidgetBind('RootCanvas/mBtnTake')
    public mBtnTake: mw.Button=undefined;
    @UIWidgetBind('RootCanvas/mClose/mBtnClose')
    public mBtnClose: mw.Button=undefined;
    @UIWidgetBind('RootCanvas/mClose')
    public mClose: mw.Canvas=undefined;
    

 
	protected onAwake() {
		//设置能否每帧触发onUpdate
		this.canUpdate = false;
		this.layer = mw.UILayerBottom;
		this.initButtons();
	}
	protected initButtons() {
		//按钮添加点击
		
		//按钮添加点击
		
		this.mSelect.onClicked.add(()=>{
			Event.dispatchToLocal("PlayButtonClick", "mSelect");
		})
		this.mSelect.touchMethod = (mw.ButtonTouchMethod.PreciseTap);
		
	
		this.mBlockLast.onClicked.add(()=>{
			Event.dispatchToLocal("PlayButtonClick", "mBlockLast");
		})
		this.mBlockLast.touchMethod = (mw.ButtonTouchMethod.PreciseTap);
		
	
		this.mBtnLast.onClicked.add(()=>{
			Event.dispatchToLocal("PlayButtonClick", "mBtnLast");
		})
		this.mBtnLast.touchMethod = (mw.ButtonTouchMethod.PreciseTap);
		
	
		this.mBlockNext.onClicked.add(()=>{
			Event.dispatchToLocal("PlayButtonClick", "mBlockNext");
		})
		this.mBlockNext.touchMethod = (mw.ButtonTouchMethod.PreciseTap);
		
	
		this.mBtnNext.onClicked.add(()=>{
			Event.dispatchToLocal("PlayButtonClick", "mBtnNext");
		})
		this.mBtnNext.touchMethod = (mw.ButtonTouchMethod.PreciseTap);
		
	
		this.mBtnReturn.onClicked.add(()=>{
			Event.dispatchToLocal("PlayButtonClick", "mBtnReturn");
		})
		this.mBtnReturn.touchMethod = (mw.ButtonTouchMethod.PreciseTap);
		
	
		this.mLook1.onClicked.add(()=>{
			Event.dispatchToLocal("PlayButtonClick", "mLook1");
		})
		this.mLook1.touchMethod = (mw.ButtonTouchMethod.PreciseTap);
		
	
		this.mLook2.onClicked.add(()=>{
			Event.dispatchToLocal("PlayButtonClick", "mLook2");
		})
		this.mLook2.touchMethod = (mw.ButtonTouchMethod.PreciseTap);
		
	
		this.mLook3.onClicked.add(()=>{
			Event.dispatchToLocal("PlayButtonClick", "mLook3");
		})
		this.mLook3.touchMethod = (mw.ButtonTouchMethod.PreciseTap);
		
	
		this.mBtnTake.onClicked.add(()=>{
			Event.dispatchToLocal("PlayButtonClick", "mBtnTake");
		})
		this.mBtnTake.touchMethod = (mw.ButtonTouchMethod.PreciseTap);
		
	
		this.mBtnClose.onClicked.add(()=>{
			Event.dispatchToLocal("PlayButtonClick", "mBtnClose");
		})
		this.mBtnClose.touchMethod = (mw.ButtonTouchMethod.PreciseTap);
		
	

		//按钮多语言
		
		//文本多语言
		
		this.initLanguage(this.mTexLast)
		
	
		this.initLanguage(this.mTexNext)
		
	
		this.initLanguage(this.mPrice)
		
	
		this.initLanguage(this.mTotalNum)
		
	
		this.initLanguage(this.tt1)
		
	
		this.initLanguage(this.tt3)
		
	
		this.initLanguage(this.tt2)
		
	
		this.initLanguage(this.mShopinnerui_take)
		
	
		//文本多语言
		
		this.initLanguage(this.uiWidgetBase.findChildByPath("RootCanvas/mDetailCanvas/mSelect/TextBlock_2") as any);
		
	
		this.initLanguage(this.uiWidgetBase.findChildByPath("RootCanvas/mDetailCanvas/mBtnReturn/TextBlock_2") as any);
		
	
		this.initLanguage(this.uiWidgetBase.findChildByPath("RootCanvas/mClose/TextBlock_2") as any);
		
	

	}
	private initLanguage(ui: mw.StaleButton | mw.TextBlock) {
        let call = mw.UIScript.getBehavior("lan");
        if (call && ui) {
            call(ui);
        }
    }
 }
 