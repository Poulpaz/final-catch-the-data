import { SQLite } from "expo-sqlite";
import { BaseModel, types } from "expo-sqlite-orm";

export default class ActivityModel extends BaseModel {
  constructor(obj) {
    super(obj);
  }

  static get database() {
    return async () => SQLite.openDatabase("database.db");
  }

  static get tableName() {
    return "activities";
  }

  static get columnMapping() {
    return {
      id: { type: types.INTEGER, primary_key: true },
      title: { type: types.TEXT, not_null: true },
      distanceTravelled: { type: types.FLOAT, default: () => 0.000 },
      denivele: { type: types.INTEGER, default: () => 0 },
      weight: { type: types.INTEGER, default: () => 0 },
      height: { type: types.INTEGER, default: () => 0 },
      time: { type: types.INTEGER, default: () => 0 }
    };
  }
}
