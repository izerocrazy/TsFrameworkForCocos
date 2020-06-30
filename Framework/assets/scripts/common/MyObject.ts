import Main from "../Main"
import IBehavior from "./behavior/IBehavior";

/**
 * 通用的抽象对象，主要用处是可以添加行为
 */
export default class MyObject {
    // 挂载数据
    data: any;
    // 行为树的雏形
    Behaviors: Map<string, IBehavior>;
    // 移除掉的行为对象
    RemoveBehaviors: IBehavior[];

    /**
     * 初始化
     */
    public init (data = null) {
        this.data = data;
        this.Behaviors = new Map<string, IBehavior>();
        this.RemoveBehaviors = new Array();
    }

    /**
     * 对象 Update
     * 当前实现是更新所有的 Behavior，并且真实移除掉 removed Behavior
     */
    public update() {
        let a = Array.from(this.Behaviors.values());
        for (let i = 0; i < a.length; i++) {
            let b = a[i];

            // 非 remove 的 Behavior.update
            if (this.isRemovedByName(b.getName()) === false) {
                b.update();
            }
        }

        // 移除 Behavior
        if (this.RemoveBehaviors.length > 0) {
            this.RemoveBehaviors.forEach(b => {
                this.Behaviors.delete(b.getName());

                // todo something in behaviors
            });

            // 彻底清理
            this.RemoveBehaviors = [];
        }
    }

    /**
     * 添加一个新的行为
     * 这里有一个特殊，加入的 Behavior 不能和待删除的 Behavior 同名
     * @param name 行为名称
     * @param c 行为对象 XXXBehavior
     * @param data 行为对象的初始化数据
     * @return ret 返回创建好的行为对象
     */
    public createBehavior<A extends IBehavior> (name: string, c: new() => A, data: any = null): A {
        Main.AssertStringNotEmpty(name,"MyObject createBehavior Fail, name is empty");
        Main.Assert(this.isHaveBehavior(name) === false, "MyObject createBehavior Fail, already have this name:" + name);
        Main.Assert(this.isRemovedByName(name) === false, "MyObject createBhavior Fail, this name just be removed:" + name);

        let ret = new c();
        ret.init({name: name, data: data});

        this.Behaviors.set(name, ret);

        return ret;
    }

    /**
     * 是否有当前名的行为
     * @param name 行为名称
     */
    public isHaveBehavior(name: string) {
        let ret = false;

        // 如果在移除列表中，那也是算不拥有的
        if (this.isRemovedByName(name) === false) {
            ret = this.Behaviors.has(name);
        }

        return ret;
    }

    /**
     * 移除某个 behavior
     * @param name 需要被移除的 behavior 的名字
     */
    public deleteBehaviorByName(name: string) {
        Main.AssertStringNotEmpty (name, "MyObject deleteBehaviorByName fail, name is empty");

        let b = this.getBehaviorByName(name);
        Main.AssertNotEmpty(b, "MyObject deleteBehaviorByName Fail, can't get behavior by name:" + name);

        this.deleteBehavior(b);
    }

    /**
     * 移除某个 behavior
     * @param b 需要被移除的 behavior
     */
    public deleteBehavior(b: IBehavior) {
        Main.Assert(this.isRemovedByName(b.getName()) === false, "MyObject RemoveBehavior fail, already removed");

        b.uninit();
        this.RemoveBehaviors.push(b);
    }

    /**
     * 通过名字获取 Behavior
     * @param name Behavior 的名字
     */
    public getBehaviorByName(name: string) {
        let ret = null;

        Main.AssertStringNotEmpty(name, "MyObject getBehaviorByName Fail, name is empty");
        Main.AssertNotEmpty(this.Behaviors, "MyObject getBehaviorByName Fail, behaviors is empty");

        if (this.isRemovedByName(name) === false) {
            ret = this.Behaviors.get(name);
        }

        return ret;
    }

    /**
     * 某个 Behavior 是否被移除
     * @param name Behavior 的名字
     */
    private isRemovedByName (name: string) : boolean {
        let ret = false;

        for (let i = 0; i < this.RemoveBehaviors.length; i++) {
            if (this.RemoveBehaviors[i].getName() == name) {
                ret = true;
                break;
            }
        }

        return ret;
    }
}
