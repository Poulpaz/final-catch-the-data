import React from "react";
import {
  ScrollView,
  RefreshControl,
  View,
  KeyboardAvoidingView,
  Platform
} from "react-native";
import { Appbar, Card } from "react-native-paper";

import { BarChart, LineChart, YAxis, Grid } from "react-native-svg-charts";
import { Text } from "react-native-svg";

import styles from "../Styles/AllHistoryStyles";

import ActivityModel from "../../../Storage/ActivityModel";
import PowerDotModel from "../../../Storage/PowerDotModel";
import SpeedDotModel from "../../../Storage/SpeedDotModel";

const lastSixActivities = {
  columns: "id, distanceTravelled, denivele, weight, height, time",
  page: 1,
  limit: 6,
  order: "id DESC"
};

export default class AllHistory extends React.Component {
  static navigationOptions = {
    header: null
  };

  constructor(props) {
    super(props);
    this.state = {
      refreshing: false,
      lastSixActivities: [],
      averagesPower: [],
      averagesSpeed: [],
      allWeights: [],
      allHeights: [],
      allTimes: [],
      allDeniveles: [],
      allDistances: [],
      powerWithTimes: []
    };
  }

  _onRefresh = () => {
    this.setState({ refreshing: true });
    this.loadData().then(() => {
      this.setState({ refreshing: false });
    });
  };

  async componentDidMount() {
    await this.loadData();
  }

  async loadData() {
    await this._getLastSixActivities();
    await this._getDataFromActivities();
    await this._getAverageSpeedActivities();
    await this._getAveragePowerActivities();
  }

  async _getLastSixActivities() {
    return await ActivityModel.query(lastSixActivities)
      .then(res => {
        this.setState({
          lastSixActivities: res
        });
      })
      .catch((error, res) => {
        console.log(error);
        console.log(res);
      });
  }

  async _getDataFromActivities() {
    await this.state.lastSixActivities.reverse().map(activity => {
      this.setState({
        allHeights: this.state.allHeights.concat(activity.height),
        allWeights: this.state.allWeights.concat(activity.weight),
        allTimes: this.state.allTimes.concat(activity.time),
        allDeniveles: this.state.allDeniveles.concat(activity.denivele),
        allDistances: this.state.allDistances.concat(activity.distanceTravelled)
      });
    });
  }

  async _getAverageSpeedActivities() {
    await this.state.lastSixActivities.map(activity => {
      var speedDotQuery = {
        columns: "id, speed, idActivity",
        where: {
          idActivity_eq: activity.id
        },
        order: "id ASC"
      };
      SpeedDotModel.query(speedDotQuery)
        .then(res => {
          var speedDataArray = [];
          res.map(item => {
            speedDataArray = speedDataArray.concat(item.speed);
          });
          var sumOfDataSpeedDots = speedDataArray.reduce(
            (total, item) => total + item
          );
          var averageOfDataSpeedDots =
            sumOfDataSpeedDots / speedDataArray.length;
          this.setState({
            averagesSpeed: this.state.averagesSpeed.concat(
              averageOfDataSpeedDots
            )
          });
        })
        .catch((error, res) => {
          console.log(error);
          console.log(res);
        });
    });
  }

  async _getAveragePowerActivities() {
    await this.state.lastSixActivities.map(activity => {
      var powerDotQuery = {
        columns: "id, power, idActivity",
        where: {
          idActivity_eq: activity.id
        },
        order: "id ASC"
      };
      PowerDotModel.query(powerDotQuery)
        .then(res => {
          var powerDataArray = [];
          res.map(item => {
            powerDataArray = powerDataArray.concat(item.power);
          });
          var sumOfDataPowerDots = powerDataArray.reduce(
            (total, item) => total + item
          );
          var averageOfDataPowerDots =
            sumOfDataPowerDots / powerDataArray.length;
          this.setState({
            averagesPower: this.state.averagesPower.concat(
              averageOfDataPowerDots
            )
          });
        })
        .catch((error, res) => {
          console.log(error);
          console.log(res);
        });
    });
  }

  render() {
    const dataHeight = this.state.allHeights;
    const dataWeight = this.state.allWeights;
    const dataTime = this.state.allTimes;
    const dataDenivele = this.state.allDeniveles;
    const dataDistance = this.state.allDistances;
    const dataSpeed = this.state.averagesSpeed;
    const dataPower = this.state.averagesPower;
    const axesSvg = { fontSize: 10, fill: "grey" };
    const verticalContentInset = { top: 10, bottom: 10 };
    const contentInset = { top: 25, bottom: 10 };
    const svgBarChart = { fill: "tomato", fillOpacity: 0.8 };
    const svgLineChart = { stroke: "tomato", strokeWidth: 3 };

    const CUT_OFF = 20;
    const Labels = ({ x, y, bandwidth, data }) =>
      data.map((value, index) => (
        <Text
          key={index}
          x={x(index) + bandwidth / 2}
          y={value < CUT_OFF ? y(value) - 10 : y(value) + 15}
          fontSize={14}
          fill={value >= CUT_OFF ? "white" : "black"}
          alignmentBaseline={"middle"}
          textAnchor={"middle"}
        >
          {value % 1 === 0 ? value : parseFloat(value).toFixed(3)}
        </Text>
      ));

    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <Appbar.Header>
          <Appbar.BackAction onPress={() => this.props.navigation.goBack()} />
          <Appbar.Content title="Historique complet" />
        </Appbar.Header>
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh}
            />
          }
        >
          <Card style={styles.allHistoryCard}>
            <Card.Title title="Puissances moyennes" />
            <View style={styles.viewYAxis}>
              <BarChart
                style={styles.barChart}
                data={dataPower}
                svg={svgBarChart}
                contentInset={contentInset}
                spacing={0.2}
                gridMin={0}
              >
                <Grid direction={Grid.Direction.HORIZONTAL} />
                <Labels />
              </BarChart>
            </View>
          </Card>
          <Card style={styles.allHistoryCard}>
            <Card.Title title="Temps de parcours" />
            <View style={styles.viewYAxis}>
              <BarChart
                style={styles.barChart}
                data={dataTime}
                svg={svgBarChart}
                contentInset={contentInset}
                spacing={0.2}
                gridMin={0}
              >
                <Grid direction={Grid.Direction.HORIZONTAL} />
                <Labels />
              </BarChart>
            </View>
          </Card>
          <Card style={styles.allHistoryCard}>
            <Card.Title title="Distances parcourues" />
            <View style={styles.viewYAxis}>
              <BarChart
                style={styles.barChart}
                data={dataDistance}
                svg={svgBarChart}
                contentInset={contentInset}
                spacing={0.2}
                gridMin={0}
              >
                <Grid direction={Grid.Direction.HORIZONTAL} />
                <Labels />
              </BarChart>
            </View>
          </Card>
          <Card style={styles.allHistoryCard}>
            <Card.Title title="Dénivelés positifs cumulés" />
            <View style={styles.viewYAxis}>
              <BarChart
                style={styles.barChart}
                data={dataDenivele}
                svg={svgBarChart}
                contentInset={contentInset}
                spacing={0.2}
                gridMin={0}
              >
                <Grid direction={Grid.Direction.HORIZONTAL} />
                <Labels />
              </BarChart>
            </View>
          </Card>
          <Card style={styles.allHistoryCard}>
            <Card.Title title="Vitesses moyennes" />
            <View style={styles.viewYAxis}>
              <BarChart
                style={styles.barChart}
                data={dataSpeed}
                svg={svgBarChart}
                contentInset={contentInset}
                spacing={0.2}
                gridMin={0}
              >
                <Grid direction={Grid.Direction.HORIZONTAL} />
                <Labels />
              </BarChart>
            </View>
          </Card>
          <Card style={styles.allHistoryCard}>
            <Card.Title title="Évolution de votre poids" />
            <View style={styles.viewYAxis}>
              <YAxis
                data={dataWeight}
                contentInset={verticalContentInset}
                svg={axesSvg}
              />
              <View style={styles.viewXAxis}>
                <LineChart
                  style={styles.lineChart}
                  data={dataWeight}
                  contentInset={verticalContentInset}
                  svg={svgLineChart}
                >
                  <Grid />
                </LineChart>
              </View>
            </View>
          </Card>
          <Card style={styles.allHistoryBottomCard}>
            <Card.Title title="Évolution de votre taille" />
            <View style={styles.viewYAxis}>
              <YAxis
                data={dataHeight}
                contentInset={verticalContentInset}
                svg={axesSvg}
              />
              <View style={styles.viewXAxis}>
                <LineChart
                  style={styles.lineChart}
                  data={dataHeight}
                  contentInset={verticalContentInset}
                  svg={svgLineChart}
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
