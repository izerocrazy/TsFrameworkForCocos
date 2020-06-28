import BaseBehavior from "../../../Common/Behavior/BaseBehavior";

export default abstract class QuestionCheckBehavior extends BaseBehavior {
    public doCheck () : boolean {
        throw new Error("QuestionCheckBehavior doCheck Fail");
    }
}