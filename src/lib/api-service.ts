import { loadApiConfig, saveApiConfig, ApiConfig } from './api-config';

/**
 * API Service for Eizi
 * Handles all external API communications
 */

// Interface for chat completion requests
interface ChatCompletionRequest {
  messages: Array<{
    role: 'system' | 'user' | 'assistant';
    content: string;
  }>;
  temperature?: number;
  max_tokens?: number;
}

// Interface for API responses
interface ApiResponse {
  success: boolean;
  data?: any;
  error?: string;
}

// Get API configuration
const getConfig = (): ApiConfig => {
  return loadApiConfig();
};

/**
 * Send a message to the AI service
 */
export const sendChatMessage = async (
  messages: Array<{
    role: 'system' | 'user' | 'assistant';
    content: string;
  }>,
  options: { temperature?: number; max_tokens?: number } = {}
): Promise<ApiResponse> => {
  const config = getConfig();
  
  // Check if API key is configured
  if (!config.chatAI.apiKey) {
    return {
      success: false,
      error: 'API key not configured. Please add your API key in Settings.'
    };
  }

  // Different API endpoints based on provider
  let apiEndpoint = '';
  let requestBody = {};
  
  try {
    switch (config.chatAI.provider) {
      case 'openai':
        apiEndpoint = 'https://api.openai.com/v1/chat/completions';
        requestBody = {
          model: config.chatAI.model,
          messages: messages,
          temperature: options.temperature || 0.7,
          max_tokens: options.max_tokens || 1000
        };
        break;
      case 'anthropic':
        apiEndpoint = 'https://api.anthropic.com/v1/messages';
        requestBody = {
          model: config.chatAI.model,
          messages: messages,
          max_tokens: options.max_tokens || 1000
        };
        break;
      case 'mistral':
        apiEndpoint = 'https://api.mistral.ai/v1/chat/completions';
        requestBody = {
          model: config.chatAI.model,
          messages: messages,
          temperature: options.temperature || 0.7,
          max_tokens: options.max_tokens || 1000
        };
        break;
      case 'perplexity':
        apiEndpoint = 'https://api.perplexity.ai/chat/completions';
        requestBody = {
          model: config.chatAI.model,
          messages: messages,
          temperature: options.temperature || 0.7,
          max_tokens: options.max_tokens || 1000
        };
        break;
      default:
        return {
          success: false,
          error: 'Unknown AI provider. Please check your settings.'
        };
    }

    // Make the API call
    const response = await fetch(apiEndpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${config.chatAI.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    // Parse and process the response
    const data = await response.json();
    
    if (!response.ok) {
      console.error('API error:', data);
      return {
        success: false,
        error: data.error?.message || 'Failed to get response from AI service.'
      };
    }

    // Process different response formats based on provider
    let content = '';
    switch (config.chatAI.provider) {
      case 'openai':
        content = data.choices[0]?.message?.content || '';
        break;
      case 'anthropic':
        content = data.content[0]?.text || '';
        break;
      case 'mistral':
      case 'perplexity':
        content = data.choices[0]?.message?.content || '';
        break;
      default:
        content = 'No content from AI service.';
    }

    return {
      success: true,
      data: {
        message: {
          role: 'assistant',
          content: content
        },
        rawResponse: data
      }
    };
  } catch (error) {
    console.error('API call error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error during API call'
    };
  }
};

/**
 * Convert text to speech using configured voice AI
 */
export const textToSpeech = async (text: string): Promise<ApiResponse> => {
  const config = getConfig();
  
  if (!config.voiceAI || !config.voiceAI.apiKey) {
    return {
      success: false,
      error: 'Voice API not configured. Please add your Voice API key in Settings.'
    };
  }

  try {
    let apiEndpoint = '';
    let requestBody = {};
    let headers: Record<string, string> = {
      'Authorization': `Bearer ${config.voiceAI.apiKey}`,
      'Content-Type': 'application/json'
    };
    
    switch (config.voiceAI.provider) {
      case 'elevenlabs':
        apiEndpoint = `https://api.elevenlabs.io/v1/text-to-speech/${config.voiceAI.voiceId || 'EXAVITQu4vr4xnSDxMaL'}`;
        requestBody = {
          text: text,
          model_id: 'eleven_multilingual_v2',
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75
          }
        };
        break;
      case 'google':
        apiEndpoint = 'https://texttospeech.googleapis.com/v1/text:synthesize';
        requestBody = {
          input: { text },
          voice: { languageCode: 'en-US', ssmlGender: 'NEUTRAL' },
          audioConfig: { audioEncoding: 'MP3' }
        };
        break;
      case 'azure':
        apiEndpoint = 'https://your-azure-region.tts.speech.microsoft.com/cognitiveservices/v1';
        headers = {
          'Ocp-Apim-Subscription-Key': config.voiceAI.apiKey,
          'Content-Type': 'application/ssml+xml',
          'X-Microsoft-OutputFormat': 'audio-16khz-128kbitrate-mono-mp3'
        };
        requestBody = `<speak version='1.0' xml:lang='en-US'><voice xml:lang='en-US'><prosody rate='0'>${text}</prosody></voice></speak>`;
        break;
      default:
        return {
          success: false,
          error: 'Unknown voice provider. Please check your settings.'
        };
    }

    const response = await fetch(apiEndpoint, {
      method: 'POST',
      headers: headers,
      body: typeof requestBody === 'string' ? requestBody : JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Voice API error:', errorText);
      return {
        success: false,
        error: `Voice API error: ${response.status} ${response.statusText}`
      };
    }

    // Handle different response formats
    let audioData;
    if (config.voiceAI.provider === 'elevenlabs') {
      audioData = await response.blob();
      const audioUrl = URL.createObjectURL(audioData);
      return {
        success: true,
        data: {
          audioUrl,
          duration: 0 // ElevenLabs doesn't provide duration in the response
        }
      };
    } else {
      // For Google and Azure, process the response differently
      const data = await response.json();
      const audioContent = data.audioContent || data.audio;
      
      if (!audioContent) {
        return {
          success: false,
          error: 'No audio content in response'
        };
      }
      
      // Convert base64 to blob
      const byteCharacters = atob(audioContent);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'audio/mp3' });
      const audioUrl = URL.createObjectURL(blob);
      
      return {
        success: true,
        data: {
          audioUrl,
          duration: 0 // Estimated duration not available
        }
      };
    }
  } catch (error) {
    console.error('Voice API error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error during voice API call'
    };
  }
};

// Save the API key for immediate use
export const saveApiKey = (apiKey: string, provider: 'openai' | 'anthropic' | 'mistral' | 'perplexity' = 'openai'): void => {
  const config = getConfig();
  config.chatAI.apiKey = apiKey;
  config.chatAI.provider = provider;
  saveApiConfig(config);
};
