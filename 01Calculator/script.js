let display = document.getElementById('display');
let operationDisplay = document.getElementById('operation');
let currentInput = '';
let previousInput = '';
let operator = null;
let shouldResetDisplay = false;

// Update operation display
function updateOperationDisplay() {
    operationDisplay.innerHTML = '';
    
    if (previousInput !== '') {
        const opText = document.createElement('span');
        opText.className = 'op-text';
        let displayOp = operator;
        if (operator === '*') displayOp = '×';
        if (operator === '/') displayOp = '÷';
        if (operator === '-') displayOp = '−';
        opText.textContent = previousInput + ' ' + displayOp;
        operationDisplay.appendChild(opText);
        
        if (currentInput !== '') {
            const inputText = document.createElement('span');
            inputText.className = 'op-input';
            inputText.textContent = currentInput;
            operationDisplay.appendChild(inputText);
        }
    }
}

// Append number to the display
function appendNumber(num) {
    console.log('Number pressed:', num);
    if (shouldResetDisplay) {
        currentInput = '';
        shouldResetDisplay = false;
    }
    
    // Prevent multiple zeros at the start
    if (currentInput === '0' && num === '0') {
        return;
    }
    
    // Replace leading zero with the number
    if (currentInput === '0' && num !== '0') {
        currentInput = num;
    } else {
        currentInput += num;
    }
    
    updateDisplay();
    updateOperationDisplay();
}

// Append decimal point
function appendDecimal() {
    if (shouldResetDisplay) {
        currentInput = '0';
        shouldResetDisplay = false;
    }
    
    // Prevent multiple decimal points
    if (currentInput.includes('.')) {
        return;
    }
    
    // If input is empty, start with 0.
    if (currentInput === '') {
        currentInput = '0';
    }
    
    currentInput += '.';
    updateDisplay();
}

// Append operator
function appendOperator(op) {
    console.log('Operation pressed:', op);
    if (currentInput === '') {
        return;
    }
    
    // If there's already an operator and input, calculate first
    if (operator !== null && currentInput !== '') {
        calculate();
    }
    
    previousInput = currentInput;
    operator = op;
    currentInput = '';
    shouldResetDisplay = true;
    updateOperationDisplay();
}

// Calculate the result
function calculate() {
    if (operator === null || currentInput === '' || previousInput === '') {
        return;
    }
    
    let result;
    const prev = parseFloat(previousInput);
    const current = parseFloat(currentInput);
    
    switch (operator) {
        case '+':
            result = prev + current;
            break;
        case '-':
            result = prev - current;
            break;
        case '*':
            result = prev * current;
            break;
        case '/':
            if (current === 0) {
                alert('Cannot divide by zero!');
                clearDisplay();
                return;
            }
            result = prev / current;
            break;
        default:
            return;
    }
    
    currentInput = result.toString();
    operator = null;
    previousInput = '';
    shouldResetDisplay = true;
    updateDisplay();
}

// Clear the display
function clearDisplay() {
    currentInput = '';
    previousInput = '';
    operator = null;
    shouldResetDisplay = false;
    display.textContent = '0';
    operationDisplay.innerHTML = '';
}

// Delete last character
function deleteLast() {
    currentInput = currentInput.slice(0, -1);
    if (currentInput === '') {
        display.textContent = '0';
    } else {
        updateDisplay();
    }
}

// Update display
function updateDisplay() {
    display.textContent = currentInput === '' ? '0' : currentInput;
}

// Keyboard support
document.addEventListener('keydown', (e) => {
    const key = e.key;
    
    if (key >= '0' && key <= '9') {
        appendNumber(key);
    } else if (key === '.') {
        appendDecimal();
    } else if (key === '+' || key === '-' || key === '*' || key === '/') {
        e.preventDefault();
        appendOperator(key);
    } else if (key === 'Enter' || key === '=') {
        e.preventDefault();
        calculate();
    } else if (key === 'Backspace') {
        e.preventDefault();
        deleteLast();
    } else if (key.toLowerCase() === 'c') {
        clearDisplay();
    }
});