import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { useEffect, useState } from 'react';
import { useWeather } from '../context/weather_context';
import { FlatList, GestureHandlerRootView } from "react-native-gesture-handler";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Entypo from '@expo/vector-icons/Entypo';
import { MaterialCommunityIcons } from "@expo/vector-icons";
import cities from '../assets/data/cities.json';
import { useSharedValue } from "react-native-reanimated";
import dataCities from '../assets/data/cities.json';

const temperCelsius = <MaterialCommunityIcons name="temperature-celsius" size={16} color="white" />
const temperCelsiusMedium = <MaterialCommunityIcons name="temperature-celsius" size={30} color="white" />

export default function SettingsScreen() {
  const router = useRouter();
  const [weatherToday, setWeatherToday] = useState(null);
  const { cities, setCities } = useWeather();
  const [otherCity, setOtherCity] = useState(new Map());

  useEffect(() => {
    let isMounted = true;  // ✅ Đánh dấu component còn tồn tại

    const fetchWeather = async (city) => {
      const apiKey = '50f7f70ce8f72a732bfa026164713205';
      const cityName = city;
      const url = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&units=metric&appid=${apiKey}`;

      try {
        const response = await fetch(url);
        const data = await response.json();

        if (isMounted) {
          setWeatherToday(data.list[0]);
          // setCity(data.city.name)
          // setCities([data.city.name])
        }
      } catch (err) {
        console.error('Error fetching weather data:', err);
      }
    };


    const fetchCity = async (city) => {
      const apiKey = '50f7f70ce8f72a732bfa026164713205';
      const cityName = city;
      const url = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&units=metric&appid=${apiKey}`;

      try {
        const response = await fetch(url);
        const data = await response.json();

        if (isMounted) {
          setOtherCity(prev => {
            const newMap = new Map(prev);
            newMap.set(city, {
              icon: data.list[0]?.weather?.[0]?.icon,
              temp: data.list[0].main.temp,
              temp_min: data.list[0].main.temp_min,
              temp_max: data.list[0].main.temp_max
            });
            // console.log(newMap)
            return newMap;
          })
        }

      } catch (err) {
        console.error('Error fetching weather data:', err);
      }
    };

    fetchWeather(cities[0]);

    cities.forEach((value, index) => {
      fetchCity(value);
    });


    console.log("Weather API data:", weatherToday);

    return () => {
      isMounted = false;  // ✅ Khi unmount, đổi flag
    };
  }, [cities]);

  const getCountry = (city) =>{
    const c = dataCities.find(c=> c.name === city);
    return c
  }
  
  const setIndex = (city) =>{
    const index = cities.indexOf(city);
    if (index > -1) {
      const [item] = cities.splice(index, 1);  // Xóa phần tử
      cities.unshift(item);                    // Thêm vào đầu mảng
    }
    router.push('/')
  } 

  const iconWeather = (iconCode) => {
    const temp = iconCode ? `https://openweathermap.org/img/wn/${iconCode}@2x.png` : null;
    // setWeatherIconUrl(temp);
    return temp
  };

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: '#005972', paddingTop: 5, }}>

      <View style={[styles.flexRow, styles.betweenJusty]}>
        <View style={styles.flexRow}>
          <TouchableOpacity onPress={() => router.replace('/')} style={[{ paddingStart: 30, paddingEnd: 10 }]}>
            <MaterialIcons name="arrow-back-ios" size={26} color="white" />
          </TouchableOpacity>
          <Text style={[{ fontSize: 22 }, styles.textWhite]}>Quản lý vị trí</Text>
        </View>

        <View style={[styles.betweenJusty, styles.flexRow]}>
          <TouchableOpacity style={styles.p10} onPress={()=> router.push("/add_city")}>
            <MaterialIcons name="add" size={35} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={{ paddingEnd: 20 }}>
            <Entypo name="dots-three-vertical" size={22} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={[styles.flexRow, styles.betweenJusty]}>
        <Text style={[styles.textWhite, styles.p10, { paddingStart: 30, fontSize: 15 }]}>Vị trí yêu thích</Text>
        <MaterialIcons style={{ paddingEnd: 30 }} name="error-outline" size={20} color="white" />
      </View>
      <View style={[{ alignItems: 'center' }]}>
        <View style={[styles.p30, styles.flexRow, styles.betweenJusty, { height: 100, backgroundColor: '#006888', width: '99%', borderRadius: 25 }]}>
          <View>
            <Text style={[styles.textWhite, { fontSize: 20 }]}>Phước Long B</Text>
            <Text style={[styles.textWhite, { fontSize: 11 }]}>Việt Nam</Text>
            <Text style={[styles.textWhite, { fontSize: 11 }]}>T.5, 6 tháng 3 16:32</Text>
          </View>
          <View>
            <View style={[styles.flexRow, { justifyContent: 'center' }]}>
              <Image
                source={require('../assets/images/sun.png')}
                style={{ width: 30, height: 30 }}
              />
              <Text style={[styles.textWhite, { fontSize: 30, paddingStart: 10 }]}>32{temperCelsiusMedium}</Text>
            </View>
            <View style={[{ alignItems: 'flex-end', marginTop: 5 }]}>
              <Text style={[styles.textWhite]}>25{temperCelsius}/34{temperCelsius}</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={[styles.flexRow, styles.betweenJusty]}>
        <Text style={[styles.textWhite, styles.p10, { paddingStart: 30, fontSize: 15 }]}>Vị trí khác</Text>
      </View>
      <View style={{ flex: 1, gap: 10, borderRadius: 25, overflow: 'hidden' }}>
        <ScrollView 
          showsHorizontalScrollIndicator={false} // tắt thanh cuộn nếu muốn
        >
          {otherCity ? (
            <>
              {Array.from(otherCity.entries()).map(([city, info]) => {
                return (
                  <View key={city} style={[{ alignItems: 'center', marginBottom: 10 }]}>
                    <View style={[styles.p30, styles.flexRow, styles.betweenJusty, { height: 100, backgroundColor: '#006888', width: '99%', borderRadius: 25 }]}>
                      <View>
                        <Text style={[styles.textWhite, { fontSize: 20 }]} onPress={()=> setIndex(city)}>{city} City</Text>
                        <Text style={[styles.textWhite, { fontSize: 11 }]}>{getCountry(city).country}</Text>
                        <Text style={[styles.textWhite, { fontSize: 11 }]}>T.5, 6 tháng 3 04:32</Text>
                      </View>
                      <View>
                        <View style={[styles.flexRow, { justifyContent: 'center' }]}>
                          <Image
                            source={{uri: iconWeather(info.icon)}}
                            style={{ width: 40, height: 40 }}
                          />
                          <Text style={[styles.textWhite, { fontSize: 30, paddingStart: 10 }]}>{info.temp}{temperCelsiusMedium}</Text>
                        </View>
                        <View style={[{ alignItems: 'flex-end', marginTop: 5 }]}>
                          <Text style={[styles.textWhite]}>{info.temp_min}{temperCelsius}/{info.temp_max}{temperCelsius}</Text>
                        </View>
                      </View>
                    </View>
                  </View>
                )
              })}
            </>
          ) : (
            <Text>Đang tải dữ liệu...</Text>
          )}
        </ScrollView>
      </View>
      <View style={{
        width: '100%',
        paddingHorizontal: 10
      }}>
        <View style={[styles.footer]}>
          <View style={{ flexDirection: 'row' }}>
            <Image
              source={require('../assets/images/paper.png')}
              style={{ width: 18, height: 18, marginEnd: 4 }}
            ></Image>
            <Text style={[styles.grayC]}>The Weather Channel</Text>
          </View>
          <Text style={[styles.grayC]}>Đã cập nhật 15:14 04/3</Text>
        </View>
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  betweenJusty: {
    justifyContent: 'space-between'
  },
  grayC: {
    color: 'gray'
  },
  textWhite: {
    color: 'white'
  },
  p10: {
    padding: 10
  },
  p30: {
    padding: 30
  },
  flexRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  footer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10
  }
});