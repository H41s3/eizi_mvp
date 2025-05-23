export interface ApiConfig {
  chatAI: {
    provider: 'openai';
    apiKey: string;
    model: string;
  };
}

// Default empty config
const defaultConfig: ApiConfig = {
  chatAI: {
    provider: 'openai',
    apiKey: '', // API key should be provided through environment variables or user input
    model: 'gpt-3.5-turbo'
  }
};

export const loadApiConfig = (): ApiConfig => {
  const storedConfig = localStorage.getItem('api-config');
  if (storedConfig) {
    return JSON.parse(storedConfig);
  }
  return defaultConfig;
};

export const saveApiConfig = (config: ApiConfig): void => {
  localStorage.setItem('api-config', JSON.stringify(config));
}; 