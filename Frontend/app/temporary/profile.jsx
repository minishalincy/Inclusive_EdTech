import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { useAuth } from "../context/authContext";

export default function ProfileScreen() {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.log("Logout error:", error);
    }
  };

  return (
    <View className="flex-1 bg-white items-center p-5">
      <View className="items-center mb-5">
        <Image
          source={require("../../assets/images/logo.jpg")}
          className="w-32 h-32 rounded-full mb-4"
        />
        <Text className="text-2xl font-bold text-blue-600">
          {user?.name || "User Profile"}
        </Text>
        <Text className="text-gray-500">{user?.email}</Text>
      </View>

      <TouchableOpacity
        className="border border-red-500 p-4 rounded-lg w-full"
        onPress={handleLogout}
      >
        <Text className="text-red-500 text-center text-lg font-semibold">
          Logout
        </Text>
      </TouchableOpacity>
    </View>
  );
}
