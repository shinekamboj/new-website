import React from 'react';

export default function GameCard({ game, onOpen }) {
  function openWithKeyboard(event) {
    if (event.target !== event.currentTarget || !['Enter', ' '].includes(event.key)) return;
    event.preventDefault();
    onOpen(game);
  }

  return (
    <article
      className="game-card"
      role="group"
      tabIndex={0}
      aria-label={`Open ${game.title}`}
      onClick={(event) => { if (!event.target.closest('button')) onOpen(game); }}
      onKeyDown={openWithKeyboard}
    >
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
        <button className="play-button" type="button" onClick={(event) => { event.stopPropagation(); onOpen(game); }}>
          Play now <span aria-hidden="true">▶</span>
        </button>
      </div>
    </article>
  );
}
