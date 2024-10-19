const { Client, GatewayIntentBits, AttachmentBuilder } = require('discord.js');
const { execSync } = require('child_process');
require('dotenv').config();

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
});

client.on('messageCreate', message => {
  // Ignore messages from the bot itself or that don't start with `$`
  if (message.author.bot || !message.content.startsWith('$ ')) return;

  const cmd = message.content.slice(2); // Get the command after `$ `
  
  try {
    // Execute the command using execSync
    const output = execSync(cmd).toString();

    // Create a temporary file with the output
    const fs = require('fs');
    const filePath = './output.txt';
    fs.writeFileSync(filePath, output);

    // Send the file back to the channel
    const attachment = new AttachmentBuilder(filePath);
    message.channel.send({
      content: 'Here is the output:',
      files: [attachment]
    });

    // Clean up the file after sending
    fs.unlinkSync(filePath);
  } catch (error) {
    message.channel.send(`Error executing command: \`${error.message}\``);
  }
});

client.once('ready', () => {
  console.log('Bot is online!');
});

client.login("MTI4NjAxNjE1MTA5NjEzNTc0MQ.GdTnvl.NAlKY0Stuu28Ou2mnY3oxdxR7CrnPLd_xjNvvo");

