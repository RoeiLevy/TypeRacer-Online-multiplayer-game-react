import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    user:{
        username: '',
        id: '',
        isLogin: false
    }
}

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.user = { ...state.user,...action.payload }
        },
    },
})

// Action creators are generated for each case reducer function
export const { setUser } = userSlice.actions

export default userSlice.reducer