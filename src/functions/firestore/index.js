import express from 'express';
import { initializeApp, applicationDefault } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { randomUUID } from 'crypto';

const logger = console;

const firestoreapp = initializeApp({
  credential: applicationDefault(),
});

const db = getFirestore(firestoreapp, 'serverless-epitech-firestore');
const app = express();
app.use(express.json());

app.post('/', async (req, res) => {
  try {
    logger.log('Requête reçue pour addUser');
    logger.log('Body:', JSON.stringify(req.body));

    const { name, email } = req.body;

    if (!name || !email) {
      logger.warn('Validation échouée: name ou email manquant');
      return res.status(400).send("Missing name or email");
    }

    const existingQuery = db.collection('users')
      .where('email', '==', email)
      .limit(1);

    const existingSnap = await existingQuery.get();
    if (!existingSnap.empty) {
      logger.warn('Conflit: utilisateur existant avec le même email', { email });
      return res.status(409).send('User with same email already exists');
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
    res.status(500).send("internal error");
  }
});

const port = 8080;
app.listen(port, () => {
  logger.log(`app: listening on port ${port}`);
});

export default app;
