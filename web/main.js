var tabs = new Array('xml','geoxml','kml','map');

function makeMenu() {
    for (var i = 0; i < tabs.length; i++) {
	$(tabs[i] + 'title').writeAttribute('href','#');
	$(tabs[i] + 'title').writeAttribute('onclick','switchto(\''+tabs[i]+'\');');
    }
    appendLog('Menu generated.');
}

function switchto(tab) {
    for (var i = 0; i < tabs.length; i++) {
    $(tabs[i] + 'title').removeClassName('active');
    $(tabs[i] + 'content').removeClassName('active');
    }
    $(tab + 'title').addClassName('active');
    $(tab + 'content').addClassName('active');
    appendLog('Switched to ' + tab + '.');
}

var map;
var gx;

function loadMap() {
    if (GBrowserIsCompatible()) {
	map = new GMap2(document.getElementById("map"));
	gx = new GGeoXml("http://koon.fr:8080/flights"+Math.random()+".kml");
	map.addOverlay(gx);
	map.enableGoogleBar();
	map.setCenter(new GLatLng(46.316, 3.1640), 5);
	map.addControl(new GLargeMapControl());
	map.addControl(new GMapTypeControl());
	$('loadb').addClassName('invisible');
	$('reloadb').removeClassName('invisible');
    }
}

function reloadOverlay() {
    map.clearOverlays();
    gx = new GGeoXml("http://koon.fr:8080/flights.kml?r="+Math.random());
    map.addOverlay(gx);
}

function appendLog(text) {
    var today = new Date();
    var dateString = today.toLocaleString();
    $('log').insert({'top': dateString + ": " + text + '\n'});
}

function reloadGeoXML() {
    new Ajax.Request('/geoflights.xml',
		     {
			 method: 'get',
			     onSuccess: function(transport)
			     {
				 $('geoxml').update(transport.responseText.escapeHTML());
				 appendLog('Reloaded GeoXML.');
			     },
			     onFailure: function(transport)
			     {
				 appendLog('Reloading GeoXML failed!');
			     }
		     }
		     );
}

function reloadKML() {
    new Ajax.Request('/flights.kml',
		     {
			 method: 'get',
			     onSuccess: function(transport)
			     {
				 $('kml').update(transport.responseText.escapeHTML());
				 appendLog('Reloaded KML.');
			     },
			     onFailure: function(transport)
			     {
				 appendLog('Reloading KML failed!');
			     }
		     }
		     );
}

function reloadXML() {
    new Ajax.Request('/flights.xml',
		     {
			 method: 'get',
			     onSuccess: function(transport)
			     {
				 $('flights').update(transport.responseText);
				 appendLog('Reloaded XML.');
			     },
			     onFailure: function(transport)
			     {
				 appendLog('Reloading XML failed!');
			     }
		     }
		     );
}

function reloadRO() {
    reloadGeoXML();
    reloadKML();
}

function updated() {
    ajax = $('xmlForm').request(
				{
				    method: 'post',
				    onSuccess: function(transport)
				    {
					appendLog('Updated from textarea.');
					reloadRO();
				    },
				    onFailure: function(transport)
				    {
					appendLog('Updating from textarea failed!');
				    }
				}
				);
}

function fileimport() {
    ajax = $('fileForm').request(
				{
				    method: 'post',
				    onSuccess: function(transport)
				    {
					appendLog('Updated from file.');
					reloadXML();
					reloadRO();
				    },
				    onFailure: function(transport)
				    {
					appendLog('Updating from file failed!');
				    }
				}
				);
}

function loaded() {
    makeMenu();
    switchto(tabs[0]);
    reloadXML();
    reloadRO();
    appendLog('Interface loaded!');
}