// src/stores/useStoreLogsFilterState.ts
import {create} from 'zustand';
import {LogType} from '../Model/LogType';
import {LogLayer} from '../Model/LogLayer';

interface LogsFilterState {
    filterText: string;
    filterLogTypes: LogType[];
    filterLogLayers: LogLayer[];
    setFilterText: (filterText: string) => void;
    setFilterLogTypes: (filterLogTypes: LogType[]) => void;
    setFilterLogLayers: (filterLogLayers: LogLayer[]) => void;
}

const useStoreLogsFilterState = create<LogsFilterState>((set) => ({
    filterText: '',
    filterLogTypes: [],
    filterLogLayers: [],
    setFilterText: (filterText) => set({filterText}),
    setFilterLogTypes: (filterLogTypes) => set({filterLogTypes}),
    setFilterLogLayers: (filterLogLayers) => set({filterLogLayers}),
}));

export default useStoreLogsFilterState;