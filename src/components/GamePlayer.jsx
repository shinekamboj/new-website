import React, { useEffect, useRef, useState } from 'react';
import { challenges } from '../data/challenges.js';

function Quiz({ challenge }) {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [choice, setChoice] = useState(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const question = challenge.questions[questionIndex];

  function answer(index) {
    if (choice !== null) return;
    setChoice(index);
    if (index === question.answer) setScore((value) => value + 1);
  }

  function next() {
    if (questionIndex === challenge.questions.length - 1) {
      setFinished(true);
      return;
    }
    setQuestionIndex((value) => value + 1);
    setChoice(null);
  }

  function restart() {
    setQuestionIndex(0);
    setChoice(null);
    setScore(0);
    setFinished(false);
  }

  if (finished) return <Result score={score} total={challenge.questions.length} onRestart={restart} />;

  return (
    <div className="challenge-panel">
      <div className="challenge-progress"><span>QUESTION {questionIndex + 1} / {challenge.questions.length}</span><span>⭐ {score} points</span></div>
      <div className="progress-track"><span style={{ width: `${((questionIndex + 1) / challenge.questions.length) * 100}%` }} /></div>
      <h3 className="challenge-prompt">{question.prompt}</h3>
      <div className="answer-grid">
        {question.choices.map((answerText, index) => {
          const isCorrect = choice !== null && index === question.answer;
          const isWrong = choice === index && index !== question.answer;
          return <button className={`answer-option ${isCorrect ? 'correct' : ''} ${isWrong ? 'wrong' : ''}`} type="button" key={answerText} onClick={() => answer(index)} disabled={choice !== null}>{answerText}</button>;
        })}
      </div>
      {choice !== null && <div className={`answer-feedback ${choice === question.answer ? 'good' : 'try-again'}`} aria-live="polite">{choice === question.answer ? '✨ That’s right!' : '💡 Not quite.'} {question.tip}</div>}
      {choice !== null && <button className="confirm-button game-next" type="button" onClick={next}>{questionIndex === challenge.questions.length - 1 ? 'See score' : 'Next question'} <span aria-hidden="true">→</span></button>}
    </div>
  );
}

function Result({ score, total, onRestart }) {
  return (
    <div className="game-result" role="status">
      <span aria-hidden="true">{score === total ? '🏆' : score > 0 ? '🌟' : '💪'}</span>
      <h3>{score === total ? 'Amazing work!' : 'Nice playing!'}</h3>
      <p>You got <strong>{score} out of {total}</strong> right. Want another round?</p>
      <button className="confirm-button" type="button" onClick={onRestart}>Play again ↻</button>
    </div>
  );
}

function WordGame({ challenge }) {
  const [round, setRound] = useState(0);
  const [word, setWord] = useState('');
  const [checked, setChecked] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const current = challenge.rounds[round];
  const isCorrect = word.trim().toLowerCase() === current.answer;

  function checkWord(event) {
    event.preventDefault();
    if (!checked) {
      setChecked(true);
      if (isCorrect) setScore((value) => value + 1);
    }
  }

  function next() {
    if (round === challenge.rounds.length - 1) setFinished(true);
    else { setRound((value) => value + 1); setWord(''); setChecked(false); }
  }

  function restart() { setRound(0); setWord(''); setChecked(false); setScore(0); setFinished(false); }
  if (finished) return <Result score={score} total={challenge.rounds.length} onRestart={restart} />;

  return (
    <form className="challenge-panel word-panel" onSubmit={checkWord}>
      <div className="challenge-progress"><span>WORD {round + 1} / {challenge.rounds.length}</span><span>⭐ {score} points</span></div>
      <div className="scramble-word" aria-label={`Mixed-up letters: ${current.mixed}`}>{current.mixed}</div>
      <p className="word-hint">Hint: {current.hint}</p>
      <label className="sr-only" htmlFor="word-answer">Your word</label>
      <input id="word-answer" className="word-input" value={word} onChange={(event) => setWord(event.target.value)} placeholder="Type your word..." autoComplete="off" disabled={checked} />
      {checked && <div className={`answer-feedback ${isCorrect ? 'good' : 'try-again'}`} aria-live="polite">{isCorrect ? '✨ You got it!' : `The word was “${current.answer}”. Keep learning!`}</div>}
      {!checked ? <button className="confirm-button game-next" type="submit" disabled={!word.trim()}>Check word <span aria-hidden="true">→</span></button> : <button className="confirm-button game-next" type="button" onClick={next}>{round === challenge.rounds.length - 1 ? 'See score' : 'Next word'} <span aria-hidden="true">→</span></button>}
    </form>
  );
}

function ReflexGame() {
  const [status, setStatus] = useState('ready');
  const [reaction, setReaction] = useState(null);
  const startTime = useRef(0);
  const timer = useRef(null);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  function start() {
    window.clearTimeout(timer.current);
    setReaction(null);
    setStatus('waiting');
    timer.current = window.setTimeout(() => { startTime.current = performance.now(); setStatus('go'); }, 1300 + Math.random() * 1800);
  }

  function tap() {
    if (status === 'waiting') {
      window.clearTimeout(timer.current);
      setStatus('early');
    } else if (status === 'go') {
      setReaction(Math.round(performance.now() - startTime.current));
      setStatus('result');
    }
  }

  return (
    <div className="challenge-panel reflex-panel">
      <p className="challenge-progress">REACTION CHALLENGE <span>🏁</span></p>
      <button type="button" className={`reflex-zone ${status}`} onClick={status === 'ready' || status === 'early' || status === 'result' ? start : tap}>
        {status === 'ready' && 'Tap to start'}
        {status === 'waiting' && 'Wait for green...'}
        {status === 'go' && <><span>GO!</span><small>Tap now!</small></>}
        {status === 'early' && <>Too soon!<small>Tap to try again</small></>}
        {status === 'result' && <>{reaction} ms<small>Tap to race again</small></>}
      </button>
      <p className="reflex-help" aria-live="polite">{status === 'waiting' ? 'Hold steady—don’t tap yet!' : status === 'go' ? 'Quick! Tap the green zone!' : status === 'result' ? 'Great reflexes. Can you beat your time?' : 'Wait for green, then tap as fast as you can.'}</p>
    </div>
  );
}

function StoryGame({ challenge }) {
  const [result, setResult] = useState(null);
  return (
    <div className="challenge-panel story-panel">
      <p className="challenge-progress">YOUR ADVENTURE <span>🗺️</span></p>
      <h3 className="challenge-prompt">{challenge.prompt}</h3>
      {!result ? <div className="answer-grid">{challenge.choices.map((choice) => <button className="answer-option story-option" type="button" key={choice.label} onClick={() => setResult(choice.result)}>{choice.label}</button>)}</div> : <div className="story-ending" role="status"><span>✨</span><p>{result}</p><button className="confirm-button" type="button" onClick={() => setResult(null)}>Play again ↻</button></div>}
    </div>
  );
}

function ResourceGame() {
  const [energy, setEnergy] = useState(2);
  const [parts, setParts] = useState(0);
  const [turns, setTurns] = useState(0);
  const [status, setStatus] = useState('playing');

  function act(action) {
    if (status !== 'playing') return;
    let nextEnergy = energy;
    let nextParts = parts;
    if (action === 'parts') nextParts += 1;
    if (action === 'solar') nextEnergy += 1;
    if (action === 'battery' && nextParts > 0) { nextParts -= 1; nextEnergy += 4; }
    const nextTurns = turns + 1;
    setEnergy(nextEnergy); setParts(nextParts); setTurns(nextTurns);
    if (nextEnergy >= 7) setStatus('won');
    else if (nextTurns >= 3) setStatus('lost');
  }

  function restart() { setEnergy(2); setParts(0); setTurns(0); setStatus('playing'); }

  return (
    <div className="challenge-panel resource-panel">
      <p className="challenge-progress">STATION STATUS <span>🛰️</span></p>
      <div className="resource-stats"><span>⚡ Energy <b>{energy} / 7</b></span><span>🔩 Parts <b>{parts}</b></span><span>⏱ Moves <b>{turns} / 3</b></span></div>
      <div className="energy-track"><span style={{ width: `${Math.min((energy / 7) * 100, 100)}%` }} /></div>
      {status === 'playing' ? <div className="resource-actions"><button type="button" className="answer-option" onClick={() => act('parts')}>Collect parts <small>+1 part</small></button><button type="button" className="answer-option" onClick={() => act('solar')}>Charge solar <small>+1 energy</small></button><button type="button" className="answer-option" disabled={!parts} onClick={() => act('battery')}>Build battery <small>−1 part, +4 energy</small></button></div> : <div className="story-ending" role="status"><span>{status === 'won' ? '🎉' : '🔋'}</span><p>{status === 'won' ? 'Station powered! Your crew is ready for research.' : 'Almost! Try collecting parts, charging solar, then building a battery.'}</p><button className="confirm-button" type="button" onClick={restart}>Try again ↻</button></div>}
    </div>
  );
}

export default function GamePlayer({ game, onClose }) {
  const challenge = challenges[game.id];

  useEffect(() => {
    function closeOnEscape(event) { if (event.key === 'Escape') onClose(); }
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [onClose]);

  if (!challenge) return null;
  const gameContent = {
    quiz: <Quiz challenge={challenge} />,
    word: <WordGame challenge={challenge} />,
    reflex: <ReflexGame />,
    story: <StoryGame challenge={challenge} />,
    resource: <ResourceGame />,
  }[challenge.mode];

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <section className="age-modal player-modal" role="dialog" aria-modal="true" aria-labelledby="player-title">
        <button className="modal-close" type="button" aria-label="Close game" onClick={onClose}>×</button>
        <div className={`details-art art-${game.color}`} aria-hidden="true">{game.emoji}</div>
        <p className="eyebrow">{game.category} · {game.age}</p>
        <h2 id="player-title">{game.title}</h2>
        <p className="player-instructions">{challenge.instructions}</p>
        {gameContent}
        <small>Just for fun. No account or personal information needed.</small>
      </section>
    </div>
  );
}
