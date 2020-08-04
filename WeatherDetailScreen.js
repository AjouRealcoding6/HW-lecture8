import React from 'react';
import { ActivityIndicator, Image, StyleSheet, View, Text } from 'react-native';
import Constants from 'expo-constants';

const API_KEY = '365e807154ee40fe752a0bffa0474083';
const queryUrl = (city) => `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`

export default class WeatherDetailScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
    };
  }

  componentDidMount() {
    const {
      route: {
        params: { city },
      },
    } = this.props;

    fetch(queryUrl(city))
      .then(response => response.json())
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
        <Text>온도: {celsius.toFixed(1)}</Text>
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
              width: 72,
              height: 72
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
    backgroundColor: '#8888FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  conditionContainer: {
    flexDirection: 'row',
  }
});
