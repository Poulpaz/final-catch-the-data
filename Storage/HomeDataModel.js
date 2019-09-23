import { SQLite } from "expo-sqlite";
import { BaseModel, types } from "expo-sqlite-orm";

export default class HomeDataModel extends BaseModel {
  constructor(obj) {
    super(obj);
  }

  static get database() {
    return async () => SQLite.openDatabase("database.db");
  }

  static get tableName() {
    return "homedatamodel";
  }

  static get columnMapping() {
    return {
      id: { type: types.INTEGER, primary_key: true },
      position: { type: types.FLOAT, default: () => 0 },
      roadState: { type: types.FLOAT, default: () => 0 },
      temperature: { type: types.INTEGER, default: () => 0 }
    };
  }
}
