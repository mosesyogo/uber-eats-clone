import React from "react";
import { View, Text, StyleSheet, Image, ScrollView } from "react-native";
import { Divider } from "@rneui/themed";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { useDispatch, useSelector } from "react-redux";
import { useLocalSearchParams } from "expo-router";


const styles = StyleSheet.create({
  menuItemStyle: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 12,
    marginVertical: 14,
  },
  foodInfoStyle: {
    flex: 1,
    minWidth: 0,
    justifyContent: "space-evenly",
    marginRight: 10,
  },
  titleStyle: {
    fontSize: 19,
    fontWeight: "600",
  },
  foodImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    flexShrink: 0,
  },
});

export default function MenuItems({
  restaurantName: restaurantNameProp,
  foods = defaultFoods,
  hideCheckbox = false,
  marginLeft = 0,
}) {
  const dispatch = useDispatch();
  const params = useLocalSearchParams();

  const routeName = Array.isArray(params.name) ? params.name[0] : params.name;
  const restaurantName =
    restaurantNameProp ?? routeName ?? "Farmhouse Kitchen Thai Cuisine";

  const cartItems = useSelector((state) => {
    const selected = state.cartReducer?.selectedItems;

    if (Array.isArray(selected)) {
      return selected;
    }

    return Array.isArray(selected?.items) ? selected.items : [];
  });

  const isFoodInCart = (id) => cartItems.some((item) => item.id === id);

  const selectItem = (food, id, checkboxValue) => {
    dispatch({
      type: "ADD_TO_CART",
      payload: {
        ...food,
        id,
        restaurantName,
        checkboxValue,
      },
    });
  };

  return (
    <ScrollView
      style={{ flex: 1, width: "100%" }}
      contentContainerStyle={{ paddingBottom: 16 }}
      showsVerticalScrollIndicator={false}
    >
      {foods.map((food, index) => {
        const id = food.id ?? `${food.title}-${index}`;

        return (
          <View key={id}>
            <View style={styles.menuItemStyle}>
              {!hideCheckbox && (
                <BouncyCheckbox
                  iconStyle={{ borderColor: "lightgray", borderRadius: 0 }}
                  innerIconStyle={{ borderRadius: 0 }}
                  fillColor="green"
                  isChecked={isFoodInCart(id)}
                  onPress={(checkboxValue) =>
                    selectItem(food, id, checkboxValue)
                  }
                />
              )}

              <FoodInfo food={food} />
              <FoodImage food={food} marginLeft={marginLeft} />
            </View>

            <Divider width={0.5} style={{ marginHorizontal: 12 }} />
          </View>
        );
      })}
    </ScrollView>
  );
}

const FoodInfo = ({ food }) => (
  <View style={styles.foodInfoStyle}>
    <Text style={styles.titleStyle}>{food.title}</Text>
    <Text>{food.description}</Text>
    <Text>{food.price}</Text>
  </View>
);

const FoodImage = ({ food, marginLeft = 0 }) => (
  <Image
    source={{ uri: food.image }}
    resizeMode="cover"
    style={[styles.foodImage, { marginLeft }]}
  />
);