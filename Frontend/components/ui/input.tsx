import * as React from "react";
import { TextInput, type TextInputProps } from "react-native";
import { cn } from "~/lib/utils"; // Assuming `cn` is a utility function for conditional class names

const Input = React.forwardRef<
  React.ElementRef<typeof TextInput>,
  TextInputProps
>(({ className, placeholderClassName, ...props }, ref) => {
  // State to track whether the input is focused
  const [isFocused, setIsFocused] = React.useState(false);

  return (
    <TextInput
      ref={ref}
      onFocus={() => setIsFocused(true)} // Set to true when input is focused
      onBlur={() => setIsFocused(false)} // Set to false when input loses focus
      className={cn(
        "web:flex h-10 native:h-12 web:w-full rounded-md border bg-white px-3 web:py-2 text-base lg:text-sm native:text-lg native:leading-[1.25]  placeholder:text-gray-500 web:ring-offset-white file:border-0 file:bg-transparent file:font-medium web:focus-visible:outline-none",
        isFocused ? "border-blue-500 border-2" : "border-gray-300", // Apply red border when focused, gray when not
        props.editable === false && "opacity-50 web:cursor-not-allowed",
        className
      )}
      placeholderClassName={cn("text-gray-500", placeholderClassName)}
      {...props}
    />
  );
});

Input.displayName = "Input";

export { Input };
