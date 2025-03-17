if (process.env.PORT) {
  console.log(`Port detected: ${process.env.PORT}, but not needed for Discord bot.`);
}
require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
});

const adminRoleID = {}; // Store admin roles for each server
const vouches = {}; // Store vouches for each user

client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;

  const args = message.content.trim().split(/\s+/);

  // Admin Commands
  if (args[0] === 'S!ConfigRole') {
    if (!message.member.permissions.has('Administrator')) return;
    const role = message.mentions.roles.first();
    if (!role) return message.reply('Please mention a role.');

    adminRoleID[message.guild.id] = role.id;
    message.reply(`Admin role set to ${role.name}.`);
  }

  if (args[0] === 'S!addvouch') {
    if (!message.member.roles.cache.has(adminRoleID[message.guild.id])) return message.reply('You do not have permission.');

    const user = message.mentions.users.first();
    const count = parseInt(args[2]) || 1;
    if (!user) return message.reply('Mention a user.');

    vouches[user.id] = (vouches[user.id] || 0) + count;
    message.reply(`${user.tag} now has ${vouches[user.id]} vouches.`);
  }

  if (args[0] === 'S!removevouch') {
    if (!message.member.roles.cache.has(adminRoleID[message.guild.id])) return message.reply('You do not have permission.');

    const user = message.mentions.users.first();
    const count = parseInt(args[2]) || 1;
    if (!user || !vouches[user.id]) return message.reply('User not found.');

    vouches[user.id] = Math.max((vouches[user.id] || 0) - count, 0);
    message.reply(`${user.tag} now has ${vouches[user.id]} vouches.`);
  }

  // Normal User Command
  if (args[0] === '+vouch') {
    const user = message.mentions.users.first();
    const reason = args.slice(2).join(' ');
    if (!user || !reason) return message.reply('Invalid format. Use: +vouch @user [reason]');

    vouches[user.id] = (vouches[user.id] || 0) + 1;
    message.reply(`Vouched for ${user.tag} with reason: ${reason}. Total vouches: ${vouches[user.id]}`);
  }
});

client.login(process.env.TOKEN);
const express = require('express');
const app = express();

app.get('/', (req, res) => res.send('Bot is running!'));

const port = process.env.PORT || 3000; // Render looks for PORT
app.listen(port, () => console.log(`Listening on port ${port}`));