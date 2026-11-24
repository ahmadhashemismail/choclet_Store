import { SignIn, SignUpButton } from "@clerk/nextjs";
import Link from "next/link";

export default function AuthPage() {
  return (
    <main className="auth-page">
      <section className="auth-story" aria-label="Cacao and Co.">
        <Link className="auth-brand" href="/">Cacao &amp; Co.</Link>

        <div className="auth-story__content">
          <div className="auth-chocolate" aria-hidden="true">
            {Array.from({ length: 12 }, (_, index) => (
              <span key={index} />
            ))}
          </div>
          <h1>Good chocolate is<br />worth the wait.</h1>
          <p>Sign in to track your orders, save your favourite bars<br className="auth-desktop-break" /> and check out faster.</p>
        </div>
      </section>

      <section className="auth-panel" aria-label="Sign in to your account">
        <div className="auth-panel__inner">
          <header className="auth-heading">
            <h2>Welcome back</h2>
            <p>Sign in to your account to continue.</p>
          </header>

          <SignIn
            routing="hash"
            forceRedirectUrl="/"
            withSignUp={false}
            appearance={{
              variables: {
                colorBackground: "#fbf4eb",
                colorInput: "#fffdfa",
                colorPrimary: "#321a14",
                colorText: "#25150f",
                colorTextSecondary: "#765d50",
                borderRadius: "12px",
              },
              elements: {
                rootBox: "auth-clerk-root",
                cardBox: "auth-clerk-card-box",
                card: "auth-clerk-card",
                header: "auth-clerk-hidden",
                footer: "auth-clerk-hidden",
                formFieldLabel: "auth-clerk-label",
                formFieldInput: "auth-clerk-input",
                formButtonPrimary: "auth-clerk-submit",
                formFieldAction: "auth-clerk-action",
                identityPreview: "auth-clerk-preview",
                dividerRow: "auth-clerk-divider",
                socialButtons: "auth-clerk-socials",
              },
            }}
          />

          <div className="auth-or" aria-hidden="true"><span>or</span></div>
          <Link className="auth-guest" href="/">Continue as guest</Link>
          <p className="auth-signup">
            New here? <SignUpButton mode="modal" forceRedirectUrl="/">
              <button type="button">Create an account</button>
            </SignUpButton>
          </p>
        </div>
      </section>
    </main>
  );
}
