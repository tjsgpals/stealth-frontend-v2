
import { useState } from "react";
import StartPage from "./pages/StartPage";
import ViewerPage from "./pages/ViewerPage";

function App() {
  const [currentPage, setCurrentPage] = useState("start");

  return (
    <>
      {currentPage === "start" ? (
        <StartPage onStart={() => setCurrentPage("viewer")} />
      ) : (
        <ViewerPage />
      )}
    </>
  );
}

export default App;