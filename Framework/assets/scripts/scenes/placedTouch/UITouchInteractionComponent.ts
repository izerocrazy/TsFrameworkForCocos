// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Main from "../../Main";
import UIPlacedComponent from "./UIPlacedComponent";

const {ccclass, property} = cc._decorator;

/**
* 操作状态
*/
export const enum InteractionState {
    Min = 0,
    WaitTouch,
    TouchMoving,
    EndTouch,
    Max
};

@ccclass
export default class UItouchInteractionComponent extends cc.Component {
    /**
     * 系列回调
     */
    target: cc.Component = null;
    onTouchStart: Function = null;
    onTouchMove: Function = null;
    onTouchEnd: Function = null;
    onTouchCancel: Function = null;

    /**
     * 交互状态
     */
    interactionState : InteractionState = InteractionState.WaitTouch;

    /**
     * 上一个
     */
    currentPlaced: UIPlacedComponent;

    /**
     * 当前临近
     */
    currentNearbyPlaced: UIPlacedComponent;

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
    }

    start () {
        this.interactionState = InteractionState.WaitTouch;

        // 如果没有，就设置为默认
        if (this.target === null || this.target === undefined) {
            this.target = this;

            this.onTouchStart = this.onTouchStartDefault;
            this.onTouchEnd = this.onTouchEndDefault;
            this.onTouchMove = this.onTouchMoveDefault;
            this.onTouchCancel = this.onTouchCancelDefault;
        }

        this.setAllCallback();
    }

    /**
     * 设置消息回调
     */
    setAllCallback () {
        this.node.on(cc.Node.EventType.MOUSE_DOWN, function (event) {
            console.log('Mouse down');
          }, this);

        this.node.on(cc.Node.EventType.TOUCH_START, function (event) {
            console.log ('touch start');
            Main.Assert(this.interactionState === InteractionState.WaitTouch, "UITouchInteractionComponent TouchStartFail");
            if (this.target && this.onTouchStart) {
                this.onTouchStart.call(this.target, event);
            }
            this.interactionState = InteractionState.TouchMoving;
        }, this)

        this.node.on(cc.Node.EventType.TOUCH_MOVE, function (event) {
            console.log ('touch move')
            Main.Assert(this.interactionState === InteractionState.TouchMoving, "UITouchInteractionComponent TouchMoveFail");
            if (this.target && this.onTouchMove) {
                this.onTouchMove.call(this.target, event);
            }
        }, this);

        this.node.on(cc.Node.EventType.TOUCH_END, function(event) {
            console.log ('touch end');
            Main.Assert(this.interactionState === InteractionState.TouchMoving, "UITouchInteractionComponent TouchEndFail");
            this.interactionState = InteractionState.EndTouch;
            if (this.target && this.onTouchEnd) {
                this.onTouchEnd.call(this.target, event);
            }
            this.interactionState = InteractionState.WaitTouch;
        }, this);

        this.node.on(cc.Node.EventType.TOUCH_CANCEL, function (event) {
            console.log ('touch cancel');
            Main.Assert(this.interactionState === InteractionState.TouchMoving, "UITouchInteractionComponent TouchCancelFail");
            this.interactionState = InteractionState.EndTouch;
            if (this.target && this.onTouchCancel) {
                this.onTouchCancel.call(this.target, event);
            }
            this.interactionState = InteractionState.WaitTouch;
        }, this);
    }

    // update (dt) {}

    public onTouchStartDefault (event : any) {
        let parent = this.node.parent;
        if (parent === null || parent === undefined) {
            parent = this.node;
        }
        let position = parent.convertToNodeSpaceAR(event.getLocation());
        this.node.position = cc.v3(position);
    }

    public onTouchMoveDefault (event : any) {
        let parent = this.node.parent;
        if (parent === null || parent === undefined) {
            parent = this.node;
        }
        let position = parent.convertToNodeSpaceAR(event.getLocation());
        this.node.position = cc.v3(position);
    }

    public onTouchEndDefault (event : any) {
        if (this.currentNearbyPlaced) {
            this.currentNearbyPlaced.setTouch(this);
        } else {
            this.currentPlaced.setTouch(this);
        }
    }

    public onTouchCancelDefault (event : any) {
        if (this.currentNearbyPlaced) {
            this.currentNearbyPlaced.setTouch(this);
        } else {
            this.currentPlaced.setTouch(this);
        }
    }

    public setNearByPlaced(placed: UIPlacedComponent) {
        this.currentNearbyPlaced = placed;
    }
}
