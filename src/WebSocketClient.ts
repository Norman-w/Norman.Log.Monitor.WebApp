class EventListener<T> {
    private listeners: Array<(e: T) => void> = [];

    public add(listener: (e: T) => void): void {
        this.listeners.push(listener);
    }

    public remove(listener: (e: T) => void): void {
        const index = this.listeners.indexOf(listener);
        if (index > -1) {
            this.listeners.splice(index, 1);
        }
    }

    public trigger(event: T): void {
        this.listeners.forEach(listener => listener(event));
    }
}

// 心跳检查器类
class HeartChecker {
    parent: WebsocketClient;
    timeout: number;
    timeoutObj: ReturnType<typeof setTimeout> | null;
    serverTimeoutObj: ReturnType<typeof setTimeout> | null;

    constructor(parent: WebsocketClient, timeout = 60000) { // 默认60秒
        this.parent = parent;
        this.timeout = timeout;
        this.timeoutObj = null;
        this.serverTimeoutObj = null;
    }

    // 重置心跳
    reset(): this {
        if (this.timeoutObj) clearTimeout(this.timeoutObj);
        if (this.serverTimeoutObj) clearTimeout(this.serverTimeoutObj);
        this.timeoutObj = null;
        this.serverTimeoutObj = null;
        return this;
    }

    // 开始心跳
    start(): void {
        this.timeoutObj = setTimeout(() => {
            const heartPack = {
                msg_type: 'heart',
                t: new Date().getTime(),
            };
            if (this.parent.webSocket && this.parent.webSocket.readyState === WebSocket.OPEN) {
                this.parent.webSocket.send(JSON.stringify(heartPack));
            } else {
                console.log('发送心跳任务失败,连接已断开');
                this.onError();
            }
        }, this.timeout);
    }

    // 错误处理
    onError(): void {
        // 错误处理逻辑占位符
    }
}

// WebSocket客户端类
class WebsocketClient {
    private debugMode: boolean;
    public webSocket: WebSocket | undefined;
    private heartChecker: HeartChecker | undefined;
    private disposed: boolean;
    private connectOptions: { url?: string };
    private lockReconnect: boolean;

    public onSocketMessageEvent: EventListener<MessageEvent>;
    public onConnectedEvent: EventListener<Event>;
    public onLostConnectEvent: EventListener<CloseEvent>;
    public onErrorEvent: EventListener<Event | ErrorEvent>;

    constructor() {
        this.debugMode = false;
        this.webSocket = undefined;
        this.heartChecker = undefined;
        this.disposed = false;
        this.connectOptions = {};
        this.lockReconnect = false;

        this.onSocketMessageEvent = new EventListener<MessageEvent>();
        this.onConnectedEvent = new EventListener<Event>();
        this.onLostConnectEvent = new EventListener<CloseEvent>();
        this.onErrorEvent = new EventListener<Event | ErrorEvent>();
    }

    public dispose(): void {
        console.log('WebSocketClient dispose')
        this.disposed = true;
        if (this.heartChecker) {
            this.heartChecker.reset();
            this.heartChecker = undefined;
        }
        if (this.webSocket) {
            this.webSocket.close();
            this.webSocket = undefined;
        }
    }

    public connectSocket(options: { url?: string, protocol?:string } = {}): void {
        if (this.disposed) return;
        if (options.url) {
            this.connectOptions = options;
            try {
                if (!this.heartChecker) {
                    this.heartChecker = new HeartChecker(this);
                    this.heartChecker.onError = () => {
                        this.onLostConnectEvent.trigger(new CloseEvent('heart check failed'));
                    }
                }
                this.webSocket = new WebSocket(options.url, options.protocol?options.protocol:'');
            } catch (err) {
                console.log('连接socket错误,err:', err);
            }
            if (!this.webSocket) {
                console.log('连接socket失败');
                return;
            }
            this.webSocket.onopen = (res) => {
                this.onConnectedEvent.trigger(res);
                this.heartChecker?.start(); // 开始心跳
            };
            this.webSocket.onclose = (res) => {
                console.log('WebSocketClient.onclose', res);
                this.onLostConnectEvent.trigger(res);
                this.heartChecker?.reset(); // 重置心跳
            };
            this.webSocket.onerror = (res) => {
                this.onErrorEvent.trigger(res);
                this.heartChecker?.reset(); // 重置心跳
            };
            this.webSocket.onmessage = (res) => {
                this.onSocketMessageEvent.trigger(res);
                this.heartChecker?.reset(); // 重置心跳
                this.heartChecker?.start(); // 开始心跳
            }
        }
        else {
            console.log('url为空');
        }
    }

    // Other methods remain unchanged...
}

export default WebsocketClient;