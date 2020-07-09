import Main from "../../Main";
import { IUIPlacedComponent } from "./IUIPlacedComponet";
import { IUITouchInteractionComponent } from "./IUITouchInteractionComponent";
import { UIBaseTouchInteractionComponent } from "./UIBaseTouchInteractionComponent";

const {ccclass, property} = cc._decorator;

@ccclass
export class UIBasePlacedComponent extends cc.Component implements IUIPlacedComponent{
    nearbyLenght : number = 50;

    onLoad() {
        this.nearbyLenght = 50;
    }

    /**
     * 移除一个 Toucher
     * 派生类主动实现该函数，根据实际情况响应移除操作，比如说排版
     * @param toucher 触摸对象
     */
    public removeToucher (toucher: IUITouchInteractionComponent) {
        Main.Error("UIBasePlacedComponet removeToucher Fail, please overwrite");
    }

    /**
     * 添加一个 Toucher
     * 派生类主动实现该函数，根据实际情况响应添加操作，比如说排版
     * @param toucher 触摸对象
     */
    public addToucher (toucher: IUITouchInteractionComponent) {
        Main.Error("UIBasePlacedComponet addToucher Fail, please overwrite");
    }

    /**
     * 是否可添加一个 Toucher
     * 派生类主动实现该函数，根据实际情况响应添加操作，比如说 Toucher 和 Placed 之间有属性对应
     * @param toucher 触摸对象
     */
    public isCanAddToucher (toucher: IUITouchInteractionComponent) {
        Main.Error("UIBasePlacedComponet isCanAddToucher Fail, please overwrite");
    }

    public isToucherNearby (toucher : IUITouchInteractionComponent) : boolean {
        let position1 = this.getWorldSpacePosition(this.node);
        let node = (toucher as UIBaseTouchInteractionComponent).node;
        let position2 = this.getWorldSpacePosition(node);

        let data = 
            Math.sqrt(Math.pow(position1.x - position2.x, 2)
            + Math.pow(position1.y - position2.y, 2));

        if (data > this.nearbyLenght) {
            return false;
        }

        return true;
    }

    /**
     * 找到节点的世界坐标
     * @param node 节点
     */
    private getWorldSpacePosition (node: cc.Node) : cc.Vec3 {
        let parent = node.getParent();
        if (parent === null || parent === undefined) {
            parent = node;
        }
        let position1 = parent.convertToWorldSpaceAR(node.position);
        return position1;
    }
}
