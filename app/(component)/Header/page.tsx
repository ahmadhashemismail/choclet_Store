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
        <Link
          href="/favorite"
          className="storefront__favorite"
          aria-label="View favorites"
          title="Favorites"
        >
          ♡
        </Link>
<Link href="/cartPage" className="storefront__cart" aria-label="View cart">
  <img src="/cart.svg" alt="" width={44} height={44} />
</Link>      </nav>
    </header>
  );
}
