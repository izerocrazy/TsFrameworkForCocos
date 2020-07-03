// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Main from "../Main";
import QuestionModule from "../logic/question/QuestionModule";
import testMainAndModule from "../test/testMainAndModule";
import testMessageModule from "../test/testMessageModule";
import testMyObject from "../test/testMyObject";
import testEventModule from "../test/testEventModule"
import MessageModule from "../logic/message/MessageModule";

const {ccclass, property} = cc._decorator;

@ccclass
export default class TestScene extends cc.Component {

    @property(cc.Label)
    label: cc.Label = null;

    @property
    text: string = 'hello';

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
        Main.getInstance().init();

        let test = new testMainAndModule();
        let test2 = new testMessageModule();
        let test3 = new testMyObject();
        let test4 = new testEventModule();

        let module = Main.getInstance().createModule("Question", QuestionModule);

        // 注册消息监听
        let msgModule = Main.getInstance().getModule("Message") as MessageModule;
        let msgChannel = msgModule.getChannel("QuestionModule");
        msgChannel.addListener(Main.getCallbackWithThis(this.onMsg, this));
    }

    update (dt) {
        Main.getInstance().update();
    }

    private onMsg (data) {
        console.log ('OnMsg', JSON.stringify(data));
    }
}
