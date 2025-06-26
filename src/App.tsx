
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Login from "@/pages/Login";
import Home from "@/pages/Home";
import AddHabit from "@/pages/AddHabit";
import ViewStats from "@/pages/ViewStats";
import Journals from "@/pages/Journals";
import User from "@/pages/User";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Navigate to="/home" replace />} />
            <Route 
              path="/home" 
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/addHabit" 
              element={
                <ProtectedRoute>
                  <AddHabit />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/viewstats" 
              element={
                <ProtectedRoute>
                  <ViewStats />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/journals" 
              element={
                <ProtectedRoute>
                  <Journals />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/user" 
              element={
                <ProtectedRoute>
                  <User />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
