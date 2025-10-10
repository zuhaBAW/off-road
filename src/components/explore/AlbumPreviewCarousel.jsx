import React, { useEffect, useRef, useState } from "react";
import "./albumPreviewCarousel.css";

/**
 * Horizontally scrollable album row with:
 * - visible left/right chevrons
 * - swipe hint on touch
 * - short, elegant cards
 */
export default function AlbumPreviewCarousel({ albums = [], onAlbumClick }) {
  const scrollerRef = useRef(null);
  const [canL, setCanL] = useState(false);
  const [canR, setCanR] = useState(false);
  const [showHint, setShowHint] = useState(false);

  // show "Swipe →" on touch devices (first render)
  useEffect(() => {
    const isTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
    if (isTouch) setShowHint(true);
  }, []);

  // update arrow enablement
  const update = () => {
    const el = scrollerRef.current;
    if (!el) return;
    setCanL(el.scrollLeft > 0);
    setCanR(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  };
  useEffect(() => {
    update();
    const el = scrollerRef.current;
    if (!el) return;
    el.addEventListener("scroll", update, { passive: true });
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", update);
      ro.disconnect();
    };
  }, [albums]);

  const scrollBy = (dir) => {
    const el = scrollerRef.current;
    if (!el) return;
    const card = el.querySelector(".album-preview-card");
    const dx = (card?.clientWidth || 260) + 16;
    el.scrollBy({ left: dir * dx, behavior: "smooth" });
    setShowHint(false);
  };

  const onInteract = () => setShowHint(false);

  return (
    <div className="album-row">
      <button
        className="row-arrow left"
        onClick={() => scrollBy(-1)}
        disabled={!canL}
        aria-label="Scroll left"
      >
        ‹
      </button>

      <div
        ref={scrollerRef}
        className="album-scroller"
        onWheel={(e) => {
          // turn vertical wheel to horizontal scroll for desktop
          if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
            e.preventDefault();
            scrollerRef.current?.scrollBy({
              left: e.deltaY,
              behavior: "smooth",
            });
          }
          onInteract();
        }}
        onTouchStart={onInteract}
        onMouseDown={onInteract}
      >
        {albums.map((album, idx) => (
          <div
            key={idx}
            className="album-preview-card"
            onClick={() => onAlbumClick?.(album)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && onAlbumClick?.(album)}
          >
            <img src={album.images?.[0]} alt={album.name} />
            <div className="album-overlay">
              <span className="album-name">{album.name}</span>
              <span className="album-cta">View</span>
            </div>
          </div>
        ))}
      </div>

      <button
        className="row-arrow right"
        onClick={() => scrollBy(1)}
        disabled={!canR}
        aria-label="Scroll right"
      >
        ›
      </button>

      {showHint && (
        <div className="swipe-hint" onClick={() => setShowHint(false)}>
          Swipe →
        </div>
      )}
    </div>
  );
}
