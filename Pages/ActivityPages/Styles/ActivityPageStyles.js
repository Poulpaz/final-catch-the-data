import { StyleSheet, Dimensions } from "react-native";

export default ActivityPageStyles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    alignItems: "stretch"
  },
  activityCard: {
    marginTop: 8,
    marginLeft: 8,
    marginRight: 8,
    elevation: 5,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 24
  },
  activityLeftCard: {
    flex: 1,
    flexDirection: "column",
    marginTop: 8,
    marginLeft: 8,
    elevation: 5,
    paddingVertical: 24
  },
  activityRightCard: {
    flex: 1,
    flexDirection: "column",
    marginTop: 8,
    marginLeft: 8,
    marginRight: 8,
    elevation: 5,
    paddingVertical: 24
  },
  activityBottomLeftCard: {
    flex: 1,
    flexDirection: "column",
    marginTop: 8,
    marginBottom: 8,
    marginLeft: 8,
    elevation: 5,
    paddingVertical: 24
  },
  activityBottomRightCard: {
    flex: 1,
    flexDirection: "column",
    marginTop: 8,
    marginBottom: 8,
    marginLeft: 8,
    marginRight: 8,
    elevation: 5,
    paddingVertical: 24
  },
  titleData: {
    fontSize: Dimensions.get("screen").width / 25,
    flex: 1,
    flexDirection: "row",
    textAlign: "center",
    justifyContent: "center",
    alignItems: "center"
  },
  textValueData: {
    fontSize: Dimensions.get("screen").width / 16,
    color: "#000",
    fontWeight: "bold",
    flex: 1,
    textAlign: "center",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center"
  },
  dataRowView: {
    flex: 4,
    flexDirection: "row"
  },
  dataColumnView: {
    flex: 1,
    flexDirection: "column"
  },
  buttonRowView: {
    flex: 2,
    flexDirection: "row"
  },
  buttonCardView: {
    alignItems: "flex-start",
    flexDirection: "row"
  }
});
