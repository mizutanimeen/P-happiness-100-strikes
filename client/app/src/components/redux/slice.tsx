import { createSlice } from '@reduxjs/toolkit';

export const calendarCurrentMonthDiffSlice = createSlice({
    name: 'calendarCurrentMonth',
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

export const { increment, decrement } = calendarCurrentMonthDiffSlice.actions;
export default calendarCurrentMonthDiffSlice.reducer;
