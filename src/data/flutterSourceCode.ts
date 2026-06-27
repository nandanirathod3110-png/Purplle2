export interface FlutterFile {
  path: string;
  name: string;
  content: string;
}

export const flutterSourceCode: FlutterFile[] = [
  {
    path: 'pubspec.yaml',
    name: 'pubspec.yaml',
    content: `name: purplle_beauty_app
description: "A complete, production-ready Flutter e-commerce application inspired by the Purplle beauty and cosmetics shopping experience."
publish_to: 'none'

version: 1.0.0+1

environment:
  sdk: '>=3.0.0 <4.0.0'

dependencies:
  flutter:
    sdk: flutter
  cupertino_icons: ^1.0.6
  google_fonts: ^6.1.0
  provider: ^6.1.1
  shared_preferences: ^2.2.2
  intl: ^0.19.0

dev_dependencies:
  flutter_test:
    sdk: flutter
  flutter_lints: ^3.0.1

flutter:
  uses-material-design: true

  # Asset assets configurations for logos or product placeholders
  assets:
    - assets/images/
    - assets/logos/

  fonts:
    - family: Poppins
      fonts:
        - asset: google_fonts/Poppins-Regular.ttf
        - asset: google_fonts/Poppins-Medium.ttf
          weight: 500
        - asset: google_fonts/Poppins-SemiBold.ttf
          weight: 600
        - asset: google_fonts/Poppins-Bold.ttf
          weight: 700`
  },
  {
    path: 'lib/main.dart',
    name: 'main.dart',
    content: `import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'screens/login_screen.dart';
import 'services/cart_service.dart';
import 'theme/app_theme.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(
    MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => CartService()),
      ],
      child: const PurplleBeautyApp(),
    ),
  );
}

class PurplleBeautyApp extends StatelessWidget {
  const PurplleBeautyApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Purplle Beauty',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.lightTheme,
      home: const LoginScreen(),
    );
  }
}`
  },
  {
    path: 'lib/models/product.dart',
    name: 'product.dart',
    content: `class Product {
  final String id;
  final String name;
  final String brand;
  final String description;
  final String imageUrl;
  final double originalPrice;
  final double discountPrice;
  final double rating;
  final int reviewCount;
  final String categoryId;
  final bool isBestSeller;
  final bool isTrending;
  final List<String> shades;

  Product({
    required this.id,
    required this.name,
    required this.brand,
    required this.description,
    required this.imageUrl,
    required this.originalPrice,
    required this.discountPrice,
    required this.rating,
    required this.reviewCount,
    required this.categoryId,
    this.isBestSeller = false,
    this.isTrending = false,
    this.shades = const [],
  });

  double get discountPercentage {
    if (originalPrice <= 0) return 0.0;
    return ((originalPrice - discountPrice) / originalPrice) * 100;
  }

  Map<String, dynamic> toMap() {
    return {
      'id': id,
      'name': name,
      'brand': brand,
      'description': description,
      'imageUrl': imageUrl,
      'originalPrice': originalPrice,
      'discountPrice': discountPrice,
      'rating': rating,
      'reviewCount': reviewCount,
      'categoryId': categoryId,
      'isBestSeller': isBestSeller ? 1 : 0,
      'isTrending': isTrending ? 1 : 0,
      'shades': shades,
    };
  }
}`
  },
  {
    path: 'lib/models/category.dart',
    name: 'category.dart',
    content: `class Category {
  final String id;
  final String name;
  final String imageUrl;
  final String iconName;

  Category({
    required this.id,
    required this.name,
    required this.imageUrl,
    this.iconName = "",
  });

  Map<String, dynamic> toMap() {
    return {
      'id': id,
      'name': name,
      'imageUrl': imageUrl,
      'iconName': iconName,
    };
  }
}`
  },
  {
    path: 'lib/models/brand.dart',
    name: 'brand.dart',
    content: `class Brand {
  final String id;
  final String name;
  final String logoUrl;
  final String description;
  final bool isPopular;

  Brand({
    required this.id,
    required this.name,
    required this.logoUrl,
    required this.description,
    this.isPopular = false,
  });

  Map<String, dynamic> toMap() {
    return {
      'id': id,
      'name': name,
      'logoUrl': logoUrl,
      'description': description,
      'isPopular': isPopular ? 1 : 0,
    };
  }
}`
  },
  {
    path: 'lib/models/offer.dart',
    name: 'offer.dart',
    content: `class Offer {
  final String id;
  final String title;
  final String code;
  final double discountPercent;
  final double minPurchaseAmount;
  final String imageUrl;
  final String expiryDate;
  final String description;

  Offer({
    required this.id,
    required this.title,
    required this.code,
    required this.discountPercent,
    required this.minPurchaseAmount,
    required this.imageUrl,
    required this.expiryDate,
    required this.description,
  });

  Map<String, dynamic> toMap() {
    return {
      'id': id,
      'title': title,
      'code': code,
      'discountPercent': discountPercent,
      'minPurchaseAmount': minPurchaseAmount,
      'imageUrl': imageUrl,
      'expiryDate': expiryDate,
      'description': description,
    };
  }
}`
  },
  {
    path: 'lib/models/cart.dart',
    name: 'cart.dart',
    content: `import 'product.dart';

class CartItem {
  final Product product;
  int quantity;
  String? selectedShade;

  CartItem({
    required this.product,
    this.quantity = 1,
    this.selectedShade,
  });

  double get totalPrice {
    return product.discountPrice * quantity;
  }
}`
  },
  {
    path: 'lib/theme/app_theme.dart',
    name: 'app_theme.dart',
    content: `import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class AppTheme {
  static const Color primaryColor = Color(0xFF6200EE);
  static const Color secondaryColor = Color(0xFFEDE7F6);
  static const Color accentColor = Color(0xFFE91E63);
  static const Color coralColor = Color(0xFFFF5722);
  static const Color surfaceColor = Colors.white;
  static const Color backgroundColor = Color(0xFFF9F9FB);
  static const Color textDark = Color(0xFF2C2438);
  static const Color textLight = Color(0xFF8C7E9D);

  static ThemeData get lightTheme {
    return ThemeData(
      useMaterial3: true,
      colorScheme: const ColorScheme.light(
        primary: primaryColor,
        secondary: secondaryColor,
        error: Colors.red,
        surface: surfaceColor,
      ),
      scaffoldBackgroundColor: backgroundColor,
      textTheme: GoogleFonts.poppinsTextTheme().copyWith(
        displayLarge: GoogleFonts.poppins(fontSize: 32, fontWeight: FontWeight.bold, color: textDark),
        titleLarge: GoogleFonts.poppins(fontSize: 20, fontWeight: FontWeight.bold, color: textDark),
        titleMedium: GoogleFonts.poppins(fontSize: 16, fontWeight: FontWeight.w600, color: textDark),
        bodyLarge: GoogleFonts.poppins(fontSize: 14, color: textDark),
        bodyMedium: GoogleFonts.poppins(fontSize: 12, color: textLight),
      ),
      appBarTheme: const AppBarTheme(
        backgroundColor: Colors.white,
        elevation: 0,
        centerTitle: false,
        iconTheme: IconThemeData(color: textDark),
        titleTextStyle: TextStyle(
          color: textDark,
          fontSize: 20,
          fontWeight: FontWeight.bold,
          fontFamily: 'Poppins',
        ),
      ),
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: primaryColor,
          foregroundColor: Colors.white,
          minimumSize: const Size(double.infinity, 50),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12),
          ),
          textStyle: const TextStyle(
            fontSize: 16,
            fontWeight: FontWeight.w600,
            fontFamily: 'Poppins',
          ),
        ),
      ),
      bottomNavigationBarTheme: const BottomNavigationBarThemeData(
        selectedItemColor: primaryColor,
        unselectedItemColor: Colors.grey,
        backgroundColor: Colors.white,
        type: BottomNavigationBarType.fixed,
        elevation: 12,
      ),
      cardTheme: CardTheme(
        color: Colors.white,
        elevation: 1.5,
        shadowColor: Colors.black.withOpacity(0.08),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(14),
        ),
      ),
    );
  }
}`
  },
  {
    path: 'lib/services/cart_service.dart',
    name: 'cart_service.dart',
    content: `import 'package:flutter/material.dart';
import '../models/cart.dart';
import '../models/product.dart';
import '../models/offer.dart';

class CartService with ChangeNotifier {
  final List<CartItem> _items = [];
  Offer? _appliedOffer;

  List<CartItem> get items => _items;
  Offer? get appliedOffer => _appliedOffer;

  int get cartCount {
    return _items.fold(0, (sum, item) => sum + item.quantity);
  }

  double get subtotal {
    return _items.fold(0.0, (sum, item) => sum + item.totalPrice);
  }

  double get discountAmount {
    if (_appliedOffer == null) return 0.0;
    if (subtotal < _appliedOffer!.minPurchaseAmount) return 0.0;
    return (subtotal * _appliedOffer!.discountPercent) / 100.0;
  }

  double get deliveryFee {
    if (subtotal == 0 || subtotal >= 499) return 0.0;
    return 49.00;
  }

  double get grandTotal {
    double total = subtotal - discountAmount + deliveryFee;
    return total < 0 ? 0.0 : total;
  }

  void addToCart(Product product, {String? shade}) {
    int index = _items.indexWhere((item) => item.product.id == product.id && item.selectedShade == shade);
    if (index >= 0) {
      _items[index].quantity++;
    } else {
      _items.add(CartItem(product: product, selectedShade: shade, quantity: 1));
    }
    notifyListeners();
  }

  void updateQuantity(String id, int quantity, {String? shade}) {
    int index = _items.indexWhere((item) => item.product.id == id && item.selectedShade == shade);
    if (index >= 0) {
      if (quantity <= 0) {
        _items.removeAt(index);
      } else {
        _items[index].quantity = quantity;
      }
      notifyListeners();
    }
  }

  void removeFromCart(String id, {String? shade}) {
    _items.removeWhere((item) => item.product.id == id && item.selectedShade == shade);
    notifyListeners();
  }

  bool applyCoupon(String code, List<Offer> availableOffers) {
    try {
      Offer match = availableOffers.firstWhere(
        (off) => off.code.toUpperCase() == code.toUpperCase().trim(),
      );
      if (subtotal >= match.minPurchaseAmount) {
        _appliedOffer = match;
        notifyListeners();
        return true;
      }
    } catch (_) {}
    return false;
  }

  void removeCoupon() {
    _appliedOffer = null;
    notifyListeners();
  }

  void clearCart() {
    _items.clear();
    _appliedOffer = null;
    notifyListeners();
  }
}`
  },
  {
    path: 'lib/widgets/custom_textfield.dart',
    name: 'custom_textfield.dart',
    content: `import 'package:flutter/material.dart';

class CustomTextField extends StatelessWidget {
  final TextEditingController controller;
  final String labelText;
  final String hintText;
  final bool isPassword;
  final Widget? suffixIcon;
  final IconData? prefixIcon;
  final String? Function(String?)? validator;
  final TextInputType keyboardType;

  const CustomTextField({
    Key? key,
    required this.controller,
    required this.labelText,
    required this.hintText,
    this.isPassword = false,
    this.suffixIcon,
    this.prefixIcon,
    this.validator,
    this.keyboardType = TextInputType.text,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return TextFormField(
      controller: controller,
      obscureText: isPassword,
      keyboardType: keyboardType,
      validator: validator,
      style: const TextStyle(fontSize: 14),
      decoration: InputDecoration(
        labelText: labelText,
        hintText: hintText,
        prefixIcon: prefixIcon != null 
          ? Icon(prefixIcon, size: 20, color: Theme.of(context).primaryColor) 
          : null,
        suffixIcon: suffixIcon,
      ),
    );
  }
}`
  },
  {
    path: 'lib/widgets/custom_button.dart',
    name: 'custom_button.dart',
    content: `import 'package:flutter/material.dart';

class CustomButton extends StatelessWidget {
  final String text;
  final VoidCallback onPressed;
  final bool isLoading;
  final Color? backgroundColor;
  final Color? textColor;
  final double borderRadius;

  const CustomButton({
    Key? key,
    required this.text,
    required this.onPressed,
    this.isLoading = false,
    this.backgroundColor,
    this.textColor,
    this.borderRadius = 12.0,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return ElevatedButton(
      onPressed: isLoading ? null : onPressed,
      style: ElevatedButton.styleFrom(
        backgroundColor: backgroundColor ?? Theme.of(context).primaryColor,
        foregroundColor: textColor ?? Colors.white,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(borderRadius),
        ),
        elevation: 1,
      ),
      child: isLoading
          ? const SizedBox(
              height: 20,
              width: 20,
              child: CircularProgressIndicator(
                strokeWidth: 2,
                color: Colors.white,
              ),
            )
          : Text(
              text,
              style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 15),
            ),
    );
  }
}`
  },
  {
    path: 'lib/widgets/product_card.dart',
    name: 'product_card.dart',
    content: `import 'package:flutter/material.dart';
import '../models/product.dart';

class ProductCard extends StatelessWidget {
  final Product product;
  final VoidCallback onAddToCart;
  final VoidCallback onTap;

  const ProductCard({
    Key? key,
    required this.product,
    required this.onAddToCart,
    required this.onTap,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final double discount = product.discountPercentage;

    return GestureDetector(
      onTap: onTap,
      child: Card(
        clipBehavior: Clip.antiAlias,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Stack(
              children: [
                AspectRatio(
                  aspectRatio: 1.1,
                  child: Image.network(
                    product.imageUrl,
                    fit: BoxFit.cover,
                  ),
                ),
                if (discount > 0)
                  Positioned(
                    top: 8,
                    left: 8,
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                      decoration: BoxDecoration(
                        color: const Color(0xFFFF5722),
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: Text(
                        '\${discount.toStringAsFixed(0)}% OFF',
                        style: const TextStyle(color: Colors.white, fontSize: 10, fontWeight: FontWeight.bold),
                      ),
                    ),
                  ),
              ],
            ),
            Expanded(
              child: Padding(
                padding: const EdgeInsets.all(8.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      product.brand.toUpperCase(),
                      style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: Theme.of(context).primaryColor),
                    ),
                    const SizedBox(height: 2),
                    Text(
                      product.name,
                      style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w500, color: Color(0xFF2C2438)),
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                    ),
                    const Spacer(),
                    Row(
                      children: [
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 5, vertical: 2),
                          decoration: BoxDecoration(color: Colors.green[50], borderRadius: BorderRadius.circular(4)),
                          child: Row(
                            children: [
                              Text(product.rating.toString(), style: const TextStyle(color: Colors.green, fontSize: 10, fontWeight: FontWeight.bold)),
                              const SizedBox(width: 2),
                              const Icon(Icons.star, color: Colors.green, size: 10),
                            ],
                          ),
                        ),
                        const SizedBox(width: 4),
                        Text('(\${product.reviewCount})', style: TextStyle(color: Colors.grey[500], fontSize: 10)),
                      ],
                    ),
                    const SizedBox(height: 6),
                    Row(
                      children: [
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            if (discount > 0)
                              Text('₹\${product.originalPrice.toStringAsFixed(0)}', style: TextStyle(color: Colors.grey[400], fontSize: 10, decoration: TextDecoration.lineThrough)),
                            Text('₹\${product.discountPrice.toStringAsFixed(0)}', style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
                          ],
                        ),
                        const Spacer(),
                        InkWell(
                          onTap: onAddToCart,
                          child: Container(
                            padding: const EdgeInsets.all(6),
                            decoration: BoxDecoration(color: Theme.of(context).colorScheme.secondary, borderRadius: BorderRadius.circular(8)),
                            child: Icon(Icons.add_shopping_cart, size: 16, color: Theme.of(context).primaryColor),
                          ),
                        )
                      ],
                    )
                  ],
                ),
              ),
            )
          ],
        ),
      ),
    );
  }
}`
  },
  {
    path: 'lib/screens/login_screen.dart',
    name: 'login_screen.dart',
    content: `import 'package:flutter/material.dart';
import '../widgets/custom_button.dart';
import '../widgets/custom_textfield.dart';
import 'dashboard_screen.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({Key? key}) : super(key: key);

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _formKey = GlobalKey<FormState>();
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  bool _obscurePassword = true;
  bool _isLoading = false;

  void _handleLogin() {
    if (_formKey.currentState!.validate()) {
      setState(() => _isLoading = true);
      Future.delayed(const Duration(milliseconds: 1500), () {
        if (mounted) {
          setState(() => _isLoading = false);
          Navigator.pushReplacement(context, MaterialPageRoute(builder: (context) => const DashboardScreen()));
        }
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    final primaryColor = Theme.of(context).primaryColor;
    return Scaffold(
      body: Container(
        width: double.infinity,
        decoration: BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
            colors: [primaryColor, primaryColor.withOpacity(0.85), Colors.white],
          ),
        ),
        child: SafeArea(
          child: Center(
            child: SingleChildScrollView(
              padding: const EdgeInsets.all(24.0),
              child: Form(
                key: _formKey,
                child: Column(
                  children: [
                    Container(
                      padding: const EdgeInsets.all(16),
                      decoration: const BoxDecoration(color: Colors.white, shape: BoxShape.circle),
                      child: Icon(Icons.auto_awesome, size: 64, color: primaryColor),
                    ),
                    const SizedBox(height: 16),
                    const Text('Purplle', style: TextStyle(fontSize: 32, fontWeight: FontWeight.bold, color: Colors.white)),
                    const SizedBox(height: 36),
                    Card(
                      child: Padding(
                        padding: const EdgeInsets.all(24.0),
                        child: Column(
                          children: [
                            CustomTextField(
                              controller: _emailController,
                              labelText: 'Email Address',
                              hintText: 'Enter your email',
                              prefixIcon: Icons.email_outlined,
                            ),
                            const SizedBox(height: 16),
                            CustomTextField(
                              controller: _passwordController,
                              labelText: 'Password',
                              hintText: 'Enter password',
                              isPassword: _obscurePassword,
                              suffixIcon: IconButton(
                                icon: Icon(_obscurePassword ? Icons.visibility_off : Icons.visibility),
                                onPressed: () => setState(() => _obscurePassword = !_obscurePassword),
                              ),
                            ),
                            const SizedBox(height: 24),
                            CustomButton(
                              text: 'LOGIN',
                              isLoading: _isLoading,
                              onPressed: _handleLogin,
                            ),
                          ],
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}`
  },
  {
    path: 'lib/screens/dashboard_screen.dart',
    name: 'dashboard_screen.dart',
    content: `import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../services/cart_service.dart';
import 'home_screen.dart';
import 'categories_screen.dart';
import 'brands_screen.dart';
import 'offers_screen.dart';
import 'cart_screen.dart';

class DashboardScreen extends StatefulWidget {
  const DashboardScreen({Key? key}) : super(key: key);

  @override
  State<DashboardScreen> createState() => _DashboardScreenState();
}

class _DashboardScreenState extends State<DashboardScreen> {
  int _currentIndex = 0;
  final List<Widget> _screens = [
    const HomeScreen(),
    const CategoriesScreen(),
    const BrandsScreen(),
    const OffersScreen(),
    const CartScreen(),
  ];

  @override
  Widget build(BuildContext context) {
    final cartCount = Provider.of<CartService>(context).cartCount;
    return Scaffold(
      body: IndexedStack(index: _currentIndex, children: _screens),
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _currentIndex,
        onTap: (idx) => setState(() => _currentIndex = idx),
        items: [
          const BottomNavigationBarItem(icon: Icon(Icons.home_outlined), label: 'Home'),
          const BottomNavigationBarItem(icon: Icon(Icons.grid_view), label: 'Categories'),
          const BottomNavigationBarItem(icon: Icon(Icons.verified), label: 'Brands'),
          const BottomNavigationBarItem(icon: Icon(Icons.local_offer), label: 'Offers'),
          BottomNavigationBarItem(
            icon: Badge(
              label: Text('$cartCount'),
              isLabelVisible: cartCount > 0,
              child: const Icon(Icons.shopping_cart),
            ),
            label: 'Cart',
          ),
        ],
      ),
    );
  }
}`
  }
];
