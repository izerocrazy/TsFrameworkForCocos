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
    callbackTarget: cc.Component = null;
    fnTouchStart: Function = null;
    fnTouchMove: Function = null;
    fnTouchEnd: Function = null;
    fnTouchCancel: Function = null;

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
        this.interactionState = InteractionState.WaitTouch;

        // 如果没有，就设置为默认
        this.callbackTarget = this;

        this.fnTouchStart = this.onTouchStart;
        this.fnTouchEnd = this.onTouchEnd;
        this.fnTouchMove = this.onTouchMove;
        this.fnTouchCancel = this.onTouchCancel;

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

    public setNearByPlaced(placed: IUIPlacedComponent) {
        this.currentNearbyPlaced = placed;
    }

    public onTouchStart (event: any) {
        Main.Error("UIBaseTouchInteractionComponent onTouchStart Fail, please overwrite");
    }

    public onTouchMove (event: any) {
        Main.Error("UIBaseTouchInteractionComponent onTouchMove Fail, please overwrite");
    }
    
    public onTouchEnd (event: any) {
        Main.Error("UIBaseTouchInteractionComponent onTouchEnd Fail, please overwrite");
    }

    public onTouchCancel (event: any) {
        Main.Error("UIBaseTouchInteractionComponent onTouchCancel Fail, please overwrite");
    }
}
