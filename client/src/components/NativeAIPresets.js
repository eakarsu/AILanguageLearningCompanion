import React from 'react';

const examples = [
  { label: 'Travel practice', language: 'Spanish', level: 'beginner', topic: 'Ordering breakfast at a café', word: 'desayuno', phrase: 'Quisiera un café con leche, por favor.', idiom: 'Estar en las nubes', message: 'Hola, quisiera pedir un café y una tostada. ¿Cuánto cuesta?', text: 'Ayer yo voy al mercado y compro frutas frescas.', passage: 'María visita un mercado en Madrid. Compra pan y fruta para preparar el desayuno.', courseName: 'Spanish for Travel', goals: 'Order food and ask for directions with confidence.', weakAreas: 'Past-tense verbs and restaurant vocabulary.', prompt: 'Write about a recent visit to a café.', scenario: 'café conversation', country: 'Spain', minutes: '30', count: '5', learnerNativeLanguage: 'English', sourceLanguage: 'English', targetLanguage: 'Spanish' },
  { label: 'Workplace practice', language: 'French', level: 'intermediate', topic: 'Planning a team meeting', word: 'réunion', phrase: 'Pourrions-nous déplacer la réunion à lundi ?', idiom: 'Avoir le cafard', message: 'Bonjour, pouvons-nous confirmer l’ordre du jour de la réunion ?', text: 'Hier, nous avons discuter des objectifs de l’équipe.', passage: 'Camille prépare une réunion avec son équipe. Elle envoie un ordre du jour et demande des commentaires.', courseName: 'French at Work', goals: 'Lead a short meeting and summarize decisions.', weakAreas: 'Formal requests and past participles.', prompt: 'Summarize a team meeting.', scenario: 'team meeting', country: 'France', minutes: '45', count: '8', learnerNativeLanguage: 'English', sourceLanguage: 'English', targetLanguage: 'French' },
  { label: 'Everyday practice', language: 'German', level: 'advanced', topic: 'Discussing local transport', word: 'Fahrplan', phrase: 'Wann fährt der nächste Zug zum Hauptbahnhof?', idiom: 'Ich verstehe nur Bahnhof', message: 'Guten Tag, wissen Sie, ob der nächste Zug pünktlich ist?', text: 'Wenn ich früher angekommen wäre, ich hätte den Zug genommen.', passage: 'Lena prüft den Fahrplan. Wegen einer Verspätung nimmt sie die Straßenbahn zum Hauptbahnhof.', courseName: 'Everyday German', goals: 'Explain a travel delay and compare transport options.', weakAreas: 'Conditional clauses and transport terminology.', prompt: 'Describe a delayed journey.', scenario: 'train station', country: 'Germany', minutes: '60', count: '10', learnerNativeLanguage: 'English', sourceLanguage: 'English', targetLanguage: 'German' },
];

export function nativeAIPresets(fields) {
  return examples.map(({ label, ...values }) => ({
    label,
    values: Object.fromEntries(fields.map((field) => {
      const key = field.name || field.key;
      return [key, values[key] ?? field.default ?? `${values.topic} in ${values.language}`];
    })),
  }));
}

export default function NativeAIPresets({ fields, onChoose, disabled }) {
  return <div className="ai-preset-bar"><strong>Fill every field</strong><div className="ai-actions">{nativeAIPresets(fields).map((preset) => <button key={preset.label} type="button" className="btn btn-secondary" disabled={disabled} onClick={() => onChoose(preset.values)}>{preset.label}</button>)}</div></div>;
}
