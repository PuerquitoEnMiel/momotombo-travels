"use client";

import { APIProvider, Map, AdvancedMarker, Pin } from "@vis.gl/react-google-maps";

interface MapComponentProps {
    center: { lat: number; lng: number };
    zoom?: number;
    markers?: Array<{
        lat: number;
        lng: number;
        title: string;
    }>;
}

export function MapComponent({ center, zoom = 10, markers = [] }: MapComponentProps) {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

    if (!apiKey) {
        return (
            <div className="w-full h-64 bg-gray-200 dark:bg-gray-800 rounded-xl flex items-center justify-center text-gray-500">
                <p>Google Maps API Key not configured</p>
            </div>
        );
    }

    return (
        <APIProvider apiKey={apiKey}>
            <div className="w-full h-96 rounded-xl overflow-hidden shadow-lg border border-white/20">
                <Map
                    defaultCenter={center}
                    defaultZoom={zoom}
                    mapId="momotombo-map"
                    className="w-full h-full"
                >
                    {markers.map((marker, index) => (
                        <AdvancedMarker key={index} position={{ lat: marker.lat, lng: marker.lng }}>
                            <Pin background={"#006d77"} borderColor={"#1a1a1a"} glyphColor={"#ffffff"} />
                        </AdvancedMarker>
                    ))}
                </Map>
            </div>
        </APIProvider>
    );
}
