import { runner } from "node-pg-migrate";
import { join } from "node:path";
import database from "infra/database.js";

const defaultMigrationOptions = {
  dryRun: true,
  dir: join("infra", "migrations"),
  direction: "up",
  verbose: true,
  migrationsTable: "pgmigrations"
};

async function listPendindMigrations() {
  let dbClient;

  try {
    dbClient = await database.getNewClient();

    const pendingMigrations = await runner({
      ...defaultMigrationOptions,
      dbClient
    });
    return pendingMigrations;
  } finally {
    await dbClient?.end();
  }
}

async function runPendingMigrations() {
  let dbClient;

  try {
    dbClient = await database.getNewClient();

    const migratedMigrations = await runner({
      ...defaultMigrationOptions,
      dbClient,
      dryRun: false
    });

    return migratedMigrations;
  } finally {
    await dbClient?.end();
  }
}

const migrator = {
  listPendindMigrations,
  runPendingMigrations
};

export default migrator;
