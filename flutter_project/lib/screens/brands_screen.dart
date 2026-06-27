import 'package:flutter/material.dart';
import '../data/dummy_data.dart';
import '../models/brand.dart';

class BrandsScreen extends StatefulWidget {
  const BrandsScreen({Key? key}) : super(key: key);

  @override
  State<BrandsScreen> createState() => _BrandsScreenState();
}

class _BrandsScreenState extends State<BrandsScreen> {
  final TextEditingController _searchController = TextEditingController();
  List<Brand> _filteredBrands = [];

  @override
  void initState() {
    _filteredBrands = DummyData.brands;
    _searchController.addListener(_filterBrands);
    super.initState();
  }

  @override
  void dispose() {
    _searchController.removeListener(_filterBrands);
    _searchController.dispose();
    super.dispose();
  }

  void _filterBrands() {
    final text = _searchController.text.trim().toLowerCase();
    setState(() {
      if (text.isEmpty) {
        _filteredBrands = DummyData.brands;
      } else {
        _filteredBrands = DummyData.brands
            .where((brand) => brand.name.toLowerCase().contains(text))
            .toList();
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text(
          'Featured Brands',
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
                hintText: 'Search beauty brand collections...',
                prefixIcon: Icon(Icons.verified, color: Colors.grey),
              ),
            ),
          ),

          // Grid list layout
          Expanded(
            child: _filteredBrands.isEmpty
                ? _emptyState()
                : GridView.builder(
                    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                    gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                      crossAxisCount: 2,
                      childAspectRatio: 0.95,
                      crossAxisSpacing: 12,
                      mainAxisSpacing: 12,
                    ),
                    itemCount: _filteredBrands.length,
                    itemBuilder: (context, index) {
                      final brand = _filteredBrands[index];
                      return _brandCard(brand);
                    },
                  ),
          ),
        ],
      ),
    );
  }

  Widget _brandCard(Brand brand) {
    final primaryColor = Theme.of(context).primaryColor;

    return GestureDetector(
      onTap: () {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Opening catalog of exclusive certified cosmetics by ${brand.name}!')),
        );
      },
      child: Card(
        child: Padding(
          padding: const EdgeInsets.all(12.0),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              CircleAvatar(
                radius: 30,
                backgroundImage: NetworkImage(brand.logoUrl),
                backgroundColor: Colors.grey[100],
              ),
              const SizedBox(height: 10),
              Text(
                brand.name,
                style: const TextStyle(
                  fontFamily: 'Poppins',
                  fontSize: 14,
                  fontWeight: FontWeight.bold,
                  color: Color(0xFF2C2438),
                ),
              ),
              const SizedBox(height: 2),
              Expanded(
                child: Text(
                  brand.description,
                  style: const TextStyle(
                    fontSize: 9,
                    color: Colors.grey,
                  ),
                  textAlign: TextAlign.center,
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                ),
              ),
              const SizedBox(height: 4),
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Text(
                    'Exclusive shop',
                    style: TextStyle(
                      fontSize: 9,
                      fontWeight: FontWeight.bold,
                      color: primaryColor,
                    ),
                  ),
                  const SizedBox(width: 2),
                  Icon(Icons.arrow_forward, size: 8, color: primaryColor),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _emptyState() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(Icons.verified_user_outlined, size: 64, color: Colors.grey[400]),
          const SizedBox(height: 12),
          const Text(
            'No Brands Found',
            style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
          ),
          const SizedBox(height: 4),
          const Text(
            'Check for typographical typos or synonyms',
            style: TextStyle(color: Colors.grey, fontSize: 12),
          ),
        ],
      ),
    );
  }
}
