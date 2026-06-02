export const config = { runtime: 'edge' };
 
export default async function handler(req) {
  const headers = { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' };
  
  // Show all env variables that exist (without showing values)
  const envKeys = Object.keys(process.env).filter(k => !k.includes('SECRET'));
  const hasGemini = !!process.env.GEMINI_API_KEY;
  const keyLength = process.env.GEMINI_API_KEY?.length || 0;
  
  return new Response(JSON.stringify({ 
    hasGeminiKey: hasGemini,
    keyLength: keyLength,
    allEnvKeys: envKeys
  }), { headers });
}
