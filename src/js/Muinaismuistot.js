import MuinaismuistotSettings from './MuinaismuistotSettings';
import MuinaismuistotURLHashHelper from './MuinaismuistotURLHashHelper';
import MuinaismuistotData from './MuinaismuistotData';
import MuinaismuistotMap from './map/MuinaismuistotMap';
import MuinaismuistotUI from './ui/MuinaismuistotUI';

export default function Muinaismuistot() {
  var map;
  var data;
  var settings;
  var urlHashHelper;
  var ui;

  var init = function() {
    settings = new MuinaismuistotSettings({
      selectedMapBackgroundLayerChanged: function(layerName) {
        map.setVisibleMaanmittauslaitosLayerName(layerName);
      },
      visibleMuinaismuistotLayersChanged: function(selectedLayerIds) {
        map.updateVisibleMuinaismuistotLayersFromSettings();
        ui.visibleMuinaismuistotLayersChanged(selectedLayerIds);
      },
      filterParametersChanged: function(params) {
        map.updateMuinaismuistotFilterParamsFromSettings();
      }
    });

    urlHashHelper = new MuinaismuistotURLHashHelper();
    data = new MuinaismuistotData(settings);

    map = new MuinaismuistotMap(settings, {
      muinaisjaannosFeaturesSelected : function(muinaisjaannosFeatures) {
        ui.muinaisjaannosFeaturesSelected(muinaisjaannosFeatures);
      },
      showLoadingAnimation: function() {
        ui.showLoadingAnimation();
      }
    });

    ui = new MuinaismuistotUI(data, settings, urlHashHelper, {
      searchMuinaismuistoja: function(searchText, callbackFn) {
        map.searchMuinaismuistoja(searchText, callbackFn);
      },
      zoomIn: function() {
        map.zoomIn();
      },
      zoomOut: function() {
        map.zoomOut();
      },
      centerToCurrentPositions: function() {
        map.centerToCurrentPositions();
      }
    });

    window.onhashchange = function(location) {
      setMapLocationFromURLHash();
    };

    determineStartLocation();
  };

  var determineStartLocation = function() {
    if(urlHashHelper.parseCoordinates()) {
      setMapLocationFromURLHash();
    }
    else {
      map.centerToCurrentPositions();
    }
  };

  var setMapLocationFromURLHash = function() {
    var coordinates = urlHashHelper.parseCoordinates();
    if(coordinates) {
      map.setMapLocation(coordinates);
      map.showSelectedLocationMarker(coordinates);
    }
  };

  init();
};
