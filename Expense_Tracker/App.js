import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  Pressable,
  SafeAreaView,
  StatusBar,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

const Stack = createNativeStackNavigator();
const STORAGE_KEY = "expenses_data";

function App() {
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const json = await AsyncStorage.getItem(STORAGE_KEY);
        if (json) setExpenses(JSON.parse(json));
      } catch (e) {
        console.log("Error loading expenses", e);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
      } catch (e) {
        console.log("Error saving expenses", e);
      }
    })();
  }, [expenses]);

  const addExpense = (expense) => {
    setExpenses((prev) => [
      { id: Date.now().toString(), ...expense },
      ...prev,
    ]);
  };

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" options={{ title: "Expense Tracker" }}>
          {(props) => (
            <HomeScreen {...props} expenses={expenses} />
          )}
        </Stack.Screen>
        <Stack.Screen name="AddExpense" options={{ title: "Add Expense" }}>
          {(props) => (
            <AddExpenseScreen {...props} addExpense={addExpense} />
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}


function HomeScreen({ navigation, expenses }) {
  const today = new Date();
  const todayStr = today.toISOString().slice(0, 10); // YYYY-MM-DD
  const monthKey = today.getFullYear() + "-" + (today.getMonth() + 1);

  let todayTotal = 0;
  let monthTotal = 0;

  expenses.forEach((e) => {
    if (e.date === todayStr) {
      todayTotal += Number(e.amount) || 0;
    }
    const key =
      e.date?.slice(0, 7) || ""; // YYYY-MM
    if (key === monthKey) {
      monthTotal += Number(e.amount) || 0;
    }
  });

  return (
    <SafeAreaView
      style={[
        styles.safe,
        {
          paddingTop:
            Platform.OS === "android" ? StatusBar.currentHeight : 0,
        },
      ]}
    >
      <View style={styles.container}>
        {/* Summary cards */}
        <View style={styles.summaryRow}>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Today</Text>
            <Text style={styles.summaryAmount}>₹{todayTotal.toFixed(2)}</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>This Month</Text>
            <Text style={styles.summaryAmount}>₹{monthTotal.toFixed(2)}</Text>
          </View>
        </View>

        {/* List */}
        <Text style={styles.sectionTitle}>Recent Expenses</Text>
        {expenses.length === 0 ? (
          <Text style={styles.emptyText}>
            No expenses yet. Tap + to add one.
          </Text>
        ) : (
          <FlatList
            data={expenses}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ paddingBottom: 80 }}
            renderItem={({ item }) => <ExpenseItem item={item} />}
          />
        )}

        {/* Floating add button */}
        <Pressable
          style={styles.fab}
          onPress={() => navigation.navigate("AddExpense")}
        >
          <Text style={styles.fabText}>+</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}


function AddExpenseScreen({ navigation, addExpense }) {
  const todayStr = new Date().toISOString().slice(0, 10);

  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState(todayStr);
  const [error, setError] = useState("");

  const handleSave = () => {
    if (!title || !amount) {
      setError("Title and amount are required");
      return;
    }
    if (isNaN(Number(amount))) {
      setError("Amount must be a number");
      return;
    }
    addExpense({
      title,
      amount,
      category: category || "General",
      date,
    });
    navigation.goBack();
  };

  return (
    <SafeAreaView
      style={[
        styles.safe,
        {
          paddingTop:
            Platform.OS === "android" ? StatusBar.currentHeight : 0,
        },
      ]}
    >
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.form}>
          <Text style={styles.label}>Title</Text>
          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder="e.g. Groceries"
            style={styles.input}
          />

          <Text style={styles.label}>Amount (₹)</Text>
          <TextInput
            value={amount}
            onChangeText={setAmount}
            placeholder="e.g. 250"
            keyboardType="numeric"
            style={styles.input}
          />

          <Text style={styles.label}>Category</Text>
          <TextInput
            value={category}
            onChangeText={setCategory}
            placeholder="e.g. Food, Travel, Bills"
            style={styles.input}
          />

          <Text style={styles.label}>Date (YYYY-MM-DD)</Text>
          <TextInput
            value={date}
            onChangeText={setDate}
            placeholder={todayStr}
            style={styles.input}
          />

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <Pressable style={styles.primaryButton} onPress={handleSave}>
            <Text style={styles.primaryButtonText}>Save Expense</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}


function ExpenseItem({ item }) {
  return (
    <View style={styles.expenseItem}>
      <View>
        <Text style={styles.expenseTitle}>{item.title}</Text>
        <Text style={styles.expenseMeta}>
          {item.category} · {item.date}
        </Text>
      </View>
      <Text style={styles.expenseAmount}>₹{Number(item.amount).toFixed(2)}</Text>
    </View>
  );
}


const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#f3f4f6",
  },
  container: {
    flex: 1,
    padding: 16,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: "#111827",
    padding: 16,
    borderRadius: 16,
    marginHorizontal: 4,
  },
  summaryLabel: {
    color: "#9ca3af",
    fontSize: 14,
  },
  summaryAmount: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  },
  emptyText: {
    color: "#6b7280",
    marginTop: 16,
  },
  expenseItem: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  expenseTitle: {
    fontSize: 16,
    fontWeight: "500",
  },
  expenseMeta: {
    fontSize: 13,
    color: "#6b7280",
    marginTop: 2,
  },
  expenseAmount: {
    fontSize: 16,
    fontWeight: "700",
    color: "#ef4444",
  },
  fab: {
    position: "absolute",
    right: 20,
    bottom: 30,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#111827",
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
  },
  fabText: {
    color: "#fff",
    fontSize: 28,
    marginTop: -2,
  },
  form: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    marginTop: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginTop: 4,
  },
  primaryButton: {
    backgroundColor: "#111827",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 16,
  },
  primaryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  error: {
    color: "#ef4444",
    marginTop: 8,
  },
});

export default App;
