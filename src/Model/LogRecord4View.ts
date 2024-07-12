/*


用于显示的包含状态的Log记录对象


* */

import { Log } from "./Log";

/**
 * 用于显示的包含状态的Log记录对象
 * 包含了是否显示和是否被过滤的状态等等
 * 后续对Log记录的视图显示的state/状态的管理都在这个类中
 */
export class LogRecord4View {
    public Log: Log;
    public Display: boolean;
    public Filtered: boolean;

    constructor(log: Log) {
        this.Log = log;
        this.Display = true;
        this.Filtered = false;
    }
}