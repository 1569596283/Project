
/**
 * AUTO GENERATE BY UI EDITOR.
 * WARNING: DO NOT MODIFY THIS FILE,MAY CAUSE CODE LOST.
 * AUTHOR: 今日份的晚安
 * UI: UI/ui/SettlementUI.ui
 * TIME: 2023.05.15-17.57.14
 */

 

 @UIBind('UI/ui/SettlementUI.ui')
 export default class SettlementUI_Generate extends mw.UIScript {
	 @UIWidgetBind('RootCanvas/title')
    public title: mw.TextBlock=undefined;
    @UIWidgetBind('RootCanvas/PanelTitle/mSettlementui_rank')
    public mSettlementui_rank: mw.TextBlock=undefined;
    @UIWidgetBind('RootCanvas/PanelTitle/mSettlementui_name')
    public mSettlementui_name: mw.TextBlock=undefined;
    @UIWidgetBind('RootCanvas/PanelTitle/mSettlementui_betpeople')
    public mSettlementui_betpeople: mw.TextBlock=undefined;
    @UIWidgetBind('RootCanvas/PanelTitle/mSettlementui_betmoney')
    public mSettlementui_betmoney: mw.TextBlock=undefined;
    @UIWidgetBind('RootCanvas/PanelTitle/mSettlementui_money')
    public mSettlementui_money: mw.TextBlock=undefined;
    @UIWidgetBind('RootCanvas/PanelTitle/mSettlementui_time')
    public mSettlementui_time: mw.TextBlock=undefined;
    @UIWidgetBind('RootCanvas/itemScroll/cell0')
    public cell0: mw.Canvas=undefined;
    @UIWidgetBind('RootCanvas/itemScroll/cell1')
    public cell1: mw.Canvas=undefined;
    @UIWidgetBind('RootCanvas/itemScroll/cell2')
    public cell2: mw.Canvas=undefined;
    @UIWidgetBind('RootCanvas/itemScroll/cell3')
    public cell3: mw.Canvas=undefined;
    @UIWidgetBind('RootCanvas/itemScroll/cell4')
    public cell4: mw.Canvas=undefined;
    @UIWidgetBind('RootCanvas/itemScroll/cell5')
    public cell5: mw.Canvas=undefined;
    @UIWidgetBind('RootCanvas/itemScroll/cell6')
    public cell6: mw.Canvas=undefined;
    @UIWidgetBind('RootCanvas/itemScroll/cell7')
    public cell7: mw.Canvas=undefined;
    @UIWidgetBind('RootCanvas/itemScroll')
    public itemScroll: mw.ScrollBox=undefined;
    @UIWidgetBind('RootCanvas/buttonNext/mSettlementui_next')
    public mSettlementui_next: mw.TextBlock=undefined;
    @UIWidgetBind('RootCanvas/buttonNext')
    public buttonNext: mw.Button=undefined;
    

 
	protected onAwake() {
		//设置能否每帧触发onUpdate
		this.canUpdate = false;
		this.layer = mw.UILayerBottom;
		this.initButtons();
	}
	protected initButtons() {
		//按钮添加点击
		
		//按钮添加点击
		
		this.buttonNext.onClicked.add(()=>{
			Event.dispatchToLocal("PlayButtonClick", "buttonNext");
		})
		this.buttonNext.touchMethod = (mw.ButtonTouchMethod.PreciseTap);
		
	

		//按钮多语言
		
		//文本多语言
		
		this.initLanguage(this.title)
		
	
		this.initLanguage(this.mSettlementui_rank)
		
	
		this.initLanguage(this.mSettlementui_name)
		
	
		this.initLanguage(this.mSettlementui_betpeople)
		
	
		this.initLanguage(this.mSettlementui_betmoney)
		
	
		this.initLanguage(this.mSettlementui_money)
		
	
		this.initLanguage(this.mSettlementui_time)
		
	
		this.initLanguage(this.mSettlementui_next)
		
	
		//文本多语言
		
		this.initLanguage(this.uiWidgetBase.findChildByPath("RootCanvas/itemScroll/cell0/TextRank") as any);
		
	
		this.initLanguage(this.uiWidgetBase.findChildByPath("RootCanvas/itemScroll/cell0/TextHorseName") as any);
		
	
		this.initLanguage(this.uiWidgetBase.findChildByPath("RootCanvas/itemScroll/cell0/TextTime") as any);
		
	
		this.initLanguage(this.uiWidgetBase.findChildByPath("RootCanvas/itemScroll/cell0/TextRewards") as any);
		
	
		this.initLanguage(this.uiWidgetBase.findChildByPath("RootCanvas/itemScroll/cell0/TextBet") as any);
		
	
		this.initLanguage(this.uiWidgetBase.findChildByPath("RootCanvas/itemScroll/cell0/TextBetCounts") as any);
		
	
		this.initLanguage(this.uiWidgetBase.findChildByPath("RootCanvas/itemScroll/cell1/TextHorseName") as any);
		
	
		this.initLanguage(this.uiWidgetBase.findChildByPath("RootCanvas/itemScroll/cell1/TextTime") as any);
		
	
		this.initLanguage(this.uiWidgetBase.findChildByPath("RootCanvas/itemScroll/cell1/TextRewards") as any);
		
	
		this.initLanguage(this.uiWidgetBase.findChildByPath("RootCanvas/itemScroll/cell1/TextBet") as any);
		
	
		this.initLanguage(this.uiWidgetBase.findChildByPath("RootCanvas/itemScroll/cell1/TextBetCounts") as any);
		
	
		this.initLanguage(this.uiWidgetBase.findChildByPath("RootCanvas/itemScroll/cell1/TextRank") as any);
		
	
		this.initLanguage(this.uiWidgetBase.findChildByPath("RootCanvas/itemScroll/cell2/TextHorseName") as any);
		
	
		this.initLanguage(this.uiWidgetBase.findChildByPath("RootCanvas/itemScroll/cell2/TextTime") as any);
		
	
		this.initLanguage(this.uiWidgetBase.findChildByPath("RootCanvas/itemScroll/cell2/TextRewards") as any);
		
	
		this.initLanguage(this.uiWidgetBase.findChildByPath("RootCanvas/itemScroll/cell2/TextBet") as any);
		
	
		this.initLanguage(this.uiWidgetBase.findChildByPath("RootCanvas/itemScroll/cell2/TextBetCounts") as any);
		
	
		this.initLanguage(this.uiWidgetBase.findChildByPath("RootCanvas/itemScroll/cell2/TextRank") as any);
		
	
		this.initLanguage(this.uiWidgetBase.findChildByPath("RootCanvas/itemScroll/cell3/TextHorseName") as any);
		
	
		this.initLanguage(this.uiWidgetBase.findChildByPath("RootCanvas/itemScroll/cell3/TextTime") as any);
		
	
		this.initLanguage(this.uiWidgetBase.findChildByPath("RootCanvas/itemScroll/cell3/TextRewards") as any);
		
	
		this.initLanguage(this.uiWidgetBase.findChildByPath("RootCanvas/itemScroll/cell3/TextBet") as any);
		
	
		this.initLanguage(this.uiWidgetBase.findChildByPath("RootCanvas/itemScroll/cell3/TextBetCounts") as any);
		
	
		this.initLanguage(this.uiWidgetBase.findChildByPath("RootCanvas/itemScroll/cell3/TextRank") as any);
		
	
		this.initLanguage(this.uiWidgetBase.findChildByPath("RootCanvas/itemScroll/cell4/TextHorseName") as any);
		
	
		this.initLanguage(this.uiWidgetBase.findChildByPath("RootCanvas/itemScroll/cell4/TextTime") as any);
		
	
		this.initLanguage(this.uiWidgetBase.findChildByPath("RootCanvas/itemScroll/cell4/TextRewards") as any);
		
	
		this.initLanguage(this.uiWidgetBase.findChildByPath("RootCanvas/itemScroll/cell4/TextBet") as any);
		
	
		this.initLanguage(this.uiWidgetBase.findChildByPath("RootCanvas/itemScroll/cell4/TextBetCounts") as any);
		
	
		this.initLanguage(this.uiWidgetBase.findChildByPath("RootCanvas/itemScroll/cell4/TextRank") as any);
		
	
		this.initLanguage(this.uiWidgetBase.findChildByPath("RootCanvas/itemScroll/cell5/TextHorseName") as any);
		
	
		this.initLanguage(this.uiWidgetBase.findChildByPath("RootCanvas/itemScroll/cell5/TextTime") as any);
		
	
		this.initLanguage(this.uiWidgetBase.findChildByPath("RootCanvas/itemScroll/cell5/TextRewards") as any);
		
	
		this.initLanguage(this.uiWidgetBase.findChildByPath("RootCanvas/itemScroll/cell5/TextBet") as any);
		
	
		this.initLanguage(this.uiWidgetBase.findChildByPath("RootCanvas/itemScroll/cell5/TextBetCounts") as any);
		
	
		this.initLanguage(this.uiWidgetBase.findChildByPath("RootCanvas/itemScroll/cell5/TextRank") as any);
		
	
		this.initLanguage(this.uiWidgetBase.findChildByPath("RootCanvas/itemScroll/cell6/TextHorseName") as any);
		
	
		this.initLanguage(this.uiWidgetBase.findChildByPath("RootCanvas/itemScroll/cell6/TextTime") as any);
		
	
		this.initLanguage(this.uiWidgetBase.findChildByPath("RootCanvas/itemScroll/cell6/TextRewards") as any);
		
	
		this.initLanguage(this.uiWidgetBase.findChildByPath("RootCanvas/itemScroll/cell6/TextBet") as any);
		
	
		this.initLanguage(this.uiWidgetBase.findChildByPath("RootCanvas/itemScroll/cell6/TextBetCounts") as any);
		
	
		this.initLanguage(this.uiWidgetBase.findChildByPath("RootCanvas/itemScroll/cell6/TextRank") as any);
		
	
		this.initLanguage(this.uiWidgetBase.findChildByPath("RootCanvas/itemScroll/cell7/TextHorseName") as any);
		
	
		this.initLanguage(this.uiWidgetBase.findChildByPath("RootCanvas/itemScroll/cell7/TextTime") as any);
		
	
		this.initLanguage(this.uiWidgetBase.findChildByPath("RootCanvas/itemScroll/cell7/TextRewards") as any);
		
	
		this.initLanguage(this.uiWidgetBase.findChildByPath("RootCanvas/itemScroll/cell7/TextBet") as any);
		
	
		this.initLanguage(this.uiWidgetBase.findChildByPath("RootCanvas/itemScroll/cell7/TextBetCounts") as any);
		
	
		this.initLanguage(this.uiWidgetBase.findChildByPath("RootCanvas/itemScroll/cell7/TextRank_1") as any);
		
	

	}
	private initLanguage(ui: mw.StaleButton | mw.TextBlock) {
        let call = mw.UIScript.getBehavior("lan");
        if (call && ui) {
            call(ui);
        }
    }
 }
 