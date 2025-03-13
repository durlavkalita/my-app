import { postTask } from "@/services/queries";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Modal } from "react-native";
import CalendarPicker from "../ui/CalendarPicker";

type Props = {
  modalVisible: any;
  setModalVisible: any;
};

enum Priority {
  Low = "low",
  Medium = "medium",
  High = "high",
}

export const TaskForm = ({ modalVisible, setModalVisible }: Props) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState(Priority.Medium);
  const [validationError, setValidationError] = useState<string | null>(null);

  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const onSubmit = () => {
    if (!title.trim()) {
      setValidationError("title");
      return;
    }
    if (!selectedDate) {
      setValidationError("due date");
      return;
    }
    if (!description.trim()) {
      setDescription(title);
    }

    const newTask = {
      title,
      description,
      dueDate: selectedDate || "2025",
      priority,
      completed: false,
    };
    mutation.mutate(newTask);
  };

  const mutation = useMutation({
    mutationFn: (newTask: Omit<Task, "id">) => postTask(newTask),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      setModalVisible(false);
    },
  });
  return (
    <Modal
      transparent
      visible={modalVisible}
      animationType="slide"
      className="p-4 bg-white flex-1"
    >
      <View className="flex-1 justify-center items-center bg-black/50">
        <View className="bg-white p-6 rounded-lg w-90">
          <Text className="text-xl font-semibold text-center mb-4">
            {"Add New Task"}
          </Text>

          <TextInput
            className="border p-2 my-2 rounded-lg bg-gray-100"
            placeholder="Task Title"
            value={title}
            onChangeText={setTitle}
          />

          <TextInput
            className="border p-2 my-2 rounded-lg bg-gray-100"
            placeholder="Task Description"
            value={description}
            onChangeText={setDescription}
            multiline
          />

          <View className="flex-row space-x-2 my-4 items-center">
            {Object.values(Priority).map((level) => (
              <TouchableOpacity
                key={level}
                className={`mx-1 px-3 py-1 rounded-full ${
                  priority === level ? "bg-green-500" : "bg-gray-500"
                }`}
                onPress={() => setPriority(level)}
              >
                <Text className="text-white">
                  {level.charAt(0).toUpperCase() + level.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View className="p-2 my-2">
            <Text className="text-lg font-semibold">
              Due Date: {selectedDate || "None"}
            </Text>
            <CalendarPicker onSelectDate={(date) => setSelectedDate(date)} />
          </View>

          {validationError ? (
            <Text className="text-red-500 font-light text-sm">
              *Missing Information: {validationError}
            </Text>
          ) : (
            ""
          )}

          <View className="flex-row justify-between items-center">
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              className="bg-red-500 mt-4 rounded-lg p-2 w-[45%]"
            >
              <Text className="text-white font-semibold text-lg text-center">
                {"Cancel"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => onSubmit()}
              className="bg-green-500 mt-4 rounded-lg p-2 w-[45%]"
            >
              <Text className="text-white font-semibold text-lg text-center">
                {"Add Task"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};
