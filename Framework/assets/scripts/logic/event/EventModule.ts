import BaseModule from "../../common/BaseModule";
import Main from "../../Main";

/**
 * 事件模块
 */
export default class EventModule extends BaseModule {
    // 所有事件
    events : Map<string, Event>;
    // 将要被添加的 Event Listener
    addEventListener : Map<string, any>;
    // 将要被移除的 Event Listener
    removeEventListener : Map<string, any>;

    constructor () {
        super();

        events = new Map<string, Event>();
        addEventListeners = new Map<string, any[]>();
        removeEventListeners = new Map<string, any[]>();
    }

    /**
     * 当前是否存在某个事件的监听者
     * @param name 监听事件的名称
     */
    public isHaveEvent (name: string) : boolean {
        Main.AssertStringNotEmpty(name, "EventModule isHaveEvent failed, name is empty");

        return events.has(name);
    }

    /**
     * 分发事件
     * 分发完成之后，还要清理掉队列
     * @param name 事件名称
     * @param param 事件参数
     */
    public dispatchEvent (name: string, param: any) {
        Main.AssertStringNotEmpty(name, "EventModule dispatchEvent failed, name is empty");

        let event = events.get(name);
        Main.AssertNotEmpty(event, "EventModule dispatchEvent failed, this event is empty");
        Main.Assert(event.isFire === false, "EventModule dispatchEvent failed, this event is fire");

        event.fire (param);

        // 清理掉缓存的 add 和 remove 操作
        if (this.addEventListeners.length > 0) {
            this.addEventListeners.forEach((value, key) =>{
                let name = key;
                let array = value;
                for (let i = 0; i < array.length; i++) {
                    let func = array[i];
                    this.addEventListener(name, func);
                }
            })
        }

        if (this.removeEventListeners.length > 0) {
            this.removeEventListeners.forEach((value, key) =>{
                let name = key;
                let array = value;

                for (let i = 0; i < array.length; i++) {
                    let func = array[i];
                    this.removeEventListener(name, func);
                }
            })
        }
    }

    /**
     * 添加事件监听者
     * @param name 事件名称
     * @param func 监听对象
     */
    public addEventListener (name: string, func: any) {
        Main.AssertStringNotEmpty(name, "EventModule addEventListener failed, name is empty");
        Main.AssertNotEmpty(func, "EventModule addEventListener failed, func is empty");

        if (this.isHaveEvent(name) === false) {
            this.events.set(name, new Event(name));
        }

        let event = this.events.get(name);
        Main.AssertNotEmpty(event, "EventModule addEventListener failed, cant find event name is " + name);
        Main.Assert(event.isContainListener(func) === false, "EventModuel addEventListener failed, already add func name is " + name);

        // 如果在 fire 中
        if (event.isFire === true) {
            if (this.addEventListeners.has(name) === false) {
                let array = new Array();
                this.addEventListeners.set(name, array);
            }

            this.addEventListeners.get(name).push(func);
        } else {
            event.addListener(func);
        }
    }

    /**
     * 移除事件监听者
     * @param name 事件名称
     * @param func 监听对象
     */
    public removeEventListener (name:string , func: any) {
        Main.AssertStringNotEmpty(name, "EventModule removeEventListener failed, name is empty");
        Main.AssertNotEmpty(func, "EventModule removeEventListeners failed, func is empty");
        Main.Assert(this.isHaveEvent(name), "EventModule removeEventListeners failed, cant find this event " + name);

        let event = this.events.get(name);
        Main.Assert(event.isContainListener(func), "EventModule removeEventListeners failed cant find listen in event named " + name)
        if (event.isFire === true) {
            if (this.removeEventListeners.hase(name) === false) {
                let array = new Array();
                this.removeEventListeners.set(name, array);
            }

            this.removeEventListeners.get(name).push(func);
        } else {
            event.removeListener(func);
        }
    }
}
