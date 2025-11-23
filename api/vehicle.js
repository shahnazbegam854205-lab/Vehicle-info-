// Vercel Serverless Function - Backend API
export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle OPTIONS request for CORS
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ 
      success: false, 
      error: 'Method not allowed. Use GET request.' 
    });
  }

  try {
    const { rc } = req.query;

    // Check if registration number is provided
    if (!rc) {
      return res.status(400).json({
        success: false,
        error: 'Registration number (rc) is required'
      });
    }

    console.log('Fetching data for vehicle:', rc);

    // Make request to the actual vehicle API
    const apiUrl = `https://vahan.vishalboss.sbs/fetch_rc.php?rc=${rc}`;
    
    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }

    const data = await response.json();

    // Check if data is valid
    if (!data || typeof data !== 'object') {
      throw new Error('Invalid data received from API');
    }

    console.log('Data fetched successfully for:', rc);

    // Return success response with data
    res.status(200).json({
      success: true,
      data: data,
      message: 'Vehicle data fetched successfully'
    });

  } catch (error) {
    console.error('Backend API Error:', error);
    
    // Return proper error response
    res.status(500).json({
      success: false,
      error: 'Failed to fetch vehicle data',
      details: error.message
    });
  }
}
