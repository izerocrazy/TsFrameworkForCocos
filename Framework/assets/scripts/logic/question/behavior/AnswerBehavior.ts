import BaseBehavior, { BehaviorShowData } from "../../../common/behavior/BaseBehavior";

export default class AnswerBehavior extends BaseBehavior {
    private data: any;

    public init(data) {
        super.init(data);
        this.data = data.data;
    }

    public getBehaviorShowData() : BehaviorShowData {
        let ret = super.getBehaviorShowData();
        // todo: 
        ret.data = this;

        return ret;
    }

    public getValue() : any {
        return this.data.value;
    }
}