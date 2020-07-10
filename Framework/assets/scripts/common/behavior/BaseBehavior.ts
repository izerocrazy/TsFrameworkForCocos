import IBehavior from "./IBehavior";
import Main from "../../Main"

export class BehaviorShowData {
    type: string;
    data: any;
}

export default abstract class BaseBehavior implements IBehavior{
    public name: string;

    /**
     * 获取名字
     */
    public getName(): string {
        return this.name;
    }

    /**
     * 初始化
     * @param data 初始化数据 {name:"", data:any}
     */
    public init(data: { name: string, data: any}) {
        Main.AssertNotEmpty(data, "BaseBehavior Init Fail, data is empty");
        Main.AssertNotEmpty(data.name, "BaseBehavior Init Fail, data.name is empty");
        // Main.AssertNotEmpty(data.data, "BaseBehavior Init Fail, data.data is empty");

        this.name = data.name;
    }

    /**
     * 删除
     */
    public uninit() {
        // throw new Error("BaseBehavior Uninit Fail");
    }

    public update() {
        // throw new Error("BaseBehavior Update Fail");
    }

    public getBehaviorShowData() : BehaviorShowData {
        console.error ("1", this);
        console.error ("3", BehaviorShowData);
        let ret = new BehaviorShowData();
        console.error ("1", this);

        ret.type = this.constructor.name;
        ret.data = this;
        console.error ("1", this);

        return ret;
    }
}
