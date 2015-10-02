var MuinaismuistotSettings = function() {
  var self = this;
  var eventListener = null;
  var selectedLayerIds = [];
  var selectedBackgroundMapLayerName = '';
  var searchParameters = {
      //RKY - Valtakunnallisesti merkittävät rakennetut kulttuuriympäristöt
      'RKY alueet': {
        layerId: 1
      },
      'RKY viivat': {
        layerId: 2
      },
      'RKY pisteet': {
        layerId: 3
      },
  
      //Maailmanperintökohteet
      'Maailmanperintö alueet': {
        layerId: 5
      },
      'Maailmanperintö pisteet': {
        layerId: 6
      },
  
      //Rakennusperintörekisteri
      'Rakennetut alueet': {
        layerId: 8
      },
      'Rakennukset': {
        layerId: 9
      },
  
      //Muinaisjäännösrekisteri
      'Muinaisjäännösalueet': {
        layerId: 11
      },
      'Muinaisj.alakohteet': {
        layerId: 12
      },
      'Muinaisjäännökset': {
        layerId: 13,
        ajoitus: []
      },
  };

  this.init = function() {
    selectedLayerIds = this.getDefaultSelectedMuinaismuistotLayerIds();
    selectedBackgroundMapLayerName = 'taustakartta';
  };

  this.setEventListener = function(listener) {
      eventListener = listener;
  };

  this.getDefaultSelectedMuinaismuistotLayerIds = function() {
    var layerMap = self.getMuinaismuistotLayerIdMap();
    return [layerMap['RKY'], layerMap['Maailmanperintökohteet'], layerMap['Rakennusperintörekisteri'], layerMap['Muinaisjäännösrekisteri']];
  };

  this.getSelectedMuinaismuistotLayerIds = function() {
    return selectedLayerIds;
  };

  this.setSelectedMuinaismuistotLayerIds = function(layerIds) {
    selectedLayerIds = layerIds;
    eventListener.visibleMuinaismuistotLayersChanged(layerIds);
  };

  this.getSelectedBackgroundMapLayerName = function() {
    return selectedBackgroundMapLayerName;
  };

  this.setSelectedBackgroundMapLayerName = function(layerName) {
    selectedBackgroundMapLayerName = layerName;
    eventListener.selectedMapBackgroundLayerChanged(layerName);
  };

  this.getSearchParameters = function() {
    return searchParameters;
  };

  this.setSearchParameters = function(searchParams) {
    searchParameters = searchParams;
    eventListener.searchParametersChanged(searchParams);
  };

  this.getMuinaismuistotLayerIdMap = function() {
    return {
      'RKY': 0,
          'RKY alueet': 1,
          'RKY viivat': 2,
          'RKY pisteet': 3,
      'Maailmanperintökohteet': 4,
          'Maailmanperintö alueet': 5,
          'Maailmanperintö pisteet': 6,
      'Rakennusperintörekisteri': 7,
          'Rakennetut alueet': 8,
          'Rakennukset': 9,
      'Muinaisjäännösrekisteri': 10,
          'Muinaisjäännösalueet': 11,
          'Muinaisj.alakohteet': 12,
          'Muinaisjäännökset': 13
    };
  };

  this.getSearchParamsLayerDefinitions = function() {
    var resultArray = [];
    addLayerDefinitionSearchParams(searchParameters['Muinaisjäännökset'], resultArray);
    return resultArray.join(';');
  };

  var addLayerDefinitionSearchParams = function(layerParams, resultArray) {
    var result = '';
    var layerHasSearchValues = false;
    var value;
    var layerId;

    for (var property in layerParams) {
      if (layerParams.hasOwnProperty(property)) {
        value = layerParams[property];

        if(property === 'layerId') {
          layerId = value ;
        }
        else if(Array.isArray(value) && value.length > 0) {
          layerHasSearchValues = true;
          result += property;
          result += ' IN (' + value.join(',') + ')';
        }
      }
    }

    if(layerHasSearchValues) {
      resultArray.push(layerId + ': ' + result);
    }
  };

};