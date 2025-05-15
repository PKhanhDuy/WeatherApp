import { Image, StyleSheet, Platform, View, Text, ImageBackground, Dimensions, ScrollView, TouchableOpacity, Animated, Button, FlatList } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useEffect, useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SimpleLineIcons } from '@expo/vector-icons';
import { useRouter } from "expo-router";
import { useWeather } from '../context/weather_context';

const temperCelsiusBlack = <MaterialCommunityIcons name="temperature-celsius" size={45} color="black" />
const temperCelsiusBlackMedium = <MaterialCommunityIcons name="temperature-celsius" size={16} color="black" />
const temperCelsiusGray = <MaterialCommunityIcons name="temperature-celsius" size={13} color="gray" />
const temperCelsiusGrayMedium = <MaterialCommunityIcons name="temperature-celsius" size={16} color="gray" />


const { width } = Dimensions.get('window')
const MENU_WIDTH = width * 0.85

const HomeScreen = () => {
    const [translateX, setTranslateX] = useState(0)
    const [isOpen, setIsOpen] = useState(false);
    const [weatherToday, setWeatherToday] = useState(null);
    // const [city, setCity] = useState('Ho Chi Minh');
    const [forecastData, setForecastData] = useState([]);
    const { cities, setCities } = useWeather();
    const router = useRouter();  // Sử dụng router để điều hướng
    const [otherCity, setOtherCity] = useState(new Map());
    // const defaultCity = 'Ho Chi Minh';


    const toggleMenu = () => {
        setTranslateX(isOpen ? 0 : MENU_WIDTH)
        setIsOpen(!isOpen);
    };

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
                    setForecastData(data.list);  // Lưu dữ liệu trả về
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
                            temp: data.list[0].main.temp
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
    }, []);

    // const iconCode = weatherToday?.weather?.[0]?.icon;
    // const iconUrl = iconCode ? `https://openweathermap.org/img/wn/${iconCode}@2x.png` : null;
    // const [weatherIconUrl, setWeatherIconUrl] = useState();
    const iconWeather = (iconCode) => {
        const temp = iconCode ? `https://openweathermap.org/img/wn/${iconCode}@2x.png` : null;
        // setWeatherIconUrl(temp);
        return temp
    };

    const setIndex = (city) => {
        const index = cities.indexOf(city);
        if (index > -1) {
            const [item] = cities.splice(index, 1);  // Xóa phần tử
            cities.unshift(item);                    // Thêm vào đầu mảng
        }
        router.push('/')
    }

    // Tùy chỉnh cách hiển thị khung giờ
    const formatTime = (timestamp) => {
        const date = new Date(timestamp * 1000); // chuyển đổi từ timestamp
        return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <GestureHandlerRootView style={{ flex: 1}}>
            <ImageBackground
                source={require('../assets/images/backgroundWeatherApp.jpg')}
                style={styles.background}
            >

                {/* Giao diện khi nhấn vào menu */}
                <Animated.View style={[styles.menu, { transform: [{ translateX: translateX }] }]}>
                    {/* <Animated.View style={[styles.menu, animatedStyle]}> */}
                    <View style={[{ flexDirection: 'row', justifyContent: 'space-between' }]}>
                        <TouchableOpacity onPress={toggleMenu} style={[styles.p20]}>
                            <AntDesign name="close" size={30} color="black" />
                        </TouchableOpacity>
                        <AntDesign name="setting" size={30} style={styles.p20} color="black" />
                    </View>

                    <ScrollView style={[styles.menuContent]}>
                        <View style={[styles.center, styles.jusBetween, { height: 40 }]}>
                            <View style={[styles.center, { flexDirection: 'row' }]}>
                                <AntDesign name="star" size={24} color="blue" />
                                <Text style={[{ paddingStart: 10, fontWeight: 600, fontSize: 17 }, styles.grayC]}>Vị trí yêu thích</Text>
                            </View>
                            <MaterialIcons name="error-outline" size={24} color="gray" />
                        </View>

                        <View style={[styles.center, styles.jusBetween, { height: 50, paddingStart: 20 }]}>
                            <View style={[styles.center, { flexDirection: 'row' }]}>
                                <MaterialIcons name="location-on" size={15} color="black" />
                                <Text style={[{ paddingStart: 10, fontWeight: 600, fontSize: 17 }, styles.grayC]}>Phước Long B</Text>
                            </View>
                            <View style={[styles.jusBetween, { gap: 10 }]}>
                                <Image
                                    source={require('../assets/images/cloudy.png')}
                                    style={{ width: 15, height: 15 }}
                                >
                                </Image>
                                <Text>27{temperCelsiusBlackMedium}</Text>
                            </View>
                        </View>

                        <View style={{ width: '100%', height: 1, backgroundColor: 'black', marginTop: 20 }}></View>

                        <View style={[styles.center, styles.jusBetween, { height: 40, marginTop: 30 }]}>
                            <View style={[styles.center, { flexDirection: 'row' }]}>
                                <MaterialIcons name="add-location" size={24} color="gray" />
                                <Text style={[{ paddingStart: 10, fontWeight: 600, fontSize: 17 }, styles.grayC]}>Vị trí khác</Text>
                            </View>
                        </View>

                        {Array.from(otherCity.entries()).map(([city, info]) => {
                            return (
                                <View style={[styles.center, styles.jusBetween, { height: 50, paddingStart: 20 }]}>
                                    <View style={[styles.center, { flexDirection: 'row' }]}>
                                        <Text numberOfLines={1} style={[{ paddingStart: 10, width: 190, fontSize: 17, fontWeight: 400, color: 'black' }]} onPress={()=>setIndex(city)}>{city} City</Text>
                                    </View>
                                    <View style={[styles.jusBetween, { gap: 10 }]}>
                                        <Image
                                            source={{ uri: (iconWeather(info.icon)) }}
                                            style={{ width: 20, height: 20 }}
                                        >
                                        </Image>
                                        <Text>{info.temp}{temperCelsiusBlackMedium}</Text>
                                    </View>
                                </View>
                            )
                        })}

                        <View style={{ alignItems: 'center' }}>
                            <TouchableOpacity style={styles.manageLocBtn} onPress={() => router.push("/manager")}>
                                <Text style={{ fontSize: 18, fontWeight: '500' }}>Quản lý vị trí</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={{ height: 1, width: '100%', backgroundColor: 'black', marginTop: 30, marginBottom: 30 }}></View>

                        <View style={[styles.center, styles.jusBetween, { height: 40, marginBottom: 15 }]}>
                            <View style={[styles.center, { flexDirection: 'row' }]}>
                                <AntDesign name="notification" size={22} color="gray" />
                                <Text style={[{ paddingStart: 20, fontWeight: 400, fontSize: 20 }]}>Báo cáo sai vị trí</Text>
                            </View>
                        </View>

                        <View style={[styles.center, styles.jusBetween, { height: 40, marginBottom: 15 }]}>
                            <View style={[styles.center, { flexDirection: 'row' }]}>
                                <SimpleLineIcons name="earphones-alt" size={22} color="gray" />
                                <Text style={[{ paddingStart: 20, fontWeight: 400, fontSize: 20 }]}>Liên hệ chúng tôi</Text>
                            </View>
                        </View>

                        <View style={[styles.center, styles.jusBetween, { height: 40, marginBottom: 15 }]}>
                            <View style={[styles.center, { flexDirection: 'row' }]}>
                                <AntDesign name="questioncircle" size={22} color="gray" />
                                <Text style={[{ paddingStart: 20, fontWeight: 400, fontSize: 20 }]}>Cách sử dụng</Text>
                            </View>
                        </View>
                    </ScrollView>
                </Animated.View>

                {/* Giao diện thời tiết chính */}
                <Animated.View style={[styles.container, { transform: [{ translateX: translateX }] }]}>
                    {/* <Animated.View style={[styles.container, animatedStyle]}> */}
                    <View style={styles.menubar}>
                        <TouchableOpacity onPress={toggleMenu}>
                            <MaterialIcons name="menu" size={30} color="black" />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => router.push("/add_city")}>
                            <MaterialIcons name="add" size={35} color="black" />
                        </TouchableOpacity>
                    </View>

                    {/* Phần hiển thị thông tin thời tiết */}
                    <ScrollView style={[styles.srollview]}>
                        <View style={styles.title}>
                            <Text style={styles.titleStyle}>Thời tiết</Text>
                        </View>
                        <View style={styles.weatherdetail}>
                            <View style={styles.p20}>
                                <Text style={{ fontSize: 30 }}>{cities[0]} City</Text>
                                <Text>CN, 4 tháng 3, 05:03</Text>
                            </View>
                            <View style={{ flexDirection: "row", height: 80, alignItems: 'center' }}>
                                <Image
                                    source={{ uri: iconWeather(weatherToday?.weather?.[0]?.icon) }}
                                    style={{ width: 60, height: 60, marginStart: 20, marginEnd: 20 }}
                                ></Image>

                                <View>
                                    {weatherToday ? (
                                        <>
                                            <Text style={{ fontSize: 40 }}>{weatherToday.main.temp}{temperCelsiusBlack}</Text>
                                        </>
                                    ) : (
                                        <Text>Đang tải dữ liệu...</Text>
                                    )}
                                </View>
                                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'flex-end', marginRight: 20 }}>
                                    {weatherToday ? (
                                        <>
                                            <Text style={styles.grayC}>{weatherToday.weather[0].description}</Text>
                                            <Text style={styles.grayC}>{weatherToday.main.temp_min}{temperCelsiusGray}/{weatherToday.main.temp_max}{temperCelsiusGray}</Text>
                                            <Text style={styles.grayC}>Cảm giác như {weatherToday.main.feels_like}{temperCelsiusGray}</Text>
                                        </>
                                    ) : (
                                        <Text>Đang tải dữ liệu...</Text>
                                    )}
                                </View>
                            </View>
                            <View style={{ width: '100%', alignItems: 'center' }}>
                                <View style={styles.errorNotif}>
                                    <MaterialIcons name="report-gmailerrorred" size={30} color="black" />
                                    <Text style={{ fontSize: 15 }}>Khuyến cáo không tốt cho FA</Text>
                                </View>
                            </View>
                            <View style={{ width: '100%', alignItems: 'center', flex: 1 }}>
                                <View style={{
                                    width: '89%',
                                    flexDirection: 'row',
                                    marginTop: 20
                                }}>
                                    <FlatList
                                        data={forecastData}
                                        keyExtractor={(item, index) => index.toString()}
                                        renderItem={({ item }) => (
                                            <View style={[styles.subWeather, { marginStart: 20 }]}>
                                                <Text style={styles.grayText}>{formatTime(item.dt)}</Text>
                                                <Image
                                                    source={{ uri: iconWeather(item?.weather?.[0]?.icon) }}
                                                    style={{ width: 20, height: 20 }}
                                                ></Image>
                                                <Text style={{ fontSize: 14, color: 'black', fontWeight: 600 }}>{item.main.temp}{temperCelsiusBlackMedium}</Text>
                                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                    <Image
                                                        source={require('../assets/images/water_drop.png')}
                                                        style={{ width: 15, height: 15 }}
                                                    ></Image>
                                                    <Text style={{ color: 'gray' }}>{item.main.humidity}%</Text>
                                                </View>
                                            </View>
                                        )}

                                        horizontal={true}
                                        showsHorizontalScrollIndicator={false} // tắt thanh cuộn nếu muốn
                                    />

                                </View>
                            </View>
                        </View>
                        <View style={[styles.weatherlist, { marginTop: 15 }]}>

                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <Text style={[{ color: 'gray' }, styles.textNormal]}>Hôm qua</Text>
                                <Text style={[styles.grayC, styles.textNormal]}>33{temperCelsiusGrayMedium}/26{temperCelsiusGrayMedium}</Text>
                            </View>

                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <Text style={[{ color: 'black' }, styles.textNormal]}>Hôm nay</Text>
                                <View style={{ flexDirection: 'row', alignItems: 'center', paddingStart: 20 }}>
                                    <Image
                                        source={require('../assets/images/water_drop.png')}
                                        style={{ width: 15, height: 15 }}
                                    ></Image>
                                    <Text style={{ color: 'gray' }}>5%</Text>
                                </View>
                                <Image
                                    source={require('../assets/images/cloudy.png')}
                                    style={{ width: 20, height: 20 }}
                                ></Image>
                                <Image
                                    source={require('../assets/images/cloudmoon.png')}
                                    style={{ width: 20, height: 20 }}
                                ></Image>
                                <Text style={[{ color: 'black' }, styles.textNormal]}>34{temperCelsiusBlackMedium}/25{temperCelsiusBlackMedium}</Text>
                            </View>

                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <Text style={[{ color: 'black' }, styles.textNormal]}>Thứ hai</Text>
                                <View style={{ flexDirection: 'row', alignItems: 'center', paddingStart: 20 }}>
                                    <Image
                                        source={require('../assets/images/water_drop.png')}
                                        style={{ width: 15, height: 15 }}
                                    ></Image>
                                    <Text style={{ color: 'gray' }}>6%</Text>
                                </View>
                                <Image
                                    source={require('../assets/images/cloudy.png')}
                                    style={{ width: 20, height: 20 }}
                                ></Image>
                                <Image
                                    source={require('../assets/images/cloudmoon.png')}
                                    style={{ width: 20, height: 20 }}
                                ></Image>
                                <Text style={[{ color: 'black' }, styles.textNormal]}>34{temperCelsiusBlackMedium}/26{temperCelsiusBlackMedium}</Text>
                            </View>

                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <Text style={[{ color: 'black' }, styles.textNormal]}>Thứ ba</Text>
                                <View style={{ flexDirection: 'row', alignItems: 'center', paddingStart: 20 }}>
                                    <Image
                                        source={require('../assets/images/drop.png')}
                                        style={{ width: 15, height: 15 }}
                                    ></Image>
                                    <Text style={{ color: 'gray' }}>24%</Text>
                                </View>
                                <Image
                                    source={require('../assets/images/cloudy.png')}
                                    style={{ width: 20, height: 20 }}
                                ></Image>
                                <Image
                                    source={require('../assets/images/cloudmoon.png')}
                                    style={{ width: 20, height: 20 }}
                                ></Image>
                                <Text style={[{ color: 'black' }, styles.textNormal]}>34{temperCelsiusBlackMedium}/25{temperCelsiusBlackMedium}</Text>
                            </View>

                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <Text style={[{ color: 'black' }, styles.textNormal]}>Thứ tư</Text>
                                <View style={{ flexDirection: 'row', alignItems: 'center', paddingStart: 20 }}>
                                    <Image
                                        source={require('../assets/images/drop.png')}
                                        style={{ width: 15, height: 15 }}
                                    ></Image>
                                    <Text style={{ color: 'gray' }}>20%</Text>
                                </View>
                                <Image
                                    source={require('../assets/images/cloudy.png')}
                                    style={{ width: 20, height: 20 }}
                                ></Image>
                                <Image
                                    source={require('../assets/images/cloudmoon.png')}
                                    style={{ width: 20, height: 20 }}
                                ></Image>
                                <Text style={[{ color: 'black' }, styles.textNormal]}>34{temperCelsiusBlackMedium}/25{temperCelsiusBlackMedium}</Text>
                            </View>

                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <Text style={[{ color: 'black' }, styles.textNormal]}>Thứ năm</Text>
                                <View style={{ flexDirection: 'row', alignItems: 'center', paddingStart: 20 }}>
                                    <Image
                                        source={require('../assets/images/drop.png')}
                                        style={{ width: 15, height: 15 }}
                                    ></Image>
                                    <Text style={{ color: 'gray' }}>38%</Text>
                                </View>
                                <Image
                                    source={require('../assets/images/storm.png')}
                                    style={{ width: 20, height: 20 }}
                                ></Image>
                                <Image
                                    source={require('../assets/images/cloudmoon.png')}
                                    style={{ width: 20, height: 20 }}
                                ></Image>
                                <Text style={[{ color: 'black' }, styles.textNormal]}>34{temperCelsiusBlackMedium}/25{temperCelsiusBlackMedium}</Text>
                            </View>

                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <Text style={[{ color: 'black' }, styles.textNormal]}>Thứ sáu</Text>
                                <View style={{ flexDirection: 'row', alignItems: 'center', paddingStart: 20 }}>
                                    <Image
                                        source={require('../assets/images/drop.png')}
                                        style={{ width: 15, height: 15 }}
                                    ></Image>
                                    <Text style={{ color: 'gray' }}>56%</Text>
                                </View>
                                <Image
                                    source={require('../assets/images/storm.png')}
                                    style={{ width: 20, height: 20 }}
                                ></Image>
                                <Image
                                    source={require('../assets/images/rain.png')}
                                    style={{ width: 20, height: 20 }}
                                ></Image>
                                <Text style={[{ color: 'black' }, styles.textNormal]}>31{temperCelsiusBlackMedium}/25{temperCelsiusBlackMedium}</Text>
                            </View>

                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <Text style={[{ color: 'black' }, styles.textNormal]}>Thứ bảy</Text>
                                <View style={{ flexDirection: 'row', alignItems: 'center', paddingStart: 20 }}>
                                    <Image
                                        source={require('../assets/images/drop.png')}
                                        style={{ width: 15, height: 15 }}
                                    ></Image>
                                    <Text style={{ color: 'gray' }}>35%</Text>
                                </View>
                                <Image
                                    source={require('../assets/images/storm.png')}
                                    style={{ width: 20, height: 20 }}
                                ></Image>
                                <Image
                                    source={require('../assets/images/cloudmoon.png')}
                                    style={{ width: 20, height: 20 }}
                                ></Image>
                                <Text style={[{ color: 'black' }, styles.textNormal]}>33{temperCelsiusBlackMedium}/25{temperCelsiusBlackMedium}</Text>
                            </View>
                        </View>

                        <View style={[styles.weatherlist, { height: 400, padding: 30, gap: 20 }]}>
                            <View style={[{ flexDirection: 'row', justifyContent: 'space-between' }]}>
                                <View style={[{ flexDirection: 'row', gap: 10 }]}>
                                    <Image
                                        source={require('../assets/images/uv-index.png')}
                                        style={{ width: 25, height: 25 }}
                                    ></Image>
                                    <Text style={[styles.textNormal, styles.grayC]}>
                                        Chỉ số UV</Text>
                                </View>
                                <Text style={[styles.textNormal, { fontWeight: 600 }]}>Trung bình</Text>
                            </View>

                            <View style={{ height: 1, backgroundColor: 'gray', width: '100%' }}></View>

                            <View style={[{ flexDirection: 'row', justifyContent: 'space-between' }]}>
                                <View style={[{ flexDirection: 'row', gap: 10 }]}>
                                    <Image
                                        source={require('../assets/images/sunset.png')}
                                        style={{ width: 25, height: 25 }}
                                    ></Image>
                                    <Text style={[styles.textNormal, styles.grayC]}>
                                        Bình Minh</Text>
                                </View>
                                <Text style={[styles.textNormal, { fontWeight: 600 }]}>6:06</Text>
                            </View>

                            <View style={{ height: 1, backgroundColor: 'gray', width: '100%' }}></View>

                            <View style={[{ flexDirection: 'row', justifyContent: 'space-between' }]}>
                                <View style={[{ flexDirection: 'row', gap: 10 }]}>
                                    <Image
                                        source={require('../assets/images/sunset-.png')}
                                        style={{ width: 25, height: 25 }}
                                    ></Image>
                                    <Text style={[styles.textNormal, styles.grayC]}>
                                        Hoàng hôn</Text>
                                </View>
                                <Text style={[styles.textNormal, { fontWeight: 600 }]}>18:03</Text>
                            </View>

                            <View style={{ height: 1, backgroundColor: 'gray', width: '100%' }}></View>

                            <View style={[{ flexDirection: 'row', justifyContent: 'space-between' }]}>
                                <View style={[{ flexDirection: 'row', gap: 10 }]}>
                                    <Image
                                        source={require('../assets/images/wind.png')}
                                        style={{ width: 25, height: 25 }}
                                    ></Image>
                                    <Text style={[styles.textNormal, styles.grayC]}>
                                        Gió</Text>
                                </View>
                                {weatherToday ? (
                                    <Text style={[styles.textNormal, { fontWeight: 600 }]}>{weatherToday.wind.speed} m/s</Text>
                                ) : (
                                    <Text>Đang tải dữ liệu...</Text>
                                )}
                            </View>

                            <View style={{ height: 1, backgroundColor: 'gray', width: '100%' }}></View>

                            <View style={[{ flexDirection: 'row', justifyContent: 'space-between' }]}>
                                <View style={[{ flexDirection: 'row', gap: 10 }]}>
                                    <Image
                                        source={require('../assets/images/air.png')}
                                        style={{ width: 25, height: 25 }}
                                    ></Image>
                                    <Text style={[styles.textNormal, styles.grayC]}>
                                        AQI</Text>
                                </View>
                                <Text style={[styles.textNormal, { fontWeight: 600 }]}>Trung bình(72)</Text>
                            </View>

                            <View style={{ height: 1, backgroundColor: 'gray', width: '100%' }}></View>

                            <View style={[{ flexDirection: 'row', justifyContent: 'space-between' }]}>
                                <View style={[{ flexDirection: 'row', gap: 10 }]}>
                                    <Image
                                        source={require('../assets/images/humidity.png')}
                                        style={{ width: 25, height: 25 }}
                                    ></Image>
                                    <Text style={[styles.textNormal, styles.grayC]}>
                                        Độ ẩm</Text>
                                </View>
                                {weatherToday ? (
                                    <Text style={[styles.textNormal, { fontWeight: 600 }]}>{weatherToday.main.humidity}%</Text>
                                ) : (
                                    <Text>Đang tải dữ liệu...</Text>
                                )}
                            </View>
                        </View>

                        <View style={[styles.otherThings]}>
                            <View style={[{ flexDirection: 'row', justifyContent: 'space-between' }]}>
                                <View style={[{ flexDirection: 'row', gap: 10 }]}>
                                    <Image
                                        source={require('../assets/images/pollen.png')}
                                        style={{ width: 25, height: 25 }}
                                    ></Image>
                                    <Text style={[styles.textNormal, styles.grayC]}>
                                        Phấn hoa</Text>
                                </View>
                                <Text style={[styles.textNormal, { fontWeight: 600 }]}>Thấp</Text>
                            </View>

                            <View style={{ height: 1, backgroundColor: 'gray', width: '100%' }}></View>

                            <View style={[{ flexDirection: 'row', justifyContent: 'space-between' }]}>
                                <View style={[{ flexDirection: 'row', gap: 10 }]}>
                                    <Image
                                        source={require('../assets/images/run.png')}
                                        style={{ width: 25, height: 25 }}
                                    ></Image>
                                    <Text style={[styles.textNormal, styles.grayC]}>
                                        Chạy bộ</Text>
                                </View>
                                <Text style={[styles.textNormal, { fontWeight: 600 }]}>Rất kém</Text>
                            </View>

                        </View>
                        <View style={[styles.footer]}>
                            <View style={{ flexDirection: 'row' }}>
                                <Image
                                    source={require('../assets/images/paper.png')}
                                    style={{ width: 18, height: 18, marginEnd: 4 }}
                                ></Image>
                                <Text style={[styles.grayC, styles.boldStyle]}>The Weather Channel</Text>
                            </View>
                            <Text style={[styles.grayC, styles.boldStyle]}>Đã cập nhật 15:14 04/3</Text>
                        </View>
                    </ScrollView>
                </Animated.View>
            </ImageBackground>

        </GestureHandlerRootView>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'relative',
        flex: 1,
        width: '100%',
        alignItems: 'center'
    },
    center: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    jusBetween: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    p20: {
        padding: 20
    },
    grayC: {
        color: 'gray'
    },
    textHeader: {
        fontSize: 24
    },
    boldStyle: {
        fontWeight: 500
    },
    textNormal: {
        fontSize: 16
    },
    srollview: {
        width: '100%',
        marginEnd: -60,
    },
    titleStyle: {
        fontSize: 40,
        fontWeight: '300'
        // color: "red"
    },
    background: {
        flex: 1,
        width: '100%',
        height: '100%',
        resizeMode: 'stretch', // 'cover' để ảnh phủ kín
        justifyContent: 'center',
        alignItems: 'center',
    },
    grayText: {
        color: 'gray'
    },
    title: {
        justifyContent: 'center',
        alignItems: 'center',
        width: '90%',
        height: 180,
    },
    menubar: {
        flexDirection: "row",
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 80,
        width: '100%',
        padding: 20
    },
    weatherdetail: {
        width: '90%',
        height: 350,
        borderRadius: 20,
        backgroundColor: '#fff'
    },
    errorNotif: {
        height: 50,
        width: '70%',
        marginTop: 10,
        flexDirection: 'row',
        backgroundColor: 'orange',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10
    },
    subWeather: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    weatherlist: {
        width: '90%',
        height: 350,
        backgroundColor: 'white',
        marginBottom: 15,
        padding: 20,
        borderRadius: 15,
        gap: 16
    },
    otherThings: {
        width: '90%',
        height: 150,
        backgroundColor: 'white',
        marginBottom: 10,
        padding: 30,
        borderRadius: 15,
        gap: 20
    },
    footer: {
        width: '90%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 10
    },
    menu: {
        position: "absolute",
        left: -MENU_WIDTH,
        top: 30,
        width: MENU_WIDTH,
        height: "95%",
        backgroundColor: "white",
        borderTopRightRadius: 20,
        borderBottomRightRadius: 20,
        shadowColor: "#000",
        shadowOffset: { width: -3, height: 0 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 5,
    },
    closeArea: {
        position: "absolute",
        width: 20,
        height: "100%",
        left: -20,
    },
    menuContent: {
        width: '100%',
        height: '85%',
        marginTop: 10,
        paddingHorizontal: 30
    },
    manageLocBtn: {
        marginTop: 20,
        backgroundColor: '#ddd',
        color: 'gray',
        width: '80%',
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 20
    }
});

export default HomeScreen;

