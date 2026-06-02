export default async function handler(req, res) {
  const apiKey = process.env.GEMINI_API_KEY;
  res.status(200).json({
    hasKey: !!apiKey,
    keyLength: apiKey?.length || 0,
    keyStart: apiKey ? apiKey.substring(0, 6) + '...' : 'none'
  });
}
 
