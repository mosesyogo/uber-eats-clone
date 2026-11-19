import React, { useState } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
} from 'react-native'
import { useSelector } from 'react-redux'
import { useRouter } from 'expo-router'
import LottieView from 'lottie-react-native'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../../../firebase'
import OrderItem from './OrderItem'

export default function ViewCart() {
  const [modalVisible, setModalVisible] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const { items, restaurantName } = useSelector(
    (state) => state.cartReducer.selectedItems
  )

  const total = items
    .map((item) => Number(String(item.price).replace('$', '')))
    .reduce((prev, curr) => prev + curr, 0)

  const totalUSD = total.toLocaleString('en', {
    style: 'currency',
    currency: 'USD',
  })

  const addOrderToFirebase = async () => {
    setLoading(true)

    try {
      await addDoc(collection(db, 'orders'), {
        items,
        restaurantName,
        createdAt: serverTimestamp(),
      })

      console.log('Order saved')

      // Let the animation play for a moment before moving on
      setTimeout(() => {
        setLoading(false)
        router.push('/orderCompleted')
      }, 2500)
    } catch (error) {
      console.log('Order failed:', error)
      setLoading(false)
    }
  }

  const checkout = () => {
    setModalVisible(false)
    addOrderToFirebase()
  }

  const checkoutModalContent = () => (
    <View style={styles.modalContainer}>
      <View style={styles.modalCheckoutContainer}>
        <Text style={styles.restaurantName}>{restaurantName}</Text>

        {items.map((item, index) => (
          <OrderItem key={index} item={item} />
        ))}

        <View style={styles.subtotalContainer}>
          <Text style={styles.subtotalText}>Subtotal</Text>
          <Text>{totalUSD}</Text>
        </View>

        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
          <TouchableOpacity style={styles.checkoutButton} onPress={checkout}>
            <Text style={{ color: 'white', fontSize: 20 }}>Checkout</Text>
            <Text style={styles.checkoutTotal}>{total ? totalUSD : ''}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )

  return (
    <>
      <Modal
        animationType="slide"
        visible={modalVisible}
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        {checkoutModalContent()}
      </Modal>

      {total ? (
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'row',
            position: 'absolute',
            bottom: 130,
            width: '100%',
            zIndex: 999,
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              width: '100%',
            }}
          >
            <TouchableOpacity
              style={{
                marginTop: 20,
                backgroundColor: 'black',
                flexDirection: 'row',
                justifyContent: 'flex-end',
                padding: 15,
                borderRadius: 30,
                width: 300,
                position: 'relative',
              }}
              onPress={() => setModalVisible(true)}
            >
              <Text style={{ color: 'white', fontSize: 20, marginRight: 30 }}>
                View Cart
              </Text>
              <Text style={{ color: 'white', fontSize: 20 }}>{totalUSD}</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : null}

      {loading ? (
        <View style={styles.loadingOverlay}>
          <View style={{ width: 200, height: 200, overflow: 'hidden' }}>
            <LottieView
              style={{ width: '100%', height: '100%' }}
              source={require('../../../assets/animations/scanner.json')}
              autoPlay
              speed={3}
            />
          </View>
        </View>
      ) : null}
    </>
  )
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  modalCheckoutContainer: {
    backgroundColor: 'white',
    padding: 16,
    height: 500,
    borderWidth: 1,
  },
  restaurantName: {
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 18,
    marginBottom: 10,
  },
  subtotalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  subtotalText: {
    textAlign: 'left',
    fontWeight: '600',
    fontSize: 15,
    marginBottom: 10,
  },
  checkoutButton: {
    marginTop: 20,
    backgroundColor: 'black',
    alignItems: 'center',
    padding: 13,
    borderRadius: 30,
    width: 300,
    position: 'relative',
  },
  checkoutTotal: {
    position: 'absolute',
    right: 20,
    color: 'white',
    fontSize: 15,
    top: 17,
  },
  loadingOverlay: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    width: '100%',
    zIndex: 1000,
  },
})