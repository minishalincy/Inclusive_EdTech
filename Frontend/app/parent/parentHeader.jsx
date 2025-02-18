import React from "react";
import { View, Image } from "react-native";
import LanguageSelector from "./languageSelector";

const ParentHeader = () => (
  <View
    className={`h-[51px] p-[1px] px-1 flex-row justify-between border-b border-gray-300 bg-white`}
  >
    <View>
      <Image
        source={require("../../assets/images/app_logo.jpg")}
        style={{ width: 225, height: 45 }}
      />
    </View>
    <LanguageSelector />
  </View>
);
export default ParentHeader;
