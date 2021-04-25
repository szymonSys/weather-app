import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import MainView from "../../views/MainView";
import CountryView from "../../views/CountryView";
import CityView from "../../views/CityView";
import NotFoundView from "../../views/NotFoundView";
import MainContainer from "../../containers/MainContainer";

export default function MainRouter({ children }) {
  return (
    <Router>
      <MainContainer>
        {children}
        <Switch>
          <Route path="/" exact component={MainView} />
          <Route path="/country/:country" component={CountryView} />
          <Route path="/city/:country/:state/:city" component={CityView} />
          <Route component={NotFoundView} />
        </Switch>
      </MainContainer>
    </Router>
  );
}
