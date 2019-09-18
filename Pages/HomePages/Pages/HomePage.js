import React from "react";
import { View, Picker, ScrollView } from "react-native";

import { Appbar, Button, Card, TextInput } from "react-native-paper";

import homeStyles from "../Styles/HomePageStyles";

export default class HomePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      position: 0.0,
      roadState: 0.0,
      temperature: 0
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
      <ScrollView>
        <Appbar.Header>
          <Appbar.Content title="Accueil" subtitle="Lancer une activité" />
        </Appbar.Header>
        <View>
          <Card style={homeStyles.homeCard}>
            <Card.Title
              title="Position"
              subtitle="Sélectionnez votre position"
            />
            <Card.Content>
              <Picker
                selectedValue={this.state.position}
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
                selectedValue={this.state.roadState}
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
              onPress={() => console.log("PRESSED !")}
            >
              Sauvegarder
            </Button>
          </Card>
        </View>
      </ScrollView>
    );
  }
}
