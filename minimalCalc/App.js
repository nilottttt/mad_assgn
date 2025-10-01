import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export default function App() {
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState(null);
  const [operation, setOperation] = useState(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const [lastOperation, setLastOperation] = useState(null);
  const [lastOperand, setLastOperand] = useState(null);

  const inputNumber = (num) => {
    if (display === 'Error') {
      clear();
      setDisplay(String(num));
      return;
    }
    
    if (waitingForOperand) {
      setDisplay(String(num));
      setWaitingForOperand(false);
    } else {
      if (display.length < 9) { // Limit display length
        setDisplay(display === '0' ? String(num) : display + num);
      }
    }
  };

  const inputDecimal = () => {
    if (display === 'Error') {
      clear();
      setDisplay('0.');
      return;
    }
    
    if (waitingForOperand) {
      setDisplay('0.');
      setWaitingForOperand(false);
    } else if (display.indexOf('.') === -1) {
      setDisplay(display + '.');
    }
  };

  const clear = () => {
    setDisplay('0');
    setPreviousValue(null);
    setOperation(null);
    setWaitingForOperand(false);
    setLastOperation(null);
    setLastOperand(null);
  };

  const clearEntry = () => {
    setDisplay('0');
  };

  const performOperation = (nextOperation) => {
    const inputValue = parseFloat(display);
    
    if (isNaN(inputValue)) {
      return;
    }

    if (nextOperation === '=') {
      if (operation && previousValue !== null) {
        const newValue = calculate(previousValue, inputValue, operation);
        setDisplay(String(newValue));
        setLastOperation(operation);
        setLastOperand(inputValue);
        setPreviousValue(null);
        setOperation(null);
        setWaitingForOperand(true);
      } else if (lastOperation && lastOperand !== null) {
        // Repeat last operation when pressing equals multiple times
        const newValue = calculate(inputValue, lastOperand, lastOperation);
        setDisplay(String(newValue));
        setWaitingForOperand(true);
      }
      return;
    }

    if (previousValue === null) {
      setPreviousValue(inputValue);
    } else if (operation && !waitingForOperand) {
      const newValue = calculate(previousValue, inputValue, operation);
      setDisplay(String(newValue));
      setPreviousValue(newValue);
    } else {
      setPreviousValue(inputValue);
    }

    setWaitingForOperand(true);
    setOperation(nextOperation);
    setLastOperation(null);
    setLastOperand(null);
  };

  const calculate = (firstValue, secondValue, operation) => {
    const precision = 12;
    let result;
    
    switch (operation) {
      case '+':
        result = firstValue + secondValue;
        break;
      case '-':
        result = firstValue - secondValue;
        break;
      case '×':
        result = firstValue * secondValue;
        break;
      case '÷':
        if (secondValue === 0) {
          return 'Error';
        }
        result = firstValue / secondValue;
        break;
      default:
        return secondValue;
    }
    
    // Handle very large or very small numbers
    if (Math.abs(result) > 999999999 || (Math.abs(result) < 0.000001 && result !== 0)) {
      return parseFloat(result.toExponential(6));
    }
    
    // Round to avoid floating point precision errors
    const rounded = Math.round(result * Math.pow(10, precision)) / Math.pow(10, precision);
    
    // Remove unnecessary decimal places
    return parseFloat(rounded.toPrecision(12));
  };

  const percentage = () => {
    if (display === 'Error') return;
    
    const value = parseFloat(display) / 100;
    setDisplay(String(value));
    setWaitingForOperand(false);
  };

  const toggleSign = () => {
    if (display === '0' || display === 'Error') return;
    
    if (display.charAt(0) === '-') {
      setDisplay(display.slice(1));
    } else {
      setDisplay('-' + display);
    }
  };

  const formatDisplay = () => {
    if (display === 'Error') return display;
    
    const value = parseFloat(display);
    if (isNaN(value)) return '0';
    
    // Handle very large numbers
    if (Math.abs(value) > 999999999) {
      return value.toExponential(3);
    }
    
    // Handle very small numbers
    if (Math.abs(value) < 0.000001 && value !== 0) {
      return value.toExponential(3);
    }
    
    // Convert to string and remove trailing zeros
    let str = display;
    if (str.includes('.')) {
      str = str.replace(/\.?0+$/, '');
    }
    
    // Limit display length
    if (str.length > 9) {
      return parseFloat(display).toPrecision(6);
    }
    
    return str;
  };

  const Button = ({ onPress, text, style, textStyle }) => (
    <TouchableOpacity style={[styles.button, style]} onPress={onPress} activeOpacity={0.7}>
      <Text style={[styles.buttonText, textStyle]}>{text}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.displayContainer}>
        <Text style={styles.displayText} numberOfLines={1} adjustsFontSizeToFit>
          {formatDisplay()}
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        {/* Row 1 */}
        <View style={styles.row}>
          <Button onPress={clear} text="AC" style={styles.functionButton} textStyle={styles.functionText} />
          <Button onPress={clearEntry} text="CE" style={styles.functionButton} textStyle={styles.functionText} />
          <Button onPress={toggleSign} text="±" style={styles.functionButton} textStyle={styles.functionText} />
          <Button onPress={() => performOperation('÷')} text="÷" style={styles.operatorButton} textStyle={styles.operatorText} />
        </View>

        {/* Row 2 */}
        <View style={styles.row}>
          <Button onPress={() => inputNumber(7)} text="7" style={styles.numberButton} textStyle={styles.numberText} />
          <Button onPress={() => inputNumber(8)} text="8" style={styles.numberButton} textStyle={styles.numberText} />
          <Button onPress={() => inputNumber(9)} text="9" style={styles.numberButton} textStyle={styles.numberText} />
          <Button onPress={() => performOperation('×')} text="×" style={styles.operatorButton} textStyle={styles.operatorText} />
        </View>

        {/* Row 3 */}
        <View style={styles.row}>
          <Button onPress={() => inputNumber(4)} text="4" style={styles.numberButton} textStyle={styles.numberText} />
          <Button onPress={() => inputNumber(5)} text="5" style={styles.numberButton} textStyle={styles.numberText} />
          <Button onPress={() => inputNumber(6)} text="6" style={styles.numberButton} textStyle={styles.numberText} />
          <Button onPress={() => performOperation('-')} text="−" style={styles.operatorButton} textStyle={styles.operatorText} />
        </View>

        {/* Row 4 */}
        <View style={styles.row}>
          <Button onPress={() => inputNumber(1)} text="1" style={styles.numberButton} textStyle={styles.numberText} />
          <Button onPress={() => inputNumber(2)} text="2" style={styles.numberButton} textStyle={styles.numberText} />
          <Button onPress={() => inputNumber(3)} text="3" style={styles.numberButton} textStyle={styles.numberText} />
          <Button onPress={() => performOperation('+')} text="+" style={styles.operatorButton} textStyle={styles.operatorText} />
        </View>

        {/* Row 5 */}
        <View style={styles.row}>
          <Button onPress={() => inputNumber(0)} text="0" style={[styles.numberButton, styles.zeroButton]} textStyle={styles.numberText} />
          <Button onPress={inputDecimal} text="." style={styles.numberButton} textStyle={styles.numberText} />
          <Button onPress={percentage} text="%" style={styles.functionButton} textStyle={styles.functionText} />
          <Button onPress={() => performOperation('=')} text="=" style={styles.equalsButton} textStyle={styles.operatorText} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'flex-end',
  },
  displayContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    paddingVertical: 40,
    minHeight: 120,
  },
  displayText: {
    fontSize: 64,
    color: '#fff',
    fontWeight: '200',
    textAlign: 'right',
    maxWidth: '100%',
  },
  buttonContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 15,
    justifyContent: 'space-between',
  },
  button: {
    width: (width - 60) / 4,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
  },
  zeroButton: {
    width: (width - 75) / 2,
    alignSelf: 'flex-start',
  },
  buttonText: {
    fontSize: 32,
    fontWeight: '400',
  },
  numberButton: {
    backgroundColor: '#333',
  },
  numberText: {
    color: '#fff',
  },
  operatorButton: {
    backgroundColor: '#ff9500',
  },
  functionButton: {
    backgroundColor: '#a6a6a6',
  },
  equalsButton: {
    backgroundColor: '#ff9500',
  },
  operatorText: {
    color: '#fff',
  },
  functionText: {
    color: '#000',
  },
});