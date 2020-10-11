import React, {Component} from 'react'
import axios from "axios";

export default class Weather extends Component {

    state = {
        desc: "",
        temp: "",
        feelsLike: "",
        humid: "",
        windSpeed: "",
        windDir: "",
        img: ""
    }

    componentDidMount() {
        axios
            .get('http://api.openweathermap.org/data/2.5/weather?q=Helsinki&units=metric&appid=7c4619e38a85d5aacf6c4cba6e418a0f')
            .then(result => {
                console.log(result);
                var desc = result.data.weather[0].description;
                this.setState({
                    desc: desc.replace(/^\w/, c => c.toUpperCase()),
                    temp: (result.data.main.temp).toFixed(1) + "°C",
                    feelsLike: (result.data.main.feels_like).toFixed(1) + "°C",
                    humid: result.data.main.humidity + " %",
                    windSpeed: result.data.wind.speed,
                    windDir: this.windDegToDir(result.data.wind.deg),
                    img: "http://openweathermap.org/img/wn/" + result.data.weather[0].icon + "@2x.png"
                })
            });
    }

    windDegToDir(degree){
        if (degree>340) return 'Northerly';
        if (degree>290) return 'North Westerly';
        if (degree>250) return 'Westerly';
        if (degree>200) return 'South Westerly';
        if (degree>160) return 'Southerly';
        if (degree>120) return 'South Easterly';
        if (degree>70) return 'Easterly';
        if (degree>20) {return 'North Easterly';}
        return 'Northerly';
    }

    render() {
        return (
            <div>
                <h2>Weather in Helsinki</h2>
                <img src={this.state.img}/>
                <p>{this.state.desc}</p>
                <p>Temperature: {this.state.temp}, feels like: {this.state.feelsLike}</p>
                <p>Humidity: {this.state.humid}</p>
                <p>Wind: {this.state.windDir} at {this.state.windSpeed} m/s</p>
            </div>
        )
    }
}