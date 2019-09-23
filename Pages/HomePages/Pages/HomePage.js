import React from "react";
import {
  View,
  Picker,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ToastAndroid
} from "react-native";

import { Appbar, Button, Card, TextInput } from "react-native-paper";

import homeStyles from "../Styles/HomePageStyles";

import HomeDataModel from "../../../Storage/HomeDataModel";

const homeData = {
  columns: "id, position, roadState, temperature",
  page: 1,
  limit: 1,
  order: "id DESC"
};

export default class HomePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      homeData: [],
      idHomeData: null,
      position: 0.0,
      roadState: 0.0,
      temperature: 0
    };
  }

  componentDidMount() {
    this._loadHomeData();
  }

  componentDidUpdate() {
    //console.log(this.state);
  }

  _loadHomeData = () => {
    return HomeDataModel.query(homeData)
      .then(res => {
        this.setState({
          homeData: res
        }),
          this.state.homeData.map(item =>
            this.setState({
              idHomeData: item.id,
              position: item.position,
              roadState: item.roadState,
              temperature: item.temperature
            })
          ),
          console.log(res);
      })
      .catch(error => {
        console.log(error);
      });
  };

  _saveHomeData = () => {
    if (this.state.settings && this.state.settings.length > 0) {
      const homeDataEdit = {
        id: this.state.idHomeData,
        position: parseFloat(this.state.position).toFixed(2),
        roadState: parseFloat(this.state.roadState).toFixed(4),
        temperature: parseInt(this.state.temperature)
      };
      HomeDataModel.update(homeDataEdit).then(this._loadHomeData());
    } else {
      const homeDataNew = {
        position: parseFloat(this.state.position).toFixed(2),
        roadState: parseFloat(this.state.roadState).toFixed(4),
        temperature: parseInt(this.state.temperature)
      };
      HomeDataModel.create(homeDataNew)
        .then(res => this.setState({ idHomeData: res.id }))
        .then(this._loadHomeData());
    }
    ToastAndroid.show("Données enregistrées avec succès", ToastAndroid.SHORT);
  };

  render() {
    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <Appbar.Header>
          <Appbar.Content title="Accueil" subtitle="Lancer une activité" />
        </Appbar.Header>
        <ScrollView>
          <Card style={homeStyles.homeCard}>
            <Card.Title
              title="Position"
              subtitle="Sélectionnez votre position"
            />
            <Card.Content>
              <Picker
                selectedValue={String(this.state.position)}
                onValueChange={(itemValue, itemIndex) =>
                  this.setState({
                    position: itemValue
                  })
                }
              >
                <Picker.Item label="Choisir une valeur" value="0.00" />
                <Picker.Item label="100% assis - Position aéro" value="0.3" />
                <Picker.Item
                  label="100% assis - position non aéro"
                  value="0.32"
                />
                <Picker.Item label="Alternance assis / danseuse" value="0.35" />
              </Picker>
            </Card.Content>
          </Card>
          <Card style={homeStyles.homeCard}>
            <Card.Title
              title="État de la route"
              subtitle="Sélectionnez le type de route"
            />
            <Card.Content>
              <Picker
                selectedValue={String(this.state.roadState)}
                onValueChange={(itemValue, itemIndex) =>
                  this.setState({
                    roadState: itemValue
                  })
                }
              >
                <Picker.Item label="Choisir une valeur" value="0.0000" />
                <Picker.Item label="Très lisse" value="0.0025" />
                <Picker.Item label="Moyennement lisse" value="0.0028" />
                <Picker.Item label="Rugeuse" value="0.003" />
              </Picker>
            </Card.Content>
          </Card>
          <Card style={homeStyles.homeCard}>
            <Card.Content>
              <TextInput
                label="Température"
                placeholder="Température moyenne (°C)"
                keyboardType="decimal-pad"
                value={String(this.state.temperature)}
                onChangeText={value =>
                  this.setState({
                    temperature: value
                  })
                }
              />
            </Card.Content>
          </Card>
          <Card style={homeStyles.homeCardButton}>
            <Button
              icon="check"
              mode="contained"
              onPress={() => this._saveHomeData()}
            >
              Sauvegarder
            </Button>
          </Card>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }
}
