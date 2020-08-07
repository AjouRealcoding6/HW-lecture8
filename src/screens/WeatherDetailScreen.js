import React from 'react';
import { ActivityIndicator, Image, StyleSheet, View, Text } from 'react-native';
import openWeatherApi from '../api/OpenWeatherApi';

export default class WeatherDetailScreen extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: true,
        };
    }

    componentDidMount() {
        this.setState({ isLoading: true });

        openWeatherApi.fetchWeatherInfoByCityName(this.props.route.params.city)
            .then(info => {
                console.log(info);
                this.setState({
                    ...info,
                    isLoading: false,
                });
            });
    }

    renderTemperature() {
        const celsius = this.state.main.temp - 273.15;

        return (
            <Text style = {styles.text}>온도: {celsius.toFixed(1)}</Text>
        )
    }

    renderWeatherCondition() {
        // https://openweathermap.org/weather-conditions
        return this.state.weather.map(({
                                           icon,
                                       }, index) => {
            return (
                <View key={index}>
                    <Image source={{
                        uri: `http://openweathermap.org/img/wn/${icon}@2x.png`,
                        width: 160,
                        height: 160,
                    }} />
                </View>
            );
        });
    }

    render() {
        const {
            route: {
                params: { city },
            },
            navigation,
        } = this.props;

        navigation.setOptions({ title: `${city} 날씨` });

        if (this.state.isLoading) {
            return (
                <View style={styles.container}>
                    <ActivityIndicator size="large" />
                </View>
            )
        }

        return (
            <View style={styles.container}>
                {this.renderTemperature()}
                <View style={styles.conditionContainer}>
                    {this.renderWeatherCondition()}
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        fontSize: 30,
    },
    conditionContainer: {
        flexDirection: 'row',
    },
});