/**
 * Service logo mapping utility for child services
 * Uses Simple Icons CDN for brand logos
 * https://simpleicons.org/
 */

// Map service IDs to Simple Icons slug names
const serviceLogoMap: Record<string, string> = {
  // Social Media
  'instagram': 'instagram',
  'tiktok': 'tiktok',
  'snapchat': 'snapchat',
  'facebook': 'facebook',
  
  // Messaging
  'whatsapp': 'whatsapp',
  'discord': 'discord',
  
  // Gaming
  'roblox': 'roblox',
  'minecraft': 'minecraft',
  'fortnite': 'epicgames', // Fortnite is by Epic Games
  
  // Streaming
  'youtube': 'youtube',
  'youtube-kids': 'youtube', // Use YouTube logo
  'netflix': 'netflix',
  
  // Education
  'khan-academy': 'khanacademy',
  'duolingo': 'duolingo',
  
  // Creative
  'scratch': 'scratch'
};

/**
 * Get the logo URL for a service
 * @param serviceId - The service ID
 * @param isDarkMode - Whether dark mode is active (optional, defaults to false)
 * @returns URL to the service logo from Simple Icons CDN, or null if not found
 */
export const getServiceLogoUrl = (serviceId: string, isDarkMode: boolean = false): string | null => {
  const iconSlug = serviceLogoMap[serviceId];
  if (!iconSlug) {
    return null;
  }
  
  // Use Simple Icons CDN - provides SVG icons
  // Format: https://cdn.simpleicons.org/{iconSlug}/{color}
  // Using brand colors for better recognition, with fallback to gray
  const color = isDarkMode ? 'ffffff' : '000000';
  return `https://cdn.simpleicons.org/${iconSlug}/${color}`;
};

/**
 * Get the logo URL for a service with brand color
 * @param serviceId - The service ID
 * @returns URL to the service logo from Simple Icons CDN with brand color, or null if not found
 */
export const getServiceLogoUrlWithBrandColor = (serviceId: string): string | null => {
  const iconSlug = serviceLogoMap[serviceId];
  if (!iconSlug) {
    return null;
  }
  
  // Use brand colors for better visual recognition
  const brandColors: Record<string, string> = {
    'instagram': 'E4405F',
    'tiktok': '000000',
    'snapchat': 'FFFC00',
    'facebook': '1877F2',
    'whatsapp': '25D366',
    'discord': '5865F2',
    'roblox': '000000',
    'minecraft': '62B47A',
    'epicgames': '313131',
    'youtube': 'FF0000',
    'netflix': 'E50914',
    'khanacademy': '14BF96',
    'duolingo': '58CC02',
    'scratch': '4C97FF'
  };
  
  const color = brandColors[iconSlug] || '6b7280';
  return `https://cdn.simpleicons.org/${iconSlug}/${color}`;
};

/**
 * Check if a service has a logo available
 * @param serviceId - The service ID
 * @returns true if logo is available, false otherwise
 */
export const hasServiceLogo = (serviceId: string): boolean => {
  return serviceId in serviceLogoMap;
};

