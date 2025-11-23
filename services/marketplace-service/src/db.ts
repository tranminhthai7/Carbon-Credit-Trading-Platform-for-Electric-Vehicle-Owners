// db.ts
import { DataSource } from "typeorm";

export let AppDataSource: DataSource;

export function setAppDataSource(ds: DataSource) {
  AppDataSource = ds;
}