import { SQLite } from "expo-sqlite";
import { BaseModel, types } from "expo-sqlite-orm";

export default class PowerDotModel extends BaseModel {
  constructor(obj) {
    super(obj);
  }

  static get database() {
    return async () => SQLite.openDatabase("database.db");
  }

  static get tableName() {
    return "powerdots";
  }

  static get columnMapping() {
    return {
      id: { type: types.INTEGER, primary_key: true },
      power: { type: types.FLOAT, not_null: true },
      idActivity: { type: types.INTEGER, not_null: true }
    };
  }
}
