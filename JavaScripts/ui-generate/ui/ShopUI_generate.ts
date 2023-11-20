
/**
 * AUTO GENERATE BY UI EDITOR.
 * WARNING: DO NOT MODIFY THIS FILE,MAY CAUSE CODE LOST.
 * AUTHOR: 今日份的晚安
 * UI: UI/ui/ShopUI.ui
 * TIME: 2023.05.15-17.57.14
 */

 

 @UIBind('UI/ui/ShopUI.ui')
 export default class ShopUI_Generate extends mw.UIScript {
	 @UIWidgetBind('RootCanvas/panelDialog/mDescribe')
    public mDescribe: mw.TextBlock=undefined;
    @UIWidgetBind('RootCanvas/panelDialog/mSearch')
    public mSearch: mw.Button=undefined;
    @UIWidgetBind('RootCanvas/panelDialog/mBtnClose')
    public mBtnClose: mw.Button=undefined;
    @UIWidgetBind('RootCanvas/panelDialog/mBtnSllNo/mShopUI_SellNo')
    public mShopUI_SellNo: mw.TextBlock=undefined;
    @UIWidgetBind('RootCanvas/panelDialog/mBtnSllNo')
    public mBtnSllNo: mw.Button=undefined;
    @UIWidgetBind('RootCanvas/panelDialog')
    public panelDialog: mw.Canvas=undefined;
    @UIWidgetBind('RootCanvas/mSelectCanvas/mShopItem0')
    public mShopItem0: mw.Canvas=undefined;
    @UIWidgetBind('RootCanvas/mSelectCanvas/mShopItem1')
    public mShopItem1: mw.Canvas=undefined;
    @UIWidgetBind('RootCanvas/mSelectCanvas/mShopItem2')
    public mShopItem2: mw.Canvas=undefined;
    @UIWidgetBind('RootCanvas/mSelectCanvas/mShopItem3')
    public mShopItem3: mw.Canvas=undefined;
    @UIWidgetBind('RootCanvas/mSelectCanvas/mShopItem4')
    public mShopItem4: mw.Canvas=undefined;
    @UIWidgetBind('RootCanvas/mSelectCanvas/mShopItem5')
    public mShopItem5: mw.Canvas=undefined;
    @UIWidgetBind('RootCanvas/mSelectCanvas/mShopItem6')
    public mShopItem6: mw.Canvas=undefined;
    @UIWidgetBind('RootCanvas/mSelectCanvas')
    public mSelectCanvas: mw.Canvas=undefined;
    @UIWidgetBind('RootCanvas/mConfirm/mPriceCanvas/mLineagePrice')
    public mLineagePrice: mw.TextBlock=undefined;
    @UIWidgetBind('RootCanvas/mConfirm/mPriceCanvas')
    public mPriceCanvas: mw.Canvas=undefined;
    @UIWidgetBind('RootCanvas/mConfirm/mBtnOK/mShopUI_TakeIt')
    public mShopUI_TakeIt: mw.TextBlock=undefined;
    @UIWidgetBind('RootCanvas/mConfirm/mBtnOK')
    public mBtnOK: mw.Button=undefined;
    @UIWidgetBind('RootCanvas/mConfirm/mBtnCancel/mShopUI_Look')
    public mShopUI_Look: mw.TextBlock=undefined;
    @UIWidgetBind('RootCanvas/mConfirm/mBtnCancel')
    public mBtnCancel: mw.Button=undefined;
    @UIWidgetBind('RootCanvas/mConfirm')
    public mConfirm: mw.Canvas=undefined;
    

 
	protected onAwake() {
		//设置能否每帧触发onUpdate
		this.canUpdate = false;
		this.layer = mw.UILayerBottom;
		this.initButtons();
	}
	protected initButtons() {
		//按钮添加点击
		
		//按钮添加点击
		
		this.mSearch.onClicked.add(()=>{
			Event.dispatchToLocal("PlayButtonClick", "mSearch");
		})
		this.mSearch.touchMethod = (mw.ButtonTouchMethod.PreciseTap);
		
	
		this.mBtnClose.onClicked.add(()=>{
			Event.dispatchToLocal("PlayButtonClick", "mBtnClose");
		})
		this.mBtnClose.touchMethod = (mw.ButtonTouchMethod.PreciseTap);
		
	
		this.mBtnSllNo.onClicked.add(()=>{
			Event.dispatchToLocal("PlayButtonClick", "mBtnSllNo");
		})
		this.mBtnSllNo.touchMethod = (mw.ButtonTouchMethod.PreciseTap);
		
	
		this.mBtnOK.onClicked.add(()=>{
			Event.dispatchToLocal("PlayButtonClick", "mBtnOK");
		})
		this.mBtnOK.touchMethod = (mw.ButtonTouchMethod.PreciseTap);
		
	
		this.mBtnCancel.onClicked.add(()=>{
			Event.dispatchToLocal("PlayButtonClick", "mBtnCancel");
		})
		this.mBtnCancel.touchMethod = (mw.ButtonTouchMethod.PreciseTap);
		
	

		//按钮多语言
		
		//文本多语言
		
		this.initLanguage(this.mDescribe)
		
	
		this.initLanguage(this.mShopUI_SellNo)
		
	
		this.initLanguage(this.mLineagePrice)
		
	
		this.initLanguage(this.mShopUI_TakeIt)
		
	
		this.initLanguage(this.mShopUI_Look)
		
	
		//文本多语言
		
		this.initLanguage(this.uiWidgetBase.findChildByPath("RootCanvas/panelDialog/mSearch/TextBlock_2") as any);
		
	
		this.initLanguage(this.uiWidgetBase.findChildByPath("RootCanvas/mSelectCanvas/mShopItem0/Desc") as any);
		
	
		this.initLanguage(this.uiWidgetBase.findChildByPath("RootCanvas/mSelectCanvas/mShopItem0/Name") as any);
		
	
		this.initLanguage(this.uiWidgetBase.findChildByPath("RootCanvas/mSelectCanvas/mShopItem0/MaskConvas/Price") as any);
		
	
		this.initLanguage(this.uiWidgetBase.findChildByPath("RootCanvas/mSelectCanvas/mShopItem1/Desc") as any);
		
	
		this.initLanguage(this.uiWidgetBase.findChildByPath("RootCanvas/mSelectCanvas/mShopItem1/Name") as any);
		
	
		this.initLanguage(this.uiWidgetBase.findChildByPath("RootCanvas/mSelectCanvas/mShopItem1/MaskConvas/Price") as any);
		
	
		this.initLanguage(this.uiWidgetBase.findChildByPath("RootCanvas/mSelectCanvas/mShopItem2/Desc") as any);
		
	
		this.initLanguage(this.uiWidgetBase.findChildByPath("RootCanvas/mSelectCanvas/mShopItem2/Name") as any);
		
	
		this.initLanguage(this.uiWidgetBase.findChildByPath("RootCanvas/mSelectCanvas/mShopItem2/MaskConvas/Price") as any);
		
	
		this.initLanguage(this.uiWidgetBase.findChildByPath("RootCanvas/mSelectCanvas/mShopItem3/Desc") as any);
		
	
		this.initLanguage(this.uiWidgetBase.findChildByPath("RootCanvas/mSelectCanvas/mShopItem3/Name") as any);
		
	
		this.initLanguage(this.uiWidgetBase.findChildByPath("RootCanvas/mSelectCanvas/mShopItem3/MaskConvas/Price") as any);
		
	
		this.initLanguage(this.uiWidgetBase.findChildByPath("RootCanvas/mSelectCanvas/mShopItem4/Desc") as any);
		
	
		this.initLanguage(this.uiWidgetBase.findChildByPath("RootCanvas/mSelectCanvas/mShopItem4/Name") as any);
		
	
		this.initLanguage(this.uiWidgetBase.findChildByPath("RootCanvas/mSelectCanvas/mShopItem4/MaskConvas/Price") as any);
		
	
		this.initLanguage(this.uiWidgetBase.findChildByPath("RootCanvas/mSelectCanvas/mShopItem5/Desc") as any);
		
	
		this.initLanguage(this.uiWidgetBase.findChildByPath("RootCanvas/mSelectCanvas/mShopItem5/Name") as any);
		
	
		this.initLanguage(this.uiWidgetBase.findChildByPath("RootCanvas/mSelectCanvas/mShopItem5/MaskConvas/Price") as any);
		
	
		this.initLanguage(this.uiWidgetBase.findChildByPath("RootCanvas/mSelectCanvas/mShopItem6/Desc") as any);
		
	
		this.initLanguage(this.uiWidgetBase.findChildByPath("RootCanvas/mSelectCanvas/mShopItem6/Name") as any);
		
	
		this.initLanguage(this.uiWidgetBase.findChildByPath("RootCanvas/mSelectCanvas/mShopItem6/MaskConvas/Price") as any);
		
	

	}
	private initLanguage(ui: mw.StaleButton | mw.TextBlock) {
        let call = mw.UIScript.getBehavior("lan");
        if (call && ui) {
            call(ui);
        }
    }
 }
 