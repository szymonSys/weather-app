import { observer } from "mobx-react-lite";
import { storeContext } from "../../models";
import usePreLoad from "../../hooks/usePreLoad";

function MainContainer({ children }) {
  const isLoaded = usePreLoad(storeContext);
  return <>{isLoaded ? <div>{children}</div> : <div>loading...</div>}</>;
}

export default observer(MainContainer);
