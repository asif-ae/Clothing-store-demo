import ProductItem from "@/components/explore/ProductItem";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";

// Define the Product type
type Product = {
  id: number;
  image: string;
  title: string;
  price: number;
  category: string;
  description: string;
};

// Define the RootStackParamList type
type RootStackParamList = {
  productDetails: Product;
};

export default function TabTwoScreen() {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [visibleProductsCount, setVisibleProductsCount] = useState<number>(5); // Number of products to show initially
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  // Fetch products based on category
  const fetchProducts = async (category: string) => {
    setIsLoading(true);
    try {
      const endpoint =
        category === "all"
          ? "https://fakestoreapi.com/products"
          : `https://fakestoreapi.com/products/category/${category}`;
      const response = await fetch(endpoint);
      const data = await response.json();

      const products: Product[] = data.map((prod: any) => ({
        id: prod.id,
        image: prod.image,
        title: prod.title,
        price: prod.price,
        category: prod.category,
        description: prod.description,
      }));

      setAllProducts(products);

      // Set categories only for the first fetch
      if (category === "all" && categories.length === 0) {
        const uniqueCategories = Array.from(
          new Set(products.map((prod) => prod.category))
        );
        setCategories(["all", ...uniqueCategories]);
      }

      setVisibleProductsCount(5); // Reset visible products count
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts("all");
  }, []);

  // Trigger refetch when category changes
  useEffect(() => {
    setAllProducts([]);
    fetchProducts(selectedCategory);
  }, [selectedCategory]);

  // Filtered products based on search term
  const filteredProducts = useMemo(() => {
    if (searchTerm.trim()) {
      return allProducts.filter((product) =>
        product.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    return allProducts;
  }, [allProducts, searchTerm]);

  // Visible products for infinite scrolling
  const visibleProducts = useMemo(() => {
    return filteredProducts.slice(0, visibleProductsCount);
  }, [filteredProducts, visibleProductsCount]);

  const handleLoadMore = () => {
    if (visibleProductsCount < filteredProducts.length) {
      setVisibleProductsCount((prev) => prev + 5); // Load 5 more items
    }
  };

  const handleProductPress = useCallback(
    (product: Product) => {
      navigation.navigate("productDetails", product);
    },
    [navigation]
  );

  const renderCategoryItem = ({ item }: { item: string }) => (
    <Pressable
      onPress={() => setSelectedCategory(item)}
      className={`px-4 py-2 rounded-lg ${
        selectedCategory === item
          ? "bg-fuchsia-600 text-white"
          : "bg-gray-200 text-gray-600"
      }`}
    >
      <Text
        className={`font-medium ${
          selectedCategory === item ? "text-white" : "text-gray-600"
        }`}
      >
        {item.charAt(0).toUpperCase() + item.slice(1)}
      </Text>
    </Pressable>
  );

  return (
    <View className="flex-1 bg-gray-100">
      {/* Title */}
      <Text className="text-2xl font-light text-fuchsia-600 my-1 text-center py-2">
        Browse through everything
      </Text>

      {/* Search Bar */}
      <View className="flex flex-row items-center mx-4 mb-4 space-x-2">
        <TextInput
          className="flex-1 bg-gray-100 p-3 rounded-lg border border-gray-300"
          placeholder="Search products..."
          value={searchTerm}
          onChangeText={(text) => setSearchTerm(text)}
        />
      </View>

      {/* Category Filter */}
      <View style={{ height: 60, marginBottom: 5 }}>
        <FlatList
          data={categories}
          horizontal
          keyExtractor={(item) => item}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 16,
            alignItems: "center",
            gap: 8,
          }}
          renderItem={renderCategoryItem}
        />
      </View>

      {/* Product List */}
      <FlatList
        data={visibleProducts}
        keyExtractor={(item) => `${item.id}`}
        renderItem={({ item }) => (
          <ProductItem product={item} onPress={handleProductPress} />
        )}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListEmptyComponent={
          isLoading ? (
            <ActivityIndicator size="large" color="#7F00FF" />
          ) : (
            <Text className="text-center text-gray-500 mt-20">
              No products found.
            </Text>
          )
        }
        style={{ flex: 1, marginTop: 5 }}
        contentContainerStyle={{ paddingBottom: 100 }}
      />
    </View>
  );
}
