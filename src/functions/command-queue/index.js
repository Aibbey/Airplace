import functions from '@google-cloud/functions-framework';
import { z } from 'zod';

const OptionSchema = z.object({
    name: z.string(),
    value: z.union([z.string(), z.number()]).default([]),
});

const CommandMessageSchema = z.object({
    command: z.string().min(1),
    options: z.array(OptionSchema).optional(),
});

functions.http('commandQueue', (req, res) => {
    let encodedData = req.body?.message?.data;

    if (encodedData == undefined)
        return res.status(400).send('Bad Request: No message data found');
    let decodedData = Buffer.from(encodedData, 'base64').toString('utf-8');
    try {
        let rawData = JSON.parse(decodedData);
        let data = CommandMessageSchema.parse(rawData);
        return processCommand(res, data);
    } catch (err) {
        if (err instanceof z.ZodError) {
            console.error('Validation error:', err.errors);
            return res.status(400).send(`Bad Request: ${err.errors.map(e => e.message).join(', ')}`);
        }
        console.error('Failed to parse message data as JSON:', err);
        return res.status(400).send('Bad Request: Invalid message data');
    }
});

function processCommand(res, data) {
    console.log('Processing command:', data.command);

    switch (data.command) {
        case 'view':
            break;
        case 'start':
            break;
        case 'pause':
            break;
        case 'reset':
            break;
        case 'snapshot':
            break;
        default:
            console.log('Unknown command:', data.command);
            return res.status(400).send('Bad Request: Unknown command');
    }
    return res.status(200).send('OK');
}
