export class BroadcastChannelHelper {

    protected broadcastChannel?: BroadcastChannel;

    public OpenChannel(name: string) {
        this.broadcastChannel = new BroadcastChannel(name);
        return this;
    }

    public CloseChannel() {
        if (this.broadcastChannel) {
            this.broadcastChannel.close();
        }
    }

    protected isMessageFrom(message: ChannelMessage, identifier: string) {
        return !!message.id && message.id.indexOf(identifier) > -1;
    }
}

export class BroadcastChannelPrimaryHelper extends BroadcastChannelHelper {
    public static readonly Identifier: string = "_primary";

    public SendDataWhenSecondaryJoinChannel(data: any) {
        if (this.broadcastChannel) { 
            this.broadcastChannel.onmessage = (event: MessageEvent<ChannelMessage>) => {
                if(this.isMessageFrom(event.data, BroadcastChannelSecondaryHelper.Identifier)) {
                    this.broadcastChannel?.postMessage(new ChannelMessage(BroadcastChannelPrimaryHelper.Identifier, data));
                }
            };
        }
        return this;
    }
}

export class BroadcastChannelSecondaryHelper extends BroadcastChannelHelper {
    public static readonly Identifier: string = "_secondary";

    public JoinChannel() {
        if (this.broadcastChannel) {
            this.broadcastChannel.postMessage(new ChannelMessage(BroadcastChannelSecondaryHelper.Identifier));
        }
        return this;
    }

    public WaitForData<T>(ms: number = 2000): Promise<T> {
        return new Promise<T>((resolve, reject) => {
            setTimeout(() => reject(), ms);
            if (this.broadcastChannel) { 
                this.broadcastChannel.onmessage = (event: MessageEvent<ChannelMessage>) => {
                    if(this.isMessageFrom(event.data, BroadcastChannelPrimaryHelper.Identifier)) {
                        let data: T = <T>event.data.message;
                        if(data) {
                            resolve(data);
                        }
                    }
                };
            } else {
                reject();
            }
        });
    }
}

export class ChannelMessage {
    public id?: string;
    public message?: any;

    constructor(id?: string, message?: any) {
        this.id = id;
        this.message = message;
    }
}