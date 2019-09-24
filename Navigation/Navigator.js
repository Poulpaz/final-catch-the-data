import React from "react";
import { createBottomTabNavigator } from "react-navigation-tabs";
import { createStackNavigator } from "react-navigation-stack";
import { createAppContainer } from "react-navigation";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

//Get All Pages From Application
import HomePage from "../Pages/HomePages/Pages/HomePage";
import ActivityPage from "../Pages/ActivityPages/Pages/ActivityPage";
import HistoryPage from "../Pages/HistoryPages/Pages/HistoryPage";
import HistoryItem from "../Pages/HistoryPages/Pages/HistoryItem";
import SettingsPage from "../Pages/SettingsPages/Pages/SettingsPage";

const HistoryStack = createStackNavigator(
  {
    Historique: HistoryPage,
    Details: HistoryItem
  },
  {
    initialRouteName: "Historique"
  }
);

HistoryStack.navigationOptions = ({ navigation }) => {
  let tabBarVisible = true;
  if (navigation.state.index > 0) {
    tabBarVisible = false;
  }
  return {
    tabBarVisible
  };
};

const TabNavigator = createBottomTabNavigator(
  {
    Accueil: HomePage,
    Activité: ActivityPage,
    Historique: HistoryStack,
    Paramètres: SettingsPage
  },
  {
    defaultNavigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ tintColor }) => {
        const { routeName } = navigation.state;
        let IconComponent = MaterialIcons;
        let iconName;
        if (routeName === "Accueil") {
          iconName = "home";
        } else if (routeName === "Activité") {
          iconName = "dashboard";
        } else if (routeName === "Historique") {
          iconName = "history";
        } else if (routeName === "Paramètres") {
          iconName = "settings";
        }
        return <IconComponent name={iconName} size={25} color={tintColor} />;
      }
    }),
    tabBarOptions: {
      activeTintColor: "tomato",
      inactiveTintColor: "gray"
    }
  }
);

export default createAppContainer(TabNavigator);
