import React from 'react';
import ReactDOM from 'react-dom';
import SVGInline from "react-svg-inline";

var el;

export default class Logo extends React.Component {

    constructor(props) {
        super(props);
        this.props = props;
    }

    componentDidMount() {

        el = document.querySelector('.js-logo');
        window.addEventListener('resize', this.handleResize.bind(this));
        this.handleResize();

    }

    handleResize() {
        let height = el.clientWidth * 0.48;
        el.style.height = `${height}px`;
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleResize.bind(this));
    }


    render() {
        return (

            <div className="Logo-wrapper">
                <div className="Logo js-logo">

                    {/* Rays */}
                    <div className="Logo-clipContainer">
                        <SVGInline className="Logo-rays js-rays" svg={`
                            <?xml version="1.0" encoding="utf-8"?>

                            <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                            	 viewBox="0 0 722.4 722.4" style="enable-background:new 0 0 722.4 722.4;" xml:space="preserve">
                            <style type="text/css">

                            </style>
                            <g>
                            	<g>
                            		<line class="st0" x1="361.2" y1="361.2" x2="96.5" y2="115.4"/>
                            		<line class="st0" x1="361.2" y1="361.2" x2="76.1" y2="139.4"/>
                            		<line class="st0" x1="361.2" y1="361.2" x2="57.8" y2="165.1"/>
                            		<line class="st0" x1="361.2" y1="361.2" x2="41.9" y2="192.3"/>
                            		<line class="st0" x1="361.2" y1="361.2" x2="28.4" y2="220.8"/>
                            		<line class="st0" x1="361.2" y1="361.2" x2="17.4" y2="250.3"/>
                            		<line class="st0" x1="361.2" y1="361.2" x2="9.1" y2="280.7"/>
                            		<line class="st0" x1="361.2" y1="361.2" x2="3.4" y2="311.7"/>
                            		<line class="st0" x1="361.2" y1="361.2" x2="0.5" y2="343.1"/>
                            		<line class="st0" x1="361.2" y1="361.2" x2="0.3" y2="374.6"/>
                            		<line class="st0" x1="361.2" y1="361.2" x2="2.8" y2="406"/>
                            		<line class="st0" x1="361.2" y1="361.2" x2="8.1" y2="437"/>
                            		<line class="st0" x1="361.2" y1="361.2" x2="16" y2="467.5"/>
                            		<line class="st0" x1="361.2" y1="361.2" x2="26.6" y2="497.2"/>
                            		<line class="st0" x1="361.2" y1="361.2" x2="39.7" y2="525.9"/>
                            		<line class="st0" x1="361.2" y1="361.2" x2="55.3" y2="553.2"/>
                            		<line class="st0" x1="361.2" y1="361.2" x2="73.2" y2="579.2"/>
                            		<line class="st0" x1="361.2" y1="361.2" x2="93.3" y2="603.4"/>
                            		<line class="st0" x1="361.2" y1="361.2" x2="115.4" y2="625.9"/>
                            		<line class="st0" x1="361.2" y1="361.2" x2="139.4" y2="646.3"/>
                            		<line class="st0" x1="361.2" y1="361.2" x2="165.1" y2="664.5"/>
                            		<line class="st0" x1="361.2" y1="361.2" x2="192.3" y2="680.4"/>
                            		<line class="st0" x1="361.2" y1="361.2" x2="220.8" y2="694"/>
                            		<line class="st0" x1="361.2" y1="361.2" x2="250.3" y2="704.9"/>
                            		<line class="st0" x1="361.2" y1="361.2" x2="280.7" y2="713.3"/>
                            		<line class="st0" x1="361.2" y1="361.2" x2="311.7" y2="718.9"/>
                            		<line class="st0" x1="361.2" y1="361.2" x2="343.1" y2="721.9"/>
                            		<line class="st0" x1="361.2" y1="361.2" x2="374.6" y2="722.1"/>
                            		<line class="st0" x1="361.2" y1="361.2" x2="406" y2="719.6"/>
                            		<line class="st0" x1="361.2" y1="361.2" x2="437" y2="714.3"/>
                            		<line class="st0" x1="361.2" y1="361.2" x2="467.5" y2="706.3"/>
                            		<line class="st0" x1="361.2" y1="361.2" x2="497.2" y2="695.8"/>
                            		<line class="st0" x1="361.2" y1="361.2" x2="525.9" y2="682.6"/>
                            		<line class="st0" x1="361.2" y1="361.2" x2="553.2" y2="667.1"/>
                            		<line class="st0" x1="361.2" y1="361.2" x2="579.2" y2="649.1"/>
                            		<line class="st0" x1="361.2" y1="361.2" x2="603.4" y2="629.1"/>
                            		<line class="st0" x1="361.2" y1="361.2" x2="625.9" y2="606.9"/>
                            		<line class="st0" x1="361.2" y1="361.2" x2="646.3" y2="582.9"/>
                            		<line class="st0" x1="361.2" y1="361.2" x2="664.5" y2="557.2"/>
                            		<line class="st0" x1="361.2" y1="361.2" x2="680.4" y2="530"/>
                            		<line class="st0" x1="361.2" y1="361.2" x2="694" y2="501.6"/>
                            		<line class="st0" x1="361.2" y1="361.2" x2="704.9" y2="472"/>
                            		<line class="st0" x1="361.2" y1="361.2" x2="713.3" y2="441.7"/>
                            		<line class="st0" x1="361.2" y1="361.2" x2="718.9" y2="410.7"/>
                            		<line class="st0" x1="361.2" y1="361.2" x2="721.9" y2="379.3"/>
                            		<line class="st0" x1="361.2" y1="361.2" x2="722.1" y2="347.8"/>
                            		<line class="st0" x1="361.2" y1="361.2" x2="719.6" y2="316.4"/>
                            		<line class="st0" x1="361.2" y1="361.2" x2="714.3" y2="285.3"/>
                            		<line class="st0" x1="361.2" y1="361.2" x2="706.3" y2="254.8"/>
                            		<line class="st0" x1="361.2" y1="361.2" x2="695.8" y2="225.1"/>
                            		<line class="st0" x1="361.2" y1="361.2" x2="682.6" y2="196.5"/>
                            		<line class="st0" x1="361.2" y1="361.2" x2="667.1" y2="169.1"/>
                            		<line class="st0" x1="361.2" y1="361.2" x2="649.1" y2="143.2"/>
                            		<line class="st0" x1="361.2" y1="361.2" x2="629.1" y2="118.9"/>
                            		<line class="st0" x1="361.2" y1="361.2" x2="606.9" y2="96.5"/>
                            		<line class="st0" x1="361.2" y1="361.2" x2="582.9" y2="76.1"/>
                            		<line class="st0" x1="361.2" y1="361.2" x2="557.2" y2="57.8"/>
                            		<line class="st0" x1="361.2" y1="361.2" x2="530" y2="41.9"/>
                            		<line class="st0" x1="361.2" y1="361.2" x2="501.6" y2="28.4"/>
                            		<line class="st0" x1="361.2" y1="361.2" x2="472" y2="17.4"/>
                            		<line class="st0" x1="361.2" y1="361.2" x2="441.7" y2="9.1"/>
                            		<line class="st0" x1="361.2" y1="361.2" x2="410.7" y2="3.4"/>
                            		<line class="st0" x1="361.2" y1="361.2" x2="379.3" y2="0.5"/>
                            		<line class="st0" x1="361.2" y1="361.2" x2="347.8" y2="0.3"/>
                            		<line class="st0" x1="361.2" y1="361.2" x2="316.4" y2="2.8"/>
                            		<line class="st0" x1="361.2" y1="361.2" x2="285.3" y2="8.1"/>
                            		<line class="st0" x1="361.2" y1="361.2" x2="254.8" y2="16"/>
                            		<line class="st0" x1="361.2" y1="361.2" x2="225.1" y2="26.6"/>
                            		<line class="st0" x1="361.2" y1="361.2" x2="196.5" y2="39.7"/>
                            		<line class="st0" x1="361.2" y1="361.2" x2="169.1" y2="55.3"/>
                            		<line class="st0" x1="361.2" y1="361.2" x2="143.2" y2="73.2"/>
                            		<line class="st0" x1="361.2" y1="361.2" x2="118.9" y2="93.3"/>
                            	</g>
                            	<g>
                            		<line class="st0" x1="361.2" y1="361.2" x2="106.9" y2="104.7"/>
                            		<line class="st0" x1="361.2" y1="361.2" x2="85.5" y2="127.9"/>
                            		<line class="st0" x1="361.2" y1="361.2" x2="66.2" y2="152.8"/>
                            		<line class="st0" x1="361.2" y1="361.2" x2="49.2" y2="179.3"/>
                            		<line class="st0" x1="361.2" y1="361.2" x2="34.5" y2="207.2"/>
                            		<line class="st0" x1="361.2" y1="361.2" x2="22.3" y2="236.2"/>
                            		<line class="st0" x1="361.2" y1="361.2" x2="12.7" y2="266.2"/>
                            		<line class="st0" x1="361.2" y1="361.2" x2="5.8" y2="297"/>
                            		<line class="st0" x1="361.2" y1="361.2" x2="1.5" y2="328.2"/>
                            		<line class="st0" x1="361.2" y1="361.2" x2="0" y2="359.7"/>
                            		<line class="st0" x1="361.2" y1="361.2" x2="1.2" y2="391.1"/>
                            		<line class="st0" x1="361.2" y1="361.2" x2="5.2" y2="422.4"/>
                            		<line class="st0" x1="361.2" y1="361.2" x2="11.9" y2="453.2"/>
                            		<line class="st0" x1="361.2" y1="361.2" x2="21.3" y2="483.3"/>
                            		<line class="st0" x1="361.2" y1="361.2" x2="33.2" y2="512.4"/>
                            		<line class="st0" x1="361.2" y1="361.2" x2="47.6" y2="540.5"/>
                            		<line class="st0" x1="361.2" y1="361.2" x2="64.5" y2="567.1"/>
                            		<line class="st0" x1="361.2" y1="361.2" x2="83.5" y2="592.2"/>
                            		<line class="st0" x1="361.2" y1="361.2" x2="104.7" y2="615.5"/>
                            		<line class="st0" x1="361.2" y1="361.2" x2="127.9" y2="636.9"/>
                            		<line class="st0" x1="361.2" y1="361.2" x2="152.8" y2="656.2"/>
                            		<line class="st0" x1="361.2" y1="361.2" x2="179.3" y2="673.2"/>
                            		<line class="st0" x1="361.2" y1="361.2" x2="207.2" y2="687.9"/>
                            		<line class="st0" x1="361.2" y1="361.2" x2="236.2" y2="700.1"/>
                            		<line class="st0" x1="361.2" y1="361.2" x2="266.2" y2="709.7"/>
                            		<line class="st0" x1="361.2" y1="361.2" x2="297" y2="716.6"/>
                            		<line class="st0" x1="361.2" y1="361.2" x2="328.2" y2="720.8"/>
                            		<line class="st0" x1="361.2" y1="361.2" x2="359.7" y2="722.4"/>
                            		<line class="st0" x1="361.2" y1="361.2" x2="391.1" y2="721.1"/>
                            		<line class="st0" x1="361.2" y1="361.2" x2="422.4" y2="717.1"/>
                            		<line class="st0" x1="361.2" y1="361.2" x2="453.2" y2="710.4"/>
                            		<line class="st0" x1="361.2" y1="361.2" x2="483.3" y2="701.1"/>
                            		<line class="st0" x1="361.2" y1="361.2" x2="512.4" y2="689.2"/>
                            		<line class="st0" x1="361.2" y1="361.2" x2="540.5" y2="674.7"/>
                            		<line class="st0" x1="361.2" y1="361.2" x2="567.1" y2="657.9"/>
                            		<line class="st0" x1="361.2" y1="361.2" x2="592.2" y2="638.8"/>
                            		<line class="st0" x1="361.2" y1="361.2" x2="615.5" y2="617.6"/>
                            		<line class="st0" x1="361.2" y1="361.2" x2="636.9" y2="594.5"/>
                            		<line class="st0" x1="361.2" y1="361.2" x2="656.2" y2="569.6"/>
                            		<line class="st0" x1="361.2" y1="361.2" x2="673.2" y2="543.1"/>
                            		<line class="st0" x1="361.2" y1="361.2" x2="687.9" y2="515.2"/>
                            		<line class="st0" x1="361.2" y1="361.2" x2="700.1" y2="486.1"/>
                            		<line class="st0" x1="361.2" y1="361.2" x2="709.7" y2="456.1"/>
                            		<line class="st0" x1="361.2" y1="361.2" x2="716.6" y2="425.4"/>
                            		<line class="st0" x1="361.2" y1="361.2" x2="720.8" y2="394.2"/>
                            		<line class="st0" x1="361.2" y1="361.2" x2="722.4" y2="362.7"/>
                            		<line class="st0" x1="361.2" y1="361.2" x2="721.1" y2="331.2"/>
                            		<line class="st0" x1="361.2" y1="361.2" x2="717.1" y2="300"/>
                            		<line class="st0" x1="361.2" y1="361.2" x2="710.4" y2="269.2"/>
                            		<line class="st0" x1="361.2" y1="361.2" x2="701.1" y2="239.1"/>
                            		<line class="st0" x1="361.2" y1="361.2" x2="689.2" y2="209.9"/>
                            		<line class="st0" x1="361.2" y1="361.2" x2="674.7" y2="181.9"/>
                            		<line class="st0" x1="361.2" y1="361.2" x2="657.9" y2="155.3"/>
                            		<line class="st0" x1="361.2" y1="361.2" x2="638.8" y2="130.2"/>
                            		<line class="st0" x1="361.2" y1="361.2" x2="617.6" y2="106.9"/>
                            		<line class="st0" x1="361.2" y1="361.2" x2="594.5" y2="85.5"/>
                            		<line class="st0" x1="361.2" y1="361.2" x2="569.6" y2="66.2"/>
                            		<line class="st0" x1="361.2" y1="361.2" x2="543.1" y2="49.2"/>
                            		<line class="st0" x1="361.2" y1="361.2" x2="515.2" y2="34.5"/>
                            		<line class="st0" x1="361.2" y1="361.2" x2="486.1" y2="22.3"/>
                            		<line class="st0" x1="361.2" y1="361.2" x2="456.1" y2="12.7"/>
                            		<line class="st0" x1="361.2" y1="361.2" x2="425.4" y2="5.8"/>
                            		<line class="st0" x1="361.2" y1="361.2" x2="394.2" y2="1.5"/>
                            		<line class="st0" x1="361.2" y1="361.2" x2="362.7" y2="0"/>
                            		<line class="st0" x1="361.2" y1="361.2" x2="331.2" y2="1.2"/>
                            		<line class="st0" x1="361.2" y1="361.2" x2="300" y2="5.2"/>
                            		<line class="st0" x1="361.2" y1="361.2" x2="269.2" y2="11.9"/>
                            		<line class="st0" x1="361.2" y1="361.2" x2="239.1" y2="21.3"/>
                            		<line class="st0" x1="361.2" y1="361.2" x2="209.9" y2="33.2"/>
                            		<line class="st0" x1="361.2" y1="361.2" x2="181.9" y2="47.6"/>
                            		<line class="st0" x1="361.2" y1="361.2" x2="155.3" y2="64.5"/>
                            		<line class="st0" x1="361.2" y1="361.2" x2="130.2" y2="83.5"/>
                            	</g>
                            </g>
                            </svg>
                        `} />

                        <img className="Logo-cloud Logo-cloud--1" src="img/logo/cloud.svg" />
                        <img className="Logo-cloud Logo-cloud--2" src="img/logo/cloud.svg" />

                        {/* BANNER */}
                        <SVGInline className='Logo-banner js-logo-banner' svg={`
                            <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                                 viewBox="0 0 499.1 78.2" style="enable-background:new 0 0 499.1 78.2;" xml:space="preserve">
                                <style type="text/css">

                                </style>
                                <g>
                                    <polygon class="st0 Logo-bannerEnd--left Logo-animation--banner js-bannerEndLeft" points="2.4,10.3 55.1,10.3 55.1,76.7 2.4,76.7 18.6,43.6 	"/>
                                    <polygon class="st0 Logo-bannerEnd--right Logo-animation--banner js-bannerEndRight" points="496.7,10.3 444,10.3 444,76.7 496.7,76.7 480.5,43.6 	"/>
                                    <rect x="32" y="1.5" class="st0" width="434.9" height="66.4"/>
                                    <g>
                                        <g>
                                            <path class="st1" d="M150.5,15c0-0.3,0.1-0.5,0.2-0.7c0.2-0.2,0.4-0.2,0.7-0.2h20.8c0.6,0,0.9,0.3,0.9,0.9v5.7
                                                c0,0.6-0.3,0.9-0.9,0.9h-6.6v31.2c0,0.6-0.3,0.9-0.9,0.9h-5.9c-0.6,0-0.9-0.3-0.9-0.9V21.6h-6.6c-0.3,0-0.5-0.1-0.7-0.2
                                                c-0.2-0.2-0.2-0.4-0.2-0.7V15z"/>
                                            <path class="st1" d="M180.5,52.8V15c0-0.6,0.3-0.9,1-0.9h5.8c0.3,0,0.5,0.1,0.7,0.2c0.2,0.2,0.2,0.4,0.2,0.7v15.3h7.2V15
                                                c0-0.3,0.1-0.5,0.2-0.7c0.2-0.2,0.4-0.2,0.7-0.2h5.8c0.6,0,1,0.3,1,0.9v37.7c0,0.6-0.3,0.9-1,0.9h-5.8c-0.3,0-0.5-0.1-0.7-0.2
                                                c-0.2-0.2-0.2-0.4-0.2-0.7v-15h-7.2v15c0,0.3-0.1,0.5-0.2,0.7c-0.2,0.2-0.4,0.2-0.7,0.2h-5.8C180.8,53.7,180.5,53.4,180.5,52.8z"
                                                />
                                            <path class="st1" d="M211.5,52.8V15c0-0.3,0.1-0.5,0.2-0.7s0.4-0.2,0.6-0.2h20.8c0.6,0,0.9,0.3,0.9,0.9v5.7c0,0.6-0.3,1-0.9,1
                                                h-14v8.7h10.6c0.6,0,0.9,0.3,0.9,1v5.6c0,0.6-0.3,1-0.9,1h-10.6v8.4h14c0.3,0,0.6,0.1,0.7,0.2c0.1,0.1,0.2,0.4,0.2,0.7v5.7
                                                c0,0.6-0.3,0.9-0.9,0.9h-20.8c-0.3,0-0.5-0.1-0.6-0.2S211.5,53,211.5,52.8z"/>
                                            <path class="st1" d="M257.2,45.5v-3.7c0-0.6,0.3-0.9,0.9-0.9h5.7c0.6,0,0.9,0.3,0.9,0.9v2.4c0,1.5,0.8,2.3,2.3,2.3h3
                                                c1.5,0,2.3-0.8,2.3-2.3v-5.7l-13.5-4.4c-1-0.3-1.5-1-1.5-2.1v-9.8c0-2.6,0.7-4.7,2.1-6.1c1.4-1.4,3.4-2.1,6-2.1h6.3
                                                c2.7,0,4.7,0.7,6.1,2.1c1.4,1.4,2.1,3.4,2.1,6.1V26c0,0.6-0.3,0.9-0.9,0.9h-5.7c-0.3,0-0.5-0.1-0.7-0.2c-0.2-0.2-0.2-0.4-0.2-0.7
                                                v-2.4c0-1.5-0.8-2.2-2.3-2.2H267c-0.7,0-1.3,0.2-1.7,0.6c-0.4,0.4-0.6,0.9-0.6,1.7v4.9l13.6,4.4c1,0.3,1.4,1,1.4,2.1v10.6
                                                c0,2.7-0.7,4.7-2.1,6.1c-1.4,1.4-3.4,2.1-6.1,2.1h-6.3c-2.6,0-4.6-0.7-6-2.1C257.9,50.2,257.2,48.2,257.2,45.5z"/>
                                            <path class="st1" d="M287.7,45.5V15.2c0-0.3,0.1-0.6,0.3-0.8s0.5-0.3,0.8-0.3h5.4c0.3,0,0.6,0.1,0.8,0.3s0.3,0.5,0.3,0.8V44
                                                c0,1.5,0.8,2.3,2.3,2.3h2.9c1.5,0,2.3-0.8,2.3-2.3V15.2c0-0.3,0.1-0.6,0.3-0.8s0.5-0.3,0.8-0.3h5.2c0.3,0,0.6,0.1,0.8,0.3
                                                s0.3,0.5,0.3,0.8v30.3c0,2.7-0.7,4.7-2.1,6.1c-1.4,1.4-3.4,2.1-6.1,2.1h-6.3c-2.7,0-4.7-0.7-6.1-2.1
                                                C288.4,50.2,287.7,48.2,287.7,45.5z"/>
                                            <path class="st1" d="M318.8,52.8V15c0-0.3,0.1-0.5,0.2-0.7c0.2-0.2,0.4-0.2,0.7-0.2h4.5c0.5,0,0.8,0.2,1,0.7l10.6,21.6V15
                                                c0-0.6,0.3-0.9,0.9-0.9h5.3c0.3,0,0.5,0.1,0.7,0.2c0.2,0.2,0.2,0.4,0.2,0.7v37.7c0,0.3-0.1,0.5-0.2,0.7c-0.2,0.2-0.4,0.2-0.7,0.2
                                                h-4.5c-0.5,0-0.8-0.2-1-0.7l-10.6-21.6v21.4c0,0.6-0.3,0.9-0.9,0.9h-5.3c-0.3,0-0.5-0.1-0.7-0.2C318.9,53.3,318.8,53,318.8,52.8z
                                                "/>
                                        </g>
                                    </g>
                                    <polygon class="st2 Logo-banner-fold--left Logo-animation--banner js-foldLeft" points="32,67.9 55.1,76.7 55.1,67.9 	"/>
                                    <polygon class="st2 Logo-banner-fold--right Logo-animation--banner js-foldRight" points="467.1,67.9 444,76.7 444,67.9 	"/>
                                </g>
                            </svg>
                        `} />

                    </div>


                    {/* SUN */}
                    <div className="Logo-sunContainer">
                        <SVGInline className="Logo-sun js-sun" svg={`
                            <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                            	 viewBox="0 0 391 391" style="enable-background:new 0 0 391 391;" xml:space="preserve">
                            <circle class="st0" cx="195.5" cy="195.5" r="194"/>
                            </svg>
                        `} />



                    </div>
                    {content}
                </div>
            </div>



        )
    }

}


const content = <SVGInline className="Logo-content" svg={
    `<?xml version="1.0" encoding="utf-8"?>
    <!-- Generator: Adobe Illustrator 19.2.1, SVG Export Plug-In . SVG Version: 6.00 Build 0)  -->
    <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
    	 viewBox="0 0 300.4 224.6" style="enable-background:new 0 0 300.4 224.6;" xml:space="preserve">
    <style type="text/css">

    </style>
    <g>
    	<g>
    		<g>
    			<path class="st0" d="M158.4,188.8c-1,0-1.8-0.4-2.4-1.1l-0.1-0.1l-12.9-12.9h0l-1.9-1.8v13.1c0,1.7-1.1,2.8-2.8,2.8h-10.8
    				c-0.8,0-1.5-0.3-2-0.8c-5.1-5.1-12.7-12.7-13.3-13.3c-0.2-0.3-0.4-0.6-0.5-0.9c0.1,0.1,0.1,0.2,0.2,0.2c0.6,0.6,1.3,0.8,2.2,0.8
    				h10.8c1.8,0,3-1.1,3-3v-38.1l13.9,38.8c0.5,1.4,1.6,2.2,3.1,2.2h10.3c0.9,0,1.6-0.3,2.2-0.8c0.6-0.6,0.8-1.3,0.8-2.2V91.7
    				c0-0.1,0-0.2,0-0.3L171,104c0.4,0.5,0.6,1.1,0.6,1.8v80.1c0,0.8-0.3,1.5-0.8,2c-0.5,0.5-1.2,0.8-2,0.8H158.4z M127.8,91.7
    				l13.6,13.5v24.6L127.8,91.7z"/>
    		</g>
    		<path class="st0" d="M159.6,94.6l10.4,10.3c0.2,0.2,0.3,0.5,0.3,0.9v80.1c0,0.5-0.1,0.8-0.4,1.1c-0.3,0.3-0.6,0.4-1.1,0.4h-10.3
    			c-0.6,0-1-0.2-1.3-0.6l-0.1-0.1l-0.1-0.1l-10.4-10.4h8.9c1.2,0,2.3-0.4,3.1-1.2c0.8-0.8,1.2-1.9,1.2-3.1V94.6 M131,96.8l7.7,7.7
    			l1.4,1.3v16.4L131,96.8 M129.3,141.3l10.6,29.6v5.1v10c0,1-0.5,1.5-1.5,1.5h-10.8c-0.5,0-0.8-0.1-1.1-0.4
    			c-3.4-3.4-8.1-8.1-10.9-10.9h9.4c2.6,0,4.3-1.7,4.3-4.3V141.3 M155.6,88.6h-10.8c-2.5,0-4.1,1.6-4.1,4.1v9.9l-12.4-12.3
    			c0,0-2-1.6-3.5-1.6h-10.3c-2.5,0-4.1,1.6-4.1,4.1v80.1c0,1,0.3,1.9,1,2.7c0,0,13.4,13.4,13.4,13.4c0.8,0.8,1.8,1.2,2.9,1.2h10.8
    			c2.5,0,4.1-1.7,4.1-4.1v-10c0,0,0,0,0,0l12.5,12.4c0.8,1.1,2,1.7,3.4,1.7h10.3c1.2,0,2.2-0.4,3-1.2c0.8-0.8,1.2-1.8,1.2-3v-80.1
    			c0-1.1-0.3-2-0.9-2.7L159,90.2C159,90.2,157.1,88.6,155.6,88.6L155.6,88.6z M142.2,135.7h0.6V91.7c0-1.1,0.6-1.6,1.7-1.6h10.8
    			c1.1,0,1.7,0.5,1.7,1.6v80.1c0,0.5-0.2,0.9-0.5,1.2c-0.3,0.3-0.7,0.5-1.2,0.5H145c-0.9,0-1.5-0.5-1.8-1.4l-16-44.5h-0.5v44.2
    			c0,1.1-0.6,1.7-1.7,1.7h-10.8c-0.5,0-0.9-0.2-1.2-0.5c-0.3-0.3-0.5-0.7-0.5-1.2V91.7c0-1.1,0.6-1.6,1.7-1.6h10.3
    			c1,0,1.6,0.4,1.9,1.3L142.2,135.7L142.2,135.7z"/>
    	</g>
    	<g>
    		<g>
    			<path class="st0" d="M43.4,93.2c-3-3-7.4-4.5-12.9-4.5H5.4c-2.5,0-4.1,1.6-4.1,4.1v80.1c0,1.2,0.4,2.2,1.2,3l13.1,13.1
    				c0.8,0.8,1.8,1.2,3,1.2h10.8c2.5,0,4.1-1.7,4.1-4.1v-23.8h10.1c5.5,0,9.9-1.5,12.9-4.6c3-3,4.6-7.4,4.6-12.9v-25.4
    				c0-5.6-1.5-9.9-4.5-12.9C54.3,104.1,45.7,95.4,43.4,93.2z M45.2,130.5c0,4.9-1.3,8.6-3.8,11.2c-2.6,2.6-6.3,3.9-11.2,3.9H17.7
    				v26.3c0,1.1-0.6,1.7-1.7,1.7H5.1c-0.5,0-0.9-0.2-1.2-0.5c-0.3-0.3-0.5-0.7-0.5-1.2V91.7c0-1.1,0.6-1.6,1.7-1.6h25.1
    				c4.9,0,8.7,1.3,11.2,3.8c2.5,2.5,3.8,6.3,3.8,11.2V130.5z"/>
    		</g>
    		<g class="st1">
    			<path class="st0" d="M47.5,101l7.2,7.2c2.5,2.5,3.8,6.2,3.8,11.1v25.4c0,4.8-1.3,8.5-3.8,11c-2.5,2.5-6.2,3.8-11,3.8H33.6h-2.6
    				v2.6v23.8c0,1-0.5,1.5-1.5,1.5H18.6c-0.5,0-0.8-0.1-1.1-0.4L6.6,176.1H16c2.6,0,4.3-1.7,4.3-4.3v-23.6h9.9c5.6,0,10-1.6,13-4.6
    				c3.1-3.1,4.6-7.5,4.6-13v-25.4C47.9,103.6,47.8,102.3,47.5,101 M30.5,88.6H5.4c-2.5,0-4.1,1.6-4.1,4.1v80.1c0,1.2,0.4,2.2,1.2,3
    				l13.1,13.1c0.8,0.8,1.8,1.2,3,1.2h10.8c2.5,0,4.1-1.7,4.1-4.1v-23.8h10.1c5.5,0,9.9-1.5,12.9-4.6c3-3,4.6-7.4,4.6-12.9v-25.4
    				c0-5.6-1.5-9.9-4.5-12.9c-2.2-2.2-10.9-10.9-13.1-13.1C40.4,90.2,36.1,88.6,30.5,88.6L30.5,88.6z M5.1,173.5
    				c-0.5,0-0.9-0.2-1.2-0.5c-0.3-0.3-0.5-0.7-0.5-1.2V91.7c0-1.1,0.6-1.6,1.7-1.6h25.1c4.9,0,8.7,1.3,11.2,3.8
    				c2.5,2.5,3.8,6.3,3.8,11.2v25.4c0,4.9-1.3,8.6-3.8,11.2c-2.6,2.6-6.3,3.9-11.2,3.9H17.7v26.3c0,1.1-0.6,1.7-1.7,1.7H5.1
    				L5.1,173.5z"/>
    		</g>
    	</g>
    	<g>
    		<g>
    			<path class="st0" d="M84.2,188.8c-0.9,0-1.6-0.3-2.1-0.8c-5.1-5.1-12.6-12.6-13.2-13.3c-0.2-0.2-0.3-0.5-0.4-0.8
    				c0.5,0.6,1.3,1,2.4,1h10.8c0.9,0,1.6-0.3,2.2-0.8c0.6-0.6,0.8-1.3,0.8-2.2V91.7c0-0.1,0-0.2,0-0.3L97,103.7
    				c0.1,0.1,0.2,0.2,0.3,0.2c0.3,0.6,0.7,1.5,0.7,1.9v80.1c0,0.8-0.3,1.5-0.8,2c-0.5,0.5-1.2,0.8-2,0.8H84.2z"/>
    		</g>
    		<path class="st0" d="M85.9,94.6l10.1,10l0,0l0.1,0.1c0,0,0,0,0,0c0.2,0.4,0.4,0.9,0.4,1.1v80.1c0,0.5-0.1,0.8-0.4,1.1
    			c-0.3,0.3-0.6,0.4-1.1,0.4H84.2c-0.5,0-0.9-0.1-1.1-0.4l0,0l0,0c-3.4-3.4-8-8-10.8-10.8h9.4c1.2,0,2.3-0.4,3.1-1.2
    			c0.8-0.8,1.2-1.9,1.2-3.1V94.6 M81.9,88.6H71.1c-2.5,0-4.1,1.6-4.1,4.1v80.1c0,1.1,0.3,2,0.9,2.7c0,0,13.3,13.3,13.3,13.3
    			c0.7,0.8,1.8,1.3,3.1,1.3h10.8c1.2,0,2.2-0.4,3-1.2c0.8-0.8,1.2-1.8,1.2-3v-80.1c0-1.1-0.9-2.7-0.9-2.7s-0.3-0.3-0.4-0.4
    			L85.4,90.4C84.7,89.3,83.5,88.6,81.9,88.6L81.9,88.6z M70.8,173.5c-1.1,0-1.7-0.6-1.7-1.7V91.7c0-1.1,0.6-1.6,1.7-1.6h10.8
    			c1.1,0,1.7,0.5,1.7,1.6v80.1c0,0.5-0.2,0.9-0.5,1.2c-0.3,0.3-0.7,0.5-1.2,0.5H70.8L70.8,173.5z"/>
    	</g>
    	<g>
    		<g>
    			<path class="st0" d="M206.7,188.8c-0.9,0-1.6-0.3-2.1-0.8l-12.8-12.8c-0.1-0.2-0.3-0.5-0.5-0.9c0.5,0.4,1.2,0.6,2,0.6h10.9
    				c1.8,0,3-1.1,3-3v-66.7h10.8c1.8,0,3-1.1,3-3V91.7c0-0.1,0-0.2,0-0.3l12.4,12.3l0.2,0.3c0.4,0.5,0.6,1.1,0.6,1.8v10.4
    				c0,1.7-1.1,2.8-2.8,2.8h-10.9v66.9c0,1.7-1.1,2.8-2.8,2.8H206.7z M179.8,106c-0.8,0-1.5-0.3-2-0.8c-0.3-0.3-0.5-0.7-0.7-1.1
    				c0.1,0.1,0.1,0.2,0.2,0.3c0.5,0.6,1.3,0.8,2.2,0.8h10.8v0.8H179.8z"/>
    		</g>
    		<path class="st0" d="M222.2,94.5l10,10l0.3,0.3c0.2,0.2,0.3,0.6,0.3,1v10.4c0,1-0.5,1.5-1.5,1.5h-9.6H219v2.6v65.5
    			c0,1-0.5,1.5-1.4,1.5h-10.9c-0.4,0-0.8-0.1-1.2-0.4l-10.9-10.9h9.5c2.6,0,4.3-1.7,4.3-4.3v-65.4h9.4c2.6,0,4.3-1.7,4.3-4.3V94.5
    			 M218.2,88.6h-38.4c-2.5,0-4.1,1.6-4.1,4.1v10.4c0,1.2,0.4,2.2,1.2,3c0.8,0.8,1.8,1.2,3,1.2h9.6v65.5c0,1,1.2,3.1,1.4,3.2
    			l12.8,12.9c0.7,0.7,1.8,1.2,3,1.2h10.9c2.4,0,4.1-1.7,4.1-4.1v-65.5h9.6c2.5,0,4.1-1.7,4.1-4.1v-10.4c0-1.1-0.3-2-0.9-2.7l0.1,0
    			l-13-12.9C221.6,90.2,219.6,88.6,218.2,88.6L218.2,88.6z M179.5,103.8c-0.5,0-0.9-0.2-1.2-0.5c-0.3-0.3-0.5-0.7-0.5-1.2V91.7
    			c0-1.1,0.6-1.6,1.7-1.6h38.4c1.1,0,1.7,0.5,1.7,1.6v10.4c0,1.1-0.6,1.7-1.7,1.7h-12.1v68c0,1.1-0.5,1.7-1.6,1.7h-10.9
    			c-1.1,0-1.7-0.6-1.7-1.7v-68H179.5L179.5,103.8z"/>
    	</g>
    	<g>
    		<g>
    			<path class="st0" d="M269.9,188.8c-5.1,0-9.2-1.4-12-4.2c-1.2-1.2-4-4-6.8-6.8c-2.6-2.6-5.2-5.2-6.3-6.3c-1.1-1-1.9-2.3-2.6-3.7
    				c0.6,1,1.3,2,2.1,2.8c2.8,2.8,6.9,4.2,12.1,4.2h11.7c5.3,0,9.3-1.4,12.1-4.2c2.8-2.8,4.2-6.9,4.2-12.1v-24.1c0-0.1,0-0.3,0-0.4
    				l0.1,0.6c0,0.3,0.1,0.6,0.1,0.8v5l9.8,3.2c2.2,0.9,3.4,2.6,3.4,4.9v24.1c0,5.2-1.4,9.2-4.2,12c-2.8,2.8-6.8,4.2-12,4.2H269.9z
    				 M259.8,158.4c-2.1,0-2.9-0.8-2.9-2.9v-8c0-1.8-1.1-3-3-3h-0.2l0-0.4c0-0.1,0-0.2,0-0.3v-5.1l-9.5-3.1c-1.6-0.5-2.7-1.5-3.3-2.9
    				c0.6,1,1.6,1.7,2.9,2.1l23.8,7.8v12.9c0,2.1-0.8,2.9-2.9,2.9H259.8z M284.4,133.1c-0.4-1.7-1.5-3-3.4-3.8l-24-7.9V108
    				c0-1,0.2-1.7,0.7-2.1s1.2-0.7,2.1-0.7h5c2.1,0,2.9,0.8,2.9,2.9v8.1c0,1.8,1.1,2.9,3,2.9h10.8c1.8,0,3-1.1,3-2.9v-11.1
    				c0-3.4-0.6-6.4-1.8-8.8l10.9,10.9c2.8,2.8,4.2,6.8,4.2,12v11.1c0,1.7-1.1,2.8-2.8,2.8L284.4,133.1L284.4,133.1z"/>
    		</g>
    		<path class="st0" d="M285.5,101l7.2,7.2c2.5,2.5,3.8,6.2,3.8,11.1v11.1c0,1-0.5,1.4-1.5,1.4h-9.1h-0.6c-0.7-1.6-2-2.9-3.9-3.7
    			l-0.1,0l-0.1,0l-23-7.6V108c0-0.6,0.1-1,0.3-1.2c0.2-0.2,0.6-0.3,1.2-0.3h5c1.3,0,1.5,0.2,1.5,1.5v8.1c0,2.6,1.7,4.3,4.3,4.3h10.8
    			c2.6,0,4.3-1.7,4.3-4.3v-11.1C285.8,103.6,285.7,102.3,285.5,101 M255,139.9l11.3,3.7v12c0,1.3-0.2,1.5-1.5,1.5h-5
    			c-1.3,0-1.5-0.2-1.5-1.5v-8c0-2.2-1.3-3.8-3.2-4.2V139.9 M285.8,142.2l8.1,2.7c1.7,0.7,2.6,1.9,2.6,3.7v24.1
    			c0,4.8-1.3,8.6-3.8,11.1c-2.5,2.5-6.2,3.8-11.1,3.8h-11.7c-4.8,0-8.5-1.3-11-3.8c-1.2-1.2-4-4-6.8-6.8c-0.5-0.5-1-1-1.4-1.4
    			c1.8,0.4,3.7,0.7,5.8,0.7h11.7c5.6,0,10-1.5,13.1-4.6c3-3,4.6-7.4,4.6-13.1V142.2 M268.5,88.6h-11.7c-5.5,0-9.8,1.5-12.9,4.6
    			c-3,3-4.6,7.4-4.6,12.9v24.6c0,3,1.7,5.3,4.5,6.2l8.6,2.8v4.1c0,0.2,0,0.4,0,0.6h-9c-2.5,0-4.1,1.7-4.1,4.1v10.9
    			c0,5.5,1.5,9.9,4.6,12.9c2.3,2.2,10.9,10.9,13.1,13.1c3,3,7.4,4.6,12.9,4.6h11.7c5.6,0,9.9-1.5,12.9-4.5c3-3,4.5-7.4,4.5-12.9
    			v-24.1c0-2.8-1.5-5-4.3-6.1l-8.9-2.9v-4.1c0-0.4,0-0.7-0.1-1h9.1c2.5,0,4.1-1.6,4.1-4.1v-11.1c0-5.6-1.5-9.9-4.5-12.9
    			c-2.2-2.2-10.9-10.9-13.1-13.1C278.4,90.2,274,88.6,268.5,88.6L268.5,88.6z M259.8,159.7h5c2.8,0,4.2-1.4,4.2-4.2v-13.9l-24.7-8.1
    			c-1.9-0.6-2.9-1.9-2.9-3.9v-24.6c0-4.9,1.3-8.6,3.9-11.2c2.6-2.6,6.3-3.8,11.2-3.8h11.7c4.9,0,8.7,1.3,11.2,3.8
    			c2.5,2.5,3.8,6.3,3.8,11.2v11.1c0,1.1-0.6,1.6-1.7,1.6h-10.8c-1.1,0-1.7-0.5-1.7-1.6V108c0-2.8-1.4-4.2-4.2-4.2h-5
    			c-1.3,0-2.4,0.4-3.1,1.1c-0.7,0.7-1.1,1.8-1.1,3.1v14.4l24.8,8.1c1.8,0.7,2.8,2,2.8,3.9v24.1c0,4.9-1.3,8.7-3.8,11.2
    			c-2.5,2.5-6.3,3.8-11.2,3.8h-11.7c-4.9,0-8.6-1.3-11.2-3.8c-2.6-2.6-3.9-6.3-3.9-11.2v-10.9c0-1.1,0.6-1.7,1.7-1.7h10.8
    			c1.1,0,1.7,0.6,1.7,1.7v8C255.6,158.3,257,159.7,259.8,159.7L259.8,159.7z"/>
    	</g>
    	<g>
    		<path class="st0" d="M26.8,103.8h-9.2v28h9.2c2.8,0,4.2-1.4,4.2-4.2V108C31,105.2,29.6,103.8,26.8,103.8z"/>
    		<g class="st1">
    			<path class="st0" d="M26.8,106.5c1.3,0,1.5,0.2,1.5,1.5v19.6c0,1.3-0.2,1.5-1.5,1.5h-6.5v-22.7H26.8 M26.8,103.8h-9.2v28h9.2
    				c2.8,0,4.2-1.4,4.2-4.2V108C31,105.2,29.6,103.8,26.8,103.8L26.8,103.8z"/>
    		</g>
    	</g>
    	<g>
    		<path class="st0" d="M268.2,90.1c4.9,0,8.7,1.3,11.2,3.8c2.5,2.5,3.8,6.3,3.8,11.2v11.1c0,1.1-0.6,1.6-1.7,1.6h-10.8
    			c-1.1,0-1.7-0.5-1.7-1.6V108c0-2.8-1.4-4.2-4.2-4.2h-5c-1.3,0-2.4,0.4-3.1,1.1c-0.7,0.7-1.1,1.8-1.1,3.1v14.4l24.8,8.1
    			c1.8,0.7,2.8,2,2.8,3.9v24.1c0,4.9-1.3,8.7-3.8,11.2c-2.5,2.5-6.3,3.8-11.2,3.8h-11.7c-4.9,0-8.6-1.3-11.2-3.8
    			c-2.6-2.6-3.9-6.3-3.9-11.2v-10.9c0-1.1,0.6-1.7,1.7-1.7h10.8c1.1,0,1.7,0.6,1.7,1.7v8c0,2.8,1.4,4.2,4.2,4.2h5
    			c2.8,0,4.2-1.4,4.2-4.2v-13.9l-24.7-8.1c-1.9-0.6-2.9-1.9-2.9-3.9v-24.6c0-4.9,1.3-8.6,3.9-11.2c2.6-2.6,6.3-3.8,11.2-3.8H268.2
    			 M217.8,90.1c1.1,0,1.7,0.5,1.7,1.6v10.4c0,1.1-0.6,1.7-1.7,1.7h-12.1v68c0,1.1-0.5,1.7-1.6,1.7h-10.9c-1.1,0-1.7-0.6-1.7-1.7v-68
    			h-12.1c-0.5,0-0.9-0.2-1.2-0.5c-0.3-0.3-0.5-0.7-0.5-1.2V91.7c0-1.1,0.6-1.6,1.7-1.6H217.8 M155.3,90.1c1.1,0,1.7,0.5,1.7,1.6
    			v80.1c0,0.5-0.2,0.9-0.5,1.2c-0.3,0.3-0.7,0.5-1.2,0.5H145c-0.9,0-1.5-0.5-1.8-1.4l-16-44.5h-0.5v44.2c0,1.1-0.6,1.7-1.7,1.7
    			h-10.8c-0.5,0-0.9-0.2-1.2-0.5c-0.3-0.3-0.5-0.7-0.5-1.2V91.7c0-1.1,0.6-1.6,1.7-1.6h10.3c1,0,1.6,0.4,1.9,1.3l15.8,44.4h0.6V91.7
    			c0-1.1,0.6-1.6,1.7-1.6H155.3 M81.6,90.1c1.1,0,1.7,0.5,1.7,1.6v80.1c0,0.5-0.2,0.9-0.5,1.2c-0.3,0.3-0.7,0.5-1.2,0.5H70.8
    			c-1.1,0-1.7-0.6-1.7-1.7V91.7c0-1.1,0.6-1.6,1.7-1.6H81.6 M30.2,90.1c4.9,0,8.7,1.3,11.2,3.8c2.5,2.5,3.8,6.3,3.8,11.2v25.4
    			c0,4.9-1.3,8.6-3.8,11.2c-2.6,2.6-6.3,3.9-11.2,3.9H17.7v26.3c0,1.1-0.6,1.7-1.7,1.7H5.1c-0.5,0-0.9-0.2-1.2-0.5
    			c-0.3-0.3-0.5-0.7-0.5-1.2V91.7c0-1.1,0.6-1.6,1.7-1.6H30.2 M17.7,131.8h9.2c2.8,0,4.2-1.4,4.2-4.2V108c0-2.8-1.4-4.2-4.2-4.2
    			h-9.2V131.8 M268.2,87.4h-11.7c-5.6,0-9.9,1.6-13,4.6c-3.1,3.1-4.6,7.5-4.6,13v24.6c0,3.1,1.7,5.4,4.7,6.4l22.9,7.5v12
    			c0,1.3-0.2,1.5-1.5,1.5h-5c-1.3,0-1.5-0.2-1.5-1.5v-8c0-2.6-1.7-4.3-4.3-4.3h-10.8c-2.6,0-4.3,1.7-4.3,4.3v10.9
    			c0,5.6,1.6,10,4.6,13.1c3.1,3.1,7.5,4.6,13,4.6h11.7c5.6,0,10-1.5,13.1-4.6c3-3,4.6-7.4,4.6-13.1v-24.1c0-2.9-1.6-5.2-4.4-6.3
    			l-0.1,0l-0.1,0l-23-7.6V108c0-0.6,0.1-1,0.3-1.2c0.2-0.2,0.6-0.3,1.2-0.3h5c1.3,0,1.5,0.2,1.5,1.5v8.1c0,2.6,1.7,4.3,4.3,4.3h10.8
    			c2.6,0,4.3-1.7,4.3-4.3v-11.1c0-5.6-1.5-10-4.6-13.1C278.2,89,273.8,87.4,268.2,87.4L268.2,87.4z M217.8,87.4h-38.4
    			c-2.6,0-4.3,1.7-4.3,4.3v10.4c0,1.2,0.4,2.3,1.2,3.1c0.8,0.8,1.9,1.2,3.1,1.2h9.4v65.4c0,2.6,1.7,4.3,4.3,4.3h10.9
    			c2.6,0,4.3-1.7,4.3-4.3v-65.4h9.4c2.6,0,4.3-1.7,4.3-4.3V91.7C222.2,89.1,220.4,87.4,217.8,87.4L217.8,87.4z M155.3,87.4h-10.8
    			c-2.6,0-4.3,1.7-4.3,4.3v30.5l-11.3-31.7c-0.7-1.9-2.3-3.1-4.4-3.1h-10.3c-2.6,0-4.3,1.7-4.3,4.3v80.1c0,1.2,0.4,2.3,1.2,3.1
    			c0.8,0.8,1.9,1.2,3.1,1.2h10.8c2.6,0,4.3-1.7,4.3-4.3v-30.5l11.4,31.7c0.7,2,2.3,3.1,4.3,3.1h10.3c1.2,0,2.3-0.4,3.1-1.2
    			c0.8-0.8,1.2-1.9,1.2-3.1V91.7C159.6,89.1,157.9,87.4,155.3,87.4L155.3,87.4z M81.6,87.4H70.8c-2.6,0-4.3,1.7-4.3,4.3v80.1
    			c0,2.6,1.7,4.3,4.3,4.3h10.8c1.2,0,2.3-0.4,3.1-1.2c0.8-0.8,1.2-1.9,1.2-3.1V91.7C85.9,89.1,84.2,87.4,81.6,87.4L81.6,87.4z
    			 M30.2,87.4H5.1c-2.6,0-4.3,1.7-4.3,4.3v80.1c0,1.2,0.4,2.3,1.2,3.1c0.8,0.8,1.9,1.2,3.1,1.2H16c2.6,0,4.3-1.7,4.3-4.3v-23.6h9.9
    			c5.6,0,10-1.6,13-4.6c3.1-3.1,4.6-7.5,4.6-13v-25.4c0-5.6-1.5-10-4.6-13.1C40.2,89,35.8,87.4,30.2,87.4L30.2,87.4z M20.3,106.5
    			h6.5c1.3,0,1.5,0.2,1.5,1.5v19.6c0,1.3-0.2,1.5-1.5,1.5h-6.5V106.5L20.3,106.5z"/>
    		<path class="st2" d="M3.5,171.8V91.7c0-1.1,0.6-1.6,1.7-1.6h25.1c4.9,0,8.7,1.3,11.2,3.8c2.5,2.5,3.8,6.3,3.8,11.2v25.4
    			c0,4.9-1.3,8.6-3.8,11.2c-2.6,2.6-6.3,3.9-11.2,3.9H17.7v26.3c0,1.1-0.6,1.7-1.7,1.7H5.1c-0.5,0-0.9-0.2-1.2-0.5
    			C3.6,172.7,3.5,172.3,3.5,171.8z M17.7,131.8h9.2c2.8,0,4.2-1.4,4.2-4.2V108c0-2.8-1.4-4.2-4.2-4.2h-9.2V131.8z M69.1,171.8V91.7
    			c0-1.1,0.6-1.6,1.7-1.6h10.8c1.1,0,1.7,0.5,1.7,1.6v80.1c0,0.5-0.2,0.9-0.5,1.2c-0.3,0.3-0.7,0.5-1.2,0.5H70.8
    			C69.7,173.5,69.1,172.9,69.1,171.8z M112.4,171.8V91.7c0-1.1,0.6-1.6,1.7-1.6h10.3c1,0,1.6,0.4,1.9,1.3l15.8,44.4h0.6V91.7
    			c0-1.1,0.6-1.6,1.7-1.6h10.8c1.1,0,1.7,0.5,1.7,1.6v80.1c0,0.5-0.2,0.9-0.5,1.2c-0.3,0.3-0.7,0.5-1.2,0.5H145
    			c-0.9,0-1.5-0.5-1.8-1.4l-16-44.5h-0.5v44.2c0,1.1-0.6,1.7-1.7,1.7h-10.8c-0.5,0-0.9-0.2-1.2-0.5
    			C112.6,172.7,112.4,172.3,112.4,171.8z M177.8,102.1V91.7c0-1.1,0.6-1.6,1.7-1.6h38.4c1.1,0,1.7,0.5,1.7,1.6v10.4
    			c0,1.1-0.6,1.7-1.7,1.7h-12.1v68c0,1.1-0.5,1.7-1.6,1.7h-10.9c-1.1,0-1.7-0.6-1.7-1.7v-68h-12.1c-0.5,0-0.9-0.2-1.2-0.5
    			C178,103.1,177.8,102.6,177.8,102.1z M241.4,158.5v-10.9c0-1.1,0.6-1.7,1.7-1.7h10.8c1.1,0,1.7,0.6,1.7,1.7v8
    			c0,2.8,1.4,4.2,4.2,4.2h5c2.8,0,4.2-1.4,4.2-4.2v-13.9l-24.7-8.1c-1.9-0.6-2.9-1.9-2.9-3.9v-24.6c0-4.9,1.3-8.6,3.9-11.2
    			c2.6-2.6,6.3-3.8,11.2-3.8h11.7c4.9,0,8.7,1.3,11.2,3.8c2.5,2.5,3.8,6.3,3.8,11.2v11.1c0,1.1-0.6,1.6-1.7,1.6h-10.8
    			c-1.1,0-1.7-0.5-1.7-1.6V108c0-2.8-1.4-4.2-4.2-4.2h-5c-1.3,0-2.4,0.4-3.1,1.1c-0.7,0.7-1.1,1.8-1.1,3.1v14.4l24.8,8.1
    			c1.8,0.7,2.8,2,2.8,3.9v24.1c0,4.9-1.3,8.7-3.8,11.2c-2.5,2.5-6.3,3.8-11.2,3.8h-11.7c-4.9,0-8.6-1.3-11.2-3.8
    			C242.7,167.1,241.4,163.4,241.4,158.5z"/>
    	</g>
    </g>
    <g>
    	<text transform="matrix(1 0 0 1 132.8513 217.5559)" class="st0 st3 st4">in</text>
    </g>
    <g>
    	<g>
    		<path class="st5" d="M142.1,25.3c0,0-2,3.8-2.8,6.2c-0.8,2.4,0.5,5.2-4.2,9c-1,0.9-4,6.9-4,6.9s-10.6,20.8-11.2,21.9
    			c-0.6,1.1-1.4,1.8-3.4,1.9c-2.1,0.1-6.5-1.1-8.8-2l-0.2-0.1c-2.3-1-6.3-3.3-7.7-4.8c-1.4-1.5-1.4-2.5-1.1-3.8
    			c0.4-1.2,7.6-23.4,7.6-23.4s2.1-6.3,2.1-7.7c-0.6-5.9,2.3-7.1,3.4-9.3c1.1-2.3,2.4-6.4,2.4-6.4L142.1,25.3z"/>
    		<line class="st6" x1="109.3" y1="27.5" x2="139.1" y2="31.6"/>
    		<path class="st7" d="M108.7,27.1c0,0.7-0.4,1.4-0.3,2.3c0.1,1.3-2.1,7.7-2.1,7.7s-7.3,22.1-7.6,23.4c-0.4,1.2-0.3,2.2,1.1,3.8
    			c1.4,1.5,5.4,3.9,7.7,4.8l0.2,0.1c2.3,1,6.8,2.1,8.8,2c2.1-0.1,2.8-0.8,3.4-1.9c0.6-1.1,11.2-21.9,11.2-21.9s3-6,4-6.9
    			c4.7-3.7,3.4-6.6,4.2-9c0-0.1,0.1-0.2,0.1-0.2L108.7,27.1z"/>
    		<path class="st6" d="M103.2,59.3c1.8-0.1,5.6,0.9,7.6,1.7l0.2,0.1c2,0.8,5.4,2.8,6.6,4.2"/>
    	</g>
    	<g>
    		<path class="st5" d="M146.3,25.3c0,0,2,3.8,2.8,6.2s-0.5,5.2,4.2,9c1,0.9,4,6.9,4,6.9s10.6,20.8,11.2,21.9
    			c0.6,1.1,1.4,1.8,3.4,1.9c2.1,0.1,6.5-1.1,8.8-2l0.2-0.1c2.3-1,6.3-3.3,7.7-4.8c1.4-1.5,1.4-2.5,1.1-3.8
    			c-0.4-1.2-7.6-23.4-7.6-23.4s-2.1-6.3-2.1-7.7c0.6-5.9-2.3-7.1-3.4-9.3c-1.1-2.3-2.4-6.4-2.4-6.4L146.3,25.3z"/>
    		<line class="st6" x1="179.1" y1="27.5" x2="149.2" y2="31.6"/>
    		<path class="st7" d="M179.7,27.1c0,0.7,0.4,1.4,0.3,2.3c-0.1,1.3,2.1,7.7,2.1,7.7s7.3,22.1,7.6,23.4c0.4,1.2,0.3,2.2-1.1,3.8
    			c-1.4,1.5-5.4,3.9-7.7,4.8l-0.2,0.1c-2.3,1-6.8,2.1-8.8,2c-2.1-0.1-2.8-0.8-3.4-1.9c-0.6-1.1-11.2-21.9-11.2-21.9s-3-6-4-6.9
    			c-4.7-3.7-3.4-6.6-4.2-9c0-0.1-0.1-0.2-0.1-0.2L179.7,27.1z"/>
    		<path class="st6" d="M185.2,59.3c-1.8-0.1-5.6,0.9-7.6,1.7l-0.2,0.1c-2,0.8-5.4,2.8-6.6,4.2"/>
    	</g>
    	<g>
    		<line class="st6" x1="152.8" y1="15.6" x2="161" y2="10.7"/>
    		<line class="st6" x1="149.1" y1="12.1" x2="155.5" y2="0.7"/>
    		<line class="st6" x1="144.2" y1="10.9" x2="144.2" y2="1.5"/>
    		<line class="st6" x1="139.4" y1="12.3" x2="132.8" y2="1.1"/>
    		<line class="st6" x1="135.9" y1="16" x2="127.3" y2="11.1"/>
    	</g>
    	<circle class="st2 bubbleAnim" cx="118.6" cy="38.8" r="2.5"/>
    	<circle class="st2 bubbleAnim" cx="121.9" cy="44.3" r="1.5"/>
    	<circle class="st2 bubbleAnim" cx="115.3" cy="48.6" r="2"/>
    	<circle class="st2 bubbleAnim" cx="173.3" cy="45" r="2.6"/>
    	<circle class="st2 bubbleAnim" cx="166.7" cy="40.7" r="1.5"/>
    	<circle class="st2 bubbleAnim" cx="171.6" cy="34.8" r="1.5"/>
    	<circle class="st2 bubbleAnim" cx="171" cy="52.5" r="1.4"/>
    </g>
    </svg>`
} />
