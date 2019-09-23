import React from "react";
import {
  Picker,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  View,
  ToastAndroid
} from "react-native";
import { Appbar, Card, Button, TextInput } from "react-native-paper";
import DatePicker from "react-native-datepicker";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

import styles from "../Styles/SettingsPageStyles";

import SettingsDataModel from "../../../Storage/SettingsDataModel";

const settingsData = {
  columns:
    "id, firstname, lastname, birthDate, friction, height, weight, fullWeight",
  page: 1,
  limit: 1,
  order: "id DESC"
};

export default class SettingsPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      settingsData: [],
      idSettingsData: null,
      firstname: "",
      lastname: "",
      birthDate: "",
      friction: 0,
      height: 0,
      weight: 0,
      fullWeight: 0
    };
  }

  componentDidMount() {
    this._loadSettingsData();
  }

  componentDidUpdate() {
    //console.log(this.state);
  }

  _loadSettingsData = () => {
    return SettingsDataModel.query(settingsData)
      .then(res => {
        this.setState({
          settingsData: res
        }),
          this.state.settingsData.map(item =>
            this.setState({
              idSettingsData: item.id,
              firstname: item.firstname,
              lastname: item.lastname,
              birthDate: item.birthDate,
              friction: item.friction,
              height: item.height,
              weight: item.weight,
              fullWeight: item.fullWeight
            })
          ),
          console.log(res);
      })
      .catch(error => {
        console.log(error);
      });
  };

  _saveSettingsData = () => {
    if (this.state.settingsData && this.state.settingsData.length > 0) {
      const settingsDataEdit = {
        id: this.state.idSettingsData,
        firstname: this.state.firstname,
        lastname: this.state.lastname,
        birthDate: this.state.birthDate,
        friction: this.state.friction,
        height: this.state.height,
        weight: this.state.weight,
        fullWeight: this.state.fullWeight
      };
      SettingsDataModel.update(settingsDataEdit).then(this._loadSettingsData());
    } else {
      const settingsDataNew = {
        firstname: this.state.firstname,
        lastname: this.state.lastname,
        birthDate: this.state.birthDate,
        friction: this.state.friction,
        height: this.state.height,
        weight: this.state.weight,
        fullWeight: this.state.fullWeight
      };
      SettingsDataModel.create(settingsDataNew)
        .then(res => this.setState({ idSettingsData: res.id }))
        .then(this._loadSettingsData());
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
          <Appbar.Content
            title="Paramètres"
            subtitle="Personnaliser son expérience"
          />
        </Appbar.Header>
        <ScrollView>
          <Card style={styles.settingsCard}>
            <Card.Content>
              <TextInput
                label="Prénom"
                value={this.state.firstname}
                onChangeText={value => this.setState({ firstname: value })}
              />
            </Card.Content>
          </Card>
          <Card style={styles.settingsCard}>
            <Card.Content>
              <TextInput
                label="Nom"
                value={this.state.lastname}
                onChangeText={value => this.setState({ lastname: value })}
              />
            </Card.Content>
          </Card>
          <Card style={styles.settingsCard}>
            <Card.Content>
              <DatePicker
                date={this.state.birthDate}
                style={{ width: "auto" }}
                mode="date"
                format="DD-MM-YYYY"
                minDate="02-01-1929"
                maxDate={
                  new Date().getDate() +
                  "-" +
                  (new Date().getMonth() + 1) +
                  "-" +
                  new Date().getFullYear()
                }
                confirmBtnText="Valider"
                cancelBtnText="Annuler"
                onDateChange={date => {
                  this.setState({ birthDate: date });
                }}
                iconComponent={
                  <MaterialIcons name={"event"} size={25} color={"gray"} />
                }
              />
            </Card.Content>
          </Card>
          <Card style={styles.settingsCard}>
            <Card.Title
              title="Frottement"
              subtitle="Sélectionnez l'état de votre vélo"
            />
            <Card.Content>
              <Picker
                selectedValue={String(this.state.friction)}
                onValueChange={(itemValue, itemIndex) =>
                  this.setState({
                    friction: itemValue
                  })
                }
              >
                <Picker.Item label="Choisir une valeur" value="0" />
                <Picker.Item
                  label="Roulements et lubrification excellents"
                  value="7"
                />
                <Picker.Item
                  label="Roulements et lubrification moyens"
                  value="10"
                />
                <Picker.Item
                  label="Roulements et lubrification mauvais"
                  value="15"
                />
              </Picker>
            </Card.Content>
          </Card>
          <Card style={styles.settingsCard}>
            <Card.Content>
              <TextInput
                label="Taille (cm)"
                keyboardType="decimal-pad"
                value={String(this.state.height)}
                onChangeText={value =>
                  this.setState({
                    height: value
                  })
                }
              />
            </Card.Content>
          </Card>
          <View style={{ flex: 4, flexDirection: "row" }}>
            <Card style={styles.settingsLeftCard}>
              <Card.Content>
                <TextInput
                  label="Poids à nu (kg)"
                  keyboardType="number-pad"
                  value={String(this.state.weight)}
                  onChangeText={value =>
                    this.setState({
                      weight: value
                    })
                  }
                />
              </Card.Content>
            </Card>
            <Card style={styles.settingsRightCard}>
              <Card.Content>
                <TextInput
                  label="Poids total (kg)"
                  keyboardType="number-pad"
                  value={String(this.state.fullWeight)}
                  onChangeText={value =>
                    this.setState({
                      fullWeight: value
                    })
                  }
                />
              </Card.Content>
            </Card>
          </View>
          <Card style={styles.settingsCardButton}>
            <Button
              icon="check"
              mode="contained"
              onPress={() => this._saveSettingsData()}
            >
              Sauvegarder
            </Button>
          </Card>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }
}
