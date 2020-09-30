import React, { useState, useEffect, useRef } from 'react';
import FlashcardList from './FlashCardList'
import './App.css'
import axios from 'axios'
import {   Label, Input, FormText } from 'reactstrap';
import {Button ,FormGroup,Form} from 'react-bootstrap'

function App() {
  const [flashcards, setFlashcards] = useState([])
  const [categories, setCategories] = useState([])
 

  const categoryEl = useRef()
  const amountEl = useRef()


  useEffect(() => {
    axios
      .get('https://opentdb.com/api_category.php')
      .then(res => {
        setCategories(res.data.trivia_categories)
      })
  }, [])

  useEffect(() => {
   
  }, [])
 

  function decodeString(str) {
 
    const textArea = document.createElement('textarea')
    textArea.innerHTML= str
    return textArea.value
  }

 function handleSubmit(e) {
    e.preventDefault();
     axios 
    .get('https://opentdb.com/api.php', {
      params: {
        amount: amountEl.current.value,
        category: categoryEl.current.value,
        
      }
    })
  .then(res => {
  setFlashcards(res.data.results.map((questionItem, index) => {
        const answer = decodeString(questionItem.correct_answer)
        const options = [
          ...questionItem.incorrect_answers.map(a => decodeString(a)),
          answer
        ]
        return {
          id: `${index}-${Date.now()}`,
          // question: decodeString( index+1, questionItem.question),
          question: `${index+1}`+')' +decodeString(questionItem.question),
          answer: answer,
          options:  options.sort(() => Math.random() - .5)
        }
      }))
    })
   
  }

  return (
    <> 
  
      <Form className="header" onSubmit={handleSubmit}>
      <h1 className="title">Trivia App</h1>
    
    

   


        <div className="form-group">
         
          <label  id="cat" htmlFor="category">Category</label>
          <select id="category" ref={categoryEl}>
            {categories.map(category => {
              return <option value={category.id} key={category.id}>{category.name}</option>
            })}
          </select>
        </div> 
        
            <div className="form-group">
          <Label id="n" htmlFor="amount">Number of Questions</Label>
          <input type="number" id="am" min="1" step="1" defaultValue={10} ref={amountEl} />
        </div> 
      


          <button className="btn">Generate</button>
   
      </Form> 
      <div className="container">
        <FlashcardList flashcards={flashcards} />
      </div>
    </>
  );
}

export default App;