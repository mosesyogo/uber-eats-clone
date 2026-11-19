import { combineReducers } from '@reduxjs/toolkit'
import cartReducer from './cartReducer'

const rootReducer = combineReducers({
  cartReducer,
})

export default rootReducer