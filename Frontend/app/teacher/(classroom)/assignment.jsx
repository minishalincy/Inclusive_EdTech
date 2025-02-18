import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useAuth } from "../../context/authContext";
import { MaterialIcons } from "@expo/vector-icons";
import axios from "axios";
import CustomModal from "../CustomModal";

const API_URL = process.env.EXPO_PUBLIC_MY_API_URL;

const getIndianDate = () => {
  const today = new Date();
  const istTime = new Date(today.getTime() + 5.5 * 60 * 60 * 1000);
  return istTime.toISOString().split("T")[0];
};

const Assignments = () => {
  const params = useLocalSearchParams();
  const { token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [assignments, setAssignments] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newAssignment, setNewAssignment] = useState({
    title: "",
    description: "",
    dueDate: getIndianDate(),
  });

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/api/classroom/${params.id}/assignments`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.success) {
        // Sort assignments by assignedDate in descending order
        const sortedAssignments = response.data.assignments.sort(
          (a, b) => new Date(b.assignedDate) - new Date(a.assignedDate)
        );
        setAssignments(sortedAssignments);
      }
    } catch (error) {
      console.error("Error fetching assignments:", error);
      Alert.alert("Error", "Failed to fetch assignments");
    } finally {
      setLoading(false);
    }
  };

  const handleAddAssignment = async () => {
    if (
      !newAssignment.title ||
      !newAssignment.description ||
      !newAssignment.dueDate
    ) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await axios.post(
        `${API_URL}/api/classroom/${params.id}/assignment`,
        newAssignment,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        const newAssignments = response.data.classroom.assignments || [];
        // Sort assignments by assignedDate in descending order
        const sortedAssignments = newAssignments.sort(
          (a, b) => new Date(b.assignedDate) - new Date(a.assignedDate)
        );
        setAssignments(sortedAssignments);
        setModalVisible(false);
        setNewAssignment({
          title: "",
          description: "",
          dueDate: getIndianDate(),
        });
        Alert.alert("Success", "Assignment added successfully");
      }
    } catch (error) {
      console.error("Error adding assignment:", error);
      Alert.alert(
        "Error",
        error.response?.data?.message || "Failed to add assignment"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteAssignment = async (assignmentId) => {
    Alert.alert(
      "Delete Assignment",
      "Are you sure you want to delete this assignment?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const response = await axios.delete(
                `${API_URL}/api/classroom/${params.id}/assignment/${assignmentId}`,
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              );

              if (response.data.success) {
                setAssignments(
                  assignments.filter(
                    (assignment) => assignment._id !== assignmentId
                  )
                );
                Alert.alert("Success", "Assignment deleted successfully");
              }
            } catch (error) {
              console.error("Error deleting assignment:", error);
              Alert.alert("Error", "Failed to delete assignment");
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      <ScrollView className="mb-16">
        {/* Header */}
        <View className="bg-blue-600 p-6">
          <Text className="text-2xl font-bold text-white">Assignments</Text>
          <Text className="text-white mt-2">
            {params.subject} - Class {params.grade} {params.section}
          </Text>
        </View>

        {/* Assignments List */}
        <View className="p-4">
          {assignments.length > 0 ? (
            assignments.map((assignment) => (
              <View
                key={assignment._id}
                className="bg-white p-4 rounded-lg mb-3 shadow-sm  border-b border-gray-300"
              >
                <View className="flex-row justify-between items-start">
                  <View className="flex-1">
                    <Text className="text-lg font-semibold text-gray-800">
                      {assignment.title}
                    </Text>
                    <Text className="text-gray-600 mt-1">
                      {assignment.description}
                    </Text>
                    <Text className="text-gray-500 mt-2">
                      Due: {new Date(assignment.dueDate).toLocaleDateString()}
                    </Text>
                    <Text className="text-gray-500">
                      Assigned:{" "}
                      {new Date(assignment.assignedDate).toLocaleDateString()}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => handleDeleteAssignment(assignment._id)}
                    className="p-2"
                  >
                    <MaterialIcons name="delete" size={24} color="#ef4444" />
                  </TouchableOpacity>
                </View>
              </View>
            ))
          ) : (
            <View className="bg-white p-4 rounded-lg">
              <Text className="text-gray-500 text-center">
                No assignments yet
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Add Assignment Button */}
      <View className="absolute bottom-0 left-0 right-0 p-4 bg-gray-50">
        <TouchableOpacity
          className="bg-green-500 p-4 rounded-lg"
          onPress={() => setModalVisible(true)}
        >
          <Text className="text-white text-center font-semibold">
            Add Assignment
          </Text>
        </TouchableOpacity>
      </View>

      {/* Custom Modal for Adding Assignment */}
      <CustomModal
        visible={modalVisible}
        onClose={() => {
          setModalVisible(false);
          setNewAssignment({
            title: "",
            description: "",
            dueDate: getIndianDate(),
          });
        }}
        onSubmit={handleAddAssignment}
        title="Add New Assignment"
        submitText="Add Assignment"
        isLoading={isSubmitting}
      >
        <View className="mb-4">
          <Text className="text-gray-700 text-sm font-medium mb-1">Title</Text>
          <TextInput
            className="border border-gray-300 p-2 rounded-lg"
            placeholder="Enter assignment title"
            value={newAssignment.title}
            onChangeText={(text) =>
              setNewAssignment({ ...newAssignment, title: text })
            }
          />
        </View>

        <View className="mb-4">
          <Text className="text-gray-700 text-sm font-medium mb-1">
            Description
          </Text>
          <TextInput
            className="border border-gray-300 p-2 rounded-lg"
            placeholder="Enter assignment description"
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            value={newAssignment.description}
            onChangeText={(text) =>
              setNewAssignment({ ...newAssignment, description: text })
            }
          />
        </View>

        <View className="mb-1">
          <Text className="text-gray-700 text-sm font-medium mb-1">
            Due Date
          </Text>
          <TextInput
            className="border border-gray-300 p-2 rounded-lg"
            placeholder="YYYY-MM-DD"
            value={newAssignment.dueDate}
            onChangeText={(text) =>
              setNewAssignment({ ...newAssignment, dueDate: text })
            }
          />
        </View>
      </CustomModal>
    </View>
  );
};

export default Assignments;
