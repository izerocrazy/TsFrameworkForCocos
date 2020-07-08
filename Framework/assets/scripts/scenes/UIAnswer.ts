// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import UItouchInteractionComponent from "./placedTouch/UITouchInteractionComponent";
import UIPlacedComponent from "./placedTouch/UIPlacedComponent";

const {ccclass, property} = cc._decorator;

@ccclass
export default class UIAnswer extends cc.Component {
    @property(cc.Label)
    label: cc.Label = null;

    root: cc.Node = null;

    currentPlace: UIPlacedComponent = null;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
        this.setTouch();

        this.currentPlace = this.node.parent.getComponent(UIPlacedComponent);
    }

    // update (dt) {}
    setTouch () {
        let component = this.node.getComponent(UItouchInteractionComponent);

        component.target = this;
        component.onTouchStart = this.onTouchStart;
        component.onTouchMove = this.onTouchMove;
        component.onTouchEnd = this.onTouchEnd;
    }

    setInfo (info: string) {
        this.label.string = info;
    }

    onTouchStart(event: any) {
        // 脱离父节点
        this.node.removeFromParent(false);
        this.node.setParent(this.root);
        let position = this.node.parent.convertToNodeSpaceAR(event.getLocation());
        this.node.position = cc.v3(position);
    }

    onTouchMove(event: any) {
        // 移动
        let position = this.node.parent.convertToNodeSpaceAR(event.getLocation());
        this.node.position = cc.v3(position);
    }

    onTouchEnd (event: any) {
        // 半径范围内存在 Place，否则就回到原 Place
        this.node.setParent(this.currentPlace.node);
        this.node.position = cc.v3(0);
    }
}
