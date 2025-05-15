import { View, TextInput, FlatList, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { useWeather } from '../context/weather_context';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import cities from '../assets/data/cities.json';

export default function CitySearch() {
    const [query, setQuery] = useState('');
    const { setCities } = useWeather();
    const router = useRouter();

    const filtered = cities.filter(c =>
        c.name.toLowerCase().includes(query.toLowerCase()), [query]
    );

    const handleSelect = (city) => {
        setCities(prev => [city.name, ...prev]);
        router.replace('/'); // quay về màn hình chính
    };

    return (
        <View style={styles.container}>
            <View style={[{ flexDirection:'row', height:'10%', justifyContent:'flex-start'}]}>
                <TouchableOpacity onPress={() => router.back()} style={[{ paddingEnd: 10 ,marginTop:5}]}>
                    <MaterialIcons name="arrow-back-ios" size={26} color="white" />
                </TouchableOpacity>
                <TextInput
                    style={styles.search}
                    placeholder="Nhập tên thành phố"
                    placeholderTextColor="#ccc"
                    value={query}
                    onChangeText={setQuery}
                />
            </View>
    
            <FlatList
                data={filtered}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => handleSelect(item)} style={styles.item}>
                        <Text style={styles.city}>{item.name} City</Text>
                        <Text style={styles.country}>{item.country}</Text>
                    </TouchableOpacity>
                )}
                showsHorizontalScrollIndicator={false} // tắt thanh cuộn nếu muốn
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, backgroundColor: '#103d3d'},
    search: {
        backgroundColor: '#1c4a4a',
        color: 'white',
        width:'85%',
        height:40,
        borderRadius: 8,
        padding: 12,
        marginBottom: 16,
    },
    item: { paddingVertical: 10, borderBottomColor: '#444', borderBottomWidth: 1    },
    city: { color: '#30f3d2', fontSize: 16 },
    country: { color: '#ccc' },
});