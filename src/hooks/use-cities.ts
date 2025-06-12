import { useState, useEffect } from "react";
import { CitiesService } from "@/services/cities.service";
import { City, CityQueryParams, CityError } from "@/types/cities";

/**
 * Custom hook for fetching cities data
 * Provides loading states, error handling, and caching
 */
export const useCities = (params?: CityQueryParams) => {
    const [cities, setCities] = useState<City[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<CityError | null>(null);
    const [total, setTotal] = useState(0);

    const fetchCities = async (queryParams?: CityQueryParams) => {
        try {
            setIsLoading(true);
            setError(null);

            const response = await CitiesService.getCities(
                queryParams || params,
            );
            setCities(response.cities);
            setTotal(response.total);
        } catch (err) {
            console.error("Error fetching cities:", err);
            setError({
                message: "Failed to load cities. Please try again.",
                code: "FETCH_ERROR",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const refetch = (newParams?: CityQueryParams) => {
        fetchCities(newParams);
    };

    useEffect(() => {
        fetchCities();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return {
        cities,
        isLoading,
        error,
        total,
        refetch,
    };
};

/**
 * Custom hook for fetching a single city by slug
 */
export const useCity = (slug: string) => {
    const [city, setCity] = useState<City | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<CityError | null>(null);

    const fetchCity = async (citySlug: string) => {
        try {
            setIsLoading(true);
            setError(null);

            const cityData = await CitiesService.getCityBySlug(citySlug);
            setCity(cityData);
        } catch (err) {
            console.error("Error fetching city:", err);
            setError({
                message: "Failed to load city details. Please try again.",
                code: "FETCH_ERROR",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const refetch = () => {
        fetchCity(slug);
    };

    useEffect(() => {
        if (slug) {
            fetchCity(slug);
        }
    }, [slug]);

    return {
        city,
        isLoading,
        error,
        refetch,
    };
};

/**
 * Custom hook for cities search functionality
 */
export const useCitiesSearch = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<City[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [searchError, setSearchError] = useState<CityError | null>(null);

    const search = async (query: string) => {
        if (!query.trim()) {
            setSearchResults([]);
            return;
        }

        try {
            setIsSearching(true);
            setSearchError(null);

            const response = await CitiesService.getCities({ search: query });
            setSearchResults(response.cities);
        } catch (err) {
            console.error("Error searching cities:", err);
            setSearchError({
                message: "Failed to search cities. Please try again.",
                code: "SEARCH_ERROR",
            });
        } finally {
            setIsSearching(false);
        }
    };

    const clearSearch = () => {
        setSearchQuery("");
        setSearchResults([]);
        setSearchError(null);
    };

    useEffect(() => {
        const debounceTimer = setTimeout(() => {
            search(searchQuery);
        }, 300);

        return () => clearTimeout(debounceTimer);
    }, [searchQuery]);

    return {
        searchQuery,
        setSearchQuery,
        searchResults,
        isSearching,
        searchError,
        clearSearch,
    };
};
