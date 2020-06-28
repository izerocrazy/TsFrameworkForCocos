import BaseBehavior from "../../../../common/behavior/BaseBehavior";
import QuestionCheckBehavior from "./QuestionCheckBehavior";

export default class One2OneCheckBehavior extends QuestionCheckBehavior {
    private answerData: any;

    public Init(data) {
        super.Init(data);

        this.answerData = data;
    }
}