import Main from "../Main";

let testValue = 0;

function testEventFunc (name: string, param: any) {
    console.log ("get event:" + name);
    testValue += param;
}

function testEventFunc2 (name: string, param: any) {
    console.log ("get event2:" + name);
    testValue -= 1;
}


// 测试 EventModule:
// Listener 的增删查改
// Event 的增删查改
export default class testEventModule {
    constructor () {
        testModule();
    }

    /**
     * 测试 Listener 的添加
     * Listener 的删除
     * Listener 的查找
     * Listener 的使用
     */
    private testModule () {
        let eventModule = Main.getInstance().getModule("Event") as MessageModule;
        Main.AssertNotEmpty (eventModule, "testEventModule testModule failed, can't get event module");

        // 测试添加
        Main.Assert(eventModule.isHaveEvent("test") === false, "testEventModule testModule failed, event test should be empty");
        eventModule.addEventListener("test", testEventFunc);
        Main.Assert(eventModule.isHaveEvent("test"), "testEventModule testModule failed, event test is empty");
        // 二次添加失败
        let isCatch = false;
        try {
            eventModule.addEventListener("test", testEventFunc);
        } catch (error) {
            isCatch = true;
        }
        Main.Assert(isCatch, "testEventModule testModule Fail, addEventListener error");

        // 测试使用
        eventModule.dispatchEvent("test", 2);
        Main.Assert(testValue === 2, "testEventModule testModule failed, despatchEvent Error");
        testValue = 0;
        eventModule.addEventListener("test", testEventFunc2);
        eventModule.dispatchEvent("test", 2);
        Main.Assert(testValue === 1, "testEventModule testModule failed, despatchEvent Error");

        // 测试移除
        eventModule.removeEventListener("test", testEventFunc);
        // 重复移除
        isCatch = false;
        try {
            eventModule.removeEventListener("test", testEventFunc);
        } catch (error) {
            isCatch = true;
        }
        Main.Assert(isCatch, "testEventModule testModule failed, removeEventListener Error");

        // 测试移除后的使用
        testValue = 0;
        Main.dispatchEvent("test", 2);
        Main.Assert(testValue === -1, "testEventModule testModule Failed, removeEventListener Error");

        Main.Log ("testEventModule testModule Pass");
    }
}
