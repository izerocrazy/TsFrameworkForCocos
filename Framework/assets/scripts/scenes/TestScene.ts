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
    }

    // update (dt) {}
}
