import { StyleSheet } from "react-native";

export default HistoryItemStyles = StyleSheet.create({
  historyItemCard: {
    marginTop: 8,
    marginLeft: 8,
    marginRight: 8,
    elevation: 5
  },
  historyItemBottomCard: {
    marginTop: 8,
    marginBottom: 8,
    marginLeft: 8,
    marginRight: 8,
    elevation: 5
  },
  viewYAxis: {
    height: 300,
    paddingStart: 8,
    flexDirection: "row"
  },
  viewXAxis: {
    flex: 1,
    marginLeft: 8,
    marginRight: 8
  },
  lineChart: {
    flex: 1,
    height: 300
  }
});
