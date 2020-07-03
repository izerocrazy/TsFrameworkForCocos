import BaseBehavior from "../../../common/behavior/BaseBehavior";

export default class AnswerBehavior extends BaseBehavior {
    private data: any;

    public init(data) {
        super.init(data);
        this.data = data.data;
    }

    public getShowData() : string {
        return JSON.stringify(this.data);
    }

    public getValue() : any {
        return this.data.value;
    }
}