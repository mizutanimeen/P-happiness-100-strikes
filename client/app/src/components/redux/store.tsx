import { configureStore } from '@reduxjs/toolkit';
import calendarCurrentMonthDiffSlice from './slice';
import { useSelector as rawUseSelector, TypedUseSelectorHook } from 'react-redux';

export const store = configureStore({
    reducer: {
        calendar: calendarCurrentMonthDiffSlice,
    },
});

export type RootState = ReturnType<typeof store.getState>;

export const useSelector: TypedUseSelectorHook<RootState> = rawUseSelector;
