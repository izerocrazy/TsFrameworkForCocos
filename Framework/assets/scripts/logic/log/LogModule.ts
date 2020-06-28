import IModule from "../../common/IModule";
import BaseModule from "../../common/BaseModule";

export default class LogModule extends BaseModule{
    public init(name: string) {
        console.log ('LogModule init', name);
        super.init(name);
    }

    public update () {

    }

    public Log (...data) {
        console.log (JSON.stringify(data));
    }

    public Error (...data) {
        console.error (JSON.stringify(data));
        throw new Error (JSON.stringify(data));
    }
}