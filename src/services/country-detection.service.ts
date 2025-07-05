/**
 * Country Detection Service
 * Automatically detects user's country based on IP address using https://api.country.is/
 */

export interface CountryInfo {
    country: string; // Country code (e.g., "AE", "US", "GB")
    ip: string; // User's IP address
}

export interface CountryData {
    code: string;
    name: string;
    dialCode: string;
    flag: string;
}

// Comprehensive list of countries with dial codes
export const COUNTRIES: CountryData[] = [
    { code: "AE", name: "United Arab Emirates", dialCode: "+971", flag: "🇦🇪" },
    { code: "SA", name: "Saudi Arabia", dialCode: "+966", flag: "🇸🇦" },
    { code: "US", name: "United States", dialCode: "+1", flag: "🇺🇸" },
    { code: "GB", name: "United Kingdom", dialCode: "+44", flag: "🇬🇧" },
    { code: "IN", name: "India", dialCode: "+91", flag: "🇮🇳" },
    { code: "PK", name: "Pakistan", dialCode: "+92", flag: "🇵🇰" },
    { code: "BD", name: "Bangladesh", dialCode: "+880", flag: "🇧🇩" },
    { code: "EG", name: "Egypt", dialCode: "+20", flag: "🇪🇬" },
    { code: "JO", name: "Jordan", dialCode: "+962", flag: "🇯🇴" },
    { code: "LB", name: "Lebanon", dialCode: "+961", flag: "🇱🇧" },
    { code: "KW", name: "Kuwait", dialCode: "+965", flag: "🇰🇼" },
    { code: "QA", name: "Qatar", dialCode: "+974", flag: "🇶🇦" },
    { code: "BH", name: "Bahrain", dialCode: "+973", flag: "🇧🇭" },
    { code: "OM", name: "Oman", dialCode: "+968", flag: "🇴🇲" },
    { code: "TR", name: "Turkey", dialCode: "+90", flag: "🇹🇷" },
    { code: "IR", name: "Iran", dialCode: "+98", flag: "🇮🇷" },
    { code: "IQ", name: "Iraq", dialCode: "+964", flag: "🇮🇶" },
    { code: "SY", name: "Syria", dialCode: "+963", flag: "🇸🇾" },
    { code: "YE", name: "Yemen", dialCode: "+967", flag: "🇾🇪" },
    { code: "AF", name: "Afghanistan", dialCode: "+93", flag: "🇦🇫" },
    { code: "CA", name: "Canada", dialCode: "+1", flag: "🇨🇦" },
    { code: "AU", name: "Australia", dialCode: "+61", flag: "🇦🇺" },
    { code: "NZ", name: "New Zealand", dialCode: "+64", flag: "🇳🇿" },
    { code: "ZA", name: "South Africa", dialCode: "+27", flag: "🇿🇦" },
    { code: "NG", name: "Nigeria", dialCode: "+234", flag: "🇳🇬" },
    { code: "KE", name: "Kenya", dialCode: "+254", flag: "🇰🇪" },
    { code: "GH", name: "Ghana", dialCode: "+233", flag: "🇬🇭" },
    { code: "ET", name: "Ethiopia", dialCode: "+251", flag: "🇪🇹" },
    { code: "MA", name: "Morocco", dialCode: "+212", flag: "🇲🇦" },
    { code: "TN", name: "Tunisia", dialCode: "+216", flag: "🇹🇳" },
    { code: "DZ", name: "Algeria", dialCode: "+213", flag: "🇩🇿" },
    { code: "LY", name: "Libya", dialCode: "+218", flag: "🇱🇾" },
    { code: "SD", name: "Sudan", dialCode: "+249", flag: "🇸🇩" },
    { code: "DE", name: "Germany", dialCode: "+49", flag: "🇩🇪" },
    { code: "FR", name: "France", dialCode: "+33", flag: "🇫🇷" },
    { code: "IT", name: "Italy", dialCode: "+39", flag: "🇮🇹" },
    { code: "ES", name: "Spain", dialCode: "+34", flag: "🇪🇸" },
    { code: "NL", name: "Netherlands", dialCode: "+31", flag: "🇳🇱" },
    { code: "BE", name: "Belgium", dialCode: "+32", flag: "🇧🇪" },
    { code: "CH", name: "Switzerland", dialCode: "+41", flag: "🇨🇭" },
    { code: "AT", name: "Austria", dialCode: "+43", flag: "🇦🇹" },
    { code: "SE", name: "Sweden", dialCode: "+46", flag: "🇸🇪" },
    { code: "NO", name: "Norway", dialCode: "+47", flag: "🇳🇴" },
    { code: "DK", name: "Denmark", dialCode: "+45", flag: "🇩🇰" },
    { code: "FI", name: "Finland", dialCode: "+358", flag: "🇫🇮" },
    { code: "PL", name: "Poland", dialCode: "+48", flag: "🇵🇱" },
    { code: "CZ", name: "Czech Republic", dialCode: "+420", flag: "🇨🇿" },
    { code: "HU", name: "Hungary", dialCode: "+36", flag: "🇭🇺" },
    { code: "RO", name: "Romania", dialCode: "+40", flag: "🇷🇴" },
    { code: "BG", name: "Bulgaria", dialCode: "+359", flag: "🇧🇬" },
    { code: "GR", name: "Greece", dialCode: "+30", flag: "🇬🇷" },
    { code: "PT", name: "Portugal", dialCode: "+351", flag: "🇵🇹" },
    { code: "IE", name: "Ireland", dialCode: "+353", flag: "🇮🇪" },
    { code: "RU", name: "Russia", dialCode: "+7", flag: "🇷🇺" },
    { code: "UA", name: "Ukraine", dialCode: "+380", flag: "🇺🇦" },
    { code: "BY", name: "Belarus", dialCode: "+375", flag: "🇧🇾" },
    { code: "LT", name: "Lithuania", dialCode: "+370", flag: "🇱🇹" },
    { code: "LV", name: "Latvia", dialCode: "+371", flag: "🇱🇻" },
    { code: "EE", name: "Estonia", dialCode: "+372", flag: "🇪🇪" },
    { code: "CN", name: "China", dialCode: "+86", flag: "🇨🇳" },
    { code: "JP", name: "Japan", dialCode: "+81", flag: "🇯🇵" },
    { code: "KR", name: "South Korea", dialCode: "+82", flag: "🇰🇷" },
    { code: "TH", name: "Thailand", dialCode: "+66", flag: "🇹🇭" },
    { code: "VN", name: "Vietnam", dialCode: "+84", flag: "🇻🇳" },
    { code: "MY", name: "Malaysia", dialCode: "+60", flag: "🇲🇾" },
    { code: "SG", name: "Singapore", dialCode: "+65", flag: "🇸🇬" },
    { code: "ID", name: "Indonesia", dialCode: "+62", flag: "🇮🇩" },
    { code: "PH", name: "Philippines", dialCode: "+63", flag: "🇵🇭" },
    { code: "LK", name: "Sri Lanka", dialCode: "+94", flag: "🇱🇰" },
    { code: "MM", name: "Myanmar", dialCode: "+95", flag: "🇲🇲" },
    { code: "KH", name: "Cambodia", dialCode: "+855", flag: "🇰🇭" },
    { code: "LA", name: "Laos", dialCode: "+856", flag: "🇱🇦" },
    { code: "BN", name: "Brunei", dialCode: "+673", flag: "🇧🇳" },
    { code: "MV", name: "Maldives", dialCode: "+960", flag: "🇲🇻" },
    { code: "NP", name: "Nepal", dialCode: "+977", flag: "🇳🇵" },
    { code: "BT", name: "Bhutan", dialCode: "+975", flag: "🇧🇹" },
    { code: "MX", name: "Mexico", dialCode: "+52", flag: "🇲🇽" },
    { code: "BR", name: "Brazil", dialCode: "+55", flag: "🇧🇷" },
    { code: "AR", name: "Argentina", dialCode: "+54", flag: "🇦🇷" },
    { code: "CL", name: "Chile", dialCode: "+56", flag: "🇨🇱" },
    { code: "CO", name: "Colombia", dialCode: "+57", flag: "🇨🇴" },
    { code: "PE", name: "Peru", dialCode: "+51", flag: "🇵🇪" },
    { code: "VE", name: "Venezuela", dialCode: "+58", flag: "🇻🇪" },
    { code: "EC", name: "Ecuador", dialCode: "+593", flag: "🇪🇨" },
    { code: "BO", name: "Bolivia", dialCode: "+591", flag: "🇧🇴" },
    { code: "PY", name: "Paraguay", dialCode: "+595", flag: "🇵🇾" },
    { code: "UY", name: "Uruguay", dialCode: "+598", flag: "🇺🇾" },
    { code: "GY", name: "Guyana", dialCode: "+592", flag: "🇬🇾" },
    { code: "SR", name: "Suriname", dialCode: "+597", flag: "🇸🇷" },
    { code: "GF", name: "French Guiana", dialCode: "+594", flag: "🇬🇫" },
];

// Default country (UAE) for fallback
export const DEFAULT_COUNTRY: CountryData = COUNTRIES.find(c => c.code === "AE") || COUNTRIES[0];

/**
 * Detect user's country based on IP address
 */
export async function detectUserCountry(): Promise<CountryData> {
    try {
        const response = await fetch('https://api.country.is/', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            },
        });

        if (!response.ok) {
            console.warn('Country detection API failed, using default country');
            return DEFAULT_COUNTRY;
        }

        const data: CountryInfo = await response.json();
        
        // Find the country in our list
        const detectedCountry = COUNTRIES.find(country => country.code === data.country);
        
        if (detectedCountry) {
            console.log(`Detected country: ${detectedCountry.name} (${detectedCountry.code})`);
            return detectedCountry;
        } else {
            console.warn(`Unknown country code: ${data.country}, using default`);
            return DEFAULT_COUNTRY;
        }
    } catch (error) {
        console.error('Error detecting country:', error);
        return DEFAULT_COUNTRY;
    }
}

/**
 * Get country by code
 */
export function getCountryByCode(code: string): CountryData | undefined {
    return COUNTRIES.find(country => country.code === code);
}

/**
 * Get country by dial code
 */
export function getCountryByDialCode(dialCode: string): CountryData | undefined {
    return COUNTRIES.find(country => country.dialCode === dialCode);
}

/**
 * Format phone number with country code
 */
export function formatPhoneNumber(phoneNumber: string, countryCode: string): string {
    const country = getCountryByCode(countryCode);
    if (!country) return phoneNumber;
    
    // Remove any existing country code or special characters
    const cleanNumber = phoneNumber.replace(/^\+?\d{1,4}/, '').replace(/\D/g, '');
    
    return `${country.dialCode}${cleanNumber}`;
}

/**
 * Parse phone number to extract country code and number
 */
export function parsePhoneNumber(phoneNumber: string): { countryCode: string; number: string } {
    // Try to match against known dial codes
    for (const country of COUNTRIES) {
        if (phoneNumber.startsWith(country.dialCode)) {
            return {
                countryCode: country.code,
                number: phoneNumber.substring(country.dialCode.length)
            };
        }
    }
    
    // Default to UAE if no match
    return {
        countryCode: DEFAULT_COUNTRY.code,
        number: phoneNumber.replace(/^\+?\d{1,4}/, '')
    };
}
