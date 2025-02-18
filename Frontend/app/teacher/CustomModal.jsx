import React from "react";
import { Modal, View, Text, TouchableOpacity } from "react-native";

const CrossIcon = () => (
  <View style={{ height: 24, width: 24 }}>
    <View className="absolute w-[2px] h-6 bg-gray-400 transform rotate-45 translate-x-[11px]" />
    <View className="absolute w-[2px] h-6 bg-gray-400 transform -rotate-45 translate-x-[11px]" />
  </View>
);

const CustomModal = ({
  visible,
  onClose,
  onSubmit,
  title,
  children,
  description,
  submitText = "Submit",
  isLoading = false,
}) => {
  return (
    <Modal
      transparent
      visible={visible}
      onRequestClose={onClose}
      animationType="fade"
    >
      <View className="flex-1 justify-center items-center bg-black/50">
        <View className="bg-white w-11/12 rounded-2xl">
          {/* Header with Cross Icon */}
          <View className="px-6 pt-4 pb-2 flex-row justify-between items-start">
            <View className="flex-1 pr-4">
              <Text className="text-xl font-bold text-blue-600">{title}</Text>
              {description && (
                <Text className="text-sm text-gray-500 mt-2">
                  {description}
                </Text>
              )}
            </View>
            <TouchableOpacity onPress={onClose} className="p-2 -mr-2 -mt-2">
              <CrossIcon />
            </TouchableOpacity>
          </View>

          {/* Content */}
          <View className="px-6">{children}</View>

          {/* Footer with centered Submit Button */}
          <View className="px-6 pb-6 pt-4 mt-2">
            <TouchableOpacity
              onPress={onSubmit}
              className="bg-blue-500 py-3 rounded-lg items-center"
              disabled={isLoading}
            >
              <Text className="text-white font-medium text-base">
                {isLoading ? "Loading..." : submitText}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default CustomModal;
