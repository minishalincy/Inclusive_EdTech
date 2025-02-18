import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useAuth } from "../../context/authContext";
import { MaterialIcons } from "@expo/vector-icons";
import axios from "axios";
import CustomModal from "../CustomModal";

const API_URL = process.env.EXPO_PUBLIC_MY_API_URL;

const Student = () => {
  const params = useLocalSearchParams();
  const { token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newStudent, setNewStudent] = useState({
    name: "",
    admissionNumber: "",
  });

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/api/classroom/${params.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.success) {
        setStudents(response.data.classroom.students || []);
      }
    } catch (error) {
      console.error("Error fetching students:", error);
      Alert.alert("Error", "Failed to fetch students");
    } finally {
      setLoading(false);
    }
  };

  const handleAddStudent = async () => {
    if (!newStudent.name || !newStudent.admissionNumber) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await axios.post(
        `${API_URL}/api/classroom/${params.id}/student`,
        newStudent,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        const updatedStudent = response.data.student;
        setStudents([...students, updatedStudent]);
        setModalVisible(false);
        setNewStudent({ name: "", admissionNumber: "" });
        Alert.alert("Success", "Student added successfully");
      }
    } catch (error) {
      console.error("Error adding student:", error);
      Alert.alert(
        "Error",
        error.response?.data?.message || "Failed to add student"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemoveStudent = async (studentId) => {
    Alert.alert(
      "Remove Student",
      "Are you sure you want to remove this student from this classroom?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: async () => {
            try {
              const response = await axios.delete(
                `${API_URL}/api/classroom/${params.id}/student/${studentId}`,
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              );

              if (response.data.success) {
                setStudents(
                  students.filter((student) => student._id !== studentId)
                );
                Alert.alert(
                  "Success",
                  "Student removed from classroom successfully"
                );
              }
            } catch (error) {
              console.error("Error removing student:", error);
              Alert.alert(
                "Error",
                error.response?.data?.message || "Failed to remove student"
              );
            }
          },
        },
      ]
    );
  };

  const filteredStudents = students.filter((student) =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-blue-600 p-6">
        <Text className="text-2xl font-bold text-white">Students</Text>
        <Text className="text-white mt-2">
          Class {params.grade} - {params.section}
        </Text>
      </View>

      {/* Search and Add Section */}
      <View className="p-4 bg-white">
        <View className="flex-row items-center space-x-1 gap-2">
          <View className="flex-1">
            <TextInput
              className="border border-gray-300 p-3 rounded-lg"
              placeholder="Search students..."
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
          <TouchableOpacity
            className="bg-green-500 py-2 px-4 rounded-lg"
            onPress={() => setModalVisible(true)}
          >
            <MaterialIcons name="person-add" size={25} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Students List */}
      <View className="p-2">
        {filteredStudents.length > 0 ? (
          filteredStudents.map((student, index) => (
            <View
              key={student._id}
              className="bg-white px-2 py-1 rounded-lg mb-3 shadow-sm flex-row justify-between items-center border-b border-gray-300"
            >
              <View className="p-1 flex-row items-center">
                <View className="p-1 self-start">
                  <Text className="text-black">{index + 1}.</Text>
                </View>

                <View>
                  <Text className="text-lg font-semibold text-gray-800">
                    {student.name}
                  </Text>
                  <Text className="text-gray-600">
                    Admission No: {student.admissionNumber}
                  </Text>
                </View>
              </View>

              <TouchableOpacity
                onPress={() => handleRemoveStudent(student._id)}
                className="p-2"
              >
                <MaterialIcons name="person-remove" size={24} color="#ef4444" />
              </TouchableOpacity>
            </View>
          ))
        ) : (
          <View className="bg-white p-5 rounded-lg">
            <Text className="text-gray-500 text-center">
              {searchQuery ? "No matching students found" : "No students yet"}
            </Text>
          </View>
        )}
      </View>

      {/* Custom Add Student Modal */}
      <CustomModal
        visible={modalVisible}
        onClose={() => {
          setModalVisible(false);
          setNewStudent({ name: "", admissionNumber: "" });
        }}
        onSubmit={handleAddStudent}
        title="Add New Student"
        description="Enter student details below"
        submitText="Add Student"
        isLoading={isSubmitting}
      >
        <View className="space-y-4">
          <View className="mb-2">
            <Text className="text-md font-medium text-gray-700 mb-1">
              Student Name
            </Text>
            <TextInput
              className="border border-gray-300 p-3 rounded-lg"
              placeholder="Enter student name"
              value={newStudent.name}
              onChangeText={(text) =>
                setNewStudent({ ...newStudent, name: text })
              }
            />
          </View>

          <View>
            <Text className="text-md font-medium text-gray-700 mb-1">
              Admission Number
            </Text>
            <TextInput
              className="border border-gray-300 p-3 rounded-lg"
              placeholder="Enter admission number"
              value={newStudent.admissionNumber}
              onChangeText={(text) =>
                setNewStudent({ ...newStudent, admissionNumber: text })
              }
            />
          </View>
        </View>
      </CustomModal>
    </ScrollView>
  );
};

export default Student;
