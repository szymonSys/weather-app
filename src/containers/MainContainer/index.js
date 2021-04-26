import { observer } from "mobx-react-lite";
import { storeContext } from "../../models";
import useLoad from "../../hooks/useLoad";

function MainContainer({ children }) {
  const isLoaded = useLoad(storeContext);
  return <>{isLoaded ? <div>{children}</div> : <div>loading...</div>}</>;
}

export default observer(MainContainer);
