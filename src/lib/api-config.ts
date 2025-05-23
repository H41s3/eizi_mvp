export interface ApiConfig {
  chatAI: {
    provider: 'openai';
    apiKey: string;
    model: string;
  };
}

const API_KEY = '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';

export const defaultApiConfig: ApiConfig = {
  chatAI: {
    provider: 'openai',
    apiKey: API_KEY,
    model: 'gpt-4'
  }
};

export const loadApiConfig = (): ApiConfig => {
  return defaultApiConfig;
};

export const saveApiConfig = (config: ApiConfig): void => {
  // Since we're using a hardcoded API key, we don't need to save anything
  return;
}; 