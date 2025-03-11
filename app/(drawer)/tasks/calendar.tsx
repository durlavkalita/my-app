import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import dayjs from "dayjs";

const sampleTasks = {
  "2025-02-24": [{ id: "1", title: "Complete UI Wireframe", priority: "high" }],
  "2025-02-25": [
    { id: "2", title: "Implement Task List Screen", priority: "medium" },
    { id: "3", title: "Review PR for Task Manager", priority: "low" },
  ],
};

const getPriorityColor = (priority: any) => {
  switch (priority) {
    case "high":
      return "red";
    case "medium":
      return "orange";
    case "low":
      return "green";
    default:
      return "gray";
  }
};

const getPastWeekDates = () => {
  return Array.from({ length: 7 }, (_, i) => {
    return dayjs()
      .subtract(6 - i, "day")
      .format("YYYY-MM-DD");
  });
};

const CalendarScreen = () => {
  const dates = getPastWeekDates();
  const [selectedDate, setSelectedDate] = useState(
    dayjs().format("YYYY-MM-DD")
  );

  return (
    <View className="flex-1 p-4 bg-white dark:bg-gray-900">
      {/* Horizontal Date Selector */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="flex-row mb-4"
      >
        {dates.map((date) => (
          <TouchableOpacity
            key={date}
            className={`px-4 py-2 mx-1 rounded-lg ${
              selectedDate === date ? "bg-blue-600" : "bg-gray-200"
            }`}
            onPress={() => setSelectedDate(date)}
          >
            <Text
              className={`${
                selectedDate === date ? "text-white" : "text-black"
              }`}
            >
              {dayjs(date).format("DD MMM")}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Text className="text-lg font-semibold mt-4">
        Tasks for {dayjs(selectedDate).format("DD MMM YYYY")}
      </Text>
      <FlatList
        data={sampleTasks[selectedDate] || []}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg mb-2">
            <Text
              className="font-semibold"
              style={{ color: getPriorityColor(item.priority) }}
            >
              {item.title}
            </Text>
          </View>
        )}
      />
    </View>
  );
};

export default CalendarScreen;
