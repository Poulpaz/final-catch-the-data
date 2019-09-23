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

import { Stopwatch } from "react-native-stopwatch-timer";
import haversine from "haversine";

import ActivityModel from "../../../Storage/ActivityModel";

import styles, { timerStyles } from "../Styles/ActivityPageStyles";

const activity = {
  title: "Activité en cours..."
};

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
      distanceTravelled: 0,
      prevDistanceTravelled: 0,
      denivele: 0,
      prevLatLng: {},
      power: 0,
      altitude: 0,
      prevAltitude: 0,
      speed: -1,
      startTime: 0,
      endTime: 0,
      isDialogVisible: false
    };
    this._onPressPlayButton = this._onPressPlayButton.bind(this);
    this._onPressStopButton = this._onPressStopButton.bind(this);
  }

  componentDidMount() {
    this._intervalAltitudeSpeed = setInterval(() => {
      this.watchID = navigator.geolocation.getCurrentPosition(
        pos => {
          const { altitude, speed } = pos.coords;
          this.setState({
            altitude,
            speed
          });
        },
        error => console.log(error),
        {
          enableHighAccuracy: true,
          timeout: 20000,
          maximumAge: 1000,
          distanceFilter: 10
        }
      );
    }, 3000);
  }

  setIntervalComponents = () => {
    //Calculate distance when geolocalisation change every 3s
    this.watchID = this._intervalDistance = setInterval(() => {
      navigator.geolocation.watchPosition(
        pos => {
          const { routeCoordinates, distanceTravelled } = this.state;
          const { latitude, longitude } = pos.coords;
          const newCoordinate = {
            latitude,
            longitude
          };
          this.setState({
            latitude,
            longitude,
            routeCoordinates: routeCoordinates.concat([newCoordinate]),
            distanceTravelled:
              distanceTravelled + this.calcDistance(newCoordinate),
            prevLatLng: newCoordinate
          });
        },
        error => console.log(error),
        {
          enableHighAccuracy: true,
          timeout: 20000,
          maximumAge: 1000,
          distanceFilter: 10
        }
      );
    }, 3000);
  };

  componentDidUpdate() {
    console.log(this.state);
  }

  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.watchID);
    clearInterval(this._intervalAltitudeSpeed);
    clearInterval(this._intervalDistance);
  }

  //Play button
  _onPressPlayButton() {
    this.setState({
      onPlay: true,
      canStop: true,
      stopwatchStart: !this.state.stopwatchStart,
      stopwatchReset: false,
      distanceTravelled: 0,
      denivele: 0,
      power: 0,
      startTime: parseInt(
        new Date().getHours() * 3600 +
          new Date().getMinutes() * 60 +
          new Date().getSeconds()
      ).toFixed(0),
      prevLatLng: {}
    });

    ActivityModel.create(activity).then(res =>
      this.setState({
        idActivity: res.id
      })
    );

    this.setIntervalComponents();
  }

  //Stop button
  _onPressStopButton() {
    this.setState({
      isDialogVisible: true,
      endTime: parseInt(
        new Date().getHours() * 3600 +
          new Date().getMinutes() * 60 +
          new Date().getSeconds()
      ).toFixed(0)
    });
    clearInterval(this._intervalDistance);
  }

  //Render formated time for Stopwatch
  getFormattedTime(time) {
    this.currentTime = time;
  }

  //Calulate distance with haversine formula
  calcDistance = newLatLng => {
    const { prevLatLng } = this.state;
    return haversine(prevLatLng, newLatLng) || 0;
  };

  render() {
    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <Appbar.Header>
          <Appbar.Content title="Activité" subtitle="Suivre son activité" />
        </Appbar.Header>
        <DialogInput
          visibility={this.state.isDialogVisible}
          submit={inputText => {
            this.setState({
              onPlay: false,
              canStop: false,
              stopwatchReset: true,
              stopwatchStart: !this.state.stopwatchStart,
              isDialogVisible: false
            });
            //var totalTime = this.state.endTime - this.state.startTime;

            const activityEdit = {
              id: this.state.idActivity,
              title: inputText
            };
            try {
              ActivityModel.update(activityEdit);
            } catch (error) {
              console.log(error);
            }
          }}
          close={() => {
            this.setState({
              isDialogVisible: false,
              stopwatchStart: !this.state.stopwatchStart
            });
            this.setIntervalComponents();
          }}
        />
        <ScrollView>
          <View style={styles.dataRowView}>
            <View style={styles.dataColumnView}>
              <Card style={styles.activityCard}>
                <Stopwatch
                  secs
                  start={this.state.stopwatchStart}
                  reset={this.state.stopwatchReset}
                  options={timerStyles}
                  getTime={this.getFormattedTime}
                />
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
