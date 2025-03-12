import { postFinance } from "@/services/queries";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

type Props = {
  modalVisible: any;
  setModalVisible: any;
};

enum FinanceType {
  Expense = "expense",
  Income = "income",
}

enum FinanceMethod {
  Cash = "cash",
  UPI = "upi",
  Credit = "credit",
  Other = "other",
}

export default function Transaction({ modalVisible, setModalVisible }: Props) {
  const queryClient = useQueryClient();
  const [transactionType, setTransactionType] = useState(FinanceType.Expense);
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [financeMethod, setFinanceMethod] = useState(FinanceMethod.Cash);

  const mutation = useMutation({
    mutationFn: (newFinance: Omit<Finance, "id">) => postFinance(newFinance),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["finances"] });
      setModalVisible(false);
    },
  });

  async function onSubmit() {
    if (amount == "" || amount == "0") {
      Alert.alert("Enter amount >= 1.");
      return;
    }
    if (description == "") {
      Alert.alert("Provide a description.");
      return;
    }
    try {
      const newFinance = {
        amount,
        description,
        date: new Date().toISOString(),
        financeType: transactionType,
        method: financeMethod,
      };
      mutation.mutate(newFinance);
    } catch (error) {
      console.log(error);
      Alert.alert("Error in storing.");
    }
  }

  return (
    <Modal
      transparent
      visible={modalVisible}
      animationType="slide"
      className="p-4 bg-white flex-1"
    >
      <View className="flex-1 justify-center items-center bg-black/50">
        <View className="bg-white p-6 rounded-lg w-80">
          {/* expense or income */}
          <View className="flex flex-row justify-around items-center mb-4">
            <TouchableOpacity
              onPress={() => setTransactionType(FinanceType.Expense)}
            >
              <Text
                className={`px-4 py-2 rounded-md font-semibold text-lg ${
                  transactionType == "expense"
                    ? "bg-green-400 text-white"
                    : "bg-gray-300 text-black"
                }`}
              >
                Expense
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setTransactionType(FinanceType.Income)}
            >
              <Text
                className={`px-4 py-2 rounded-md font-semibold text-lg ${
                  transactionType == "income"
                    ? "bg-green-400 text-white"
                    : "bg-gray-300 text-black"
                }`}
              >
                Income
              </Text>
            </TouchableOpacity>
          </View>
          {/* amount */}
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
          >
            <TextInput
              className="border p-2 my-2 rounded-lg bg-gray-100"
              placeholder="Amount"
              value={amount}
              onChangeText={setAmount}
            />
          </KeyboardAvoidingView>
          {/* categories */}
          <View className="flex-row space-x-2 my-4 items-center">
            {Object.values(FinanceMethod).map((method) => (
              <TouchableOpacity
                key={method}
                className={`mx-1 px-3 py-1 rounded-full ${
                  financeMethod === method ? "bg-green-500" : "bg-gray-500"
                }`}
                onPress={() => setFinanceMethod(method)}
              >
                <Text className="text-white">
                  {method.charAt(0).toUpperCase() + method.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          {/* description */}
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
          >
            <TextInput
              className="border p-2 my-2 rounded-lg bg-gray-100"
              placeholder="Description"
              value={description}
              onChangeText={setDescription}
            />
          </KeyboardAvoidingView>
          {/* save */}
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
                {"Add Data"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
