import React from 'react';
import CompressorSection from './components/CompressorSection';

const App = () => {
  return (
    <div className="page">
      <header className="hero">
        <div className="hero__content">
          <p className="eyebrow">Online image compressor</p>
          <h1>Compress images in seconds - no installs, no uploads to servers.</h1>
          <p className="lede">
            Drop your photos, tune the quality, and download lighter files while keeping clarity.
            Everything runs in your browser for privacy.
          </p>
          <div className="hero__actions">
            <a className="button primary" href="#compressor">Start compressing</a>
            <a className="button ghost" href="https://github.com/" target="_blank" rel="noreferrer">
              View on GitHub
            </a>
          </div>
          <div className="hero__stats">
            <div>
              <span className="stat__number">100%</span>
              <span className="stat__label">Browser-side</span>
            </div>
            <div>
              <span className="stat__number">No</span>
              <span className="stat__label">File tracking</span>
            </div>
            <div>
              <span className="stat__number">Unlimited</span>
              <span className="stat__label">Downloads</span>
            </div>
          </div>
        </div>
        <div className="hero__card">
          <div className="badge">Live preview</div>
          <h3>Upload • Adjust • Save</h3>
          <p className="small">Pick a file and see the compressed result instantly.</p>
          <ul className="checklist">
            <li>JPEG & PNG support</li>
            <li>Custom quality slider</li>
            <li>Optional resize</li>
            <li>One-click download</li>
          </ul>
          <a className="button primary block" href="#compressor">Try it now</a>
        </div>
      </header>

      <main>
        <section id="compressor" className="section">
          <div className="section__header">
            <p className="eyebrow">Compressor</p>
            <h2>Drop an image to shrink its size.</h2>
            <p className="lede">Adjust quality and dimensions, preview instantly, and download a lighter copy.</p>
          </div>
          <CompressorSection />
        </section>

        <section className="section alt">
          <div className="section__header">
            <p className="eyebrow">Why this tool</p>
            <h2>Fast, private, and simple.</h2>
            <p className="lede">No account, no uploads—just quick compression in your browser.</p>
          </div>
          <div className="grid features">
            <div className="card">
              <h3>Privacy-first</h3>
              <p>Everything stays on your device. The tool never sends your images to a server.</p>
            </div>
            <div className="card">
              <h3>Lightweight</h3>
              <p>Built with React and Vite for fast loads and snappy interactions.</p>
            </div>
            <div className="card">
              <h3>Custom controls</h3>
              <p>Quality slider, dimension limits, and instant before/after previews.</p>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <p>Built for quick demos. Swap the brand and ship.</p>
      </footer>
    </div>
  );
};

export default App;

