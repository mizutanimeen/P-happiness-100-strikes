import { createSlice } from '@reduxjs/toolkit';
import { formatDate } from '../../util/util';

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
