import MainRouter from "./routers/MainRouter";
import { StoreProvider } from "./models";
import { Container } from "@material-ui/core";

function App() {
  return (
    <StoreProvider>
      <Container className="App">
        <MainRouter />
      </Container>
    </StoreProvider>
  );
}

export default App;
