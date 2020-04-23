const { fetchConjugation, normalizedMood } = require("../shared/verbs");
const fullConjugation = require("../shared/fullConjugation");
const conjugationSlots = require("../shared/conjugationSlots");
const nextConjugationSlotToElicit = require("../shared/nextConjugationSlotToElicit");
const { longHelpText, helpText, indicativoHelpTexts, subjuntivoHelpTexts, participioHelpText, gerundioHelpText, errorText } = require("../shared/phrases.json");

const exampleConjugation = async (infinitive, mood, tense) => {
  const conjugation = await fetchConjugation(infinitive, mood, tense);
  return fullConjugation(conjugation);
}

// TODO handle similarities and irregular verbs
const specificHelpFor = async (infinitive, mood, tense) => {
  const termination = infinitive.slice(-2);
  let exampleVerb;

  switch (termination) {
    case "ar":
      exampleVerb = "amar";
      break;
    case "er":
      exampleVerb = "comer";
      break;
    case "ir":
      exampleVerb = "vivir";
      break;
    default:
      return "";
  }

  const example = await exampleConjugation(exampleVerb, mood, tense);

  return `
    <s>${infinitive} termina en "${termination}".</s>
    <s>"${exampleVerb}" es otro verbo que termina en "${termination}" y al ${tense} se conjuga así: ${example}.</s>
    `;
}

const HelpIntentHandler = {
  canHandle(handlerInput) {
    return (
      handlerInput.requestEnvelope.request.type === "IntentRequest" &&
      handlerInput.requestEnvelope.request.intent.name === "AMAZON.HelpIntent"
    );
  },
  async handle(handlerInput) {
    const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
    const { infinitive, mood, tense } = sessionAttributes;

    if (infinitive && mood) {
      let responseHelpText;
      let specificHelp;
      let intentToChain;

      switch (mood) {
        case "indicativo":
          specificHelp = await specificHelpFor(infinitive, mood, tense);
          responseHelpText = `
            <p>${indicativoHelpTexts[tense]}</p>
            <p>${specificHelp}</p>
            `;
          intentToChain = "ConjugationResponseIntent";
          break;
        case "subjuntivo":
          specificHelp = await specificHelpFor(infinitive, mood, tense);
          responseHelpText = `
            <p>${subjuntivoHelpTexts[tense]}</p>
            <p>${specificHelp}</p>
            `;
          intentToChain = "ConjugationResponseIntent";
          break;
        case "gerund":
          responseHelpText = gerundioHelpText;
          intentToChain = "GerundResponseIntent";
          break;
        case "pastparticiple":
          responseHelpText = participioHelpText;
          intentToChain = "ParticipleResponseIntent";
          break;
        default:
          responseHelpText = errorText;
      }

      const responseBuilder = handlerInput.responseBuilder;

      if (
        intentToChain === "ConjugationResponseIntent") {
        const providedSlots = sessionAttributes[intentToChain] !== undefined ? sessionAttributes[intentToChain].slots : {};
        const nextSlotToProvide = nextConjugationSlotToElicit(providedSlots);

        responseHelpText =
          responseHelpText +
          "\n" +
          `<s>¿Entonces puedes decirme la ${conjugationSlots[nextSlotToProvide]} de ${infinitive}?</s>`;

        responseBuilder.addElicitSlotDirective(nextSlotToProvide, {
          name: intentToChain,
          confirmationStatus: "NONE",
          slots: providedSlots,
        });
      } else if (intentToChain === "GerundResponseIntent" || intentToChain === "ParticipleResponseIntent") {
          responseHelpText +=
          "\n" +
          `<s>¿Entonces puedes decirme el ${normalizedMood(mood)} de ${infinitive}?</s>`;
      }

      return responseBuilder.speak(responseHelpText).withShouldEndSession(false).getResponse();
    } else {
      return handlerInput.responseBuilder
        .speak(`${longHelpText} ${helpText}`)
        .reprompt(helpText)
        .getResponse();
    }
  },
};

module.exports = HelpIntentHandler;
