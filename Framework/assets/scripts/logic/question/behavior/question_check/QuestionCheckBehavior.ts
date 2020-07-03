import BaseBehavior from "../../../../common/behavior/BaseBehavior";
import QuestionBehavior from "../QuestionBehavior";

export default abstract class QuestionCheckBehavior extends BaseBehavior {
    public doCheck (question: QuestionBehavior) : boolean {
        throw new Error("QuestionCheckBehavior doCheck Fail");
    }

    public isCanCheck (question: QuestionBehavior) : boolean {
        throw new Error("QuestionCheckBehavior isCanCheck Fail");
    }
}