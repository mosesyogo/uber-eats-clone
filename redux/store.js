import { configureStore as createReduxStore } from '@reduxjs/toolkit'
import reducer from './reducers/index'

export default function configureStore(initialState) {
  const store = createReduxStore({
    reducer,
    preloadedState: initialState,
  })
  return store
}