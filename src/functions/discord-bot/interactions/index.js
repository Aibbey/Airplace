import express from 'express';
import {
    verifyKeyMiddleware,
    InteractionType,
    InteractionResponseType,
    InteractionResponseFlags,
    MessageComponentTypes,
} from 'discord-interactions';
import { getSecret } from './utils/secrets_helper.js';
import { registerCommands } from './utils/discord.js';
import { PubSub } from '@google-cloud/pubsub';
import { handleDrawPixelCommand, ALL_COMMANDS } from './commands.js';

let cachedAppId = null;
let cachedPublicKey = null;
let cachedToken = null;

await getSecret("discord-app-id").then((key) => {
    cachedAppId = key;
}).catch((error) => {
    console.error('Failed to initialize app id:', error);
});

await getSecret("discord-public-key").then((key) => {
    cachedPublicKey = key;
}).catch((error) => {
    console.error('Failed to initialize public key:', error);
});

await getSecret("discord-token").then((key) => {
    cachedToken = key;
}).catch((error) => {
    console.error('Failed to initialize token:', error);
});

registerCommands(cachedAppId, cachedToken, ALL_COMMANDS);

const pubSubClient = new PubSub();

const app = express();

app.post('/', verifyKeyMiddleware(cachedPublicKey), (req, res) => {
    try {
        const { type, data } = req.body || {};

        if (type === InteractionType.PING)
            return res.json({ type: InteractionResponseType.PONG });

        if (type === InteractionType.APPLICATION_COMMAND) {
            const { name, options } = data || {};

            if (name === "airplace") {
                const subcommand = options?.[0];
                const subcommandName = subcommand?.name;

                switch (subcommandName) {
                    case 'draw':
                        const drawOptions = subcommand.options || [];
                        const x = drawOptions.find(opt => opt.name === 'x')?.value;
                        const y = drawOptions.find(opt => opt.name === 'y')?.value;
                        const color = drawOptions.find(opt => opt.name === 'color')?.value;

                        return handleDrawPixelCommand(pubSubClient, x, y, color);

                    case 'canvas':
                        return res.json({
                            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
                            data: {
                                flags: InteractionResponseFlags.IS_COMPONENTS_V2,
                                components: [
                                    {
                                        type: MessageComponentTypes.TEXT_DISPLAY,
                                        content: `Getting canvas state...`
                                    }
                                ]
                            }
                        });

                    case 'admin':
                        const adminAction = subcommand.options?.[0]?.name;

                        switch (adminAction) {
                            case 'start':
                                return res.json({
                                    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
                                    data: {
                                        flags: InteractionResponseFlags.IS_COMPONENTS_V2,
                                        components: [
                                            {
                                                type: MessageComponentTypes.TEXT_DISPLAY,
                                                content: `Starting game...`
                                            }
                                        ]
                                    }
                                });

                            case 'pause':
                                return res.json({
                                    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
                                    data: {
                                        flags: InteractionResponseFlags.IS_COMPONENTS_V2,
                                        components: [
                                            {
                                                type: MessageComponentTypes.TEXT_DISPLAY,
                                                content: `Pausing game...`
                                            }
                                        ]
                                    }
                                });

                            case 'reset':
                                return res.json({
                                    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
                                    data: {
                                        flags: InteractionResponseFlags.IS_COMPONENTS_V2,
                                        components: [
                                            {
                                                type: MessageComponentTypes.TEXT_DISPLAY,
                                                content: `Resetting game...`
                                            }
                                        ]
                                    }
                                });

                            case 'snapshot':
                                return res.json({
                                    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
                                    data: {
                                        flags: InteractionResponseFlags.IS_COMPONENTS_V2,
                                        components: [
                                            {
                                                type: MessageComponentTypes.TEXT_DISPLAY,
                                                content: `Taking snapshot...`
                                            }
                                        ]
                                    }
                                });
                            default:
                                console.log('Unknown admin action:', adminAction);
                                return res.status(400).json({ error: 'unknown admin action' });
                        }
                    default:
                        console.log('Unknown subcommand:', subcommand);
                        return res.status(400).json({ error: 'unknown subcommand' });
                }
            }
            console.log('Unknown command:', command);
            return res.status(400).json({ error: 'unknown command' });
        }
        console.log('Unknown interaction type:', type);
        return res.status(400).json({ error: 'unknown interaction type' });
    } catch (error) {
        console.error('Error processing request:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

const port = parseInt(process.env.PORT) || 8080;
app.listen(port, () => { console.log(`discord-bot-interactions: listening on port ${port}`); });
