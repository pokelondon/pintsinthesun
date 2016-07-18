import React from 'react';
import GA from 'react-ga';

export default class Info extends React.Component{

    constructor(props) {
        super(props);
        this.props = props;

        GA.modalview('/info');
    }

    render() {

        return (

            <div className="Info">
                <div className="Box Box-row">
                    <div className="Box-item">
                        <p className="Para--large">Pints in the Sun is an experiment that addresses the very real problem of finding a pub that will be sunny in the evening, and not overshadowed by adjacent buildings.</p>
                        <p className="Para--body">Using building outline data from OpenStreetMap, the locality around a pub (located via FourSquare) is rendered in 3D with three.js (map projection conversion courtesy of the D3 library) and onto it, a directional light is projected from the part of the sky where the sun would be at certain times of year/day. According to a Solar Almanac Calculation, helpfully implemented in JS by SunCalc.</p>
                        <p className="Para--body"><a title="POKE Blog" href="http://www.pokelondon.com/blog/fun-stuff/pints-in-the-sun/">Read more</a> about our <strong>experiment</strong> here</p>
                        <p className="Para--body">Hacked together (as an experiment) at <a href="http://www.pokelondon.com/">POKE</a>, with: <a href="http://wiki.openstreetmap.org/wiki/Overpass_API" title="filtered OpenStreetMap data via Overpass API">OpenStreetMap data</a> (<a href="http://www.openstreetmap.org/copyright" title="Open license details">ODbL</a>), <a href="http://geojson.io/">GeoJSON</a>, <a href="http://d3js.org/">D3</a>, <a href="http://threejs.org/">ThreeJS</a>, <a href="http://www.suncalc.net">SunCalc</a>, <a href="http://foursquare.com/">FourSquare</a> and <a href="http://en.wikipedia.org/wiki/Trigonometry">maths</a>!</p>
                        <p className="Para--body"><a href="https://news.ycombinator.com/item?id=7857047">Discussion on HackerNews</a></p>
                    </div>
                </div>
            </div>

        )

    }
}
