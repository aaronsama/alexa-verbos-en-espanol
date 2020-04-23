const Alexa = require("ask-sdk-core");
// const persistenceAdapter = require("ask-sdk-s3-persistence-adapter");
const LaunchRequestHandler = require("./handlers/LaunchRequestHandler");
const StartIntentHandler = require("./handlers/StartIntentHandler");
const GerundResponseIntentHandler = require("./handlers/GerundResponseIntentHandler");
const ParticipleResponseIntentHandler = require("./handlers/ParticipleResponseIntentHandler");
const ConjugationResponseIntentHandler = require("./handlers/ConjugationResponseIntentHandler");
const DontKnowIntentHandler = require("./handlers/DontKnowIntentHandler");
const CancelAndStopIntentHandler = require("./handlers/CancelAndStopIntentHandler");
const HelpIntentHandler = require("./handlers/HelpIntentHandler");
const DialogManagementStateInterceptor = require("./interceptors/DialogManagementStateInterceptor");
const FallbackIntentHandler = require("./handlers/FallbackIntentHandler");
const { errorText } = require("./shared/phrases.json");

const SessionEndedRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === "SessionEndedRequest";
  },
  handle(handlerInput) {
    // Any cleanup logic goes here.
    return handlerInput.responseBuilder.getResponse();
  }
};

// Generic error handling to capture any syntax or routing errors. If you receive an error
// stating the request handler chain is not found, you have not implemented a handler for
// the intent being invoked or included it in the skill builder below.
const ErrorHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput, error) {
    console.log(`~~~~ Error handled: ${error.message}`);
    console.log(handlerInput);
    console.log(error);

    return handlerInput.responseBuilder
      .speak(errorText)
      .reprompt(errorText)
      .getResponse(); // TODO: keep session
  }
};

// This handler acts as the entry point for your skill, routing all request and response
// payloads to the handlers above. Make sure any new handlers or interceptors you've
// defined are included below. The order matters - they're processed top to bottom.
exports.handler = Alexa.SkillBuilders.custom()
  .addRequestHandlers(
    LaunchRequestHandler,
    StartIntentHandler,
    HelpIntentHandler,
    CancelAndStopIntentHandler,
    GerundResponseIntentHandler,
    ParticipleResponseIntentHandler,
    ConjugationResponseIntentHandler,
    DontKnowIntentHandler,
    SessionEndedRequestHandler,
    FallbackIntentHandler
  ) // make sure IntentReflectorHandler is last so it doesn't override your custom intent handlers
  .addRequestInterceptors(
    DialogManagementStateInterceptor
  )
  .addErrorHandlers(ErrorHandler)
  .lambda();
//   .withPersistenceAdapter(
//     new persistenceAdapter.S3PersistenceAdapter({
//       bucketName: process.env.S3_PERSISTENCE_BUCKET
//     })
//   )
