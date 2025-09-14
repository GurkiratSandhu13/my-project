function ProductCard({ product }) {
  

  return (
     <div
      id="product-card"
      className={product.status === "Out of Stock" ? "out-of-stock" : ""}
    >
      <h3 className="Heading">{product.name}</h3>
      <p>Price: ${product.price}</p>
      <p className={product.status === "Out of Stock" ? "status-red" : "status-green"}>
        Status: {product.status}
      </p>
    </div>
  );
}

export default ProductCard;
