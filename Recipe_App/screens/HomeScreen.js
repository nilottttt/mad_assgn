import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
} from "react-native";
import RecipeCard from "../components/RecipeCard";
import { recipes } from "../data/recipes";

export default function HomeScreen({ navigation }) {
  const [query, setQuery] = useState("");

  const filtered = recipes.filter((r) =>
    r.title.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Recipes</Text>

      <TextInput
        style={styles.search}
        placeholder="Search recipes..."
        value={query}
        onChangeText={setQuery}
      />

      <FlatList
        data={filtered}
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
  search: {
    backgroundColor: "#f1f1f1",
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
  },
});
