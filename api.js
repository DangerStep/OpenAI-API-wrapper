const axios = require('axios');

const waitForResult = (promise) => {
  let result;
  let done = false;
  promise.then((res) => {
    result = res;
    done = true;
  });
  while (!done) {
    require("deasync").runLoopOnce();
  }
  return result;
}

const basicRequest = (message, apiKey) => {
  if (!apiKey) {
    return Promise.resolve("Please input your API key.");
  }
  const client = axios.create({
    headers: {
      Authorization: "Bearer " + apiKey,
    },
  });

  const params = {
    //tweak these to your liking
    prompt: message,
    model: "text-davinci-003",
    max_tokens: 200,
    temperature: 0,
  };

  const promise = client.post("https://api.openai.com/v1/completions", params)
    .then(result => result.data.choices[0].text)
    .catch(err => {
      if (err.response && err.response.data && err.response.data.error) {
        const errorMessage = err.response.data.error.message;
        return Promise.resolve(`Error: ${errorMessage}`);
      } else {
        return sendRequest(`Please simplify this error message: ${err}`, 'text-curie-001', 20, apiKey);
      }
    });

  return waitForResult(promise);
}



const sendRequest = async (message, model="text-davinci-003", max_tokens, apiKey) => {
  if (apiKey == "YOUR_API_KEY" ?? '') {
    return "Please input YOUR API key."
  }
  const client = axios.create({
    headers: {
      Authorization: "Bearer " + apiKey,
    },
  });

  const params = {
    prompt: message,
    model: model,
    max_tokens: max_tokens,
    temperature: 0,
  };

  try {
    const result = await client.post("https://api.openai.com/v1/completions", params);
    return result.data.choices[0].text;
  } catch (err) {
    throw err;
  }
};

const summarizeText = async (text, model = "text-davinci-003", sentences=1, apiKey) => {
  if (apiKey == "YOUR_API_KEY" ?? '') {
    return "Please input YOUR API key."
  }
  const client = axios.create({
    headers: {
      Authorization: "Bearer " + apiKey,
    },
  });

  const params = {
    model: model,
    prompt: `Please summarize the following text in ${sentences} sentence/s:\n\n${text}`,
    max_tokens: 100,
    temperature: 0.5,
    stop: ""
  };

  try {
    const result = await client.post("https://api.openai.com/v1/completions", params);
    return result.data.choices[0].text;
  } catch (err) {
    throw err;
  }
};

const generateDialogue = async (prompt, model="text-davinci-003", apiKey) => {
  if (apiKey == "YOUR_API_KEY" ?? '') {
    return "Please input YOUR API key."
  }
  const client = axios.create({
    headers: {
      Authorization: "Bearer " + apiKey,
    },
  });

  const params = {
    prompt: prompt,
    model: model,
    temperature: 0.7,
    max_tokens: 2048,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    stop: ["\n"]
  };

  try {
    const result = await client.post("https://api.openai.com/v1/completions", params);
    return result.data.choices[0].text;
  } catch (err) {
    throw err;
  }
};

const createMarketingCopy = async (productType, audience, apiKey) => {
  if (apiKey == "YOUR_API_KEY" ?? '') {
    return "Please input YOUR API key."
  }

  const client = axios.create({
    headers: {
      Authorization: `Bearer ${apiKey}`
    }
  });

  const prompt = `Generate marketing copy for ${productType} targeting ${audience}`;

  const params = {
    prompt,
    model: 'text-davinci-003',
    max_tokens: 60,
    temperature: 0.7
  };

  try {
    const response = await client.post('https://api.openai.com/v1/completions', params);
    return response.data.choices[0].text;
  } catch (error) {
    console.error(error);
  }
};

const PlotTwist = async (input, model = 'text-davinci-003', apiKey) => {
  if (apiKey == "YOUR_API_KEY" ?? '') {
    return "Please input YOUR API key."
  }

  const client = axios.create({
    headers: {
      Authorization: `Bearer ${apiKey}`
    }
  });

  const params = {
    prompt: `What would be a good alternative ending for ${input}?`,
    model: model,
    max_tokens: 100,
    temperature: 0.7,
    stop: '###'
  };

  try {
    const response = await client.post('https://api.openai.com/v1/completions', params);
    const alternativeEnding = response.data.choices[0].text.trim();
    return alternativeEnding;
  } catch (error) {
    throw error;
  }
};

const generateNames = async (keywords, model = 'text-davinci-003', numNames = 10, apiKey) => {
if (apiKey == "YOUR_API_KEY" ?? '') {
    return "Please input YOUR API key."
  }

  const prompt = `Generate ${numNames} product or business names based on the following keywords: ${keywords.join(', ')}.`;

  const params = {
    prompt: prompt,
    model: model,
    max_tokens: 60,
    temperature: 0.7,
    n: numNames,
    stop: '\n',
  };

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${apiKey}`
  };

  try {
    const response = await axios.post('https://api.openai.com/v1/completions', params, { headers: headers });
    const names = response.data.choices.map(choice => choice.text.trim());
    return names;
  } catch (error) {
    throw error;
  }
};



module.exports = {
  basicRequest: basicRequest,
  sendRequest: sendRequest,
  summarizeText: summarizeText,
  generateDialogue: generateDialogue,
  createMarketingCopy: createMarketingCopy,
  PlotTwist: PlotTwist,
  generateNames: generateNames
  };
