import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

interface LocationContextType {
  selectedLocation: string;
  setSelectedLocation: (loc: string) => void;
  isLocating: boolean;
  locationError: string | null;
  requestGeolocation: () => Promise<boolean>;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

const STORAGE_KEY = 'craigslist_user_location';

export const LocationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedLocation, setSelectedLocationState] = useState<string>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && !saved.includes('CA') && !saved.includes('TX') && !saved.includes('NY') && !saved.includes('WA')) {
      return saved;
    }
    return 'Bengaluru, Karnataka';
  });
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  const setSelectedLocation = (loc: string) => {
    setSelectedLocationState(loc);
    localStorage.setItem(STORAGE_KEY, loc);
    setLocationError(null);
  };

  const requestGeolocation = (): Promise<boolean> => {
    return new Promise((resolve) => {
      setLocationError(null);
      if (!navigator.geolocation) {
        setLocationError('Geolocation is not supported by your browser.');
        resolve(false);
        return;
      }

      setIsLocating(true);
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            const res = await api.getNearbyLocations(latitude, longitude);
            if (res.locations && res.locations.length > 0) {
              const closest = res.locations[0];
              const formatted = `${closest.city}, ${closest.state}`;
              setSelectedLocation(formatted);
              setIsLocating(false);
              resolve(true);
            } else {
              // Default to Bengaluru or Mumbai if in India
              setSelectedLocation('Bengaluru, Karnataka');
              setIsLocating(false);
              resolve(true);
            }
          } catch (err: any) {
            setSelectedLocation('Bengaluru, Karnataka');
            setIsLocating(false);
            resolve(true);
          }
        },
        (error) => {
          setIsLocating(false);
          if (error.code === error.PERMISSION_DENIED) {
            setLocationError('Location permission was denied. You can select your city manually.');
          } else {
            setLocationError('Unable to retrieve your current location.');
          }
          resolve(false);
        },
        { timeout: 10000 }
      );
    });
  };

  return (
    <LocationContext.Provider
      value={{
        selectedLocation,
        setSelectedLocation,
        isLocating,
        locationError,
        requestGeolocation,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
};
