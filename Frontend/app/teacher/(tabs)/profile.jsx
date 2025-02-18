import React from "react";
import { View, Text, Image, TouchableOpacity, ScrollView } from "react-native";
import { useAuth } from "../../context/authContext";
import { MaterialIcons, FontAwesome5 } from "@expo/vector-icons";

export default function ProfileScreen() {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.log("Logout error:", error);
    }
  };

  const teachingTips = [
    {
      id: 1,
      tip: "Start each class with a quick review of previous concepts",
      icon: "lightbulb",
    },
    {
      id: 2,
      tip: "Use real-world examples to make lessons more relatable",
      icon: "puzzle-piece",
    },
    {
      id: 3,
      tip: "Incorporate group activities for better engagement",
      icon: "users",
    },
  ];

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="items-center p-5">
        {/* Profile Header */}
        <View className="items-center flex-row gap-5 mb-4">
          <View>
            <Image
              source={require("../../../assets/images/profile.jpg")}
              className="w-32 h-32 rounded-full mb-4"
            />
          </View>
          <View>
            <Text className="text-2xl font-bold text-blue-600">
              {user?.name || "User Profile"}
            </Text>
            <Text className="text-gray-500 mb-2">{user?.email}</Text>
          </View>
        </View>

        {/* Thought of the Day */}
        <View className="bg-blue-50 p-4 rounded-xl w-full mb-6">
          <View className="flex-row items-center mb-2">
            <MaterialIcons name="lightbulb" size={24} color="#1E40AF" />
            <Text className="text-blue-800 font-bold text-lg ml-2">
              Thought of the Day
            </Text>
          </View>
          <Text className="text-gray-700 italic">
            "Education is not the filling of a pail, but the lighting of a
            fire."
          </Text>
          <Text className="text-gray-500 text-right mt-1">
            - William Butler Yeats
          </Text>
        </View>

        {/* Teaching Tips */}
        <View className="w-full mb-6">
          <Text className="text-xl font-bold text-blue-800 mb-4">
            Teaching Tips
          </Text>
          {teachingTips.map((tip) => (
            <View
              key={tip.id}
              className="flex-row items-center bg-gray-50 p-4 rounded-lg mb-3"
            >
              <FontAwesome5 name={tip.icon} size={20} color="#1E40AF" />
              <Text className="text-gray-700 ml-3 flex-1">{tip.tip}</Text>
            </View>
          ))}
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          className="border border-red-500 p-4 rounded-lg w-full bg-red"
          onPress={handleLogout}
        >
          <Text className="text-red-500 text-center text-lg font-semibold">
            Logout
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
