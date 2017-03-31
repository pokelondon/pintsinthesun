import React from 'react';
import { searchPubs, getLocationData } from '../../services/googlemaps';
import { getPub } from '../../services/pintsinthesun';
import StaticMap from '../../components/static-map';
import hashHistory from 'react-router'
import classNames from 'classNames';
import config from '../../config';

export default class AddPubComponent extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            searchResults: null,
            placeID: null,
            locationLat: this.props.centre.lat,
            locationLng: this.props.centre.lng,
            locationData: null,
            searchResults: null,
            searchTerm: '',
            selectedSearchResultIndex: -1
        }
    }

    /**
    * Handle typing in search box and search immediately
    * @param {SyntheticEvent} e - the key event
    */
    onSearchChange(e) {
        this.doSearch(e.target.value);
    }


    /**
    * Perform the search
    * @param {string} term - search term to use
    */
    doSearch(term){
        this.setState({
            searchTerm: term,
            selectedSearchResultIndex: -1
        });

        //get the bounds of the current map, so the search weights on this area
        const bounds = this.mapRef.getBounds();
        searchPubs(term, bounds, (results) => {
            console.log('search results', results);
            this.setState({
                searchResults: results
            });
        });
    }

    /**
    * Focus on a new location once its selected from the search results or map
    * @param {string} placeID - the google place_id of the location to focus on
    * @return null
    */
    focusOnLocation(placeID) {

        if(!placeID){
            return;
        }

        //check if its in the DB already
        getPub(placeID).then((response) => {
            return response.json();
        }).then((data) => {
            //its not - find out more about the place and the focus the map on it
            if(!data.pub){
                getLocationData(placeID, this.googleMapRef, (result) => {
                    this.setState({
                        locationLat: result.geometry.location.lat(),
                        locationLng: result.geometry.location.lng(),
                        placeID: placeID,
                        locationData: result,
                        locationIsPub: this.testIsPub(result.types),
                        searchResults: null,
                        textFieldIsFocussed: null
                    });
                });
            } else {
                //exists in the database already
                if(data.pub.rejected){
                    this.props.showDialog('That pub has already been suggested, but we didn\'t think it was sunny enough&hellip;');
                } else {
                    this.props.showDialog('Thanks, but that pub has already been suggested!');
                }
            }

        })


    }


    /**
    * Check if the list of types is classed as a pub
    * This is now deliberately vague and accepts 'establishment' as a pub, because the
    * types returned from google autocomplete is not as detailed as a full place lookup
    * @param {Array} typeArray - the array of types returned by google
    * @return {boolean} Whether we deem it a pub or not
    */
    testIsPub(typeArray){
        let isPub = false;
        typeArray.forEach( (type) => {
            if(config.ACCEPTED_PLACE_TYPES.indexOf(type) != -1){
                isPub = true;
            }
        });
        return isPub;
    }

    /**
    * Handle submit of search form
    * @param {SyntheticEvent} e - the event
    */
    onSearchFormSubmit(e) {
        e.preventDefault();
        this.doSearch(this.state.searchTerm);
    }


    /**
    * Handle focus on search field
    */
    onSearchFocus(){
        this.setState({textFieldIsFocussed: true});
    }

    /**
    * Handle blur of search field
    */
    onSearchBlur(){
        this.setState({textFieldIsFocussed: false});
    }


    /**
    * Handle up/down/enter keypresses to navigate through drop down results list
    * @param {SyntheticEvent} e - the key down event
    */
    onSearchKeyDown(e) {
        //if there is a selected search result, and the enter key is pressed
        if(e.key === 'Enter' && this.state.selectedSearchResultIndex >= 0){
            e.preventDefault();
            this.focusOnLocation(this.state.searchResults[this.state.selectedSearchResultIndex].place_id);
        }
        if(e.key === 'ArrowDown'){
            e.preventDefault();
            const nextIndex = (this.state.selectedSearchResultIndex + 1 < this.state.searchResults.length) ? this.state.selectedSearchResultIndex + 1 : 0;
            this.setState({selectedSearchResultIndex: nextIndex});
        }
        if(e.key === 'ArrowUp'){
            e.preventDefault();
            const nextIndex = (this.state.selectedSearchResultIndex - 1 >= 0) ? this.state.selectedSearchResultIndex - 1 : this.state.searchResults.length - 1;
            this.setState({selectedSearchResultIndex: nextIndex});
        }
    }


    /**
    * Focus on a search result on rollover
    * @param {number} index - the index number of the search result
    */
    onSearchResultRollover(index){
        this.setState({selectedSearchResultIndex: index});
    }


    /**
    * Slightly hacky way to get the actual google map. The map child
    * component accepts this function as a prop, to pass back its ref
    * @param {GoogleMap} mapRef - the reference to the google map
    */
    setMapRefFromChild(mapRef){
        this.mapRef = mapRef;
    }


    /**
    * Get the JSX needed to create the pub detail card
    * @return {jsx} the markup
    */
    getPubDetails() {
        if(this.state.locationData && this.state.locationIsPub){
            return (
                <div>
                    <div className="Box Box-row">

                        <div className="Box Box-item">
                            <h2 className="Heading--2">{this.state.locationData.name}</h2>
                            <p>{this.state.locationData.formatted_address}</p>
                        </div>
                    </div>
                    <div className="Box Box-row">
                        <div className="Box Box-item Box-item--noPadding">
                            <button onClick={this.props.addPub.bind(this, this.state.locationData)} className="Button--secondary">Add this pub</button>
                        </div>
                    </div>
                </div>
            )
        }
    }


    /**
    * Get the JSX needed to create the search result list
    * @return {jsx} the markup
    */
    getResultList() {
        let resultList;

        if(!this.state.searchResults && !this.state.placeID && this.state.searchTerm.length) {
            resultList = <div className="Box-row Search-resultContainer"><div className="Box Box-row Search-resultList"><div className="Box-item Box-item--noPadding">No results :(</div></div></div>
        }

        if(this.state.searchResults && this.state.searchTerm.length) {

            const results = this.state.searchResults.map ( (result, idx) => {
                const classes = classNames({
                    'Search-result': true,
                    'Search-result--active': idx === this.state.selectedSearchResultIndex,
                    'Search-result--isPub': this.testIsPub(result.types)
                });
                return <div className={classes} onMouseOver={this.onSearchResultRollover.bind(this, idx)} onClick={this.focusOnLocation.bind(this, result.place_id)} key={result.place_id}>{result.description}</div>
            });
            resultList = <div className="Box-row Search-resultContainer"><div className="Box Box-row Search-resultList"><div className="Box-item Box-item--noPadding">{results}</div></div></div>
        }
        return resultList;
    }


    /**
    * React render method
    */
    render(){

        return (
            <div className="Screen Add">

                <header className="Screen-header">
                    <div className="max-width">
                        <p className="Heading--1">Recommend a pub in the sun</p>
                        <div className="Box Box-row">
                            <div className="Box Box-item">
                                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean faucibus tincidunt ipsum eu venenatis. Sed consequat in mi vitae elementum.</p>
                            </div>
                        </div>

                        <form onSubmit={this.onSearchFormSubmit.bind(this)} className="Box Box-row">
                            <input
                                type="search"
                                className="Input--search Box-item flex-2"
                                onFocus={this.onSearchFocus.bind(this)}
                                onBlur={this.onSearchBlur.bind(this)}
                                onKeyDown={this.onSearchKeyDown.bind(this)}
                                onChange={this.onSearchChange.bind(this)}
                                value={this.state.searchTerm}
                                placeholder="e.g Barley Mow, Marlyebone"
                            />
                            <div className="Box-item Box-item--noPadding flex-1">
                                <button className="Button--secondary">Search</button>
                            </div>
                        </form>
                    </div>
                </header>

                <div className="Screen-main max-width">
                    {this.getResultList()}
                    <div className="Box Box-row">
                        <div className="Box Box-item Box-item--noPadding">
                            <StaticMap
                                centre={{
                                    lat: this.state.locationLat,
                                    lng: this.state.locationLng
                                }}
                                setMapRef={this.setMapRefFromChild.bind(this)}
                                controllable={true}
                                onPlaceClick={this.focusOnLocation.bind(this)}
                            />
                        </div>
                    </div>
                    {this.getPubDetails()}
                </div>
            </div>
        )

    }

}

