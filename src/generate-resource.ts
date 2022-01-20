import { mkdir, readdir, readFile, writeFile } from 'fs';
import { format } from 'prettier';
import * as yargs from 'yargs';

const red = "\x1b[31m";
const res = "\x1b[0m";

const builder: yargs.CommandBuilder = (command) =>
  command.positional("modelPath", { describe: "Domain Models Path" });

const handler: (args: yargs.ArgumentsCamelCase<{}>) => void | Promise<void> = ({
  modelPath,
}) => console.log("Input was: " + modelPath);

const params = yargs.command("* <modelPath>", false, builder, handler).parse();

const paramPath = String(process.argv[2]).split("/");
const modulesDir = ["src", ...paramPath.slice(0, -1)];
const entityName = paramPath.slice(-1)[0];

const ResourceName =
  entityName[0].toUpperCase() + entityName.slice(1, entityName.length);
const resourceName =
  entityName[0].toLowerCase() + entityName.slice(1, entityName.length);
const resourcename = entityName.toLowerCase();

const realPath = [...modulesDir, resourcename];

const files: Array<{ src: Array<string>; dst: Array<string> }> = [
  {
    src: [
      "resource-generator",
      "_boilerplate",
      "resource",
      "resource.module.boilerplate",
    ],
    dst: ["src", ...paramPath, `${resourcename}.module.ts`],
  },
  {
    src: [
      "resource-generator",
      "_boilerplate",
      "resource",
      "resource.resolver.boilerplate",
    ],
    dst: ["src", ...paramPath, `${resourcename}.resolver.ts`],
  },
  {
    src: [
      "resource-generator",
      "_boilerplate",
      "resource",
      "resource.service.boilerplate",
    ],
    dst: ["src", ...paramPath, `${resourcename}.service.ts`],
  },
  {
    src: [
      "resource-generator",
      "_boilerplate",
      "resource",
      "resource.service.spec.boilerplate",
    ],
    dst: ["src", ...paramPath, `${resourcename}.service.spec.ts`],
  },
  {
    src: [
      "resource-generator",
      "_boilerplate",
      "resource",
      "resource.resolver.spec.boilerplate",
    ],
    dst: ["src", ...paramPath, `${resourcename}.resolver.spec.ts`],
  },
];

// functions
function makeFolder(): void {
  mkdir(realPath.join("/"), (err) => {
    if (err) {
      return console.error(err);
    }
  });
}

function editAndCopyFiles(): void {
  files.forEach((f) => {
    readFile(f.src.join("/"), "utf8", (err, data) => {
      if (err) {
        return console.error(err);
      }
      const result = data
        .replace(/reSource/g, resourceName)
        .replace(/Resource/g, ResourceName)
        .replace(/resource/g, resourcename);

      writeFile(f.dst.join("/"), result, "utf8", (err) => {
        if (err) {
          return console.error(err);
        }
      });
    });
  });
}

async function addModuleToMotherModule() {
  const moduleFileName = await getFirstModuleFileInFolder(modulesDir).catch(
    (e) => {
      throw new Error("No module file path found!");
    }
  );
  const moduleFilePath = [...modulesDir, moduleFileName].join("/");

  readFile(moduleFilePath, "utf8", (err, file) => {
    if (err) throw new Error("Could not read module file");
    let result = file
      .replace(
        /\n@Module\({/g,
        `import { ${ResourceName}Module } from './${resourcename}/${resourcename}.module';
      
      @Module({`
      )
      .replace(
        /imports: \[/g,
        `imports: [\n
        ${ResourceName}Module,`
      )
      .replace(
        /exports: \[/g,
        `exports: [\n
        ${ResourceName}Module,`
      );
    result = format(result, {
      parser: "typescript",
      singleQuote: true,
    });
    writeFile(moduleFilePath, result, "utf8", (err) => {
      if (err) {
        return console.log(err);
      }
    });
  });
}

function getFirstModuleFileInFolder(path: Array<string>) {
  return new Promise<string>((resolve, reject) => {
    readdir(path.join("/"), (err, fileNames) => {
      if (err) {
        reject();
        throw new Error("Could not find any files in folder " + path.join("/"));
      }
      resolve(
        fileNames.find((fileName) => fileName.search(".module.ts") !== -1)
      );
    });
  });
}

if (process.argv.length !== 3) {
  console.error(
    red + "Use of this command is: mpn run gm directoy/entityName" + res
  );
  console.log("Process args now are: \n" + process.argv.join("\n"));
} else {
  makeFolder();
  editAndCopyFiles();
  addModuleToMotherModule();
}
