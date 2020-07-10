import MyObject, { MyObjectFactory } from "../../../common/MyObject";
import IBehavior from "../../../common/Behavior/IBehavior";
import QuestionCheckBehavior from "./question_check/QuestionCheckBehavior";
import One2OneCheckBehavior from "./question_check/One2OneCheckBehavior";
import Main from "../../../Main";
import AnswerBehavior from "./AnswerBehavior";
import QuestListCheckBehavior from "./question_check/QuestionListCheckBehavior";
import { BehaviorShowData } from "../../../common/behavior/BaseBehavior";

export const enum QuestionState {
    Min = 0,
    WaitAnswer,
    CanCheckAnswer,
    AnswerRight,
    AnswerError,
    Max
};

export const enum QuestionType {
    Min = 0,
    One2One,
    Math,
    List,
    Max
};

/**
 * 问题的抽象，它即有子 Question，也保存有自己的 Question Check
 */
export default class QuestionBehavior extends MyObject implements IBehavior {
    // 继承自 IBehavior
    name: string = null;

    // 保存数据
    data: {
        // 题类型，这里主要按照判题逻辑来分，而非显示
        type: QuestionType,
        // 展示的题面信息，通常来说就是图/题模版输出的 JSON
        showData: string,
        // 答案信息，暂时未能定义
        answerData: number | string | {},
    } = null;

    // 当前题的状态
    _state: QuestionState = QuestionState.WaitAnswer;
    public get state() {
        return this._state;
    };

    public set state(s:QuestionState) {
        this._state = s;

        this.lstFunOnStateChange.forEach(func=> {
            func(s, this)
        });
    };

    lstFunOnStateChange: Function[] = null;

    // 当前题的判题逻辑
    checkBehavior: QuestionCheckBehavior;

    // 提交给当前题的一组答案，当前用数组可以承载，后续未必
    answerBehaviors: AnswerBehavior[];

    // 当前题的子题
    childQuestion: MyObject[]; 

    /**
     * 初始化
     * @param data 
     */
    public init(data: {name: string, data: {type: QuestionType, showData: string, answerData: any}}) {
        Main.AssertNotEmpty(data, "QuestionBehavior Init Fail, data is empty");
        Main.AssertNotEmpty(data.name, "QuestionBehavior Init Fail, data.name is empty");
        Main.AssertNotEmpty(data.data, "QuestionBehavior Init Fail, data.data is empty");
        Main.AssertNotEmpty(data.data.type, "QuestionBehavior Init Fail, data.data.type is empty");
        Main.AssertNotEmpty(data.data.showData, "QuestionBehavior Init Fail, data.data.showData is empty");
        if (data.data.type === QuestionType.One2One) {
            Main.AssertNotEmpty(data.data.answerData, "QuestionBehavior Init Fail, data.data.answerData is empty");
        }

        super.init(data);
        this.answerBehaviors = new Array();
        this.lstFunOnStateChange = new Array();

        this.name = data.name;
        this.data = data.data;

        switch (this.data.type) {
            case QuestionType.One2One:
                {
                    // todo: 这种纯算法的 Behavior，可以做 fatory 模式
                    this.checkBehavior = this.createBehavior("CheckBehavior", One2OneCheckBehavior, {});
                }
                break;
            case QuestionType.List:
                {
                    this.childQuestion = new Array();
                    this.checkBehavior = this.createBehavior("CheckBehavior", QuestListCheckBehavior, {});
                }
            default:
                break;
        }
    }

    public uninit() {
    }

    public update() {

    }

    public createChildrenQuestion (name: string, data: any) : QuestionBehavior {
        let node = MyObjectFactory.createMyObject();
        let ret = node.createBehavior(name, QuestionBehavior, data);

        this.childQuestion.push(node);

        return ret;
    }

    /**
     * 获取名字
     */
    public getName() : string {
        return this.name;
    }

    /**
     * 得到展示的信息，通常就是一个图模版
     */
    public getBehaviorShowData () : BehaviorShowData {
        console.error ("2");
        let ret = new BehaviorShowData();

        ret.type = this.constructor.name;

        ret.data = {type: null, data: null};

        switch (this.data.type) {
            case QuestionType.One2One:
                {
                    ret.data.type = QuestionType.One2One;
                    // 返回传入的 showData
                    ret.data.data = this;
                }
                break;
            case QuestionType.List:
                {
                    ret.data.type = QuestionType.List;

                    // 返回一组 showData
                    ret.data.data = new Array();
                    this.childQuestion.forEach(node => {
                        let data = node.getShowData();
                        ret.data.data.push(data);
                    });
                }
                break;
            default:
                break;
        }

        return ret;
    }

    /**
     * 当前的 answer 是否已经在问题中
     * @param answerBehavior 答题的 answer
     */
    public isInAnswer(answerBehavior: AnswerBehavior) : boolean {
        let ret = false;

        Main.AssertNotEmpty(answerBehavior, "QuestionBehavior isInAnswer fail, answer is empty");
        Main.AssertNotEmpty(this.answerBehaviors, "QuestionBehavior isInAnswer fail, you should init first");

        for (let i = 0; i < this.answerBehaviors.length; i++) {
            if (answerBehavior === this.answerBehaviors[i]) {
                ret = true;
                break;
            }
        }

        return ret;
    }

    /**
     * 添加一个答案 
     * @param answerBehavior 答题的 answer
     */
    public setAnswer (answerBehavior: AnswerBehavior) {
        console.log ('setAnswer', this.answerBehaviors);
        Main.AssertNotEmpty(answerBehavior, "QuestionBehavior setAnswer fail, answer is empty");
        Main.AssertNotEmpty(this.answerBehaviors, "QuestionBehavior setAnswer fail, you should init first");
        Main.Assert(this.isInAnswer(answerBehavior) === false, "QuestionBehavior setAnswer failed, is alerady in");

        this.answerBehaviors.push(answerBehavior);

        let isCanCheck = this.checkBehavior.isCanCheck(this);
        if (isCanCheck) {
            this.state = QuestionState.CanCheckAnswer;
        }
    }

    /**
     * 移除一个答案
     * @param answerBehavior 答题的 answer
     */
    public removeAnswer (answerBehavior: AnswerBehavior) {
        Main.AssertNotEmpty(answerBehavior, "QuestionBehavior removeAnswer fail, answer is empty");
        Main.AssertNotEmpty(this.answerBehaviors, "QuestionBehavior removeAnswer fail, you should init first");
        Main.Assert(this.isInAnswer(answerBehavior), "QuestionBehavior removeAnswer failed, is alerady in");

        for (let i = 0; i < this.answerBehaviors.length; i++) {
            if (answerBehavior === this.answerBehaviors[i]) {
                this.answerBehaviors.splice(i, 1);
                break;
            }
        }

        this.state = QuestionState.WaitAnswer;
        console.log ("removeAnswer", this.answerBehaviors);

        let isCanCheck = this.checkBehavior.isCanCheck(this);
        if (isCanCheck) {
            this.state = QuestionState.CanCheckAnswer;
        }
    }

    /**
     * 确认 Answer 的对错
     */
    public checkAnswer () {
        Main.Assert(this.state === QuestionState.CanCheckAnswer, "QuestionBehavior checkAnswer failed, state should be CanCheckAnswer");

        let right = this.checkBehavior.doCheck(this);
        if (right) {
            this.state = QuestionState.AnswerRight;
        } else {
            this.state = QuestionState.AnswerError;
        }
    }

    /**
     * 添加状态更新回调
     * @param func 
     */
    public addStateChangeCallback (func: Function) {
        this.lstFunOnStateChange.push(func);
    }

    /**
     * 移除状态更新回调
     * @param func 
     */
    public removeStateChangeCallback (func: Function) {
        for (let i = 0; i < this.lstFunOnStateChange.length; i++) {
            if (this.lstFunOnStateChange[i] === func) {
                this.lstFunOnStateChange.splice(i, 1);
            }
        }
    }
}
