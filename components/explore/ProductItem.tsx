// ProductItem.tsx
import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';

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

type ProductItemProps = {
  product: Product;
  onPress: (product: Product) => void;
};

const ProductItem: React.FC<ProductItemProps> = React.memo(
  ({ product, onPress }) => (
    <View className="flex flex-col h-max mb-6 self-center w-11/12 rounded-xl space-y-4 p-4 bg-white shadow-lg border border-gray-300">
      <TouchableOpacity onPress={() => onPress(product)}>
        <Image
          source={{ uri: product.image }}
          className="w-full h-48 rounded-t-xl"
          resizeMode="contain"
        />
        <View className="flex flex-col px-4 py-3 space-y-2">
          <Text className="text-lg font-semibold text-gray-900">
            {product.title}
          </Text>
          <Text className="text-sm text-gray-500 uppercase">
            {product.category}
          </Text>
          <Text className="text-lg font-bold text-green-600">
            {`$${product.price.toFixed(2)}`}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  )
);

export default ProductItem;
