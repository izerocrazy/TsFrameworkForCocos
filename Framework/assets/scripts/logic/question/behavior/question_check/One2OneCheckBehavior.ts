import BaseBehavior from "../../../../common/behavior/BaseBehavior";
import QuestionCheckBehavior from "./QuestionCheckBehavior";
import QuestionBehavior, { QuestionState } from "../QuestionBehavior";
import Main from "../../../../Main";

export default class One2OneCheckBehavior extends QuestionCheckBehavior {
    /**
     * 初始化
     * @param data 初始化数据
     */
    public init(data) {
        super.init(data);
    }

    /**
     * 判断题是否答对
     * @param question 问题
     */
    public doCheck(question: QuestionBehavior) : boolean {
        let ret = false;

        Main.AssertNotEmpty(question, "One2OneCheckBehavior doCheck fail, question is empty");
        Main.Assert(question.state === QuestionState.CanCheckAnswer,
            "One2OneCheckBehavior doCheck fail, state should be CanCheckAnswer:" + question.state);

        let answers = question.answerBehaviors;
        if (answers[0].getValue() === question.data.answerData) {
            ret = true;
        }

        return ret;
    }

    public isCanCheck(question: QuestionBehavior) : boolean {
        let ret = false;

        Main.AssertNotEmpty(question, "One2OneCheckBehavior isCanCheck fail, question is empty");
        Main.Assert(question.state !== QuestionState.AnswerRight && question.state !== QuestionState.AnswerError, 
            "One2OneCheckBehavior isCanCheck fail, question state is error:" + question.state);

        let answers = question.answerBehaviors;
        if (answers.length == 1) {
            ret = true;
        }

        return ret;
    }
}