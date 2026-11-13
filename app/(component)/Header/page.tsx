import Link from "next/link";
import Authantication from "@/app/(component)/Auth/page";

export default function Header() {
  return (
    <header className="storefront__header">
      <Link className="storefront__brand" href="/">
        <span className="storefront__brand-mark" aria-hidden="true">
          ✳
        </span>
        <span>
          <strong>CACAO</strong>
          <small>CHOCOLATE HOUSE</small>
        </span>
      </Link>
      <nav className="storefront__nav" aria-label="Store navigation">
        <Authantication />
        <a href="#favorites">Our chocolates</a>
        <a href="#shop">Shop</a>
      </nav>
    </header>
  );
}
