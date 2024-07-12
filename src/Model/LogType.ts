/**
 * 日志类型,业务模型
 * 比枚举更丰富的定义,设计模式基本等同于服务端.
 *
 * 除了提供Code,Name,Value的属性外,还提供了静态方法,用于根据Code,Name,Value获取对应的日志类型.
 *
 * @export LogType
 * @class LogType
 */
export class LogType {
    /**
     * 日志类型的Code,比如"Info","Debug","Error"等,通常做记录或提供给组件使用
     */
    public readonly Code: string;
    /**
     * 日志类型的名称,比如"信息","调试","错误"等,通常用于显示给用户时的友好名称
     */
    public readonly Name: string;
    /**
     * 日志类型的值,比如1,2,3等,计算时使用
     */
    public readonly Value: number;

    /**
     * 创建一个日志类型的实例.通常不需要直接创建,而是通过静态属性获取.
     * @param code
     * @param name
     * @param value
     */
    constructor(code: string, name: string, value: number) {
        this.Code = code;
        this.Name = name;
        this.Value = value;
    }
    //region 反射及静态方法,用于根据Code,Name,Value获取对应的日志类型.

    private static _knownLogTypeCodes: LogType[];
    public static GetKnownLogTypes(): LogType[] {
        if(this._knownLogTypeCodes && this._knownLogTypeCodes.length > 0) {
            return this._knownLogTypeCodes;
        }
        const staticFields = Object.getOwnPropertyNames(LogType);
        for(let i = 0; i < staticFields.length; i++) {
            const field = staticFields[i];
            if(field === "Unknown" || field === "GetKnownLogTypes") {
                continue;
            }
            const value = (LogType as unknown)[field];
            if(value instanceof LogType) {
                if(!this._knownLogTypeCodes) {
                    this._knownLogTypeCodes = [];
                }
                this._knownLogTypeCodes.push(value);
            }
        }
        return this._knownLogTypeCodes;
    }

    public static GetLogTypeByValue(value: number): LogType | undefined {
        return this.GetKnownLogTypes().find(l => l.Value === value);
    }

    public static GetLogTypeByCode(code: string): LogType | undefined {
        return this.GetKnownLogTypes().find(l => l.Code === code);
    }

    public static GetLogTypeByName(name: string): LogType | undefined {
        return this.GetKnownLogTypes().find(l => l.Name === name);
    }
    //endregion
//region 重载操作符,TODO 尚未验证

    public static operatorEqual(left: LogType, right: LogType): boolean {
        return left?.equals(right) ?? right === null;
    }

    public static operatorNotEqual(left: LogType, right: LogType): boolean {
        return !(LogType.operatorEqual(left, right));
    }

    public equals(obj: unknown): boolean {
        if (obj instanceof LogType) {
            const logType = obj as LogType;
            return logType.Code === this.Code && logType.Name === this.Name && logType.Value === this.Value;
        }
        return false;
    }
    //endregion

    //region 定义static为直接可以反问的固定值.如果服务器端有修改,则需要同步修改.
    public static readonly Unknown: LogType = new LogType("Unknown", "未知", 0);
    public static readonly Info: LogType = new LogType("Info", "信息", 1);
    public static readonly Debug: LogType = new LogType("Debug", "调试", 2);
    public static readonly Error: LogType = new LogType("Error", "错误", 3);
    public static readonly Success: LogType = new LogType("Success", "成功", 4);
    public static readonly Fail: LogType = new LogType("Fail", "失败", 5);
    public static readonly Warning: LogType = new LogType("Warning", "警告", 6);
    public static readonly Start: LogType = new LogType("Start", "开始", 7);
    public static readonly Finish: LogType = new LogType("Finish", "结束", 8);
    public static readonly Bug: LogType = new LogType("Bug", "Bug", 9);
    public static readonly Simulate: LogType = new LogType("Simulate", "模拟", 10);
    //endregion
}