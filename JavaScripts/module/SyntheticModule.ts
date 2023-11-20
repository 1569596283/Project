import { EHorseSomatoType, EPartType, GlobalVar, IBreedInfo, IHorseInfo, IPartInfo } from "../Common";
import { GameConfig } from "../config/GameConfig";
import { IHorseElement } from "../config/Horse";
import { HoresModelC } from "../logic/HorseModel";
import Property from "../logic/Property";
import Utils from "../utils/Utils";


const enum EPriceVal {
    Fat,//排便量
    Other//其他属性
}

//#region SyntheticModuleC

/**
 * 马匹合成模块逻辑
 */
export class SyntheticModuleC extends ModuleC<SyntheticModuleS, null> {
    // private _heros: Map<number, HeroClient> = new Map()
    // private _birthInfos: PlayerBirthInfo[] = []

    /**
     * 拼装一匹马
     * @param info 马匹信息
     * @param effect 是否有特效
     * @returns HoresModelC
     */
    async createHorse(info: IHorseInfo, effect: boolean = false) {
        let model = new HoresModelC(info);
        await model.build(effect);
        return model;
    }

    /**
     * 马匹繁殖
     * @param infoF 父亲马匹信息
     * @param infoM 母亲马匹信息
     * @returns 小马的马匹信息
     */
    public breed(infoF: IHorseInfo, infoM: IHorseInfo): IBreedInfo {
        let propertyF = infoF.property;
        let propertyM = infoM.property;
        let property = new Property();
        let parts: IPartInfo[] = [];
        property.speed = Math.floor(Utils.getRandomNumber(propertyF.speed, propertyM.speed) * this.getPropertyChange());
        property.acceleratedSpeed = Math.floor(Utils.getRandomNumber(propertyF.acceleratedSpeed, propertyM.acceleratedSpeed) * this.getPropertyChange());
        property.startRunSpeed = Math.floor(Utils.getRandomNumber(propertyF.startRunSpeed, propertyM.startRunSpeed) * this.getPropertyChange());

        property.lineage = Math.random() > 0.5 ? propertyF.lineage : propertyM.lineage;
        property.getRandomNature();
        property.somatoType = EHorseSomatoType.Filly;

        property.maxEnergy = Utils.getRandomNumber(propertyF.maxEnergy, propertyM.maxEnergy);
        property.energy = property.maxEnergy;
        property.maxBirthNum = Utils.getRandomNumber(propertyF.maxBirthNum, propertyM.maxBirthNum);
        property.birthNum = property.maxBirthNum;
        property.defecation = Utils.getRandomNumber(propertyF.defecation, propertyM.defecation);


        for (let i = 0; i < GlobalVar.PARTS_NUMBER; i++) {
            if (i < 4) {
                let part: IPartInfo;
                part = Math.random() < 0.5 ? infoF.parts[i] : infoM.parts[i];
                parts.push(part);
            } else {
                let partArr = Math.random() < 0.5 ? infoF.parts : infoM.parts;
                let thigh = partArr[i];
                let calf = partArr[i + 1];
                parts.push(thigh);
                parts.push(calf);
                i++;
            }
        }

        let trailing = Math.random() > 0.5 ? infoF.trailingID : infoM.trailingID;
        let info: IHorseInfo = {
            ID: "-1",
            parts: parts,
            property: property,
            trailingID: trailing,
        }
        let breedInfo: IBreedInfo;
        breedInfo = this.variation(info);
        breedInfo.horseInfo.rate = this.getRate(breedInfo.horseInfo);
        return breedInfo;
    }

    /**
     * 基因突变
     * @param info 变异前的马匹信息
     * @returns 繁育信息
     */
    private variation(info: IHorseInfo): IBreedInfo {
        let part: IPartInfo = new IPartInfo();
        let arr: { obj: any; rate: number; }[] = [];
        for (let i = 0; i < GlobalVar.VARIATION.length; i++) {
            arr.push({ obj: i, rate: GlobalVar.VARIATION[i] });
        }
        let type: EPartType = Utils.RandomObjByRate(arr);
        let partCfgs = GameConfig.Parts.findElements("Type", type);

        let breedInfo = new IBreedInfo();
        if (partCfgs.length > 0) {
            let cfgArr: { obj: any; rate: number; }[] = [];
            for (let i = 0; i < partCfgs.length; i++) {
                if (partCfgs[i].Variation) {
                    cfgArr.push({ obj: partCfgs[i].ID, rate: partCfgs[i].Variation });
                }
            }
            if (cfgArr.length <= 0) {
                breedInfo.horseInfo = info;
                breedInfo.variationPart = EPartType.None;
                return breedInfo;
            }
            part.name = type;
            part.partId = Utils.RandomObjByRate(cfgArr);
            part.variation = true;
            breedInfo = this.changePart(info, part);
            return breedInfo;
        } else {
            breedInfo.horseInfo = info;
            breedInfo.variationPart = EPartType.None;
            return breedInfo;
        }
    }

    /**
     * 改变指定部位
     * @param info 马匹信息
     * @param part 改变后的肢体
     * @returns 繁育信息
     */
    private changePart(info: IHorseInfo, part: IPartInfo): IBreedInfo {
        let breedInfo = new IBreedInfo();
        let partIndexs: number[] = [];
        for (let i = 0; i < info.parts.length; i++) {
            if (info.parts[i].name == part.name) {
                partIndexs.push(i);
            }
        }
        let random = Math.floor(Math.random() * partIndexs.length);
        let index = partIndexs[random];
        info.parts[index] = part;
        breedInfo.horseInfo = info;
        breedInfo.variationPart = part.name;
        breedInfo.variationIndex = index;
        return breedInfo;
    }

    onStart(): void {
        super.onStart()
    }

    /**
     * 获得评级
     * @param info 马匹信息
     * @returns 评级
     */
    public getRate(info: IHorseInfo): number {

        let porpertyRate = this.getPrice(info.property);
        let partRate = this.getPartRate(info.parts);
        let rate = porpertyRate + partRate;
        for (let i = 0; i < GlobalVar.GRADE_GRADE.length; i++) {
            let grade = GlobalVar.GRADE_GRADE[i];
            if (rate < grade) {
                return i;
            }
        }
        return GlobalVar.GRADE_GRADE.length;
    }

    /**
     * 获取属性评级
     * @param property 属性
     * @returns 属性评级
     */
    public getPrice(property: Property): number {
        let lineage = GameConfig.Lineage.getElement(property.lineage);

        let speedPrice = this.calculate(property.speed, lineage.maxSpeed, lineage.horsePrice, lineage.speedRange, EPriceVal.Other)
        let acceleratePrice = this.calculate(property.acceleratedSpeed, lineage.accelerate, lineage.horsePrice, lineage.accelerateRange, EPriceVal.Other)
        let energyPrice = this.calculate(property.energy, lineage.energy, lineage.horsePrice, lineage.energyRange, EPriceVal.Other)
        let bearPrice = this.calculate(property.maxBirthNum, lineage.bear, lineage.horsePrice, lineage.bearRange, EPriceVal.Other)
        let startRunPrice = this.calculate(property.startRunSpeed, lineage.RunawaySpeed, lineage.horsePrice, lineage.speed0Range, EPriceVal.Other)
        let shitPrice = this.calculate(property.defecation, lineage.defecation, lineage.horsePrice, lineage.shitRange, EPriceVal.Fat)

        let totalPrice: number = speedPrice + acceleratePrice + bearPrice + energyPrice + startRunPrice + shitPrice
        return Math.floor(totalPrice);
    }

    /**
     * 
     * @param property 属性值
     * @param defaultProperty  默认属性值
     * @param defaultprice  默认价格值
     * @param range 属性值权重
     */
    private calculate(property: number, defaultProperty: number[], defaultprice: number[], range: number, type: EPriceVal) {
        let tmpProperty: number = 0
        if (type != EPriceVal.Fat) {
            tmpProperty = (property - defaultProperty[0]) / (defaultProperty[1] - defaultProperty[0])
        } else {
            tmpProperty = 1 - (property - defaultProperty[0]) / (defaultProperty[1] - defaultProperty[0])
        }

        let value = (defaultprice[0] + tmpProperty * (defaultprice[1] - defaultprice[0])) * range
        return value
    }


    /**
     * 获取肢体评级
     * @param parts 肢体
     * @returns 肢体评级
     */
    private getPartRate(parts: IPartInfo[]) {
        let partRate = 0;
        for (const partInfo of parts) {
            let cfg = GameConfig.Parts.getElement(partInfo.partId);
            partRate += cfg.Rate;
        }
        return partRate;
    }

    /**
     * 获得属性变化参数
     */
    private getPropertyChange() {
        return Math.random() * GlobalVar.BREED_ADDITION_MIN + (GlobalVar.BREED_ADDITION_MAX - GlobalVar.BREED_ADDITION_MIN);
    }
}

//#endregion

//#region SyntheticModuleS


export class SyntheticModuleS extends ModuleS<SyntheticModuleC, null> {
    // private _heros: Map<number, HeroServer> = new Map()

    // private _birthInfos: PlayerBirthInfo[] = []

    onStart(): void {

    }

    /**
     * 获得随机的马匹信息
     * @param lineID 血统ID
     * @returns 马匹信息
     */
    public getRandomHorseInfoByLineID(lineID?: number): IHorseInfo {
        let allHorse: IHorseElement[];
        if (lineID) {
            allHorse = GameConfig.Horse.findElements("lineage", lineID);
        } else {
            allHorse = GameConfig.Horse.getAllElement();
        }
        let len = allHorse.length;
        let horse = allHorse[Math.floor(Math.random() * len)];
        return this.getRandomHorseInfoByHorseID(horse.ID);
    }

    /**
     * 获得随机的马匹信息
     * @returns 马匹信息
     */
    public getRandomHorseInfoByHorseID(horseID: number): IHorseInfo {
        let horse = GameConfig.Horse.getElement(horseID);
        let property = new Property();
        let parts: IPartInfo[] = [];

        // 血统及性格
        property.lineage = horse.lineage;
        property.getRandomNature();

        let lineageCfg = GameConfig.Lineage.getElement(property.lineage);
        property.acceleratedSpeed = Utils.getRandomNumber(lineageCfg.accelerate[0], lineageCfg.accelerate[1]);
        property.speed = Utils.getRandomNumber(lineageCfg.maxSpeed[0], lineageCfg.maxSpeed[1]);
        property.maxBirthNum = Utils.RangeInt(lineageCfg.bear[0], lineageCfg.bear[1] + 1);
        property.birthNum = property.maxBirthNum;
        property.maxEnergy = Utils.RangeInt(lineageCfg.energy[0], lineageCfg.energy[1] + 1);
        property.energy = property.maxEnergy;
        property.startRunSpeed = Utils.RangeInt(lineageCfg.RunawaySpeed[0], lineageCfg.RunawaySpeed[1] + 1);
        property.defecation = Utils.RangeInt(lineageCfg.defecation[0], lineageCfg.defecation[1] + 1);

        let index = 0;
        // 肢体
        for (let i = 0; i < GlobalVar.PARTS_NUMBER; i++) {
            //0-3 是不重复的肢体，其余是大小腿，一条大腿一条小腿
            if (i <= 3) {
                let partType = i;
                let part = this.getPart(partType, horse);
                parts.push(part);
            } else {
                let thigh = this.getPart(EPartType.Thigh, horse, index);
                parts.push(thigh);
                let calf = this.getPart(EPartType.Calf, horse, index);
                parts.push(calf);
                i++;
                index++;
            }
        }

        let allTarilingCfgs = GameConfig.Trailing.getAllElement()
        let trailingIndex = Utils.RangeInt(0, allTarilingCfgs.length);
        let trailingID = allTarilingCfgs[trailingIndex].ID;
        let info: IHorseInfo = {
            ID: "-1",
            parts: parts,
            property: property,
            trailingID: trailingID,
        }

        let breedInfo = this.variation(info);
        info = breedInfo.horseInfo;
        info.rate = this.getRate(info);
        return info;
    }

    /**
     * 获得指定马匹的指定部位
     * @param partType 部位类型
     * @param horse 马匹信息
     * @param index 序号用于判断是第几条腿
     * @returns 肢体信息
     */
    private getPart(partType: EPartType, horse: IHorseElement, index?: number): IPartInfo {
        let part = new IPartInfo();
        part.name = partType;
        switch (partType) {
            case EPartType.Head:
                part.partId = horse.head;
                break;
            case EPartType.Neck:
                part.partId = horse.neck;
                break;
            case EPartType.Body:
                part.partId = horse.body;
                break;
            case EPartType.Tail:
                part.partId = horse.tail;
                break;
            case EPartType.Thigh:
                part.partId = horse.leg1[index];
                break;
            case EPartType.Calf:
                part.partId = horse.leg2[index];
                break;

        }
        return part;
    }

    /**
     * 基因突变
     * @param info 变异前的马匹信息
     * @returns 繁育信息
     */
    private variation(info: IHorseInfo): IBreedInfo {
        let part: IPartInfo = new IPartInfo();
        let arr: { obj: any; rate: number; }[] = [];
        for (let i = 0; i < GlobalVar.VARIATION.length; i++) {
            arr.push({ obj: i, rate: GlobalVar.VARIATION[i] });
        }
        let type: EPartType = Utils.RandomObjByRate(arr);
        let partCfgs = GameConfig.Parts.findElements("Type", type);

        let breedInfo = new IBreedInfo();
        if (partCfgs.length > 0) {
            let cfgArr: { obj: any; rate: number; }[] = [];
            for (let i = 0; i < partCfgs.length; i++) {
                if (partCfgs[i].Variation) {
                    cfgArr.push({ obj: partCfgs[i].ID, rate: partCfgs[i].Variation });
                }
            }
            if (cfgArr.length <= 0) {
                breedInfo.horseInfo = info;
                breedInfo.variationPart = EPartType.None;
                return breedInfo;
            }
            part.name = type;
            part.partId = Utils.RandomObjByRate(cfgArr);
            part.variation = true;
            breedInfo = this.changePart(info, part);
            return breedInfo;
        } else {
            breedInfo.horseInfo = info;
            breedInfo.variationPart = EPartType.None;
            return breedInfo;
        }
    }

    /**
     * 改变指定部位
     * @param info 马匹信息
     * @param part 改变后的肢体
     * @returns 繁育信息
     */
    private changePart(info: IHorseInfo, part: IPartInfo): IBreedInfo {
        let breedInfo = new IBreedInfo();
        let partIndexs: number[] = [];
        for (let i = 0; i < info.parts.length; i++) {
            if (info.parts[i].name == part.name) {
                partIndexs.push(i);
            }
        }
        let random = Math.floor(Math.random() * partIndexs.length);
        let index = partIndexs[random];
        info.parts[index] = part;
        breedInfo.horseInfo = info;
        breedInfo.variationPart = part.name;
        breedInfo.variationIndex = index;
        return breedInfo;
    }

    public getRate(info: IHorseInfo): number {
        let porpertyRate = this.getPrice(info.property);
        let partRate = this.getPartRate(info.parts);
        let rate = porpertyRate + partRate;
        for (let i = 0; i < GlobalVar.GRADE_GRADE.length; i++) {
            let grade = GlobalVar.GRADE_GRADE[i];
            if (rate < grade) {
                return i;
            }
        }
        return GlobalVar.GRADE_GRADE.length;
    }

    private getPartRate(parts: IPartInfo[]) {
        let partRate = 0;
        for (const partInfo of parts) {
            let cfg = GameConfig.Parts.getElement(partInfo.partId);
            partRate += cfg.Rate;
        }
        return partRate;
    }
    /**
     * 获取属性评级
     * @param property 属性
     * @returns 属性评级
     */
    public getPrice(property: Property): number {
        let lineage = GameConfig.Lineage.getElement(property.lineage);

        let speedPrice = this.calculate(property.speed, lineage.maxSpeed, lineage.horsePrice, lineage.speedRange, EPriceVal.Other)
        let acceleratePrice = this.calculate(property.acceleratedSpeed, lineage.accelerate, lineage.horsePrice, lineage.accelerateRange, EPriceVal.Other)
        let energyPrice = this.calculate(property.energy, lineage.energy, lineage.horsePrice, lineage.energyRange, EPriceVal.Other)
        let bearPrice = this.calculate(property.maxBirthNum, lineage.bear, lineage.horsePrice, lineage.bearRange, EPriceVal.Other)
        let startRunPrice = this.calculate(property.startRunSpeed, lineage.RunawaySpeed, lineage.horsePrice, lineage.speed0Range, EPriceVal.Other)
        let shitPrice = this.calculate(property.defecation, lineage.defecation, lineage.horsePrice, lineage.shitRange, EPriceVal.Fat)

        let totalPrice: number = speedPrice + acceleratePrice + bearPrice + energyPrice + startRunPrice + shitPrice
        return Math.floor(totalPrice);
    }
    /**
     * 
     * @param property 属性值
     * @param defaultProperty  默认属性值
     * @param defaultprice  默认价格值
     * @param range 属性值权重
     */
    private calculate(property: number, defaultProperty: number[], defaultprice: number[], range: number, type: EPriceVal) {
        let tmpProperty: number = 0
        if (type != EPriceVal.Fat) {
            tmpProperty = (property - defaultProperty[0]) / (defaultProperty[1] - defaultProperty[0])
        } else {
            tmpProperty = 1 - (property - defaultProperty[0]) / (defaultProperty[1] - defaultProperty[0])
        }

        let value = (defaultprice[0] + tmpProperty * (defaultprice[1] - defaultprice[0])) * range
        return value
    }

    /**
     * 马匹繁殖
     * @param infoF 父亲马匹信息
     * @param infoM 母亲马匹信息
     * @returns 小马的马匹信息
     */
    public breed(infoF: IHorseInfo, infoM: IHorseInfo): IBreedInfo {
        let propertyF = infoF.property;
        let propertyM = infoM.property;
        let property = new Property();
        let parts: IPartInfo[] = [];
        property.speed = Math.floor(Utils.getRandomNumber(propertyF.speed, propertyM.speed) * GlobalVar.BREED_ADDITION_MAX);
        property.acceleratedSpeed = Math.floor(Utils.getRandomNumber(propertyF.acceleratedSpeed, propertyM.acceleratedSpeed) * GlobalVar.BREED_ADDITION_MAX);
        property.startRunSpeed = Math.floor(Utils.getRandomNumber(propertyF.startRunSpeed, propertyM.startRunSpeed) * GlobalVar.BREED_ADDITION_MAX);

        property.lineage = Math.random() > 0.5 ? propertyF.lineage : propertyM.lineage;
        property.getRandomNature();
        property.somatoType = EHorseSomatoType.Filly;

        property.maxEnergy = Utils.getRandomNumber(propertyF.maxEnergy, propertyM.maxEnergy);
        property.energy = property.maxEnergy;
        property.maxBirthNum = Utils.getRandomNumber(propertyF.maxBirthNum, propertyM.maxBirthNum);
        property.birthNum = property.maxBirthNum;
        property.defecation = Utils.getRandomNumber(propertyF.defecation, propertyM.defecation);


        for (let i = 0; i < GlobalVar.PARTS_NUMBER; i++) {
            if (i < 4) {
                let part: IPartInfo;
                part = Math.random() < 0.5 ? infoF.parts[i] : infoM.parts[i];
                parts.push(part);
            } else {
                let partArr = Math.random() < 0.5 ? infoF.parts : infoM.parts;
                let thigh = partArr[i];
                let calf = partArr[i + 1];
                parts.push(thigh);
                parts.push(calf);
                i++;
            }
        }

        let trailing: number = 0;
        if (infoF.trailingID && !infoM.trailingID) {
            trailing = infoF.trailingID
        } else if (!infoF.trailingID && infoM.trailingID) {
            trailing = infoM.trailingID
        } else {
            trailing = Math.random() > 0.5 ? infoF.trailingID : infoM.trailingID;
        }
        let info: IHorseInfo = {
            ID: "-1",
            parts: parts,
            property: property,
            trailingID: trailing,
        }
        let breedInfo: IBreedInfo;
        breedInfo = this.variation(info);
        breedInfo.horseInfo.rate = this.getRate(breedInfo.horseInfo);
        return breedInfo;
    }

}
//#endregion
