### Cách sử dụng

```tsx
// Demo
const handleIncrease = (productId: string) => {
    console.log("increase", productId);
};
const handleDecrease = (productId: string) => {
    console.log("decrease", productId);
};
const handleAddToCart = (productId: string) => {
    console.log("addToCart", productId);
};
{/* Test ProductCard */}
        <div className="flex flex-col gap-4">
          {PRODUCTS.map((product) => (
            <ProductsCard
              key={product.id}
              product={product} // thằng này là sản phẩm
              variants="list" // tùy từng loại thì chọn
              onAddToCart={() => handleAddToCart(product.id) // truyền các hàm cần xài vào đây
            />
          ))}
        </div>
        <div className="flex flex-col gap-4">
          {PRODUCTS.map((product) => (
            <ProductsCard
              key={product.id}
              product={product}
              variants="cart"
              onAddToCart={() => handleAddToCart(product.id)}
              onDecreaseQuantity={() => handleDecrease(product.id)} // hàm tăng giảm trong cart
              onIncreaseQuantity={() => handleIncrease(product.id)}
            />
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {PRODUCTS.map((product) => (
            <ProductsCard
              key={product.id}
              product={product}
              variants="default"
              onAddToCart={() => handleAddToCart(product.id)}
            />
          ))}
        </div>
```

Có thể thêm hàm nếu thấy cần thiết nhưng phải đồng bộ và dùng dấu ? cho các hàm hoặc biến để không bị ảnh hưởng đến các class khác cùng sử dụng.
Không chắc là code đúng không nhưng xài được trước cái đã :3
