import React from "react";
import { View, Image } from "react-native";

const Header = () => (
  <View
    className={`h-[51px] p-[1px] px-1 flex-row justify-between border-b border-gray-300 bg-white`}
  >
    <View>
      <Image
        source={require("../../assets/images/app_logo.jpg")}
        style={{ width: 225, height: 48 }}
      />
    </View>
  </View>
);
export default Header;
