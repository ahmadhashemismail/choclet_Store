export default function ProductGridSkeleton() {
  return (
    <div className="product-grid-skeleton" role="status" aria-busy="true">
      <span className="product-grid-skeleton__sr-only">Loading products</span>
      {Array.from({ length: 3 }, (_, sectionIndex) => (
        <section className="product-grid-skeleton__section" key={sectionIndex}>
          <span className="product-grid-skeleton__block product-grid-skeleton__title" />
          <div className="product-grid-skeleton__cards">
            {Array.from({ length: 3 }, (_, cardIndex) => (
              <span
                className="product-grid-skeleton__block product-grid-skeleton__card"
                key={cardIndex}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}