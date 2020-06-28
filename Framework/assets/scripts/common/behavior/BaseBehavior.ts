import IBehavior from "./IBehavior";

export default abstract class BaseBehavior implements IBehavior{
    public Init(data) {
        // throw new Error("BaseBehavior Init Fail");
    }

    public Uninit() {
        // throw new Error("BaseBehavior Uninit Fail");
    }

    public Update() {
        // throw new Error("BaseBehavior Update Fail");
    }
}