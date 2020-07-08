import Main from "../../Main";
import UITouchInteractionComponent, { InteractionState } from "./UITouchInteractionComponent";
import UIPlacedComponent from "./UIPlacedComponent";

export default class PlacedTouchFactory {
    /**
     * 单例实现
     */
    private static _instance: PlacedTouchFactory = new PlacedTouchFactory();

    /**
     * 可以触摸的对象
     */
    touchList : UITouchInteractionComponent[] = [];

    /**
     * 可以放置的对象
     */
    placedList: UIPlacedComponent[] = [];

    /**
     * 初始化，保证单例
     */
    constructor() {
        Main.AssertEmpty(PlacedTouchFactory._instance, "Error: PlacedTouchFactory Instantiation failed: Use PlacedTouchFactory.getInstance()");

        PlacedTouchFactory._instance = this;
    }

    /**
     * 获取到单例
     */
    public static getInstance():PlacedTouchFactory
    {
        return PlacedTouchFactory._instance;
    }

    /**
     * 清空
     */
    public clear() {
        this.touchList = [];
        this.placedList = [];
    }

    /**
     * 新加一个 touch 预制
     * @param prefab 新建的预制
     */
    public createTouchWithPrefab (prefab: cc.Prefab) : cc.Node {
        let ret = cc.instantiate(prefab);
        if (
          ret.getComponent(UITouchInteractionComponent) === null ||
          ret.getComponent(UITouchInteractionComponent) === undefined
        ) {
          this.addTouchToNode(ret);
        } else {
            this.touchList.push(ret.getComponent(UITouchInteractionComponent));
        }

        return ret;
    }

    /**
     * 新加一个 Placed 预制
     * @param prefab 新建的预制
     */
    public createPlacedWithPrefab (prefab: cc.Prefab) : cc.Node {
        let ret = cc.instantiate(prefab);

        if (
            ret.getComponent(UIPlacedComponent) === null ||
            ret.getComponent(UIPlacedComponent) === undefined
        ) {
            this.addPlacedToNode(ret);
        } else {
            this.placedList.push(ret.getComponent(UIPlacedComponent));
        }

        return ret;
    }

    /**
     * 给 Node 新加一个 Touch
     * @param node 需要新增 component 的 Node
     */
    public addTouchToNode (node: cc.Node) {
        let comp = node.addComponent(UITouchInteractionComponent);
        this.touchList.push(comp);
    }

    /**
     * 给 Node 新加一个 Placed
     * @param node 需要新增 component 的 Node
     */
    public addPlacedToNode (node: cc.Node) {
        let comp = node.addComponent(UIPlacedComponent);
        this.placedList.push(comp);
    }

    public update() {
        for (let i = 0; i < this.touchList.length; i++) {
            let touch = this.touchList[i];

            if (touch.interactionState === InteractionState.TouchMoving) {
                let nearby = null;

                // 找到 Place
                for (let j = 0; j < this.placedList.length; j++) {
                    if (this.placedList[j].isNearby(touch)) {
                        nearby = this.placedList[j];
                        break;
                    }
                }

                if (nearby !== null) {
                    console.log ('set new nearby');
                    touch.setNearByPlaced(nearby);
                } else {
                    console.log ('nearby is empty');
                    touch.setNearByPlaced(null);
                }
            }
        }
    }
}