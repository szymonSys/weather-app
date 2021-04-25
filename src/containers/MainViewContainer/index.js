import { useContext } from "react";
import { observer } from "mobx-react-lite";
import { storeContext } from "../../models";

function MainContainer({ children }) {
  const store = useContext(storeContext);

  return <>{children({ ...store.localization })}</>;
}

export default observer(MainContainer);
