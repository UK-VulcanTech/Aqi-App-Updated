import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useSensorDetailStore = create(persist((set) => ({
    isDataAvailable: true,
    setIsDataAvailable: (status) => set({ isDataAvailable: status }),

    pmValue: null,
    setPmValue: (value) => set({ pmValue: value }),

    aqiValue: null,
    setAQIValue: (value) => set({ aqiValue: value }),

    averageAQIValue: null,
    setAverageAQIValue: (value) => set({ averageAQIValue: value }),

    averagePMValue: null,
    setAveragePMValue: (value) => set({ averagePMValue: value }),

    sensorValue: null,
    setSensorValue: (value) => set({ sensorValue: value }),

    PMFormattedData: [],
    setPMFormattedData: newItems => set({ PMFormattedData: newItems }),

    sensorDetail: null,
    setSensorDetail: (data) => set({ sensorDetail: data }),
})));
