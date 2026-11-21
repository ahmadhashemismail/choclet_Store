import { Show, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import { Suspense } from "react";

export default function Authantication() {
  return (
    <div className="storefront-auth">
      <Suspense
        fallback={
          <span
            className="storefront-auth__skeleton"
            role="status"
            aria-label="Loading account"
          />
        }
      >
        <Show when="signed-out">
          <SignInButton mode="modal" forceRedirectUrl="/">
            <button type="button" className="storefront-auth__button storefront-auth__button--quiet">
              Sign in
            </button>
          </SignInButton>
          <SignUpButton mode="modal" forceRedirectUrl="/">
            <button type="button" className="storefront-auth__button storefront-auth__button--primary">
              Create account
            </button>
          </SignUpButton>
        </Show>
        <Show when="signed-in">
          <UserButton
            appearance={{
              elements: {
                userButtonTrigger: "storefront-auth__user-trigger",
                avatarBox: "storefront-auth__avatar",
              },
            }}
          />
        </Show>
      </Suspense>
    </div>
  );
}