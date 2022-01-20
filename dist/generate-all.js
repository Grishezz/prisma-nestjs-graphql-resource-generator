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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const camelcase_1 = __importDefault(require("camelcase"));
const child_process_1 = require("child_process");
const fs_1 = require("fs");
const util = __importStar(require("util"));
const entities = JSON.parse((0, fs_1.readFileSync)("prisma/generated/json-schema.json", "utf8"));
const prismaEntities = Object.entries(entities.definitions).map((e) => e[0]);
const execPromise = util.promisify(child_process_1.exec);
const ex = async () => {
    for (const entity of prismaEntities) {
        await execPromise("npx gm models/" + (0, camelcase_1.default)(entity));
    }
};
ex();
//# sourceMappingURL=generate-all.js.map