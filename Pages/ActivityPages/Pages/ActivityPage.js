import React from "react";
import {
  ScrollView,
  KeyboardAvoidingView,
  View,
  Platform,
  ToastAndroid
} from "react-native";
import { Appbar, Card } from "react-native-paper";
import Buttons from "../Components/ButtonsActivity";
import CardData from "../Components/CardDataActivity";
import DialogInput from "../Components/DialogInputActivity";

import { Stopwatch } from "react-native-stopwatch-timer";
import haversine from "haversine";

import ActivityModel from "../../../Storage/ActivityModel";
import HomeDataModel from "../../../Storage/HomeDataModel";
import SettingsDataModel from "../../../Storage/SettingsDataModel";
import AltitudeDotModel from "../../../Storage/AltitudeDotModel";
import DistanceDotModel from "../../../Storage/DistanceDotModel";
import PowerDotModel from "../../../Storage/PowerDotModel";
import SpeedDotModel from "../../../Storage/SpeedDotModel";

import styles, { timerStyles } from "../Styles/ActivityPageStyles";

const activity = {
  title: "Activité en cours..."
};

const homeData = {
  columns: "id, position, roadState, temperature",
  page: 1,
  limit: 1,
  order: "id DESC"
};

const settingsData = {
  columns: "id, friction, height, weight, fullWeight",
  page: 1,
  limit: 1,
  order: "id DESC"
};

export default class ActivityPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      idActivity: 0,
      //data
      homeData: [],
      settingsData: [],
      //from home screen
      scx: 0,
      cr: 0,
      temperature: 0,
      //from settings screen
      friction: 0,
      height: 0,
      weight: 0,
      fullWeight: 0,
      //controls for stopwatch
      onPlay: false,
      canStop: false,
      stopwatchStart: false,
      stopwatchReset: false,
      //coordinates and values on activity screen
      latitude: 0.0,
      longitude: 0.0,
      routeCoordinates: [],
      prevLatLng: {},
      distanceTravelled: 0,
      prevDistanceTravelled: 0,
      denivele: 0,
      power: 0,
      altitude: 0,
      prevAltitude: 0,
      speed: -1,
      //time
      startTime: 0,
      endTime: 0,
      //dialog
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

  componentWillUpdate() {
    console.log(this.state.denivele);
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

    //Calculate power and denivele every 3s
    this._intervalPowerDenivele = setInterval(() => {
      this._calcPowerFormula();
      this._calcDeniveleFormula();
    }, 3000);

    //Save each dot in database every 3s
    this._intervalSaveDataBase = setInterval(() => {
      const distanceDot = {
        distance: parseFloat(this.state.distanceTravelled).toFixed(3),
        idActivity: this.state.idActivity
      };

      const altitudeDot = {
        altitude: parseFloat(this.state.altitude).toFixed(1),
        idActivity: this.state.idActivity
      };

      const speedDot = {
        speed: parseFloat(this.state.speed * 4).toFixed(1),
        idActivity: this.state.idActivity
      };

      const powerDot = {
        power: parseFloat(this.state.power).toFixed(1),
        idActivity: this.state.idActivity
      };

      DistanceDotModel.create(distanceDot).then(res => {
        this.setState({
          prevDistanceTravelled: res.distance
        });
      });

      AltitudeDotModel.create(altitudeDot).then(res => {
        this.setState({
          prevAltitude: res.altitude
        });
      });

      PowerDotModel.create(powerDot);
      SpeedDotModel.create(speedDot);
    }, 3000);
  };

  componentDidUpdate() {
    //console.log(this.state);
  }

  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.watchID);
    clearInterval(this._intervalAltitudeSpeed);
    clearInterval(this._intervalDistance);
    clearInterval(this._intervalPowerDenivele);
    clearInterval(this._intervalSaveDataBase);
  }

  //Play button
  _onPressPlayButton() {
    ToastAndroid.show("Vérification des données...", ToastAndroid.SHORT);
    this._loadAllData();
    setTimeout(() => {
      var state = this.state;
      if (
        state.scx !== 0 &&
        state.cr !== 0 &&
        state.temperature !== 0 &&
        state.friction !== 0 &&
        state.fullWeight !== 0
      ) {
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
      } else {
        ToastAndroid.show(
          "Veuillez vérifier les données saisies.",
          ToastAndroid.LONG
        );
      }
    }, 2000);
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

  //Get all settings
  _loadAllData() {
    this._loadHomeData();
    this._loadSettingsData();
    console.log(this.state.homeData);
  }

  //Get settings from Home Screen
  _loadHomeData = () => {
    return HomeDataModel.query(homeData)
      .then(res => {
        this.setState({
          homeData: res
        }),
          this.state.homeData.map(item =>
            this.setState({
              scx: item.position,
              cr: item.roadState,
              temperature: item.temperature
            })
          );
      })
      .catch((error, res) => {
        console.log(error);
        console.log(res);
      });
  };

  //Get settings from Settings Screen
  _loadSettingsData = () => {
    return SettingsDataModel.query(settingsData)
      .then(res => {
        this.setState({
          settingsData: res
        }),
          this.state.settingsData.map(item =>
            this.setState({
              friction: item.friction,
              height: item.height,
              weight: item.weight,
              fullWeight: item.fullWeight
            })
          );
      })
      .catch((error, res) => {
        console.log(error);
        console.log(res);
      });
  };

  //Function to calculate denivele
  _calcDeniveleFormula = () => {
    var denivele;
    if (
      this.state.prevAltitude != this.state.altitude &&
      this.state.altitude > 0 &&
      this.state.prevAltitude != 0 &&
      this.state.altitude > this.state.prevAltitude
    ) {
      denivele =
        this.state.denivele + this.state.altitude - this.state.prevAltitude;
    } else {
      denivele = this.state.denivele + 0;
    }
    this.setState({
      denivele: denivele
    });
  };

  //Function to calculate fullPower
  _calcPowerFormula = () => {
    var aeroPower = 0;
    var heightAltitude = 0;
    var gravityPower = 0;
    var rollPower = 0;
    if (this.state.altitude >= 1 && this.state.speed >= 0.01) {
      aeroPower =
        0.5 *
        (1.292 *
          ((0.085 * this.state.altitude + 760) / 760) *
          (273 / (273 + this.state.temperature))) *
        0.3 *
        Math.pow((this.state.speed * 4) / 3.6, 3);
    } else {
      aeroPower = 0;
    }
    if (
      this.state.prevAltitude != 0 &&
      this.state.prevDistanceTravelled != 0 &&
      this.state.speed >= 0.01 &&
      this.state.distanceTravelled != this.state.prevDistanceTravelled
    ) {
      heightAltitude = this.state.altitude - this.state.prevAltitude;
      if (heightAltitude < 0) {
        heightAltitude = heightAltitude / -1;
      }
      gravityPower =
        ((this.state.fullWeight * 9.81 * heightAltitude) /
          ((this.state.distanceTravelled - this.state.prevDistanceTravelled) *
            1000)) *
        ((this.state.speed * 4) / 3.6);
    } else {
      gravityPower = 0;
    }
    if (this.state.speed >= 0.01) {
      rollPower =
        this.state.cr *
        this.state.fullWeight *
        9.81 *
        ((this.state.speed * 4) / 3.6);
    } else {
      rollPower = 0;
    }
    var fullPower = aeroPower + gravityPower + rollPower + this.state.friction;
    this.setState({
      power: fullPower
    });
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
              isDialogVisible: false,
              distanceTravelled: 0,
              power: 0
            });
            clearInterval(this._intervalDistance);
            clearInterval(this._intervalPowerDenivele);
            clearInterval(this._intervalSaveDataBase);
            var totalTime = this.state.endTime - this.state.startTime;
            const activityEdit = {
              id: this.state.idActivity,
              title: inputText,
              distanceTravelled: parseFloat(
                this.state.distanceTravelled
              ).toFixed(3),
              denivele: parseInt(this.state.denivele).toFixed(0),
              height: this.state.height,
              weight: this.state.weight,
              time: parseInt(totalTime).toFixed(0)
            };
            try {
              ActivityModel.update(activityEdit);
            } catch (error) {
              console.log(error);
            }
          }}
          close={() => {
            this.setState({
              isDialogVisible: false
            });
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
