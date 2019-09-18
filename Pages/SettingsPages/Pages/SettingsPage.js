import React from "react";
import {
  Picker,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  View
} from "react-native";
import { Appbar, Card, Button, TextInput } from "react-native-paper";
import DatePicker from "react-native-datepicker";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

import styles from "../Styles/SettingsPageStyles";

export default class SettingsPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
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
    console.log(this.state);
  }

  componentDidUpdate() {
    console.log(this.state);
  }

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
                selectedValue={this.state.friction}
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
              onPress={() => console.log("PRESSED !")}
            >
              Sauvegarder
            </Button>
          </Card>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }
}
