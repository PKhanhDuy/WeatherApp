import { createContext, useContext, useState, ReactNode } from 'react'


type WeatherContextType = {
    cities: string[];
    setCities: React.Dispatch<React.SetStateAction<string[]>>;
  };
  
  const WeatherContext = createContext<WeatherContextType>({
    cities: [],
    setCities: () => {
        throw new Error('setCities must be used within a WeatherProvider');
    },
  });
  
  export const WeatherProvider = ({ children }: { children: ReactNode }) => {
    const [cities, setCities] = useState<string[]>(['Ho Chi Minh']);
  
    return (
      <WeatherContext.Provider value={{ cities, setCities }}>
        {children}
      </WeatherContext.Provider>
      
    );

  };
  
  export const useWeather = () => useContext(WeatherContext);