export default async function handler(req, res) {
  res.status(200).json({
    hasKey: !!process.env.GEMINI_API_KEY,
    keyLength: process.env.GEMINI_API_KEY?.length || 0,
    allKeys: Object.keys(process.env).filter(k => !k.toLowerCase().includes('secret') && !k.toLowerCase().includes('token')),
    nodeVersion: process.version
  });
}
 
