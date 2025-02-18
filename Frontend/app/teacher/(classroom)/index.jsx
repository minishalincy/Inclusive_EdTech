import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useAuth } from "../../context/authContext";
import axios from "axios";
import {
  MaterialIcons,
  FontAwesome5,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";

const API_URL = process.env.EXPO_PUBLIC_MY_API_URL;

const ClassroomDetail = () => {
  const params = useLocalSearchParams();
  const router = useRouter();
  const { token } = useAuth();
  const [classroom, setClassroom] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!params.id) {
      Alert.alert("Error", "No classroom ID provided");
      router.back();
      return;
    }
    fetchClassroomDetails();
  }, [params.id]);

  const fetchClassroomDetails = async () => {
    try {
      console.log("Fetching classroom with ID:", params.id);
      const response = await axios.get(
        `${API_URL}/api/classroom/${params.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setClassroom(response.data.classroom);
      } else {
        Alert.alert(
          "Error",
          response.data.message || "Failed to fetch classroom details"
        );
      }
    } catch (error) {
      console.error("Error fetching classroom details:", error);
      const errorMessage =
        error.response?.data?.message || "Failed to fetch classroom details";
      Alert.alert("Error", errorMessage);
      if (error.response?.status === 404) {
        router.back();
      }
    } finally {
      setLoading(false);
    }
  };

  const navigateToFeature = (feature) => {
    router.push({
      pathname: `./${feature}`,
      params: {
        id: params.id,
        subject: classroom.subject,
        grade: classroom.grade,
        section: classroom.section,
      },
    });
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  if (!classroom) {
    return (
      <View className="flex-1 justify-center items-center p-4">
        <Text className="text-xl text-gray-600">Classroom not found</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-gray-50">
      {/* Header Section */}
      <View className="bg-blue-600 p-6">
        <Text className="text-2xl font-bold text-white mb-2">
          Grade {classroom.grade} - Section {classroom.section}
        </Text>
        <Text className="text-lg text-white">Subject: {classroom.subject}</Text>
        <View className="flex-row mt-4 bg-blue-500 rounded-lg p-3">
          <Text className="text-white">Total Students: </Text>
          <Text className="text-white font-bold">
            {classroom.students?.length || 0}
          </Text>
        </View>
      </View>

      {/* Quick Actions Grid */}
      <View className="p-4">
        <Text className="text-xl font-bold text-gray-800 mb-4">
          Classroom Management
        </Text>
        <View className="flex-row flex-wrap justify-between">
          {/* Attendance - Only visible to class teacher */}
          {classroom.classTeacher && (
            <TouchableOpacity
              className="bg-white w-[48%] p-4 rounded-xl mb-4 shadow-sm border border-blue-200"
              onPress={() => navigateToFeature("attendance")}
            >
              <View className="items-center">
                <MaterialIcons
                  name="event-available"
                  size={28}
                  color="#3b82f6"
                />
                <Text className="text-center font-semibold mt-2">
                  Attendance
                </Text>
                <Text className="text-center text-gray-500 text-sm">
                  Daily attendance
                </Text>
              </View>
            </TouchableOpacity>
          )}

          {/* Student List */}
          <TouchableOpacity
            className="bg-white w-[48%] p-4 rounded-xl mb-4 shadow-sm border border-blue-200"
            onPress={() => navigateToFeature("student")}
          >
            <View className="items-center">
              <FontAwesome5 name="users" size={24} color="#3b82f6" />
              <Text className="text-center font-semibold mt-2">Students</Text>
              <Text className="text-center text-gray-500 text-sm">
                Manage students
              </Text>
            </View>
          </TouchableOpacity>

          {/* Assignments */}
          <TouchableOpacity
            className="bg-white w-[48%] p-4 rounded-xl mb-4 shadow-sm border border-blue-200"
            onPress={() => navigateToFeature("assignment")}
          >
            <View className="items-center">
              <Ionicons name="book" size={28} color="#3b82f6" />
              <Text className="text-center font-semibold mt-2">
                Assignments
              </Text>
              <Text className="text-center text-gray-500 text-sm">
                Tasks & homework
              </Text>
            </View>
          </TouchableOpacity>

          {/* Marks */}
          <TouchableOpacity
            className="bg-white w-[48%] p-4 rounded-xl mb-4 shadow-sm border border-blue-200"
            onPress={() => navigateToFeature("marks")}
          >
            <View className="items-center">
              <MaterialCommunityIcons
                name="trophy-award"
                size={28}
                color="#3b82f6"
              />
              <Text className="text-center font-semibold mt-2">Marks</Text>
              <Text className="text-center text-gray-500 text-sm">
                Upload scores
              </Text>
            </View>
          </TouchableOpacity>

          {/* Remarks */}
          <TouchableOpacity
            className="bg-white w-[48%] p-4 rounded-xl mb-4 shadow-sm border border-blue-200"
            onPress={() => navigateToFeature("remark")}
          >
            <View className="items-center">
              <MaterialIcons name="comment" size={28} color="#3b82f6" />
              <Text className="text-center font-semibold mt-2">Remarks</Text>
              <Text className="text-center text-gray-500 text-sm">
                Student feedback
              </Text>
            </View>
          </TouchableOpacity>

          {/* Time Table - Only visible to class teacher */}
          {classroom.classTeacher && (
            <TouchableOpacity
              className="bg-white w-[48%] p-4 rounded-xl mb-4 shadow-sm border border-blue-200"
              onPress={() => navigateToFeature("timetable")}
            >
              <View className="items-center">
                <Ionicons name="time" size={28} color="#3b82f6" />
                <Text className="text-center font-semibold mt-2">
                  Time Table
                </Text>
                <Text className="text-center text-gray-500 text-sm">
                  Class schedule
                </Text>
              </View>
            </TouchableOpacity>
          )}

          {/* Announcements */}
          <TouchableOpacity
            className="bg-white w-full p-4 rounded-xl mb-4 shadow-sm border border-blue-200"
            onPress={() => navigateToFeature("announcement")}
          >
            <View className="items-center">
              <MaterialIcons name="campaign" size={28} color="#3b82f6" />
              <Text className="text-center font-semibold mt-2">
                Announcements
              </Text>
              <Text className="text-center text-gray-500 text-sm">
                Class updates
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};
export default ClassroomDetail;
