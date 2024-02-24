import { configureStore } from '@reduxjs/toolkit';
import { monthDiffReducer, selectDateReducer } from './slice/calendar';
import { useSelector as rawUseSelector, TypedUseSelectorHook } from 'react-redux';

export const store = configureStore({
    reducer: {
        monthDiff: monthDiffReducer,
        selectDate: selectDateReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;

export const useSelector: TypedUseSelectorHook<RootState> = rawUseSelector;
