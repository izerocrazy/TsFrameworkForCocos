import IModule from "./common/IModule";
import LogModule from "./logic/log/LogModule";

export default class Main {
    private static _instance: Main = new Main();

    modules: IModule[] = new Array();
    removeModuleIndexList: number[] = new Array();

    constructor() {
        if (Main._instance) {
            throw new Error("Error: Main Instantiation failed: Use Main.getInstance()");
        }

        Main._instance = this;
        Main._instance.init();
    }

    public static getInstance():Main
    {
        return Main._instance;
    }

    public init ()
    {
        // 增加 Module，要调用 init
        let log: LogModule = new LogModule();
        this.addModule("Log", log);

        log = this.getModule("Log") as LogModule;
    }

    public update ()
    {
        // 遍历 update
        for (let i = 0; i < this.modules.length; i++) {
            // 需要剔除 remove 的内容
            if (this.isModuleRemoved(i) === false) {
                this.modules[i].Update();
            }
        }

        // 移除 module，反向处理
        this.removeModuleIndexList.reverse();
        for (let i = 0; i < this.removeModuleIndexList.length; i++) {
            this.modules.splice(this.removeModuleIndexList[i], 1);
        }
    }

    public getModule (name: string) : IModule
    {
        let module : IModule = null;

        if (name === null || name === undefined){ 
            throw new Error("Error: Main getModuleIndex failed, name is empty");
        }

        for (let i = 0; i < this.modules.length; i++) {
            if (name === this.modules[i].GetName()) {
                module = this.modules[i];
                break;
            }
        }

        return module;
    }

    private getModuleIndex (name: string): number
    {
        let index: number = -1;

        if (name === null || name === undefined){ 
            throw new Error("Error: Main getModuleIndex failed, name is empty");
        }

        for (let i = 0; i < this.modules.length; i++) {
            if (name === this.modules[i].GetName()) {
                index = i;
                break;
            }
        }

        return index;
    }

    public addModule (name:string, module:IModule)
    {
        if (name === null || name === undefined || module === null || module === undefined) {
            throw new Error("Error: Main addModule failed, szName or module is empty");
        }

        if (this.modules === null || this.modules === undefined) {
            throw new Error("Error: Main addModule failed, modules is empty");
        }

        if (this.getModule(name) !== null) {
            throw new Error("Error: Main addModule failed, aleardy exist module " + name);
        }

        module.Init(name);
        this.modules.push(module);
    }

    public removeModule (name: string)
    {
        if (name === null || name === undefined) {
            throw new Error("Error: Main removeModule failed, szName or module is empty");
        }

        if (this.modules === null || this.modules === undefined) {
            throw new Error("Error: Main removeModule failed, modules is empty");
        }

        let index = this.getModuleIndex(name);
        this.removeModuleIndexList.push(index);
    }

    private isModuleRemoved (index: number) {
        let ret: boolean = false;
        for (let i = 0; i < this.removeModuleIndexList.length; i++) {
            if (this.removeModuleIndexList[i] === index) {
                ret = true;
                break;
            }
        }

        return ret;
    }

    public static Log (...data) {
        let log = Main.getInstance().getModule("Log") as LogModule;
        log.Log(data);
    }
}