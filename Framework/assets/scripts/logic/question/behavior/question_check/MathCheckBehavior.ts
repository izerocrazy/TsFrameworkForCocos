import BaseBehavior from "../../../../common/behavior/BaseBehavior";
import QuestionCheckBehavior from "./QuestionCheckBehavior";

export default class MathCheckBehavior extends QuestionCheckBehavior {
    private Formula: string;

    public init (data: any) {
        super.init(data);

        this.Formula = data;
    }
}