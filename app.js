const { Client, GatewayIntentBits, AttachmentBuilder } = require('discord.js');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
});

// Function to remove ANSI escape codes
function stripColorCodes(text) {
  return text.replace(/\x1B\[[0-9;]*[A-Za-z]/g, '');
}

client.on('messageCreate', message => {
  // Ignore messages from the bot itself or that don't start with `$`
  if (message.author.bot || !message.content.startsWith('$ ')) return;

  const cmd = message.content.slice(2).trim(); // Get the command after `$ `

  try {
    // Execute the command using execSync
    const output = execSync(cmd).toString();

    // Strip color codes from the output
    const cleanedOutput = stripColorCodes(output);

    // Create a temporary file with the cleaned output
    const filePath = path.join(__dirname, 'output.txt'); // Using __dirname for absolute path

    // Write the cleaned output to the file
    fs.writeFileSync(filePath, cleanedOutput, { flag: 'w' });
    console.log(`Output written to ${filePath}`);

    // Send the file back to the channel
    const attachment = new AttachmentBuilder(filePath);
    message.channel.send({
      content: 'Here is the output:',
      files: [attachment]
    }).then(() => {
      // Clean up the file after sending
      fs.unlinkSync(filePath);
      console.log(`File ${filePath} deleted after sending.`);
    }).catch(err => {
      console.error(`Failed to send attachment: ${err.message}`);
    });
  } catch (error) {
    message.channel.send(`Error executing command: \`${error.message}\``);
    console.error(`Command execution error: ${error.message}`);
  }
});

client.once('ready', () => {
  console.log('Bot is online!');
});

client.login(process.env.DISCORD_TOKEN);



