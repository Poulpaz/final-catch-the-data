import React from "react";

import DialogInput from "react-native-dialog-input";

export default class DialogInputActivity extends React.Component {
  render() {
    return (
      <DialogInput
        isDialogVisible={this.props.visibility}
        title={"Terminer l'activité"}
        message={"Voulez-vous arrêter l'activité en cours ?"}
        hintInput={"Titre de l'activité"}
        submitText={"Enregistrer"}
        cancelText={"Annuler"}
        submitInput={this.props.submit}
        closeDialog={this.props.close}
      ></DialogInput>
    );
  }
}
