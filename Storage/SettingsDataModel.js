import { SQLite } from "expo-sqlite";
import { BaseModel, types } from "expo-sqlite-orm";

export default class SettingsDataModel extends BaseModel {
  constructor(obj) {
    super(obj);
  }

  static get database() {
    return async () => SQLite.openDatabase("database.db");
  }

  static get tableName() {
    return "settingsdatamodel";
  }

  static get columnMapping() {
    return {
      id: { type: types.INTEGER, primary_key: true },
      firstname: { type: types.TEXT, default: () => "" },
      lastname: { type: types.TEXT, default: () => "" },
      birthDate: { type: types.TEXT, not_null: true },
      friction: { type: types.INTEGER, default: () => 0 },
      height: { type: types.INTEGER, default: () => 0 },
      weight: { type: types.INTEGER, default: () => 0 },
      fullWeight: { type: types.INTEGER, default: () => 0 }
    };
  }
}
