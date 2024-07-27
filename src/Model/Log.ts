import { LogType } from './LogType';
import { LogLayer } from './LogLayer';
import {LogRecord4Net} from "./LogRecord4Net.ts";

/**
 * 业务层模型.一条日志为一个Log对象
 * 方法提供从LogRecord4Net(网络传输格式)中解析出Log对象以及将Log对象转换为字符串的方法等
 */
export class Log {
    public CreateTime: Date = new Date();
    public Id: string = "";
    public LoggerName: string = 'Default';
    public Type: LogType;
    public Layer: LogLayer;
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

    private _string: string;

    public toString(): string {
        if (this._string) {
            return this._string;
        }

        let contextJson = '序列化失败';
        try {
            contextJson = JSON.stringify(this.LogContext);
        } catch (e) {
            console.error(`在序列化日志上下文信息时发生错误:${e}`);
        }

        this._string = `${this.CreateTime}\r\n类型:${this.Type.Name},层级:${this.Layer.Name},模块:${this.Module},摘要:${this.Summary},详情:${this.Detail},上下文:${contextJson}`;
        return this._string;
    }

    /**
     * 从LogRecord4Net(网络传输格式)中解析出Log对象
     * @param record
     */
    public static fromRecord(record:LogRecord4Net): Log {
        const log = new Log();
        log.Id = record.Id;
        // log.CreateTime = new Date(record.CreateTime);
        //注意服务器过来的时间都是utc时间
        log.CreateTime = new Date(record.CreateTime + 'Z');
        log.LoggerName = record.LoggerName;
        log.Type = LogType.GetLogTypeByValue(record.Type) ?? LogType.Unknown;
        log.Layer = LogLayer.GetLogLayerByValue(record.Layer) ?? LogLayer.Unknown;
        log.Module = record.Module;
        log.Summary = record.Summary;
        log.Detail = record.Detail;
        log.LogContext = record.LogContext;
        return log;
    }
}