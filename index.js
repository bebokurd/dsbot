import { Client, GatewayIntentBits, Collection, REST, Routes, InteractionType } from 'discord.js';
import { DISCORD_TOKEN } from './config/config.js';
import { commands } from './commands/index.js';
import logger from './utils/logger.js';
import { checkRateLimit } from './utils/rateLimiter.js';
import dotenv from 'dotenv';
dotenv.config();

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.commands = new Collection();

for (const command of commands) {
  client.commands.set(command.data.name, command);
}

client.once('ready', () => {
  logger.info(`Logged in as ${client.user.tag}`);
});

client.on('interactionCreate', async interaction => {
  if (interaction.type !== InteractionType.ApplicationCommand) return;
  const command = client.commands.get(interaction.commandName);
  if (!command) return;
  // Rate limiting
  if (!checkRateLimit(interaction.user.id)) {
    await interaction.reply({ content: 'You are being rate limited. Try again later.', ephemeral: true });
    return;
  }
  try {
    await command.execute(interaction);
  } catch (error) {
    logger.error(`Command execution error: ${error}`);
    if (interaction.deferred || interaction.replied) {
      await interaction.editReply('There was an error executing this command.');
    } else {
      await interaction.reply({ content: 'There was an error executing this command.', ephemeral: true });
    }
  }
});

// Register slash commands
async function registerCommands() {
  const rest = new REST({ version: '10' }).setToken(DISCORD_TOKEN);
  const commandData = commands.map(cmd => cmd.data.toJSON());
  try {
    logger.info('Started refreshing application (/) commands.');
    await rest.put(
      Routes.applicationCommands((await client.application?.fetch())?.id || process.env.CLIENT_ID),
      { body: commandData },
    );
    logger.info('Successfully reloaded application (/) commands.');
  } catch (error) {
    logger.error(`Error registering commands: ${error}`);
  }
}

client.login(DISCORD_TOKEN).then(registerCommands); 