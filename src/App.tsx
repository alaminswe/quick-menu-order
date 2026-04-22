import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import Checkout from "./pages/Checkout.tsx";
import OrderConfirmation from "./pages/OrderConfirmation.tsx";
import Kitchen from "./pages/Kitchen.tsx";
import Waiter from "./pages/Waiter.tsx";
import StaffLogin from "./pages/StaffLogin.tsx";
import Admin from "./pages/Admin.tsx";
import RoleGuard from "./components/RoleGuard";
import { StoreProvider } from "./store/StoreContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <StoreProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/menu" element={<Index />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/order/:id" element={<OrderConfirmation />} />
            <Route
              path="/kitchen"
              element={
                <RoleGuard role="kitchen">
                  <Kitchen />
                </RoleGuard>
              }
            />
            <Route
              path="/waiter"
              element={
                <RoleGuard role="waiter">
                  <Waiter />
                </RoleGuard>
              }
            />
            <Route path="/staff/login" element={<StaffLogin />} />
            <Route path="/admin/login" element={<StaffLogin />} />
            <Route
              path="/admin"
              element={
                <RoleGuard role="admin">
                  <Admin />
                </RoleGuard>
              }
            />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </StoreProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
