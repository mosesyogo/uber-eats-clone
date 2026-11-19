import { Stack } from 'expo-router'
import { Provider } from 'react-redux'
import configureStore from '../../redux/store'

const store = configureStore()

export default function RootLayout() {
  return (
    <Provider store={store}>
      <Stack screenOptions={{ headerShown: false }} />
    </Provider>
  )
}