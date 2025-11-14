import { initializeApp, applicationDefault } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { randomUUID } from 'crypto';

const logger = console;

initializeApp({
  credential: applicationDefault()
});

const db = getFirestore();

export async function addUser(req, res) {
  try {
    logger.log('Requête reçue pour addUser');
    logger.log('Body:', JSON.stringify(req.body));

    const { name, email } = req.body;

    if (!name || !email) {
      logger.warn('Validation échouée: name ou email manquant');
      return res.status(400).send("Missing name or email");
    }

    const existingQuery = db.collection('users')
      .where('name', '==', name)
      .where('email', '==', email)
      .limit(1);

    const existingSnap = await existingQuery.get();
    if (!existingSnap.empty) {
      logger.warn('Conflit: utilisateur existant avec même name et email', { name, email });
      return res.status(409).send('User with same name and email already exists');
    }

    const uid = randomUUID();

    await db.collection('users').doc(uid).set({
      name,
      email,
      createdAt: new Date()
    });

    logger.log(`user added: ${uid}`);
    res.status(201).send({ message: 'User stored', uid });

  } catch (err) {
    logger.error("Error addUser:", err);
    logger.error("Error details:", err.message);
    logger.error("Stack:", err.stack);
    res.status(500).send("Error");
  }
}

export async function addPixel(req, res) {
  try {
    logger.log('Requête reçue pour addPixel');
    logger.log('Body:', JSON.stringify(req.body));

    const { color, position, user } = req.body;

    if (!color || !position || position.x === undefined || position.y === undefined || !user) {
      logger.warn('❌ Validation échouée: champs manquants');
      return res.status(400).send("Missing pixel fields (color, position.x, position.y, user)");
    }

    const payload = {
      color,
      position: {
        x: position.x,
        y: position.y
      },
      user,
      timestamp: new Date()
    };

    const docRef = await db.collection("pixels").add(payload);

    logger.log(`Pixel added with ID: ${docRef.id}`);
    logger.log('Pixel data:', JSON.stringify(payload));

    res.status(200).send({
      message: "Pixel stored",
      pixelId: docRef.id
    });

  } catch (err) {
    logger.error("Error addPixel:", err);
    logger.error("Error details:", err.message);
    logger.error("Stack:", err.stack);
    res.status(500).send("Error");
  }
}
