import React from "react";

import { View } from "react-native";
import { Card, Text } from "react-native-paper";

import styles from "../Styles/ActivityPageStyles";

export default class CardDataActivity extends React.Component {
  render() {
    return (
      <View style={styles.dataColumnView}>
        <Card style={this.props.cardStyle}>
          <Card.Content>
            <Text style={styles.titleData}>{this.props.titleCard}</Text>
            <Text style={styles.textValueData}>{this.props.value}</Text>
          </Card.Content>
        </Card>
      </View>
    );
  }
}
