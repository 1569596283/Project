import { EHorseSomatoType, GlobalVar } from "../Common";
import { GameConfig } from "../config/GameConfig";



export default class Property {
    private static firstNameNum = 0
    private static lastNameNum = 0

    /** 速度 */
    public speed: number;

    /** 加速度 */
    public acceleratedSpeed: number;

    /**起跑速度 */
    public startRunSpeed: number;

    /**排便量 */
    public defecation: number;

    /** 血统 */
    public lineage: number;
    /** 性格 */
    public nature: number;
    /** 喜好 */
    public hobby: number;

    /** 当前精力 */
    public energy: number;
    /** 最大精力 */
    public maxEnergy: number;

    /** 剩余生育次数 */
    public birthNum: number;
    /** 最大生育次数 */
    public maxBirthNum: number;
    /**昵称 */
    public nickName: string
    /** FirstName序号 */
    public firsName: number;
    /** LastName序号 */
    public lastName: number;

    /**成长值 */
    public growth: number

    /**体型 */
    public somatoType: EHorseSomatoType

    constructor() {
        this.speed = 0;
        this.acceleratedSpeed = 0;
        this.lineage = 0;
        this.nature = 0;
        this.startRunSpeed = 0;
        this.defecation = 0

        this.energy = 0;
        this.maxEnergy = 0;
        this.birthNum = 0;
        this.maxBirthNum = 0;
        this.nickName = '';
        this.firsName = 0;
        this.lastName = 0;
        this.hobby = -1
        this.growth = 0
        this.somatoType = EHorseSomatoType.Mature

        let allHobby = GameConfig.Hobby.getAllElement();
        if (allHobby.length > 0) {
            this.hobby = allHobby[Math.floor(Math.random() * allHobby.length)].ID;
        }

        if (Property.lastNameNum <= 0) {
            this.initNameList()
        }

        this.spawnName()
    }

    private spawnName() {
        this.firsName = Math.floor(Math.random() * Property.firstNameNum);
        this.lastName = Math.floor(Math.random() * Property.lastNameNum);
        // console.log("spawnName       :", this.firsName)
        // console.log(this.lastName)

        // let firstName = Property.firstNames[Math.floor(Math.random() * Property.firstNames.length)];
        // let lastName = Property.lastNames[Math.floor(Math.random() * Property.lastNames.length)];
        // if (firstName && lastName) {
        //     this.nickName = lastName + firstName
        // }
    }

    private initNameList() {
        let allNames = GameConfig.Name.getAllElement()
        for (const name of allNames) {
            if (name.lastName) {
                Property.lastNameNum++;
            }
            if (name.firstName) {
                Property.firstNameNum++;
            }
        }
    }

    /** 获得随机的性格 */
    public getRandomNature() {
        let lineageCfg = GameConfig.Lineage.getElement(this.lineage);
        let index = Math.floor(Math.random() * lineageCfg.personality.length);
        this.nature = lineageCfg.personality[index];
    }
}