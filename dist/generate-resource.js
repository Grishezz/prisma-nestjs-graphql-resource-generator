"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const prettier_1 = require("prettier");
const yargs = __importStar(require("yargs"));
const red = "\x1b[31m";
const res = "\x1b[0m";
const builder = (command) => command.positional("modelPath", { describe: "Domain Models Path" });
const handler = ({ modelPath, }) => console.log("Input was: " + modelPath);
const params = yargs.command("* <modelPath>", false, builder, handler).parse();
const paramPath = String(process.argv[2]).split("/");
const modulesDir = ["src", ...paramPath.slice(0, -1)];
const entityName = paramPath.slice(-1)[0];
const ResourceName = entityName[0].toUpperCase() + entityName.slice(1, entityName.length);
const resourceName = entityName[0].toLowerCase() + entityName.slice(1, entityName.length);
const resourcename = entityName.toLowerCase();
const realPath = [...modulesDir, resourcename];
const files = [
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
function makeFolder() {
    (0, fs_1.mkdir)(realPath.join("/"), (err) => {
        if (err) {
            return console.error(err);
        }
    });
}
function editAndCopyFiles() {
    files.forEach((f) => {
        (0, fs_1.readFile)(f.src.join("/"), "utf8", (err, data) => {
            if (err) {
                return console.error(err);
            }
            const result = data
                .replace(/reSource/g, resourceName)
                .replace(/Resource/g, ResourceName)
                .replace(/resource/g, resourcename);
            (0, fs_1.writeFile)(f.dst.join("/"), result, "utf8", (err) => {
                if (err) {
                    return console.error(err);
                }
            });
        });
    });
}
async function addModuleToMotherModule() {
    const moduleFileName = await getFirstModuleFileInFolder(modulesDir).catch((e) => {
        throw new Error("No module file path found!");
    });
    const moduleFilePath = [...modulesDir, moduleFileName].join("/");
    (0, fs_1.readFile)(moduleFilePath, "utf8", (err, file) => {
        if (err)
            throw new Error("Could not read module file");
        let result = file
            .replace(/\n@Module\({/g, `import { ${ResourceName}Module } from './${resourcename}/${resourcename}.module';
      
      @Module({`)
            .replace(/imports: \[/g, `imports: [\n
        ${ResourceName}Module,`)
            .replace(/exports: \[/g, `exports: [\n
        ${ResourceName}Module,`);
        result = (0, prettier_1.format)(result, {
            parser: "typescript",
            singleQuote: true,
        });
        (0, fs_1.writeFile)(moduleFilePath, result, "utf8", (err) => {
            if (err) {
                return console.log(err);
            }
        });
    });
}
function getFirstModuleFileInFolder(path) {
    return new Promise((resolve, reject) => {
        (0, fs_1.readdir)(path.join("/"), (err, fileNames) => {
            if (err) {
                reject();
                throw new Error("Could not find any files in folder " + path.join("/"));
            }
            resolve(fileNames.find((fileName) => fileName.search(".module.ts") !== -1));
        });
    });
}
if (process.argv.length !== 3) {
    console.error(red + "Use of this command is: mpn run gm directoy/entityName" + res);
    console.log("Process args now are: \n" + process.argv.join("\n"));
}
else {
    makeFolder();
    editAndCopyFiles();
    addModuleToMotherModule();
}
//# sourceMappingURL=generate-resource.js.map