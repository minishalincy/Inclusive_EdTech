import { View, Text } from "react-native";
import React from "react";

const Remark = () => {
  return (
    <View>
      <Text>remark</Text>
    </View>
  );
};

export default Remark;

// import React, { useState, useEffect } from "react";
// import {
//   View,
//   Text,
//   FlatList,
//   TouchableOpacity,
//   TextInput,
//   Modal,
//   Alert,
//   ActivityIndicator,
// } from "react-native";
// import { Audio } from "expo-av";
// import { MaterialIcons } from "@expo/vector-icons";
// import axios from "axios";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { useRoute } from "@react-navigation/native";

// const API_URL = process.env.EXPO_PUBLIC_MY_API_URL;

// const Remark = () => {
//   const route = useRoute();
//   const params = route.params;
//   const [students, setStudents] = useState([]);
//   const [selectedStudent, setSelectedStudent] = useState(null);
//   const [textMessage, setTextMessage] = useState("");
//   const [modalVisible, setModalVisible] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [recording, setRecording] = useState(null);
//   const [isRecording, setIsRecording] = useState(false);
//   const [remarks, setRemarks] = useState([]);
//   const [token, setToken] = useState(null);
//   const [sound, setSound] = useState(null);

//   useEffect(() => {
//     getToken();
//     return () => {
//       if (sound) {
//         sound.unloadAsync();
//       }
//     };
//   }, []);

//   useEffect(() => {
//     if (token) {
//       fetchStudents();
//     }
//   }, [token]);

//   const getToken = async () => {
//     try {
//       const storedToken = await AsyncStorage.getItem("token");
//       setToken(storedToken);
//     } catch (error) {
//       console.error("Error getting token:", error);
//       Alert.alert("Error", "Failed to get authentication token");
//     }
//   };

//   const fetchStudents = async () => {
//     try {
//       setLoading(true);
//       const response = await axios.get(
//         `${API_URL}/api/classroom/${params.id}`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
//       if (response.data.success) {
//         setStudents(response.data.classroom.students || []);
//       }
//     } catch (error) {
//       console.error("Error fetching students:", error);
//       Alert.alert("Error", "Failed to fetch students");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchRemarks = async (studentId) => {
//     try {
//       const response = await axios.get(
//         `${API_URL}/api/classroom/${params.id}/student/${studentId}/remark`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
//       if (response.data.success && response.data.remark) {
//         setRemarks(response.data.remark.messages || []);
//       }
//     } catch (error) {
//       console.error("Error fetching remarks:", error);
//       Alert.alert("Error", "Failed to fetch remarks");
//     }
//   };

//   async function startRecording() {
//     try {
//       const permission = await Audio.requestPermissionsAsync();
//       if (permission.status !== "granted") {
//         Alert.alert("Permission Denied", "Please allow microphone access");
//         return;
//       }

//       await Audio.setAudioModeAsync({
//         allowsRecordingIOS: true,
//         playsInSilentModeIOS: true,
//       });

//       const { recording } = await Audio.Recording.createAsync(
//         Audio.RecordingOptionsPresets.HIGH_QUALITY
//       );
//       setRecording(recording);
//       setIsRecording(true);
//     } catch (err) {
//       console.error("Error starting recording:", err);
//       Alert.alert("Error", "Failed to start recording");
//     }
//   }

//   async function stopRecording() {
//     try {
//       if (!recording) return;

//       await recording.stopAndUnloadAsync();
//       const uri = recording.getURI();
//       setRecording(null);
//       setIsRecording(false);

//       if (uri) {
//         await uploadVoiceMessage(uri);
//       } else {
//         throw new Error("Failed to get recording URI");
//       }
//     } catch (err) {
//       console.error("Recording error:", err.message);
//       Alert.alert("Error", "Failed to process recording");
//     }
//   }

//   const playVoiceMessage = async (uri) => {
//     try {
//       if (sound) {
//         await sound.unloadAsync();
//       }
//       const { sound: newSound } = await Audio.Sound.createAsync({ uri });
//       setSound(newSound);
//       await newSound.playAsync();
//     } catch (error) {
//       console.error("Error playing voice message:", error);
//       Alert.alert("Error", "Failed to play voice message");
//     }
//   };

//   const uploadVoiceMessage = async (uri) => {
//     try {
//       const formData = new FormData();

//       // Split the URI to get the actual filename
//       const filename = uri.split("/").pop();

//       // Add the audio file
//       formData.append("file", {
//         uri: uri,
//         type: "audio/m4a",
//         name: filename || "voice-message.m4a",
//       });

//       // No need to append content since we'll use the file path on server
//       formData.append("type", "voice");

//       console.log("Sending voice message with data:", {
//         uri,
//         type: "voice",
//         filename,
//       });

//       const response = await fetch(
//         `${API_URL}/api/classroom/${params.id}/student/${selectedStudent._id}/remark`,
//         {
//           method: "POST",
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "multipart/form-data",
//           },
//           body: formData,
//         }
//       );

//       const data = await response.json();

//       if (data.success) {
//         console.log("Voice message uploaded successfully");
//         fetchRemarks(selectedStudent._id);
//       } else {
//         throw new Error(data.message);
//       }
//     } catch (error) {
//       console.error("Upload error:", error);
//       Alert.alert("Error", error.message || "Failed to upload voice message");
//     }
//   };

//   const sendTextMessage = async () => {
//     if (!textMessage.trim()) return;

//     try {
//       const response = await axios.post(
//         `${API_URL}/api/classroom/${params.id}/student/${selectedStudent._id}/remark`,
//         {
//           studentId: selectedStudent._id, // Add this
//           type: "text",
//           content: textMessage.trim(),
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json", // Add this explicitly
//           },
//         }
//       );

//       if (response.data.success) {
//         setTextMessage("");
//         fetchRemarks(selectedStudent._id);
//       }
//     } catch (error) {
//       // Improved error logging
//       console.error(
//         "Error sending message:",
//         error.response?.data || error.message
//       );
//       Alert.alert(
//         "Error",
//         error.response?.data?.message || "Failed to send message"
//       );
//     }
//   };

//   const renderMessage = ({ item }) => (
//     <View
//       className={`px-4 py-2 mb-2 rounded-lg max-w-3/4
//       ${
//         item.sender === "teacher"
//           ? "bg-blue-500 self-end"
//           : "bg-gray-200 self-start"
//       }`}
//     >
//       <Text
//         className={`text-base ${
//           item.sender === "teacher" ? "text-white" : "text-black"
//         }`}
//       >
//         {item.type === "text" ? item.content : "Voice Message"}
//       </Text>
//       {item.type === "voice" && (
//         <TouchableOpacity
//           className="flex-row items-center mt-1"
//           onPress={() => playVoiceMessage(item.content)}
//         >
//           <MaterialIcons
//             name="play-circle-filled"
//             size={24}
//             color={item.sender === "teacher" ? "white" : "black"}
//           />
//           <Text
//             className={`ml-2 ${
//               item.sender === "teacher" ? "text-white" : "text-black"
//             }`}
//           >
//             Play
//           </Text>
//         </TouchableOpacity>
//       )}
//       <Text
//         className={`text-xs mt-1
//         ${
//           item.sender === "teacher" ? "text-white opacity-70" : "text-gray-500"
//         }`}
//       >
//         {new Date(item.createdAt).toLocaleTimeString()}
//       </Text>
//     </View>
//   );

//   const renderStudent = ({ item }) => (
//     <TouchableOpacity
//       className="bg-white p-4 mb-3 rounded-lg shadow-sm"
//       onPress={() => {
//         setSelectedStudent(item);
//         fetchRemarks(item._id);
//         setModalVisible(true);
//       }}
//     >
//       <View className="flex-row justify-between items-center">
//         <View>
//           <Text className="text-lg font-semibold text-gray-800">
//             {item.name}
//           </Text>
//           <Text className="text-sm text-gray-500 mt-1">
//             Admission No: {item.admissionNumber}
//           </Text>
//         </View>
//         <MaterialIcons name="chevron-right" size={24} color="#666" />
//       </View>
//     </TouchableOpacity>
//   );

//   if (loading) {
//     return (
//       <View className="flex-1 justify-center items-center">
//         <ActivityIndicator size="large" color="#0066cc" />
//       </View>
//     );
//   }

//   return (
//     <View className="flex-1 bg-gray-100">
//       <FlatList
//         data={students}
//         renderItem={renderStudent}
//         keyExtractor={(item) => item._id}
//         contentContainerClassName="p-4"
//       />

//       <Modal
//         animationType="slide"
//         transparent={true}
//         visible={modalVisible}
//         onRequestClose={() => setModalVisible(false)}
//       >
//         <View className="flex-1 bg-black bg-opacity-50">
//           <View className="flex-1 bg-white mt-16 rounded-t-3xl">
//             {/* Modal Header */}
//             <View className="flex-row justify-between items-center p-4 border-b border-gray-200">
//               <View>
//                 <Text className="text-xl font-bold text-gray-800">
//                   {selectedStudent?.name}
//                 </Text>
//                 <Text className="text-sm text-gray-500">
//                   {selectedStudent?.admissionNumber}
//                 </Text>
//               </View>
//               <TouchableOpacity
//                 onPress={() => setModalVisible(false)}
//                 className="p-2"
//               >
//                 <MaterialIcons name="close" size={24} color="#000" />
//               </TouchableOpacity>
//             </View>

//             {/* Messages List */}
//             <FlatList
//               data={remarks}
//               renderItem={renderMessage}
//               keyExtractor={(item) => item._id}
//               contentContainerClassName="p-4"
//               inverted
//             />

//             {/* Input Area */}
//             <View className="p-4 border-t border-gray-200 bg-white">
//               <View className="flex-row items-center">
//                 <TextInput
//                   className="flex-1 bg-gray-100 rounded-full px-4 py-2 mr-2"
//                   value={textMessage}
//                   onChangeText={setTextMessage}
//                   placeholder="Type a message..."
//                   multiline
//                 />

//                 <TouchableOpacity
//                   onPress={isRecording ? stopRecording : startRecording}
//                   className={`p-3 rounded-full mr-2
//                     ${isRecording ? "bg-red-500" : "bg-blue-500"}`}
//                 >
//                   <MaterialIcons
//                     name={isRecording ? "stop" : "mic"}
//                     size={24}
//                     color="white"
//                   />
//                 </TouchableOpacity>

//                 {textMessage.trim() && (
//                   <TouchableOpacity
//                     onPress={sendTextMessage}
//                     className="p-3 rounded-full bg-blue-500"
//                   >
//                     <MaterialIcons name="send" size={24} color="white" />
//                   </TouchableOpacity>
//                 )}
//               </View>
//             </View>
//           </View>
//         </View>
//       </Modal>
//     </View>
//   );
// };

// export default Remark;
