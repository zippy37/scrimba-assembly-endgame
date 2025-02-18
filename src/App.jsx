import { useState } from "react"
import { languages } from "./languages.js"
import { clsx } from "clsx"
import { getFarewellText, getRandomWord } from "./utils.js"
import Confetti from "react-confetti"

export default function AssemblyEndgame() {

	// state values 
	const [currentWord, setCurrentWord] = useState(() => getRandomWord())
	
	const [guessedLetters, setGuessedLetters] = useState([])


	const numGuessesLeft = languages.length - 1
	const wrongGuessCount = guessedLetters.filter(letter =>
		!currentWord.includes(letter)).length
	
	// game logic
	const isGameWon = currentWord.split("").every(letter => guessedLetters.includes(letter))
	const isGameLost = wrongGuessCount >= numGuessesLeft ;

	const isGameOver = isGameWon || isGameLost

	const lastGuessedLetter = guessedLetters[guessedLetters.length - 1]
    const isLastGuessIncorrect = lastGuessedLetter && !currentWord.includes(lastGuessedLetter)

	function addGuessedLetter(letter) {
		setGuessedLetters(prevLetters => 
			prevLetters.includes(letter) ?
				prevLetters : [...prevLetters, letter]
		)
	}

	
	// create the keyboard
	const alphabet = "abcdefghijklmnopqrstuvwxyz"

	const keyboardElements = alphabet.split("").map(letter => {

		const isGuessed = guessedLetters.includes(letter)
		const isCorrect = isGuessed && currentWord.includes(letter)
		const isWrong = isGuessed && !currentWord.includes(letter)
		const className = clsx({
			correct: isCorrect,
			wrong: isWrong
		})


		return (
			<button
				className={className}
				key={letter}
				disabled={isGameOver}
				aria-disabled={guessedLetters.includes(letter)}
				aria-label={`Letter ${letter}`}
				onClick={() => addGuessedLetter(letter)}
			>
				{letter.toUpperCase()}
			</button>
		)
	});

	// create the list of programming languages
	const languageElements = languages.map((lang, index) => {
		const isLanguageLost = index < wrongGuessCount
		const languageStyles = {
			backgroundColor: lang.backgroundColor,
			color: lang.color
		}
		const className = clsx("language-chip", isLanguageLost && "lost")
		return (
			<span
				className={className}
				key={lang.name}
				style={languageStyles}
			>
				{lang.name}
			</span>
		)
	})

	// create the current guess word
	const letterElements = currentWord.split("").map((letter, index) => {
		
		const shouldRevealLetter = isGameLost || guessedLetters.includes(letter)
		const letterClassName = clsx(
			isGameLost && !guessedLetters.includes(letter) && "missed-letters"
		)
		return (
			<span
				className={letterClassName}
				key={index}>
				{shouldRevealLetter ? letter.toUpperCase() : ""}
			</span>
		)
	})

	const gameStatusClass = clsx("game-status", {
        won: isGameWon,
		lost: isGameLost,
		farewell: !isGameOver && isLastGuessIncorrect
	})
	
	function renderGameStatus() {
		if (!isGameOver && isLastGuessIncorrect) {
			return (
				<p className="farewell-message">
					{getFarewellText(languages[wrongGuessCount - 1].name)}
				</p>
			)
		}

		if (isGameWon) {
			return (
				<>
                    <h2>You win!</h2>
                    <p>Well done! 🎉</p>
                </>
			)

		} if (isGameLost) {
			return (
				<>
                    <h2>Game over!</h2>
                    <p>You lose! Better start learning Assembly 😭</p>
                </>
			)
		}

		return null
	}

	function startNewGame() {
		setGuessedLetters([])
		setCurrentWord(getRandomWord())
	}

	

    return (
		<main>
			{isGameWon &&
				<Confetti
					recycle={false}
					numberOfPieces={1000}/>}
			<header>
				<h1>Assembly: Endgame</h1>
				<p>Guess the word within 8 attempts to keep the 
				programming word safe from Assembly!</p>
			</header>

			<section
				aria-live="polite"
				role="status"
				className={gameStatusClass}
			>
                {renderGameStatus()}
			</section>

			<section className="language-chips-container">
				{languageElements}
			</section>

			<section className="word-container">
				{letterElements}
			</section>

			{/* Combined visually-hidden aria-live region for status updates */}

			<section
				className="sr-only"
				aria-live="polite"
				role="status"
			>
				<p>
					{currentWord.includes(lastGuessedLetter)
						? `Correct! The letter
						${lastGuessedLetter} is in the word.` :
						`Sorry, the letter ${lastGuessedLetter} is not in the word.`}
					You have {numGuessesLeft} attempts left.
				</p>
				<p>
					Current word: {currentWord.split("").map(letter =>
						guessedLetters.includes(letter) + "." ? letter : "blank").join("")}
				</p>
			</section>

			<section className="keyboard-container">
				{keyboardElements}
			</section>

			{isGameOver &&
				<button className="new-game-button"
					onClick={startNewGame}>New Game</button>}
        </main>
    )
}