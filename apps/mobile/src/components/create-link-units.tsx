import { useEffect, useRef } from "react";
import { Text, TouchableOpacity, View, Animated } from "react-native";

const UNITS = ["Hours", "Days", "Weeks"] as const;
export type Unit = (typeof UNITS)[number];

interface Props {
  value: Unit;
  onValueChange: (unit: Unit) => void;
}

export default function CreateLinkUnits({ value, onValueChange }: Props) {
  const translateX = useRef(new Animated.Value(0)).current
 
  useEffect(() => {
    const index = UNITS.indexOf(value)
  
    Animated.timing(translateX, {
      toValue: index * 100,
      duration: 200,
      useNativeDriver: true,
    }).start()
  }, [value, translateX])

  return (
    <View
      className="flex-row mb-5 bg-zinc-800 p-1.5 rounded-full relative overflow-hidden"
    >
      <Animated.View
        style={{
          position: "absolute",
          left: 6,
          top: 6,
          bottom: 6,
          width: 92,
          borderRadius: 999,
          backgroundColor: "#4f46e5",
          transform: [{ translateX }],
        }}
      />
      
      {UNITS.map((unit) => (
        <TouchableOpacity
          key={unit}
          activeOpacity={0.8}
          onPress={() => onValueChange(unit)}
          className={`flex-1 py-2.5 rounded-full items-center z-10 ${
            value === unit && "bg-indigo-600"
          }`}
        >
          <Text
            className={`text-sm font-medium ${
              value === unit ? "text-white" : "text-zinc-400"
            }`}
          >
            {unit}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}
