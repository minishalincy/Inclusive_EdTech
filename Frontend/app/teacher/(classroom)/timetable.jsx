import { View, Text } from "react-native";
import React from "react";

const timetable = () => {
  return (
    <View>
      <Text>timetable</Text>
    </View>
  );
};

export default timetable;
// import React, { useState, useEffect } from "react";
// import {
//   View,
//   Text,
//   Image,
//   TouchableOpacity,
//   ActivityIndicator,
//   Alert,
// } from "react-native";
// import { pickImage } from "../../../utils/imagePicker";
// import { convertToBase64 } from "../../../utils/imageConversion";
// import axios from "axios";

// const Timetable = () => {
//   const [image, setImage] = useState(null);
//   const [uploading, setUploading] = useState(false);

//   const handleImagePick = async () => {
//     try {
//       const imageUri = await pickImage();

//       if (imageUri) {
//         setUploading(true);
//         const base64Image = await convertToBase64(imageUri);

//         const response = await axios.post("/api/timetable/upload", {
//           image: base64Image,
//           className: "Class-A",
//         });

//         if (response.data.success) {
//           setImage(`data:image/jpeg;base64,${response.data.image}`);
//           Alert.alert("Success", "Timetable uploaded successfully!");
//         }
//       }
//     } catch (error) {
//       Alert.alert(
//         "Error",
//         error.response?.data?.message || "Failed to upload timetable"
//       );
//     } finally {
//       setUploading(false);
//     }
//   };

//   useEffect(() => {
//     const fetchTimetable = async () => {
//       try {
//         const response = await axios.get("/api/timetable");
//         if (response.data.image) {
//           setImage(`data:image/jpeg;base64,${response.data.image}`);
//         }
//       } catch (error) {
//         console.error("Failed to fetch timetable:", error);
//       }
//     };

//     fetchTimetable();
//   }, []);

//   return (
//     <View className="flex-1 p-5 bg-white">
//       <Text className="text-2xl font-bold mb-5 text-center">
//         Class Timetable
//       </Text>

//       {uploading ? (
//         <View className="flex-1 justify-center items-center">
//           <ActivityIndicator size="large" color="#0066cc" />
//           <Text className="mt-3 text-base text-gray-600">
//             Uploading timetable...
//           </Text>
//         </View>
//       ) : (
//         <>
//           {image ? (
//             <View className="flex-1 items-center">
//               <Image
//                 source={{ uri: image }}
//                 className="w-full h-4/5 rounded-lg mb-5"
//                 resizeMode="contain"
//               />
//               <TouchableOpacity
//                 className="bg-green-600 py-3 px-4 rounded-lg w-4/5 max-w-[300px]"
//                 onPress={handleImagePick}
//               >
//                 <Text className="text-white text-base font-bold text-center">
//                   Update Timetable
//                 </Text>
//               </TouchableOpacity>
//             </View>
//           ) : (
//             <View className="flex-1 justify-center items-center">
//               <Text className="text-base text-gray-600 mb-5">
//                 No timetable uploaded yet
//               </Text>
//               <TouchableOpacity
//                 className="bg-blue-600 py-4 px-4 rounded-lg w-4/5 max-w-[300px]"
//                 onPress={handleImagePick}
//               >
//                 <Text className="text-white text-base font-bold text-center">
//                   Upload Timetable
//                 </Text>
//               </TouchableOpacity>
//             </View>
//           )}
//         </>
//       )}
//     </View>
//   );
// };

// export default Timetable;
