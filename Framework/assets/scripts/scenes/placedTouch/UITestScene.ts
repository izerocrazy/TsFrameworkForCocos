// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import UITouchInteractionComponent from "./UITouchInteractionComponent";
import UIPlacedComponent from "./UIPlacedComponent";
import PlacedTouchFactory from "./PlacedTouchFactory";
import Main from "../../Main";
import BaseScene from "../BaseScene";

const {ccclass, property} = cc._decorator;

@ccclass
export default class UITestScene extends BaseScene {
    @property(cc.Prefab)
    placedPrefab: cc.Prefab = null;

    @property(cc.Prefab)
    touchPrefab: cc.Prefab = null;

    @property(cc.Node)
    root : cc.Node = null;

    touchList : UITouchInteractionComponent[] = [];
    placedList: UIPlacedComponent[] = [];

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
        super.start();

        let posList = [cc.v2(-10, -100), cc.v2(20, -200), cc.v2(-30, 300)];

        // 初始化
        PlacedTouchFactory.getInstance().init(this.root);

        for (let i = 0; i < 3; i++) {
            let place = PlacedTouchFactory.getInstance().createPlacedWithPrefab(this.placedPrefab);
            this.root.addChild(place);
            this.placedList.push(place.getComponent(UIPlacedComponent));
            place.position = cc.v3(posList[i]);
        }

        for (let i = 0; i < 1; i++) {
            let touch = PlacedTouchFactory.getInstance().createTouchWithPrefab(this.touchPrefab);
            this.root.addChild(touch);
            this.touchList.push(touch.getComponent(UITouchInteractionComponent));
            this.placedList[i].addToucher(this.touchList[i]);
        }
    }

    update (dt) {
        super.update(dt);
    }
}
