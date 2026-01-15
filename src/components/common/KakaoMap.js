// src/components/MainScreen/KakaoMap.js

import { WebView } from "react-native-webview";

const KakaoMap = ({ keyword, lat, lon, onSelectPlace }) => {
  const KAKAO_JS_KEY = "643d9b7846899d4a7132b8fb9d74aba3";

  const mapHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
      <style>
        body, html, #map { width: 100%; height: 100%; margin: 0; padding: 0; background-color: #f0f0f0; }
      </style>
      <script type="text/javascript" src="https://dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_JS_KEY}&libraries=services&autoload=false"></script>
    </head>
    <body>
      <div id="map"></div>
      <script>
        function sendLog(msg) {
          window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'log', message: msg }));
        }

        try {          
          kakao.maps.load(function() {            
            const container = document.getElementById('map');
            const options = {
              center: new kakao.maps.LatLng(${lat}, ${lon}),
              level: 5
            };
            const map = new kakao.maps.Map(container, options);
            const ps = new kakao.maps.services.Places(); 

            kakao.maps.event.addListener(map, 'click', function() {
              window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'map_click' }));
            });

            const searchOptions = {
              location: new kakao.maps.LatLng(${lat}, ${lon}),
              radius: 10000,
              sort: kakao.maps.services.SortBy.DISTANCE
            }

            ps.keywordSearch('${keyword}', (data, status) => {
              if (status === kakao.maps.services.Status.OK) {
                sendLog("Successfully found " + data.length + " places for keyword: ${keyword}");
                
                data.slice(0, 10).forEach((place, index) => {
                  const coords = new kakao.maps.LatLng(place.y, place.x);
                  const marker = new kakao.maps.Marker({
                    map: map,
                    position: coords
                  });

                  kakao.maps.event.addListener(marker, 'click', function() {
                    map.panTo(coords);
                    window.ReactNativeWebView.postMessage(JSON.stringify({
                      type: 'place_click',
                      place: place, address:
                      place.address_name
                    }));
                  });
                });

                if (data.length > 0) {
                  const firstPlace = data[0];
                  const firstCoords = new kakao.maps.LatLng(firstPlace.y, firstPlace.x);
                  
                  map.setCenter(firstCoords);

                  window.ReactNativeWebView.postMessage(JSON.stringify({
                    type: 'place_click',
                    place: firstPlace
                  }));
                }
              } else {
                sendLog("Search failed status: " + status);
              }
            }, searchOptions);
          });
        } catch (e) {
          sendLog("JS Error: " + e.message);
        }
      </script>
    </body>
    </html>
  `;

  return (
    <WebView
      originWhitelist={["*"]}
      source={{
        html: mapHtml,
        baseUrl: "https://yrut_q4-seojoonrp-8081.exp.direct/",
      }}
      style={{ flex: 1 }}
      javaScriptEnabled={true}
      domStorageEnabled={true}
      onMessage={(event) => {
        const data = JSON.parse(event.nativeEvent.data);

        if (data.type === "place_click" && onSelectPlace) {
          onSelectPlace(data.place);
        } else if (data.type === "map_click") {
          onSelectPlace(null);
        }

        if (data.type === "log") {
          console.log("[KakaoMap]", data.message);
        }
      }}
      onError={(e) => console.log("[WebView Error]", e.nativeEvent)}
    />
  );
};

export default KakaoMap;
