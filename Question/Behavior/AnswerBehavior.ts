import BaseBehavior from "../../Common/Behavior/BaseBehavior";

export default class AnswerBehavior extends BaseBehavior {
    private data: any;

    public Init(data) {
        super.Init(data);
        this.data = data;
    }
}