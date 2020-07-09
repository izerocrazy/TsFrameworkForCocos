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
import BaseScene from "./BaseScene";
import PlacedTouchFactory from "./placedTouch/PlacedTouchFactory";
import UIPlacedComponent from "./placedTouch/UIPlacedComponent";
import UITouchInteractionComponent from "./placedTouch/UITouchInteractionComponent";
import QuestionBehavior from "../logic/question/behavior/QuestionBehavior";
import AnswerBehavior from "../logic/question/behavior/AnswerBehavior";

const {ccclass, property} = cc._decorator;

@ccclass
export default class TestScene extends BaseScene {
    @property(cc.Node)
    root : cc.Node = null;

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

    onLoad () {
        super.onLoad();

        PlacedTouchFactory.getInstance().init(this.root);

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

    start () {
        super.start();
    }

    update (dt) {
        super.update(dt);
    }

    private createQuestion (q:QuestionBehavior) {
        let question = cc.instantiate(this.QuestionPrefab);
        this.QuestionParent.addChild(question);
        question.position = new cc.Vec3(0);

        let comp = PlacedTouchFactory.getInstance().addPlacedToNode(question, UIPlacedComponent);

        let ui = question.getComponent(UIQuestion);
        ui.setInfo(q.getShowData());
        ui.data = q;
        
        comp.addSetToucherCallback(Main.getCallbackWithThis(ui.onPlacedToucher, ui));
        comp.addRemoveToucherCallback(Main.getCallbackWithThis(ui.onPlacedLevelToucher, ui))
    }

    private createAnswer(a : AnswerBehavior) {
        let info = a.getShowData();
        let answerPlace = cc.instantiate(this.AnswerPlacePrefab);
        this.AnswerParent.addChild(answerPlace);
        answerPlace.position = new cc.Vec3(0);
        PlacedTouchFactory.getInstance().addPlacedToNode(answerPlace, UIPlacedComponent);
        answerPlace.name = 'answerPlace' + info;

        let answer = cc.instantiate(this.AnswerPrefab);
        answerPlace.addChild(answer);
        answer.position = new cc.Vec3(0);
        PlacedTouchFactory.getInstance().addTouchToNode(answer, UITouchInteractionComponent);
        answer.name = 'answer' + info;
        
        let placedComponent = answerPlace.getComponent(UIPlacedComponent);
        let touchComponent = answer.getComponent(UITouchInteractionComponent);
        placedComponent.addToucher(touchComponent); 

        let ui = answer.getComponent(UIAnswer);
        ui.setInfo(info);
        ui.root = this.node;
        ui.data = a;
    }

    private onMsg (data:Message) {
        let jsonData = data;
        console.log ('OnMsg', jsonData, jsonData.name);

        if (jsonData.name === 'QuestionSceneInit') {
            console.log ('OnMsg in Init');
            let showData : {question: QuestionBehavior, answers: AnswerBehavior[]};
            showData = jsonData.data as {question: QuestionBehavior, answers: AnswerBehavior[]};;

            // 新建题面
            // this.Question.string = jsonData.data.question;
            this.createQuestion(showData.question);

            // 新建答案：每个答案拥有一个 Place
            for (let i = 0; i < showData.answers.length; i++) {
                this.createAnswer(showData.answers[i]);
            }
        }
    }
}
