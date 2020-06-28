import IModule from "./IModule";

export default class BaseModule implements IModule {
    name: string = null;

    GetName() : string {
        console.log ('GetName', this.name);
        return this.name;
    }

    Init (name: string) {
        this.name = name;
    }

    Update () {
        throw new Error ("Error: BaseModule Update fail, should override");
    }
}