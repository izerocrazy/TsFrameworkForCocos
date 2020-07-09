// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import UITouchInteractionComponent from "./placedTouch/UITouchInteractionComponent";
import UIPlacedComponent from "./placedTouch/UIPlacedComponent";
import AnswerBehavior from "../logic/question/behavior/AnswerBehavior";

const {ccclass, property} = cc._decorator;

@ccclass
export default class UIAnswer extends cc.Component {
    @property(cc.Label)
    label: cc.Label = null;

    root: cc.Node = null;

    currentPlace: UIPlacedComponent = null;

    data: AnswerBehavior = null;

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
    }

    start () {
    }

    // update (dt) {}

    setInfo (info: string) {
        this.label.string = info;
    }
}
