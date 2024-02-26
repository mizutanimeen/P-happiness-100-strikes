import { configureStore } from '@reduxjs/toolkit';
import { monthDiffReducer, selectDateReducer, loginReducer } from './slice/calendar';
import { useSelector as rawUseSelector, TypedUseSelectorHook } from 'react-redux';

export const store = configureStore({
    reducer: {
        monthDiff: monthDiffReducer,
        selectDate: selectDateReducer,
        login: loginReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;

export const useSelector: TypedUseSelectorHook<RootState> = rawUseSelector;
