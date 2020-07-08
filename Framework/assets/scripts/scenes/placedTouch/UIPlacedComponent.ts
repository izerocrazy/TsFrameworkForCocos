// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import UITouchInteractionComponent from "./UITouchInteractionComponent";

const {ccclass, property} = cc._decorator;

@ccclass
export default class UIPlacedComponent extends cc.Component {
    placedTouchNode: UITouchInteractionComponent = null;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
    }

    // update (dt) {}

    public clearTouchNode () {
        console.error('clearTouchNode', this.node.name)
        this.placedTouchNode = null;
    }

    public setTouchNode (touch: UITouchInteractionComponent) {
        touch.currentPlaced = this;
        touch.node.setParent(this.node);
        this.placedTouchNode = touch;
        console.error('setTouchNode', this.node.name);

        // todo: 排版规则
        // touch.node.position = this.node.position;
        touch.node.position = cc.v3(0);
    }

    private getWorldSpacePosition (node: cc.Node) : cc.Vec3 {
        let parent = node.getParent();
        if (parent === null || parent === undefined) {
            parent = node;
        }
        let position1 = parent.convertToWorldSpaceAR(node.position);
        return position1;
    }

    public isNearby (touch : UITouchInteractionComponent) : boolean {
        let position1 = this.getWorldSpacePosition(this.node);
        let position2 = this.getWorldSpacePosition(touch.node);

        let data = 
            Math.sqrt(Math.pow(position1.x - position2.x, 2)
            + Math.pow(position1.y - position2.y, 2));

        if (data > 50) {
            return false;
        }

        return true;
    }
}
