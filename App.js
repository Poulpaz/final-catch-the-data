import React from "react";
import Navigator from "./Navigation/Navigator";
import { DefaultTheme, Provider as PaperProvider } from "react-native-paper";

export default class App extends React.Component {
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
