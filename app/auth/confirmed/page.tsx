import Link from 'next/link'

export default function ConfirmedPage() {
  return (
    <main className="shell confirmationPage">
      <nav className="nav">
        <Link className="brand brandWithMark" href="/">
          <img src="/brand/breakthrough-mark.svg" alt="" aria-hidden="true" />
          <span>BREAKTHROUGH</span>
        </Link>
      </nav>

      <section className="confirmationCard">
        <div className="confirmationGlow" aria-hidden="true" />
        <div className="confirmationMark" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M5 12.5 9.2 17 19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <div className="eyebrow">Email confirmed</div>
        <h1>You’re all set.</h1>
        <p className="muted confirmationCopy">Your BREAKTHROUGH account is ready. The screen is waiting.</p>
        <Link className="btn primary confirmationButton" href="/">Start watching</Link>
        <Link className="confirmationSecondary" href="/login">Go to sign in <span aria-hidden="true">→</span></Link>
      </section>

      <footer className="confirmationFooter">
        <Link className="brand brandWithMark" href="/">
          <img src="/brand/breakthrough-mark.svg" alt="" aria-hidden="true" />
          <span>BREAKTHROUGH</span>
        </Link>
        <span>Stories worth staying up for.</span>
      </footer>
    </main>
  )
}
