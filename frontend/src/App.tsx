import { AppRoutes } from "./routes";
import { Toaster } from "react-hot-toast";
import "./App.css";

function App() {
  return (
    <>
      <AppRoutes />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: "#fff",
            color: "#000",
          },
        }}
      />
    </>
  );
}

export default App;
