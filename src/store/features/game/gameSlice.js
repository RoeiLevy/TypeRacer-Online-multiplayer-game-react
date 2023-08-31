import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    user: {
        username: '',
        id: '',
        isLogin: false,
        progress: 0,
        wpm: 0,
        timeToFinish: '',
        isBot: false
    },
    room: null
}

export const gameSlice = createSlice({
    name: 'game',
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.user = { ...state.user, ...action.payload }
        },
        setRoom: (state, action) => {
            state.room = action.payload
        },
    },
})

// Action creators are generated for each case reducer function
export const { setUser, setRoom } = gameSlice.actions

export default gameSlice.reducer