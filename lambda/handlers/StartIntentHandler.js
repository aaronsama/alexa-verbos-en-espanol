const { getSlot } = require("ask-sdk-core");
const {
  randomVerb,
  textForVerbPrompt,
  randomMood,
  randomTense,
} = require("../shared/verbs");
const { problemText } = require("../shared/phrases.json");

function moodIsAlreadySet(sessionAttributes) {
  return sessionAttributes.mood !== undefined;
}

function getMoodFromSlot(requestedVerbMoodSlot) {
  if (!requestedVerbMoodSlot.resolutions) return requestedVerbMoodSlot.value;

  const {
    resolutions: { resolutionsPerAuthority },
  } = requestedVerbMoodSlot;

  return resolutionsPerAuthority[0].values[0].value.id;
}

async function setCurrentSessionAttributes(handlerInput, sessionAttributes) {
  const mood = sessionAttributes.mood || randomMood();
  const tense = randomTense(mood);
  const { infinitive, conjugation } = await randomVerb(mood, tense);

  sessionAttributes.infinitive = infinitive;
  sessionAttributes.conjugation = conjugation;
  sessionAttributes.mood = mood;
  sessionAttributes.tense = tense;
  handlerInput.attributesManager.setSessionAttributes(sessionAttributes);

  return {
    infinitive,
    mood,
    tense,
  };
}

const StartIntentHandler = {
  canHandle(handlerInput) {
    const {
      requestEnvelope: { request },
      attributesManager,
    } = handlerInput;

    return (
      request.type === "IntentRequest" &&
      (request.intent.name === "StartIntent" ||
        (request.intent.name === "AMAZON.YesIntent" &&
          moodIsAlreadySet(attributesManager.getSessionAttributes())))
    );
  },
  async handle(handlerInput) {
    const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();

    if (!moodIsAlreadySet(sessionAttributes)) {
      const requestedVerbMoodSlot = getSlot(
        handlerInput.requestEnvelope,
        "mood",
      );
      const requestedVerbMood = getMoodFromSlot(requestedVerbMoodSlot);

      if (requestedVerbMood !== "ALL") {
        sessionAttributes.mood = requestedVerbMood;
      }
    }

    try {
      const responseBuilder = handlerInput.responseBuilder;
      const { infinitive, mood, tense } = await setCurrentSessionAttributes(
        handlerInput,
        sessionAttributes,
      );
      const speechText = textForVerbPrompt(infinitive, mood, tense);

      if (mood === "indicativo" || mood === "subjuntivo") {
        responseBuilder.addDelegateDirective({
          name: "ConjugationResponseIntent",
          confirmationStatus: "NONE",
          slots: {},
        });
      }

      return responseBuilder
        .speak(speechText)
        .withShouldEndSession(false)
        .getResponse();
    } catch (e) {
      console.log(e);
      return handlerInput.responseBuilder.speak(problemText).getResponse();
    }
  },
};

module.exports = StartIntentHandler;
