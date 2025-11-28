// Health check endpoint
exports.handler = async (event, context) => {
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      status: 'ok',
      message: 'Universal Converter Pro - Netlify Functions Active',
      note: 'For full conversion capabilities, deploy server.js separately',
      timestamp: new Date().toISOString()
    })
  };
};
