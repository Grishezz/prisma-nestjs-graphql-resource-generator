import camelcase from 'camelcase';
import { exec } from 'child_process';
import { readFileSync } from 'fs';
import * as util from 'util';

// doesn't work anymore
// import * as entities from '../prisma/generated/json-schema.json';

interface JsonPrismaSchemaFile {
  definitions;
}

const entities: JsonPrismaSchemaFile = JSON.parse(
  readFileSync("prisma/generated/json-schema.json", "utf8")
);

const prismaEntities = Object.entries(entities.definitions).map((e) => e[0]);

const execPromise = util.promisify(exec);

const ex = async () => {
  for (const entity of prismaEntities) {
    await execPromise("npm run gm models/" + camelcase(entity));
  }
};

ex();
