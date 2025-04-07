import React from "react";
import L from "leaflet";

export const useMarkerZIndex = (
  props: {
    map: L.Map;
    markerRef: React.RefObject<any>;
    zIndex: number;
  },
  deps: any[],
) => {
  const { map, markerRef, zIndex } = props;

  const handleSetMarkerZIndex = () => {
    if (markerRef.current) {
      const markerWrapper = markerRef.current.parentElement;
      if (markerWrapper) {
        markerWrapper.style.zIndex = `${zIndex}`;
      }
    }
  };

  React.useEffect(() => {
    if (!map) return;

    map.on("zoomanim", handleSetMarkerZIndex);
    map.on("zoomstart", handleSetMarkerZIndex);
    map.on("zoomend", handleSetMarkerZIndex);
    map.on("zoomlevelschange", handleSetMarkerZIndex);

    return () => {
      map.off("zoomanim", handleSetMarkerZIndex);
      map.off("zoomstart", handleSetMarkerZIndex);
      map.off("zoomend", handleSetMarkerZIndex);
      map.off("zoomlevelschange", handleSetMarkerZIndex);
    };
  }, [markerRef, zIndex, map, ...deps]);
};
