// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import UItouchInteractionComponent from "./UITouchInteractionComponent";

const {ccclass, property} = cc._decorator;

@ccclass
export default class UIPlacedComponent extends cc.Component {
    initPosition : cc.Vec3;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
        this.initPosition = this.node.position;
    }

    // update (dt) {}
    public setTouch (touch: UItouchInteractionComponent) {
        touch.node.position = this.node.position;
        touch.currentPlaced = this;
    }

    public isNearby (touch : UItouchInteractionComponent) : boolean {
        let node1 = this.node;
        let node2 = touch.node;

        let data = 
            Math.sqrt(Math.pow(node1.position.x - node2.position.x, 2)
            + Math.pow(node1.position.y - node2.position.y, 2));

        console.log (data);
        if (data > 50) {
            return false;
        }

        return true;
    }
}
