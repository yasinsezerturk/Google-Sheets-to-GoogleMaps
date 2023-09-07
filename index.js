
    // Harita oluşturma işlevi
    function initializeMap() {
      var mapOptions = {
        center: { lat: 39.73079370644598, lng: -103.54500199983225 }, // Harita başlangıç noktası (örnek: New York koordinatları)
        zoom: 5 // Yakınlaştırma seviyesi
      };

      // Harita oluşturma 
      var map = new google.maps.Map(document.getElementById('map'), mapOptions);

      // Google Sheets verilerini almak için API çağrısı yapma
      var sheetURL = "https://docs.google.com/spreadsheets/d/1TBg8bHKRBLIOrzJ6y11u4ppJloQo6mW-hlICbHbH17g/gviz/tq?tqx=out:csv&sheet=original";

      // CSV verisini çekme
      Papa.parse(sheetURL, {
        download: true,
        complete: function (results) {
          var data = results.data;
          var headers = data[0];
          var propertyAddressIndex = headers.indexOf("PropertyAddress"); // PropertyAddress sütunu indeksi

          // Adresleri haritada işaretleme
          for (var i = 1; i < data.length; i++) {
            var address = data[i][propertyAddressIndex];

            // Adresi coğrafi koordinatlara dönüştürme
            var geocoder = new google.maps.Geocoder();
            geocoder.geocode({ 'address': address }, function (results, status) {
              if (status === 'OK') {
                var location = results[0].geometry.location;

                // Konumu haritada işaretleme
                var marker = new google.maps.Marker({
                  map: map,
                  position: location,
                  title: address
                });

                // Bilgi balonu içeriği
                var infowindow = new google.maps.InfoWindow();

                // Noktaya tıklanınca bilgi balonunu açma
                marker.addListener('click', function () {
                  // Önceki bilgi penceresini kapatma
                  infowindow.close();

                  // Yeni bilgi penceresinin içeriğini ayarla
                  infowindow.setContent('<div><strong>' + address + '</strong><br>Diğer bilgiler burada olabilir.</div>');

                  // Bilgi penceresini haritaya ekleme ve açma
                  infowindow.open(map, marker);
                });
                // Harita üzerinde mouse tekerleği ile zoom yapmayı etkinleştirin
                map.setOptions({ scrollwheel: true });


              } else {
                console.error('Adres dönüşümünde bir hata oluştu: ' + status);
              }
            });
          }
        }
      });
    }


    // Sayfa yüklendiğinde haritayı oluşturun
    google.maps.event.addDomListener(window, 'load', initializeMap);
 