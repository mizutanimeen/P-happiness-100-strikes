import { createSlice } from '@reduxjs/toolkit';
import { formatDate } from '../../util/util';
import { TimeRecordsGet } from '../../axios/time';
import { DateRecordsGet } from '../../axios/date';

export const currentMonthDiffSlice = createSlice({
    name: 'currentMonthDiff',
    initialState: {
        value: 0,
    },
    reducers: {
        increment: (state) => {
            state.value += 1;
        },
        decrement: (state) => {
            state.value -= 1;
        },
    },
});

export const { increment, decrement } = currentMonthDiffSlice.actions;
export const monthDiffReducer = currentMonthDiffSlice.reducer;

export const selectDateSlice = createSlice({
    name: 'selectDate',
    initialState: {
        value: formatDate(new Date),
    },
    reducers: {
        select: (state, date) => {
            state.value = date.payload;
        },
    },
});
export const { select } = selectDateSlice.actions;
export const selectDateReducer = selectDateSlice.reducer;

export const loginSlice = createSlice({
    name: 'login',
    initialState: {
        value: false,
    },
    reducers: {
        login: (state, date) => {
            state.value = date.payload;
        },
    },
});

export const { login } = loginSlice.actions;
export const loginReducer = loginSlice.reducer;

export const totalMoneySlice = createSlice({
    name: 'totalManey',
    initialState: {
        value: 0,
    },
    reducers: {
        setTotalMoney: (state, date) => {
            state.value = date.payload;
        }
    },
});

export const { setTotalMoney } = totalMoneySlice.actions;
export const totalMoneyReducer = totalMoneySlice.reducer;

export type TimeRecordsByMonthDiff = {
    [monthDiff: string]: TimeRecordsGet;
}

export type CacheByMonthDiff = {
    [monthDiff: string]: boolean;
}

export const timeRecordsSlice = createSlice({
    name: 'timeRecords',
    initialState: {
        value: {} as TimeRecordsByMonthDiff,
        cache: {} as CacheByMonthDiff,
    },
    reducers: {
        setTimeRecordsByMonthDiff: (state, data) => {
            state.value[data.payload.monthDiff] = data.payload.data;
        },
        setTRCache: (state, data) => {
            state.cache[data.payload.monthDiff] = data.payload.data;
        },
        resetTR: (state) => {
            state.value = {};
            state.cache = {};
        },
    },
});

export const { setTimeRecordsByMonthDiff, setTRCache, resetTR } = timeRecordsSlice.actions;
export const timeRecordsReducer = timeRecordsSlice.reducer;

export type DateRecordsByMonthDiff = {
    [monthDiff: string]: DateRecordsGet;
}

export const dateRecordsSlice = createSlice({
    name: 'dateRecords',
    initialState: {
        value: {} as DateRecordsByMonthDiff,
        cache: {} as CacheByMonthDiff,
    },
    reducers: {
        setDateRecordsByMonthDiff: (state, data) => {
            state.value[data.payload.monthDiff] = data.payload.data;
        },
        setDRCache: (state, data) => {
            state.cache[data.payload.monthDiff] = data.payload.data;
        },
        resetDR: (state) => {
            state.value = {};
            state.cache = {};
        },
    },
});

export const { setDateRecordsByMonthDiff, setDRCache, resetDR } = dateRecordsSlice.actions;
export const dateRecordsReducer = dateRecordsSlice.reducer;
