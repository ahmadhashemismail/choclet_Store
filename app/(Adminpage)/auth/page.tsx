import { SignIn } from "@clerk/nextjs";

export default function AdminAuthPage() {
  return (
    <main className="admin-auth-page">
      <div className="admin-auth-shell">
        <header className="admin-auth-header">
          <div className="admin-auth-brand" aria-label="Cacao Store home">
            <span className="admin-auth-brand__mark">C</span>
            <span className="admin-auth-brand__text">CacaoStore</span>
          </div>

          <nav className="admin-auth-nav" aria-label="Main navigation">
            <a href="#">Chocolate Catalog</a>
            <a href="#">Special Offers</a>
            <a href="#">Payment &amp; Delivery</a>
            <a href="#">Support</a>
            <a href="#">Contacts</a>
          </nav>

          <div className="admin-auth-tools" aria-label="Account actions">
            <button type="button" className="admin-auth-lang">
              EN
            </button>
            <button type="button" className="admin-auth-icon" aria-label="Profile">
              <span>◔</span>
            </button>
            <button type="button" className="admin-auth-icon" aria-label="Favorites">
              <span>♡</span>
            </button>
            <button type="button" className="admin-auth-icon" aria-label="Cart">
              <span>🛒</span>
            </button>
          </div>
        </header>

        <div className="admin-auth-body">
          <div className="admin-auth-illustration" aria-hidden="true">
            <div className="admin-auth-laptop">
              <div className="admin-auth-laptop__screen">
                <div className="admin-auth-stack admin-auth-stack--left">
                  <span className="admin-auth-block admin-auth-block--light" />
                  <span className="admin-auth-block admin-auth-block--rose" />
                  <span className="admin-auth-block admin-auth-block--gold" />
                </div>
              </div>
              <div className="admin-auth-laptop__base" />
            </div>
          </div>

          <section className="admin-auth-cart" aria-label="Admin login form">
            <div className="admin-auth-cart__header">LOG IN</div>
            <div className="admin-auth-cart__body">
              <p className="admin-auth-cart__welcome">
                Welcome back to <strong>CacaoStore!</strong>
                <span>Sign in with your admin account</span>
              </p>
              <SignIn
                routing="hash"
                forceRedirectUrl="/"
                withSignUp={false}
                appearance={{
                  variables: {
                    colorBackground: "#f4e2be",
                    colorInput: "#fffdf9",
                    colorPrimary: "#dc6a4a",
                    borderRadius: "6px",
                  },
                  elements: {
                    rootBox: "admin-auth-clerk-root",
                    cartBox: "admin-auth-clerk-cart-box",
                    cart: "admin-auth-clerk-cart",
                    header: "admin-auth-clerk-hidden",
                    footer: "admin-auth-clerk-hidden",
                    formFieldInput: "admin-auth-clerk-input",
                    formButtonPrimary: "admin-auth-clerk-submit",
                  },
                }}
              />
            </div>
          </section>

          <div className="admin-auth-illustration admin-auth-illustration--right" aria-hidden="true">
            <div className="admin-auth-stack admin-auth-stack--right">
              <span className="admin-auth-block admin-auth-block--gold" />
              <span className="admin-auth-block admin-auth-block--rose" />
              <span className="admin-auth-block admin-auth-block--terracotta" />
              <span className="admin-auth-block admin-auth-block--dark" />
            </div>
          </div>
        </div>

        <div className="admin-auth-footer-art" aria-hidden="true">
          <div className="admin-auth-stack admin-auth-stack--bottom">
            <span className="admin-auth-block admin-auth-block--light" />
            <span className="admin-auth-block admin-auth-block--gold" />
            <span className="admin-auth-block admin-auth-block--rose" />
            <span className="admin-auth-block admin-auth-block--terracotta" />
            <span className="admin-auth-block admin-auth-block--dark" />
          </div>
        </div>
      </div>
    </main>
  );
}
