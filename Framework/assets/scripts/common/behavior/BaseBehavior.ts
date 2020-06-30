import IBehavior from "./IBehavior";
import Main from "../../Main"

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
     * @param data 初始化数据 {name:"", data:{}}
     */
    public init(data) {
        Main.AssertNotEmpty(data, "BaseBehavior Init Fail, data is empty");
        Main.AssertNotEmpty(data.name, "BaseBehavior Init Fail, data.name is empty");
        Main.AssertNotEmpty(data.data, "BaseBehavior Init Fail, data.data is empty");

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
}
