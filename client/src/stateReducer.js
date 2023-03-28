import { configureStore, createSlice } from "@reduxjs/toolkit";
const initialState = {
    isLogged: false,
    data: null
}


const userSlice = createSlice({
    name: 'userSlice',
    initialState,
    reducers:{
        login(state, action){
            state.data = action.payload
            state.isLogged = true
        },
        logout(state){
            state.data = {}
            state.isLogged = false
        }
    }
})

export const {login, logout} = userSlice.actions;
export default userSlice.reducer;