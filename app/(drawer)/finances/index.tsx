import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  Pressable,
  TouchableOpacity,
  Modal,
} from "react-native";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteFinance, getFinances } from "@/services/queries";
import FinanceForm from "@/components/forms/FinanceForm";
import FontAwesome from "@expo/vector-icons/FontAwesome";

const FinanceScreen = () => {
  const queryClient = useQueryClient();
  const [selectedFinance, setSelectedFinance] = useState<Finance | null>(null);
  const {
    data: finances,
    isLoading,
    error,
  } = useQuery({ queryKey: ["finances"], queryFn: getFinances });
  const [filter, setFilter] = useState<"all" | "income" | "expense">("all");
  const [modalVisible, setModalVisible] = useState(false);

  // Calculate total income & expense
  const totalIncome =
    finances
      ?.filter((item) => item.financeType === "income")
      .reduce((sum, item) => sum + Number(item.amount), 0) || 0;

  const totalExpense =
    finances
      ?.filter((item) => item.financeType === "expense")
      .reduce((sum, item) => sum + Number(item.amount), 0) || 0;

  // Filtered list based on selection
  const filteredFinances =
    finances?.filter((item) =>
      filter === "all" ? true : item.financeType === filter
    ) || [];

  const mutation = useMutation({
    mutationFn: async (financeId: string) => deleteFinance(financeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["finances"] }); // Refetch tasks after update
      setSelectedFinance(null); // Close modal
    },
  });

  if (isLoading) return <Text>Loading finances...</Text>;
  if (error) return <Text>Error loading finances</Text>;

  return (
    <View className="flex-1 p-4 bg-gray-100">
      {/* Summary Section */}
      <View className="flex-row justify-between p-4 bg-white rounded-lg shadow-md mb-4">
        <View>
          <Text className="text-gray-500">Total Income</Text>
          <Text className="text-green-500 font-bold text-lg">
            ₹{totalIncome}
          </Text>
        </View>
        <View>
          <Text className="text-gray-500">Total Expense</Text>
          <Text className="text-red-500 font-bold text-lg">
            ₹{totalExpense}
          </Text>
        </View>
      </View>

      {/* Filter Buttons */}
      <View className="flex-row justify-center mb-4">
        {["all", "income", "expense"].map((type) => (
          <Pressable
            key={type}
            onPress={() => setFilter(type as "all" | "income" | "expense")}
            className={`px-4 py-2 mx-2 rounded-full ${
              filter === type ? "bg-blue-500" : "bg-gray-300"
            }`}
          >
            <Text className={filter === type ? "text-white" : "text-black"}>
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* Finance Transactions List */}
      <FlatList
        data={filteredFinances}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View className="p-4 bg-white rounded-lg mb-2 shadow-md flex-row items-center justify-between">
            <View className="">
              <Text
                className={
                  item.financeType === "income"
                    ? "text-green-500"
                    : "text-red-500"
                }
              >
                ₹{item.amount}
              </Text>
              <Text className="font-light text-base">{item.description}</Text>
              <Text className="text-gray-400 text-xs">
                {new Date(item.date).toDateString()}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => setSelectedFinance(item)}
              className="ml-6"
            >
              <FontAwesome name="trash" size={26} color="red" />
            </TouchableOpacity>
          </View>
        )}
      />

      {/* Floating Action Button */}
      <TouchableOpacity
        className="absolute bottom-6 right-6 bg-blue-600 w-14 h-14 flex items-center justify-center rounded-full shadow-lg"
        onPress={() => setModalVisible(true)}
      >
        <Text className="text-white text-2xl">+</Text>
      </TouchableOpacity>

      {/* Confirmation Modal */}
      {selectedFinance && (
        <Modal transparent visible={true} animationType="slide">
          <View className="flex-1 justify-center items-center bg-black/50">
            <View className="bg-white p-6 rounded-lg w-80">
              <Text className="text-lg font-semibold mb-4">
                Delete this data?
              </Text>
              <Text className="text-gray-600 mb-4">
                {selectedFinance.amount} {selectedFinance.description}
              </Text>

              <View className="flex-row justify-between">
                <TouchableOpacity onPress={() => setSelectedFinance(null)}>
                  <Text className="text-red-500">Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => mutation.mutate(selectedFinance.id)}
                >
                  <Text className="text-green-500">Confirm</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}

      <FinanceForm
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
      />
    </View>
  );
};

export default FinanceScreen;
