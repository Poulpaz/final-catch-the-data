import React from "react";
import {
  ScrollView,
  View,
  Alert,
  RefreshControl,
  KeyboardAvoidingView,
  Platform
} from "react-native";
import { Appbar, Button, List, Card } from "react-native-paper";

import ActivityModel from "../../../Storage/ActivityModel";

import styles from "../Styles/HistoryPageStyles";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

const activities = {
  columns: "id, title",
  order: "id DESC"
};

export default class HistoryPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      refreshing: false,
      activities: []
    };
  }

  componentDidMount() {
    this._loadActivities();
  }

  componentWillUnmount() {}

  _onRefresh = () => {
    this.setState({ refreshing: true });
    this._loadActivities().then(() => {
      this.setState({ refreshing: false });
    });
  };

  _loadActivities = () => {
    return ActivityModel.query(activities)
      .then(res => {
        this.setState({
          activities: res
        });
      })
      .catch((error, res) => {
        console.log(error);
        console.log(res);
      });
  };

  _removeActivity = id => {
    ActivityModel.destroy(id);
    this._loadActivities();
  };

  render() {
    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <Appbar.Header>
          <Appbar.Content
            title="Historique"
            subtitle="Voir ses records et moyennes"
          />
          <Appbar.Action
            icon="apps"
            onPress={() => console.log("GO TO ALL HISTORY")}
          />
        </Appbar.Header>
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh}
            />
          }
        >
          <Card style={styles.historyListCard}>
            <List.Section>
              {this.state.activities && this.state.activities.length ? (
                this.state.activities.map(item => (
                  <List.Item
                    key={item.id}
                    title={item.title}
                    description={"Voir en détails"}
                    onPress={() =>
                      /*navigate("ItemDetails", {
                        idActivity: item.id
                      })*/
                      console.log("DETAILS")
                    }
                    onLongPress={() =>
                      Alert.alert(
                        "Supprimer",
                        "Voulez-vous vraiment supprimer cette activité ?",
                        [
                          {
                            text: "Annuler",
                            onPress: () => null,
                            style: "cancel"
                          },
                          {
                            text: "OK",
                            onPress: () => this._removeActivity(item.id)
                          }
                        ],
                        { cancelable: true }
                      )
                    }
                    left={props => <List.Icon {...props} icon="check" />}
                  />
                ))
              ) : (
                <List.Item title="Aucune activité enregistrée." />
              )}
            </List.Section>
          </Card>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }
}
