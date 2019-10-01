import React from "react";

import { View } from "react-native";
import { Card, Button } from "react-native-paper";

import styles from "../Styles/ActivityPageStyles";

export default class Buttons extends React.Component {
  render() {
    return (
      <View>
        <Card style={styles.surface}>
          <Card.Content style={styles.buttonCardView}>
            <Button
              icon="play-arrow"
              mode="contained"
              disabled={this.props.disabledPlay}
              onPress={this.props.pressPlay}
            />
            <Button
              icon="stop"
              mode="outlined"
              disabled={this.props.disabledStop}
              onPress={this.props.pressStop}
            />
          </Card.Content>
        </Card>
      </View>
    );
  }
}
