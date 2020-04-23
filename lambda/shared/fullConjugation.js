const fullConjugation = obj => {
  let response = "";

  if (obj["form_1s"])
    response += `yo ${obj["form_1s"].S ? obj["form_1s"].S : obj["form_1s"]}`;
  if (obj["form_2s"])
    response += `, tú ${obj["form_2s"].S ? obj["form_2s"].S : obj["form_2s"]}`;
  if (obj["form_3s"])
    response += `, el ${obj["form_3s"].S ? obj["form_3s"].S : obj["form_3s"]}`;
  if (obj["form_1p"])
    response += `, nosotros ${
      obj["form_1p"].S ? obj["form_1p"].S : obj["form_1p"]
    }`;
  if (obj["form_2p"])
    response += `, vosotros ${
      obj["form_2p"].S ? obj["form_2p"].S : obj["form_2p"]
    }`;
  if (obj["form_3p"])
    response += `, ellos ${
      obj["form_3p"].S ? obj["form_3p"].S : obj["form_3p"]
    }`;

  return response;
};

module.exports = fullConjugation;
