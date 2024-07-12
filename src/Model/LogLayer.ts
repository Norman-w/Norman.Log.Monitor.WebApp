/**
 * 日志级别,业务层模型.
 */
export class LogLayer {
    public readonly Code: string;
    public readonly Name: string;
    public readonly Value: number;

    constructor(code: string, name: string, value: number) {
        this.Code = code;
        this.Name = name;
        this.Value = value;
    }

    public static GetLogLayerByCode(code: string): LogLayer {
        return this.GetKnownLogLayers().find(l => l.Code === code);
    }

    public static GetLogLayerByName(name: string): LogLayer {
        return this.GetKnownLogLayers().find(l => l.Name === name);
    }

    public static GetLogLayerByValue(value: number): LogLayer {
        return this.GetKnownLogLayers().find(l => l.Value === value);
    }

    private static _knownLogLayers: LogLayer[];

    public static GetKnownLogLayers(): LogLayer[] {
        if (this._knownLogLayers && this._knownLogLayers.length > 0) {
            return this._knownLogLayers;
        }
        const staticFields = Object.getOwnPropertyNames(LogLayer);
        for (let i = 0; i < staticFields.length; i++) {
            const field = staticFields[i];
            if (field === "Unknown" || field === "GetKnownLogLayers") {
                continue;
            }
            const value = (LogLayer as unknown)[field];
            if (value instanceof LogLayer) {
                if (!this._knownLogLayers) {
                    this._knownLogLayers = [];
                }
                this._knownLogLayers.push(value);
            }
        }
        return this._knownLogLayers;
    }

    //定义static的固定值
    public static readonly Unknown = new LogLayer("Unknown", "未知", 0);
    public static readonly System = new LogLayer("System", "系统层", 1);
    public static readonly Business = new LogLayer("Business", "业务层", 2);
    public static readonly Data = new LogLayer("Data", "数据层", 3);
    public static readonly Service = new LogLayer("Service", "服务层", 4);
    public static readonly Controller = new LogLayer("Controller", "控制器层", 5);
    public static readonly Peripheral = new LogLayer("Peripheral", "外设层", 6);
}