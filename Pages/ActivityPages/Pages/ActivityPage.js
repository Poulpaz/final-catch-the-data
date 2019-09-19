import React from "react";
import {
  ScrollView,
  Text,
  KeyboardAvoidingView,
  View,
  Platform
} from "react-native";
import { Appbar, Card } from "react-native-paper";
import Buttons from "../Components/ButtonsActivity";
import CardData from "../Components/CardDataActivity";
import DialogInput from "../Components/DialogInputActivity";

import styles from "../Styles/ActivityPageStyles";

export default class ActivityPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      idActivity: 0,
      settingsHome: [],
      settingsUser: [],
      temperature: 0,
      scx: 0,
      height: 0,
      weight: 0,
      fullWeight: 0,
      cr: 0,
      friction: 0,
      onPlay: false,
      canStop: false,
      stopwatchStart: false,
      stopwatchReset: false,
      latitude: 0.0,
      longitude: 0.0,
      routeCoordinates: [],
      distanceTravelled: 0.0,
      prevDistanceTravelled: 0,
      denivele: 0,
      prevLatLng: {},
      power: 0.0,
      altitude: 0.0,
      prevAltitude: 0.0,
      speed: -1,
      startTime: 0,
      endTime: 0,
      isDialogVisible: false
    };
    this._onPressPlayButton = this._onPressPlayButton.bind(this);
    this._onPressStopButton = this._onPressStopButton.bind(this);
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

  //Play button
  _onPressPlayButton() {}

  //Stop button
  _onPressStopButton() {}

  render() {
    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <Appbar.Header>
          <Appbar.Content title="Activité" subtitle="Suivre son activité" />
        </Appbar.Header>
        <ScrollView>
          <View style={styles.dataRowView}>
            <View style={styles.dataColumnView}>
              <Card style={styles.activityCard}>
                <Text>TIMER - STOPWATCH</Text>
              </Card>
            </View>
          </View>
          <View style={styles.dataRowView}>
            <View style={styles.dataColumnView}>
              <Card style={styles.activityCard}>
                <Buttons
                  disabledPlay={this.state.onPlay}
                  pressPlay={() => this._onPressPlayButton()}
                  disabledStop={!this.state.canStop}
                  pressStop={() => this._onPressStopButton()}
                />
              </Card>
            </View>
          </View>
          <View style={styles.dataRowView}>
            <CardData
              cardStyle={styles.activityLeftCard}
              titleCard={"Distance (km)"}
              value={
                parseFloat(this.state.distanceTravelled).toFixed(3) < 0.001
                  ? "0"
                  : parseFloat(this.state.distanceTravelled).toFixed(3)
              }
            />
            <CardData
              cardStyle={styles.activityRightCard}
              titleCard={"Dénivelé (m)"}
              value={parseInt(this.state.denivele).toFixed(0)}
            />
          </View>
          <View style={styles.dataRowView}>
            <CardData
              cardStyle={styles.activityLeftCard}
              titleCard={"Puissance (W)"}
              value={
                parseFloat(this.state.power).toFixed(1) < 0.1
                  ? "0"
                  : parseFloat(this.state.power).toFixed(1)
              }
            />
            <CardData
              cardStyle={styles.activityRightCard}
              titleCard={"Altitude (m)"}
              value={
                parseFloat(this.state.altitude).toFixed(1) < 0.1
                  ? "0"
                  : parseFloat(this.state.altitude).toFixed(1)
              }
            />
          </View>
          <View style={styles.dataRowView}>
            <CardData
              cardStyle={styles.activityBottomLeftCard}
              titleCard={"Vitesse (km/h)"}
              value={
                parseFloat(this.state.speed).toFixed(1) < 0.1
                  ? "0"
                  : parseFloat(this.state.speed).toFixed(0) * 4
              }
            />
            <CardData
              cardStyle={styles.activityBottomRightCard}
              titleCard={"Puissance (W/Kg)"}
              value={
                parseFloat(this.state.power / this.state.fullWeight).toFixed(
                  1
                ) === "NaN"
                  ? "0"
                  : parseFloat(
                      this.state.power / this.state.fullWeight
                    ).toFixed(1)
              }
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }
}
