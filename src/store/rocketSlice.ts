// src/store/rocketSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Rocket } from '../types';

interface RocketState {
  editingRocket: Rocket | null;
}

const initialState: RocketState = {
  editingRocket: null,
};

export const rocketSlice = createSlice({
  name: 'rocket',
  initialState,
  reducers: {
    startEditing: (state, action: PayloadAction<Rocket>) => {
      state.editingRocket = action.payload;
    },
    cancelEditing: (state) => {
      state.editingRocket = null;
    },
  },
});

export const { startEditing, cancelEditing } = rocketSlice.actions;