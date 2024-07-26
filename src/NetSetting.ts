/*


网络相关的设置,
TODO WIP


* */

export class NetSetting {
    public static readonly WebSocketUrl: string = 'ws://localhost:5012/ws';
    public static readonly WebSocketProtocol: string = 'Receiver';
    /**
     * 当WebSocket断开连接后,重连的间隔时间毫秒
     */
    public static readonly ReconnectIntervalMs: number = 1000;
}