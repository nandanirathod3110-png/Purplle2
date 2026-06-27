import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../data/dummy_data.dart';
import '../models/product.dart';
import '../services/cart_service.dart';
import '../widgets/product_card.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({Key? key}) : super(key: key);

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  final PageController _bannerController = PageController();
  final TextEditingController _searchController = TextEditingController();
  int _activeBanner = 0;

  final List<Map<String, String>> _banners = [
    {
      'image': 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=600&auto=format&fit=crop&q=80',
      'title': 'UP TO 50% OFF',
      'subtitle': 'Monsoon Beauty Glow Festival',
    },
    {
      'image': 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&auto=format&fit=crop&q=80',
      'title': 'BUY 1 GET 1 FREE',
      'subtitle': 'Premium Lipstick Craze',
    },
    {
      'image': 'https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?w=600&auto=format&fit=crop&q=80',
      'title': 'FLAT ₹200 OFF',
      'subtitle': 'Organic Vegan Skincare range',
    }
  ];

  @override
  void dispose() {
    _bannerController.dispose();
    _searchController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final primaryColor = Theme.of(context).primaryColor;
    final cartService = Provider.of<CartService>(context, listen: false);

    final featuredProducts = DummyData.products.where((p) => p.isBestSeller).toList();
    final trendingProducts = DummyData.products.where((p) => p.isTrending).toList();
    final allProducts = DummyData.products;

    return Scaffold(
      appBar: AppBar(
        title: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(5),
              decoration: BoxDecoration(
                color: primaryColor.withOpacity(0.1),
                borderRadius: BorderRadius.circular(8),
              ),
              child: Icon(Icons.auto_awesome, color: primaryColor, size: 20),
            ),
            const SizedBox(width: 8),
            const Text(
              'Purplle',
              style: TextStyle(
                fontFamily: 'Poppins',
                fontWeight: FontWeight.bold,
                fontSize: 22,
                color: Color(0xFF2C2438),
              ),
            ),
          ],
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.notifications_none_outlined),
            onPressed: () {
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('Notifications inbox is clean!')),
              );
            },
          ),
          Padding(
            padding: const EdgeInsets.only(right: 16.0, left: 8.0),
            child: CircleAvatar(
              radius: 16,
              backgroundColor: primaryColor,
              child: const Text(
                'U',
                style: TextStyle(color: Colors.white, fontSize: 13, fontWeight: FontWeight.bold),
              ),
            ),
          ),
        ],
      ),
      body: SingleChildScrollView(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Search Bar Section
            Padding(
              padding: const EdgeInsets.all(16.0),
              child: TextField(
                controller: _searchController,
                decoration: InputDecoration(
                  hintText: 'Search makeup, brands, skincare...',
                  prefixIcon: const Icon(Icons.search, color: Colors.grey),
                  suffixIcon: Container(
                    margin: const EdgeInsets.all(6),
                    decoration: BoxDecoration(
                      color: primaryColor,
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: const Icon(Icons.tune, color: Colors.white, size: 18),
                  ),
                ),
              ),
            ),

            // Banner Slider Section
            SizedBox(
              height: 160,
              child: Stack(
                children: [
                  PageView.builder(
                    controller: _bannerController,
                    itemCount: _banners.length,
                    onPageChanged: (index) {
                      setState(() {
                        _activeBanner = index;
                      });
                    },
                    itemBuilder: (context, index) {
                      final banner = _banners[index];
                      return Container(
                        margin: const EdgeInsets.symmetric(horizontal: 16),
                        decoration: BoxDecoration(
                          borderRadius: BorderRadius.circular(16),
                          image: DecorationImage(
                            image: NetworkImage(banner['image']!),
                            fit: BoxFit.cover,
                            colorFilter: ColorFilter.mode(
                              Colors.black.withOpacity(0.35),
                              BlendMode.darken,
                            ),
                          ),
                        ),
                        child: Padding(
                          padding: const EdgeInsets.all(20.0),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              Container(
                                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                                decoration: BoxDecoration(
                                  color: Colors.pink,
                                  borderRadius: BorderRadius.circular(4),
                                ),
                                child: Text(
                                  banner['title']!,
                                  style: const TextStyle(
                                    color: Colors.white,
                                    fontSize: 10,
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                              ),
                              const SizedBox(height: 8),
                              Text(
                                banner['subtitle']!,
                                style: const TextStyle(
                                  fontFamily: 'Poppins',
                                  color: Colors.white,
                                  fontSize: 18,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                              const SizedBox(height: 4),
                              const Text(
                                'Tap to Redeem Code',
                                style: TextStyle(
                                  color: Colors.white70,
                                  fontSize: 10,
                                  decoration: TextDecoration.underline,
                                ),
                              ),
                            ],
                          ),
                        ),
                      );
                    },
                  ),
                  Positioned(
                    bottom: 12,
                    left: 0,
                    right: 0,
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: List.generate(
                        _banners.length,
                        (index) => Container(
                          margin: const EdgeInsets.symmetric(horizontal: 3),
                          width: _activeBanner == index ? 16 : 6,
                          height: 6,
                          decoration: BoxDecoration(
                            color: _activeBanner == index ? Colors.white : Colors.white60,
                            borderRadius: BorderRadius.circular(3),
                          ),
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),

            const SizedBox(height: 20),

            // Quick Access Categories Circles
            const Padding(
              padding: EdgeInsets.symmetric(horizontal: 16.0),
              child: Text(
                'Shop by Concerns',
                style: TextStyle(
                  fontFamily: 'Poppins',
                  fontSize: 16,
                  fontWeight: FontWeight.bold,
                  color: Color(0xFF2C2438),
                ),
              ),
            ),
            const SizedBox(height: 12),
            SizedBox(
              height: 90,
              child: ListView.builder(
                padding: const EdgeInsets.symmetric(horizontal: 12),
                scrollDirection: Axis.horizontal,
                itemCount: DummyData.categories.length,
                itemBuilder: (context, index) {
                  final cat = DummyData.categories[index];
                  return Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 6.0),
                    child: Column(
                      children: [
                        CircleAvatar(
                          radius: 26,
                          backgroundImage: NetworkImage(cat.imageUrl),
                        ),
                        const SizedBox(height: 6),
                        Text(
                          cat.name,
                          style: const TextStyle(fontSize: 10, fontWeight: FontWeight.w600, color: Color(0xFF2C2438)),
                        ),
                      ],
                    ),
                  );
                },
              ),
            ),

            const SizedBox(height: 12),

            // Promotional Mini Cards Bar
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16.0),
              child: Row(
                children: [
                  Expanded(
                    child: _infoCard(
                      icon: Icons.local_shipping_outlined,
                      title: 'Free Delivery',
                      desc: 'Above ₹499 order',
                      color: const Color(0xFFECEFF1),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: _infoCard(
                      icon: Icons.shield_outlined,
                      title: '100% Genuine',
                      desc: 'Direct dispatch brand',
                      color: const Color(0xFFE8F5E9),
                    ),
                  ),
                ],
              ),
            ),

            const SizedBox(height: 24),

            // Bestsellers / Featured Section
            _sectionHeader(
              title: 'Featured Bestsellers',
              onSeeAll: () {
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text('Showing all Bestselling beauty products')),
                );
              },
            ),
            SizedBox(
              height: 250,
              child: ListView.builder(
                padding: const EdgeInsets.symmetric(horizontal: 12),
                scrollDirection: Axis.horizontal,
                itemCount: featuredProducts.length,
                itemBuilder: (context, index) {
                  final product = featuredProducts[index];
                  return Container(
                    width: 165,
                    padding: const EdgeInsets.symmetric(horizontal: 4.0),
                    child: ProductCard(
                      product: product,
                      onAddToCart: () {
                        cartService.addToCart(product);
                        _showAddedSnackBar(context, product.name);
                      },
                      onTap: () => _openProductDetailScreen(context, product),
                    ),
                  );
                },
              ),
            ),

            const SizedBox(height: 24),

            // Middle Banner
            Container(
              margin: const EdgeInsets.symmetric(horizontal: 16),
              height: 110,
              width: double.infinity,
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(16),
                image: const DecorationImage(
                  image: NetworkImage(
                    'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=500&auto=format&fit=crop&q=80',
                  ),
                  fit: BoxFit.cover,
                ),
              ),
              child: Container(
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(16),
                  gradient: LinearGradient(
                    colors: [Colors.black.withOpacity(0.6), Colors.transparent],
                  ),
                ),
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: const [
                    Text(
                      'STAY CONCEALED & GLOW',
                      style: TextStyle(color: Colors.pink, fontSize: 10, fontWeight: FontWeight.bold),
                    ),
                    Text(
                      'Flawless Foundations',
                      style: TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold),
                    ),
                    Text(
                      'Matches 100% skin tones',
                      style: TextStyle(color: Colors.white70, fontSize: 11),
                    ),
                  ],
                ),
              ),
            ),

            const SizedBox(height: 24),

            // Trending Products Section
            _sectionHeader(
              title: 'Trending Right Now',
              onSeeAll: () {
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text('Showing all Trending cosmetics')),
                );
              },
            ),
            SizedBox(
              height: 250,
              child: ListView.builder(
                padding: const EdgeInsets.symmetric(horizontal: 12),
                scrollDirection: Axis.horizontal,
                itemCount: trendingProducts.length,
                itemBuilder: (context, index) {
                  final product = trendingProducts[index];
                  return Container(
                    width: 165,
                    padding: const EdgeInsets.symmetric(horizontal: 4.0),
                    child: ProductCard(
                      product: product,
                      onAddToCart: () {
                        cartService.addToCart(product);
                        _showAddedSnackBar(context, product.name);
                      },
                      onTap: () => _openProductDetailScreen(context, product),
                    ),
                  );
                },
              ),
            ),

            const SizedBox(height: 24),

            // Recommended (Full Grid representation)
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16.0),
              child: Row(
                children: const [
                  Text(
                    'Recommended For You',
                    style: TextStyle(
                      fontFamily: 'Poppins',
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                      color: Color(0xFF2C2438),
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 12),
            GridView.builder(
              padding: const EdgeInsets.symmetric(horizontal: 12),
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                crossAxisCount: 2,
                childAspectRatio: 0.65,
                mainAxisSpacing: 12,
                crossAxisSpacing: 8,
              ),
              itemCount: 4,
              itemBuilder: (context, index) {
                // Show items that are neither trending nor bestseller specifically first to avoid duplicates
                final product = allProducts[index + 6];
                return ProductCard(
                  product: product,
                  onAddToCart: () {
                    cartService.addToCart(product);
                    _showAddedSnackBar(context, product.name);
                  },
                  onTap: () => _openProductDetailScreen(context, product),
                );
              },
            ),
            const SizedBox(height: 40),
          ],
        ),
      ),
    );
  }

  Widget _infoCard({
    required IconData icon,
    required String title,
    required String desc,
    required Color color,
  }) {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: color,
        borderRadius: BorderRadius.circular(12),
      ),
      child: Row(
        children: [
          Icon(icon, size: 28, color: Colors.blueGrey[800]),
          const SizedBox(width: 8),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 11, color: Color(0xFF2C2438)),
                ),
                Text(
                  desc,
                  style: const TextStyle(fontSize: 9, color: Colors.grey),
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
              ],
            ),
          )
        ],
      ),
    );
  }

  Widget _sectionHeader({required String title, required VoidCallback onSeeAll}) {
    return Padding(
      padding: const EdgeInsets.only(left: 16.0, right: 8.0, bottom: 12.0),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(
            title,
            style: const TextStyle(
              fontFamily: 'Poppins',
              fontSize: 16,
              fontWeight: FontWeight.bold,
              color: Color(0xFF2C2438),
            ),
          ),
          TextButton(
            onPressed: onSeeAll,
            child: const Text('See All', style: TextStyle(fontWeight: FontWeight.w600, fontSize: 12)),
          ),
        ],
      ),
    );
  }

  void _showAddedSnackBar(BuildContext context, String name) {
    ScaffoldMessenger.of(context).hideCurrentSnackBar();
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('$name added to cart successfully!'),
        action: SnackBarAction(
          label: 'UNDO',
          onPressed: () {
            // Standard action
          },
        ),
      ),
    );
  }

  void _openProductDetailScreen(BuildContext context, Product product) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) {
        final cartService = Provider.of<CartService>(context, listen: false);
        return Container(
          height: MediaQuery.of(context).size.height * 0.85,
          decoration: const BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.only(
              topLeft: Radius.circular(24),
              topRight: Radius.circular(24),
            ),
          ),
          child: Column(
            children: [
              // Top Drag Handle Bar
              Center(
                child: Container(
                  margin: const EdgeInsets.symmetric(vertical: 12),
                  width: 40,
                  height: 4,
                  decoration: BoxDecoration(color: Colors.grey[300], borderRadius: BorderRadius.circular(2)),
                ),
              ),
              Expanded(
                child: SingleChildScrollView(
                  padding: const EdgeInsets.all(20),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      ClipRRect(
                        borderRadius: BorderRadius.circular(16),
                        child: Image.network(
                          product.imageUrl,
                          height: 280,
                          width: double.infinity,
                          fit: BoxFit.cover,
                        ),
                      ),
                      const SizedBox(height: 16),
                      Text(
                        product.brand.toUpperCase(),
                        style: TextStyle(
                            color: Theme.of(context).primaryColor, fontSize: 12, fontWeight: FontWeight.bold, letterSpacing: 1),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        product.name,
                        style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: Color(0xFF2C2438)),
                      ),
                      const SizedBox(height: 8),

                      Row(
                        children: [
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                            decoration: BoxDecoration(color: Colors.green[50], borderRadius: BorderRadius.circular(6)),
                            child: Row(
                              children: [
                                Text(product.rating.toString(),
                                    style: const TextStyle(color: Colors.green, fontWeight: FontWeight.bold, fontSize: 12)),
                                const SizedBox(width: 4),
                                const Icon(Icons.star, color: Colors.green, size: 12),
                              ],
                            ),
                          ),
                          const SizedBox(width: 8),
                          Text('${product.reviewCount} customer reviews', style: const TextStyle(color: Colors.grey, fontSize: 12)),
                          const Spacer(),
                          if (product.isBestSeller)
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                              decoration: BoxDecoration(color: Colors.pink[50], borderRadius: BorderRadius.circular(6)),
                              child: const Text('Bestseller', style: TextStyle(color: Colors.pink, fontWeight: FontWeight.bold, fontSize: 11)),
                            )
                        ],
                      ),
                      const SizedBox(height: 16),

                      Row(
                        children: [
                          Text(
                            '₹${product.discountPrice.toStringAsFixed(0)}',
                            style: const TextStyle(fontSize: 24, fontWeight: FontWeight.bold, color: Color(0xFF2C2438)),
                          ),
                          const SizedBox(width: 10),
                          Text(
                            '₹${product.originalPrice.toStringAsFixed(0)}',
                            style: TextStyle(fontSize: 16, color: Colors.grey[400], decoration: TextDecoration.lineThrough),
                          ),
                          const SizedBox(width: 10),
                          Text(
                            '${product.discountPercentage.toStringAsFixed(0)}% OFF',
                            style: const TextStyle(fontSize: 14, color: Colors.red, fontWeight: FontWeight.bold),
                          ),
                        ],
                      ),
                      const SizedBox(height: 20),

                      const Text('Description', style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: Color(0xFF2C2438))),
                      const SizedBox(height: 6),
                      Text(
                        product.description,
                        style: TextStyle(fontSize: 13, color: Colors.grey[600], height: 1.5),
                      ),
                      const SizedBox(height: 20),

                      if (product.shades.isNotEmpty) ...[
                        const Text('Available Shades', style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: Color(0xFF2C2438))),
                        const SizedBox(height: 10),
                        SizedBox(
                          height: 38,
                          child: ListView.builder(
                            scrollDirection: Axis.horizontal,
                            itemCount: product.shades.length,
                            itemBuilder: (context, idx) {
                              final shade = product.shades[idx];
                              return Container(
                                margin: const EdgeInsets.only(right: 10),
                                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                                decoration: BoxDecoration(
                                  border: Border.all(color: Colors.grey[300]!),
                                  borderRadius: BorderRadius.circular(20),
                                ),
                                child: Text(shade, style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w600)),
                              );
                            },
                          ),
                        ),
                        const SizedBox(height: 20),
                      ],

                      // Secure Transaction Badges
                      const Divider(),
                      const SizedBox(height: 12),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceAround,
                        children: [
                          _badgeItem(icon: Icons.refresh, title: 'Easy Returns'),
                          _badgeItem(icon: Icons.local_shipping, title: 'Fast Delivery'),
                          _badgeItem(icon: Icons.sentiment_very_satisfied, title: 'Cruelty-Free'),
                        ],
                      ),
                      const SizedBox(height: 20),
                    ],
                  ),
                ),
              ),

              // Sticky Add to Cart Board
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: Colors.white,
                  boxShadow: [BoxShadow(color: Colors.black12, blurRadius: 10, offset: const Offset(0, -2))],
                ),
                child: Row(
                  children: [
                    Expanded(
                      child: ElevatedButton.icon(
                        style: ElevatedButton.styleFrom(
                          backgroundColor: Theme.of(context).primaryColor,
                          padding: const EdgeInsets.symmetric(vertical: 16),
                        ),
                        icon: const Icon(Icons.shopping_bag_outlined),
                        label: const Text('ADD TO CART'),
                        onPressed: () {
                          cartService.addToCart(product);
                          Navigator.pop(context);
                          _showAddedSnackBar(context, product.name);
                        },
                      ),
                    ),
                  ],
                ),
              )
            ],
          );
        };
      },
    );
  }

  Widget _badgeItem({required IconData icon, required String title}) {
    return Column(
      children: [
        Icon(icon, size: 20, color: Colors.grey[700]),
        const SizedBox(height: 4),
        Text(title, style: TextStyle(color: Colors.grey[600], fontSize: 10)),
      ],
    );
  }
}
