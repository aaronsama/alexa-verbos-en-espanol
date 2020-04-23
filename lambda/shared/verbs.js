const AWS = require("aws-sdk");
const { roleArn } = require("./credentials.json");

// 1. Assume the AWS resource role using STS AssumeRole Action
const STS = new AWS.STS({ apiVersion: "2011-06-15" });

const getCredentials = async () => {
  return await STS.assumeRole(
    {
      RoleArn: roleArn,
      RoleSessionName: "SkillRoleSession" // You can rename with any name
    },
    (err, res) => {
      if (err) {
        console.log("AssumeRole FAILED: ", err);
        throw new Error("Error while assuming role");
      }
      return res;
    }
  ).promise();
};

const getDynamoDBInstance = async () => {
  const credentials = await getCredentials();

  return new AWS.DynamoDB({
    apiVersion: "2012-08-10",
    accessKeyId: credentials.Credentials.AccessKeyId,
    secretAccessKey: credentials.Credentials.SecretAccessKey,
    sessionToken: credentials.Credentials.SessionToken,
    region: "eu-central-1",
  });
}

const onError = err => {
  console.error("Error JSON:", JSON.stringify(err, null, 2));
};

const starters = ["venga", "vámonos", "bueno", "pues vale", "pues vaya"];

const textForVerbPrompt = (infinitive, mood, tense = undefined) => {
  const randomStarter = `<say-as interpret-as="interjection">${starters[Math.floor(Math.random() * starters.length)]}</say-as>`;    
    
  if (mood !== "gerund" && mood !== "pastparticiple") {
    return `<speak>${randomStarter}, dime el ${mood} ${tense} de ${infinitive}</speak>`;
  } else {
    if (mood === "gerund") return `<speak>${randomStarter}, dime el gerundio de ${infinitive}</speak>`;
    if (mood === "pastparticiple")
      return `<speak>${randomStarter}, dime el participio de ${infinitive}</speak>`;
  }
};

const fetchConjugation = async(infinitive, mood, tense) => {
  const dynamoDB = await getDynamoDBInstance();

  const paramsForGet = {
    TableName: "Verbs",
    Key: {
      infinitive: { S: infinitive },
    },
  };

  const allConjugations = await dynamoDB.getItem(paramsForGet).promise();
  
  if (mood) {
    if (tense) {
      return allConjugations.Item.conjugation.M[mood]["M"][tense]["M"];
    }

    return allConjugations.Item.conjugation.M[mood]["S"];
  }

  return allConjugations.Item.conjugation.M;
}

const randomVerb = async (mood, tense) => {
  const dynamoDB = await getDynamoDBInstance();

  const data = await dynamoDB
    .scan({
      TableName: "Verbs",
      AttributesToGet: ["infinitive"]
    })
    .promise();

  const length = data.Items.length;
  const infinitive = data.Items[Math.floor(Math.random() * length)].infinitive.S;
  const conjugation = await fetchConjugation(infinitive, mood, tense);

  return {
    infinitive,
    conjugation
  };
};

const moods = ["gerund", "pastparticiple", "indicativo", "subjuntivo"];

const randomMood = () => {
  const mood = moods[Math.floor(Math.random() * moods.length)];

  return mood;
};

const tenses = {
    indicativo: ["condicional", "futuro", "imperfecto", "presente", "pretérito"],
    subjuntivo: ["imperfecto", "presente"]
};

const randomTense = mood => {
  const tensesForMood = tenses[mood];
  
  if (tensesForMood === undefined) return null;
  
  return tensesForMood[Math.floor(Math.random() * tensesForMood.length)];
};

const normalizedMood = mood => {
  switch (mood) {
    case "gerund":
      return "gerundio";
    case "pastparticiple":
      return "participio";
    default:
      return mood;
  }
};

module.exports = { fetchConjugation, randomVerb, textForVerbPrompt, randomMood, randomTense, normalizedMood };
