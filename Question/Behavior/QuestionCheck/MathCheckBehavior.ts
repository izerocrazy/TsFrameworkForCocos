import BaseBehavior from "../../../Common/Behavior/BaseBehavior";
import QuestionCheckBehavior from "./QuestionCheckBehavior";

export default class MathCheckBehavior extends QuestionCheckBehavior {
    private Formula: string;

    public Init (data: any) {
        super.Init(data);

        this.Formula = data;
    }
}