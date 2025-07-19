import React, { useState } from 'react';
import { Search, Plus, Minus, ShoppingCart, CreditCard, DollarSign, Calculator } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  image: string;
  inStock: boolean;
}

interface CartItem extends Product {
  quantity: number;
}

const categories = ['All', 'Pizza', 'Burgers', 'Drinks', 'Desserts', 'Sides'];

const products: Product[] = [
  { id: '1', name: 'Margherita Pizza', price: 12.99, category: 'Pizza', image: 'https://images.pexels.com/photos/315755/pexels-photo-315755.jpeg?auto=compress&cs=tinysrgb&w=300', inStock: true },
  { id: '2', name: 'Pepperoni Pizza', price: 15.99, category: 'Pizza', image: 'https://images.pexels.com/photos/315755/pexels-photo-315755.jpeg?auto=compress&cs=tinysrgb&w=300', inStock: true },
  { id: '3', name: 'Classic Burger', price: 8.99, category: 'Burgers', image: 'https://images.pexels.com/photos/1556909/pexels-photo-1556909.jpeg?auto=compress&cs=tinysrgb&w=300', inStock: true },
  { id: '4', name: 'Cheese Burger', price: 9.99, category: 'Burgers', image: 'https://images.pexels.com/photos/1556909/pexels-photo-1556909.jpeg?auto=compress&cs=tinysrgb&w=300', inStock: true },
  { id: '5', name: 'Coca Cola', price: 2.99, category: 'Drinks', image: 'https://images.pexels.com/photos/50593/coca-cola-cold-drink-soft-drink-coke-50593.jpeg?auto=compress&cs=tinysrgb&w=300', inStock: true },
  { id: '6', name: 'Ice Cream', price: 4.99, category: 'Desserts', image: 'https://images.pexels.com/photos/1352278/pexels-photo-1352278.jpeg?auto=compress&cs=tinysrgb&w=300', inStock: true },
];

export default function POSPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      setCart(prev => prev.filter(item => item.id !== id));
    } else {
      setCart(prev => prev.map(item => 
        item.id === id ? { ...item, quantity } : item
      ));
    }
  };

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = total * 0.1;
  const grandTotal = total + tax;

  return (
    <div className="flex flex-col lg:flex-row h-full gap-6">
      {/* Products Section */}
      <div className="flex-1">
        <div className="bg-white rounded-xl border border-gray-200 p-6 h-full">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Point of Sale</h2>
          
          {/* Search */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-2 mb-6">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-red-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredProducts.map(product => (
              <div
                key={product.id}
                onClick={() => addToCart(product)}
                className="bg-white border border-gray-200 rounded-lg p-4 cursor-pointer hover:shadow-lg transition-all duration-200 hover:-translate-y-1"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-32 object-cover rounded-lg mb-3"
                />
                <h3 className="font-medium text-gray-800 mb-1 text-sm">{product.name}</h3>
                <p className="text-red-600 font-bold">${product.price}</p>
                <span className={`inline-block px-2 py-1 rounded-full text-xs mt-2 ${
                  product.inStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {product.inStock ? 'In Stock' : 'Out of Stock'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Cart Section */}
      <div className="w-full lg:w-96">
        <div className="bg-white rounded-xl border border-gray-200 p-6 h-full">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-800">Current Order</h3>
            <ShoppingCart className="w-6 h-6 text-gray-600" />
          </div>

          {/* Cart Items */}
          <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
            {cart.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No items in cart</p>
            ) : (
              cart.map(item => (
                <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-800 text-sm">{item.name}</h4>
                    <p className="text-red-600 font-bold">${item.price}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-8 h-8 bg-red-100 text-red-600 rounded-full flex items-center justify-center hover:bg-red-200"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-8 text-center font-medium">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center hover:bg-green-200"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Order Summary */}
          {cart.length > 0 && (
            <>
              <div className="border-t border-gray-200 pt-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-medium">${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax (10%):</span>
                  <span className="font-medium">${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold border-t border-gray-200 pt-2">
                  <span>Total:</span>
                  <span className="text-red-600">${grandTotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Payment Buttons */}
              <div className="space-y-3 mt-6">
                <button className="w-full bg-red-500 text-white py-3 rounded-lg font-medium hover:bg-red-600 transition-colors flex items-center justify-center space-x-2">
                  <CreditCard className="w-5 h-5" />
                  <span>Pay with Card</span>
                </button>
                <button className="w-full bg-green-500 text-white py-3 rounded-lg font-medium hover:bg-green-600 transition-colors flex items-center justify-center space-x-2">
                  <DollarSign className="w-5 h-5" />
                  <span>Pay with Cash</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}