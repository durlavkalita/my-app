import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  Pressable,
  TouchableOpacity,
} from "react-native";
import { useQuery } from "@tanstack/react-query";
import { getFinances } from "@/services/queries";
import FinanceForm from "@/components/forms/FinanceForm";

const FinanceScreen = () => {
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
          <View className="p-4 bg-white rounded-lg mb-2 shadow-md">
            <Text className="font-semibold">{item.description}</Text>
            <Text
              className={
                item.financeType === "income"
                  ? "text-green-500"
                  : "text-red-500"
              }
            >
              ₹{item.amount}
            </Text>
            <Text className="text-gray-400 text-xs">
              {new Date(item.date).toDateString()}
            </Text>
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

      <FinanceForm
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
      />
    </View>
  );
};

export default FinanceScreen;
