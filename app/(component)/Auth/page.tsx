import { Show, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import { Suspense } from "react";

export default function Authantication() {
  return (
    <div className="flex items-center gap-3">
      <Suspense>
        <Show when="signed-out">
          <SignInButton />
          <SignUpButton>Sign Up</SignUpButton>
        </Show>
        <Show when="signed-in">
          <UserButton />
        </Show>
      </Suspense>
    </div>
  );
}