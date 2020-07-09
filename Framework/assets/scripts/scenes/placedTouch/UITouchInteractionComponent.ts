// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Main from "../../Main";
import EventModule from "../../logic/event/EventModule";
import { UIBaseTouchInteractionComponent } from "./UIBaseTouchInteractionComponent";

const {ccclass, property} = cc._decorator;

@ccclass
export default class UITouchInteractionComponent extends UIBaseTouchInteractionComponent {

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        super.onLoad();
    }

    start () {
    }

    public onTouchStart(event : any) {
        let module = Main.getInstance().getModule('Event') as EventModule;
        module.dispatchEvent('placedtouch_ui_touch_start', this);

        let parent = this.node.parent;
        if (parent === null || parent === undefined) {
            parent = this.node;
        }
        let position = parent.convertToNodeSpaceAR(event.getLocation());
        this.node.position = cc.v3(position);
    }

    public onTouchMove(event : any) {
        let module = Main.getInstance().getModule('Event') as EventModule;
        module.dispatchEvent('placedtouch_ui_touch_move', this);

        let parent = this.node.parent;
        if (parent === null || parent === undefined) {
            parent = this.node;
        }
        let position = parent.convertToNodeSpaceAR(event.getLocation());
        this.node.position = cc.v3(position);
    }

    public onTouchEnd(event : any) {
        let module = Main.getInstance().getModule('Event') as EventModule;
        module.dispatchEvent('placedtouch_ui_touch_end', this);
    }

    public onTouchCancel(event : any) {
        this.onTouchEnd(event);
    }
}
