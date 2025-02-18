import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useAuth } from "../../context/authContext";
import axios from "axios";
import { MaterialIcons } from "@expo/vector-icons";

const API_URL = process.env.EXPO_PUBLIC_MY_API_URL;

const getISTDate = (date) => {
  const istDate = new Date(date);
  istDate.setHours(5, 30, 0, 0);
  return istDate;
};

const formatDateForAPI = (date) => {
  const istDate = getISTDate(date);
  return istDate.toISOString().split("T")[0];
};

const Attendance = () => {
  const params = useLocalSearchParams();
  const { token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [students, setStudents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  // state for tracking local attendance before submission
  const [localAttendance, setLocalAttendance] = useState({});
  const [stats, setStats] = useState({ present: 0, absent: 0, notMarked: 0 });

  useEffect(() => {
    fetchStudentsAndAttendance();
  }, []);

  useEffect(() => {
    if (students.length > 0) {
      fetchAttendanceForDate();
    }
  }, [selectedDate]);

  useEffect(() => {
    calculateStats();
  }, [attendanceRecords, localAttendance, students]);

  const fetchStudentsAndAttendance = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/api/classroom/${params.id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        setStudents(response.data.classroom.students || []);
        fetchAttendanceForDate();
      }
    } catch (error) {
      console.error("Error fetching students:", error);
      Alert.alert("Error", "Failed to fetch students");
    }
  };

  const fetchAttendanceForDate = async () => {
    try {
      setLoading(true);
      setLocalAttendance({}); // Reset local attendance when date changes
      const formattedDate = formatDateForAPI(selectedDate);
      const response = await axios.get(
        `${API_URL}/api/classroom/${params.id}/attendance/${formattedDate}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        setAttendanceRecords(response.data.attendance || []);
      }
    } catch (error) {
      console.error("Error fetching attendance:", error);
      Alert.alert("Error", "Failed to fetch attendance");
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = () => {
    if (hasAttendanceForDate()) {
      const presentCount = attendanceRecords.filter(
        (record) => record.status === "present"
      ).length;
      const absentCount = attendanceRecords.filter(
        (record) => record.status === "absent"
      ).length;
      setStats({
        present: presentCount,
        absent: absentCount,
        notMarked: 0,
      });
    } else {
      // Use local attendance for unsaved changes
      const presentCount = Object.values(localAttendance).filter(
        (status) => status === "present"
      ).length;
      const absentCount = Object.values(localAttendance).filter(
        (status) => status === "absent"
      ).length;
      setStats({
        present: presentCount,
        absent: absentCount,
        notMarked: students.length - (presentCount + absentCount),
      });
    }
  };

  const getStudentAttendanceStatus = (studentId) => {
    if (hasAttendanceForDate()) {
      const record = attendanceRecords.find(
        (record) =>
          record.studentId._id === studentId || record.studentId === studentId
      );
      return record ? record.status : null;
    }
    return localAttendance[studentId] || null;
  };

  const hasAttendanceForDate = () => {
    return attendanceRecords.length > 0;
  };

  const markAttendance = (studentId, status) => {
    if (hasAttendanceForDate()) return;

    setLocalAttendance((prev) => ({
      ...prev,
      [studentId]: status,
    }));
  };

  const submitBulkAttendance = async () => {
    const unmarkedStudents = students.filter(
      (student) => !localAttendance[student._id]
    );

    if (unmarkedStudents.length > 0) {
      Alert.alert(
        "Incomplete Attendance",
        "Please mark attendance for all students before submitting."
      );
      return;
    }

    setSubmitting(true);
    try {
      const formattedDate = formatDateForAPI(selectedDate);

      // Create array of attendance records
      const attendanceData = students.map((student) => ({
        studentId: student._id,
        date: formattedDate,
        status: localAttendance[student._id],
      }));

      // Submit all attendance records in one request
      const response = await axios.post(
        `${API_URL}/api/classroom/${params.id}/attendance/bulk`,
        {
          attendance: attendanceData,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        Alert.alert("Success", "Attendance submitted successfully");
        fetchAttendanceForDate(); // Refresh attendance data
      }
    } catch (error) {
      console.error("Error submitting attendance:", error);
      Alert.alert("Error", "Failed to submit attendance");
    } finally {
      setSubmitting(false);
    }
  };

  const changeDate = (days) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + days);
    setSelectedDate(newDate);
  };

  const renderStudentAttendance = (student) => {
    const attendanceStatus = getStudentAttendanceStatus(student._id);
    const isAttendanceTaken = hasAttendanceForDate();

    if (isAttendanceTaken) {
      return attendanceStatus ? (
        <View
          className={`px-4 py-2 rounded-lg ${
            attendanceStatus === "present" ? "bg-green-500" : "bg-red-500"
          }`}
        >
          <Text className="text-white font-semibold">
            {attendanceStatus.charAt(0).toUpperCase() +
              attendanceStatus.slice(1)}
          </Text>
        </View>
      ) : null;
    }

    return (
      <View className="flex-row space-x-2 gap-2">
        <TouchableOpacity
          onPress={() => markAttendance(student._id, "present")}
          className={`p-2 rounded-lg ${
            attendanceStatus === "present" ? "bg-green-500" : "bg-gray-200"
          }`}
        >
          <Text
            className={`${
              attendanceStatus === "present" ? "text-white" : "text-gray-600"
            }`}
          >
            Present
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => markAttendance(student._id, "absent")}
          className={`p-2 rounded-lg ${
            attendanceStatus === "absent" ? "bg-red-500" : "bg-gray-200"
          }`}
        >
          <Text
            className={`${
              attendanceStatus === "absent" ? "text-white" : "text-gray-600"
            }`}
          >
            Absent
          </Text>
        </TouchableOpacity>
      </View>
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
    <ScrollView className="flex-1 bg-gray-50">
      {/* Header with Statistics */}
      <View className="bg-blue-600 p-6">
        <View className="flex-row justify-between items-center">
          <View>
            <Text className="text-2xl font-bold text-white">Attendance</Text>
            <Text className="text-white mt-2">
              Class {params.grade} - {params.section}
            </Text>
          </View>
          <View className="flex-row space-x-4 gap-2">
            <View className="items-center">
              <Text className="text-white font-bold text-lg">
                {stats.present}
              </Text>
              <Text className="text-white text-sm">Present</Text>
            </View>
            <View className="items-center">
              <Text className="text-white font-bold text-lg">
                {stats.absent}
              </Text>
              <Text className="text-white text-sm">Absent</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Date Navigation */}
      <View className="flex-row justify-between items-center p-2 border-b border-gray-300 bg-white">
        <TouchableOpacity onPress={() => changeDate(-1)} className="p-2">
          <MaterialIcons name="chevron-left" size={24} color="#3b82f6" />
        </TouchableOpacity>

        <Text className="text-lg font-semibold">
          {selectedDate.toLocaleDateString("en-IN", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </Text>

        <TouchableOpacity onPress={() => changeDate(1)} className="p-2">
          <MaterialIcons name="chevron-right" size={24} color="#3b82f6" />
        </TouchableOpacity>
      </View>

      {/* Students List */}
      <View className="p-2">
        {students.length > 0 ? (
          students.map((student, index) => (
            <View
              key={student._id}
              className="bg-white p-2 rounded-lg mb-3 shadow-sm flex-row justify-between items-center border-b border-gray-200"
            >
              <View className="p-1 self-start">
                <Text className="text-black">{index + 1}.</Text>
              </View>

              <View className="flex-1">
                <Text className="text-lg font-semibold text-gray-800">
                  {student.name}
                </Text>
                <Text className="text-gray-600">
                  Admission No: {student.admissionNumber}
                </Text>
              </View>

              {renderStudentAttendance(student)}
            </View>
          ))
        ) : (
          <View className="bg-white p-4 rounded-lg">
            <Text className="text-gray-500 text-center">No students found</Text>
          </View>
        )}
      </View>

      {/* Submit Button */}
      {students.length > 0 && !hasAttendanceForDate() && (
        <View className="p-4 bg-white">
          {stats.notMarked > 0 && (
            <Text className="text-orange-500 text-center mb-2">
              {stats.notMarked} student{stats.notMarked > 1 ? "s" : ""} not
              marked
            </Text>
          )}
          <TouchableOpacity
            onPress={submitBulkAttendance}
            disabled={submitting}
            className={`bg-blue-600 p-4 rounded-lg ${
              submitting ? "opacity-50" : ""
            }`}
          >
            <Text className="text-white text-center font-semibold text-lg">
              {submitting ? "Submitting..." : "Submit Attendance"}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
};

export default Attendance;
