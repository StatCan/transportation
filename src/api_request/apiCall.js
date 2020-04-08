import passengerApiCall from "./air_passenger_api.js";
import majorApiCall from "./air_major_api.js";
const PassengerData = "passengers";
const MajorAirData = "major_airports";

export default function(selectedDateRange, selectedRegion, selectedDataset) {
  return new Promise((resolve, reject) => {
    if (selectedDataset === PassengerData) {
      passengerApiCall(selectedDateRange, selectedRegion).then(function(newData) {
        return newData;
      });
    } else {
      majorApiCall(selectedDateRange, selectedRegion).then(function(newData) {
        return newData;
      });
    }
  });
}
