import IModule from "../../common/IModule";
import BaseModule from "../../common/BaseModule";

export default class LogModule extends BaseModule{
    public Init(name: string) {
        console.log ('LogModule init', name);
        super.Init(name);
    }

    public Update () {

    }

    public Log (...data) {
        console.log (JSON.stringify(data));
    }
}