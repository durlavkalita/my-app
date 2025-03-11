import { getTasks, updateTaskCompletion } from "@/services/queries";
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

const CircularProgress = ({ progress }: { progress: number }) => {
  const percentage = Math.round(progress * 100);
  return (
    <View className="w-16 h-16 border-4 border-green-500 rounded-full flex items-center justify-center">
      <Text className="text-sm font-bold">{percentage}%</Text>
    </View>
  );
};

export default function TasksScreen() {
  const queryClient = useQueryClient();
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const query = useQuery({ queryKey: ["tasks"], queryFn: getTasks });

  const totalTasks = query.data ? query.data.length : 0;
  const completedTasks = query.data
    ? query.data.filter((task) => task.completed).length
    : 0;
  const progress =
    totalTasks && totalTasks > 0 ? completedTasks / totalTasks : 0;
  const sortedTasks = query.data
    ? [...query.data].sort((a, b) => Number(a.completed) - Number(b.completed))
    : [];

  const mutation = useMutation({
    mutationFn: (taskId: string) => updateTaskCompletion(taskId, true),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] }); // Refetch tasks after update
      setSelectedTask(null); // Close modal
    },
  });

  if (query.isPending) {
    return (
      <View className="flex items-center justify-center">
        <ActivityIndicator size={"large"} />
      </View>
    );
  }

  if (query.isError) {
    return (
      <View className="flex items-center">
        <Text className="text-lg font-medium">Sorry, No Task Found</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 p-4 bg-white">
      {/* Welcome Message */}
      <Text className="text-2xl font-bold">Hello, Durlav! 👋</Text>
      <Text className="text-gray-500">
        Stay focused and crush your goals today! 🚀
      </Text>
      {query.data!.length > 0 ? (
        <View>
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

          {/* Priority Filters */}
          <View className="flex-row space-x-2 my-4">
            {["All", "High", "Medium", "Low"].map((tag) => (
              <TouchableOpacity
                key={tag}
                className="bg-gray-200 px-3 py-1 rounded-full mx-1"
              >
                <Text className="text-gray-700">{tag}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Task List */}

          <FlatList
            data={sortedTasks}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View className="p-4 bg-white rounded-lg mb-2 shadow flex-row justify-between items-center">
                <Text
                  className={`font-semibold ${
                    item.completed ? "text-gray-400 line-through" : "text-black"
                  }`}
                >
                  {item.title}
                </Text>

                {item.completed ? (
                  <FontAwesome name="hourglass" size={24} color="green" />
                ) : (
                  <TouchableOpacity onPress={() => setSelectedTask(item)}>
                    <FontAwesome
                      name="hourglass-half"
                      size={24}
                      color="black"
                    />
                  </TouchableOpacity>
                )}
              </View>
            )}
          />
        </View>
      ) : (
        ""
      )}

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
                Mark task as completed?
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
