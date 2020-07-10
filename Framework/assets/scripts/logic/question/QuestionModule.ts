import MyObject, { MyObjectFactory, ObjectShowData } from "../../common/MyObject";
import QuestionBehavior, { QuestionType, QuestionState } from "./behavior/QuestionBehavior";
import AnswerBehavior from "./behavior/AnswerBehavior";
import BaseModule from "../../common/BaseModule";
import Main from "../../Main";
import MessageModule from "../message/MessageModule";
import MessageChannel from "../message/MessageChannel";
import Message from "../message/Message";

export default class QuestionModule extends BaseModule {
    root: MyObject;
    rootQuestion: QuestionBehavior;
    answerList: MyObject[];
    msgChannel: MessageChannel;

    constructor() {
        super();

        Main.subscriptEvent('question_ui_set_answer', this.onSetAnswer, this);
        Main.subscriptEvent('question_ui_remove_answer', this.onRemoveAnswer, this);

        // todo:
        this.makeScene({});
    }

    public onSetAnswer (name: string, param: {question:QuestionBehavior, answer: AnswerBehavior}) {
        param.question.setAnswer(param.answer);
    }

    public onRemoveAnswer (name: string, param: {question:QuestionBehavior, answer: AnswerBehavior}) {
        param.question.removeAnswer(param.answer);
    }

    public makeScene (json) {
        // todo: 应该依据外部 data 来初始化
        let msgModule = Main.getInstance().getModule("Message") as MessageModule;
        this.msgChannel = msgModule.createChannel("QuestionModule");

        // 初始化题面
        this.root = MyObjectFactory.createMyObject();

        this.one2OneDemo();
        // this.listDemo();

        // todo:
        // 模拟，初始化消息
        let data = this.getShowData();
        this.msgChannel.pushMsg(new Message("QuestionSceneInit", data));
    }

    private listDemo () {
        // 例子：list: One2One & One2One
        this.rootQuestion = this.root.createBehavior("Question", QuestionBehavior, {type: QuestionType.List, showData: ""});
        this.rootQuestion.addStateChangeCallback(Main.getCallbackWithThis(this.onQuestionState, this));

        this.rootQuestion.createChildrenQuestion('1', {type: QuestionType.One2One, showData: "1=?", answerData : 1});
        this.rootQuestion.createChildrenQuestion('2', {type: QuestionType.One2One, showData: "2=?", answerData : 2});

        this.answerList = new Array();
        this.addAnswer({value: 1});
        this.addAnswer({value: 2});
    }

    private one2OneDemo () {
        // 例子：One2One: 1=?
        // 展示信息：1=?
        this.rootQuestion = this.root.createBehavior("Question", QuestionBehavior, {type: QuestionType.One2One, showData: "1=?", answerData : 1});
        this.rootQuestion.addStateChangeCallback(Main.getCallbackWithThis(this.onQuestionState, this));

        // 初始化答案
        this.answerList = new Array();
        this.addAnswer({value: 1});
        this.addAnswer({value: 2});
    }

    public onQuestionState (state: QuestionState, question: QuestionBehavior) {
        if (question === this.rootQuestion) {
            if (state === QuestionState.CanCheckAnswer) {
                this.msgChannel.pushMsg(new Message("QuestionCanCheck", null));
            } else if (state === QuestionState.WaitAnswer) {
                this.msgChannel.pushMsg(new Message("QuestionCantCheck", null));
            } else if (state === QuestionState.AnswerRight) {
                this.msgChannel.pushMsg(new Message("QuestionRight", null));
            } else if (state === QuestionState.AnswerError) {
                this.msgChannel.pushMsg(new Message("QuestionError", null));
            }
        }
    }


    private addAnswer(data) {
        let answer = MyObjectFactory.createMyObject();
        answer.init();

        answer.createBehavior("Answer", AnswerBehavior, data);

        this.answerList.push(answer);
    }

    public update () {
        this.root.update();
    }

    private getShowData() : ObjectShowData[] {
        let ret = new Array();

        // 先插入 Question
        ret.push(this.root.getShowData());

        // 再插入 Answer
        for (let i = 0; i < this.answerList.length; i++) {
            ret.push(this.answerList[i].getShowData());
        }

        return ret;
    }
}