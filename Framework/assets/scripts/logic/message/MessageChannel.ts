import Message from "./Message";
import Main from "../../Main";

/**
 * 在 MessageModule 中，用来做 Message 分流的对象
 * 1. 所有的 message 都保存在 messageLine 之中，并且 popAllMsg 之中一次清理干净
 * 2. isPorcessMsg 用来确保处理 msg 的过程之中，不会新增 msg，确保耦合性佳
 * 3. callbackList 也就是消息被分发到具体的函数对象之中，要注意它的删除不能是立即的（否则分发会有问题）
 */
export default class MessageChannel {
    // 使用 bool 对来 msg list 做保护，这样能有效保证 message 之间的耦合性
    private isProcessMsg: boolean;

    // 名称
    private name: string;

    // 当前 channel 中的 msg list
    private messageLine: Message[];

    // 监听 channel 的 callback
    private callbackList: any[];

    // 等待被移除的 callback
    private removeCallbackIndexList: number[];

    /**
     * 初始化
     * @param name 当前 Channel 的名称
     */
    constructor(name: string) {
        Main.AssertNotEmpty(name,"MessageChannel constructor Fail, name is empty");

        this.name = name;
        this.messageLine = new Array;
        this.callbackList = new Array;
        this.removeCallbackIndexList = new Array;
        this.isProcessMsg = false;
    }

    /**
     * 当前 channel 名称
     */
    public getName () :string {
        return this.name;
    }

    /**
     * 弹出一个消息，callback list 都响应这个 msg
     * 注意，如果响应的逻辑中，是不能够有新加 msg 的操作
     * 处理完 msg 之后，就要将 removed listener 清理干净
     */
    public popMsg () {
        this.isProcessMsg = true;
        let msg = this.messageLine.pop();

        // copy 当前的 callback list
        let copyList = new Array();
        for (let i = 0; i < this.callbackList.length; i++) {
            copyList.push(this.callbackList[i]);
        }

        for (let j = 0; j < copyList.length; j++) {
            // 未移除的 Lister 可以响应
            if (this.isListenerRemoved(j) === false) {
                copyList[j](msg);
            }
        }

        // 清理掉 removed listener
        if (this.removeCallbackIndexList.length > 0) {
            this.removeCallbackIndexList.reverse();
            for (let i = 0; i < this.removeCallbackIndexList.length; i++) {
                this.callbackList.splice(this.removeCallbackIndexList[i], 1);
            }
            this.removeCallbackIndexList = [];
        }
        copyList = [];

        this.isProcessMsg = false;
        return;
    }

    /**
     * 弹出所有的消息，依次响应
     */
    public popAllMsg () {
        if (this.callbackList.length <= 0) {
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

    /**
     * 是否是已经删除的 Listener
     * @param index Listen 的 index
     */
    public isListenerRemoved(index : number) : boolean {
        let ret = false;

        Main.Assert(index >= 0 && index < this.callbackList.length, "MessageChannel isListenerRemoved Fail, callback is empty");
        for (let i = 0; i < this.removeCallbackIndexList.length; i++) {
            if (this.removeCallbackIndexList[i] === index) {
                ret = true;
                break;
            }
        }

        return ret;
    }

    /**
     * 是否包含某个监听对象
     * @param callback 监听对象
     */
    public isContainListener(callback: any) : boolean {
        let ret = false;

        Main.AssertNotEmpty(callback, "MessageChannel isContainListener Fail, this callback is empty");

        for (let i = 0; i < this.callbackList.length; i++) {
            if (this.callbackList[i] == callback && this.isListenerRemoved(i) === false) {
                ret = true;
                break;
            }
        }
        return ret;
    }

    /**
     * 得到 Listener 在当前 list 中的 index
     * @param callback Listener
     */
    public getListenerIndex(callback: any) : number {
        let ret = -1;

        if (callback === null || callback === undefined) {
            throw new Error ("MessageChannel isContainListener Fail, this callback is empty");
        }

        for (let i = 0; i < this.callbackList.length; i++) {
            if (this.callbackList[i] == callback && this.isListenerRemoved(i) === false) {
                ret = i;
                break;
            }
        }

        return ret;
    }

    /**
     * 添加一个新的 Listener
     * 添加和删除不同，可以直接添加：
     * 不影响消息的分发（删除的话，会导致当前 msg 分发有问题）
     * 并且一插入就开始响应新的消息
     * @param callback 新的 Listener
     */
    public addListener(callback: any) {
        Main.AssertNotEmpty(callback,"MessageChannel addListener Fail, this callback is empty");
        Main.Assert(this.isContainListener(callback) === false,"MessageChannel addListener Fail, already have this callback");

        this.callbackList.push(callback);
    }

    /**
     * 移除一个 Listener
     * @param callback Listener
     */
    public removeListener(callback: any) {
        Main.AssertNotEmpty(callback, "MessageChannel removeListener Fail, this callback is empty");

        let index = this.getListenerIndex(callback);
        Main.Assert(index !== -1, "MessageChannel removeListener Fail, already have this callback");

        this.removeCallbackIndexList.push(index);
    }

    /**
     * 加入一个 Msg
     * @param msg 消息
     */
    public pushMsg(msg: Message) {
        Main.AssertNotEmpty(msg, "MessageChannel pushMsg Fail, msg is empty");
        Main.Assert(this.isProcessMsg === false,"MessageChannel pushMsg Fail, Channel is running");
        Main.AssertNotEmpty(this.messageLine, "MessageChannel pushMsg Fail, msgline is empty");

        this.messageLine.push(msg);
    }
}
