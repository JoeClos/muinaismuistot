var MuinaismuistotDetailsPage = function() {
	var self = this;
	var muinaisjaannosFeatures = null;
	var eventListener;
	var muinaismuistotSettings;

	this.init = function(settings) {
		muinaismuistotSettings = settings;

		$('#hide-detailsPage-button').on('click', function() {
			eventListener.hideDetailsPage();
		});
	};

	this.setEventListener = function(listener) {
	    eventListener = listener;
	};

	this.setMuinaisjaannosFeatures = function(features) {
		muinaisjaannosFeatures = features;
		var layerMap = muinaismuistotSettings.getMuinaismuistotLayerIdMap();
		var sectionVisibilityMap = {
			'muinaisjaannos': false,
			'muinaisjaannosalue': false,
			'rky': false,
			'maailmanperinto': false,
			'rakennusperintorekisteriAlue': false,
			'rakennusperintorekisteriRakennus': false
		};

		features.forEach(function(feature) {
			switch (feature.layerId) {
				case layerMap['Muinaisjäännökset']:
				case layerMap['Muinaisj.alakohteet']:
					showMuinaisjaannos(feature);
					sectionVisibilityMap['muinaisjaannos'] = true;
					break;
				case layerMap['Muinaisjäännösalueet']:
					showMuinaisjaannosAlue(feature);
					sectionVisibilityMap['muinaisjaannosalue'] = true;
					break;
				case layerMap['RKY alueet']:
				case layerMap['RKY viivat']:
				case layerMap['RKY pisteet']:
					showRky(feature);
					sectionVisibilityMap['rky'] = true;
					break;
				case layerMap['Maailmanperintö alueet']:
				case layerMap['Maailmanperintö pisteet']:
					showMaailmanperintokohde(feature);
					sectionVisibilityMap['maailmanperinto'] = true;
					break;
				case layerMap['Rakennetut alueet']:
					showRakennusperintorekisteriAlue(feature);
					sectionVisibilityMap['rakennusperintorekisteriAlue'] = true;
					break;
				case layerMap['Rakennukset']:
					showRakennusperintorekisteriRakennus(feature);
					sectionVisibilityMap['rakennusperintorekisteriRakennus'] = true;
					break;
			}

			var lastVisibleSectionId = '';
			for (var sectionId in sectionVisibilityMap) {
				var sectionContainerId = sectionId + '-collapse-container';

				$('#' + sectionId + '-collapse').removeClass('in');

				if(sectionVisibilityMap[sectionId]) {
					$('#' + sectionContainerId).removeClass('hidden');
					lastVisibleSectionId = sectionId;
				}
				else {
					$('#' + sectionContainerId).addClass('hidden');
				}
			}

			$('#' + lastVisibleSectionId + '-collapse').addClass('in');
		});
	};

	var showMuinaisjaannos = function(feature) {
		$('#muinaisjaannos-Kohdenimi').html(trim(feature.attributes.Kohdenimi));
		$('#muinaisjaannos-Ajoitus').html(trim(feature.attributes.Ajoitus));
		$('#muinaisjaannos-Tyyppi').html(trim(feature.attributes.Tyyppi));
		$('#muinaisjaannos-Alatyyppi').html(trim(feature.attributes.Alatyyppi));
		$('#muinaisjaannos-Laji').html(trim(feature.attributes.Laji));
		$('#muinaisjaannos-muinaisjaannosarekisteri-link').attr('href', feature.attributes.URL);
	};

	var showMuinaisjaannosAlue = function(feature) {
		$('#muinaisjaannosalue-Kohdenimi').html(trim(feature.attributes.Kohdenimi));
		$('#muinaisjaannosalue-muinaisjaannosarekisteri-link').attr('href', generateKulttuuriymparistoURL(feature.attributes.Mjtunnus));
	};

	var showRky = function(feature) {
		$('#rky-Kohdenimi').html(trim(feature.attributes.KOHDENIMI));
		$('#rky-link').attr('href', generateRkyURL(feature.attributes.ID));
	};

	var showMaailmanperintokohde = function(feature) {
		$('#maailmanperinto-Kohdenimi').html(trim(feature.attributes.Nimi));
		$('#maailmanperinto-link').attr('href', feature.attributes.URL);
	};

	var showRakennusperintorekisteriAlue = function(feature) {
		$('#rakennusperintorekisteriAlue-Kohdenimi').html(trim(feature.attributes.Nimi));
		$('#rakennusperintorekisteriAlue-Kunta').html(trim(feature.attributes.Kunta));
		$('#rakennusperintorekisteriAlue-Kohdetyyppi').html(trim(feature.attributes.Kohdetyyppi));
		$('#rakennusperintorekisteriAlue-Kulttuurihist_tyyppi').html(trim(feature.attributes.Kulttuurihist_tyyppi));
		$('#rakennusperintorekisteriAlue-Suojelu').html(trim(feature.attributes.Suojelu));
		$('#rakennusperintorekisteriAlue-Ajoitus').html(trim(feature.attributes.Ajoitus));
		$('#rakennusperintorekisteriAlue-link').attr('href', generateRakennusperintorekisteriURL(feature.attributes.KOHDEID));
	};

	var showRakennusperintorekisteriRakennus = function(feature) {
		$('#rakennusperintorekisteriRakennus-Kohdenimi').html(trim(feature.attributes.Nimi));
		$('#rakennusperintorekisteriRakennus-Osoite').html(trim(feature.attributes.Osoite));
		$('#rakennusperintorekisteriRakennus-Suojelu').html(trim(feature.attributes.Suojelu));
	};

	var generateKulttuuriymparistoURL = function(muinaisjaannosTunnus) {
		return 'http://kulttuuriymparisto.nba.fi/netsovellus/rekisteriportaali/portti/default.aspx?sovellus=mjreki&taulu=T_KOHDE&tunnus=' + muinaisjaannosTunnus;
	};

	var generateRkyURL = function(id) {
		return 'http://www.rky.fi/read/asp/r_kohde_det.aspx?KOHDE_ID=' + id;
	};

	var generateRakennusperintorekisteriURL = function(id) {
		return 'http://kulttuuriymparisto.nba.fi/netsovellus/rekisteriportaali/rapea/read/asp/r_kohde_det.aspx?KOHDE_ID=' + id;
	};

	var trim = function(value) {
		if(value == null) { //Null and undefined
			return '';
		}

		value = value.trim();
		if(value.toLowerCase() === 'null') {
			return ''; //For  example RKY ajoitus field may sometimes be 'Null'
		}

		//Remove trailing commas
		while(value.substr(value.length-1, 1) === ',') {
	        value = value.substring(0, value.length-1).trim();
	    }
	    return value;
	};
};