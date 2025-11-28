// Netlify Function for conversion endpoint
// Returns helpful error messages since full conversions require separate backend

exports.handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    // For now, return an error message directing users to deploy backend separately
    // This is because Netlify Functions have limitations:
    // - No FFmpeg for video/audio
    // - No LibreOffice for documents
    // - Limited processing time

    return {
      statusCode: 503,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        error: 'Server-side conversions require a separate backend deployment',
        message: 'For full conversion capabilities, please deploy server.js to Heroku, Railway, or Render. See README for instructions.',
        clientSideOnly: true,
        supportedFormats: ['Basic image conversions only via browser']
      })
    };

  } catch (error) {
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        error: error.message || 'Conversion failed'
      })
    };
  }
};
