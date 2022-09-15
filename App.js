import React from "react"
import Die from "./Die"
import {nanoid} from "nanoid"
import Confetti from "react-confetti"

export default function App() {

    const [dice, setDice] = React.useState(allNewDice())
    const [tenzies, setTenzies] = React.useState(false)
    const [language, setLanguage] = React.useState(true)
    const [rolls, setRolls] = React.useState(0)
    const bestScore = localStorage.getItem('bestRollsScore');
    
    React.useEffect(() => {
        const allHeld = dice.every(die => die.isHeld)
        const firstValue = dice[0].value
        const allSameValue = dice.every(die => die.value === firstValue)
        if (allHeld && allSameValue) {
            setTenzies(true)
            saveBestScore()
            
        }
    }, [dice])

    function generateNewDie() {
        return {
            value: Math.ceil(Math.random() * 6),
            isHeld: false,
            id: nanoid()
        }
    }
    
    function allNewDice() {
        const newDice = []
        for (let i = 0; i < 10; i++) {
            newDice.push(generateNewDie())
        }
        return newDice
    }
    
    function saveBestScore() {
        if(bestScore > rolls || bestScore === null) {
            localStorage.setItem('bestRollsScore', rolls);    
        }
    }
    
    function rollDice() {
        if(!tenzies) {
            setDice(oldDice => oldDice.map(die => {
                return die.isHeld ? 
                    die :
                    generateNewDie()
            }))
            setRolls(prevState => prevState + 1)
        } else {
            setTenzies(false)
            setDice(allNewDice())
            setRolls(0)
        }
    }
    
    function holdDice(id) {
        setDice(oldDice => oldDice.map(die => {
            return die.id === id ? 
                {   value: die.value,
                    id: die.id, 
                    isHeld: !die.isHeld} :
                die
        }))
    }
    
    function changeLanguage() {
        setLanguage(prevState => !prevState)
    }
    
    const diceElements = dice.map(die => (
        <Die 
            key={die.id} 
            value={die.value} 
            isHeld={die.isHeld} 
            holdDice={() => holdDice(die.id)}
        />
    ))
    
    return (
        <main>
            {tenzies && <Confetti
            width={window.innerWidth}
            height={window.innerHeight} />}
            <div className="header">
                <h1 className="title">
                    {language ? "Tenzies" : "Kocky"}
                </h1>
                <button className="btn-language" onClick={changeLanguage}>
                    {language ? "SK" : "EN"}
                </button>
            </div>
            <p className="instructions">
                {language ? "Roll until all dice are the same. Click each die to freeze it at its current value between rolls." :
                "Hádž kocky, kým nebudú všetky rovnaké. Kliknutím na kocku zamrazíš jej hodnotu."
                }
            </p>
            <div className="rolls">
                <p className="roll-score">
                    {language ? "Rolls:" : "Počet hodov:"} {rolls}
                </p>
                <p className="roll-score">
                    {language ? "Best rolls:" : "Najlepšie skóre"} {bestScore}
                </p>
            </div>
            <div className="dice-container">
                {diceElements}
            </div>
            {language ? <button 
                className="roll-dice" 
                onClick={rollDice}
            >
                {tenzies ? "New Game" : "Roll"}
            </button> : 
            <button 
                className="roll-dice" 
                onClick={rollDice}
            >
                {tenzies ? "Nová hra" : "Hoď kocky"}
            </button>}
        </main>
    )
}