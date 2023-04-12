import './App.css';
//Using axios to query TrviaAPI instead of fetch
import axios from 'axios';
import {useState} from 'react';
import Button from '@mui/material/Button';
import { useEffect } from 'react';

function App()
 {
  const [triviaQuestion, setTriviaQuestion] = useState([]);
  const [correct, setCorrectAnswer] = useState("");
  const [result, setResult] = useState("Begin Trvia By Choosing an Answer");
  const [allPossibleAnswers, setAllPossibleAnswers] = useState([]);

  async function getTriviaData() 
  {
    const response = await axios.get("https://opentdb.com/api.php?amount=1&category=21&difficulty=medium&type=multiple");
    setTriviaQuestion(response.data.results);
    setCorrectAnswer(response.data.results[0].correct_answer);

    //Calls combineAllAnswer function
    await combineAllAnswers(response.data.results, response.data.results[0].correct_answer);
  }

  //Displays question and answers
  useEffect(() => {getTriviaData()}, []);

  //Function to combines correct and incorrect answers
  async function combineAllAnswers(incorrect, correct) 
  {
    let allAnswers = [];
    incorrect.map((item) => {
      item.incorrect_answers.map((incorrect) => {
        allAnswers.push(incorrect)
      });
    });
    allAnswers.push(correct);
    //Randomize order otherwise answer will always be last
    allAnswers.sort(() => Math.random() - 0.5);
    setAllPossibleAnswers(allAnswers);
  }

  function checkAnswer(Answer)
   {
    if (Answer === correct)
    {
      getTriviaData();
      setResult("Correct! Try this one now");
    } 
    else 
    {
      setResult("Incorrect! Try Again");
    }
  }

  //Formatting 
  function showQuestion(question)
  {
    return question.replace(/(&quot;)/g, "\"").replace(/(&#039;)/g, "\'");
  }

  return (
    <div className="App">
      <header className="App-screen">
        { <div>
          <div>
            {result}
          </div>
          <br />

          {triviaQuestion.map((trivia) =>
            <div key={trivia}>
              <div>
                {showQuestion(trivia.question)}
              </div>
              <br />
              <div>
                {
                  allPossibleAnswers.map((answer) =>
                    <div key={answer}>
                      <Button key={answer} onClick={() => checkAnswer(answer)} >
                        {showQuestion(answer)}
                        </Button>
                    </div>
                  )
                }
              </div>
            </div>)
          }
        </div>
        }
      </header>
    </div>
  );
}

export default App;
