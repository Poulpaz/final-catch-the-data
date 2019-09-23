import React from "react";
import Navigator from "./Navigation/Navigator";
import { DefaultTheme, Provider as PaperProvider } from "react-native-paper";

import ActivityModel from "./Storage/ActivityModel";
import AltitudeDotModel from "./Storage/AltitudeDotModel";
import DistanceDotModel from "./Storage/DistanceDotModel";
import HomeDataModel from "./Storage/HomeDataModel";
import PowerDotModel from "./Storage/PowerDotModel";
import SettingsDataModel from "./Storage/SettingsDataModel";
import SpeedDotModel from "./Storage/SpeedDotModel";

export default class App extends React.Component {
  componentDidMount() {
    this._createDatabase();
    //this._dropDatabase();
  }

  _createDatabase() {
    ActivityModel.createTable();
    AltitudeDotModel.createTable();
    DistanceDotModel.createTable();
    HomeDataModel.createTable();
    PowerDotModel.createTable();
    SettingsDataModel.createTable();
    SpeedDotModel.createTable();
  }

  _dropDatabase() {
    ActivityModel.dropTable();
    AltitudeDotModel.dropTable();
    DistanceDotModel.dropTable();
    HomeDataModel.dropTable();
    PowerDotModel.dropTable();
    SettingsDataModel.dropTable();
    SpeedDotModel.dropTable();
  }

  render() {
    return (
      <PaperProvider theme={theme}>
        <Navigator />
      </PaperProvider>
    );
  }
}

const theme = {
  ...DefaultTheme,
  roundness: 2,
  colors: {
    ...DefaultTheme.colors,
    primary: "#013f99",
    secondary: "#d93f2b",
    accent: "#f1c40f",
    background: "#ffffff"
  }
};
