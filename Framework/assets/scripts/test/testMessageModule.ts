import Main from "../Main";
import MessageModule from "../logic/message/MessageModule";
import MessageChannel from "../logic/message/MessageChannel";
import Message from "../logic/message/Message";

let testData = 0;

function onTestMsg1(msg: Message) {
    testData = testData + 1;
};

function onTestMsg2(msg: Message) {
    testData = testData + 2;
};

// 测试 Message Module 的各个接口
export default class testMessageModule {
    constructor () {
        this.testModule();
        this.testChannel();
    }

    /**
     * 测试 Message 接口
     */
    private testMessage() {

    }

    /**
     * 测试 Channel 接口
     * 添加一个 listener
     * 重复添加 listener
     * 添加事件，测试响应
     * 移除 listener
     * 添加事件，再次测试响应
     * 添加两个 listener，添加事件，测试响应
     * 移除一个，添加事件，测试响应
     */
    private testChannel() {
        let msgModule = Main.getInstance().getModule("Message") as MessageModule;
        Main.AssertNotEmpty (msgModule, "testMessageModule testChannel failed, can't get msg module");

        // 添加 test
        let channel = msgModule.createChannel("test");
        Main.AssertNotEmpty(channel, "testMessageModule testChannel failed, channel name is test");
        Main.Assert(msgModule.getChannel("test") === channel, "testMessageModule testChannel failed, getChannel error");

        // 添加 listener
        channel.addListener(onTestMsg1);
        // 再次添加 listener
        let isCatch = false;
        try {
            channel.addListener(onTestMsg1);
        } catch (error) {
            isCatch = true;
        }
        Main.Assert(isCatch === true, "testMessageModule testChannel Failed, addListener error");

        // 添加事件
        channel.pushMsg(new Message("name", "data"));
        channel.popAllMsg();

        Main.Assert(testData === 1, "testMessageModule testChannel Failed, pop msg error, data is " + testData);

        // 添加 listener2
        testData = 0;
        channel.addListener(onTestMsg2);

        channel.pushMsg(new Message("name", "data"));
        channel.popAllMsg();

        Main.Assert(testData === 3, "testMessageModule testChannel Failed, pop msg error, data is " + testData);

        // 移除 listener，再次测试事件
        channel.removeListener(onTestMsg1);
        channel.pushMsg(new Message("name", "data"));
        channel.popAllMsg();

        channel.removeListener(onTestMsg2);
        Main.Log("testMessagemodule testChannel Pass");
    }

    /**
     * 测试 Module 的接口
     * 添加 Channel
     * 删除 Channel
     * 再次添加 Channel, 添加重复的 Channel
     */
    private testModule() {
        let msgModule = Main.getInstance().getModule("Message") as MessageModule;
        Main.AssertNotEmpty (msgModule, "testMessageModule testModule failed, can't get msg module");

        // 添加 test
        let channel = msgModule.createChannel("test");
        Main.AssertNotEmpty(channel, "testMessageModule testModule failed, channel name is test");
        Main.Assert(msgModule.getChannel("test") === channel, "testMessageModule testModule failed, getChannel error");

        // 删除 test
        let isCatch = false;
        try {
            msgModule.removeChannel("test");
        } catch (error) {
            isCatch = true;
        }
        Main.Assert(isCatch === false, "testMessageModule testModule failed, removeChannel Error");

        // 重复添加
        channel = msgModule.createChannel("test");
        Main.AssertNotEmpty(channel, "testMessageModule testModule failed, channel name is test");
        Main.Assert(msgModule.getChannel("test") === channel, "testMessageModule testModule failed, add channel name is test");
        isCatch = false;
        try {
            msgModule.createChannel("test");
        } catch (error) {
            isCatch = true;
        }
        Main.Assert(isCatch === true, "testMessageModule testModule failded, add test channel should be fail");

        // 清理
        msgModule.removeChannel("test");

        Main.Log("testMessageModule testModule Pass");
    }
}
