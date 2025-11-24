// App.js
import React, { useState } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  Platform
} from "react-native";

const questions = [
  {
    question: "Which movie features the quote, “I am Iron Man”?",
    options: ["Iron Man", "The Dark Knight", "Avatar", "Inception"],
    correctOptionIndex: 0,
  },
  {
    question: "Which TV show is set in the fictional town of Hawkins?",
    options: ["Dark", "Stranger Things", "The Witcher", "Sherlock"],
    correctOptionIndex: 1,
  },
  {
    question: "Which movie won the Oscar for Best Picture in 2020?",
    options: ["Joker", "1917", "Parasite", "Ford v Ferrari"],
    correctOptionIndex: 2,
  },
  {
    question: "In which series do we see the character Walter White?",
    options: ["Breaking Bad", "Narcos", "Suits", "House of Cards"],
    correctOptionIndex: 0,
  },
  {
    question: "Which studio created the Marvel Cinematic Universe?",
    options: [
      "Warner Bros.",
      "20th Century Fox",
      "Universal Pictures",
      "Marvel Studios",
    ],
    correctOptionIndex: 3,
  },
  {
    question: "Which TV show features the character Sheldon Cooper?",
    options: [
      "Friends",
      "How I Met Your Mother",
      "The Big Bang Theory",
      "Brooklyn Nine-Nine",
    ],
    correctOptionIndex: 2,
  },
];

export default function App() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState(null); // JS only
  const [score, setScore] = useState(0);
  const [isQuizFinished, setIsQuizFinished] = useState(false);

  const totalQuestions = questions.length;
  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;

  const handleOptionPress = (index) => {
    // JS: no type annotation
    setSelectedOptionIndex(index);
  };

  const handleNextPress = () => {
    if (selectedOptionIndex === null) return;

    if (selectedOptionIndex === currentQuestion.correctOptionIndex) {
      setScore((prev) => prev + 1);
    }

    if (currentQuestionIndex + 1 < totalQuestions) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedOptionIndex(null);
    } else {
      setIsQuizFinished(true);
    }
  };

  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setSelectedOptionIndex(null);
    setScore(0);
    setIsQuizFinished(false);
  };

  const getResultMessage = () => {
    const ratio = score / totalQuestions;
    if (ratio === 1) return "Perfect! You’re a true cinephile. 🎬";
    if (ratio >= 0.6) return "Nice! You know your movies and shows. 🍿";
    return "Not bad! Rewatch some classics and try again. 📺";
  };

  return (
    <SafeAreaView 
      style={[
        styles.safe,
        {paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0},
        ]}
    >
      <StatusBar barStyle="dark-content" />
      <View style={styles.container}>
        <Text style={styles.appTitle}>Movies & TV Quiz</Text>

        <View style={styles.card}>
          {isQuizFinished ? (
            <>
              <Text style={styles.title}>Quiz Finished</Text>
              <Text style={styles.scoreText}>
                {score} / {totalQuestions}
              </Text>
              <Text style={styles.subTitle}>{getResultMessage()}</Text>

              <Pressable style={styles.primaryButton} onPress={handleRestart}>
                {({ pressed }) => (
                  <Text
                    style={[
                      styles.primaryButtonText,
                      pressed && styles.buttonPressedText,
                    ]}
                  >
                    Restart
                  </Text>
                )}
              </Pressable>
            </>
          ) : (
            <>
              {/* Progress bar */}
              <View style={styles.progressContainer}>
                <View style={[styles.progressBar, { width: `${progress}%` }]} />
              </View>
              <Text style={styles.counterText}>
                Question {currentQuestionIndex + 1} of {totalQuestions}
              </Text>

              <Text style={styles.questionText}>
                {currentQuestion.question}
              </Text>

              {currentQuestion.options.map((option, index) => {
                const isSelected = index === selectedOptionIndex;
                return (
                  <Pressable
                    key={index}
                    onPress={() => handleOptionPress(index)}
                    style={({ pressed }) => [
                      styles.optionButton,
                      isSelected && styles.optionButtonSelected,
                      pressed && styles.optionButtonPressed,
                    ]}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        isSelected && styles.optionTextSelected,
                      ]}
                    >
                      {option}
                    </Text>
                  </Pressable>
                );
              })}

              <Pressable style={styles.primaryButton} onPress={handleNextPress}>
                {({ pressed }) => (
                  <Text
                    style={[
                      styles.primaryButtonText,
                      pressed && styles.buttonPressedText,
                    ]}
                  >
                    {currentQuestionIndex + 1 === totalQuestions
                      ? "Submit"
                      : "Next"}
                  </Text>
                )}
              </Pressable>
            </>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    paddingBottom: 16,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  appTitle: {
    fontSize: 22,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 16,
    color: "#111827",
  },
  card: {
    flex: 1,
    backgroundColor: "#ffffff",
    borderRadius: 18,
    padding: 20,
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
    marginVertical: 12
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 8,
    textAlign: "center",
    color: "#111827",
  },
  subTitle: {
    fontSize: 14,
    textAlign: "center",
    color: "#6b7280",
    marginBottom: 24,
  },
  progressContainer: {
    height: 6,
    borderRadius: 999,
    backgroundColor: "#e5e7eb",
    overflow: "hidden",
    marginBottom: 16,
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#111827",
  },
  counterText: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 10,
  },
  questionText: {
    fontSize: 18,
    fontWeight: "500",
    color: "#111827",
    marginBottom: 16,
  },
  optionButton: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    paddingVertical: 12,
    paddingHorizontal: 12,
    marginBottom: 10,
    justifyContent: "center",
  },
  optionButtonSelected: {
    backgroundColor: "#111827",
    borderColor: "#111827",
  },
  optionButtonPressed: {
    opacity: 0.9,
  },
  optionText: {
    fontSize: 15,
    color: "#111827",
  },
  optionTextSelected: {
    color: "#ffffff",
    fontWeight: "500",
  },
  primaryButton: {
    marginTop: 8,
    borderRadius: 999,
    backgroundColor: "#111827",
    paddingVertical: 12,
    alignItems: "center",
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#ffffff",
  },
  buttonPressedText: {
    opacity: 0.8,
  },
  scoreText: {
    fontSize: 32,
    fontWeight: "700",
    textAlign: "center",
    marginVertical: 12,
    color: "#111827",
  },
});
