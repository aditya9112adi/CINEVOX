const TMDB_API_KEY = '86b9885c538cd3398e46409318576b2d'

export const getTmdbImageUrl = (path, size = 'w500') => {
  if (!path) return '' // Return empty string or a placeholder image if path is null
  return `https://image.tmdb.org/t/p/${size}${path}`
}

export const fetchFromTMDB = async endpoint => {
  const url = endpoint.includes('?') 
    ? `${endpoint}&api_key=${TMDB_API_KEY}`
    : `${endpoint}?api_key=${TMDB_API_KEY}`
    
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error('Failed to fetch from TMDB')
  }
  return response.json()
}

export default TMDB_API_KEY
