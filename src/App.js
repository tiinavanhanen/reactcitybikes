import React, {Component} from 'react';
import Select from 'react-select';
import axios from 'axios';
import Weather from "./components/Weather";
import { Map, Marker, Popup, TileLayer} from "react-leaflet";
import 'leaflet/dist/leaflet.css';
import Routing from "./components/Routing";

export default class App extends Component {

  state = {
      data: [],
      chosen: {
          name: "",
          freeBikes: "",
          freeSlots: "",
          lat: "60.170716",
          long: "24.941412"
      },
      destination: {
          lat: "",
          long: ""
      },
      isMapInit: false,
  }

  options = [];

  componentDidMount() {
      axios
          .get('http://api.citybik.es/v2/networks/citybikes-helsinki')
          .then(res => {
              const stations = res.data.network.stations;
              Array.from(stations).forEach(element => {
                  this.options.push({"value": element.name, "label": element.name,
                      "latitude": element.latitude, "longitude": element.longitude,
                      "free_bikes": element.free_bikes, "empty_slots": element.empty_slots});
              });
              console.log(this.options);
              this.setState({data: stations});
              console.log(this.state.data);
          })
  };

  saveMap = map => {
      this.map = map;
      this.setState({isMapInit: false});
  };

  showData = (e) => {
      this.setState({
          chosen: {
              name: e.value,
              freeBikes: e.free_bikes,
              freeSlots: e.empty_slots,
              lat: e.latitude,
              long: e.longitude
          }
      })
  };

    getRoute = (e) => {
        this.setState({
            destination: {
                lat: e.latitude,
                long: e.longitude
            },
            isMapInit: true
        })
    }

  render() {
      const position = this.state.chosen
      const destination = this.state.destination;
    return (
        <div className="App">
            <Map center={[position.lat, position.long]} zoom={15}
                 style={{ width: '67%', height: '500px'}}
                 ref={this.saveMap}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                />
                <Marker
                    position={[
                        position.lat,
                        position.long
                    ]}
                    onClick={() => {
                        this.setState({activeStation: this.state.chosen.name});
                    }}
                />
                {this.state.activeStation && (<Popup
                    position={[
                        position.lat,
                        position.long
                    ]}
                    onClose={() => {
                        this.setState({activeStation: null});
                    }}
                >
                    <div>
                        <h2>{this.state.chosen.name}</h2>
                        <p>Free bikes: {this.state.chosen.freeBikes}</p>
                        <p>Empty slots: {this.state.chosen.freeSlots}</p>
                    </div>
                </Popup>)}
                {this.state.isMapInit && <Routing map={this.map} position={[position.lat, position.long]} destination={[destination.lat, destination.long]}/>}
            </Map>
            <Select
                placeholder="Select bike station"
                options={this.options}
                onChange={this.showData}
            />
            <div className="data">
                <p><b>Selected station: </b> {this.state.chosen.name}</p>
                <p><b>Free bikes: </b> {this.state.chosen.freeBikes}</p>
                <p><b>Empty slots: </b> {this.state.chosen.freeSlots}</p>
            </div>
            <Select
                placeholder="Select destination station"
                options={this.options}
                onChange={this.getRoute}
            />
            <Weather></Weather>
        </div>
    );
  }
}
