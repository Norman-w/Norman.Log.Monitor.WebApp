import {create} from 'zustand';
import {Log} from '../Model/Log';

interface LogPoolState {
    lastLogReceivedTimeTick: number;
    logs: Log[];
    addLogs: (logs: Log[]) => void;
    clearLogs: () => void;
}

const useStoreLogPool = create<LogPoolState>((set) => ({
    //最后一条日志的到来时间
    lastLogReceivedTimeTick: new Date().getTime(),
    //日志列表
    logs: [],
    // //设置日志列表(全量)
    // setLogs: (logs) => set({logs}),
    //添加日志列表(增量),每次只保留最新的200条日志 TODO: 增加同时最多显示日志条数的配置
    addLogs: (logs) => set((state) => {
        const newLogs = [...state.logs, ...logs];
        return {
            logs: newLogs.slice(Math.max(newLogs.length - 200, 0)),
            lastLogReceivedTimeTick: new Date().getTime()
        };
    }),
    //清空日志列表
    clearLogs: () => set({logs: []}),
}));

export default useStoreLogPool;