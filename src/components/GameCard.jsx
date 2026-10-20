import React from 'react';

export default function GameCard({ game, onOpen }) {
  return (
    <article className="game-card">
      <div className={`game-art art-${game.color}`} aria-hidden="true">
        <span className="art-spark spark-one">✦</span>
        <span className="art-spark spark-two">✧</span>
        <span className="game-emoji">{game.emoji}</span>
        <span className="game-age">{game.age}</span>
      </div>
      <div className="game-info">
        <div className="game-meta">
          <span className="game-category">{game.category}</span>
          <span className="game-rating" aria-label="Curated game pick">★ <span>Pick</span></span>
        </div>
        <h3>{game.title}</h3>
        <p>{game.description}</p>
        <button className="play-button" type="button" onClick={() => onOpen(game)}>
          Play now <span aria-hidden="true">▶</span>
        </button>
      </div>
    </article>
  );
}
