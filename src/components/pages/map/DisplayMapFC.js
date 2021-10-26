import React, { useLayoutEffect, useRef } from 'react';
import marker0 from './marker0.png'
import marker1 from './marker1.png'
import marker2 from './marker2.png'
import marker3 from './marker3.png'
import marker4 from './marker4.png'
import marker5 from './marker5.png'
// function addMarkersToMap(H, map) {
//     var parisMarker = new H.map.Marker({ lat: 48.8567, lng: 2.3508 });
//     map.addObject(parisMarker);

//     var romeMarker = new H.map.Marker({ lat: 41.9, lng: 12.5 });
//     map.addObject(romeMarker);

//     var berlinMarker = new H.map.Marker({ lat: 52.5166, lng: 13.3833 });
//     map.addObject(berlinMarker);

//     var madridMarker = new H.map.Marker({ lat: 40.4, lng: -3.6833 });
//     map.addObject(madridMarker);

//     var londonMarker = new H.map.Marker({ lat: 10.8254403, lng: 106.6678098 });
//     map.addObject(londonMarker);
// }

const TOKEN = 'NaJI_eMG1wlE5up2CIhR395SNUZaTEFqO0Dibo_nv5I'

export const DisplayMapFC = ({ centerLAT, centerLNG, coodirnate1, coodirnate2,
    coodirnate3, coodirnate4, coodirnate5 }) => {
    // Create a reference to the HTML element we want to put the map on
    const mapRef = useRef(null);
    /**
     * Create the map instance
     * While `useEffect` could also be used here, `useLayoutEffect` will render
     * the map sooner
     */
    useLayoutEffect(() => {
        // `mapRef.current` will be `undefined` when this hook first runs; edge case that
        if (!mapRef.current) return;
        const H = window.H;
        const platform = new H.service.Platform({
            apikey: TOKEN
        });
        const defaultLayers = platform.createDefaultLayers();
        const hMap = new H.Map(mapRef.current, defaultLayers.vector.normal.map, {
            zoom: 4,
            center: { lat: centerLAT, lng: centerLNG },
            pixelRatio: window.devicePixelRatio || 1
        });
        window.addEventListener('resize', () => hMap.getViewPort().resize())
        //Traffic layer - enable if wanted
        // const service = platform.getTrafficService()
        // const provider = new H.service.traffic.flow.Provider(service)
        // const layer = new H.map.layer.TileLayer(provider)
        // hMap.addLayer(layer)

        var routingParameters0 = {
            'routingMode': 'fast',
            'transportMode': 'car',
            // The start point of the route:
            'origin': `${centerLAT},${centerLNG}`,
            // The end point of the route:
            'destination': `${coodirnate1}`,
            // Include the route shape in the response
            'return': 'polyline'
        };
        var routingParameters1 = {
            'routingMode': 'fast',
            'transportMode': 'car',
            // The start point of the route:
            'origin': `${coodirnate1}`,
            // The end point of the route:
            'destination': `${coodirnate2}`,
            // Include the route shape in the response
            'return': 'polyline'
        };
        var routingParameters2 = {
            'routingMode': 'fast',
            'transportMode': 'car',
            // The start point of the route:
            'origin': `${coodirnate2}`,
            // The end point of the route:
            'destination': `${coodirnate3}`,
            // Include the route shape in the response
            'return': 'polyline'
        };
        var routingParameters3 = {
            'routingMode': 'fast',
            'transportMode': 'car',
            // The start point of the route:
            'origin': `${coodirnate3}`,
            // The end point of the route:
            'destination': `${coodirnate4}`,
            // Include the route shape in the response
            'return': 'polyline'
        };
        var routingParameters4 = {
            'routingMode': 'fast',
            'transportMode': 'car',
            // The start point of the route:
            'origin': `${coodirnate4}`,
            // The end point of the route:
            'destination': `${coodirnate5}`,
            // Include the route shape in the response
            'return': 'polyline'
        };
        const icon = img => {
            return new H.map.Icon(img, { size: { w: 40, h: 50 }, stickHeight: 90, stickColor: 'red', border: 'none' });
        }
        const onResult0 = (result) => {
            // ensure that at least one route was found
            if (result.routes.length) {
                result.routes[0].sections.forEach((section) => {
                    // Create a linestring to use as a point source for the route line
                    let linestring = H.geo.LineString.fromFlexiblePolyline(section.polyline);
                    // Create an outline for the route polyline:
                    // var routeOutline = new H.map.Polyline(linestring, {
                    //     style: {
                    //         lineWidth: 10,
                    //         strokeColor: 'rgba(0, 128, 255, 0.7)',
                    //         lineTailCap: 'arrow-tail',
                    //         lineHeadCap: 'arrow-head'
                    //     }
                    // });
                    // // Create a patterned polyline:
                    // var routeArrows = new H.map.Polyline(linestring, {
                    //     style: {
                    //         lineWidth: 10,
                    //         fillColor: 'white',
                    //         strokeColor: 'rgba(255, 255, 255, 1)',
                    //         lineDash: [0, 2],
                    //         lineTailCap: 'arrow-tail',
                    //         lineHeadCap: 'arrow-head'
                    //     }
                    // });
                    // // create a group that represents the route line and contains
                    // // outline and the pattern
                    // var routeLine = new H.map.Group();
                    // routeLine.addObjects([routeOutline, routeArrows]);

                    // Create a polyline to display the route:
                    let routeLine = new H.map.Polyline(linestring, {
                        style: { strokeColor: '#f1ad0b', lineWidth: 3 }
                    });

                    // optionally - resize a larger PNG image to a specific size
                    const startMarkerIcon = icon(marker0)
                    const endMarkerIcon = icon(marker1)

                    // Create a marker for the start point:
                    let startMarker = new H.map.Marker(section.departure.place.location, { icon: startMarkerIcon });

                    // Create a marker for the end point:
                    let endMarker = new H.map.Marker(section.arrival.place.location, { icon: endMarkerIcon });

                    // Add the route polyline and the two markers to the map:
                    hMap.addObjects([routeLine, startMarker, endMarker]);

                    // Set the map's viewport to make the whole route visible:
                    hMap.getViewModel().setLookAtData({ bounds: routeLine.getBoundingBox() });
                });
            }
        };
        const onResult1 = (result) => {
            // ensure that at least one route was found
            if (result.routes.length) {
                result.routes[0].sections.forEach((section) => {
                    // Create a linestring to use as a point source for the route line
                    let linestring = H.geo.LineString.fromFlexiblePolyline(section.polyline);

                    // Create an outline for the route polyline:
                    // var routeOutline = new H.map.Polyline(linestring, {
                    //     style: {
                    //         lineWidth: 10,
                    //         strokeColor: 'rgba(0, 128, 255, 0.7)',
                    //         lineTailCap: 'arrow-tail',
                    //         lineHeadCap: 'arrow-head'
                    //     }
                    // });
                    // // Create a patterned polyline:
                    // var routeArrows = new H.map.Polyline(linestring, {
                    //     style: {
                    //         lineWidth: 10,
                    //         fillColor: 'white',
                    //         strokeColor: 'rgba(255, 255, 255, 1)',
                    //         lineDash: [0, 2],
                    //         lineTailCap: 'arrow-tail',
                    //         lineHeadCap: 'arrow-head'
                    //     }
                    // });
                    // // create a group that represents the route line and contains
                    // // outline and the pattern
                    // var routeLine = new H.map.Group();
                    // routeLine.addObjects([routeOutline, routeArrows]);

                    // Create a polyline to display the route:
                    let routeLine = new H.map.Polyline(linestring, {
                        style: { strokeColor: '#de0b05', lineWidth: 3 }
                    });

                    // optionally - resize a larger PNG image to a specific size
                    const startMarkerIcon = icon(marker1)
                    const endMarkerIcon = icon(marker2)

                    // Create a marker for the start point:
                    let startMarker = new H.map.Marker(section.departure.place.location, { icon: startMarkerIcon });

                    // Create a marker for the end point:
                    let endMarker = new H.map.Marker(section.arrival.place.location, { icon: endMarkerIcon });

                    // Add the route polyline and the two markers to the map:
                    hMap.addObjects([routeLine, startMarker, endMarker]);

                    // Set the map's viewport to make the whole route visible:
                    hMap.getViewModel().setLookAtData({ bounds: routeLine.getBoundingBox() });
                });
            }
        };
        const onResult2 = (result) => {
            // ensure that at least one route was found
            if (result.routes.length) {
                result.routes[0].sections.forEach((section) => {
                    // Create a linestring to use as a point source for the route line
                    let linestring = H.geo.LineString.fromFlexiblePolyline(section.polyline);

                    // Create an outline for the route polyline:
                    // var routeOutline = new H.map.Polyline(linestring, {
                    //     style: {
                    //         lineWidth: 10,
                    //         strokeColor: 'rgba(0, 128, 255, 0.7)',
                    //         lineTailCap: 'arrow-tail',
                    //         lineHeadCap: 'arrow-head'
                    //     }
                    // });
                    // // Create a patterned polyline:
                    // var routeArrows = new H.map.Polyline(linestring, {
                    //     style: {
                    //         lineWidth: 10,
                    //         fillColor: 'white',
                    //         strokeColor: 'rgba(255, 255, 255, 1)',
                    //         lineDash: [0, 2],
                    //         lineTailCap: 'arrow-tail',
                    //         lineHeadCap: 'arrow-head'
                    //     }
                    // });
                    // // create a group that represents the route line and contains
                    // // outline and the pattern
                    // var routeLine = new H.map.Group();
                    // routeLine.addObjects([routeOutline, routeArrows]);

                    // Create a polyline to display the route:
                    let routeLine = new H.map.Polyline(linestring, {
                        style: { strokeColor: '#01d3d2', lineWidth: 3 }
                    });

                    // optionally - resize a larger PNG image to a specific size
                    const startMarkerIcon = icon(marker2)
                    const endMarkerIcon = icon(marker3)

                    // Create a marker for the start point:
                    let startMarker = new H.map.Marker(section.departure.place.location, { icon: startMarkerIcon });

                    // Create a marker for the end point:
                    let endMarker = new H.map.Marker(section.arrival.place.location, { icon: endMarkerIcon });

                    // Add the route polyline and the two markers to the map:
                    hMap.addObjects([routeLine, startMarker, endMarker]);

                    // Set the map's viewport to make the whole route visible:
                    hMap.getViewModel().setLookAtData({ bounds: routeLine.getBoundingBox() });
                });
            }
        };
        const onResult3 = (result) => {
            // ensure that at least one route was found
            if (result.routes.length) {
                result.routes[0].sections.forEach((section) => {
                    // Create a linestring to use as a point source for the route line
                    let linestring = H.geo.LineString.fromFlexiblePolyline(section.polyline);
                    // Create an outline for the route polyline:
                    // var routeOutline = new H.map.Polyline(linestring, {
                    //     style: {
                    //         lineWidth: 10,
                    //         strokeColor: 'rgba(0, 128, 255, 0.7)',
                    //         lineTailCap: 'arrow-tail',
                    //         lineHeadCap: 'arrow-head'
                    //     }
                    // });
                    // // Create a patterned polyline:
                    // var routeArrows = new H.map.Polyline(linestring, {
                    //     style: {
                    //         lineWidth: 10,
                    //         fillColor: 'white',
                    //         strokeColor: 'rgba(255, 255, 255, 1)',
                    //         lineDash: [0, 2],
                    //         lineTailCap: 'arrow-tail',
                    //         lineHeadCap: 'arrow-head'
                    //     }
                    // });
                    // // create a group that represents the route line and contains
                    // // outline and the pattern
                    // var routeLine = new H.map.Group();
                    // routeLine.addObjects([routeOutline, routeArrows]);

                    // Create a polyline to display the route:
                    let routeLine = new H.map.Polyline(linestring, {
                        style: { strokeColor: '#3aba33', lineWidth: 3 }
                    });

                    // optionally - resize a larger PNG image to a specific size
                    const startMarkerIcon = icon(marker3)
                    const endMarkerIcon = icon(marker4)

                    // Create a marker for the start point:
                    let startMarker = new H.map.Marker(section.departure.place.location, { icon: startMarkerIcon });

                    // Create a marker for the end point:
                    let endMarker = new H.map.Marker(section.arrival.place.location, { icon: endMarkerIcon });

                    // Add the route polyline and the two markers to the map:
                    hMap.addObjects([routeLine, startMarker, endMarker]);

                    // Set the map's viewport to make the whole route visible:
                    hMap.getViewModel().setLookAtData({ bounds: routeLine.getBoundingBox() });
                });
            }
        };
        const onResult4 = (result) => {
            // ensure that at least one route was found
            if (result.routes.length) {
                result.routes[0].sections.forEach((section) => {
                    // Create a linestring to use as a point source for the route line
                    let linestring = H.geo.LineString.fromFlexiblePolyline(section.polyline);

                    // Create an outline for the route polyline:
                    // var routeOutline = new H.map.Polyline(linestring, {
                    //     style: {
                    //         lineWidth: 10,
                    //         strokeColor: 'rgba(0, 128, 255, 0.7)',
                    //         lineTailCap: 'arrow-tail',
                    //         lineHeadCap: 'arrow-head'
                    //     }
                    // });
                    // // Create a patterned polyline:
                    // var routeArrows = new H.map.Polyline(linestring, {
                    //     style: {
                    //         lineWidth: 10,
                    //         fillColor: 'white',
                    //         strokeColor: 'rgba(255, 255, 255, 1)',
                    //         lineDash: [0, 2],
                    //         lineTailCap: 'arrow-tail',
                    //         lineHeadCap: 'arrow-head'
                    //     }
                    // });
                    // // create a group that represents the route line and contains
                    // // outline and the pattern
                    // var routeLine = new H.map.Group();
                    // routeLine.addObjects([routeOutline, routeArrows]);

                    // Create a polyline to display the route:
                    let routeLine = new H.map.Polyline(linestring, {
                        style: { strokeColor: '#8a0d68', lineWidth: 3 }
                    });

                    // optionally - resize a larger PNG image to a specific size
                    const startMarkerIcon = icon(marker4)
                    const endMarkerIcon = icon(marker5)

                    // Create a marker for the start point:
                    let startMarker = new H.map.Marker(section.departure.place.location, { icon: startMarkerIcon });

                    // Create a marker for the end point:
                    let endMarker = new H.map.Marker(section.arrival.place.location, { icon: endMarkerIcon });

                    // Add the route polyline and the two markers to the map:
                    hMap.addObjects([routeLine, startMarker, endMarker]);

                    // Set the map's viewport to make the whole route visible:
                    hMap.getViewModel().setLookAtData({ bounds: routeLine.getBoundingBox() });
                });
            }
        };

        // Get an instance of the routing service version 8:
        const router = platform.getRoutingService(null, 8);

        // Call calculateRoute() with the routing parameters,
        // the callback and an error callback function (called if a
        // communication error occurs):
        const calculateRoute = (routingParameter, onResult) => {
            router.calculateRoute(routingParameter, onResult, (error) => {
                alert(error.message);
            });
        }
        //create routes
        calculateRoute(routingParameters0, onResult0)
        calculateRoute(routingParameters1, onResult1)
        calculateRoute(routingParameters2, onResult2)
        calculateRoute(routingParameters3, onResult3)
        calculateRoute(routingParameters4, onResult4)

        const behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(hMap));

        const ui = H.ui.UI.createDefault(hMap, defaultLayers);
        console.log(behavior, ui);
        // addMarkersToMap(H, hMap);

        // This will act as a cleanup to run once this hook runs again.
        // This includes when the component un-mounts
        return () => {
            hMap.dispose();
        };

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mapRef, coodirnate1, coodirnate2, coodirnate3, coodirnate4, coodirnate5]); // This will run this hook every time this ref is updated

    return <div className="map" ref={mapRef} style={{ width: "100%", height: "100vh" }} />;
};