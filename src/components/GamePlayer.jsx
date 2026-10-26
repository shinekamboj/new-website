import React, { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react';
import { challenges } from '../data/challenges.js';
import MathVisualizer from './games/MathVisualizer.jsx';

const TurboTrack = lazy(() => import('./games/TurboTrack.jsx'));
const GemRunner3D = lazy(() => import('./games/GemRunner3D.jsx'));

function Quiz({ challenge, onComplete }) {
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
        onComplete?.({ score, total: challenge.questions.length, metric: 'correctAnswers' });
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
      {question.image && (
        <figure className={`question-visual-scene question-scene-${question.imageTheme || 'dino'}`}>
          <span className="question-scene-orbit orbit-a" aria-hidden="true" />
          <span className="question-scene-orbit orbit-b" aria-hidden="true" />
          <span className="question-scene-spark spark-a" aria-hidden="true">✦</span>
          <img className="question-visual-image" src={question.image} alt={question.imageAlt} />
          <figcaption>{question.imageCaption}</figcaption>
        </figure>
      )}
      {question.visual && <MathVisualizer key={question.prompt} visual={question.visual} />}
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

function WordGame({ challenge, onComplete }) {
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
    if (round === challenge.rounds.length - 1) {
      onComplete?.({ score, total: challenge.rounds.length, metric: 'correctWords' });
      setFinished(true);
    }
    else { setRound((value) => value + 1); setWord(''); setChecked(false); }
  }

  function restart() { setRound(0); setWord(''); setChecked(false); setScore(0); setFinished(false); }
  if (finished) return <Result score={score} total={challenge.rounds.length} onRestart={restart} />;

  return (
    <form className="challenge-panel word-panel" onSubmit={checkWord}>
      <div className="challenge-progress"><span>WORD {round + 1} / {challenge.rounds.length}</span><span>⭐ {score} points</span></div>
      <div className={`word-visual-scene word-scene-${current.answer}`}>
        <span className="word-scene-orbit orbit-a" aria-hidden="true" />
        <span className="word-scene-orbit orbit-b" aria-hidden="true" />
        <span className="word-scene-spark spark-a" aria-hidden="true">✦</span>
        <span className="word-scene-spark spark-b" aria-hidden="true">✧</span>
        <img className="word-visual-image" src={current.image} alt={current.imageAlt} />
        <span className="word-scene-caption">LOOK · THINK · UNSCRAMBLE</span>
      </div>
      <div className="scramble-word" aria-label={`Mixed-up letters: ${current.mixed}`}>{current.mixed}</div>
      <p className="word-hint">Hint: {current.hint}</p>
      <label className="sr-only" htmlFor="word-answer">Your word</label>
      <input id="word-answer" className="word-input" value={word} onChange={(event) => setWord(event.target.value)} placeholder="Type your word..." autoComplete="off" disabled={checked} />
      {checked && <div className={`answer-feedback ${isCorrect ? 'good' : 'try-again'}`} aria-live="polite">{isCorrect ? '✨ You got it!' : `The word was “${current.answer}”. Keep learning!`}</div>}
      {!checked ? <button className="confirm-button game-next" type="submit" disabled={!word.trim()}>Check word <span aria-hidden="true">→</span></button> : <button className="confirm-button game-next" type="button" onClick={next}>{round === challenge.rounds.length - 1 ? 'See score' : 'Next word'} <span aria-hidden="true">→</span></button>}
    </form>
  );
}

function ReflexGame({ onComplete }) {
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
      const elapsed = Math.round(performance.now() - startTime.current);
      setReaction(elapsed);
      setStatus('result');
      onComplete?.({ score: elapsed, total: null, metric: 'reactionMs' });
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

function StoryGame({ challenge, onComplete }) {
  const [result, setResult] = useState(null);
  return (
    <div className="challenge-panel story-panel">
      <p className="challenge-progress">YOUR ADVENTURE <span>🗺️</span></p>
      <h3 className="challenge-prompt">{challenge.prompt}</h3>
      {!result ? <div className="answer-grid">{challenge.choices.map((choice) => <button className="answer-option story-option" type="button" key={choice.label} onClick={() => { setResult(choice.result); onComplete?.({ score: 1, total: challenge.choices.length, metric: 'storyChoice', details: { ending: choice.label } }); }}>{choice.label}</button>)}</div> : <div className="story-ending" role="status"><span>✨</span><p>{result}</p><button className="confirm-button" type="button" onClick={() => setResult(null)}>Play again ↻</button></div>}
    </div>
  );
}

function ResourceGame({ onComplete }) {
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
    if (nextEnergy >= 7) {
      setStatus('won');
      onComplete?.({ score: nextEnergy, total: 7, metric: 'energy', details: { outcome: 'won', turns: nextTurns } });
    } else if (nextTurns >= 3) {
      setStatus('lost');
      onComplete?.({ score: nextEnergy, total: 7, metric: 'energy', details: { outcome: 'lost', turns: nextTurns } });
    }
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

function StarCatcherGame({ onComplete }) {
  const canvasRef = useRef(null);
  const keys = useRef(new Set());
  const shipX = useRef(320);
  const items = useRef([]);
  const scoreRef = useRef(0);
  const livesRef = useRef(3);
  const completedRef = useRef(false);
  const [status, setStatus] = useState('ready');
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [seconds, setSeconds] = useState(30);

  function finishGame() {
    if (completedRef.current) return;
    completedRef.current = true;
    setStatus('over');
    onComplete?.({ score: scoreRef.current, total: null, metric: 'stars', details: { livesRemaining: livesRef.current } });
  }

  function start() {
    shipX.current = 320;
    items.current = [];
    scoreRef.current = 0;
    livesRef.current = 3;
    completedRef.current = false;
    setScore(0);
    setLives(3);
    setSeconds(30);
    setStatus('playing');
  }

  useEffect(() => {
    if (status !== 'playing') return undefined;
    const timer = window.setInterval(() => {
      setSeconds((value) => {
        if (value <= 1) {
          finishGame();
          return 0;
        }
        return value - 1;
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, [status]);

  useEffect(() => {
    if (status !== 'playing') return undefined;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    let frame;
    let lastTime = 0;
    let spawnTime = 0;
    const width = canvas.width;
    const height = canvas.height;

    function drawStar(x, y, radius) {
      context.beginPath();
      for (let point = 0; point < 10; point += 1) {
        const angle = (point * Math.PI) / 5 - Math.PI / 2;
        const size = point % 2 === 0 ? radius : radius * 0.43;
        const px = x + Math.cos(angle) * size;
        const py = y + Math.sin(angle) * size;
        if (point === 0) context.moveTo(px, py);
        else context.lineTo(px, py);
      }
      context.closePath();
      context.fill();
    }

    function tick(now) {
      const delta = Math.min((now - (lastTime || now)) / 16.67, 2);
      lastTime = now;
      if (now - spawnTime > 720) {
        items.current.push({ x: 28 + Math.random() * (width - 56), y: -18, type: Math.random() < 0.68 ? 'star' : 'rock', speed: 2.1 + Math.random() * 1.6 });
        spawnTime = now;
      }
      if (keys.current.has('ArrowLeft') || keys.current.has('a')) shipX.current -= 5 * delta;
      if (keys.current.has('ArrowRight') || keys.current.has('d')) shipX.current += 5 * delta;
      shipX.current = Math.max(22, Math.min(width - 22, shipX.current));

      context.clearRect(0, 0, width, height);
      const sky = context.createLinearGradient(0, 0, 0, height);
      sky.addColorStop(0, '#17133f');
      sky.addColorStop(1, '#30205b');
      context.fillStyle = sky;
      context.fillRect(0, 0, width, height);
      context.fillStyle = 'rgba(255,255,255,.55)';
      for (let i = 0; i < 34; i += 1) {
        const x = (i * 97 + 31) % width;
        const y = (i * 53 + Math.floor(now / 70)) % height;
        context.fillRect(x, y, 2, 2);
      }

      items.current = items.current.filter((item) => {
        item.y += item.speed * delta;
        if (Math.abs(item.x - shipX.current) < 25 && item.y > height - 78 && item.y < height - 26) {
          if (item.type === 'star') {
            scoreRef.current += 1;
            setScore(scoreRef.current);
          } else {
            livesRef.current -= 1;
            setLives(livesRef.current);
            if (livesRef.current <= 0) finishGame();
          }
          return false;
        }
        context.fillStyle = item.type === 'star' ? '#ffdf72' : '#aeb7d8';
        if (item.type === 'star') drawStar(item.x, item.y, 12);
        else {
          context.beginPath();
          context.arc(item.x, item.y, 12, 0, Math.PI * 2);
          context.fill();
          context.fillStyle = '#717c9e';
          context.beginPath();
          context.arc(item.x - 4, item.y - 3, 3, 0, Math.PI * 2);
          context.fill();
        }
        return item.y < height + 20;
      });

      context.fillStyle = '#8de8ff';
      context.beginPath();
      context.moveTo(shipX.current, height - 70);
      context.lineTo(shipX.current - 20, height - 34);
      context.lineTo(shipX.current + 20, height - 34);
      context.closePath();
      context.fill();
      context.fillStyle = '#ff9d69';
      context.beginPath();
      context.moveTo(shipX.current - 8, height - 32);
      context.lineTo(shipX.current, height - 19 - Math.random() * 6);
      context.lineTo(shipX.current + 8, height - 32);
      context.fill();
      if (status === 'playing') frame = window.requestAnimationFrame(tick);
    }

    frame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frame);
  }, [status]);

  useEffect(() => {
    function handleKeyDown(event) {
      const key = event.key.toLowerCase();
      if (['arrowleft', 'arrowright', 'a', 'd'].includes(key)) {
        event.preventDefault();
        keys.current.add(key === 'arrowleft' ? 'ArrowLeft' : key === 'arrowright' ? 'ArrowRight' : key);
      }
    }
    function handleKeyUp(event) {
      const key = event.key.toLowerCase();
      keys.current.delete(key === 'arrowleft' ? 'ArrowLeft' : key === 'arrowright' ? 'ArrowRight' : key);
    }
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  function hold(direction, pressed) {
    const key = direction === 'left' ? 'ArrowLeft' : 'ArrowRight';
    if (pressed) keys.current.add(key);
    else keys.current.delete(key);
  }

  return (
    <div className="challenge-panel arcade-panel">
      <div className="challenge-progress"><span>⭐ {score} STARS</span><span>❤️ {lives} · ⏱ {seconds}s</span></div>
      <canvas ref={canvasRef} className="arcade-canvas" width="640" height="360" aria-label="Star Catcher space game. Move the rocket to catch stars and avoid rocks." />
      {status !== 'playing' && <div className="arcade-overlay" role="status"><strong>{status === 'ready' ? 'Ready for takeoff?' : `Time’s up! You caught ${score} stars!`}</strong><button className="confirm-button" type="button" onClick={start}>{status === 'ready' ? 'Start game 🚀' : 'Play again ↻'}</button></div>}
      <div className="arcade-controls" aria-label="Rocket movement controls">
        <button type="button" aria-label="Move left" onPointerDown={() => hold('left', true)} onPointerUp={() => hold('left', false)} onPointerLeave={() => hold('left', false)}>←</button>
        <span>Move your rocket</span>
        <button type="button" aria-label="Move right" onPointerDown={() => hold('right', true)} onPointerUp={() => hold('right', false)} onPointerLeave={() => hold('right', false)}>→</button>
      </div>
      <p className="arcade-help">Catch ⭐ stars · Dodge 🪨 rocks · Use arrow keys or touch buttons</p>
    </div>
  );
}

export default function GamePlayer({ game, user, onSaveResult, onClose }) {
  const challenge = challenges[game.id];
  const [saveStatus, setSaveStatus] = useState('');

  const onComplete = useCallback((result) => {
    if (!user?.uid || !onSaveResult) return;
    setSaveStatus('saving');
    onSaveResult(game, result).then(
      () => setSaveStatus('saved'),
      (error) => {
        console.error('Could not save game result:', error);
        setSaveStatus('error');
      },
    );
  }, [game, onSaveResult, user?.uid]);

  useEffect(() => {
    function closeOnEscape(event) { if (event.key === 'Escape') onClose(); }
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [onClose]);

  if (!challenge) return null;
  const gameContent = {
    quiz: <Quiz challenge={challenge} onComplete={onComplete} />,
    word: <WordGame challenge={challenge} onComplete={onComplete} />,
    reflex: <ReflexGame onComplete={onComplete} />,
    story: <StoryGame challenge={challenge} onComplete={onComplete} />,
    resource: <ResourceGame onComplete={onComplete} />,
    arcade: <StarCatcherGame onComplete={onComplete} />,
    racing: <Suspense fallback={<div className="challenge-panel">Loading Turbo Track…</div>}><TurboTrack onComplete={onComplete} /></Suspense>,
    'three-dimensional': <Suspense fallback={<div className="challenge-panel">Loading 3D game…</div>}><GemRunner3D onComplete={onComplete} /></Suspense>,
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
        <small>{user ? saveStatus === 'saving' ? 'Saving your result to Firebase…' : saveStatus === 'saved' ? '☁ Result saved to your Firebase account.' : saveStatus === 'error' ? 'Result could not be saved. Check Firestore rules and try again.' : 'Your finished game results sync to your Firebase account.' : 'Just for fun. Log in to save your game results.'}</small>
      </section>
    </div>
  );
}
