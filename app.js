let counts = document.querySelector(".quiz-info .count span")
let bullets = document.querySelector(".bullets .spans")
let quizArea = document.querySelector(".quiz-area")
let answersArea = document.querySelector(".answers-area")
let submitBtn = document.querySelector(".submit-button")
let resultsContainer = document.querySelector(".results")
let countDownElement = document.querySelector(".bullets .countdown")

let currentIndex = 0;
let rightAnswers = 0;
let countDownInterval;
let intervalDuration = 30;

// Ajax Section 
function getQuestions () {
  let myRequest = new XMLHttpRequest()

  myRequest.onreadystatechange = function() {
    if (this.readyState === 4 && this.status === 200) {
      let questionsObject = JSON.parse(this.responseText)
      let qCount = questionsObject.length
      countsAndBullets(qCount)
      addQuestionData(questionsObject[currentIndex], qCount)

      // Countdown
      countDown(intervalDuration, qCount)

      // Click On Submit
      submitBtn.onclick = function () {
        
        // clearInterval
        clearInterval(countDownInterval)

        // Get the right answer
        let rightAnswer;
        if (currentIndex < qCount ) {
          rightAnswer = questionsObject[currentIndex]["right_answer"]
        }

        checkAnswer(rightAnswer, qCount)

        // Remove Previous Question & Answers
        currentIndex++
        quizArea.innerHTML = ""
        answersArea.innerHTML = ""

        addQuestionData(questionsObject[currentIndex], qCount)       

        // Handle Bullets Classes
        handleBullets()

        countDown(intervalDuration, qCount)

        // Show results and remove containers
        showResults(qCount)

      }

    }
  }

  myRequest.open("GET", "html_questions.json", true)
  myRequest.send()
} 
getQuestions()


// {6} CountDown
function countDown(duration, count) {
  if (currentIndex < count) {
    let minutes, seconds;
    countDownInterval = setInterval(function() {
      minutes = parseInt(duration / 60)
      seconds = parseInt(duration % 60)

      minutes = minutes<10 ? `0${minutes}`: minutes
      seconds = seconds<10 ? `0${seconds}`: seconds

      countDownElement.innerHTML = `${minutes}:${seconds}`

      if (--duration < 0) {
        clearInterval(countDownInterval)
        submitBtn.click()
      }
    },1000)
  }
}


// {5} Show Results 
function showResults(count) {
  if (currentIndex === count) {
    answersArea.remove()
    quizArea.remove()
    document.querySelector(".bullets").remove()
    submitBtn.innerHTML = "Congratz, You Finished ✨" 
    submitBtn.className = "end-submit"


    // <span>Perfect</span>: You answered 0 out of 9
    if (rightAnswers === count) {
      theResults = `<span class="perfect">Perfect</span>: Answered ${rightAnswers} out of ${count}`
    } else if (rightAnswers > count / 2 && rightAnswers < count) {
      theResults = `<span class="good">Good</span>: Answered ${rightAnswers} out of ${count}`
    } else if (rightAnswers < count) {
      theResults = `<span class="bad">Bad</span>: Answered ${rightAnswers} out of ${count}`
    }

    resultsContainer.innerHTML = (theResults)
  }
}


// {4} Handle Bullets Classes
function handleBullets() {
  let bulletsSpans = document.querySelectorAll(".bullets .spans span")
  bulletsSpans.forEach((span, index) => {
    // console.log(currentIndex)
    // console.log(index)
    // console.log(span)
    if (currentIndex == index) {
      span.className = "on"
    }
  })
}


// {3} Checking the choosen & the right answer
function checkAnswer(rAnswer, count) {

  let answers = document.getElementsByName("questions")
  let theChoosendAnswer;

  for (i=0; i<answers.length; i++) {
    if (answers[i].checked) {
      theChoosendAnswer = answers[i].dataset.answer
    }
  }
  if (rAnswer === theChoosendAnswer) {
    rightAnswers++

  }
}


// {2} Add data to HTML
function addQuestionData(obj, count) {
  if (currentIndex < count) {

    let questionTitle = document.createElement("h2")
    let questionText = document.createTextNode(obj.title)
    questionTitle.appendChild(questionText)
    quizArea.appendChild(questionTitle)

    for (i=1; i<=4; i++) {
      let mainDiv = document.createElement("div")
      mainDiv.className = "answer"

      let radioInput = document.createElement("input")
      radioInput.type = "radio"
      radioInput.name = "questions"
      radioInput.id = `answer-${i}`
      radioInput.dataset.answer = obj[`answer_${i}`]
      mainDiv.appendChild(radioInput)

      let theLabel = document.createElement("label")
      theLabel.htmlFor = `answer-${i}`
      let labelText = document.createTextNode(obj[`answer_${i}`])
      theLabel.appendChild(labelText)
      mainDiv.appendChild(theLabel)

      answersArea.appendChild(mainDiv)

      if (i === 1) {
      radioInput.checked = true
      }
    }
  }
}


// {1} Add questions count and bullets
function countsAndBullets(num) {
  counts.innerHTML = num
  for (i=0; i<num; i++) {
    let theBullet = document.createElement("span")
    bullets.appendChild(theBullet)

    if (i === 0) {
    theBullet.className = "on"
    }
  }
}
