// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import UItouchInteractionComponent, { InteractionState } from "./UITouchInteractionComponent";
import UIPlacedComponent from "./UIPlacedComponent";
import PlacedTouchFactory from "./PlacedTouchFactory";

const {ccclass, property} = cc._decorator;

@ccclass
export default class UITestScene extends cc.Component {
    @property(cc.Prefab)
    placedPrefab: cc.Prefab = null;

    @property(cc.Prefab)
    touchPrefab: cc.Prefab = null;

    @property(cc.Node)
    root : cc.Node = null;

    touchList : UItouchInteractionComponent[] = [];
    placedList: UIPlacedComponent[] = [];

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
        let posList = [cc.v2(-10, -100), cc.v2(20, -200), cc.v2(-30, 300)];

        // 初始化
        PlacedTouchFactory.getInstance().clear();

        for (let i = 0; i < 3; i++) {
            let place = PlacedTouchFactory.getInstance().createPlacedWithPrefab(this.placedPrefab);
            this.root.addChild(place);
            this.placedList.push(place.getComponent(UIPlacedComponent));
            place.position = cc.v3(posList[i]);
        }

        for (let i = 0; i < 1; i++) {
            let touch = PlacedTouchFactory.getInstance().createTouchWithPrefab(this.touchPrefab);
            this.root.addChild(touch);
            this.touchList.push(touch.getComponent(UItouchInteractionComponent));
            this.placedList[i].setTouch(this.touchList[i]);
        }
    }

    update (dt) {
        PlacedTouchFactory.getInstance().update();
    }
}
