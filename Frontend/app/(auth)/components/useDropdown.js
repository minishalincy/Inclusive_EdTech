import { useState, useCallback } from "react";
import { Animated } from "react-native";

export const useDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownAnimation] = useState(new Animated.Value(0));

  const toggleDropdown = useCallback(() => {
    const toValue = isOpen ? 0 : 1;

    Animated.spring(dropdownAnimation, {
      toValue,
      useNativeDriver: false,
      friction: 8,
    }).start();

    setIsOpen(!isOpen);
  }, [isOpen, dropdownAnimation]);

  return {
    isOpen,
    dropdownAnimation,
    toggleDropdown,
  };
};

export default useDropdown;
