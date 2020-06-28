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
            if (this.isRemoved(b) == false) {
                b.Update();
            }
        });

        // 移除 Behavior
        if (this.RemoveBehaviors.length > 0) {
            this.RemoveBehaviors.forEach(b => {
                // todo something
            });

            // 彻底清理
            this.RemoveBehaviors = [];
        }
    }

    public CreateBehavior<A extends IBehavior> (name: string, c: new() => A, data: any = null): A {
        if (name === null || name === undefined || name === "") {
            throw new Error ("MyObject CreateBehavior Fail, name is empty");
        }

        let ret = new c();
        ret.Init(data);

        this.Behaviors[name] = ret;

        return ret;
    }

    public isHaveBehavior(b: IBehavior) {
        let ret = false;

        // 如果在移除列表中，那也是算不拥有的
        if (this.isRemoved(b) === false) {
            let a = Array.from(this.Behaviors.values());
            for (let i = 0; i < a.length; i++) {
                if (a[i] == b) {
                    ret = true;
                    break;
                }
            }
        }

        return ret;
    }

    public DeleteBehavior(b: IBehavior) {
        if (this.isRemoved(b)) {
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

    private isRemoved (b: IBehavior) : boolean {
        let ret = false;

        for (let i = 0; i < this.RemoveBehaviors.length; i++) {
            if (this.RemoveBehaviors[i] == b) {
                ret = true;
                break;
            }
        }
        
        return ret;
    }
}