import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

export default function NotFoundScreen() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-white items-center justify-center p-5">
      <Text className="text-3xl font-bold text-red-500 mb-4">
        404 - Page Not Found
      </Text>
      <Text className="text-gray-600 text-center mb-6">
        The page you are looking for does not exist.
      </Text>

      <TouchableOpacity
        className="bg-blue-500 p-4 rounded-lg"
        onPress={() => router.back()}
      >
        <Text className="text-white text-lg font-semibold">Go Back</Text>
      </TouchableOpacity>
    </View>
  );
}
