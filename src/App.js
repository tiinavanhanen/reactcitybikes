import React, {Component} from 'react';
import Select from 'react-select';
import axios from 'axios';

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

    showData = (e) => {
        this.setState({
            chosen: {
                name: e.value,
                freeBikes: e.free_bikes,
                freeSlots: e.empty_slots,
                lat: e.latitude,
                long: e.longitude,
            }
        })
    };

  render() {
    return (
        <div className="App">
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
        </div>
    );
  }
}
