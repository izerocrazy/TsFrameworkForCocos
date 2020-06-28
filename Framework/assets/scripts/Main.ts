import IModule from "./common/IModule";
import LogModule from "./logic/log/LogModule";
import MessageModule from "./logic/message/MessageModule";

export default class Main {
    /**
     * 单例模式
     */
    private static _instance: Main = new Main();

    /**
     * 一组 module
     */
    private modules: IModule[] = new Array();

    /**
     * 等待在下一帧中移除掉的 module
     * 直接在当前帧中移除掉的话，会导致 update 中的 module 的遍历逻辑出现问题
     */
    private removeModuleIndexList: number[] = new Array();

    /**
     * 初始化，保证单例 new
     */
    constructor() {
        Main.AssertNotEmpty(Main._instance, "Error: Main Instantiation failed: Use Main.getInstance()");

        Main._instance = this;
    }

    /**
     * 获取到单例
     */
    public static getInstance():Main
    {
        return Main._instance;
    }

    /**
     * 逻辑的初始化，将基础的 module 都放进去
     * Log
     * Message
     */
    public init ()
    {
        // 增加一些常备 Module
        this.createModule("Log", LogModule);
        let log = this.getModule("Log") as LogModule;

        this.createModule("Message", MessageModule);
        let msgModule = this.getModule("Message") as MessageModule;
        let channel = msgModule.createChannel("Main");

        // 最后发送
        msgModule.addMessage("Main", "Init", null);
    }

    /**
     * 一次逻辑帧：
     * * 非移除的 module 都进行一次 update
     * * 被标记为移除的 module 则清理干净
     */
    public update ()
    {
        // 遍历 update
        for (let i = 0; i < this.modules.length; i++) {
            // 需要剔除 remove 的内容
            if (this.isModuleRemoved(i) === false) {
                this.modules[i].update();
            }
        }

        // 移除 module，反向处理
        if (this.removeModuleIndexList.length > 0 ){   
            this.removeModuleIndexList.reverse();
            for (let i = 0; i < this.removeModuleIndexList.length; i++) {
                this.modules.splice(this.removeModuleIndexList[i], 1);
            }
            this.removeModuleIndexList = [];
        }
    }

    /**
     * 获得 Module
     * @param name Module 的名称
     */
    public getModule (name: string) : IModule
    {
        let module : IModule = null;
        Main.AssertStringNotEmpty(name, "Error: Main getModule failed, name is empty");

        for (let i = 0; i < this.modules.length; i++) {
            if (name === this.modules[i].getName() && this.isModuleRemoved(i) === false) {
                module = this.modules[i];
                break;
            }
        }

        return module;
    }

    /**
     * 获得 Module Index
     * @param name Module 的名称
     */
    private getModuleIndex (name: string): number
    {
        let index: number = -1;

        Main.AssertStringNotEmpty(name, "Error: Main getModuleIndex failed, name is empty");

        for (let i = 0; i < this.modules.length; i++) {
            if (name === this.modules[i].getName() && this.isModuleRemoved(i) === false) {
                index = i;
                break;
            }
        }

        return index;
    }

    /**
     * 返回 Module 的总个数
     */
    public getModuleLenght () :number
    {
        return this.modules.length - this.removeModuleIndexList.length;
    }

    /**
     * 创建 Module
     * @param name Module 的名字，在 Main 中的唯一标识
     * @param m class 对象
     */
    public createModule<A extends IModule> (name:string, m: new() => A):IModule
    {
        Main.AssertStringNotEmpty(name, "Error: Main addModule failed, szName or module is empty");
        Main.AssertNotEmpty(this.modules, "Error: Main addModule failed, modules is empty");
        Main.AssertEmpty(this.getModule(name), "Error: Main addModule failed, aleardy exist module " + name);

        let module = new m();
        module.init(name);
        this.modules.push(module);

        return module;
    }

    /**
     * 移除某个 Module
     * @param name 名字为 name
     */
    public removeModule (name: string)
    {
        Main.AssertStringNotEmpty(name, "Error: Main removeModule failed, szName or module is empty");
        Main.AssertNotEmpty(this.modules, "Error: Main removeModule failed, modules is empty");

        let module = this.getModule(name);
        Main.AssertNotEmpty(module, "Main removeModule Fail, can't find module " + name);
        module.uninit();
        let index = this.getModuleIndex(name);
        this.removeModuleIndexList.push(index);
    }

    /**
     * 是否正要被移除
     * @param index 当前的 index
     */
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

    /////////////////////////////////////////////////
    /**
     * 日志
     * @param data 传入的日志信息
     */
    public static Log (...data) {
        let log = Main.getInstance().getModule("Log") as LogModule;
        if (log) {
            log.Log(data);
        }
    }

    /**
     * 报错日志
     * @param data 传入的报错日志信息
     */
    public static Error(...data) {
        let log = Main.getInstance().getModule("Log") as LogModule;
        if (log) {
            log.Error(data);
        } else {
            throw new Error (JSON.stringify(data));
        }
    }

    // 是否可以使用断言，通常上线之后就不使用了
    static isAssert : boolean = true;

    /**
     * 断言某个对象一定为空
     * @param value 断言对象
     * @param error 断言失败后的错误信息
     */
    public static AssertEmpty(value:any, error: string) {
        if (this.isAssert === false) {
            return;
        }

        if (value !== null && value !== undefined) {
            this.Error(error);
        }
    }

    /**
     * 断言某个对象一定不为空
     * @param value 断言对象
     * @param error 断言失败后的错误信息
     */
    public static AssertNotEmpty(value: any, error: string) {
        if (this.isAssert === false) {
            return;
        }

        if (value === null || value === undefined) {
            this.Error(error);
        }
    }

    /**
     * 断言某个 string 一定不为空
     * @param value 断言对象
     * @param error 断言失败后的错误信息
     */
    public static AssertStringNotEmpty(value: string, error: string) {
        if (this.isAssert === false) {
            return;
        }

        if (value === null || value === undefined || value === "") {
            this.Error(error);
        }
    }

    /**
     * 断言某个 value 为 true
     * @param value 断言对象
     * @param error 断言失败后的错误信息
     */
    public static Assert(value:boolean, error:string) {
        if (this.isAssert === false) {
            return;
        }

        if (!(value === true)) {
            this.Error(error);
        }
    }
}