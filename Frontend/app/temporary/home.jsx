// import React from "react";
// import { View, Text, TouchableOpacity, ScrollView } from "react-native";

// export default function HomeScreen() {
//   return (
//     <ScrollView
//       className="flex-1 bg-white"
//       contentContainerStyle={{
//         flexGrow: 1,
//         paddingHorizontal: 15,
//         paddingTop: 50,
//       }}
//     >
//       <View>
//         <Text className="text-3xl font-bold text-blue-600 mb-5">
//           Welcome Home
//         </Text>

//         <TouchableOpacity className="bg-blue-500 p-4 rounded-lg mb-4">
//           <Text className="text-white text-center text-lg font-semibold">
//             Explore Features
//           </Text>
//         </TouchableOpacity>
//       </View>
//     </ScrollView>
//   );
// }

// import React, { useState } from "react";
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   ScrollView,
//   TextInput,
//   Alert,
// } from "react-native";

// // Replace these values with your actual configuration
// const OPENROUTER_API_KEY =
//   "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";
// const SITE_URL = "your_site_url_here";
// const SITE_NAME = "your_site_name_here";

// export default function HomeScreen() {
//   const [userMessage, setUserMessage] = useState("");
//   const [responseMessage, setResponseMessage] = useState("");
//   const [isLoading, setIsLoading] = useState(false);

//   const getChatCompletion = async () => {
//     if (!userMessage.trim()) {
//       Alert.alert("Error", "Please enter a message");
//       return;
//     }

//     setIsLoading(true);

//     try {
//       const response = await fetch(
//         "https://openrouter.ai/api/v1/chat/completions",
//         {
//           method: "POST",
//           headers: {
//             Authorization: `Bearer ${OPENROUTER_API_KEY}`,
//             "HTTP-Referer": SITE_URL,
//             "X-Title": SITE_NAME,
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             model: "deepseek/deepseek-r1:free",
//             messages: [
//               {
//                 role: "user",
//                 content: userMessage,
//               },
//             ],
//           }),
//         }
//       );

//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }

//       const data = await response.json();
//       setResponseMessage(data.choices[0].message.content);
//     } catch (error) {
//       console.error("Error fetching chat completion:", error);
//       Alert.alert(
//         "Error",
//         "Failed to fetch response from the model. Please try again."
//       );
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <ScrollView
//       className="flex-1 bg-white"
//       contentContainerStyle={{
//         flexGrow: 1,
//         paddingHorizontal: 15,
//         paddingTop: 50,
//       }}
//     >
//       <View>
//         <Text className="text-3xl font-bold text-blue-600 mb-5">
//           Chat with AI
//         </Text>

//         <TextInput
//           className="border border-gray-300 rounded-lg p-4 mb-4"
//           placeholder="Type your message here..."
//           value={userMessage}
//           onChangeText={setUserMessage}
//           multiline
//         />

//         <TouchableOpacity
//           className={`p-4 rounded-lg mb-4 ${
//             isLoading ? "bg-blue-300" : "bg-blue-500"
//           }`}
//           onPress={getChatCompletion}
//           disabled={isLoading}
//         >
//           <Text className="text-white text-center text-lg font-semibold">
//             {isLoading ? "Getting Response..." : "Send Message"}
//           </Text>
//         </TouchableOpacity>

//         {responseMessage ? (
//           <View className="mt-5 p-4 bg-gray-50 rounded-lg">
//             <Text className="text-lg font-bold mb-2">Response:</Text>
//             <Text className="text-gray-700">{responseMessage}</Text>
//           </View>
//         ) : null}
//       </View>
//     </ScrollView>
//   );
// }

import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { useRouter } from "expo-router";

export default function HomeScreen() {
  const router = useRouter();

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
          Welcome Home
        </Text>

        <TouchableOpacity
          className="bg-blue-500 p-4 rounded-lg mb-4"
          onPress={() => router.push("/(tabs)/audio-recorder")}
        >
          <Text className="text-white text-center text-lg font-semibold">
            Record Audio
          </Text>
        </TouchableOpacity>

        <TouchableOpacity className="bg-blue-500 p-4 rounded-lg mb-4">
          <Text className="text-white text-center text-lg font-semibold">
            Explore Features
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
