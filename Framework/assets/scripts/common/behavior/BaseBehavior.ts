import IBehavior from "./IBehavior";

export default abstract class BaseBehavior implements IBehavior{
    public name: string;

    public getName(): string {
        return this.name;
    }

    public Init(data) {
        if (data === null || data === undefined) {
            throw new Error ("BaseBehavior Init Fail, data is empty");
        }

        if (data.name === null || data.name === undefined
            || data.data === null || data.data === undefined) {
            throw new Error ("BaseBehavior Init Fail, data.name & data.data is empty");
        }

        this.name = data.name;
    }

    public Uninit() {
        // throw new Error("BaseBehavior Uninit Fail");
    }

    public Update() {
        // throw new Error("BaseBehavior Update Fail");
    }
}