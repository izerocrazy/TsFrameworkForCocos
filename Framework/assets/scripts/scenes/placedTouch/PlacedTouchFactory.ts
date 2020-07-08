import Main from "../../Main";
import UITouchInteractionComponent, { InteractionState } from "./UITouchInteractionComponent";
import UIPlacedComponent from "./UIPlacedComponent";
import EventModule from "../../logic/event/EventModule";

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
     * 根结点
     */
    rootNode: cc.Node = null;

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
     * 初始化
     * @param root root 节点
     */
    public init (root: cc.Node) {
        this.clear();
        this.rootNode = root;

        let module = Main.getInstance().getModule('Event') as EventModule;
        module.addEventListener("placedtouch_ui_touch_start", Main.getCallbackWithThis(this.onTouchStartEvent, this));
        module.addEventListener("placedtouch_ui_touch_move", Main.getCallbackWithThis(this.onTouchMoveEvent, this));
        module.addEventListener("placedtouch_ui_touch_end", Main.getCallbackWithThis(this.onTouchEndEvent, this));
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

    /**
     * 响应触摸移动的算法：拖动的对象，找到可以放置的对象
     * @param name 
     * @param event 
     */
    public onTouchMoveEvent(name: string, event: any) {
        let touch = event as UITouchInteractionComponent;
        Main.Assert(touch.interactionState === InteractionState.TouchMoving,
            "PlacedTouchFactory onTouchMoveEvent Fail, state should in moving");

        let nearby = null;

        // 找到 Place
        for (let j = 0; j < this.placedList.length; j++) {
            if (this.placedList[j].placedTouchNode === null 
                && this.placedList[j].isNearby(touch)) {
                console.log ('ontTouchMoveEvent', this.placedList[j].placedTouchNode, this.placedList[j].node.name);
                nearby = this.placedList[j];
                break;
            }
        }

        if (nearby !== null) {
            touch.setNearByPlaced(nearby);
        } else {
            touch.setNearByPlaced(null);
        }
    }

    /**
     * 响应开始触摸的算法：需要把拖动的物体放在最顶层
     * @param name 事件名称
     * @param event 事件参数
     */
    public onTouchStartEvent (name: string, event : any) {
        let touch = event as UITouchInteractionComponent;
        if (touch.currentPlaced) {
            touch.currentPlaced.clearTouchNode();
        }

        touch.node.setParent(this.rootNode);
        touch.node.zIndex = 100;
    }

    /**
     * 响应触摸结束的算法：拖动的物体放回原位，或者是放置在附近的容器
     * @param name 事件名称
     * @param event 事件参数
     */
    public onTouchEndEvent (name: string, event : any) {
        let touch = event as UITouchInteractionComponent;
        touch.node.zIndex = 0;
        if (touch.currentNearbyPlaced) {
            touch.currentNearbyPlaced.setTouchNode(touch);
        } else {
            touch.currentPlaced.setTouchNode(touch);
        }
    }
}