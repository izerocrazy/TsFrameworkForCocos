import IBehavior from "./behavior/IBehavior";

export default class MyObject {
    Behaviors: Map<string, IBehavior>;
    RemoveBehaviors: IBehavior[];

    public Init (data = null) {
        this.Behaviors = new Map<string, IBehavior>();
        this.RemoveBehaviors = new Array();
    }

    public Update() {
        // 非 remove 的 Behavior.update
        this.Behaviors.forEach(b => {
            if (this.isRemovedByName(b.getName()) == false) {
                b.Update();
            }
        });

        // 移除 Behavior
        if (this.RemoveBehaviors.length > 0) {
            this.RemoveBehaviors.forEach(b => {
                this.Behaviors[b.getName()] = undefined;

                // todo something in behaviors
            });

            // 彻底清理
            this.RemoveBehaviors = [];
        }
    }

    public CreateBehavior<A extends IBehavior> (name: string, c: new() => A, data: any = null): A {
        if (name === null || name === undefined || name === "") {
            throw new Error ("MyObject CreateBehavior Fail, name is empty");
        }

        if (this.isHaveBehavior(name)) {
            throw new Error("MyObject CreateBehavior Fail, already have this name:" + name);
        }

        let ret = new c();
        ret.Init({name: name, data: data});

        this.Behaviors[name] = ret;

        return ret;
    }

    public isHaveBehavior(name: string) {
        let ret = false;

        // 如果在移除列表中，那也是算不拥有的
        if (this.isRemovedByName(name) === false) {
            let a = Array.from(this.Behaviors.values());
            for (let i = 0; i < a.length; i++) {
                if (a[i].getName() == name) {
                    ret = true;
                    break;
                }
            }
        }

        return ret;
    }

    public DeleteBehavior(b: IBehavior) {
        if (this.isRemovedByName(b.getName())) {
            throw new Error("MyObject RemoveBehavior fail, already removed");
        }

        b.Uninit();
        this.RemoveBehaviors.push(b);
    }

    public GetBehaviorByName(name: string) {
        if (name === null || name === undefined || name === "") {
            throw new Error ("MyObject GetBehaviorByName Fail, name is empty");
        }

        if (this.Behaviors === null || this.Behaviors === undefined) {
            throw new Error ("MyObject GetBehaviorByName Fail, behaviors is empty");
        }

        return this.Behaviors[name];
    }

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