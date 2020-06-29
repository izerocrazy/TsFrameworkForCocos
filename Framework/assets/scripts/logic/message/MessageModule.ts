import BaseModule from "../../common/BaseModule";
import MessageChannel from "./MessageChannel";
import Message from "./Message";

/**
 * 用来在“代码层”之间异步传递消息的 Module：
 * Message 会一直停留在此对象中，直到调用 Update() 处理，当前为了效率，做了 Channel 来分流消息；
 * 另外一个重点，如果在 Update() 中的时候，是不能够添加 Message 和 Channel——为了保证代码层逻辑的不耦合；
 * Channel 通常是上层代码去添加，不应该由 Message 驱动添加，Message 也是同理的
 */
export default class MessageModule extends BaseModule {
    // 所有的 Message Channel
    private channels: MessageChannel[];

    // 是否在处理 Message 的流程中
    // 如果是在处理 Message 的流程中，是不能够添加 Message 的
    private isProcessMsg: boolean;

    /**
     * 初始化数据
     */
    constructor () {
        super();
        this.channels = new Array();
        this.isProcessMsg = false;
    }

    /**
     * Update 逻辑
     * 所有的 Channel 把当前帧的所有 Message 处理一次
     */
    public update() {
        this.isProcessMsg = true;

        for (let i = 0; i < this.channels.length; i++) {
            this.channels[i].popAllMsg();
        }

        this.isProcessMsg = false;
    }

    /**
     * 是否包含 Channel
     * @param name Channel 的名称
     */
    public isContainChannel (name:string) : boolean {
        let ret = false;

        Main.AssertStringNotEmpty(name, "MessageModule isContainChannel Fail, the name is empty");

        for (let i = 0; i < this.channels.length; i ++) {
            if (this.channels[i].getName() === name) {
                ret = true;
                break;
            }
        }

        return ret;
    }

    /**
     * 得到某个 Channel
     * @param name Channel 的名称
     * @return MessageChannel 返回这个 Channel
     */
    public getChannel (name: string) : MessageChannel {
        let ret = null;

        Main.AssertStringNotEmpty(name, "MessageModule getChannel Fail, the name is empty");

        for (let i = 0; i < this.channels.length; i ++) {
            if (this.channels[i].getName() === name) {
                ret = this.channels[i];
                break;
            }
        }
        return ret;
    }

    /**
     * 创建一个 Channel
     * @param name Channel 的名称
     * @return MessageChannel 返回这个 Channel
     */
    public createChannel(name:string): MessageChannel {
        Main.AssertStringNotEmpty(name, "MessageModule createChannel Fail, the name is empty");
        Main.Assert(this.isProcessMsg === false, "MessageModule createChannel Fail, is process msg ing");
        Main.Assert(this.isContainChannel(name) === false,"MessageModule createChannel Fail, already have this channel name is " + name);

        let channel = new MessageChannel(name);
        this.channels.push(channel);

        return channel;
    }

    /**
     * 移除一个 Channel
     * @param name Channel 的名称
     */
    public removeChannel (name: string) {
        Main.AssertStringNotEmpty(name,"MessageModule removeChannel Fail, the name is empty");
        Main.Assert(this.isProcessMsg === false,"MessageModule removeChannel Fail, is process msg ing");
        Main.Assert(this.isContainChannel(name),"MessageModule removeChannel Fail, don't have this channel name is "+ name);

        for (let i = 0; i < this.channels.length; i ++) {
            if (this.channels[i].getName() === name) {
                this.channels.splice(i, 1);
                break;
            }
        }
    }

    /**
     * 增加一个消息到 Channel 之中
     * @param channelName Channel 的名字
     * @param msgName 消息的名字，相当于是 ID
     * @param msgData 消息的信息
     */
    public addMessage (channelName, msgName, msgData) {
        Main.AssertStringNotEmpty(channelName, "MessageModule addMessage Fail, channel name is empty");
        Main.AssertStringNotEmpty(msgName, "MessageModue addMessage Fail, msg name is empty");
        Main.Assert(this.isProcessMsg === false,"MessageModule addMessage Fail, is process msg ing");

        let channel = this.getChannel(channelName);
        Main.AssertNotEmpty(channel, "MessageModule addMessage Fail, channel is null, name is " + channelName);

        channel.pushMsg(new Message(msgName, msgData));
    }
}
