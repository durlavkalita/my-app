import { deleteTask, getTasks, updateTaskCompletion } from "@/services/queries";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
} from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { TaskForm } from "@/components/forms/TaskForm";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import CircularProgress from "@/components/ui/CircularProgress";

export default function TasksScreen() {
  const queryClient = useQueryClient();
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [selectedFunction, setSelectedFunction] = useState("update");
  const [modalVisible, setModalVisible] = useState(false);
  const [filter, setFilter] = useState<"all" | "low" | "medium" | "high">(
    "all"
  );
  const {
    data: tasks,
    isLoading,
    error,
  } = useQuery({ queryKey: ["tasks"], queryFn: getTasks });

  const totalTasks = tasks ? tasks.length : 0;
  const completedTasks = tasks
    ? tasks.filter((task) => task.completed).length
    : 0;
  const progress =
    totalTasks && totalTasks > 0 ? completedTasks / totalTasks : 0;

  const filteredTasks =
    tasks?.filter((item) =>
      filter == "all" ? true : item.priority == filter
    ) || [];
  const sortedTasks = filteredTasks
    ? [...filteredTasks].sort(
        (a, b) => Number(a.completed) - Number(b.completed)
      )
    : [];
  const mutation = useMutation({
    mutationFn: async (taskId: string) => {
      if (selectedFunction == "update") {
        return updateTaskCompletion(taskId, true);
      } else if (selectedFunction === "delete") {
        return deleteTask(taskId);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] }); // Refetch tasks after update
      setSelectedTask(null); // Close modal
    },
  });

  if (isLoading) {
    return (
      <View className="flex items-center justify-center">
        <ActivityIndicator size={"large"} />
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex items-center">
        <Text className="text-lg font-medium">Sorry, No Task Found</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 p-4 bg-white">
      {/* Welcome Message */}
      <Text className="text-2xl font-bold">Hello, Durlav 👋</Text>
      <Text className="text-gray-500">
        Stay focused and crush your goals today! 🚀
      </Text>
      {/* Progress Banner */}
      <View className="flex-row items-center bg-gray-100 p-4 mt-4 rounded-2xl">
        {/* Circular Progress */}
        <CircularProgress progress={progress} />

        {/* Task Completion Info */}
        <View className="ml-4">
          <Text className="text-lg font-semibold">
            {totalTasks - completedTasks} out of {totalTasks} tasks left
          </Text>
          <Text className="text-gray-500">Keep up the good work!</Text>
        </View>
      </View>
      {/* Filter Buttons */}
      <View className="flex-row justify-center my-4">
        {["all", "low", "medium", "high"].map((type) => (
          <TouchableOpacity
            key={type}
            onPress={() => setFilter(type as "all" | "low" | "medium" | "high")}
            className={`px-4 py-2 mx-2 rounded-full ${
              filter === type ? "bg-blue-500" : "bg-gray-300"
            }`}
          >
            <Text className={filter === type ? "text-white" : "text-black"}>
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <View>
        {/* Task List */}
        <FlatList
          data={sortedTasks}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View
              className={`p-4 rounded-lg mb-2 shadow flex-row justify-between items-center ${
                item.priority == "high"
                  ? "bg-red-200"
                  : item.priority == "low"
                  ? "bg-white"
                  : "bg-blue-200"
              }`}
            >
              <View className="flex-row items-center">
                <Text
                  className={`font-semibold ${
                    item.completed ? "text-gray-400 line-through" : "text-black"
                  }`}
                >
                  {item.title}
                </Text>
                <Text className="font-light text-sm text-gray-700 ml-4">
                  {item.dueDate}
                </Text>
              </View>

              <View className="flex-row items-center">
                {item.completed ? (
                  <MaterialCommunityIcons
                    name="sticker-check-outline"
                    size={24}
                    color="green"
                  />
                ) : (
                  <TouchableOpacity
                    onPress={() => {
                      setSelectedTask(item);
                      setSelectedFunction("update");
                    }}
                  >
                    <FontAwesome
                      name="hourglass-half"
                      size={24}
                      color="green"
                    />
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  onPress={() => {
                    setSelectedTask(item);
                    setSelectedFunction("delete");
                  }}
                  className="ml-6"
                >
                  <FontAwesome name="trash" size={26} color="red" />
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      </View>

      {/* Floating Action Button */}
      <TouchableOpacity
        className="absolute bottom-6 right-6 bg-blue-600 w-14 h-14 flex items-center justify-center rounded-full shadow-lg"
        onPress={() => setModalVisible(true)}
      >
        <Text className="text-white text-2xl">+</Text>
      </TouchableOpacity>

      {/* Confirmation Modal */}
      {selectedTask && (
        <Modal transparent visible={true} animationType="slide">
          <View className="flex-1 justify-center items-center bg-black/50">
            <View className="bg-white p-6 rounded-lg w-80">
              <Text className="text-lg font-semibold mb-4">
                {selectedFunction == "update"
                  ? "Mark task as completed?"
                  : "Delete this task?"}
              </Text>
              <Text className="text-gray-600 mb-4">{selectedTask.title}</Text>

              <View className="flex-row justify-between">
                <TouchableOpacity onPress={() => setSelectedTask(null)}>
                  <Text className="text-red-500">Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => mutation.mutate(selectedTask.id)}
                >
                  <Text className="text-green-500">Confirm</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}

      <TaskForm modalVisible={modalVisible} setModalVisible={setModalVisible} />
    </View>
  );
}
