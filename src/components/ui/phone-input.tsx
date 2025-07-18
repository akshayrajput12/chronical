"use client";

import React, { useState, useEffect } from "react";
import { ChevronDown, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { 
    COUNTRIES, 
    DEFAULT_COUNTRY, 
    detectUserCountry, 
    getCountryByCode,
    parsePhoneNumber,
    type CountryData 
} from "@/services/country-detection.service";

interface PhoneInputProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
    disabled?: boolean;
    error?: boolean;
    name?: string;
    required?: boolean;
}

export const PhoneInput: React.FC<PhoneInputProps> = ({
    value,
    onChange,
    placeholder = "Enter phone number",
    className = "",
    disabled = false,
    error = false,
    name,
    required = false,
}) => {
    const [selectedCountry, setSelectedCountry] = useState<CountryData>(DEFAULT_COUNTRY);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    // Initialize country detection
    useEffect(() => {
        const initializeCountry = async () => {
            try {
                // If value already has a country code, parse it
                if (value && value.startsWith('+')) {
                    const parsed = parsePhoneNumber(value);
                    const country = getCountryByCode(parsed.countryCode);
                    if (country) {
                        setSelectedCountry(country);
                        setPhoneNumber(parsed.number);
                        setIsLoading(false);
                        return;
                    }
                }

                // Otherwise, detect country by IP
                const detectedCountry = await detectUserCountry();
                setSelectedCountry(detectedCountry);
                setIsLoading(false);
            } catch (error) {
                console.error('Error initializing country:', error);
                setSelectedCountry(DEFAULT_COUNTRY);
                setIsLoading(false);
            }
        };

        initializeCountry();
    }, [value]);

    // Update phone number when value changes externally
    useEffect(() => {
        if (value && value.startsWith('+')) {
            const parsed = parsePhoneNumber(value);
            setPhoneNumber(parsed.number);
        } else {
            setPhoneNumber(value);
        }
    }, [value]);

    // Filter countries based on search term
    const filteredCountries = COUNTRIES.filter(country =>
        country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        country.dialCode.includes(searchTerm) ||
        country.code.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleCountrySelect = (country: CountryData) => {
        setSelectedCountry(country);
        setIsDropdownOpen(false);
        setSearchTerm("");
        
        // Update the full phone number
        const fullNumber = phoneNumber ? `${country.dialCode}${phoneNumber}` : country.dialCode;
        onChange(fullNumber);
    };

    const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newNumber = e.target.value.replace(/\D/g, ''); // Only allow digits
        setPhoneNumber(newNumber);
        
        // Update the full phone number
        const fullNumber = newNumber ? `${selectedCountry.dialCode}${newNumber}` : selectedCountry.dialCode;
        onChange(fullNumber);
    };

    const handleDropdownToggle = () => {
        if (!disabled) {
            setIsDropdownOpen(!isDropdownOpen);
        }
    };

    if (isLoading) {
        return (
            <div className={cn(
                "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm",
                "animate-pulse bg-gray-100",
                className
            )}>
                <div className="flex items-center space-x-2">
                    <div className="w-6 h-4 bg-gray-300 rounded"></div>
                    <div className="w-12 h-4 bg-gray-300 rounded"></div>
                </div>
            </div>
        );
    }

    return (
        <div className={cn("relative", className)}>
            <div className={cn(
                "flex h-10 w-full rounded-md border bg-background text-sm ring-offset-background",
                "focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
                error ? "border-red-500 focus-within:ring-red-500" : "border-input",
                disabled && "cursor-not-allowed opacity-50",
                "font-noto-kufi-arabic"
            )}>
                {/* Country Code Dropdown */}
                <button
                    type="button"
                    onClick={handleDropdownToggle}
                    disabled={disabled}
                    className={cn(
                        "flex items-center space-x-1 px-3 py-2 border-r border-input",
                        "hover:bg-accent hover:text-accent-foreground",
                        "focus:outline-none focus:bg-accent",
                        disabled && "cursor-not-allowed"
                    )}
                >
                    <span className="text-lg">{selectedCountry.flag}</span>
                    <span className="text-sm font-medium">{selectedCountry.dialCode}</span>
                    <ChevronDown className="h-4 w-4 opacity-50" />
                </button>

                {/* Phone Number Input */}
                <input
                    type="tel"
                    name={name}
                    value={phoneNumber}
                    onChange={handlePhoneNumberChange}
                    placeholder={placeholder}
                    disabled={disabled}
                    required={required}
                    className={cn(
                        "flex-1 px-3 py-2 bg-transparent",
                        "placeholder:text-muted-foreground",
                        "focus:outline-none",
                        "disabled:cursor-not-allowed disabled:opacity-50"
                    )}
                />
            </div>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
                <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-popover border border-border rounded-md shadow-lg max-h-60 overflow-hidden">
                    {/* Search Input */}
                    <div className="p-2 border-b border-border">
                        <div className="relative">
                            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <input
                                type="text"
                                placeholder="Search countries..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-8 pr-2 py-1 text-sm bg-background border border-input rounded focus:outline-none focus:ring-1 focus:ring-ring"
                            />
                        </div>
                    </div>

                    {/* Countries List */}
                    <div className="overflow-y-auto max-h-48">
                        {filteredCountries.length > 0 ? (
                            filteredCountries.map((country) => (
                                <button
                                    key={country.code}
                                    type="button"
                                    onClick={() => handleCountrySelect(country)}
                                    className={cn(
                                        "w-full flex items-center space-x-3 px-3 py-2 text-left text-sm",
                                        "hover:bg-accent hover:text-accent-foreground",
                                        "focus:outline-none focus:bg-accent",
                                        selectedCountry.code === country.code && "bg-accent text-accent-foreground"
                                    )}
                                >
                                    <span className="text-lg">{country.flag}</span>
                                    <span className="font-medium">{country.dialCode}</span>
                                    <span className="flex-1 truncate">{country.name}</span>
                                </button>
                            ))
                        ) : (
                            <div className="px-3 py-2 text-sm text-muted-foreground">
                                No countries found
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Backdrop to close dropdown */}
            {isDropdownOpen && (
                <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsDropdownOpen(false)}
                />
            )}
        </div>
    );
};
