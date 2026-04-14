import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import iconUrl from "leaflet/dist/images/marker-icon.png";
import iconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png";
import shadowUrl from "leaflet/dist/images/marker-shadow.png";
import { astanaMapCenter, astanaPharmacies } from "../data/pharmacies";

const fixLeafletIcons = () => {
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({ iconUrl, iconRetinaUrl, shadowUrl });
};

const PharmaciesMap = () => {
  useEffect(() => {
    fixLeafletIcons();
  }, []);

  return (
    <div className="map-shell">
      <MapContainer className="map-canvas" center={astanaMapCenter} zoom={11} scrollWheelZoom>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {astanaPharmacies.map((p) => (
          <Marker key={p.id} position={[p.lat, p.lng]}>
            <Popup>
              <strong>{p.name}</strong>
              <br />
              {p.address}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default PharmaciesMap;
