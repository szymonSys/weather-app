import MainRouter from "./routers/MainRouter";
import { StoreProvider } from "./models";

function App() {
  return (
    <StoreProvider>
      <div className="App">
        <MainRouter />
      </div>
    </StoreProvider>
  );
}

export default App;
