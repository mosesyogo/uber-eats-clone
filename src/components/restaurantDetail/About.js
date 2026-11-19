import React from 'react'
import { View, Text, Image } from 'react-native'
import { useLocalSearchParams } from 'expo-router'

const image =
  'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8cmVzdGF1cmFudCUyMGludGVyaW9yfGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&w=1000&q=80'

const title = 'Farmhouse Kitchen Thai Cuisine'
const description = 'Thai • Comfort Food • $$ • 🎫 • 4 ⭐ (2912+)'

export default function About() {
  const params = useLocalSearchParams()
  const { name, price, reviews, rating, categories } = params

  const hasData = Boolean(name)

  const formattedCategories = categories
    ? String(categories).split(', ').join(' • ')
    : ''

  const dynamicDescription = `${formattedCategories}${
    price ? ' • ' + price : ''
  } • 🎫 • ${rating} ⭐ (${reviews}+)`

  return (
    <View>
      <RestaurantImage image={params.image || image} />
      <RestaurantTitle title={hasData ? name : title} />
      <RestaurantDescription
        description={hasData ? dynamicDescription : description}
      />
    </View>
  )
}

const RestaurantImage = (props) => (
  <Image source={{ uri: props.image }} style={{ width: '100%', height: 180 }} />
)

const RestaurantTitle = (props) => (
  <Text
    style={{
      fontSize: 29,
      fontWeight: '600',
      marginTop: 10,
      marginHorizontal: 15,
    }}
  >
    {props.title}
  </Text>
)

const RestaurantDescription = (props) => (
  <Text
    style={{
      marginTop: 10,
      marginHorizontal: 15,
      fontWeight: '400',
      fontSize: 15.5,
    }}
  >
    {props.description}
  </Text>
)