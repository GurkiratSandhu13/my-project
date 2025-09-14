function ProductCard({ product }) {
    return (
        <div style={{ border: "1px solid #ccc", padding: "1rem", borderRadius: "8px", width: "180px", background: '#fff', color: '#000', textAlign: 'center' }}>
            {product.image && <img src={product.image} alt={product.name} style={{ maxWidth: '100%' }} />}
            <h3 style={{ marginTop: 0 }}>{product.name}</h3>
            <p style={{ margin: '0.5rem 0' }}>Price: ${product.price}</p>
            <p style={{ margin: '0.5rem 0' }}>Status: {product.inStock ? 'In Stock' : 'Out of Stock'}</p>
        </div>
    );
}

export default ProductCard;