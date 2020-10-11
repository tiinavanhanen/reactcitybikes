import React from 'react';
import L from "leaflet";
import "leaflet-routing-machine";
import { withLeaflet } from "react-leaflet";
import 'leaflet/dist/leaflet.css';

class Routing extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            map: this.props.map,
            leafletElement: null
        }
    }

    componentDidMount() {
        this.createLeafletElement();
    }

    componentDidUpdate() {
        this.state.leafletElement.spliceWaypoints(1,1, L.latLng(this.props.destination));
        this.state.leafletElement.spliceWaypoints(0,1, L.latLng(this.props.position));
    }

    createLeafletElement() {
        const { map } = this.props;
        this.state.leafletElement = L.Routing.control({
            waypoints: [L.latLng(this.props.position), L.latLng(this.props.destination)],
        }).addTo(map.leafletElement);
    }

    render() {
        return null
    }
}
export default withLeaflet(Routing);