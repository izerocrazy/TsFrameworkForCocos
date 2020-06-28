import BaseModule from "../../common/BaseModule";
import MessageChannel from "./MessageChannel";
import Message from "./Message";

export default class MessageModule extends BaseModule {
    private channels: MessageChannel[];
    private isProcessMsg: boolean;
    
    constructor () {
        super();
        this.channels = new Array();
        this.isProcessMsg = false;
    }

    public update() {
        this.isProcessMsg = true;

        for (let i = 0; i < this.channels.length; i++) {
            this.channels[i].popAllMsg();
        }

        this.isProcessMsg = false;
    }

    public isContainChannel (name:string) : boolean {
        let ret = false;

        if (name === undefined || name === null || name === "") {
            throw new Error("MessageModule isContainChannel Fail, the name is empty");
        }

        for (let i = 0; i < this.channels.length; i ++) {
            if (this.channels[i].getName() === name) {
                ret = true;
                break;
            }
        }

        return ret;
    }

    public getChannel (name: string) : MessageChannel {
        let ret = null;

        if (name === undefined || name === null || name === "") {
            throw new Error("MessageModule getChannel Fail, the name is empty");
        }

        for (let i = 0; i < this.channels.length; i ++) {
            if (this.channels[i].getName() === name) {
                ret = this.channels[i];
                break;
            }
        }
        return ret;
    }

    public createChannel(name:string): MessageChannel {
        if (name === undefined || name === null || name === "") {
            throw new Error("MessageModule createChannel Fail, the name is empty");
        }

        if (this.isProcessMsg === true) {
            throw new Error("MessageModule createChannel Fail, is process msg ing");
        }

        if (this.isContainChannel(name)) {
            throw new Error ("MessageModule createChannel Fail, already have this channel name is " + name);
        }

        let channel = new MessageChannel(name);
        this.channels.push(channel);

        return channel;
    }

    public removeChannel (name: string) {
        if (name === undefined || name === null || name === "") {
            throw new Error("MessageModule removeChannel Fail, the name is empty");
        }

        if (this.isProcessMsg === true) {
            throw new Error("MessageModule removeChannel Fail, is process msg ing");
        }

        if (this.isContainChannel(name) === false) {
            throw new Error("MessageModule removeChannel Fail, don't have this channel name is "+ name);
        }

        for (let i = 0; i < this.channels.length; i ++) {
            if (this.channels[i].getName() === name) {
                this.channels.splice(i, 1);
                break;
            }
        }
    }

    public addMessage (channelName, msgName, msgData) {
        if (channelName === undefined || channelName === null || channelName === "") {
            throw new Error ("MessageModule addMessage Fail, channel name is empty");
        }

        if (msgName === undefined || msgName === null || msgName === "") {
            throw new Error("MessageModue addMessage Fail, msg name is empty");
        }

        let channel = this.getChannel(channelName);
        if (channel === null || channel === undefined) {
            throw new Error ("MessageModule addMessage Fail, channel is null, name is " + channelName);
        }

        channel.pushMsg(new Message(msgName, msgData));
    }
}