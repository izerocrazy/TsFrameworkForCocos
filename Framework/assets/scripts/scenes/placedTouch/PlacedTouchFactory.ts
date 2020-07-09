import Main from "../../Main";
import EventModule from "../../logic/event/EventModule";
import { IUITouchInteractionComponent } from "./IUITouchInteractionComponent";
import { IUIPlacedComponent } from "./IUIPlacedComponet";
import { InteractionState, UIBaseTouchInteractionComponent } from "./UIBaseTouchInteractionComponent";
import { UIBasePlacedComponent } from "./UIBasePlacedComponent";

export default class PlacedTouchFactory {
    /**
     * 单例实现
     */
    private static _instance: PlacedTouchFactory = new PlacedTouchFactory();

    /**
     * 可以触摸的对象
     */
    touchList : IUITouchInteractionComponent[] = [];

    /**
     * 可以放置的对象
     */
    placedList: IUIPlacedComponent[] = [];

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
    }

    /**
     * 新加一个 touch 预制
     * @param prefab 新建的预制
     */
    public createTouchWithPrefab (prefab: cc.Prefab, toucherType: new() => UIBaseTouchInteractionComponent) : cc.Node {
        let ret = cc.instantiate(prefab);
        if (
          ret.getComponent(toucherType) === null ||
          ret.getComponent(toucherType) === undefined
        ) {
          this.addTouchToNode(ret, toucherType);
        } else {
            this.touchList.push(ret.getComponent(toucherType));
        }

        return ret;
    }

    /**
     * 新加一个 Placed 预制
     * @param prefab 新建的预制
     */
    public createPlacedWithPrefab (prefab: cc.Prefab, placedType: new() => UIBasePlacedComponent) : cc.Node {
        let ret = cc.instantiate(prefab);

        if (
            ret.getComponent(placedType) === null ||
            ret.getComponent(placedType) === undefined
        ) {
            this.addPlacedToNode(ret, placedType);
        } else {
            this.placedList.push(ret.getComponent(placedType));
        }

        return ret;
    }

    /**
     * 给 Node 新加一个 Touch
     * @param node 需要新增 component 的 Node
     */
    public addTouchToNode (node: cc.Node, toucherType : new() => UIBaseTouchInteractionComponent) : UIBaseTouchInteractionComponent {
        let comp = node.addComponent(toucherType);
        comp.addTouchCancelCallback(Main.getCallbackWithThis(this.onTouchEndEvent, this));
        comp.addTouchStartCallback(Main.getCallbackWithThis(this.onTouchStartEvent, this));
        comp.addTouchMoveCallback(Main.getCallbackWithThis(this.onTouchMoveEvent, this));
        comp.addTouchEndCallback(Main.getCallbackWithThis(this.onTouchEndEvent, this));

        this.touchList.push(comp);

        return comp;
    }

    /**
     * 给 Node 新加一个 Placed
     * @param node 需要新增 component 的 Node
     */
    public addPlacedToNode (node: cc.Node, placedType: new() => UIBasePlacedComponent) : UIBasePlacedComponent {
        let comp = node.addComponent(placedType);

        this.placedList.push(comp);

        return comp;
    }

    /**
     * 响应触摸移动的算法：拖动的对象，找到可以放置的对象
     * @param name 
     * @param event 
     */
    public onTouchMoveEvent(comp: UIBaseTouchInteractionComponent, event: any) {
        let touch = comp;
        Main.Assert(touch.interactionState === InteractionState.TouchMoving,
            "PlacedTouchFactory onTouchMoveEvent Fail, state should in moving");

        let nearby = null;

        // 找到 Place
        for (let j = 0; j < this.placedList.length; j++) {
            if (this.placedList[j].isCanAddToucher(touch) === true
                && this.placedList[j].isToucherNearby(touch)) {
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
    public onTouchStartEvent (comp: UIBaseTouchInteractionComponent, event : any) {
        let touch = comp;

        // 离开原容器
        Main.AssertNotEmpty(touch.currentPlaced, "PlacedTouchFactory onTouchStartEvent Fail, this touch should in some placed");
        touch.currentPlaced.removeToucher(touch);

        // 放置在最顶层
        touch.node.setParent(this.rootNode);
        touch.node.zIndex = 100;
    }

    /**
     * 响应触摸结束的算法：拖动的物体放回原位，或者是放置在附近的容器
     * @param name 事件名称
     * @param event 事件参数
     */
    public onTouchEndEvent (comp: UIBaseTouchInteractionComponent, event : any) {
        let touch = comp;
        touch.node.zIndex = 0;

        if (touch.currentNearbyPlaced) {
            // 放在附近的容器之中
            touch.currentNearbyPlaced.addToucher(touch);
        } else {
            // 回到原容器之中
            touch.currentPlaced.addToucher(touch);
        }
    }
}