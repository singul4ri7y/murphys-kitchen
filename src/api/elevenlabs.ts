export const transcribeAudio = async (audioBlob: Blob): Promise<string> => {
  try {
    const apiKey = import.meta.env.VITE_ELEVENLABS_API_KEY;
    if (!apiKey) {
      throw new Error('ElevenLabs API key not found');
    }

    const formData = new FormData();
    formData.append('audio', audioBlob, 'audio.wav');
    formData.append('model_id', 'eleven_english_sts_v2.5');

    const response = await fetch('https://api.elevenlabs.io/v1/speech-to-text', {
      method: 'POST',
      headers: {
        'xi-api-key': apiKey,
      },
      body: formData,
    });

    if (!response.ok) {
      let errorDetails = '';
      try {
        const errorData = await response.json();
        errorDetails = JSON.stringify(errorData, null, 2);
        console.error('ElevenLabs API error details:', errorData);
      } catch (parseError) {
        const errorText = await response.text();
        errorDetails = errorText;
        console.error('ElevenLabs API error text:', errorText);
      }
      
      throw new Error(`ElevenLabs API error: ${response.status} - ${errorDetails}`);
    }

    const data = await response.json();
    return data.text || '';
  } catch (error) {
    console.error('Error transcribing audio:', error);
    return '';
  }
};