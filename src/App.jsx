import React, { useMemo, useState } from 'react';
import CategoryTabs from './components/CategoryTabs.jsx';
import Footer from './components/Footer.jsx';
import GameCard from './components/GameCard.jsx';
import GamePlayer from './components/GamePlayer.jsx';
import Header from './components/Header.jsx';
import { games } from './data/games.js';

export default function App() {
  const [audience, setAudience] = useState('kids');
  const [category, setCategory] = useState('All games');
  const [search, setSearch] = useState('');
  const [selectedGame, setSelectedGame] = useState(null);

  const audienceGames = useMemo(() => games.filter((game) => game.audience === audience), [audience]);
  const categories = useMemo(() => ['All games', ...new Set(audienceGames.map((game) => game.category))], [audienceGames]);
  const visibleGames = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    return audienceGames.filter((game) => {
      const matchesCategory = category === 'All games' || game.category === category;
      const searchableText = [game.title, game.category, game.description, ...game.tags].join(' ').toLowerCase();
      return matchesCategory && (!normalizedSearch || searchableText.includes(normalizedSearch));
    });
  }, [audienceGames, category, search]);

  function changeAudience(nextAudience) {
    setAudience(nextAudience);
    setCategory('All games');
    setSearch('');
  }

  return (
    <div className={`app-shell audience-${audience}`} id="top">
      <Header audience={audience} onAudienceChange={changeAudience} search={search} onSearch={setSearch} />

      <main>
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-copy">
            <span className="hero-kicker"><span className="live-dot" /> YOUR NEXT FAVORITE GAME IS HERE</span>
            <h1 id="hero-title">Big fun.<br /><span>Bright ideas.</span></h1>
            <p>Play colorful learning adventures for kids and hand-picked, feel-good games for grown-ups.</p>
            <a className="hero-button" href="#games">Explore games <span aria-hidden="true">↓</span></a>
            <div className="hero-stats" aria-label="Game collections">
              <span><b>08</b> kids' games</span><i /> <span><b>05</b> grown-up picks</span>
            </div>
          </div>
          <div className="hero-art" aria-hidden="true">
            <span className="hero-orbit orbit-one" />
            <span className="hero-orbit orbit-two" />
            <span className="hero-star star-a">✦</span>
            <span className="hero-star star-b">✧</span>
            <span className="hero-star star-c">✦</span>
            <img className="hero-3d-image" src="/images/arcade-hero.svg" alt="" />
            <span className="float-pill pill-left">PLAY + LEARN</span>
            <span className="float-pill pill-right">LEVEL UP!</span>
          </div>
        </section>

        <section className="collection-section" id="games" aria-labelledby="collection-title">
          <div className="section-heading">
            <div>
              <p className="eyebrow">PICK YOUR PLAYGROUND</p>
              <h2 id="collection-title">Games for <span>{audience === 'kids' ? 'curious kids' : 'grown-ups'}</span></h2>
              <p className="section-description">
                {audience === 'kids'
                  ? 'Learning feels like play with these colorful, kid-friendly picks.'
                  : 'A hand-picked mix of friendly adventures, puzzles, and strategy games.'}
              </p>
            </div>
            <span className="collection-count">{audienceGames.length} PICKS <span aria-hidden="true">✦</span></span>
          </div>

          <CategoryTabs categories={categories} selected={category} onSelect={setCategory} />

          {search && <p className="results-message" aria-live="polite">{visibleGames.length} {visibleGames.length === 1 ? 'game' : 'games'} found for “{search}”</p>}
          {visibleGames.length ? (
            <div className="game-grid">
              {visibleGames.map((game) => <GameCard key={game.id} game={game} onOpen={setSelectedGame} />)}
            </div>
          ) : (
            <div className="empty-state">
              <span aria-hidden="true">🕵️</span>
              <h3>No games found</h3>
              <p>Try another search or choose a different category.</p>
              <button type="button" onClick={() => { setSearch(''); setCategory('All games'); }}>Show all games</button>
            </div>
          )}
        </section>

        <section className="safe-play-banner" aria-label="Our play promise">
          <span className="safe-icon" aria-hidden="true">🧡</span>
          <div><h2>Good games. Good vibes.</h2><p>Every pick is a general-audience game. Kids’ learning games and grown-up favorites each have their own collection.</p></div>
          <span className="banner-spark" aria-hidden="true">✦</span>
        </section>
      </main>

      <Footer onAudienceChange={changeAudience} />
      {selectedGame && <GamePlayer key={selectedGame.id} game={selectedGame} onClose={() => setSelectedGame(null)} />}
    </div>
  );
}
