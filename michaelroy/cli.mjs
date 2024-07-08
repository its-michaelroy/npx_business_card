#!/usr/bin/env node

import { renderCard, renderJson, handleAction } from "./index.mjs";
import minimist from "minimist";
import clear from "clear";

const options = {
  alias: { json: "j" },
};
const argv = minimist(process.argv.slice(2), options);

clear();

if (argv.json) {
  console.log(renderJson());
} else {
  console.log(renderCard());
  handleAction();
}
