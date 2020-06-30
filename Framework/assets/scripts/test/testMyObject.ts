import Main from "../Main";
import MyObject from "../common/MyObject"
import BaseBehavior from "../common/behavior/BaseBehavior"

let gTestValue = 0;

class testBehavior extends BaseBehavior {
    string data = "";

    public init (data) {
        super.init(data);

        this.data = data.data;
    }

    public update () {
        gTestValue += 1;
    }
}

// 测试 MyObject，主要 Behavior 的添加删除操作
export default class testMyObject {
    constructor () {
    }

    /**
     * 测试 MyObject 的 Behavior 的逻辑
     * 增加
     * 重复增加应该失败
     * 删除
     * 查找
     * 运行
     */
    public testObj (){
        let obj = new MyObject();

        // 增加
        let behavior = obj.createBehavior("test", testBehavior, "hello");
        Main.Assert(behavior.name === "test", "testMyObject testObj Fail, name error: " + behavior.name);
        Main.Assert(behavior.data === "hello", "testMyObject testObj Fail, data error:" + behavior.data);

        // 重复增加
        let isCatch = false;
        try {
            obj.createBehavior("test", testBehavior, "hello2");
        } catch (error) {
            isCatch = true;
        }
        Main.Assert(isCatch, "testMyObject testObj Fail, createBehavior error");

        // 查找
        let behavior2 = obj.getBehaviorByName("test");
        Main.Assert(behavior === behavior2, "testMyObject testObj Fail, getBehaviorByName Error name: test");

        // 删除
        obj.deleteBehaviorByName("test");

        behavior2 = obj.getBehaviorByName("test");
        Main.AssertEmpty(behavior2, "testMyObject testObj Fail, getBehaviorByName error");

        isCatch = false;
        try {
            obj.createBehavior("test", testBehavior, "hello3");
        } catch (error) {
            isCatch = true;
        }
        Main.Assert(isCatch, "testMyObject testObj Fail, createBehavior Error");

        // 添加后使用
        obj.createBehavior("test2", testBehavior, "hello4");
        obj.update();
        Main.Assert(gTestValue === 1, "testMyObject testObj Fail, update Error, value is " + gTestValue);

        Main.Log("testMyObject pass");
    }
}
