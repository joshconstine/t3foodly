import { ReactNode } from "react";
import Navbar from "./Navbar";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <footer className="footer bg-primary p-10 text-white">
        <nav>
          <header className="footer-title">Foodley</header>
          <a className="link-hover link" href="/discover">
            Discover
          </a>
          <a className="link-hover link" href="/restaurant">
            Cities
          </a>
        </nav>
        <nav>
          <header className="footer-title">Learn</header>
          <a
            className="link-hover link"
            target="_blank"
            href="https://www.linkedin.com/in/joshua-constine"
          >
            Developers
          </a>
          <a className="link-hover link">About</a>
        </nav>
     
      </footer>
    </>
  );
}
