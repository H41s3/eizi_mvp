import { loadApiConfig, saveApiConfig, ApiConfig } from './api-config';
import type { OpenAIResponse } from '@/types/openai';

/**
 * API Service for Eizi
 * Handles all external API communications through Netlify Functions
 */

// In development, use the full URL. In production, Netlify Functions are available at /.netlify/functions/
const FUNCTION_URL = import.meta.env.DEV 
  ? 'http://localhost:8888/.netlify/functions/openai-proxy'
  : '/.netlify/functions/openai-proxy';

// Interface for chat completion requests
interface ChatCompletionRequest {
  messages: Array<{
    role: 'system' | 'user' | 'assistant';
    content: string;
  }>;
  temperature?: number;
  max_tokens?: number;
}

interface ChatMessage {
  role: 'assistant';
  content: string;
}

// Interface for API responses
interface ChatApiResponse {
  success: boolean;
  data?: {
    message: {
      role: 'assistant';
      content: string;
    };
    rawResponse?: OpenAIResponse;
  };
  error?: string;
}

interface AudioApiResponse {
  success: boolean;
  data?: {
    audioUrl: string;
    duration: number;
  };
  error?: string;
}

// Get API configuration
const getConfig = (): ApiConfig => {
  return loadApiConfig();
};

/**
 * Send a message to the AI service via Netlify Function
 */
export const sendChatMessage = async (
  messages: Array<{
    role: 'system' | 'user' | 'assistant';
    content: string;
  }>,
  options: { temperature?: number; max_tokens?: number } = {}
): Promise<ChatApiResponse> => {
  try {
    const config = getConfig();
    const requestBody = {
      model: config.chatAI.model || 'gpt-3.5-turbo',
      messages: messages,
      temperature: options.temperature || 0.7,
      max_tokens: options.max_tokens || 1000
    };

    // Make the API call through our Netlify Function
    const response = await fetch(FUNCTION_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        endpoint: '/chat/completions',
        method: 'POST',
        body: requestBody
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      console.error('API error:', errorData);
      throw new Error(errorData?.error || `API error: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.choices?.[0]?.message?.content) {
      throw new Error('No content received from AI service');
    }

    return {
      success: true,
      data: {
        message: {
          role: 'assistant',
          content: data.choices[0].message.content
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
export const textToSpeech = async (text: string): Promise<AudioApiResponse> => {
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
