import Main from "../../Main";

/**
 * 事件
 * 注意 isFire 属性，当 isFire 的时候，不允许直接添加和删除 Listener
 */
export default class Event {
    // 名称
    name: string;
    // isFire
    isFire: boolean;
    // 当前事件的所有 Listener
    listeners: any[];

    /**
     * 初始化
     * @param name 名称
     * @param param 事件参数
     */
    constructor(name: string) {
        this.isFire = false;
        this.name = name;
        this.listeners = new Array();
    }

    /**
     * 获取 Listener 的长度
     */
    public getListenerLength () {
        return this.listeners.length;
    }

    public isContainListener (func: any) {
        Main.AssertNotEmpty(func, "Event isContainListener Fail, func is empty");

        let ret = false;
        for (let i = 0; i < this.listeners.length; i ++) {
            if (this.listeners[i] === func) {
                ret = true;
                break;
            }
        }

        return ret;
    }

    /**
     * 触发事件
     */
    public fire (param: any) {
        this.isFire = true;

        for (let i = 0; i < this.listeners.length; i ++) {
            this.listeners[i](this.name, param);
        }

        this.isFire = false;
    }

    /**
     * 添加 Listener
     * 不能在 Fire 中添加
     * @param func Listener
     */
    public addListener (func: any) {
        Main.Assert(this.isFire === false, "Event addListener Fail, isFire");

        this.listeners.push(func);
    }

    /**
     * 移除 Listener
     * 不能在 Fire 中移除
     * @param func Listener
     */
    public removeListener (func:any) {
        Main.Assert(this.isFire === false, "Event removeListener Fail, isFire");

        for (let i = 0; i < this.listeners.length; i++) {
            if (this.listeners[i] === func) {
                this.listeners.splice(i, 1);
            }
        }
    }
}
