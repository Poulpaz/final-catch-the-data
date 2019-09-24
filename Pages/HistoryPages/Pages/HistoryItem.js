import React from "react";
import {
  ScrollView,
  RefreshControl,
  View,
  KeyboardAvoidingView,
  Platform
} from "react-native";
import { Appbar, Card } from "react-native-paper";
import { LineChart, Grid, YAxis } from "react-native-svg-charts";

import styles from "../Styles/HistoryItemStyles";

import ActivityModel from "../../../Storage/ActivityModel";
import AltitudeDotModel from "../../../Storage/AltitudeDotModel";
import PowerDotModel from "../../../Storage/PowerDotModel";
import SpeedDotModel from "../../../Storage/SpeedDotModel";

var idActivity = null;
var dataAltitudeDots = [];
var dataPowerDots = [];
var dataSpeedDots = [];

export default class HistoryItem extends React.Component {
  static navigationOptions = {
    header: null
  };

  constructor(props) {
    super(props);
    this.state = {
      refreshing: false,
      altitudeDotList: [],
      speedDotList: [],
      powerDotList: [],
      activity: [],
      averagePower: 0.0,
      averageSpeed: 0
    };
  }

  _onRefresh = () => {
    this._loadItemDetails();
  };

  componentDidMount() {
    this._loadItemDetails();
  }

  _loadItemDetails = () => {
    this._loadAltitudeDots();
    this._loadPowerDots();
    this._loadSpeedDots();
    this._loadActivity();
  };

  _loadAltitudeDots = () => {
    const allAltitudeDots = {
      columns: "id, altitude, idActivity",
      where: {
        idActivity_eq: idActivity
      },
      order: "id ASC"
    };

    return AltitudeDotModel.query(allAltitudeDots)
      .then(res => {
        this.setState({
          altitudeDotList: res
        });
      })
      .catch((error, res) => {
        console.log(error);
        console.log(res);
      });
  };

  _loadPowerDots = () => {
    const allPowerDots = {
      columns: "id, power, idActivity",
      where: {
        idActivity_eq: idActivity
      },
      order: "id ASC"
    };

    return PowerDotModel.query(allPowerDots)
      .then(res => {
        this.setState({
          powerDotList: res
        });
      })
      .catch((error, res) => {
        console.log(error);
        console.log(res);
      });
  };

  _loadSpeedDots = () => {
    const allSpeedDots = {
      columns: "id, speed, idActivity",
      where: {
        idActivity_eq: idActivity
      },
      order: "id ASC"
    };

    return SpeedDotModel.query(allSpeedDots)
      .then(res => {
        this.setState({
          speedDotList: res
        });
      })
      .catch((error, res) => {
        console.log(error);
        console.log(res);
      });
  };

  _loadActivity = () => {
    return ActivityModel.find(idActivity)
      .then(res => {
        this.setState({
          activity: res
        }),
          this._calculateAverages();
      })
      .catch((error, res) => {
        console.log(error);
        console.log(res);
      });
  };

  _calculateAverages = () => {
    var sumOfDataPowerDots = dataPowerDots.reduce(
      (total, item) => total + item
    );
    var sumOfDataSpeedDots = dataSpeedDots.reduce(
      (total, item) => total + item
    );
    var averageOfDataPowerDots = sumOfDataPowerDots / dataPowerDots.length;
    var averageOfDataSpeedDots = sumOfDataSpeedDots / dataSpeedDots.length;
    this.setState({
      averagePower: averageOfDataPowerDots,
      averageSpeed: averageOfDataSpeedDots
    });
  };

  _getTimeToString = timeInSeconds => {
    var totalTimeHours = parseInt(timeInSeconds / 3600).toFixed(0);
    var totalTimeMinutes = parseInt((timeInSeconds % 3600) / 60).toFixed(0);
    var totalTimeSeconds = parseInt((timeInSeconds % 3600) % 60).toFixed(0);
    return (totalTimeHours + " h " + totalTimeMinutes + " min " + totalTimeSeconds + " s");
  };

  render() {
    idActivity = this.props.navigation.getParam("idActivity", "NO-ID");
    dataAltitudeDots = this.state.altitudeDotList.map(item => item.altitude);
    dataSpeedDots = this.state.speedDotList.map(item => item.speed);
    dataPowerDots = this.state.powerDotList.map(item => item.power);

    const axesSvg = { fontSize: 10, fill: "grey" };
    const verticalContentInset = { top: 10, bottom: 10 };

    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <Appbar.Header>
          <Appbar.BackAction onPress={() => this.props.navigation.goBack()} />
          <Appbar.Content title={this.state.activity.title} />
        </Appbar.Header>
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh}
            />
          }
        >
          <Card style={styles.historyItemCard}>
            <Card.Title
              title="Temps de l'activité"
              subtitle={this._getTimeToString(parseInt(this.state.activity.time).toFixed(0))}
            />
          </Card>
          <Card style={styles.historyItemCard}>
            <Card.Title
              title="Distance totale"
              subtitle={
                parseFloat(this.state.activity.distanceTravelled).toFixed(3) +
                " km"
              }
            />
          </Card>
          <Card style={styles.historyItemCard}>
            <Card.Title
              title="Puissance moyenne"
              subtitle={parseFloat(this.state.averagePower).toFixed(1) + " W"}
            />
          </Card>
          <Card style={styles.historyItemCard}>
            <Card.Title
              title="Vitesse moyenne"
              subtitle={parseInt(this.state.averageSpeed).toFixed(0) + " km/h"}
            />
          </Card>
          <Card style={styles.historyItemCard}>
            <Card.Title
              title="Dénivelé positif cumulé"
              subtitle={
                parseInt(this.state.activity.denivele).toFixed(0) + " m"
              }
            />
          </Card>
          <Card style={styles.historyItemCard}>
            <Card.Title title="Dénivelé" />
            <View style={styles.viewYAxis}>
              <YAxis
                data={dataAltitudeDots}
                contentInset={verticalContentInset}
                svg={axesSvg}
              />
              <View style={styles.viewXAxis}>
                <LineChart
                  style={styles.lineChart}
                  data={dataAltitudeDots}
                  contentInset={verticalContentInset}
                  svg={{ stroke: "rgb(134, 65, 244)" }}
                >
                  <Grid />
                </LineChart>
              </View>
            </View>
          </Card>
          <Card style={styles.historyItemCard}>
            <Card.Title title="Puissance" />
            <View style={styles.viewYAxis}>
              <YAxis
                data={dataPowerDots}
                contentInset={verticalContentInset}
                svg={axesSvg}
              />
              <View style={styles.viewXAxis}>
                <LineChart
                  style={styles.lineChart}
                  data={dataPowerDots}
                  contentInset={verticalContentInset}
                  svg={{ stroke: "rgb(134, 65, 244)" }}
                >
                  <Grid />
                </LineChart>
              </View>
            </View>
          </Card>
          <Card style={styles.historyItemBottomCard}>
            <Card.Title title="Vitesse" />
            <View style={styles.viewYAxis}>
              <YAxis
                data={dataSpeedDots}
                contentInset={verticalContentInset}
                svg={axesSvg}
              />
              <View style={styles.viewXAxis}>
                <LineChart
                  style={styles.lineChart}
                  data={dataSpeedDots}
                  contentInset={verticalContentInset}
                  svg={{ stroke: "rgb(134, 65, 244)" }}
                >
                  <Grid />
                </LineChart>
              </View>
            </View>
          </Card>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }
}
