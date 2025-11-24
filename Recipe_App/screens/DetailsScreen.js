import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  Pressable,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function DetailsScreen({ route }) {
  const { recipe } = route.params;
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    checkSaved();
  }, []);

  const checkSaved = async () => {
    const data = await AsyncStorage.getItem("saved");
    const savedList = data ? JSON.parse(data) : [];
    setSaved(savedList.some((r) => r.id === recipe.id));
  };

  const toggleSave = async () => {
    let data = await AsyncStorage.getItem("saved");
    let savedList = data ? JSON.parse(data) : [];

    if (saved) {
      savedList = savedList.filter((r) => r.id !== recipe.id);
    } else {
      savedList.push(recipe);
    }

    await AsyncStorage.setItem("saved", JSON.stringify(savedList));
    setSaved(!saved);
  };

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: recipe.image }} style={styles.img} />

      <View style={styles.content}>
        <Text style={styles.title}>{recipe.title}</Text>

        <Pressable style={styles.btn} onPress={toggleSave}>
          <Text style={styles.btnTxt}>
            {saved ? "Unsave Recipe" : "Save Recipe"}
          </Text>
        </Pressable>

        <Text style={styles.sub}>Ingredients</Text>
        {recipe.ingredients.map((i, idx) => (
          <Text key={idx} style={styles.text}>• {i}</Text>
        ))}

        <Text style={styles.sub}>Steps</Text>
        {recipe.steps.map((s, idx) => (
          <Text key={idx} style={styles.text}>{idx + 1}. {s}</Text>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  img: { width: "100%", height: 220 },
  content: { padding: 16 },
  title: { fontSize: 22, fontWeight: "700", marginBottom: 10 },
  sub: { fontSize: 18, marginTop: 16, fontWeight: "600" },
  text: { fontSize: 16, marginVertical: 4 },
  btn: {
    backgroundColor: "#111827",
    padding: 12,
    borderRadius: 10,
    marginVertical: 10,
    alignItems: "center",
  },
  btnTxt: { color: "#fff", fontSize: 16 },
});
