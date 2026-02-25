import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Heart, ShoppingCart, Star, ChevronRight, Mail, Filter } from 'lucide-react';
import { products } from '@/data/products';

/**
 * Design Philosophy: Bold African Heritage Maximalism
 * - Deep navy background with gold accents
 * - Playfair Display for bold headings, Poppins for body
 * - Asymmetric layout with diagonal dividers
 * - Parallax scrolling and staggered animations
 */

export default function Home() {
  const [cart, setCart] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [priceFilter, setPriceFilter] = useState<number>(500);
  const [wishlist, setWishlist] = useState<Set<string>>(new Set());

  // Load cart from localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  // Save cart to localStorage
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (productId: string) => {
    setCart([...cart, productId]);
  };

  const toggleWishlist = (productId: string) => {
    const newWishlist = new Set(wishlist);
    if (newWishlist.has(productId)) {
      newWishlist.delete(productId);
    } else {
      newWishlist.add(productId);
    }
    setWishlist(newWishlist);
  };

  const filteredProducts = products.filter(product => {
    const categoryMatch = selectedCategory === 'all' || product.category === selectedCategory;
    const priceMatch = product.price.usd <= priceFilter;
    return categoryMatch && priceMatch;
  });

  const featuredProducts = products.filter(p => p.featured).slice(0, 3);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-primary/95 backdrop-blur border-b border-accent/20">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center">
              <span className="font-display text-primary text-lg font-bold">A</span>
            </div>
            <span className="font-display text-xl text-accent">AfricanKings</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#featured" className="hover:text-accent transition">Featured</a>
            <a href="#products" className="hover:text-accent transition">Shop</a>
            <a href="#testimonials" className="hover:text-accent transition">Reviews</a>
            <a href="#newsletter" className="hover:text-accent transition">Contact</a>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <ShoppingCart className="w-6 h-6 cursor-pointer hover:text-accent transition" />
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-accent text-primary text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {cart.length}
                </span>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 right-0 w-96 h-96 bg-accent rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary rounded-full blur-3xl"></div>
        </div>
        
        <div className="container relative z-10 grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="font-display text-5xl md:text-6xl lg:text-7xl leading-tight">
                Celebrate Your <span className="text-accent">Heritage</span>
              </h1>
              <p className="text-lg text-foreground/80 max-w-lg">
                Discover premium African men's fashion featuring authentic Agbada, Dashiki, and Senator wear. Each piece celebrates cultural pride with contemporary style.
              </p>
            </div>
            <div className="flex gap-4">
              <Button 
                className="bg-accent text-primary hover:bg-accent/90 px-8 py-6 text-lg font-semibold"
                onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Explore Collection
                <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
              <Button 
                variant="outline" 
                className="border-accent text-accent hover:bg-accent/10 px-8 py-6 text-lg"
              >
                Learn More
              </Button>
            </div>
          </div>
          
          <div className="relative h-96 md:h-full">
            <img 
              src="https://private-us-east-1.manuscdn.com/sessionFile/sfPjvTl7Kccb2WBn7O485F/sandbox/zd4oxjPlyfKwrI3fYaXTal-img-1_1771770020000_na1fn_aGVyby1hZ2JhZGEtbWFpbg.png?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvc2ZQanZUbDdLY2NiMldCbjdPNDg1Ri9zYW5kYm94L3pkNG94alBseWZLd3JJM2ZZYVhUYWwtaW1nLTFfMTc3MTc3MDAyMDAwMF9uYTFmbl9hR1Z5YnkxaFoySmhaR0V0YldGcGJnLnBuZz94LW9zcy1wcm9jZXNzPWltYWdlL3Jlc2l6ZSx3XzE5MjAsaF8xOTIwL2Zvcm1hdCx3ZWJwL3F1YWxpdHkscV84MCIsIkNvbmRpdGlvbiI6eyJEYXRlTGVzc1RoYW4iOnsiQVdTOkVwb2NoVGltZSI6MTc5ODc2MTYwMH19fV19&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=gbXAGaz~gDKUI9bD~MVBkffH1GyUIlWyWd1zQPC-6kzSnh~nKZC6Jx3jqX2keGsI2jDEtpwL4gCFnQ1RjmE4H4Xa3hmo32gRAlshXv8sCxIhcKSDypfAfB3t96uXsYXzIwtn7q58jUdO9-YxWSNC07K2gNa7Kol10M1oj0dR1jjixf9f~O1ZBlil1E44erg2Echp6DTVn~jzkGTXAX8SKC-ZQBC1T9us2yrI7KEcSBAIEMLbll4eVSvpP7z6K4mqeFcAz1PvaZFkTcv5aFXt~N1T7LSwBcnRb6EQCOWAUD3WyVPgA7OZF1oemWOEdn-1dYkm4tLBsSS4bz0QWb8B~g__"
              alt="Hero Agbada"
              className="w-full h-full object-cover rounded-lg shadow-2xl"
            />
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section id="featured" className="py-20 bg-primary/50 relative">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent to-transparent"></div>
        
        <div className="container space-y-12">
          <div className="text-center space-y-4">
            <h2 className="font-display text-4xl md:text-5xl">Featured Collections</h2>
            <p className="text-foreground/70 max-w-2xl mx-auto">
              Handpicked pieces that showcase the finest in African men's fashion
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {featuredProducts.map((product, idx) => (
              <div 
                key={product.id}
                className="group relative overflow-hidden rounded-lg bg-card border border-accent/20 hover:border-accent/50 transition-all duration-300 hover:shadow-2xl hover:shadow-accent/20"
                style={{
                  animation: `fadeInUp 0.6s ease-out ${idx * 0.1}s both`
                }}
              >
                <div className="relative h-80 overflow-hidden bg-primary/20">
                  <img 
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  <button
                    onClick={() => toggleWishlist(product.id)}
                    className="absolute top-4 right-4 p-2 bg-primary/80 hover:bg-accent hover:text-primary rounded-full transition-all duration-300 z-10"
                  >
                    <Heart 
                      className={`w-5 h-5 ${wishlist.has(product.id) ? 'fill-current' : ''}`}
                    />
                  </button>
                </div>

                <div className="p-6 space-y-4">
                  <div>
                    <p className="text-accent text-sm font-semibold uppercase tracking-wider">{product.category}</p>
                    <h3 className="font-display text-lg mt-2 line-clamp-2">{product.name}</h3>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'fill-accent text-accent' : 'text-foreground/20'}`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-foreground/60">({product.reviews})</span>
                  </div>

                  <div className="flex items-baseline gap-2">
                    <span className="font-display text-2xl text-accent">${product.price.usd}</span>
                    <span className="text-sm text-foreground/60">₦{product.price.ngn.toLocaleString()}</span>
                  </div>

                  <Button 
                    onClick={() => addToCart(product.id)}
                    className="w-full bg-accent text-primary hover:bg-accent/90 font-semibold"
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Add to Cart
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Products Catalog */}
      <section id="products" className="py-20">
        <div className="container space-y-12">
          <div className="text-center space-y-4">
            <h2 className="font-display text-4xl md:text-5xl">Complete Collection</h2>
            <p className="text-foreground/70 max-w-2xl mx-auto">
              Browse our full range of premium African men's fashion
            </p>
          </div>

          {/* Filters */}
          <div className="bg-primary/30 rounded-lg p-6 border border-accent/20 space-y-6">
            <div className="flex items-center gap-2 mb-4">
              <Filter className="w-5 h-5 text-accent" />
              <h3 className="font-display text-lg">Filter Products</h3>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <label className="block">
                  <span className="text-sm font-semibold text-accent mb-2 block">Category</span>
                  <select 
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full bg-primary border border-accent/30 rounded px-4 py-2 text-foreground"
                  >
                    <option value="all">All Categories</option>
                    <option value="traditional">Traditional Formal</option>
                    <option value="fusion">Modern Fusion</option>
                    <option value="senator">Senator Wear</option>
                    <option value="accessories">Accessories</option>
                  </select>
                </label>
              </div>

              <div className="space-y-4">
                <label className="block">
                  <span className="text-sm font-semibold text-accent mb-2 block">Max Price: ${priceFilter}</span>
                  <input 
                    type="range"
                    min="0"
                    max="500"
                    value={priceFilter}
                    onChange={(e) => setPriceFilter(Number(e.target.value))}
                    className="w-full"
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product, idx) => (
              <div 
                key={product.id}
                className="group relative overflow-hidden rounded-lg bg-card border border-accent/20 hover:border-accent/50 transition-all duration-300 hover:shadow-2xl hover:shadow-accent/20"
                style={{
                  animation: `fadeInUp 0.6s ease-out ${(idx % 6) * 0.1}s both`
                }}
              >
                <div className="relative h-64 overflow-hidden bg-primary/20">
                  <img 
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  
                  <button
                    onClick={() => toggleWishlist(product.id)}
                    className="absolute top-3 right-3 p-2 bg-primary/80 hover:bg-accent hover:text-primary rounded-full transition-all duration-300 z-10"
                  >
                    <Heart 
                      className={`w-4 h-4 ${wishlist.has(product.id) ? 'fill-current' : ''}`}
                    />
                  </button>
                </div>

                <div className="p-4 space-y-3">
                  <p className="text-accent text-xs font-semibold uppercase tracking-wider">{product.category}</p>
                  <h3 className="font-display text-base line-clamp-2">{product.name}</h3>

                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3 h-3 ${i < Math.floor(product.rating) ? 'fill-accent text-accent' : 'text-foreground/20'}`}
                      />
                    ))}
                  </div>

                  <div className="flex items-baseline gap-2">
                    <span className="font-display text-xl text-accent">${product.price.usd}</span>
                    <span className="text-xs text-foreground/60">₦{product.price.ngn.toLocaleString()}</span>
                  </div>

                  <Button 
                    onClick={() => addToCart(product.id)}
                    className="w-full bg-accent text-primary hover:bg-accent/90 text-sm font-semibold py-2"
                  >
                    Add to Cart
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-foreground/60 text-lg">No products match your filters. Try adjusting your selection.</p>
            </div>
          )}
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 bg-primary/50">
        <div className="container space-y-12">
          <div className="text-center space-y-4">
            <h2 className="font-display text-4xl md:text-5xl">Customer Stories</h2>
            <p className="text-foreground/70 max-w-2xl mx-auto">
              Hear from our satisfied customers about their experience
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Kwame Mensah",
                role: "Lagos, Nigeria",
                text: "The quality is exceptional! My Agbada arrived perfectly tailored and the embroidery is stunning. Highly recommend for anyone seeking authentic African fashion.",
                rating: 5
              },
              {
                name: "Chisom Okafor",
                role: "London, UK",
                text: "Outstanding service and premium quality. The Senator wear set is perfect for formal events. AfricanKings truly celebrates our heritage with style.",
                rating: 5
              },
              {
                name: "Amara Diallo",
                role: "Accra, Ghana",
                text: "Beautiful collection! The Dashiki is comfortable and the colors are vibrant. Fast shipping and excellent customer support. Will definitely order again!",
                rating: 5
              }
            ].map((testimonial, idx) => (
              <Card 
                key={idx}
                className="bg-card border border-accent/20 p-6 space-y-4 hover:border-accent/50 transition-all duration-300"
              >
                <div className="flex gap-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-accent text-accent" />
                  ))}
                </div>
                <p className="text-foreground/80">{testimonial.text}</p>
                <div>
                  <p className="font-semibold text-accent">{testimonial.name}</p>
                  <p className="text-sm text-foreground/60">{testimonial.role}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section id="newsletter" className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-accent rounded-full blur-3xl"></div>
        </div>

        <div className="container relative z-10 max-w-2xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h2 className="font-display text-4xl md:text-5xl">Stay Connected</h2>
            <p className="text-foreground/70">
              Subscribe to our newsletter for exclusive offers, new collections, and cultural insights
            </p>
          </div>

          <form 
            onSubmit={(e) => {
              e.preventDefault();
              alert('Thank you for subscribing! Check your email for exclusive offers.');
            }}
            className="flex gap-2 bg-primary/30 p-2 rounded-lg border border-accent/20"
          >
            <input 
              type="email"
              placeholder="Enter your email"
              required
              className="flex-1 bg-transparent px-4 py-3 text-foreground placeholder:text-foreground/50 outline-none"
            />
            <Button className="bg-accent text-primary hover:bg-accent/90 px-8 font-semibold">
              <Mail className="w-4 h-4 mr-2" />
              Subscribe
            </Button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary border-t border-accent/20 py-12">
        <div className="container space-y-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center">
                  <span className="font-display text-primary text-lg font-bold">A</span>
                </div>
                <span className="font-display text-accent text-lg">AfricanKings</span>
              </div>
              <p className="text-foreground/70 text-sm">
                Premium African men's fashion celebrating cultural heritage with contemporary style.
              </p>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold text-accent">Shop</h4>
              <ul className="space-y-2 text-sm text-foreground/70">
                <li><a href="#" className="hover:text-accent transition">Traditional Wear</a></li>
                <li><a href="#" className="hover:text-accent transition">Modern Fusion</a></li>
                <li><a href="#" className="hover:text-accent transition">Senator Wear</a></li>
                <li><a href="#" className="hover:text-accent transition">Accessories</a></li>
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold text-accent">Company</h4>
              <ul className="space-y-2 text-sm text-foreground/70">
                <li><a href="#" className="hover:text-accent transition">About Us</a></li>
                <li><a href="#" className="hover:text-accent transition">Contact</a></li>
                <li><a href="#" className="hover:text-accent transition">Shipping Info</a></li>
                <li><a href="#" className="hover:text-accent transition">Returns</a></li>
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold text-accent">Legal</h4>
              <ul className="space-y-2 text-sm text-foreground/70">
                <li><a href="#" className="hover:text-accent transition">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-accent transition">Terms of Service</a></li>
                <li><a href="#" className="hover:text-accent transition">Cookie Policy</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-accent/20 pt-8 text-center text-sm text-foreground/60">
            <p>&copy; 2026 AfricanKingsEshop. All rights reserved. Celebrating African Heritage.</p>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
