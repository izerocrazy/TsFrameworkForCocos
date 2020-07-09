// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { UIBasePlacedComponent } from "./UIBasePlacedComponent";
import { IUITouchInteractionComponent } from "./IUITouchInteractionComponent";
import { UIBaseTouchInteractionComponent } from "./UIBaseTouchInteractionComponent";
import Main from "../../Main";
import EventModule from "../../logic/event/EventModule";

const {ccclass, property} = cc._decorator;

@ccclass
export default class UIPlacedComponent extends UIBasePlacedComponent {
    placedTouch: IUITouchInteractionComponent = null;

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        super.onLoad();
    }

    start () {
    }

    // update (dt) {}

    public removeToucher (touch: IUITouchInteractionComponent) {
        Main.Assert(this.placedTouch === touch, "UIPlacedComponent removeToucher fail, touch is error");

        super.removeToucher (touch);

        this.placedTouch = null;
    }

    public addToucher (toucher: IUITouchInteractionComponent) {
        (toucher as UIBaseTouchInteractionComponent).currentPlaced = this;
        this.placedTouch = toucher;

        // todo: 排版规则
        // touch.node.position = this.node.position;
        let node = (toucher as UIBaseTouchInteractionComponent).node;
        node.position = cc.v3(0);
        node.setParent(this.node);

        super.addToucher(toucher);
    }

    public isCanAddToucher () : boolean {
        let ret = false;
        ret = this.placedTouch === null || this.placedTouch === undefined;
        return ret;
    }
}
