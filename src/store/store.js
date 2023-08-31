import { configureStore } from '@reduxjs/toolkit'
import gameSlice from './features/game/gameSlice'

export const store = configureStore({
    reducer: {
        game: gameSlice
    },
    devTools: true,
})