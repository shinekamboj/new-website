import React, { useEffect, useState } from 'react';

function Cube({ index, color, removed, counted }) {
  return (
    <span className={`math-cube ${color} ${counted ? 'counted' : ''} ${removed ? 'removed' : ''}`} style={{ '--cube-delay': `${(index % 7) * 75}ms` }} aria-hidden="true">
      <span className="cube-face cube-front" />
      <span className="cube-face cube-top" />
      <span className="cube-face cube-side" />
      {removed && <span className="cube-removed-mark">×</span>}
    </span>
  );
}

export default function MathVisualizer({ visual }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    setCount(0);
    const timer = window.setInterval(() => {
      setCount((current) => (current >= visual.total ? 1 : current + 1));
    }, 380);
    return () => window.clearInterval(timer);
  }, [visual]);

  const countText = visual.type === 'multiply'
    ? `${visual.groups} groups × ${visual.perGroup} cubes`
    : visual.type === 'subtract'
      ? `${visual.total} cubes − ${visual.takeAway} = ${visual.result} left`
      : `${visual.groups[0]} cubes + ${visual.groups[1]} cubes`;

  return (
    <section className={`math-visual math-visual-${visual.type}`} aria-label={`Animated 3D counting visual: ${countText}`}>
      <div className="math-visual-topline">
        <span>🚀 COUNT ALONG</span>
        <span className="math-count-badge">{count || 1} / {visual.total}</span>
      </div>
      <div className="math-equation" aria-hidden="true">{visual.equation} <span>= ?</span></div>
      {visual.type === 'add' && (
        <div className="math-add-groups">
          {visual.groups.map((amount, groupIndex) => {
            const start = visual.groups.slice(0, groupIndex).reduce((sum, value) => sum + value, 0);
            return (
              <React.Fragment key={`${amount}-${groupIndex}`}>
                {groupIndex > 0 && <span className="math-operator" aria-hidden="true">+</span>}
                <div className={`math-pile pile-${groupIndex ? 'mint' : 'violet'}`}>
                  <div className="math-cube-grid" style={{ '--cube-columns': Math.min(amount, 6) }}>
                    {Array.from({ length: amount }, (_, index) => <Cube key={index} index={index} color={groupIndex ? 'cube-mint' : 'cube-violet'} counted={start + index < count} />)}
                  </div>
                  <span className="math-pile-label">{amount} blocks</span>
                </div>
              </React.Fragment>
            );
          })}
          <span className="math-operator" aria-hidden="true">=</span>
          <div className="math-result-pile">
            <strong className={`math-result-number ${count >= visual.total ? 'revealed' : ''}`}>{visual.result}</strong>
            <span className="math-pile-label">blocks together</span>
          </div>
        </div>
      )}
      {visual.type === 'subtract' && (
        <div className="math-subtract-stage">
          <div className="math-cube-grid subtraction-grid" style={{ '--cube-columns': 6 }}>
            {Array.from({ length: visual.total }, (_, index) => <Cube key={index} index={index} color={index < visual.takeAway ? 'cube-coral' : 'cube-mint'} removed={index < visual.takeAway} counted={index < count} />)}
          </div>
          <div className="math-subtract-caption"><span className="take-away-key">× {visual.takeAway} fly away</span><span className="left-key">✓ {visual.result} stay</span></div>
        </div>
      )}
      {visual.type === 'multiply' && (
        <div className="math-multiplication-stage">
          {Array.from({ length: visual.groups }, (_, groupIndex) => (
            <div className="math-multiply-group" key={groupIndex}>
              <span className="math-group-number">{groupIndex + 1}</span>
              <div className="math-cube-grid" style={{ '--cube-columns': visual.perGroup }}>
                {Array.from({ length: visual.perGroup }, (_, cubeIndex) => {
                  const index = groupIndex * visual.perGroup + cubeIndex;
                  return <Cube key={cubeIndex} index={index} color="cube-blue" counted={index < count} />;
                })}
              </div>
            </div>
          ))}
          <span className="math-operator" aria-hidden="true">=</span>
          <div className="math-result-pile">
            <strong className={`math-result-number ${count >= visual.total ? 'revealed' : ''}`}>{visual.result}</strong>
            <span className="math-pile-label">blocks total</span>
          </div>
        </div>
      )}
      <div className="math-count-track" aria-hidden="true"><span style={{ width: `${((count || 1) / visual.total) * 100}%` }} /></div>
      <p className="math-visual-hint">{visual.hint}</p>
    </section>
  );
}
