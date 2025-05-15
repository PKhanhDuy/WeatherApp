import { Slot, Stack } from "expo-router";
import { WeatherProvider } from '../context/weather_context';

export default function Layout() {
  return (
    <WeatherProvider>
      <Slot />
    </WeatherProvider>
  );
} 