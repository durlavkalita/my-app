import { postTask } from "@/services/queries";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Modal } from "react-native";
import DatePicker from "react-native-date-picker";

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

  const [date, setDate] = useState(new Date());
  const queryClient = useQueryClient();
  const onSubmit = () => {
    if (!title.trim()) return;
    const newTask = {
      title,
      description,
      dueDate: date.toISOString(),
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

          <View className="my-2">
            <Text className="font-semibold px-2 text-gray-500">
              Select Due Date
            </Text>
            <DatePicker date={date} mode="date" onDateChange={setDate} />
          </View>

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
