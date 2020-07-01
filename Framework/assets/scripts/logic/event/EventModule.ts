import BaseModule from "../../common/BaseModule";
import Main from "../../Main";

// Event Module:
// 一个 Event.name 对应一排 function
export default class EventModule extends BaseModule {
    eventListeners : Map<string, any>;

    constructor () {
        super();
        this.eventListeners = new Map<string, any>();
    }

    public getListenersByName(name: string) {
        Main.AssertStringNotEmpty(name, "EventModule");
    }

    public addListener () {

    }
}