const clearVerb = (handlerInput, sessionAttributes) => {
    sessionAttributes.infinitive = undefined;
    sessionAttributes.tense = undefined;
    sessionAttributes.conjugation = undefined;
    
    let intentForMood;
    
    switch (sessionAttributes.mood) {
        case "indicativo":
        case "subjuntivo":
            intentForMood = "ConjugationResponseIntent";
            break;
        case "pastparticiple":
            intentForMood = "ParticipleResponseIntent";
            break;
        case "gerund":
            intentForMood = "GerundResponseIntent";
            break;
    }
    
    if (intentForMood) {
        sessionAttributes[intentForMood] = undefined;
    }
    
    handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
}

module.exports = clearVerb;