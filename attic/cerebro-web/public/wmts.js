var PROJ='EPSG:4326'
var projection = ol.proj.get(PROJ);
var projectionExtent = projection.getExtent();
var size = ol.extent.getWidth(projectionExtent) / 256;
var resolutions = new Array(14);
var matrixIds = new Array(14);
for (var z = 0; z < 14; ++z) {
    // generate resolutions and matrixIds arrays for this WMTS
    resolutions[z] = size / Math.pow(2, z);
    matrixIds[z] = z;
}

var attribution = new ol.Attribution({
    html: 'Tiles &copy; <a href="http://services.arcgisonline.com/arcgis/rest/' +
            'services/Demographics/USA_Population_Density/MapServer/">ArcGIS</a>'
});

var map = new ol.Map({
    layers: [
        new ol.layer.Tile({
            source: new ol.source.OSM(),
            opacity: 0.7
        }),
        //http://mapy.geoportal.gov.pl/wss/service/WMTS/guest/wmts/TOPO?SERVICE=WMTS&REQUEST=GetCapabilities&VERSION=1.3.0
        new ol.layer.Tile({
            opacity: 0.7,
            extent: projectionExtent,
            source: new ol.source.WMTS({
                attributions: [attribution],
                url: 'http://mapy.geoportal.gov.pl/wss/service/WMTS/guest/wmts/TOPO',
                layer: '0',
                matrixSet: PROJ,
                format: 'image/jpg',
                projection: projection,
                tileGrid: new ol.tilegrid.WMTS({
                    origin: ol.extent.getTopLeft(projectionExtent),
                    resolutions: resolutions,
                    matrixIds: matrixIds
                }),
                style: 'default'
            })
        })
    ],
    target: 'map',
    controls: ol.control.defaults({
        attributionOptions: /** @type {olx.control.AttributionOptions} */ ({
            collapsible: false
        })
    }),
    view: new ol.View({
        center: [2350737, 6828588],
        zoom: 9
    })
});
