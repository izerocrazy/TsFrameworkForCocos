// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Main from "../Main";
import EventModule from "../logic/event/EventModule";
import { UIBasePlacedComponent } from "./placedTouch/UIBasePlacedComponent";
import { UIBaseTouchInteractionComponent } from "./placedTouch/UIBaseTouchInteractionComponent";
import QuestionBehavior from "../logic/question/behavior/QuestionBehavior";
import UIAnswer from "./UIAnswer";
const {ccclass, property} = cc._decorator;

@ccclass
export default class UIQuestion extends cc.Component {
    @property(cc.Label)
    lable: cc.Label = null

    public data : QuestionBehavior;

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
    }

    start () {
    }

    setInfo (data: string) {
        this.lable.string = data;
    }

    // update (dt) {}

    public onPlacedToucher (placed: UIBasePlacedComponent, toucher: UIBaseTouchInteractionComponent) {
        if (placed.node === this.node) {
            console.log ("UIQuestion getAnswer");

            let q = placed.node.getComponent(UIQuestion).data;
            let a = toucher.node.getComponent(UIAnswer).data;

            // todo: 通过事件
            q.setAnswer(a);
            q.checkAnswer();
            console.log ('answer is', q.state);
        }
    }

    public onPlacedLevelToucher (placed: UIBasePlacedComponent, toucher: UIBaseTouchInteractionComponent) {
        if (placed.node === this.node) {
            console.log ("UIQuestion removeAnswer");

            let q = placed.node.getComponent(UIQuestion).data;
            let a = toucher.node.getComponent(UIAnswer).data;

            // todo: 通过事件
            q.removeAnswer(a);
            console.log ('answer is', q.state);
        }
    }
}
