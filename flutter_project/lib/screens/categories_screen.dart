import 'package:flutter/material.dart';
import '../data/dummy_data.dart';
import '../models/category.dart';

class CategoriesScreen extends StatefulWidget {
  const CategoriesScreen({Key? key}) : super(key: key);

  @override
  State<CategoriesScreen> createState() => _CategoriesScreenState();
}

class _CategoriesScreenState extends State<CategoriesScreen> {
  final TextEditingController _searchController = TextEditingController();
  List<Category> _filteredCategories = [];

  @override
  void initState() {
    _filteredCategories = DummyData.categories;
    _searchController.addListener(_filterCategories);
    super.initState();
  }

  @override
  void dispose() {
    _searchController.removeListener(_filterCategories);
    _searchController.dispose();
    super.dispose();
  }

  void _filterCategories() {
    final text = _searchController.text.trim().toLowerCase();
    setState(() {
      if (text.isEmpty) {
        _filteredCategories = DummyData.categories;
      } else {
        _filteredCategories = DummyData.categories
            .where((cat) => cat.name.toLowerCase().contains(text))
            .toList();
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text(
          'Popular Categories',
          style: TextStyle(
            fontFamily: 'Poppins',
            fontWeight: FontWeight.bold,
            color: Color(0xFF2C2438),
          ),
        ),
      ),
      body: Column(
        children: [
          // Search Input
          Padding(
            padding: const EdgeInsets.all(16.0),
            child: TextField(
              controller: _searchController,
              decoration: const InputDecoration(
                hintText: 'Search categories...',
                prefixIcon: Icon(Icons.search, color: Colors.grey),
              ),
            ),
          ),

          // Grid Layout Section
          Expanded(
            child: _filteredCategories.isEmpty
                ? _emptyState()
                : GridView.builder(
                    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                    gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                      crossAxisCount: 2,
                      childAspectRatio: 0.85,
                      crossAxisSpacing: 12,
                      mainAxisSpacing: 12,
                    ),
                    itemCount: _filteredCategories.length,
                    itemBuilder: (context, index) {
                      final category = _filteredCategories[index];
                      return _categoryCard(category);
                    },
                  ),
          ),
        ],
      ),
    );
  }

  Widget _categoryCard(Category category) {
    return GestureDetector(
      onTap: () {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Simulating products filter for ${category.name} namespace!')),
        );
      },
      child: Card(
        clipBehavior: Clip.antiAlias,
        child: Stack(
          children: [
            // Darkened Image Backdrop
            Positioned.fill(
              child: Image.network(
                category.imageUrl,
                fit: BoxFit.cover,
              ),
            ),
            Positioned.fill(
              child: Container(
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    begin: Alignment.topCenter,
                    end: Alignment.bottomCenter,
                    colors: [
                      Colors.transparent,
                      Colors.black.withOpacity(0.4),
                      Colors.black.withOpacity(0.8),
                    ],
                    stops: const [0.0, 0.5, 1.0],
                  ),
                ),
              ),
            ),

            // Content Card overlay
            Positioned(
              bottom: 12,
              left: 12,
              right: 12,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisSize: MainAxisSize.min,
                children: [
                  _categoryIcon(category.iconName),
                  const SizedBox(height: 6),
                  Text(
                    category.name,
                    style: const TextStyle(
                      fontFamily: 'Poppins',
                      color: Colors.white,
                      fontSize: 14,
                      fontWeight: FontWeight.bold,
                    ),
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                  const SizedBox(height: 2),
                  const Text(
                    'Explore Deal range',
                    style: TextStyle(color: Colors.white70, fontSize: 9),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _categoryIcon(String name) {
    IconData icon;
    switch (name) {
      case 'brush':
        icon = Icons.face_retouching_natural;
        break;
      case 'spa':
        icon = Icons.spa_outlined;
        break;
      case 'hair':
        icon = Icons.waves;
        break;
      case 'perfume':
        icon = Icons.water_drop_outlined;
        break;
      case 'bathtub':
        icon = Icons.bathtub_outlined;
        break;
      case 'construction':
        icon = Icons.clean_hands;
        break;
      case 'soap':
        icon = Icons.sanitizer_outlined;
        break;
      case 'face':
        icon = Icons.face;
        break;
      default:
        icon = Icons.palette_outlined;
    }

    return Container(
      padding: const EdgeInsets.all(5),
      decoration: const BoxDecoration(
        color: Colors.white24,
        shape: BoxShape.circle,
      ),
      child: Icon(icon, color: Colors.white, size: 14),
    );
  }

  Widget _emptyState() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(Icons.search_off_outlined, size: 64, color: Colors.grey[400]),
          const SizedBox(height: 12),
          const Text(
            'No Categories Found',
            style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
          ),
          const SizedBox(height: 4),
          const Text(
            'Try updating your search parameters',
            style: TextStyle(color: Colors.grey, fontSize: 12),
          ),
        ],
      ),
    );
  }
}
