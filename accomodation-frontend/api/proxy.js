export default async function handler(req, res) {
  const backend = 'http://localhost:8081';
  const path = req.url.replace('/api/proxy', '');
  const url = `${backend}${path}`;
  
  try {
    const options = {
      method: req.method,
      headers: { 'Content-Type': 'application/json' },
    };
    
    if (req.method !== 'GET' && req.method !== 'HEAD' && req.body) {
      options.body = JSON.stringify(req.body);
    }
    
    const response = await fetch(url, options);
    const contentType = response.headers.get('content-type');
    
    if (contentType?.includes('application/json')) {
      const data = await response.json();
      return res.status(response.status).json(data);
    }
    
    const data = await response.text();
    return res.status(response.status).send(data);
  } catch (error) {
    return res.status(500).json({ error: 'Backend connection failed' });
  }
}
