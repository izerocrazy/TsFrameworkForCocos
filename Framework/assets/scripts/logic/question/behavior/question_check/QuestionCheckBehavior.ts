import BaseBehavior from "../../../../common/behavior/BaseBehavior";

export default abstract class QuestionCheckBehavior extends BaseBehavior {
    public doCheck () : boolean {
        throw new Error("QuestionCheckBehavior doCheck Fail");
    }
}