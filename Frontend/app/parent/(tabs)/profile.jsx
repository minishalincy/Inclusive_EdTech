import React, { useState, useEffect } from "react";
import { View, Text, Image, TouchableOpacity, ScrollView } from "react-native";
import { useAuth } from "../../context/authContext";
import { useRouter } from "expo-router";
import { MaterialIcons, Ionicons, Feather } from "@expo/vector-icons";

const parentingTips = [
  {
    id: 1,
    tip: "Listen actively to your child - it builds trust and communication",
    icon: "hearing",
  },
  {
    id: 2,
    tip: "Create and maintain consistent daily routines",
    icon: "schedule",
  },
  {
    id: 3,
    tip: "Praise effort over results to build a growth mindset",
    icon: "psychology",
  },
  {
    id: 4,
    tip: "Make time for one-on-one interaction with each child daily",
    icon: "people",
  },
  {
    id: 5,
    tip: "Set clear, age-appropriate expectations and boundaries",
    icon: "dashboard",
  },
];

const dailyThoughts = [
  "Every child is a different kind of flower and all together make this world a beautiful garden.",
  "Your child's success is not just about grades, but about growing into a kind, confident person.",
  "The way we talk to our children becomes their inner voice.",
  "Behind every child who believes in themselves is a parent who believed first.",
  "Every day is a new opportunity to make a positive impact on your child's life.",
  "A child's life is like a piece of paper on which every person leaves a mark.",
];

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [todaysThought, setTodaysThought] = useState("");

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * dailyThoughts.length);
    setTodaysThought(dailyThoughts[randomIndex]);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.log("Logout error:", error);
    }
  };

  return (
    <ScrollView className="flex-1 bg-gray-50">
      {/* Profile Header */}
      <View className="bg-blue-500 pt-5 pb-8 rounded-b-3xl shadow-lg">
        {/* Top Bar with Logout */}
        <View className="flex-row justify-end px-4 mb-4">
          <TouchableOpacity
            onPress={handleLogout}
            className="flex-row items-center bg-red-500 px-4 py-2 rounded-full"
          >
            <Feather name="log-out" size={18} color="white" />
            <Text className="text-white ml-2 font-medium">Logout</Text>
          </TouchableOpacity>
        </View>

        {/* Profile Info */}
        <View className="items-center flex-row justify-center gap-10">
          <View className="bg-white p-1 rounded-full shadow-lg">
            <Image
              source={require("../../../assets/images/profile.jpg")}
              className="w-24 h-24 rounded-full"
            />
          </View>
          <View>
            <Text className="text-2xl font-bold text-white mt-4">
              {user?.name || "User Profile"}
            </Text>
            <Text className="text-gray-100">{user?.email}</Text>
            <Text className="text-gray-100 mt-1">{user?.phone}</Text>
          </View>
        </View>
      </View>

      {/* Thought of the Day Card */}
      <View className="mx-4 mt-6 bg-white rounded-xl p-4 shadow">
        <View className="flex-row items-center mb-2">
          <Ionicons name="bulb" size={24} color="#F59E0B" />
          <Text className="text-lg font-bold ml-2 text-gray-800">
            Thought of the Day
          </Text>
        </View>
        <Text className="text-gray-600 italic">"{todaysThought}"</Text>
      </View>

      {/* Parenting Tips Section */}
      <View className="mx-4 mt-6 mb-8">
        <Text className="text-lg font-bold mb-4 text-gray-800">
          Parenting Tips
        </Text>
        {parentingTips.map((tip) => (
          <View
            key={tip.id}
            className="bg-white p-4 rounded-xl mb-3 shadow flex-row items-center"
          >
            <MaterialIcons name={tip.icon} size={24} color="#3B82F6" />
            <Text className="text-gray-700 ml-3 flex-1">{tip.tip}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}
