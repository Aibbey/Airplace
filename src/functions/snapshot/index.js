import { Storage } from '@google-cloud/storage';
import functions from '@google-cloud/functions-framework';
import { fetchAllPixels } from './firestore.js';
import { normalizePixels, drawSnapshot, resetSubscriptionBacklog } from './utils.js';

const storage = new Storage();
const BUCKET = process.env.SNAPSHOT_BUCKET;
const SNAPSHOT_NAME = process.env.SNAPSHOT_NAME;
const CANVAS_WIDTH = Number(process.env.CANVAS_WIDTH || 100);
const CANVAS_HEIGHT = Number(process.env.CANVAS_HEIGHT || 100);

functions.http('snapshot-make', async (req, res) => {
  try {
    const bucket = BUCKET;

    let filename;
    if (Buffer.from(req.body.message.data, 'base64').toString('utf-8') == "schedule") {
      console.log('start creating scheduled file');
      filename = SNAPSHOT_NAME;
    } else {
      console.log('[snapshot-make] start reading message');
      const userId = Buffer.from(req.body.message.data, 'base64').toString('utf-8');
      filename = `snapshot-${userId}.png`;
    }
    console.log('[snapshot-make] start fetching pixel');
    const rawPixels = await fetchAllPixels();
    try {
      console.info('[snapshot-make] rawPixels:', rawPixels);
    } catch (err) {
      console.warn('[snapshot-make] Failed to log rawPixels', err);
    }
    const pixels = normalizePixels(rawPixels);
    try {
      console.info('[snapshot-make] normalized pixels:', pixels);
    } catch (err) {
      console.warn('[snapshot-make] Failed to log normalized pixels', err);
    }
    const buffer = drawSnapshot(pixels, { width: CANVAS_WIDTH, height: CANVAS_HEIGHT, tileSize: 1, background: '#FFFFFF' });
    console.log('[snapshot-make] start writing in bucket');
    const bucketRef = storage.bucket(bucket);
    const file = bucketRef.file(filename);
    await file.save(buffer, { contentType: 'image/png' });
    if (filename == 'snapshot-schedule.png') {
      console.log('[snapshot-make] resetting subscription backlog');
      await resetSubscriptionBacklog();
    }
    return res.status(201).send();
  } catch (err) {
    console.error('build-image error', err);
    return res.status(500).send('internal error');
  }
});


