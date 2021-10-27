import React from 'react';
import { Button, Icon } from 'semantic-ui-react'
import "./index.scss";

export default function Index() {
  return (
    <main>
      <header>
        <h4>Moker</h4>
        <div>
          <Button primary as="a" href="/admin">Admin Panel</Button>
        </div>
      </header>
      {/* Hero Section */}
      <section id="hero">
        {/* Logo */}
        <h1>Moker</h1>
        <p>Easily intergerate with your exist Web app, <br /> Only use a Serverless/Self-host server and Brower Plugin!</p>
      </section>
      {/* Feature Section */}
      <section id="feature">
        <div>
          <h3>🖥️ Open Source Server</h3>
          <p>Server side codes are totally open sourced, supports "Self-host" and "Cloudflare Worker" deploy. Configuration is pretty simple.</p>
        </div>
        <div>
          <h3>🤝 Designed for Team work</h3>
          <p>Server support multi user, you can actually share the mocks with your team!</p>
        </div>
        <div>
          <h3>🌏 Non-intrusive Plugin</h3>
          <p>Using browsers' plugin ability - "webRequest" blocking, to redirect the requests you wanna mock. Non-intrusive indeed!</p>
        </div>
      </section>
      {/* Open Source Section */}
      <section id="open-source">
        <div>
          <h3>Moker Server</h3>
          <p>
            <Button inline as="a" className="github-btn" target="_blank" href="https://github.com/arctome/moker-server" icon secondary labelPosition='right'>
              <span><Icon name="github" />GitHub Repository</span>
              <Icon name='right arrow' />
            </Button>
            <a className="deploy-on-worker" href="https://deploy.workers.cloudflare.com/?url=https://github.com/arctome/moker-server" title="Deploy Moker Server"><img src="https://deploy.workers.cloudflare.com/button" alt="Deploy Moker Server to Cloudflare Workers" /></a>
          </p>
        </div>
        <div>
          <h3>Moker Chrome Extension</h3>
          <p>
            <Button inline as="a" target="_blank" href="https://github.com/arctome/moker-chrome-extension/releases" icon secondary labelPosition='right'>
              <span><Icon name="github" />GitHub Repository</span>
              <Icon name='right arrow' />
            </Button>
            <Button inline as="a" icon labelPosition='right' title="Coming soon" disabled>
              Chrome Web Store
              <Icon name='wait' />
            </Button>
          </p>
        </div>
      </section>
      <footer>
        {/* Author & License */}
        <p>Built and developed by <a href="https://github.com/arctome">"arctome"</a>. Licensed under the MIT License.</p>
        {/* Powered By */}
        <p>Moker Extension and Moker Server is built based on <a target="_blank" href="https://github.com/flareact/flareact">"🔥 flareact"</a> and my Worker framework <a target="_blank" href="https://github.com/arctome/koaw">"koaw-js"</a>, thanks to the Open Source.</p>
      </footer>
    </main>
  );
}
