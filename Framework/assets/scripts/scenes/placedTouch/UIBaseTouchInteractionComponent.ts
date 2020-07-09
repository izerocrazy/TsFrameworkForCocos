import { IUIPlacedComponent } from "./IUIPlacedComponet";
import Main from "../../Main";
import { IUITouchInteractionComponent } from "./IUITouchInteractionComponent";

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
export class UIBaseTouchInteractionComponent extends cc.Component implements IUITouchInteractionComponent {
    /**
     * 系列回调
     */
    lstFnTouchStart: Function[] = null;
    lstFnTouchMove: Function[] = null;
    lstFnTouchEnd: Function[] = null;
    lstFnTouchCancel: Function[] = null;

    /**
     * 交互状态
     */
    interactionState : InteractionState = InteractionState.WaitTouch;

    /**
     * 上一个
     */
    currentPlaced: IUIPlacedComponent;

    /**
     * 当前临近
     */
    currentNearbyPlaced: IUIPlacedComponent;

    onLoad () {
        this.lstFnTouchStart = [];
        this.lstFnTouchCancel = [];
        this.lstFnTouchMove = [];
        this.lstFnTouchEnd = [];

        this.interactionState = InteractionState.WaitTouch;

        this.node.on(cc.Node.EventType.MOUSE_DOWN, function (event) {
            // console.log('Mouse down');
          }, this);

        this.node.on(cc.Node.EventType.TOUCH_START, function (event) {
            // console.log ('touch start');
            Main.Assert(this.interactionState === InteractionState.WaitTouch, "UITouchInteractionComponent TouchStartFail");

            this.lstFnTouchStart.forEach(func => {
                func(this, event);
            });
            this.onTouchStart(event);

            this.interactionState = InteractionState.TouchMoving;
        }, this)

        this.node.on(cc.Node.EventType.TOUCH_MOVE, function (event) {
            // console.log ('touch move', this.callbackTarget, this.onTouchMove);
            Main.Assert(this.interactionState === InteractionState.TouchMoving, "UITouchInteractionComponent TouchMoveFail");

            this.lstFnTouchMove.forEach(func => {
                func(this, event);
            });
            this.onTouchMove(event)

        }, this);

        this.node.on(cc.Node.EventType.TOUCH_END, function(event) {
            // console.log ('touch end');
            Main.Assert(this.interactionState === InteractionState.TouchMoving, "UITouchInteractionComponent TouchEndFail");
            this.interactionState = InteractionState.EndTouch;

            this.lstFnTouchEnd.forEach(func => {
                func(this, event);
            });
            this.onTouchEnd(event);
            
            this.interactionState = InteractionState.WaitTouch;
        }, this);

        this.node.on(cc.Node.EventType.TOUCH_CANCEL, function (event) {
            // console.log ('touch cancel');
            Main.Assert(this.interactionState === InteractionState.TouchMoving, "UITouchInteractionComponent TouchCancelFail");
            this.interactionState = InteractionState.EndTouch;

            this.lstFnTouchCancel.forEach(func => {
                func(this, event);
            });
            this.onTouchCancel(event);
            
            this.interactionState = InteractionState.WaitTouch;
        }, this);
    }

    // update (dt) {}

    public setNearByPlaced(placed: IUIPlacedComponent) {
        this.currentNearbyPlaced = placed;
    }

    public onTouchStart (event: any) {
        let parent = this.node.parent;
        if (parent === null || parent === undefined) {
            parent = this.node;
        }
        let position = parent.convertToNodeSpaceAR(event.getLocation());
        this.node.position = cc.v3(position);
    }

    public onTouchMove (event: any) {
        let parent = this.node.parent;
        if (parent === null || parent === undefined) {
            parent = this.node;
        }
        let position = parent.convertToNodeSpaceAR(event.getLocation());
        this.node.position = cc.v3(position);
    }
    
    public onTouchEnd (event: any) {
    }

    public onTouchCancel (event: any) {
    }

    public addTouchStartCallback (func: Function) {
        this.lstFnTouchStart.push(func);
    }

    public addTouchMoveCallback (func: Function) {
        this.lstFnTouchMove.push(func);
    }

    public addTouchEndCallback (func: Function) {
        this.lstFnTouchEnd.push(func);
    }

    public addTouchCancelCallback (func: Function) {
        this.lstFnTouchCancel.push(func);
    }

    public removeTouchStartCallback (func: Function) {
        for (let i = 0; i < this.lstFnTouchStart.length; i++) {
            if (this.lstFnTouchStart[i] === func) {
                this.lstFnTouchCancel.splice(i, 1);
            }
        }
    }

    public removeTouchCancelCallback (func: Function) {
        for (let i = 0; i < this.lstFnTouchCancel.length; i++) {
            if (this.lstFnTouchCancel[i] === func) {
                this.lstFnTouchCancel.splice(i, 1);
            }
        }
    }

    public removeTouchMoveCallback (func: Function) {
        for (let i = 0; i < this.lstFnTouchMove.length; i++) {
            if (this.lstFnTouchMove[i] === func) {
                this.lstFnTouchCancel.splice(i, 1);
            }
        }
    }

    public removeTouchEndCallback (func: Function) {
        for (let i = 0; i < this.lstFnTouchEnd.length; i++) {
            if (this.lstFnTouchEnd[i] === func) {
                this.lstFnTouchCancel.splice(i, 1);
            }
        }
    }
}
