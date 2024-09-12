document.addEventListener('DOMContentLoaded', () => {
  const result = document.getElementById('display')
  const calculationSequence = document.getElementById('calculation-sequence')
  const numbers = document.querySelectorAll('.number')
  const operators = document.querySelectorAll('.operator')
  const equals = document.getElementById('equals')
  const clear = document.getElementById('clear')
  const backspace = document.getElementById('backspace')
  const operatorSign = document.getElementById('operatorSign')
  const decimal = document.getElementById('decimal')

  let currentNumber = ''
  let previousNumber = ''
  let operatorValue = ''
  let resultValue = ''
  let waitingForSecondNumber = false
  let calculationFinished = false // Flag to check if calculation was finished

  const MAX_LENGTH = 30 // Maximum number of characters to display
  const PLACEHOLDER = '0' // Placeholder for an empty display

  const updateResult = (value) => {
    result.textContent =
      value.length > MAX_LENGTH ? value.slice(0, MAX_LENGTH) + '...' : value
    if (value === '') {
      result.textContent = PLACEHOLDER
    }
  }

  const updateCalculationSequence = () => {
    if (operatorValue) {
      calculationSequence.textContent = `${previousNumber} ${operatorValue} ${currentNumber}`
    } else {
      calculationSequence.textContent = ''
    }
  }

  const removeActiveClassFromOperators = () => {
    operators.forEach((operator) => {
      operator.classList.remove('active')
    })
  }

  const calculate = (prev, curr, operator) => {
    let result = 0
    switch (operator) {
      case '+':
        result = parseFloat(prev) + parseFloat(curr)
        break
      case '-':
        result = parseFloat(prev) - parseFloat(curr)
        break
      case '×':
        result = parseFloat(prev) * parseFloat(curr)
        break
      case '÷':
        result = parseFloat(prev) / parseFloat(curr)
        break
      case '%':
        result = parseFloat(prev) % parseFloat(curr)
        break
      default:
        break
    }
    return result.toString()
  }

  numbers.forEach((number) => {
    number.addEventListener('click', () => {
      if (calculationFinished) {
        // If calculation finished, start a new number unless waiting for an operator
        currentNumber = ''
        previousNumber = ''
        calculationFinished = false
      }
      if (waitingForSecondNumber) {
        currentNumber = ''
        waitingForSecondNumber = false
      }
      if (currentNumber.length < MAX_LENGTH) {
        currentNumber += number.textContent
        updateResult(currentNumber)
        updateCalculationSequence()
        removeActiveClassFromOperators() // Remove active class when a number is entered
      }
    })
  })

  operators.forEach((operator) => {
    operator.addEventListener('click', () => {
      if (currentNumber === '') {
        if (resultValue !== '') {
          currentNumber = resultValue
        } else {
          return
        }
      }

      if (previousNumber && currentNumber && operatorValue) {
        previousNumber = calculate(
          previousNumber,
          currentNumber,
          operatorValue
        )
        updateResult(previousNumber)
        currentNumber = ''
      } else {
        previousNumber = currentNumber
        currentNumber = ''
      }

      operatorValue = operator.textContent
      waitingForSecondNumber = true
      updateCalculationSequence()
      removeActiveClassFromOperators()
      operator.classList.add('active') // Add active class to the clicked operator
      calculationFinished = false // Reset flag when operator is clicked
    })
  })

  equals.addEventListener('click', () => {
    if (previousNumber && currentNumber && operatorValue) {
      resultValue = calculate(previousNumber, currentNumber, operatorValue)
      updateResult(resultValue)
      previousNumber = resultValue // Store result as previous number
      currentNumber = ''
      operatorValue = ''
      updateCalculationSequence()
      removeActiveClassFromOperators() // Remove active class after calculation
      waitingForSecondNumber = true // Allow new calculations after equals
      calculationFinished = true // Set flag to indicate calculation finished
    }
  })

  clear.addEventListener('click', () => {
    resultValue = ''
    previousNumber = ''
    currentNumber = ''
    operatorValue = ''
    updateResult('')
    updateCalculationSequence()
    removeActiveClassFromOperators() // Remove active class when cleared
    calculationFinished = false // Reset flag when cleared
  })

  backspace.addEventListener('click', () => {
    if (currentNumber) {
      currentNumber = currentNumber.slice(0, -1)
      updateResult(currentNumber)
      updateCalculationSequence()
    } else {
      updateResult('')
    }
  })

  operatorSign.addEventListener('click', () => {
    if (currentNumber) {
      currentNumber = (parseFloat(currentNumber) * -1).toString()
      updateResult(currentNumber)
      updateCalculationSequence()
    }
  })

  decimal.addEventListener('click', () => {
    if (currentNumber.includes('.')) return
    if (currentNumber === '') {
      currentNumber = '0.'
    } else {
      currentNumber += '.'
    }
    updateResult(currentNumber)
    updateCalculationSequence()
  })
})
