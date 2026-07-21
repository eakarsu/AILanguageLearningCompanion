require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
if (process.env.ALLOW_DEMO_SEED !== 'true' || process.env.NODE_ENV === 'production') {
  throw new Error('Demo seed is quarantined; set ALLOW_DEMO_SEED=true outside production to run explicitly');
}
if (!process.env.DEMO_SEED_PASSWORD || process.env.DEMO_SEED_PASSWORD.length < 12) {
  throw new Error('DEMO_SEED_PASSWORD must be explicitly supplied with at least 12 characters');
}
const { sequelize, User, Vocabulary, GrammarLesson, Conversation, Flashcard, Quiz, Translation, WritingExercise, ReadingPassage, ListeningExercise, CulturalNote, Idiom, Course, Progress, TutorSession, Pronunciation } = require('./models');
const bcrypt = require('bcryptjs');

async function seed() {
  await sequelize.sync({ force: true });
  console.log('Database synced. Seeding data...');

  // Users
  const hashedPassword = await bcrypt.hash(process.env.DEMO_SEED_PASSWORD, 10);
  await User.create({ email: 'demo@linguaai.com', password: hashedPassword, name: 'Demo User', nativeLanguage: 'English', learningLanguage: 'Spanish', level: 'Intermediate' });

  // Vocabulary - 16 items
  const vocabData = [
    { word: 'Hola', translation: 'Hello', language: 'Spanish', partOfSpeech: 'interjection', exampleSentence: '¡Hola! ¿Cómo estás?', pronunciation: 'OH-lah', difficulty: 'beginner', category: 'Greetings' },
    { word: 'Gracias', translation: 'Thank you', language: 'Spanish', partOfSpeech: 'noun', exampleSentence: 'Muchas gracias por tu ayuda.', pronunciation: 'GRAH-see-ahs', difficulty: 'beginner', category: 'Greetings' },
    { word: 'Mariposa', translation: 'Butterfly', language: 'Spanish', partOfSpeech: 'noun', exampleSentence: 'La mariposa vuela en el jardín.', pronunciation: 'mah-ree-POH-sah', difficulty: 'intermediate', category: 'Nature' },
    { word: 'Desarrollo', translation: 'Development', language: 'Spanish', partOfSpeech: 'noun', exampleSentence: 'El desarrollo del proyecto va bien.', pronunciation: 'deh-sah-RROH-yoh', difficulty: 'advanced', category: 'Business' },
    { word: 'Amanecer', translation: 'Sunrise/Dawn', language: 'Spanish', partOfSpeech: 'noun/verb', exampleSentence: 'El amanecer en la playa es hermoso.', pronunciation: 'ah-mah-neh-SEHR', difficulty: 'intermediate', category: 'Nature' },
    { word: 'Biblioteca', translation: 'Library', language: 'Spanish', partOfSpeech: 'noun', exampleSentence: 'Voy a la biblioteca para estudiar.', pronunciation: 'bee-blee-oh-TEH-kah', difficulty: 'beginner', category: 'Places' },
    { word: 'Conseguir', translation: 'To achieve/obtain', language: 'Spanish', partOfSpeech: 'verb', exampleSentence: 'Necesito conseguir un nuevo trabajo.', pronunciation: 'kohn-seh-GEER', difficulty: 'intermediate', category: 'Verbs' },
    { word: 'Estrella', translation: 'Star', language: 'Spanish', partOfSpeech: 'noun', exampleSentence: 'Las estrellas brillan en la noche.', pronunciation: 'ehs-TREH-yah', difficulty: 'beginner', category: 'Nature' },
    { word: 'Felicidad', translation: 'Happiness', language: 'Spanish', partOfSpeech: 'noun', exampleSentence: 'La felicidad está en las cosas simples.', pronunciation: 'feh-lee-see-DAHD', difficulty: 'intermediate', category: 'Emotions' },
    { word: 'Gobierno', translation: 'Government', language: 'Spanish', partOfSpeech: 'noun', exampleSentence: 'El gobierno anunció nuevas leyes.', pronunciation: 'goh-bee-EHR-noh', difficulty: 'advanced', category: 'Politics' },
    { word: 'Hermoso', translation: 'Beautiful', language: 'Spanish', partOfSpeech: 'adjective', exampleSentence: 'Es un día hermoso.', pronunciation: 'ehr-MOH-soh', difficulty: 'beginner', category: 'Adjectives' },
    { word: 'Investigar', translation: 'To investigate/research', language: 'Spanish', partOfSpeech: 'verb', exampleSentence: 'Necesitamos investigar más sobre el tema.', pronunciation: 'een-vehs-tee-GAHR', difficulty: 'advanced', category: 'Verbs' },
    { word: 'Jugar', translation: 'To play', language: 'Spanish', partOfSpeech: 'verb', exampleSentence: 'Los niños juegan en el parque.', pronunciation: 'hoo-GAHR', difficulty: 'beginner', category: 'Verbs' },
    { word: 'Conocimiento', translation: 'Knowledge', language: 'Spanish', partOfSpeech: 'noun', exampleSentence: 'El conocimiento es poder.', pronunciation: 'koh-noh-see-mee-EHN-toh', difficulty: 'advanced', category: 'Education' },
    { word: 'Lluvia', translation: 'Rain', language: 'Spanish', partOfSpeech: 'noun', exampleSentence: 'La lluvia cae sobre la ciudad.', pronunciation: 'YOO-vee-ah', difficulty: 'beginner', category: 'Weather' },
    { word: 'Madrugar', translation: 'To wake up early', language: 'Spanish', partOfSpeech: 'verb', exampleSentence: 'Al que madruga, Dios le ayuda.', pronunciation: 'mah-droo-GAHR', difficulty: 'intermediate', category: 'Daily Life' },
  ];
  await Vocabulary.bulkCreate(vocabData);

  // Grammar Lessons - 16 items
  const grammarData = [
    { title: 'Present Tense - Regular Verbs', language: 'Spanish', level: 'Beginner', explanation: 'Spanish regular verbs follow patterns based on their endings: -ar, -er, -ir.', examples: 'hablar → hablo, hablas, habla; comer → como, comes, come', rules: 'Remove the infinitive ending and add the appropriate conjugation.', category: 'Verb Conjugation' },
    { title: 'Ser vs Estar', language: 'Spanish', level: 'Beginner', explanation: 'Both mean "to be" but are used differently. Ser for permanent qualities, estar for temporary states.', examples: 'Soy profesor (I am a teacher). Estoy cansado (I am tired).', rules: 'Use ser for identity, occupation, origin. Use estar for location, feelings, conditions.', category: 'Verbs' },
    { title: 'Past Tense - Preterite', language: 'Spanish', level: 'Intermediate', explanation: 'The preterite is used for completed actions in the past.', examples: 'Ayer comí pizza. (Yesterday I ate pizza.)', rules: '-ar verbs: -é, -aste, -ó, -amos, -asteis, -aron', category: 'Verb Conjugation' },
    { title: 'Imperfect Tense', language: 'Spanish', level: 'Intermediate', explanation: 'Used for ongoing or habitual past actions.', examples: 'Cuando era niño, jugaba todos los días. (When I was a child, I played every day.)', rules: '-ar: -aba, -abas, -aba, -ábamos, -abais, -aban', category: 'Verb Conjugation' },
    { title: 'Subjunctive Mood', language: 'Spanish', level: 'Advanced', explanation: 'Used to express wishes, doubts, emotions, and hypothetical situations.', examples: 'Espero que vengas. (I hope you come.)', rules: 'Triggered by expressions of desire, emotion, doubt, or impersonal expressions.', category: 'Moods' },
    { title: 'Gender of Nouns', language: 'Spanish', level: 'Beginner', explanation: 'Spanish nouns are either masculine or feminine. Most nouns ending in -o are masculine, -a are feminine.', examples: 'el libro (the book - masc.), la casa (the house - fem.)', rules: 'Learn the gender with each new noun. There are exceptions to the -o/-a rule.', category: 'Nouns' },
    { title: 'Reflexive Verbs', language: 'Spanish', level: 'Intermediate', explanation: 'Reflexive verbs indicate the subject performs the action on themselves.', examples: 'Me levanto a las 7. (I get up at 7.) Se lava las manos. (He washes his hands.)', rules: 'Use reflexive pronouns: me, te, se, nos, os, se before the conjugated verb.', category: 'Verbs' },
    { title: 'Direct & Indirect Object Pronouns', language: 'Spanish', level: 'Intermediate', explanation: 'Pronouns that replace the direct or indirect object in a sentence.', examples: 'Lo veo. (I see him.) Le doy el libro. (I give him the book.)', rules: 'Direct: lo, la, los, las. Indirect: le, les. Place before conjugated verb.', category: 'Pronouns' },
    { title: 'Conditional Tense', language: 'Spanish', level: 'Intermediate', explanation: 'Used to express what would happen under certain conditions.', examples: 'Yo comería más si tuviera hambre. (I would eat more if I were hungry.)', rules: 'Add -ía, -ías, -ía, -íamos, -íais, -ían to the infinitive.', category: 'Verb Conjugation' },
    { title: 'Por vs Para', language: 'Spanish', level: 'Intermediate', explanation: 'Both translate to "for" but have different uses.', examples: 'Este regalo es para ti. (This gift is for you.) Gracias por tu ayuda. (Thanks for your help.)', rules: 'Para = purpose, destination, deadline. Por = cause, exchange, duration.', category: 'Prepositions' },
    { title: 'Commands (Imperative)', language: 'Spanish', level: 'Intermediate', explanation: 'Used to give orders or instructions.', examples: '¡Habla más despacio! (Speak slower!) ¡No corras! (Don\'t run!)', rules: 'Affirmative tú: use 3rd person singular present. Negative: use subjunctive.', category: 'Moods' },
    { title: 'Future Tense', language: 'Spanish', level: 'Beginner', explanation: 'Used to talk about actions that will happen.', examples: 'Mañana estudiaré español. (Tomorrow I will study Spanish.)', rules: 'Add -é, -ás, -á, -emos, -éis, -án to the infinitive.', category: 'Verb Conjugation' },
    { title: 'Comparatives and Superlatives', language: 'Spanish', level: 'Beginner', explanation: 'Used to compare things and express the highest degree.', examples: 'Más alto que (taller than), el más alto (the tallest)', rules: 'más/menos + adjective + que. el/la + más/menos + adjective.', category: 'Adjectives' },
    { title: 'Relative Pronouns', language: 'Spanish', level: 'Advanced', explanation: 'Words that introduce relative clauses: que, quien, cual, donde.', examples: 'El libro que leí es interesante. (The book that I read is interesting.)', rules: 'Que is most common. Quien for people after prepositions. Cual with articles.', category: 'Pronouns' },
    { title: 'Passive Voice', language: 'Spanish', level: 'Advanced', explanation: 'Used when the subject receives the action rather than performs it.', examples: 'El libro fue escrito por Cervantes. (The book was written by Cervantes.)', rules: 'ser + past participle. Also use "se" passive: Se habla español aquí.', category: 'Sentence Structure' },
    { title: 'Gerund and Progressive', language: 'Spanish', level: 'Intermediate', explanation: 'Describes ongoing actions using estar + gerund.', examples: 'Estoy comiendo. (I am eating.) Están estudiando. (They are studying.)', rules: '-ar → -ando, -er/-ir → -iendo. Use with estar for progressive.', category: 'Verb Conjugation' },
  ];
  await GrammarLesson.bulkCreate(grammarData);

  // Conversations - 16 items
  const conversationData = [
    { title: 'Ordering at a Restaurant', language: 'Spanish', scenario: 'Restaurant', level: 'Beginner', messages: '[]' },
    { title: 'Asking for Directions', language: 'Spanish', scenario: 'Street Navigation', level: 'Beginner', messages: '[]' },
    { title: 'Job Interview Practice', language: 'Spanish', scenario: 'Professional', level: 'Advanced', messages: '[]' },
    { title: 'Shopping at the Market', language: 'Spanish', scenario: 'Market/Shopping', level: 'Beginner', messages: '[]' },
    { title: 'Doctor\'s Appointment', language: 'Spanish', scenario: 'Healthcare', level: 'Intermediate', messages: '[]' },
    { title: 'Hotel Check-in', language: 'Spanish', scenario: 'Travel', level: 'Beginner', messages: '[]' },
    { title: 'Making Friends at a Party', language: 'Spanish', scenario: 'Social', level: 'Intermediate', messages: '[]' },
    { title: 'Phone Conversation', language: 'Spanish', scenario: 'Telephone', level: 'Intermediate', messages: '[]' },
    { title: 'Airport and Travel', language: 'Spanish', scenario: 'Travel', level: 'Intermediate', messages: '[]' },
    { title: 'Bank Transaction', language: 'Spanish', scenario: 'Finance', level: 'Advanced', messages: '[]' },
    { title: 'Renting an Apartment', language: 'Spanish', scenario: 'Housing', level: 'Advanced', messages: '[]' },
    { title: 'Meeting New Neighbors', language: 'Spanish', scenario: 'Social', level: 'Beginner', messages: '[]' },
    { title: 'Booking a Tour', language: 'Spanish', scenario: 'Tourism', level: 'Intermediate', messages: '[]' },
    { title: 'Complaining About Service', language: 'Spanish', scenario: 'Customer Service', level: 'Advanced', messages: '[]' },
    { title: 'Discussing Weather', language: 'Spanish', scenario: 'Casual', level: 'Beginner', messages: '[]' },
    { title: 'Family Dinner Conversation', language: 'Spanish', scenario: 'Family', level: 'Intermediate', messages: '[]' },
  ];
  await Conversation.bulkCreate(conversationData);

  // Flashcards - 16 items
  const flashcardData = [
    { front: '¿Cómo te llamas?', back: 'What is your name?', language: 'Spanish', category: 'Greetings', difficulty: 'beginner' },
    { front: 'Buenos días', back: 'Good morning', language: 'Spanish', category: 'Greetings', difficulty: 'beginner' },
    { front: '¿Dónde está el baño?', back: 'Where is the bathroom?', language: 'Spanish', category: 'Travel', difficulty: 'beginner' },
    { front: 'Me gustaría', back: 'I would like', language: 'Spanish', category: 'Polite Phrases', difficulty: 'beginner' },
    { front: '¿Cuánto cuesta?', back: 'How much does it cost?', language: 'Spanish', category: 'Shopping', difficulty: 'beginner' },
    { front: 'No entiendo', back: 'I don\'t understand', language: 'Spanish', category: 'Communication', difficulty: 'beginner' },
    { front: 'Tengo hambre', back: 'I am hungry', language: 'Spanish', category: 'Daily Life', difficulty: 'beginner' },
    { front: 'Hace buen tiempo', back: 'The weather is nice', language: 'Spanish', category: 'Weather', difficulty: 'intermediate' },
    { front: 'Echar de menos', back: 'To miss (someone/something)', language: 'Spanish', category: 'Emotions', difficulty: 'intermediate' },
    { front: 'Tener en cuenta', back: 'To take into account', language: 'Spanish', category: 'Business', difficulty: 'advanced' },
    { front: 'A pesar de', back: 'Despite / In spite of', language: 'Spanish', category: 'Connectors', difficulty: 'intermediate' },
    { front: 'Dar a conocer', back: 'To make known / announce', language: 'Spanish', category: 'Communication', difficulty: 'advanced' },
    { front: 'Sin embargo', back: 'However / Nevertheless', language: 'Spanish', category: 'Connectors', difficulty: 'intermediate' },
    { front: 'Llevar a cabo', back: 'To carry out / accomplish', language: 'Spanish', category: 'Business', difficulty: 'advanced' },
    { front: 'Por lo tanto', back: 'Therefore', language: 'Spanish', category: 'Connectors', difficulty: 'intermediate' },
    { front: 'Hacer hincapié', back: 'To emphasize', language: 'Spanish', category: 'Communication', difficulty: 'advanced' },
  ];
  await Flashcard.bulkCreate(flashcardData);

  // Quizzes - 16 items
  const quizData = [
    { title: 'Basic Greetings Quiz', language: 'Spanish', level: 'Beginner', type: 'Multiple Choice', questions: '5', totalQuestions: 5 },
    { title: 'Food Vocabulary Test', language: 'Spanish', level: 'Beginner', type: 'Multiple Choice', questions: '5', totalQuestions: 5 },
    { title: 'Present Tense Conjugation', language: 'Spanish', level: 'Beginner', type: 'Fill in the Blank', questions: '5', totalQuestions: 5 },
    { title: 'Ser vs Estar Challenge', language: 'Spanish', level: 'Intermediate', type: 'Multiple Choice', questions: '5', totalQuestions: 5 },
    { title: 'Past Tense Review', language: 'Spanish', level: 'Intermediate', type: 'Multiple Choice', questions: '5', totalQuestions: 5 },
    { title: 'Colors and Numbers', language: 'Spanish', level: 'Beginner', type: 'Matching', questions: '5', totalQuestions: 5 },
    { title: 'Family Members Vocabulary', language: 'Spanish', level: 'Beginner', type: 'Multiple Choice', questions: '5', totalQuestions: 5 },
    { title: 'Travel Phrases Quiz', language: 'Spanish', level: 'Intermediate', type: 'Multiple Choice', questions: '5', totalQuestions: 5 },
    { title: 'Subjunctive Mood Test', language: 'Spanish', level: 'Advanced', type: 'Fill in the Blank', questions: '5', totalQuestions: 5 },
    { title: 'Idioms and Expressions', language: 'Spanish', level: 'Advanced', type: 'Multiple Choice', questions: '5', totalQuestions: 5 },
    { title: 'Weather Vocabulary', language: 'Spanish', level: 'Beginner', type: 'Matching', questions: '5', totalQuestions: 5 },
    { title: 'Body Parts Quiz', language: 'Spanish', level: 'Beginner', type: 'Multiple Choice', questions: '5', totalQuestions: 5 },
    { title: 'Prepositions Challenge', language: 'Spanish', level: 'Intermediate', type: 'Fill in the Blank', questions: '5', totalQuestions: 5 },
    { title: 'Advanced Vocabulary Test', language: 'Spanish', level: 'Advanced', type: 'Multiple Choice', questions: '5', totalQuestions: 5 },
    { title: 'Clothing Vocabulary', language: 'Spanish', level: 'Beginner', type: 'Matching', questions: '5', totalQuestions: 5 },
    { title: 'Conditional Tense Quiz', language: 'Spanish', level: 'Intermediate', type: 'Fill in the Blank', questions: '5', totalQuestions: 5 },
  ];
  await Quiz.bulkCreate(quizData);

  // Translations - 16 items
  const translationData = [
    { sourceText: 'The early bird catches the worm', translatedText: 'Al que madruga, Dios le ayuda', sourceLanguage: 'English', targetLanguage: 'Spanish', context: 'Proverb' },
    { sourceText: 'I would like to book a table for two', translatedText: 'Me gustaría reservar una mesa para dos', sourceLanguage: 'English', targetLanguage: 'Spanish', context: 'Restaurant' },
    { sourceText: 'Where is the nearest hospital?', translatedText: '¿Dónde está el hospital más cercano?', sourceLanguage: 'English', targetLanguage: 'Spanish', context: 'Emergency' },
    { sourceText: 'Can you recommend a good restaurant?', translatedText: '¿Puede recomendarme un buen restaurante?', sourceLanguage: 'English', targetLanguage: 'Spanish', context: 'Travel' },
    { sourceText: 'I have been studying Spanish for two years', translatedText: 'Llevo dos años estudiando español', sourceLanguage: 'English', targetLanguage: 'Spanish', context: 'Education' },
    { sourceText: 'The meeting has been postponed until Friday', translatedText: 'La reunión se ha pospuesto hasta el viernes', sourceLanguage: 'English', targetLanguage: 'Spanish', context: 'Business' },
    { sourceText: 'It is raining cats and dogs', translatedText: 'Está lloviendo a cántaros', sourceLanguage: 'English', targetLanguage: 'Spanish', context: 'Weather Idiom' },
    { sourceText: 'Could you speak more slowly please?', translatedText: '¿Podría hablar más despacio, por favor?', sourceLanguage: 'English', targetLanguage: 'Spanish', context: 'Communication' },
    { sourceText: 'I am looking for a job in marketing', translatedText: 'Estoy buscando un trabajo en marketing', sourceLanguage: 'English', targetLanguage: 'Spanish', context: 'Career' },
    { sourceText: 'The sunset over the ocean was breathtaking', translatedText: 'La puesta de sol sobre el océano fue impresionante', sourceLanguage: 'English', targetLanguage: 'Spanish', context: 'Description' },
    { sourceText: 'Please let me know if you need anything', translatedText: 'Por favor, avísame si necesitas algo', sourceLanguage: 'English', targetLanguage: 'Spanish', context: 'Polite' },
    { sourceText: 'Knowledge is power', translatedText: 'El conocimiento es poder', sourceLanguage: 'English', targetLanguage: 'Spanish', context: 'Proverb' },
    { sourceText: 'What time does the train leave?', translatedText: '¿A qué hora sale el tren?', sourceLanguage: 'English', targetLanguage: 'Spanish', context: 'Travel' },
    { sourceText: 'I completely agree with your opinion', translatedText: 'Estoy completamente de acuerdo con tu opinión', sourceLanguage: 'English', targetLanguage: 'Spanish', context: 'Discussion' },
    { sourceText: 'Life is too short to be unhappy', translatedText: 'La vida es demasiado corta para ser infeliz', sourceLanguage: 'English', targetLanguage: 'Spanish', context: 'Philosophy' },
    { sourceText: 'Happy birthday! May all your wishes come true', translatedText: '¡Feliz cumpleaños! Que todos tus deseos se hagan realidad', sourceLanguage: 'English', targetLanguage: 'Spanish', context: 'Celebration' },
  ];
  await Translation.bulkCreate(translationData);

  // Writing Exercises - 16 items
  const writingData = [
    { title: 'Describe Your Daily Routine', prompt: 'Write about your typical day from morning to night in Spanish.', language: 'Spanish', level: 'Beginner', category: 'Daily Life' },
    { title: 'My Favorite Vacation', prompt: 'Describe your favorite vacation or a trip you want to take.', language: 'Spanish', level: 'Beginner', category: 'Travel' },
    { title: 'Letter to a Friend', prompt: 'Write a letter to a friend inviting them to visit your city.', language: 'Spanish', level: 'Intermediate', category: 'Correspondence' },
    { title: 'Restaurant Review', prompt: 'Write a review of a restaurant you recently visited.', language: 'Spanish', level: 'Intermediate', category: 'Opinion' },
    { title: 'Job Application Cover Letter', prompt: 'Write a cover letter for a marketing position at a Spanish company.', language: 'Spanish', level: 'Advanced', category: 'Professional' },
    { title: 'Describe Your Family', prompt: 'Write about your family members and your relationships with them.', language: 'Spanish', level: 'Beginner', category: 'Family' },
    { title: 'My Hobbies and Interests', prompt: 'Write about what you like to do in your free time.', language: 'Spanish', level: 'Beginner', category: 'Leisure' },
    { title: 'Environmental Essay', prompt: 'Write about the importance of protecting the environment.', language: 'Spanish', level: 'Advanced', category: 'Essay' },
    { title: 'Recipe Description', prompt: 'Write the recipe for your favorite dish, including ingredients and steps.', language: 'Spanish', level: 'Intermediate', category: 'Food' },
    { title: 'News Article Summary', prompt: 'Summarize a recent news event in your own words.', language: 'Spanish', level: 'Advanced', category: 'Media' },
    { title: 'Childhood Memories', prompt: 'Write about a memorable event from your childhood.', language: 'Spanish', level: 'Intermediate', category: 'Personal' },
    { title: 'City Description', prompt: 'Describe your city or hometown to someone who has never visited.', language: 'Spanish', level: 'Beginner', category: 'Travel' },
    { title: 'Movie Review', prompt: 'Write a review of a movie you recently watched.', language: 'Spanish', level: 'Intermediate', category: 'Entertainment' },
    { title: 'Formal Complaint Letter', prompt: 'Write a formal letter complaining about a service you received.', language: 'Spanish', level: 'Advanced', category: 'Professional' },
    { title: 'Dream House Description', prompt: 'Describe your ideal home and where it would be located.', language: 'Spanish', level: 'Intermediate', category: 'Lifestyle' },
    { title: 'Technology Opinion Piece', prompt: 'Write about how technology has changed our daily lives.', language: 'Spanish', level: 'Advanced', category: 'Essay' },
  ];
  await WritingExercise.bulkCreate(writingData);

  // Reading Passages - 16 items
  const readingData = [
    { title: 'Mi Primer Día en España', content: 'Llegué a Madrid un lunes por la mañana. El aeropuerto era grande y moderno. Tomé un taxi al hotel. El conductor era muy simpático y me habló sobre los mejores lugares para visitar. Mi hotel estaba en el centro, cerca de la Puerta del Sol.', language: 'Spanish', level: 'Beginner', category: 'Travel' },
    { title: 'La Receta de la Abuela', content: 'Mi abuela siempre preparaba la mejor paella. Usaba arroz bomba, azafrán, pollo, judías verdes y caracoles. Cocinaba todo a fuego lento durante cuarenta minutos. El secreto, decía ella, era el amor que ponía en cada plato.', language: 'Spanish', level: 'Beginner', category: 'Food' },
    { title: 'El Cambio Climático', content: 'El cambio climático es uno de los mayores desafíos de nuestro tiempo. Las temperaturas globales han aumentado significativamente en las últimas décadas. Los científicos advierten que debemos reducir las emisiones de gases de efecto invernadero para evitar consecuencias catastróficas.', language: 'Spanish', level: 'Advanced', category: 'Environment' },
    { title: 'Un Día en el Mercado', content: 'Todos los sábados voy al mercado de mi barrio. Compro frutas frescas, verduras y pan. La señora María vende las mejores naranjas. Siempre me da una extra porque soy cliente habitual. Me encanta el ambiente del mercado.', language: 'Spanish', level: 'Beginner', category: 'Daily Life' },
    { title: 'La Historia del Flamenco', content: 'El flamenco es un arte que nació en Andalucía, en el sur de España. Combina canto, baile y guitarra. Tiene influencias gitanas, árabes y judías. Fue declarado Patrimonio Cultural Inmaterial de la Humanidad por la UNESCO en 2010.', language: 'Spanish', level: 'Intermediate', category: 'Culture' },
    { title: 'El Fútbol en Latinoamérica', content: 'El fútbol es más que un deporte en Latinoamérica, es una pasión. Desde Argentina hasta México, millones de personas siguen a sus equipos con devoción. Los estadios se llenan cada fin de semana y las calles se vacían durante los partidos importantes.', language: 'Spanish', level: 'Intermediate', category: 'Sports' },
    { title: 'Don Quijote - Fragmento', content: 'En un lugar de la Mancha, de cuyo nombre no quiero acordarme, no ha mucho tiempo que vivía un hidalgo de los de lanza en astillero, adarga antigua, rocín flaco y galgo corredor.', language: 'Spanish', level: 'Advanced', category: 'Literature' },
    { title: 'La Tecnología y los Jóvenes', content: 'Los jóvenes de hoy crecen rodeados de tecnología. Usan smartphones, tablets y ordenadores todos los días. Algunos expertos dicen que esto es positivo para el aprendizaje, mientras otros creen que puede ser perjudicial para la salud mental.', language: 'Spanish', level: 'Intermediate', category: 'Technology' },
    { title: 'Mi Mascota', content: 'Tengo un perro que se llama Luna. Es una perra golden retriever de tres años. Le encanta jugar en el parque y nadar en el río. Es muy cariñosa y siempre está contenta cuando llego a casa.', language: 'Spanish', level: 'Beginner', category: 'Animals' },
    { title: 'Las Fiestas de San Fermín', content: 'Cada año, del 6 al 14 de julio, la ciudad de Pamplona celebra las fiestas de San Fermín. El evento más conocido es el encierro, donde los toros corren por las calles estrechas del casco antiguo seguidos por valientes corredores.', language: 'Spanish', level: 'Intermediate', category: 'Festivals' },
    { title: 'El Sistema Educativo Español', content: 'En España, la educación obligatoria va de los 6 a los 16 años. Incluye la educación primaria y la educación secundaria obligatoria (ESO). Después, los estudiantes pueden elegir el bachillerato o la formación profesional.', language: 'Spanish', level: 'Intermediate', category: 'Education' },
    { title: 'Economía Global', content: 'La economía mundial enfrenta grandes desafíos: la inflación, el desempleo y la desigualdad. Los gobiernos buscan soluciones para estimular el crecimiento económico mientras protegen a los más vulnerables. La cooperación internacional es fundamental.', language: 'Spanish', level: 'Advanced', category: 'Economics' },
    { title: 'Viaje a Machu Picchu', content: 'Machu Picchu es una antigua ciudad inca ubicada en los Andes peruanos. Fue construida en el siglo XV y abandonada durante la conquista española. Hoy es uno de los destinos turísticos más visitados del mundo y una de las nuevas siete maravillas.', language: 'Spanish', level: 'Intermediate', category: 'History' },
    { title: 'La Comida Mexicana', content: 'La gastronomía mexicana es Patrimonio Inmaterial de la Humanidad. Los tacos, tamales, mole y guacamole son solo algunos de sus platos más famosos. El maíz, el chile y el frijol son ingredientes fundamentales que se usan desde tiempos prehispánicos.', language: 'Spanish', level: 'Intermediate', category: 'Food' },
    { title: 'El Medio Ambiente Urbano', content: 'Las ciudades modernas enfrentan problemas ambientales como la contaminación del aire, el ruido excesivo y la falta de espacios verdes. Muchas ciudades están implementando soluciones como carriles para bicicletas, zonas peatonales y parques urbanos.', language: 'Spanish', level: 'Intermediate', category: 'Environment' },
    { title: 'La Música Latina', content: 'La música latina ha conquistado el mundo. Desde el reggaetón hasta la salsa, los ritmos latinos hacen bailar a millones de personas. Artistas como Shakira, Bad Bunny y J Balvin han llevado la música en español a los primeros puestos de las listas mundiales.', language: 'Spanish', level: 'Intermediate', category: 'Music' },
  ];
  await ReadingPassage.bulkCreate(readingData);

  // Listening Exercises - 16 items
  const listeningData = [
    { title: 'Airport Announcement', transcript: 'Atención pasajeros del vuelo IB3456 con destino a Barcelona. Su vuelo ha sido retrasado treinta minutos. La nueva hora de salida es a las quince horas. Disculpen las molestias.', language: 'Spanish', level: 'Beginner', category: 'Travel', duration: '30 seconds' },
    { title: 'Weather Forecast', transcript: 'Hoy en Madrid esperamos cielos despejados con temperaturas máximas de veinticinco grados. Para mañana se esperan lluvias por la tarde. Recomendamos llevar paraguas.', language: 'Spanish', level: 'Beginner', category: 'Weather', duration: '30 seconds' },
    { title: 'Restaurant Dialogue', transcript: 'Camarero: Buenas tardes, ¿tienen reserva? Cliente: Sí, a nombre de García, para dos personas. Camarero: Perfecto, síganme por favor. Aquí tienen la carta. El menú del día incluye sopa, pollo asado y flan.', language: 'Spanish', level: 'Beginner', category: 'Food', duration: '1 minute' },
    { title: 'Phone Message', transcript: 'Hola María, soy Ana. Te llamo para recordarte que mañana tenemos la reunión a las diez de la mañana en la oficina. No olvides traer los documentos del proyecto. ¡Hasta mañana!', language: 'Spanish', level: 'Beginner', category: 'Communication', duration: '30 seconds' },
    { title: 'News Broadcast', transcript: 'En las noticias de hoy: el gobierno ha aprobado una nueva ley de educación que entrará en vigor el próximo septiembre. La reforma incluye cambios significativos en el currículo de educación secundaria.', language: 'Spanish', level: 'Advanced', category: 'News', duration: '1 minute' },
    { title: 'Doctor Visit', transcript: 'Doctor: Buenos días, ¿qué le ocurre? Paciente: Me duele mucho la cabeza y tengo fiebre desde ayer. Doctor: Vamos a tomarle la temperatura. ¿Ha tomado algún medicamento? Paciente: Solo un paracetamol esta mañana.', language: 'Spanish', level: 'Intermediate', category: 'Health', duration: '1 minute' },
    { title: 'Radio Advertisement', transcript: 'Aprende español con LinguaAI, la mejor aplicación para aprender idiomas. Con inteligencia artificial, clases personalizadas y profesores nativos. Descárgala gratis hoy. LinguaAI, tu compañero de idiomas.', language: 'Spanish', level: 'Beginner', category: 'Media', duration: '30 seconds' },
    { title: 'Museum Audio Guide', transcript: 'Bienvenidos al Museo del Prado. En esta sala pueden admirar "Las Meninas" de Velázquez, pintada en 1656. Es considerada una de las obras más importantes de la historia del arte occidental.', language: 'Spanish', level: 'Intermediate', category: 'Culture', duration: '1 minute' },
    { title: 'Train Station Dialogue', transcript: 'Pasajero: Perdone, ¿de qué andén sale el tren a Sevilla? Empleada: Del andén número tres. Sale a las doce y media. Pasajero: ¿Y cuánto cuesta el billete de ida? Empleada: Son cuarenta y cinco euros en clase turista.', language: 'Spanish', level: 'Beginner', category: 'Travel', duration: '1 minute' },
    { title: 'University Lecture Excerpt', transcript: 'Hoy vamos a hablar sobre la influencia del español en el inglés. Muchas palabras inglesas tienen origen español, como "canyon" del español "cañón", "tornado", "plaza" y "fiesta". Esta influencia refleja siglos de contacto cultural.', language: 'Spanish', level: 'Intermediate', category: 'Education', duration: '2 minutes' },
    { title: 'Cooking Show Clip', transcript: 'Primero, cortamos la cebolla en trozos pequeños. Luego, calentamos el aceite de oliva en una sartén grande. Añadimos la cebolla y cocinamos a fuego lento durante cinco minutos hasta que esté dorada.', language: 'Spanish', level: 'Beginner', category: 'Food', duration: '1 minute' },
    { title: 'Sports Commentary', transcript: 'Último minuto del partido. El Barcelona tiene el balón. Messi recibe, regatea a dos defensores... ¡Dispara! ¡GOOOOL! ¡Gol de Messi en el último minuto! El estadio estalla de alegría.', language: 'Spanish', level: 'Intermediate', category: 'Sports', duration: '30 seconds' },
    { title: 'Travel Podcast', transcript: 'Si visitan Colombia, no se pueden perder Cartagena de Indias. Esta ciudad amurallada es Patrimonio de la Humanidad. Sus calles coloridas, su gastronomía y su música hacen de ella un destino inolvidable.', language: 'Spanish', level: 'Intermediate', category: 'Travel', duration: '1 minute' },
    { title: 'Business Meeting', transcript: 'Director: Bien, empecemos la reunión. El objetivo de hoy es revisar los resultados del trimestre. Las ventas han aumentado un quince por ciento comparado con el año anterior. Sin embargo, necesitamos mejorar en el departamento de atención al cliente.', language: 'Spanish', level: 'Advanced', category: 'Business', duration: '2 minutes' },
    { title: 'Podcast Interview', transcript: 'Entrevistadora: ¿Cuál es tu consejo para aprender un nuevo idioma? Experto: Lo más importante es practicar todos los días, aunque sean solo quince minutos. También recomiendo ver películas y escuchar música en el idioma que estás aprendiendo.', language: 'Spanish', level: 'Intermediate', category: 'Education', duration: '1 minute' },
    { title: 'Emergency Instructions', transcript: 'En caso de emergencia, mantengan la calma. Diríjanse a la salida más cercana. No usen los ascensores. Sigan las señales de evacuación. El punto de encuentro está en el estacionamiento norte.', language: 'Spanish', level: 'Beginner', category: 'Safety', duration: '30 seconds' },
  ];
  await ListeningExercise.bulkCreate(listeningData);

  // Cultural Notes - 16 items
  const culturalData = [
    { title: 'La Siesta Tradition', content: 'The siesta is a traditional Spanish rest period after lunch. While modern work schedules have reduced this practice in cities, it remains an important cultural concept.', language: 'Spanish', country: 'Spain', category: 'Customs', funFact: 'Studies show that a short nap after lunch can improve productivity by 34%!' },
    { title: 'Day of the Dead', content: 'Día de los Muertos is a Mexican holiday celebrating deceased loved ones. Families build altars (ofrendas) with photos, marigolds, and favorite foods of the departed.', language: 'Spanish', country: 'Mexico', category: 'Festivals', funFact: 'The holiday was recognized by UNESCO as an Intangible Cultural Heritage of Humanity in 2008.' },
    { title: 'Tango Culture', content: 'Tango originated in Buenos Aires in the late 19th century. It combines music, dance, and poetry and is deeply embedded in Argentine identity.', language: 'Spanish', country: 'Argentina', category: 'Art', funFact: 'Tango was inscribed on the UNESCO Intangible Cultural Heritage Lists in 2009.' },
    { title: 'Spanish Tapas Culture', content: 'Tapas are small dishes served with drinks in Spain. The culture of "ir de tapas" (going for tapas) is a social event where friends move from bar to bar.', language: 'Spanish', country: 'Spain', category: 'Food', funFact: 'The word "tapa" means "lid" - originally a piece of bread placed over a glass to keep flies out!' },
    { title: 'Quinceañera Celebration', content: 'The quinceañera celebrates a girl\'s 15th birthday, marking the transition to womanhood. It includes a religious ceremony, party, and traditional waltz.', language: 'Spanish', country: 'Latin America', category: 'Traditions', funFact: 'The tradition dates back to Aztec and Maya civilizations!' },
    { title: 'La Tomatina Festival', content: 'Every year in Buñol, Spain, thousands participate in the world\'s largest tomato fight. Over 150,000 tomatoes are thrown during this one-hour festival.', language: 'Spanish', country: 'Spain', category: 'Festivals', funFact: 'The festival started accidentally in 1945 during a parade when bystanders started a food fight!' },
    { title: 'Mate - The Social Drink', content: 'Mate is a traditional South American caffeinated drink shared among friends. In Argentina, Uruguay, and Paraguay, sharing mate is a sign of friendship and hospitality.', language: 'Spanish', country: 'Argentina', category: 'Food', funFact: 'Refusing mate when offered is considered quite rude in Argentine culture!' },
    { title: 'Flamenco Art Form', content: 'Flamenco is an art form from Andalusia combining singing (cante), guitar (toque), dance (baile), and handclaps (palmas). It expresses deep emotions and cultural identity.', language: 'Spanish', country: 'Spain', category: 'Art', funFact: 'Flamenco was added to UNESCO\'s Intangible Cultural Heritage list in 2010.' },
    { title: 'Carnival in Latin America', content: 'Carnival celebrations before Lent are massive events across Latin America. From Rio de Janeiro to Barranquilla, cities come alive with parades, music, and dancing.', language: 'Spanish', country: 'Latin America', category: 'Festivals', funFact: 'Barranquilla\'s Carnival is the second-largest in the world after Rio!' },
    { title: 'Spanish Name Day', content: 'In Spain, people celebrate not only their birthday but also their "santo" (saint\'s day) - the day of the saint they were named after.', language: 'Spanish', country: 'Spain', category: 'Traditions', funFact: 'Some people prefer celebrating their santo over their actual birthday!' },
    { title: 'Piñata Tradition', content: 'Originally from China via Marco Polo to Italy, then to Spain and Mexico, piñatas have evolved into a beloved part of Latin American celebrations.', language: 'Spanish', country: 'Mexico', category: 'Traditions', funFact: 'Traditional piñatas have 7 points representing the 7 deadly sins!' },
    { title: 'Sobremesa Culture', content: 'Sobremesa refers to the time spent lingering at the table after a meal, enjoying conversation. It\'s an essential part of Spanish social life.', language: 'Spanish', country: 'Spain', category: 'Customs', funFact: 'Sobremesa can last hours and is considered more important than the meal itself!' },
    { title: 'Lucha Libre', content: 'Mexican professional wrestling is a cultural phenomenon combining athletics, theater, and tradition. The colorful masks worn by luchadores are sacred and deeply symbolic.', language: 'Spanish', country: 'Mexico', category: 'Entertainment', funFact: 'A luchador being unmasked is considered the ultimate defeat and dishonor!' },
    { title: 'Paella - Valencia\'s Pride', content: 'Authentic paella originated in Valencia and traditionally uses rabbit, chicken, green beans, and snails. Seafood paella is actually a coastal variation.', language: 'Spanish', country: 'Spain', category: 'Food', funFact: 'Valencians consider it almost sacrilegious to add chorizo to paella!' },
    { title: 'Greeting Customs', content: 'In Spain and Latin America, greeting with a kiss on the cheek (one or two) is standard between friends. Men often greet with a handshake or hug (abrazo).', language: 'Spanish', country: 'Latin America', category: 'Customs', funFact: 'In Argentina, even men greet each other with a kiss on the cheek!' },
    { title: 'Running of the Bulls', content: 'San Fermín festival in Pamplona features the famous "encierro" where bulls run through narrow streets. This controversial tradition dates back centuries.', language: 'Spanish', country: 'Spain', category: 'Festivals', funFact: 'Ernest Hemingway made the festival internationally famous with his novel "The Sun Also Rises"!' },
  ];
  await CulturalNote.bulkCreate(culturalData);

  // Idioms - 16 items
  const idiomData = [
    { phrase: 'No hay mal que por bien no venga', meaning: 'Every cloud has a silver lining', language: 'Spanish', literalTranslation: 'There is no bad from which good doesn\'t come', example: 'Perdí mi trabajo, pero encontré uno mejor. No hay mal que por bien no venga.', category: 'Optimism' },
    { phrase: 'Estar en las nubes', meaning: 'To be daydreaming / not paying attention', language: 'Spanish', literalTranslation: 'To be in the clouds', example: '¡Oye! ¿Me estás escuchando? Siempre estás en las nubes.', category: 'Behavior' },
    { phrase: 'Costar un ojo de la cara', meaning: 'To be very expensive', language: 'Spanish', literalTranslation: 'To cost an eye from the face', example: 'Ese coche nuevo me costó un ojo de la cara.', category: 'Money' },
    { phrase: 'Meter la pata', meaning: 'To put your foot in it / make a mistake', language: 'Spanish', literalTranslation: 'To put the paw in', example: 'Metí la pata cuando le dije a María sobre la fiesta sorpresa.', category: 'Mistakes' },
    { phrase: 'Ser pan comido', meaning: 'To be a piece of cake / very easy', language: 'Spanish', literalTranslation: 'To be eaten bread', example: 'El examen fue pan comido, estudié mucho.', category: 'Difficulty' },
    { phrase: 'Tener mala leche', meaning: 'To be bad-tempered / have bad intentions', language: 'Spanish', literalTranslation: 'To have bad milk', example: 'No le hables ahora, tiene muy mala leche hoy.', category: 'Emotions' },
    { phrase: 'Dar en el clavo', meaning: 'To hit the nail on the head', language: 'Spanish', literalTranslation: 'To hit the nail', example: 'Has dado en el clavo con tu análisis del problema.', category: 'Accuracy' },
    { phrase: 'Estar como una cabra', meaning: 'To be crazy', language: 'Spanish', literalTranslation: 'To be like a goat', example: '¡Estás como una cabra! ¿Vas a saltar desde ahí?', category: 'Behavior' },
    { phrase: 'No tener pelos en la lengua', meaning: 'To speak one\'s mind / be outspoken', language: 'Spanish', literalTranslation: 'To not have hairs on the tongue', example: 'Mi abuela no tiene pelos en la lengua, siempre dice lo que piensa.', category: 'Communication' },
    { phrase: 'Tomar el pelo', meaning: 'To pull someone\'s leg / joke with someone', language: 'Spanish', literalTranslation: 'To take the hair', example: '¿Me estás tomando el pelo? ¡No puedo creerlo!', category: 'Humor' },
    { phrase: 'Ser uña y carne', meaning: 'To be inseparable (best friends)', language: 'Spanish', literalTranslation: 'To be nail and flesh', example: 'María y Ana son uña y carne, siempre están juntas.', category: 'Relationships' },
    { phrase: 'Ponerse las pilas', meaning: 'To get one\'s act together / start working hard', language: 'Spanish', literalTranslation: 'To put in the batteries', example: 'Tienes que ponerte las pilas si quieres aprobar el examen.', category: 'Motivation' },
    { phrase: 'Echar una mano', meaning: 'To lend a hand / help someone', language: 'Spanish', literalTranslation: 'To throw a hand', example: '¿Me puedes echar una mano con la mudanza?', category: 'Help' },
    { phrase: 'Tirar la casa por la ventana', meaning: 'To spare no expense', language: 'Spanish', literalTranslation: 'To throw the house out the window', example: 'Para su boda, tiraron la casa por la ventana.', category: 'Money' },
    { phrase: 'Dar gato por liebre', meaning: 'To deceive / rip someone off', language: 'Spanish', literalTranslation: 'To give cat for hare', example: 'Me dieron gato por liebre en esa tienda, el producto era falso.', category: 'Deception' },
    { phrase: 'Buscar tres pies al gato', meaning: 'To overcomplicate things / look for trouble', language: 'Spanish', literalTranslation: 'To look for three feet on a cat', example: 'No busques tres pies al gato, la solución es simple.', category: 'Behavior' },
  ];
  await Idiom.bulkCreate(idiomData);

  // Courses - 16 items
  const courseData = [
    { title: 'Spanish for Absolute Beginners', description: 'Start your Spanish journey from zero. Learn the alphabet, basic greetings, and essential phrases.', language: 'Spanish', level: 'Beginner', totalLessons: 20, category: 'General', duration: '4 weeks' },
    { title: 'Conversational Spanish', description: 'Build confidence speaking Spanish in everyday situations.', language: 'Spanish', level: 'Intermediate', totalLessons: 15, category: 'Speaking', duration: '3 weeks' },
    { title: 'Business Spanish', description: 'Master professional Spanish for the workplace, meetings, and negotiations.', language: 'Spanish', level: 'Advanced', totalLessons: 12, category: 'Professional', duration: '6 weeks' },
    { title: 'Spanish Grammar Mastery', description: 'Deep dive into Spanish grammar from basics to advanced structures.', language: 'Spanish', level: 'Intermediate', totalLessons: 25, category: 'Grammar', duration: '8 weeks' },
    { title: 'Travel Spanish', description: 'Essential phrases and vocabulary for traveling in Spanish-speaking countries.', language: 'Spanish', level: 'Beginner', totalLessons: 10, category: 'Travel', duration: '2 weeks' },
    { title: 'Spanish Literature', description: 'Read and analyze classic and contemporary Spanish literature.', language: 'Spanish', level: 'Advanced', totalLessons: 16, category: 'Culture', duration: '8 weeks' },
    { title: 'Medical Spanish', description: 'Learn medical terminology and patient communication in Spanish.', language: 'Spanish', level: 'Advanced', totalLessons: 14, category: 'Professional', duration: '6 weeks' },
    { title: 'Spanish Pronunciation Bootcamp', description: 'Perfect your Spanish accent with intensive pronunciation practice.', language: 'Spanish', level: 'Beginner', totalLessons: 8, category: 'Pronunciation', duration: '2 weeks' },
    { title: 'DELE Exam Preparation B1', description: 'Prepare for the DELE B1 certification exam with practice tests and strategies.', language: 'Spanish', level: 'Intermediate', totalLessons: 20, category: 'Exam Prep', duration: '6 weeks' },
    { title: 'Spanish through Music', description: 'Learn Spanish by analyzing popular Spanish songs and their lyrics.', language: 'Spanish', level: 'Intermediate', totalLessons: 12, category: 'Culture', duration: '3 weeks' },
    { title: 'Kids Spanish', description: 'Fun and engaging Spanish lessons designed for children ages 6-12.', language: 'Spanish', level: 'Beginner', totalLessons: 20, category: 'Kids', duration: '5 weeks' },
    { title: 'Spanish Writing Workshop', description: 'Improve your written Spanish through guided exercises and feedback.', language: 'Spanish', level: 'Intermediate', totalLessons: 10, category: 'Writing', duration: '4 weeks' },
    { title: 'Latin American Culture & Language', description: 'Explore the diverse cultures and linguistic variations across Latin America.', language: 'Spanish', level: 'Intermediate', totalLessons: 18, category: 'Culture', duration: '6 weeks' },
    { title: 'Spanish Verb Bootcamp', description: 'Master all Spanish verb tenses with intensive drills and practice.', language: 'Spanish', level: 'Intermediate', totalLessons: 15, category: 'Grammar', duration: '4 weeks' },
    { title: 'Legal Spanish', description: 'Learn legal terminology and formal written Spanish for legal contexts.', language: 'Spanish', level: 'Advanced', totalLessons: 12, category: 'Professional', duration: '5 weeks' },
    { title: 'Spanish Slang & Colloquialisms', description: 'Understand and use informal Spanish like a native speaker.', language: 'Spanish', level: 'Advanced', totalLessons: 10, category: 'Speaking', duration: '3 weeks' },
  ];
  await Course.bulkCreate(courseData);

  // Progress - 16 items
  const progressData = [
    { feature: 'Vocabulary', activity: 'Learned new words', score: 85, timeSpent: 30, date: '2024-01-15', language: 'Spanish', details: 'Studied 20 new vocabulary words in the Greetings category' },
    { feature: 'Grammar', activity: 'Completed lesson', score: 90, timeSpent: 45, date: '2024-01-15', language: 'Spanish', details: 'Completed Present Tense - Regular Verbs lesson' },
    { feature: 'Conversation', activity: 'Practice session', score: 75, timeSpent: 20, date: '2024-01-16', language: 'Spanish', details: 'Had a conversation practice about ordering at a restaurant' },
    { feature: 'Flashcards', activity: 'Review session', score: 80, timeSpent: 15, date: '2024-01-16', language: 'Spanish', details: 'Reviewed 30 flashcards with 80% accuracy' },
    { feature: 'Quiz', activity: 'Completed quiz', score: 70, timeSpent: 25, date: '2024-01-17', language: 'Spanish', details: 'Scored 70% on Basic Greetings Quiz' },
    { feature: 'Translation', activity: 'Translation practice', score: 95, timeSpent: 35, date: '2024-01-17', language: 'Spanish', details: 'Translated 10 sentences with 95% accuracy' },
    { feature: 'Writing', activity: 'Writing exercise', score: 82, timeSpent: 40, date: '2024-01-18', language: 'Spanish', details: 'Wrote a paragraph about daily routine' },
    { feature: 'Reading', activity: 'Reading comprehension', score: 88, timeSpent: 30, date: '2024-01-18', language: 'Spanish', details: 'Read and answered questions about Mi Primer Día en España' },
    { feature: 'Listening', activity: 'Listening exercise', score: 72, timeSpent: 20, date: '2024-01-19', language: 'Spanish', details: 'Completed weather forecast listening exercise' },
    { feature: 'Cultural Notes', activity: 'Cultural study', score: 100, timeSpent: 15, date: '2024-01-19', language: 'Spanish', details: 'Read about La Siesta Tradition and Day of the Dead' },
    { feature: 'Idioms', activity: 'Idiom practice', score: 65, timeSpent: 20, date: '2024-01-20', language: 'Spanish', details: 'Learned 5 new Spanish idioms' },
    { feature: 'Pronunciation', activity: 'Pronunciation drill', score: 78, timeSpent: 25, date: '2024-01-20', language: 'Spanish', details: 'Practiced pronunciation of difficult Spanish sounds' },
    { feature: 'Tutor', activity: 'Tutor session', score: 90, timeSpent: 30, date: '2024-01-21', language: 'Spanish', details: 'Had a tutoring session about verb conjugation' },
    { feature: 'Vocabulary', activity: 'Vocabulary review', score: 92, timeSpent: 20, date: '2024-01-21', language: 'Spanish', details: 'Reviewed previously learned words with spaced repetition' },
    { feature: 'Grammar', activity: 'Grammar exercise', score: 85, timeSpent: 35, date: '2024-01-22', language: 'Spanish', details: 'Practiced Ser vs Estar exercises' },
    { feature: 'Course', activity: 'Course progress', score: 88, timeSpent: 60, date: '2024-01-22', language: 'Spanish', details: 'Completed 3 lessons in Spanish for Absolute Beginners' },
  ];
  await Progress.bulkCreate(progressData);

  // Tutor Sessions - 16 items
  const tutorData = [
    { topic: 'Basic Verb Conjugation Help', language: 'Spanish', level: 'Beginner', messages: '[]', summary: 'Covered present tense conjugation of regular -ar, -er, -ir verbs' },
    { topic: 'Understanding Subjunctive Mood', language: 'Spanish', level: 'Advanced', messages: '[]', summary: 'Deep dive into when and how to use the subjunctive' },
    { topic: 'Pronunciation Coaching', language: 'Spanish', level: 'Beginner', messages: '[]', summary: 'Worked on rolling R sounds and vowel pronunciation' },
    { topic: 'Travel Vocabulary Expansion', language: 'Spanish', level: 'Intermediate', messages: '[]', summary: 'Learned 25 new travel-related words and phrases' },
    { topic: 'Ser vs Estar Deep Dive', language: 'Spanish', level: 'Intermediate', messages: '[]', summary: 'Detailed comparison with edge cases and practice exercises' },
    { topic: 'Reading Comprehension Strategy', language: 'Spanish', level: 'Intermediate', messages: '[]', summary: 'Techniques for understanding Spanish texts without translating every word' },
    { topic: 'Business Email Writing', language: 'Spanish', level: 'Advanced', messages: '[]', summary: 'Formal email structures and common business phrases in Spanish' },
    { topic: 'Past Tense Confusion', language: 'Spanish', level: 'Intermediate', messages: '[]', summary: 'Clarified difference between preterite and imperfect tenses' },
    { topic: 'Listening Skills Improvement', language: 'Spanish', level: 'Beginner', messages: '[]', summary: 'Tips for understanding native Spanish speakers' },
    { topic: 'Essay Writing Guidance', language: 'Spanish', level: 'Advanced', messages: '[]', summary: 'Structure and style for academic writing in Spanish' },
    { topic: 'Vocabulary Building Strategies', language: 'Spanish', level: 'Beginner', messages: '[]', summary: 'Memory techniques and spaced repetition for learning new words' },
    { topic: 'Cultural Context in Language', language: 'Spanish', level: 'Intermediate', messages: '[]', summary: 'How culture influences language use in different Spanish-speaking countries' },
    { topic: 'Grammar Q&A Session', language: 'Spanish', level: 'Intermediate', messages: '[]', summary: 'Answered various grammar questions about pronouns and prepositions' },
    { topic: 'Conversation Practice Tips', language: 'Spanish', level: 'Beginner', messages: '[]', summary: 'Strategies for maintaining conversations and building confidence' },
    { topic: 'DELE Exam Preparation', language: 'Spanish', level: 'Advanced', messages: '[]', summary: 'Review of exam format and practice with sample questions' },
    { topic: 'Idiomatic Expressions Workshop', language: 'Spanish', level: 'Intermediate', messages: '[]', summary: 'Learned and practiced using common Spanish idioms in context' },
  ];
  await TutorSession.bulkCreate(tutorData);

  // Pronunciation - 16 items
  const pronunciationData = [
    { word: 'Hola', language: 'Spanish', ipa: '/ˈo.la/', syllables: 'Ho-la', tips: 'The H is always silent in Spanish. Stress on first syllable.', commonMistakes: 'Pronouncing the H sound', difficulty: 'beginner' },
    { word: 'Gracias', language: 'Spanish', ipa: '/ˈɡɾa.θjas/', syllables: 'Gra-cias', tips: 'In Spain, the "ci" makes a "th" sound. In Latin America, it\'s an "s" sound.', commonMistakes: 'Using English "sh" sound instead of "s" or "th"', difficulty: 'beginner' },
    { word: 'Perro', language: 'Spanish', ipa: '/ˈpe.ro/', syllables: 'Pe-rro', tips: 'The double R requires a trilled/rolled sound. Place tongue behind upper teeth and let air vibrate.', commonMistakes: 'Not rolling the double R', difficulty: 'intermediate' },
    { word: 'Desarrollo', language: 'Spanish', ipa: '/de.sa.ˈro.ʎo/', syllables: 'De-sa-rro-llo', tips: 'Contains both a rolled R and the LL sound. Practice each separately first.', commonMistakes: 'Incorrect stress placement and weak R roll', difficulty: 'advanced' },
    { word: 'Cerveza', language: 'Spanish', ipa: '/θeɾ.ˈβe.θa/', syllables: 'Cer-ve-za', tips: 'In Spain: "ther-VEH-tha". In Latin America: "ser-VEH-sa". Stress on second syllable.', commonMistakes: 'Using English "s" sound in all contexts', difficulty: 'intermediate' },
    { word: 'Guadalajara', language: 'Spanish', ipa: '/ɡwa.ða.la.ˈxa.ɾa/', syllables: 'Gua-da-la-ja-ra', tips: 'The J makes a strong "H" sound from the back of the throat.', commonMistakes: 'Pronouncing J like English J instead of Spanish aspirated H', difficulty: 'intermediate' },
    { word: 'Lluvia', language: 'Spanish', ipa: '/ˈʎu.βja/', syllables: 'Llu-via', tips: 'LL sounds like "y" in most Latin American Spanish or "ly" in some regions.', commonMistakes: 'Pronouncing LL as English L', difficulty: 'beginner' },
    { word: 'Ñoño', language: 'Spanish', ipa: '/ˈɲo.ɲo/', syllables: 'Ño-ño', tips: 'The Ñ is like "ny" in "canyon". Place tongue on roof of mouth.', commonMistakes: 'Pronouncing Ñ as regular N', difficulty: 'beginner' },
    { word: 'Murciélago', language: 'Spanish', ipa: '/muɾ.ˈθje.la.ɣo/', syllables: 'Mur-cié-la-go', tips: 'Contains all 5 vowels! Stress on the "cié" syllable.', commonMistakes: 'Wrong stress placement, skipping vowels', difficulty: 'advanced' },
    { word: 'Vergüenza', language: 'Spanish', ipa: '/beɾ.ˈɣwen.θa/', syllables: 'Ver-güen-za', tips: 'The Ü with dieresis means you pronounce the U (unlike regular "gue" where U is silent).', commonMistakes: 'Not pronouncing the U in güe', difficulty: 'advanced' },
    { word: 'Trabajo', language: 'Spanish', ipa: '/tɾa.ˈβa.xo/', syllables: 'Tra-ba-jo', tips: 'The J sounds like a strong H. The B between vowels is a soft sound.', commonMistakes: 'Hard B sound between vowels, English J sound', difficulty: 'beginner' },
    { word: 'Entonces', language: 'Spanish', ipa: '/en.ˈton.θes/', syllables: 'En-ton-ces', tips: 'Stress on the second syllable. Common linking word that should flow smoothly.', commonMistakes: 'Stressing the wrong syllable', difficulty: 'beginner' },
    { word: 'Quiero', language: 'Spanish', ipa: '/ˈkje.ɾo/', syllables: 'Quie-ro', tips: 'QU in Spanish always sounds like K (never KW). The ie is a diphthong.', commonMistakes: 'Pronouncing QU as KW like in English "question"', difficulty: 'beginner' },
    { word: 'Huevo', language: 'Spanish', ipa: '/ˈwe.βo/', syllables: 'Hue-vo', tips: 'Remember: H is silent! HUE sounds like "WEH". V sounds like a soft B.', commonMistakes: 'Pronouncing the H, using English V sound', difficulty: 'intermediate' },
    { word: 'Excelente', language: 'Spanish', ipa: '/ek.se.ˈlen.te/', syllables: 'Ex-ce-len-te', tips: 'X before a consonant sounds like "ks". Stress on "len".', commonMistakes: 'Using English "eks-SEL-ent" stress pattern', difficulty: 'intermediate' },
    { word: 'Zapatería', language: 'Spanish', ipa: '/θa.pa.te.ˈɾi.a/', syllables: 'Za-pa-te-rí-a', tips: 'Accent on the í indicates stress there. Z sounds like "th" in Spain, "s" in Latin America.', commonMistakes: 'Wrong stress placement, English Z sound', difficulty: 'intermediate' },
  ];
  await Pronunciation.bulkCreate(pronunciationData);

  console.log('✅ Database seeded successfully with 16 items per feature!');
  process.exit(0);
}

seed().catch(err => {
  console.error('Seeding error:', err);
  process.exit(1);
});
