import Main from "../../Main";
import { IUIPlacedComponent } from "./IUIPlacedComponet";
import { IUITouchInteractionComponent } from "./IUITouchInteractionComponent";
import { UIBaseTouchInteractionComponent } from "./UIBaseTouchInteractionComponent";

const {ccclass, property} = cc._decorator;

@ccclass
export class UIBasePlacedComponent extends cc.Component implements IUIPlacedComponent{
    nearbyLenght : number = 50;
    lstFnSetToucherCallback: Function[] = null;
    lstFnRemoveToucherCallback: Function[] = null;

    onLoad() {
        this.nearbyLenght = 50;
        this.lstFnSetToucherCallback = [];
        this.lstFnRemoveToucherCallback = [];
    }

    public addSetToucherCallback (func: Function) {
        this.lstFnSetToucherCallback.push (func);
    }

    public removeSetToucherCallback (func: Function) {
        for (let i = 0; i < this.lstFnSetToucherCallback.length; i++) {
            if (this.lstFnSetToucherCallback[i] === func) {
                this.lstFnSetToucherCallback.splice(i, 1);
            }
        }
    }

    public addRemoveToucherCallback (func: Function) {
        this.lstFnRemoveToucherCallback.push (func);
    }

    public removeRemoveToucherCallback (func: Function) {
        for (let i = 0; i < this.lstFnRemoveToucherCallback.length; i++) {
            if (this.lstFnRemoveToucherCallback[i] === func) {
                this.lstFnRemoveToucherCallback.splice(i, 1);
            }
        }
    }

    /**
     * 移除一个 Toucher
     * 派生类主动实现该函数，根据实际情况响应移除操作，比如说排版
     * @param toucher 触摸对象
     */
    public removeToucher (toucher: IUITouchInteractionComponent) {
        this.lstFnRemoveToucherCallback.forEach(func=> {
            func (this, toucher);
        });
    }

    /**
     * 添加一个 Toucher
     * 派生类主动实现该函数，根据实际情况响应添加操作，比如说排版
     * @param toucher 触摸对象
     */
    public addToucher (toucher: IUITouchInteractionComponent) {
        this.lstFnSetToucherCallback.forEach(func =>{
            func (this, toucher);
        })
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
