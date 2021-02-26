// Imports the Google Cloud client library
const { Translate } = require("@google-cloud/translate").v2;

// Creates a client
const translate = new Translate();

/**
 * TODO(developer): Uncomment the following lines before running the sample.
 */
const text = "ईश्वर का भुगतान करें 500 रुपये";
const target = "en";

async function translateText() {
  // Translates the text into the target language. "text" can be a string for
  // translating a single piece of text, or an array of strings for translating
  // multiple texts.
  let [translations] = await translate.translate(text, {
    to: "en",
    from: "hi",
  });
  translations = Array.isArray(translations) ? translations : [translations];
  console.log("Translations:");
  translations.forEach((translation, i) => {
    console.log(`${text[i]} => (${target}) ${translation}`);
  });
}

translateText();
