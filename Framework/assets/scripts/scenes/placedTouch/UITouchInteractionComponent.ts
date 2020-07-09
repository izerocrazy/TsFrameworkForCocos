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
}
