import { Drawer } from "expo-router/drawer";

export default function Layout() {
  return (
    <Drawer>
      <Drawer.Screen
        name="tasks"
        options={{ drawerLabel: "Tasks", title: "Task Manager" }}
      />
      <Drawer.Screen
        name="finances"
        options={{ drawerLabel: "Finances", title: "Finance Manager" }}
      />
    </Drawer>
  );
}
