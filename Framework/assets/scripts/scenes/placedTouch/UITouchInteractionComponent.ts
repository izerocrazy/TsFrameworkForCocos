// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Main from "../../Main";
import UIPlacedComponent from "./UIPlacedComponent";
import PlacedTouchFactory from "./PlacedTouchFactory";
import EventModule from "../../logic/event/EventModule";

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
export default class UITouchInteractionComponent extends cc.Component {
    /**
     * 系列回调
     */
    callbackTarget: cc.Component = null;
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
        if (this.callbackTarget === null || this.callbackTarget === undefined) {
            this.callbackTarget = this;

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
            if (this.callbackTarget && this.onTouchStart) {
                this.onTouchStart.call(this.callbackTarget, event);
            }
            this.interactionState = InteractionState.TouchMoving;
        }, this)

        this.node.on(cc.Node.EventType.TOUCH_MOVE, function (event) {
            console.log ('touch move', this.callbackTarget, this.onTouchMove);
            Main.Assert(this.interactionState === InteractionState.TouchMoving, "UITouchInteractionComponent TouchMoveFail");
            if (this.callbackTarget && this.onTouchMove) {
                this.onTouchMove.call(this.callbackTarget, event);
            }
        }, this);

        this.node.on(cc.Node.EventType.TOUCH_END, function(event) {
            console.log ('touch end');
            Main.Assert(this.interactionState === InteractionState.TouchMoving, "UITouchInteractionComponent TouchEndFail");
            this.interactionState = InteractionState.EndTouch;
            if (this.callbackTarget && this.onTouchEnd) {
                this.onTouchEnd.call(this.callbackTarget, event);
            }
            this.interactionState = InteractionState.WaitTouch;
        }, this);

        this.node.on(cc.Node.EventType.TOUCH_CANCEL, function (event) {
            console.log ('touch cancel');
            Main.Assert(this.interactionState === InteractionState.TouchMoving, "UITouchInteractionComponent TouchCancelFail");
            this.interactionState = InteractionState.EndTouch;
            if (this.callbackTarget && this.onTouchCancel) {
                this.onTouchCancel.call(this.callbackTarget, event);
            }
            this.interactionState = InteractionState.WaitTouch;
        }, this);
    }

    // update (dt) {}

    public onTouchStartDefault (event : any) {
        let module = Main.getInstance().getModule('Event') as EventModule;
        module.dispatchEvent('placedtouch_ui_touch_start', this);

        let parent = this.node.parent;
        if (parent === null || parent === undefined) {
            parent = this.node;
        }
        let position = parent.convertToNodeSpaceAR(event.getLocation());
        this.node.position = cc.v3(position);
    }

    public onTouchMoveDefault (event : any) {
        console.log ("onTouchMoveDefault")
        let module = Main.getInstance().getModule('Event') as EventModule;
        module.dispatchEvent('placedtouch_ui_touch_move', this);

        let parent = this.node.parent;
        if (parent === null || parent === undefined) {
            parent = this.node;
        }
        let position = parent.convertToNodeSpaceAR(event.getLocation());
        this.node.position = cc.v3(position);
    }

    public onTouchEndDefault (event : any) {
        let module = Main.getInstance().getModule('Event') as EventModule;
        module.dispatchEvent('placedtouch_ui_touch_end', this);
    }

    public onTouchCancelDefault (event : any) {
        this.onTouchEndDefault(event);
    }

    public setNearByPlaced(placed: UIPlacedComponent) {
        this.currentNearbyPlaced = placed;
    }
}
