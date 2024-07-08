// ./index.mjs

import boxen from "boxen";
import chalk from "chalk";
import ora from "ora";
import cliSpinners from "cli-spinners";
import open from "open";
import fs from "fs";
import path from "path";
import { File } from "megajs";
import data from "./lib/data.js";

const renderOpts = {
  dashColor: "cyan",
  keysColor: "blue",
  stringColor: "white",
};

const renderCard = () => {
  const content = {
    name: chalk.bold.green("                    Michael Roy"),
    handle: chalk.white("@michaelroy"),
    work: `${chalk.white("Software Engineer at")} ${chalk.hex("#2b82b2").bold(data.work)}`,
    github: chalk.gray("https://github.com/") + chalk.green(data.github),
    linkedin:
      chalk.gray("https://linkedin.com/in/") + chalk.blue("michaelroy91"),
    web: chalk.cyan(data.urls[0]),
    npx: chalk.red("npx") + " " + chalk.white("michaelroy"),

    labelWork: chalk.white.bold("       Work:"),
    labelGitHub: chalk.white.bold("     GitHub:"),
    labelLinkedIn: chalk.white.bold("   LinkedIn:"),
    labelWeb: chalk.white.bold("        Web:"),
    labelCard: chalk.white.bold("       Card:"),
  };

  const output = boxen(
    [
      `${content.name}`,
      ``,
      `${content.labelWork}  ${content.work}`,
      ``,
      `${content.labelGitHub}  ${content.github}`,
      `${content.labelLinkedIn}  ${content.linkedin}`,
      `${content.labelWeb}  ${content.web}`,
      ``,
      `${content.labelCard}  ${content.npx}`,
      ``,
      `${chalk.italic("I'm currently on the lookout for exciting new opportunities,")}`,
      `${chalk.italic("and my inbox is always open for questions, greetings, or")}`,
      `${chalk.italic("just a friendly chat. I will try my best to get back to you,")}`,
      `${chalk.italic("unless I'm busy weaving magic in the digital crafting realm.")}`,
    ].join("\n"),
    {
      margin: 1,
      float: "center",
      padding: 1,
      borderStyle: "single",
      borderColor: "green",
    },
  );

  return output;
};

const renderJson = () => {
  return JSON.stringify(data, null, 2);
};

const handleAction = async () => {
  const inquirer = await import("inquirer");

  const prompt = inquirer.createPromptModule();

  const questions = [
    {
      type: "list",
      name: "action",
      message: "What would you like to do?",
      choices: [
        {
          name: `Send me an ${chalk.green.bold("email")}?`,
          value: () => {
            open(`mailto:${data.email}`);
            console.log(
              "\nDone, see you soon in the virtual world of inboxes!\n",
            );
          },
        },
        {
          name: `Download my ${chalk.magentaBright.bold("Resume")}?`,
          value: async () => {
            const loader = ora({
              text: "Downloading Resume",
              spinner: cliSpinners.material,
            }).start();
            try {
              const file = File.fromURL(data.resumeUrl);
              const stream = file.download();
              const filePath = path.join(
                process.cwd(),
                "michael-roy-resume.pdf",
              );
              const writer = fs.createWriteStream(filePath);
              stream.pipe(writer);
              writer.on("finish", () => {
                console.log(`\nResume Downloaded at ${filePath} \n`);
                open(filePath);
                loader.stop();
              });
              writer.on("error", (err) => {
                console.error("Error downloading the resume:", err);
                loader.stop();
              });
            } catch (error) {
              console.error("Error downloading the resume:", error);
              loader.stop();
            }
          },
        },
        {
          name: `Schedule a ${chalk.redBright.bold("Meeting")}?`,
          value: () => {
            open(data.calendly);
            console.log("\n See you at the meeting! \n");
          },
        },
        {
          name: "Just quit and exit.",
          value: () => {
            console.log("Até logo e não se esqueça de trazer café! ☕😁\n");
          },
        },
      ],
    },
  ];

  const answer = await prompt(questions);
  answer.action();
};

export { renderCard, renderJson, handleAction };
