import { EHorseSomatoType, GlobalVar, IHorseInfo } from "../Common";
import { GameConfig } from "../config/GameConfig";
import ItemUI_Generate from "../ui-generate/ui/ItemUI_generate";
import { BagMouduleC } from "../module/BagMoudule";

class PropertInfo {
    name: string
    max: number
    current: number
    maxLength: number
    texVal: string
    texMaxVal: string
    pos: mw.Vector2
    dir: mw.Vector2
    panelMax: mw.Canvas
    panelCurrent: mw.Canvas
    valueTexPannal: mw.Canvas
    valueTexBlock: mw.TextBlock
}

export default class ItemUI extends ItemUI_Generate {
    private _curHorseInfo: IHorseInfo
    private _propertyInfos: PropertInfo[] = []
    private _bearImg: mw.Image[] = []
    private _energyImg: mw.Image[] = []
    private _propertyLines: mw.Canvas[] = []

    /** 
    * 构造UI文件成功后，在合适的时机最先初始化一次 
    */
    protected onStart() {
        //设置能否每帧触发onUpdate
        this.canUpdate = false;
        this.layer = mw.UILayerBottom;
        this.initButtons();
        this._curHorseInfo = ModuleService.getModule(BagMouduleC).getHoresInfo()[0]
        for (let i = 1; i <= GlobalVar.MAX_BEAR; i++) {
            this._bearImg.push(this["mBearbar_" + i] as mw.Image)
            this._energyImg.push(this["mHpbar_" + i] as mw.Image)
        }
        this.initPropertyUI()
    }

    public init(info: IHorseInfo) {
        this._propertyLines.forEach((lineRoot) => {
            lineRoot.destroyObject();
        })
        this._clearInfo();
        this._propertyLines.length = 0;
        this._curHorseInfo = null
        if (!info) {
            return
        }


        this._curHorseInfo = info
        this.setImage()
        this.initInfo()
        this.setRate()
        this.visible = true
    }

    private _clearInfo() {
        this.mName.text = ""
        this.text_rate.text = ""
        this.mLineage.text = ""
        this.mHobby.text = ""
        this.mCharacter.text = ""
        this.mBearCanvas.visibility = mw.SlateVisibility.Hidden
        this.mEnergyBear.visibility = mw.SlateVisibility.Hidden
        for (const info of this._propertyInfos) {
            info.panelCurrent.position = this.panelProperty0.position;
            const button = info.panelCurrent.findChildByPath('Button') as mw.Button
            button.onPressed.clear()
            const buttonMax = info.panelMax.findChildByPath('Button') as mw.Button
            buttonMax.onPressed.clear()
        }
    }


    protected onShow(...params: any[]) {


    }

    //初始化六边形
    private initPropertyUI() {
        const maxMultiply = GameConfig.Global.getElement(1047).Parameter1
        const lineageCfg = GameConfig.Lineage.getAllElement()
        //speed
        let maxSpeed = 0
        for (const cfg of lineageCfg) {
            maxSpeed = Math.max(cfg.maxSpeed[1], maxSpeed)
        }
        maxSpeed *= maxMultiply
        const infoSpeed = new PropertInfo()
        infoSpeed.panelMax = this.panelProperty1
        infoSpeed.panelCurrent = this.panelPropertyCurrent1
        infoSpeed.dir = infoSpeed.panelMax.position.clone().subtract(this.panelProperty0.position).normalize()
        infoSpeed.max = maxSpeed
        infoSpeed.name = GameConfig.Language.P_max_speed.Value
        infoSpeed.valueTexPannal = infoSpeed.panelMax.findChildByPath('PanelPropertyValue') as mw.Canvas
        infoSpeed.valueTexBlock = infoSpeed.valueTexPannal.findChildByPath('TextPropertValue') as mw.TextBlock
        this._propertyInfos.push(infoSpeed)

        //startSpeed
        let maxStartSpeed = 0
        for (const cfg of lineageCfg) {
            maxStartSpeed = Math.max(cfg.RunawaySpeed[1], maxStartSpeed)
        }
        maxStartSpeed *= maxMultiply
        const infoStartSpeed = new PropertInfo()
        infoStartSpeed.panelMax = this.panelProperty2
        infoStartSpeed.panelCurrent = this.panelPropertyCurrent2
        infoStartSpeed.dir = infoStartSpeed.panelMax.position.clone().subtract(this.panelProperty0.position).normalize()
        infoStartSpeed.max = maxStartSpeed
        infoStartSpeed.name = GameConfig.Language.P_startrunspeed.Value
        infoStartSpeed.valueTexPannal = infoStartSpeed.panelMax.findChildByPath('PanelPropertyValue') as mw.Canvas
        infoStartSpeed.valueTexBlock = infoStartSpeed.valueTexPannal.findChildByPath('TextPropertValue') as mw.TextBlock
        this._propertyInfos.push(infoStartSpeed)

        //acc
        let maxAcc = 0
        for (const cfg of lineageCfg) {
            maxAcc = Math.max(cfg.accelerate[1], maxAcc)
        }
        maxAcc *= maxMultiply
        const infoAcc = new PropertInfo()
        infoAcc.panelMax = this.panelProperty3
        infoAcc.panelCurrent = this.panelPropertyCurrent3
        infoAcc.dir = infoAcc.panelMax.position.clone().subtract(this.panelProperty0.position).normalize()
        infoAcc.max = maxAcc
        infoAcc.name = GameConfig.Language.P_acc_speed.Value
        infoAcc.valueTexPannal = infoAcc.panelMax.findChildByPath('PanelPropertyValue') as mw.Canvas
        infoAcc.valueTexBlock = infoAcc.valueTexPannal.findChildByPath('TextPropertValue') as mw.TextBlock
        this._propertyInfos.push(infoAcc)

        //energy
        let maxEnergy = 0
        for (const cfg of lineageCfg) {
            maxEnergy = Math.max(cfg.energy[1], maxEnergy)
        }
        maxEnergy *= maxMultiply
        const infoEnergy = new PropertInfo()
        infoEnergy.panelMax = this.panelProperty4
        infoEnergy.panelCurrent = this.panelPropertyCurrent4
        infoEnergy.dir = infoEnergy.panelMax.position.clone().subtract(this.panelProperty0.position).normalize()
        infoEnergy.max = maxEnergy
        infoEnergy.name = GameConfig.Language.P_energy.Value
        infoEnergy.valueTexPannal = infoEnergy.panelMax.findChildByPath('PanelPropertyValue') as mw.Canvas
        infoEnergy.valueTexBlock = infoEnergy.valueTexPannal.findChildByPath('TextPropertValue') as mw.TextBlock
        this._propertyInfos.push(infoEnergy)

        //bear
        let maxBear = 0
        for (const cfg of lineageCfg) {
            maxBear = Math.max(cfg.bear[1], maxBear)
        }
        maxBear *= maxMultiply

        const infoBear = new PropertInfo()
        infoBear.panelMax = this.panelProperty5
        infoBear.panelCurrent = this.panelPropertyCurrent5
        infoBear.dir = infoBear.panelMax.position.clone().subtract(this.panelProperty0.position).normalize()
        infoBear.max = maxBear
        infoBear.name = GameConfig.Language.P_brith_number.Value
        infoBear.valueTexPannal = infoBear.panelMax.findChildByPath('PanelPropertyValue') as mw.Canvas
        infoBear.valueTexBlock = infoBear.valueTexPannal.findChildByPath('TextPropertValue') as mw.TextBlock
        this._propertyInfos.push(infoBear)

        //defecation
        let minDefecation = Number.MAX_VALUE
        for (const cfg of lineageCfg) {
            minDefecation = Math.min(cfg.defecation[0], minDefecation)
        }
        const infoDefecation = new PropertInfo()
        infoDefecation.panelMax = this.panelProperty6
        infoDefecation.panelCurrent = this.panelPropertyCurrent6
        infoDefecation.dir = infoDefecation.panelMax.position.clone().subtract(this.panelProperty0.position).normalize()
        infoDefecation.max = 1 / minDefecation * 1000 * maxMultiply
        infoDefecation.name = GameConfig.Language.P_defecation.Value
        infoDefecation.valueTexPannal = infoDefecation.panelMax.findChildByPath('PanelPropertyValue') as mw.Canvas
        infoDefecation.valueTexBlock = infoDefecation.valueTexPannal.findChildByPath('TextPropertValue') as mw.TextBlock
        this._propertyInfos.push(infoDefecation)

        // this.drawLine(this.panelProperty1.position, this.panelProperty2.position)
        // this.drawLine(this.panelProperty2.position, this.panelProperty3.position)
        // this.drawLine(this.panelProperty3.position, this.panelProperty4.position)
        // this.drawLine(this.panelProperty4.position, this.panelProperty5.position)
        // this.drawLine(this.panelProperty5.position, this.panelProperty6.position)
        // this.drawLine(this.panelProperty6.position, this.panelProperty1.position)
    }

    //设置精力以及生育次数图标
    private setImage() {
        this.mBearCanvas.visibility = mw.SlateVisibility.SelfHitTestInvisible
        this.mEnergyBear.visibility = mw.SlateVisibility.SelfHitTestInvisible
        let max = Math.max(this._bearImg.length, this._energyImg.length)
        let data = this._curHorseInfo.property
        for (let i = 0; i < max; i++) {
            if (i + 1 > data.maxEnergy) {
                this._energyImg[i].visibility = mw.SlateVisibility.Hidden
            }
            else {
                this._energyImg[i].visibility = mw.SlateVisibility.Visible
                if (i + 1 <= data.energy) {
                    this._energyImg[i].imageColor = new mw.LinearColor(mw.LinearColor.colorHexToLinearColor("8D8AC8FF"))
                }
                else {
                    this._energyImg[i].imageColor = new mw.LinearColor(0, 0, 0, 0.5)
                }
            }

            if (i + 1 > data.maxBirthNum) {
                this._bearImg[i].visibility = mw.SlateVisibility.Hidden
            }
            else {
                this._bearImg[i].visibility = mw.SlateVisibility.Visible
                if (i + 1 <= data.birthNum) {
                    this._bearImg[i].imageColor = new mw.LinearColor(GlobalVar.GreyColor[0], GlobalVar.GreyColor[1], GlobalVar.GreyColor[2])
                }
                else {
                    this._bearImg[i].imageColor = new mw.LinearColor(0, 0, 0, 0.5)
                }
            }
        }
    }

    //设置评级
    private setRate() {
        let rate = this._curHorseInfo.rate
        let index = 0;
        let textRate: string = "";
        let colorStr: string = "";
        for (let i = 0; i < GlobalVar.RATE_DESCRIBE.length; i++) {
            let arr = GlobalVar.RATE_DESCRIBE[i];
            for (let j = 0; j < arr.length; j++) {
                if (index === rate) {
                    textRate = GlobalVar.RATE_DESCRIBE[i][j].toString();
                    colorStr = "#" + GlobalVar.RATE_FONT_COLOR[i];
                    break;
                }
                index++;
            }
            if (textRate) {
                break;
            }
        }
        this.text_rate.text = textRate;
        this.text_rate.setFontColorByHex(colorStr);
    }

    /**
     * 画六边形
     */
    private initInfo() {

        for (const info of this._propertyInfos) {
            info.valueTexPannal.visibility = mw.SlateVisibility.SelfHitTestInvisible
        }

        let data = this._curHorseInfo.property

        if (!data.nickName) {
            let allNames = GameConfig.Name.getAllElement()
            const firstName = data.firsName;
            const lastName = data.lastName;
            data.nickName = allNames[firstName].firstName + " " + allNames[lastName].lastName
        }
        this.mName.text = data.nickName
        this.mIcon.imageGuid = GameConfig.Lineage.getElement(data.lineage).icon
        let linegeId = GameConfig.Lineage.getElement(data.lineage).lineage
        this.mLineage.text = GameConfig.Language[linegeId].Value
        let chID = GameConfig.Personalioty.getElement(data.nature).name
        this.mCharacter.text = GameConfig.Language[chID].Value
        let hobbyID = GameConfig.Hobby.getElement(data.hobby).describe
        this.mHobby.text = GameConfig.Language[hobbyID].Value

        //maxSpeed
        let info = this._propertyInfos[0]
        info.current = data.speed
        info.texVal = (data.speed * (1 / 120000) * 3600).toFixed(2)
        info.texMaxVal = (info.max * (1 / 120000) * 3600).toFixed(2)


        //startSpeed
        info = this._propertyInfos[1]
        info.current = data.startRunSpeed
        info.texVal = (data.startRunSpeed * (1 / 120000) * 3600).toFixed(2)
        info.texMaxVal = (info.max * (1 / 120000) * 3600).toFixed(2)


        //acc
        info = this._propertyInfos[2]
        info.current = data.acceleratedSpeed
        info.texVal = (data.acceleratedSpeed * (1 / 120000) * 1000).toFixed(2)
        info.texMaxVal = (info.max * (1 / 120000) * 1000).toFixed(2)


        //energy
        info = this._propertyInfos[3]
        info.current = data.energy
        info.texVal = info.current.toString()
        info.texMaxVal = Math.floor(info.max) + ""


        //birth
        info = this._propertyInfos[4]
        info.current = data.maxBirthNum
        info.texVal = info.current.toString()
        info.texMaxVal = Math.floor(info.max) + ""

        //defecation
        info = this._propertyInfos[5]
        info.current = data.defecation
        info.texVal = Math.floor(info.current) + ""
        info.texMaxVal = Math.floor(info.max) + ""

        for (const info of this._propertyInfos) {
            info.maxLength = info.panelMax.position.clone().subtract(this.panelProperty0.position).length
            let length = info.current / info.max * info.maxLength
            info.pos = this.panelProperty0.position.clone().add(info.dir.clone().multiply(length))
            info.panelCurrent.position = info.pos.clone()
            info.valueTexBlock.text = info.texVal

            const button = info.panelCurrent.findChildByPath('Button') as mw.Button
            button.onPressed.clear()
            button.onPressed.add(() => {
            })
            button.onReleased.add(() => {

            })
            // const buttonMax = info.panelMax.findChildByPath('Button') as mw.Button
            // buttonMax.onPressed.clear()
            // buttonMax.onPressed.add(() => {
            //     this.panelPropertyValue.visibility = mw.SlateVisibility.SelfHitTestInvisible
            //     this.textPropertValue.text = info.name + info.texMaxVal
            // })
            // buttonMax.onReleased.add(() => {
            //     this.panelPropertyValue.visibility = mw.SlateVisibility.Hidden
            // })
        }
        this._propertyLines.push(this.drawLine(this._propertyInfos[0].pos, this._propertyInfos[1].pos, 2, mw.LinearColor.colorHexToLinearColor("27DC95")))
        this._propertyLines.push(this.drawLine(this._propertyInfos[1].pos, this._propertyInfos[2].pos, 2, mw.LinearColor.colorHexToLinearColor("27DC95")))
        this._propertyLines.push(this.drawLine(this._propertyInfos[2].pos, this._propertyInfos[3].pos, 2, mw.LinearColor.colorHexToLinearColor("27DC95")))
        this._propertyLines.push(this.drawLine(this._propertyInfos[3].pos, this._propertyInfos[4].pos, 2, mw.LinearColor.colorHexToLinearColor("27DC95")))
        this._propertyLines.push(this.drawLine(this._propertyInfos[4].pos, this._propertyInfos[5].pos, 2, mw.LinearColor.colorHexToLinearColor("27DC95")))
        this._propertyLines.push(this.drawLine(this._propertyInfos[5].pos, this._propertyInfos[0].pos, 2, mw.LinearColor.colorHexToLinearColor("27DC95")))
    }

    private drawLine(p1: mw.Vector2, p2: mw.Vector2, lineWidth: number = 4, color: mw.LinearColor = mw.LinearColor.white) {
        const offset = p2.clone().subtract(p1)
        const angle = Math.atan(offset.y / offset.x) * 180 / 3.1415926

        let lineRoot = mw.Canvas.newObject(this.panelProperties)
        lineRoot.position = p1.clone().add(offset.clone().divide(2))
        lineRoot.size = mw.Vector2.zero
        lineRoot.renderTransformAngle = angle

        const size = new mw.Vector2(offset.length, lineWidth)
        let line = mw.Image.newObject(lineRoot)
        line.size = size
        line.position = new mw.Vector2(-size.x / 2, -lineWidth / 2)
        line.imageGuid = "95864"
        line.imageColor = color

        return lineRoot
    }


    protected onHide() {

    }

    public hide() {

        for (const info of this._propertyInfos) {
            info.valueTexPannal.visibility = mw.SlateVisibility.Hidden
        }
    }

}
