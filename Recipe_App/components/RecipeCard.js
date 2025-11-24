import React from "react";
import { View, Text, Image, StyleSheet, Pressable } from "react-native";

export default function RecipeCard({ item, onPress }) {
  return (
    <Pressable onPress={onPress} style={styles.card}>
      <Image source={{ uri: item.image }} style={styles.img} />
      <Text style={styles.title}>{item.title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    marginVertical: 10,
    borderRadius: 12,
    elevation: 3,
    overflow: "hidden",
  },
  img: {
    width: "100%",
    height: 160,
  },
  title: {
    padding: 12,
    fontSize: 18,
    fontWeight: "600",
  },
});
