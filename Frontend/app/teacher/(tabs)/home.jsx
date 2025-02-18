import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  Switch,
} from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "../../context/authContext";
import axios from "axios";
import CustomModal from "../CustomModal";

const API_URL = process.env.EXPO_PUBLIC_MY_API_URL;

export default function HomeScreen() {
  const router = useRouter();
  const { user, token } = useAuth();
  const [classrooms, setClassrooms] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [newClassroom, setNewClassroom] = useState({
    grade: "",
    section: "",
    subject: "",
    classTeacher: false,
  });

  useEffect(() => {
    fetchClassrooms();
  }, []);

  const fetchClassrooms = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/classroom/all`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Classrooms:", response.data.classrooms);
      setClassrooms(response.data.classrooms);
    } catch (error) {
      console.error("Error fetching classrooms:", error);
      if (error.response?.status === 401) {
        Alert.alert("Authentication Error", "Please login again");
      } else {
        Alert.alert("Error", "Failed to fetch classrooms");
      }
    }
  };

  const addClassroom = async () => {
    if (newClassroom.grade && newClassroom.section && newClassroom.subject) {
      setLoading(true);
      try {
        const response = await axios.post(
          `${API_URL}/api/classroom/create`,
          newClassroom,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setClassrooms([...classrooms, response.data.classroom]);
        setNewClassroom({
          grade: "",
          section: "",
          subject: "",
          classTeacher: false,
        });
        setModalVisible(false);
        Alert.alert("Success", "Classroom created successfully");
      } catch (error) {
        console.log("Error creating classroom:", error.response?.data?.message);
        console.error("Error creating classroom:", error);
        if (error.response?.status === 401) {
          Alert.alert("Authentication Error", "Please login again");
        } else {
          Alert.alert("Error", error.response?.data?.message);
        }
      } finally {
        setLoading(false);
      }
    } else {
      Alert.alert("Error", "Please fill all fields");
    }
  };

  return (
    <ScrollView
      className="flex-1 bg-white"
      contentContainerStyle={{
        flexGrow: 1,
        paddingHorizontal: 15,
        paddingTop: 50,
      }}
    >
      <View>
        <Text className="text-3xl font-bold text-blue-600 mb-5">
          Teacher Dashboard
        </Text>

        {/* Add Classroom Button */}
        <TouchableOpacity
          className="bg-green-500 p-4 rounded-lg mb-4"
          onPress={() => setModalVisible(true)}
        >
          <Text className="text-white text-center text-lg font-semibold">
            + Add New Classroom
          </Text>
        </TouchableOpacity>

        {/* Classroom List */}
        {classrooms.map((classroom) => (
          <TouchableOpacity
            key={classroom._id}
            className="bg-blue-500 p-4 rounded-lg mb-4"
            onPress={() =>
              router.push({
                pathname: "../(classroom)",
                params: { id: classroom._id },
              })
            }
          >
            <Text className="text-white text-lg font-semibold mb-1">
              Grade {classroom.grade} - Section {classroom.section}
            </Text>
            <Text className="text-white">Subject: {classroom.subject}</Text>
          </TouchableOpacity>
        ))}

        <CustomModal
          visible={modalVisible}
          onClose={() => {
            setModalVisible(false);
            setNewClassroom({
              grade: "",
              section: "",
              subject: "",
              classTeacher: false,
            });
          }}
          onSubmit={addClassroom}
          title="Add New Classroom"
          submitText="Add Classroom"
          isLoading={loading}
        >
          <View className="space-y-2">
            <View className="mb-2">
              <Text className=" font-medium text-gray-700 mb-1.5">Grade</Text>
              <TextInput
                className="border border-gray-300 p-3 rounded-lg bg-white"
                placeholder="Enter grade"
                value={newClassroom.grade}
                onChangeText={(text) =>
                  setNewClassroom({ ...newClassroom, grade: text })
                }
              />
            </View>

            <View className="mb-2">
              <Text className="font-medium text-gray-700 mb-1.5">Section</Text>
              <TextInput
                className="border border-gray-300 p-3 rounded-lg bg-white"
                placeholder="Enter section"
                value={newClassroom.section}
                onChangeText={(text) =>
                  setNewClassroom({ ...newClassroom, section: text })
                }
              />
            </View>

            <View className="mb-2">
              <Text className=" font-medium text-gray-700 mb-1.5">Subject</Text>
              <TextInput
                className="border border-gray-300 p-3 rounded-lg bg-white"
                placeholder="Enter subject"
                value={newClassroom.subject}
                onChangeText={(text) =>
                  setNewClassroom({ ...newClassroom, subject: text })
                }
              />
            </View>

            <View className="flex-row items-center justify-between ">
              <Text className=" font-medium text-gray-700">Class Teacher</Text>
              <Switch
                value={newClassroom.classTeacher}
                onValueChange={(value) =>
                  setNewClassroom({ ...newClassroom, classTeacher: value })
                }
              />
            </View>
          </View>
        </CustomModal>
      </View>
    </ScrollView>
  );
}
