import { Outlet } from "react-router-dom";
import NavigationTabs from "../components/NavigationTabs";

export default function MainLayout() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-gray-50">
      <NavigationTabs />
      <main className="p-4 max-w-7xl mx-auto">
        <Outlet />
      </main>
    </div>
  );
}
