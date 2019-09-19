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

import styles from "../Styles/HistoryPageStyles";

export default class HistoryPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      refreshing: false,
      activities: []
    };
  }

  componentDidMount() {
    console.log(this.state);
  }

  componentDidUpdate() {
    console.log(this.state);
  }

  componentWillUnmount() {
    console.log(this.state);
  }

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
              onRefresh={console.log("REFRESHING")}
            />
          }
        >
          <Card style={styles.historyListCard}>
            <List.Section>
              <List.Item title="Aucune activité enregistrée." />
            </List.Section>
          </Card>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }
}
