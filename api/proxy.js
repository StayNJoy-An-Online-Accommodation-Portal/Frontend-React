export default async function handler(req, res) {
  const backend = 'https://backend-3n6s.onrender.com';
  
  // Normalize the forwarding path cleanly
  let path = req.url || '';
  if (path.startsWith('/api/proxy')) {
    path = path.replace('/api/proxy', '');
  }
  if (!path.startsWith('/')) {
    path = '/' + path;
  }

  const targetUrl = `${backend}${path}`;

  try {
    const headers = {
      'Content-Type': 'application/json',
    };
    if (req.headers.authorization) {
      headers['Authorization'] = req.headers.authorization;
    }

    const options = {
      method: req.method,
      headers: headers,
    };

    if (req.method !== 'GET' && req.method !== 'HEAD' && req.body) {
      options.body = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
    }

    const response = await fetch(targetUrl, options);
    const contentType = response.headers.get('content-type') || '';

    if (contentType.includes('application/json')) {
      const data = await response.json();
      return res.status(response.status).json(data);
    }

    const textData = await response.text();
    return res.status(response.status).send(textData);
  } catch (error) {
    console.error(`Proxy forwarding error to ${targetUrl}:`, error);
    return res.status(500).json({ 
      error: 'Backend connection failed', 
      details: error.message,
      targetUrl: targetUrl 
    });
  }
}