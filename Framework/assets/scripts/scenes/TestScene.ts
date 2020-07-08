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
import Message from "../logic/message/Message";
import UIQuestion from "./UIQuestion";
import UIAnswer from "./UIAnswer";

const {ccclass, property} = cc._decorator;

@ccclass
export default class TestScene extends cc.Component {
    @property(cc.Node)
    QuestionParent : cc.Node = null;
    Question: cc.Node = null;

    @property(cc.Node)
    AnswerParent: cc.Node = null;
    AnswerList: cc.Node[] = null;

    @property(cc.Prefab)
    QuestionPrefab: cc.Prefab = null;

    @property(cc.Prefab)
    AnswerPrefab: cc.Prefab = null;

    @property(cc.Prefab)
    AnswerPlacePrefab: cc.Prefab = null;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
        Main.getInstance().init();

        // 清理掉
        this.QuestionParent.removeAllChildren();
        this.AnswerParent.removeAllChildren();

        /*
        let test = new testMainAndModule();
        let test2 = new testMessageModule();
        let test3 = new testMyObject();
        let test4 = new testEventModule();
        */

        let module = Main.getInstance().createModule("Question", QuestionModule);

        // 注册消息监听
        let msgModule = Main.getInstance().getModule("Message") as MessageModule;
        let msgChannel = msgModule.getChannel("QuestionModule");
        msgChannel.addListener(Main.getCallbackWithThis(this.onMsg, this));
    }

    update (dt) {
        Main.getInstance().update();
    }

    private createQuestion (info:string) {
        let question = cc.instantiate(this.QuestionPrefab);
        this.QuestionParent.addChild(question);
        question.position = new cc.Vec3(0);

        let ui = question.getComponent(UIQuestion);
        ui.setInfo(info);
    }

    private createAnswer(info:string) {
        let answerPlace = cc.instantiate(this.AnswerPlacePrefab);
        this.AnswerParent.addChild(answerPlace);
        answerPlace.position = new cc.Vec3(0);

        let answer = cc.instantiate(this.AnswerPrefab);
        answerPlace.addChild(answer);
        answer.position = new cc.Vec3(0);

        let ui = answer.getComponent(UIAnswer);
        ui.setInfo(info);
        ui.root = this.node;
    }

    private onMsg (data:Message) {
        let jsonData = data;
        console.log ('OnMsg', jsonData, jsonData.name, jsonData.data.question);

        if (jsonData.name === 'QuestionSceneInit') {
            console.log ('OnMsg in Init');

            // 新建题面
            // this.Question.string = jsonData.data.question;
            this.createQuestion(jsonData.data.question);

            // 新建答案：每个答案拥有一个 Place
            for (let i = 0; i < jsonData.data.answers.length; i++) {
                // if (i === 0) {
                //     this.answer1.string = jsonData.data.answers[i].value;
                // } else {
                //     this.answer2.string = jsonData.data.answers[i].value;
                // }
                this.createAnswer(jsonData.data.answers[i].value);
            }
        }
    }
}
