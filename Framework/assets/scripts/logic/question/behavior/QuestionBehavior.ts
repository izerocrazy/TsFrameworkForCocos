import MyObject from "../../../common/MyObject";
import IBehavior from "../../../common/Behavior/IBehavior";
import QuestionCheckBehavior from "./question_check/QuestionCheckBehavior";
import One2OneCheckBehavior from "./question_check/One2OneCheckBehavior";

export const enum QuestionState {
    Min = 0,
    WaitAnswer,
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

export default class QuestionBehavior extends MyObject implements IBehavior {
    name: string = null;
    state: QuestionState = QuestionState.WaitAnswer;
    checkBehavior: QuestionCheckBehavior;

    public Init(data) {
        if (data === null || data === undefined) {
            throw new Error ("QuestionBehavior Init Fail, data is empty");
        }
        
        if (data.type === null || data.type === undefined
            || data.data === null || data.data === undefined
            || data.name === null || data.name === undefined) {
                throw new Error ("QuestionBehavior Init Fail, data is error" + JSON.stringify(data));
            }
        
        this.name = data.name;
        this.SetValue(data.type, data.data);
    }

    public Uninit() {

    }

    public Update() {

    }

    public getName() {
        return this.name;
    }

    private SetValue(type: QuestionType, data: any = null) {
        switch (type) {
            case QuestionType.One2One:
                {
                    this.checkBehavior = this.CreateBehavior("CheckBehavior", One2OneCheckBehavior, data);
                }
                break;
            default:
                break;
        }
    }
}