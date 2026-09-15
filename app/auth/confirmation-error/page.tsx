import Link from 'next/link'

export default function ConfirmationErrorPage() {
  return (
    <main className="shell confirmationPage">
      <nav className="nav">
        <Link className="brand brandWithMark" href="/">
          <img src="/brand/breakthrough-mark.svg" alt="" aria-hidden="true" />
          <span>BREAKTHROUGH</span>
        </Link>
      </nav>
      <section className="confirmationCard">
        <div className="eyebrow">Confirmation link</div>
        <h1>This link has expired.</h1>
        <p className="muted confirmationCopy">Request a new confirmation email and we’ll get you back into BREAKTHROUGH.</p>
        <Link className="btn primary confirmationButton" href="/signup">Create account</Link>
        <Link className="confirmationSecondary" href="/login">Back to sign in <span aria-hidden="true">→</span></Link>
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
