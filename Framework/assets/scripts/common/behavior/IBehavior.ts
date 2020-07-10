import { BehaviorShowData } from "./BaseBehavior";

export default interface IBehavior {
    getName(): string;
    init(data : { name: string, data: any});
    uninit();
    update();
    getBehaviorShowData(): BehaviorShowData;
}
