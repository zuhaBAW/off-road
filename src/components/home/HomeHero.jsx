import React from "react";
import "./hero.css";

/**
 * Clean hero matching the provided mock:
 * - OFF-ROAD (SGlitch), Adventure (script)
 * - Tagline pill
 * - Fully responsive
 * - No login block (we'll add a separate modal later)
 */
export default function HomeHero() {
  return (
    <div className="home-hero">
      <div className="home-hero__inner">
        <header className="home-hero__copy" aria-label="Off-road hero">
          <h1 className="home-hero__title">OFF-ROAD</h1>
          <h2 className="home-hero__script">Adventure</h2>

          <div className="home-hero__tag">
            <span>One Tribe, Endless Trails</span>
          </div>
        </header>
      </div>
    </div>
  );
}
