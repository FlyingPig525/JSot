const fs = require("node:fs");
const path = require("node:path");
const {
  Client,
  Collection,
  Events,
  GatewayIntentBits,
  Guild,
  GuildMemberManager,
} = require("discord.js");
const { token } = require("./config.json");
const sftp = require("ssh2-sftp-client");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.commands = new Collection();
const foldersPath = path.join(__dirname, "commands");
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
  const commandsPath = path.join(foldersPath, folder);
  const commandFiles = fs
    .readdirSync(commandsPath)
    .filter((file) => file.endsWith(".js"));
  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    if ("data" in command && "execute" in command) {
      client.commands.set(command.data.name, command);
    } else {
      console.log(
        `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
      );
    }
  }
}

class SFTPClient {
  constructor() {
    this.client = new sftp();
  }

  async connect(options) {
    console.log(`Connecting to ${options.host}:${options.port}`);
    try {
      await this.client.connect(options);
    } catch (err) {
      console.log("Failed to connect:", err);
    }
  }

  async disconnect() {
    await this.client.end();
  }

  async downloadFile(remoteFile, localFile) {
    console.log(`Downloading ${remoteFile} to ${localFile} ...`);
    try {
      await this.client.get(remoteFile, localFile);
    } catch (err) {
      console.error("Downloading failed:", err);
      return;
    }
    console.log(`Download complete`);
  }
}

// async function start() {
//   const sftpClient = new SFTPClient();
//   await sftpClient.connect({
//     host: "de-prem-01.optik.host",
//     port: "2022",
//     username: "yiavvuemmeau6prgzdqj.d7fd8b5d",
//     password: "TRrX3cDyR25DzPsd159m",
//   });
//   await sftpClient.downloadFile("./res.json", "./conquestDB/res.json");
//   await sftpClient.disconnect();
// }

// start();

client.once(Events.ClientReady, () => {
  console.log("Ready!");
  // console.log(global.DB.other.Clay)
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);

  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({
        content: "There was an error while executing this command!",
        ephemeral: true,
      });
    } else {
      await interaction.reply({
        content: "There was an error while executing this command!",
        ephemeral: true,
      });
    }
  }
});

client.on(Events.MessageCreate, async (message) => {
  console.log(
    `'${message.content}' was sent by ${message.author.username}, with an ID of ${message.author.id} in channel ${message.channel}`
  );
  if (message.channelId == 1059280019995775046 && message.webhookId != null) {
    client.users
      .fetch("404631695703146501")
      .then((result1) => {
        result1.send(`${message.content}, ${message.embeds}`);
        console.log(
          `Successfully sent ${message.content} to and/or ${message.embeds} ${result1.username}`
        );
      })
      .catch((error) => {
        console.error(
          `Could not send ${message.content} to and/or ${message.embeds} ${result1.username}`
        );
      });
    client.users
      .fetch("720699418457931897")
      .then((result1) => {
        result1.send(`${message.content}, ${message.embeds}`);
        console.log(
          `Successfully sent ${message.content} and/or ${message.embeds} to ${result1.username}`
        );
      })
      .catch((error) => {
        console.error(
          `Could not send ${message.content} and/or ${message.embeds} to ${result1.username}`
        );
      });
  }
});

client.login(token);
