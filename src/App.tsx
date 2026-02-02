import { Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PWAProvider } from "./components/PWAProvider";

// Pages
import HomePage from "./pages/Home";
import DayDetailPage from "./pages/DayDetail";
import CalendarPage from "./pages/Calendar";
import WorkoutPage from "./pages/Workout";
import MealsPage from "./pages/Meals";
import AnalyticsPage from "./pages/Analytics";
import ProfilePage from "./pages/Profile";
import OfflinePage from "./pages/Offline";
import NotFoundPage from "./pages/NotFound";
import PrayersPage from "./pages/PrayersPage";
import { NotificationManager } from "./components/NotificationManager";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <PWAProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/day/:dateString" element={<DayDetailPage />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/prayers" element={<PrayersPage />} />
          <Route path="/workout" element={<WorkoutPage />} />
          <Route path="/meals" element={<MealsPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/offline" element={<OfflinePage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
        <NotificationManager />
      </PWAProvider>
    </QueryClientProvider>
  );
}

export default App;
