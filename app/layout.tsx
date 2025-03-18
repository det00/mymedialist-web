import '/app/globals.css';
import SearchInput from '@/public/components/SearchInput';
import ScriptLoader from '@/public/components/ScriptLoader';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
        <title>AllSeen - Track Your Media</title>
      </head>
      <body>
        <header className="header-area header-sticky">
          <div className="container">
            <div className="row">
              <div className="col-12">
                <nav className="main-nav">
                  <a href="/" className="logo">
                    <img src="/assets/images/logo.png" alt="AllSeen Logo" />
                  </a>
                  <SearchInput />
                  <ul className="nav">
                    <li><a href="/">Home</a></li>
                    <li><a href="/browse">Browse</a></li>
                    <li><a href="/details">Details</a></li>
                    <li><a href="/streams">Streams</a></li>
                    <li>
                      <a href="/profile">
                        Profile <img src="/assets/images/profile-header.jpg" alt="Profile" />
                      </a>
                    </li>
                  </ul>
                  <a className="menu-trigger">
                    <span>Menu</span>
                  </a>
                </nav>
              </div>
            </div>
          </div>
        </header>
        <main className="main-content">
          {children}
        </main>
        <footer>
          <div className="container">
            <div className="row">
              <div className="col-lg-12">
                <p>
                  Copyright © 2025 <a href="#">AllSeen</a> Team. All rights reserved.
                  <br />
                  Design: <a href="https://templatemo.com" target="_blank">TemplateMo</a>
                </p>
              </div>
            </div>
          </div>
        </footer>
        <ScriptLoader />
      </body>
    </html>
  );
}