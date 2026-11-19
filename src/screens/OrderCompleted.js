import React, { useEffect, useState } from "react";
import { View, Text, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
import LottieView from "lottie-react-native";
import {
  collection,
  limit,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { db } from "../../firebase";
import MenuItems from "../components/restaurantDetail/MenuItems";

const fallbackImage =
  "https://www.modernhoney.com/wp-content/uploads/2019/08/Classic-Lasagna-14-scaled.jpg";

export default function OrderCompleted() {
  const [lastOrder, setLastOrder] = useState({
    items: [
      {
        title: "Bologna",
        description: "With butter lettuce, tomato and sauce bechamel",
        price: "$13.50",
        image: fallbackImage,
      },
    ],
  });

  const selectedItems = useSelector(
    (state) => state.cartReducer?.selectedItems ?? {}
  );

  const cartItems = Array.isArray(selectedItems)
    ? selectedItems
    : Array.isArray(selectedItems.items)
      ? selectedItems.items
      : [];

  const rawOrderItems = Array.isArray(lastOrder?.items)
    ? lastOrder.items
    : cartItems;

  const orderItems = rawOrderItems.map((item) => ({
    ...item,
    image: item.image || fallbackImage,
  }));

  const restaurantName =
    lastOrder?.restaurantName ??
    (Array.isArray(selectedItems)
      ? cartItems[0]?.restaurantName
      : selectedItems.restaurantName) ??
    "the restaurant";

  const total = orderItems.reduce((sum, item) => {
    const price = Number(String(item.price ?? "").replace(/[^0-9.-]/g, ""));
    return sum + (Number.isFinite(price) ? price : 0);
  }, 0);

  const totalUSD = total.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });

  useEffect(() => {
    const ordersQuery = query(
      collection(db, "orders"),
      orderBy("createdAt", "desc"),
      limit(1)
    );

    const unsubscribe = onSnapshot(ordersQuery, (snapshot) => {
      const latestOrder = snapshot.docs[0]?.data();

      if (latestOrder) {
        setLastOrder(latestOrder);
      }
    });

    return unsubscribe;
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <View
        style={{
          flex: 1,
          margin: 15,
          alignItems: "center",
         
        }}
      >
        <View
          style={{
            width: 100,
            height: 100,
            overflow: "hidden",
            marginBottom: 30,
          }}
        >
          <LottieView
            style={{ width: "100%", height: "100%" }}
            source={require("../../assets/animations/check-mark.json")}
            autoPlay
            speed={0.5}
            loop={false}
          />
        </View>

        <Text
          style={{
            fontSize: 20,
            fontWeight: "bold",
            textAlign: "center",
          }}
        >
          Your order at {restaurantName} has been placed for {totalUSD}
        </Text>

        <ScrollView
          style={{ flex: 1, width: "100%", marginTop: 8 }}
          showsVerticalScrollIndicator={false}
          nestedScrollEnabled
        >
          <MenuItems
            foods={orderItems}
            restaurantName={restaurantName}
            hideCheckbox
            marginLeft={10}
          />

          <View
            style={{
              width: 200,
              height: 120,
              overflow: "hidden",
              alignSelf: "center",
            }}
          >
            <LottieView
              style={{ width: "100%", height: "100%" }}
              source={require("../../assets/animations/cooking.json")}
              autoPlay
              speed={0.5}
            />
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}