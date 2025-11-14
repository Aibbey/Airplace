

export async function publishEvent(pubSubClient, topicName, data) {
    try {
        const message = {
            timestamp: new Date().toISOString(),
            data
        };
        const dataBuffer = Buffer.from(JSON.stringify(message));
        const messageId = await pubSubClient.topic(topicName).publishMessage({ data: dataBuffer });
        console.log(`Message ${messageId} published to ${topicName}`);
        return messageId;
    } catch (error) {
        console.error('Error publishing message:', error);
        throw error;
    }
}

export async function handleDrawPixelCommand(pubSubClient, x, y, color) {
    publishEvent(pubSubClient, "pixel.draw", { x, y, color });
    return res.json({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
            flags: InteractionResponseFlags.IS_COMPONENTS_V2,
            components: [
                {
                    type: MessageComponentTypes.TEXT_DISPLAY,
                    content: `Drawing pixel at (${x}, ${y}) with color ${color}`
                }
            ]
        }
    });
}

const AIRPLACE_COMMAND = {
    name: 'airplace',
    description: 'Airplace game commands',
    type: 1,
    integration_types: [0, 1],
    contexts: [0, 1, 2],
    options: [
        {
            type: 1,
            name: 'draw',
            description: 'Draw a pixel on the canvas',
            options: [
                {
                    type: 4,
                    name: 'x',
                    description: 'X coordinate',
                    required: true,
                    min_value: 0,
                    max_value: 999
                },
                {
                    type: 4,
                    name: 'y',
                    description: 'Y coordinate',
                    required: true,
                    min_value: 0,
                    max_value: 999
                },
                {
                    type: 3,
                    name: 'color',
                    description: 'Hex color (e.g., #FF0000)',
                    required: true
                }
            ]
        },
        {
            type: 1,
            name: 'canvas',
            description: 'Get the current canvas state'
        },
        {
            type: 2,
            name: 'admin',
            description: 'Admin commands',
            options: [
                {
                    type: 1,
                    name: 'start',
                    description: 'Start the game'
                },
                {
                    type: 1,
                    name: 'pause',
                    description: 'Pause the game'
                },
                {
                    type: 1,
                    name: 'reset',
                    description: 'Reset the game'
                },
                {
                    type: 1,
                    name: 'snapshot',
                    description: 'Take a snapshot of the canvas'
                }
            ]
        }
    ]
};

export const ALL_COMMANDS = [AIRPLACE_COMMAND];
