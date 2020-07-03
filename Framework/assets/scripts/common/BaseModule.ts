import IModule from "./IModule";
import Main from "../Main";

export default abstract class BaseModule implements IModule {
    name: string = null;

    getName() : string {
        return this.name;
    }

    init (name: string) {
        Main.AssertStringNotEmpty(name, "BaseModuel Init Fail, name is empty");
        this.name = name;
    }

    uninit() {
        
    }

    update () {
        // throw new Error ("Error: BaseModule Update fail, should override");
    }
}