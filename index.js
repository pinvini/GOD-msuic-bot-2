const { Client } = require("discord.js");
const ytdl = require("ytdl-core");
const PREFIX = "2!";

const client = new Client({ disableEveryone: true });

client.on("ready", () => {
  console.log("yay, ready");
  client.user.setActivity("by. spookvin#6516");
}) |
  client.on("message", async message => {
    if (message.author.bot) return;
    if (!message.content.startsWith(PREFIX)) return;

    const args = message.content.substring(PREFIX.length).split(" ");

    if (message.content.startsWith(`${PREFIX}play`)) {
      if (!message.member.hasPermission("ADMINISTRATOR"))
        return message.channel.send("You don't have permission to do that");
      const voiceChannel = message.member.voice.channel;
      if (!voiceChannel)
        return message.channel.send("You need to be in voice channel");
      const permissions = voiceChannel.permissionsFor(message.client.user);
      if (!permissions.has("CONNECT"))
        return message.channel.send(
          "I don't have permission to join the voice channel"
        );
      if (!permissions.has("SPEAK"))
        return message.channel.send(
          "I don't have permission to speak in the voice channel"
        );

      try {
        var connection = await voiceChannel.join();
      } catch (error) {
        console.log(`There was an error connecting voice channel: ${error}`);
        return message.channel.send(
          "There was an error connecting voice channel"
        );
      }

      const dispatcher = connection
        .play(ytdl(args[1]))
        .on("finish", () => {
          voiceChannel.leave();
        })
        .on("error", error => {
          console.log(error);
        });
      dispatcher.setVolumeLogarithmic(5 / 5);
    } else if (message.content.startsWith(`${PREFIX}stop`)) {
      if (!message.member.hasPermission("ADMINISTRATOR"))
        return message.channel.send("You don't have permission to do that");
      if (!message.member.voice.channel)
        return message.channel.send(
          "You need to be in voice channel to stop the music"
        );
      message.member.voice.channel.leave();
      return undefined;
    }
  });

client.login(process.env.TOKEN);
