import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import RecipeCard from "../components/RecipeCard";

export default function SavedScreen({ navigation }) {
  const [saved, setSaved] = useState([]);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", loadSaved);
    return unsubscribe;
  }, []);

  const loadSaved = async () => {
    const data = await AsyncStorage.getItem("saved");
    setSaved(data ? JSON.parse(data) : []);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Saved Recipes</Text>

      <FlatList
        data={saved}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <RecipeCard
            item={item}
            onPress={() =>
              navigation.navigate("Details", { recipe: item })
            }
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  header: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 12,
  },
});
