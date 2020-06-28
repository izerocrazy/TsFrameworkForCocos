import Message from "./Message";

export default class MessageChannel {
    // 使用 bool 对来 callback list 做保护，这样能有效保证 message 之间的耦合性
    private isProcessMsg: boolean;

    private name: string;
    private messageLine: Message[];
    private callbackList: any[];

    constructor(name: string) {
        if (name === null || name === undefined) {
            throw new Error("MessageChannel constructor Fail, name is empty");
        }

        this.name = name;
        this.callbackList = new Array;
        this.isProcessMsg = false;
    }

    public getName () :string {
        return this.name;
    }

    public addListener(callback: any) {
        if (callback === null || callback === undefined) {
            throw new Error ("MessageChannel addListener Fail, this callback is empty");
        }

        if (this.isProcessMsg == true) {
            throw new Error ("MessageChannel addListener Fail, Channel is running");
        }

        if (this.isContainListener(callback)) {
            throw new Error ("MessageChannel addListener Fail, already have this callback");
        }

        this.callbackList.push(callback);
    }

    public isContainListener(callback: any) : boolean {
        let ret = false;

        if (callback === null || callback === undefined) {
            throw new Error ("MessageChannel isContainListener Fail, this callback is empty");
        }

        for (let i = 0; i < this.callbackList.length; i++) {
            if (this.callbackList[i] == callback) {
                ret = true;
                break;
            }
        }
        return ret;
    }

    public getListnerIndex(callback: any) : number {
        let ret = -1;

        if (callback === null || callback === undefined) {
            throw new Error ("MessageChannel isContainListener Fail, this callback is empty");
        }

        for (let i = 0; i < this.callbackList.length; i++) {
            if (this.callbackList[i] == callback) {
                ret = i;
                break;
            }
        }

        return ret;
    }

    public removeListener(callback: any) {
        if (callback === null || callback === undefined) {
            throw new Error ("MessageChannel removeListener Fail, this callback is empty");
        }

        if (this.isProcessMsg == true) {
            throw new Error ("MessageChannel removeListener Fail, Channel is running");
        }

        let index = this.getListnerIndex(callback);
        if (index === -1) {
            throw new Error ("MessageChannel removeListener Fail, already have this callback");
        }

        this.callbackList.splice(index, 1);
    }

    public popMsg () {
        this.isProcessMsg = true;
        let msg = this.messageLine.pop();

        for (let i = 0; i < this.callbackList.length; i++) {
            this.callbackList[i](msg);
        }

        this.isProcessMsg = false;
        return;
    }

    public popAllMsg () {
        if (this.callbackList.length > 0) {
            return;
        }
        
        while (1) {
            if (this.messageLine.length > 0) {
                this.popMsg();
            } else {
                return;
            }
        }
    }

    public pushMsg(msg: Message) {
        if (msg === undefined || msg === null) {
            throw new Error ("MessageChannel pushMsg Fail, msg is empty");
        }

        if (this.messageLine === undefined || this.messageLine === null) {
            throw new Error("MessageChannel pushMsg Fail, msgline is empty");
        }

        this.messageLine.push(msg);
    }
}