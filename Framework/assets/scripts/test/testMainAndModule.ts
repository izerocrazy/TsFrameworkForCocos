import Main from "../Main";
import BaseModule from "../common/BaseModule";

export class testModule extends BaseModule {
    testValue: number;

    public init(name: string) {
        super.init(name);
        this.testValue = 1;
    }

    public uninit() {
        this.testValue = 3;
    }

    public update() {
        this.testValue += 1;
    }
}

export default class testMainAndModule {
    constructor () {
        this.testMain();
        this.testMainAddRemoveModule();
        this.testModuleFunction();
    }

    /**
     * 测试 Main 的 Instance
     */
    public testMain() {
        Main.AssertNotEmpty(Main.getInstance(), "testMain Fail");

        Main.Log("testMain pass");
    }

    /**
     * 测试添加删除 Module：
     * 添加 testModule 成功
     * 名字对
     * 查找成功
     * 重复添加 testModule 失败
     * 删除成功
     * 重复删除失败
     * 删除后添加成功
     */
    public testMainAddRemoveModule() {
        let length = Main.getInstance().getModuleLenght();
        let m = Main.getInstance().createModule("test", testModule);

        Main.Assert(Main.getInstance().getModuleLenght() === length + 1, "testMainAddRemoveModule test add modules failed, " + Main.getInstance().getModuleLenght());
        Main.Assert(m.getName() === "test", "testMainAddRemoveModule test getName Fail");
        Main.Assert(Main.getInstance().getModule("test") === m, "testMainAddRemoveModule test getModule Fail");

        // 重复创建
        let isCatch = false;
        try {
            Main.getInstance().createModule("test", testModule);
        } catch (error) {
            isCatch = true;
        }
        Main.Assert(isCatch, "testMainAddRemoveModule test create two modules with same name Fail")

        // 删除
        isCatch = false;
        try {
            Main.getInstance().removeModule("test");
        } catch (error) {
            isCatch = true;
        }
        Main.Assert(isCatch === false, "testMainAddRemoveModule test remove modules failed");
        Main.Assert(Main.getInstance().getModuleLenght() === 2, "testMainAddRemoveModule test remove modules failed");
        Main.AssertEmpty(Main.getInstance().getModule("test"), "testMainAddRemoveModule test remove modules failed");
        try {
            Main.getInstance().removeModule("test");
        } catch (error) {
            isCatch = true;
        }
        Main.Assert(isCatch === true, "testMainAddRemoveModule test remove modules failed");

        // 删除后再次添加
        isCatch = false;
        try {
            Main.getInstance().createModule("test", testModule);
        } catch (error) {
            isCatch = true;
        }
        Main.Assert(isCatch === false, "testMainAndRemoveModule test add module after remove failed");

        // 清空 Main
        Main.getInstance().removeModule("test");

        Main.Log("testMainAndRemoveModule pass");
    }

    /**
     * 测试函数调用
     * Init
     * Update
     * Uninit
     */
    public testModuleFunction () {
        let m = Main.getInstance().createModule("test", testModule) as testModule;
        Main.Assert(m.testValue === 1, "testModuleFunction init Fail");

        Main.getInstance().update();
        Main.Assert(m.testValue === 2, "testModuleFunction Update Fail");

        Main.getInstance().removeModule("test");
        Main.Assert(m.testValue === 3, "testModuleFunction uninit Fail");

        Main.getInstance().update();
        Main.Assert(m.testValue === 3, "testModuleFunction removeModule Fail, still call remove module update");

        Main.Log("testMainFunction pass");
    }
}
