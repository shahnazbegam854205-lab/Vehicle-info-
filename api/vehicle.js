// api/vehicle.js - Vercel Serverless Function
const https = require('https');

module.exports = async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ 
      success: false, 
      error: 'Method not allowed' 
    });
  }

  try {
    const { rc } = req.query;

    if (!rc) {
      return res.status(400).json({
        success: false,
        error: 'Registration number is required'
      });
    }

    console.log('Fetching data for vehicle:', rc);

    // Using native https module (no dependencies needed)
    const apiUrl = `https://vahan.vishalboss.sbs/fetch_rc.php?rc=${rc}`;
    
    const data = await new Promise((resolve, reject) => {
      https.get(apiUrl, (response) => {
        let data = '';

        response.on('data', (chunk) => {
          data += chunk;
        });

        response.on('end', () => {
          try {
            const parsedData = JSON.parse(data);
            resolve(parsedData);
          } catch (e) {
            reject(new Error('Failed to parse API response'));
          }
        });

      }).on('error', (error) => {
        reject(error);
      });
    });

    res.status(200).json({
      success: true,
      data: data,
      message: 'Vehicle data fetched successfully'
    });

  } catch (error) {
    console.error('Backend Error:', error);
    
    res.status(500).json({
      success: false,
      error: 'Failed to fetch vehicle data',
      details: error.message
    });
  }
};
