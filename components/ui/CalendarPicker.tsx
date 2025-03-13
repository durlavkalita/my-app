import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";

const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const CalendarPicker = ({
  onSelectDate,
}: {
  onSelectDate: (date: string) => void;
}) => {
  const [currentDate, setCurrentDate] = useState(new Date()); // Current month
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month + 1, 0).getDate(); // Last day of month
  };

  const getFirstDayOfMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month, 1).getDay(); // Get weekday of 1st day
  };

  const handleDatePress = (day: number) => {
    const newSelectedDate = new Date(
      Date.UTC(currentDate.getFullYear(), currentDate.getMonth(), day)
    );
    setSelectedDate(newSelectedDate);
    onSelectDate(newSelectedDate.toISOString().split("T")[0]); // Pass formatted date
  };

  const changeMonth = (offset: number) => {
    const newDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + offset,
      1
    );
    setCurrentDate(newDate);
  };

  const totalDays = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);
  const daysArray = [
    ...Array(firstDay).fill(null),
    ...Array(totalDays)
      .fill(0)
      .map((_, i) => i + 1),
  ];

  return (
    <View className="p-4 bg-white rounded-lg shadow">
      {/* Month Navigation */}
      <View className="flex flex-row justify-between items-center mb-2">
        <TouchableOpacity onPress={() => changeMonth(-1)}>
          <Text className="text-lg font-bold">{"←"}</Text>
        </TouchableOpacity>
        <Text className="text-lg font-bold">
          {currentDate.toLocaleString("default", {
            month: "long",
            year: "numeric",
          })}
        </Text>
        <TouchableOpacity onPress={() => changeMonth(1)}>
          <Text className="text-lg font-bold">{"→"}</Text>
        </TouchableOpacity>
      </View>

      {/* Days of the week */}
      <View className="flex flex-row justify-around mb-2">
        {daysOfWeek.map((day) => (
          <Text key={day} className="text-xs font-semibold">
            {day}
          </Text>
        ))}
      </View>

      {/* Dates Grid */}
      <View className="flex flex-wrap flex-row">
        {daysArray.map((day, index) =>
          day === null ? (
            <View key={index} className="w-[14%] h-10" />
          ) : (
            <TouchableOpacity
              key={index}
              onPress={() => handleDatePress(day)}
              className={`w-[14%] h-10 flex items-center justify-center rounded-md ${
                selectedDate?.getDate() === day &&
                selectedDate?.getMonth() === currentDate.getMonth() &&
                selectedDate?.getFullYear() === currentDate.getFullYear()
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200"
              }`}
            >
              <Text>{day}</Text>
            </TouchableOpacity>
          )
        )}
      </View>
    </View>
  );
};

export default CalendarPicker;
