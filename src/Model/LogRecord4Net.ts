/*


一条日志的网络传输用的数据结构


* */

/**
 * 一条日志的网络传输用的数据结构,只有简单的数据类型
 */
export class LogRecord4Net {
    public readonly CreateTime: Date = new Date();
    public readonly Id: string = "";
    public LoggerName: string = 'Default';
    public Type: number;
    public Layer: number;
    public Module: string;
    public Summary: string;
    public Detail: string;

    public LogContext: {
        Role: unknown;
        Site: unknown;
        User: unknown;
        Client: unknown;
        Request: unknown;
        Response: unknown;
        Others: unknown[];
    } = {
        Role: null,
        Site: null,
        User: null,
        Client: null,
        Request: null,
        Response: null,
        Others: [],
    };

    public validate(): boolean {
        return this.Type>0 && this.Layer>0;
    }
}