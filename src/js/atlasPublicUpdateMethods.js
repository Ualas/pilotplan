import getBBox from '@turf/bbox';
import clickSearchMethods from './atlasClickSearchMethods';
import highlightMethods from './atlasHighlightMethods';
import generalMethods from './atlasMethods';

const getAtlasUpdateMethods = ({
  privateProps,
}) => {
  const updateMethods = {
    updateCurrentLayers() {
      const {
        mbMap,
        currentLayers,
      } = privateProps.get(this);
      const { layers } = mbMap.getStyle();

      layers.forEach((layer) => {
        const visible = mbMap.getLayoutProperty(layer.id, 'visibility') === 'visible';
        const currentLayer = currentLayers
          .find(d => d.id === layer['source-layer']);

        const toggled = currentLayer === undefined ? true : currentLayer.status;

        if (visible && !toggled) {
          mbMap.setLayoutProperty(layer.id, 'visibility', 'none');
        } else if (!visible && toggled) {
          mbMap.setLayoutProperty(layer.id, 'visibility', 'visible');
        }
      });
    },
    updateAreaSearch() {
      const {
        areaSearchActive,
        mbMap,
        mapContainer,
        clickSearch,
      } = privateProps.get(this);

      const {
        initClickSearchListener,
        disableClickSearchListener,
        toggleMapAreaSearchMode,
      } = clickSearchMethods;

      toggleMapAreaSearchMode({
        mapContainer,
        areaSearchActive,
      });

      if (areaSearchActive) {
        disableClickSearchListener({
          mbMap,
          clickSearch,
        });
        mbMap.dragPan.disable();
      } else {
        initClickSearchListener({
          mbMap,
          clickSearch,
        });
        mbMap.dragPan.enable();
      }
    },

    updateHighlightedFeature() {
      const {
        clearHighlightedFeature,
        drawHighlightedFeature,
      } = highlightMethods;

      const {
        mbMap,
        highlightedFeature,
        year,
      } = privateProps.get(this);

      clearHighlightedFeature(mbMap);
      drawHighlightedFeature({
        highlightedFeature,
        mbMap,
        year,
      });
    },
    updateOverlay() {
      const props = privateProps.get(this);
      const {
        currentOverlay,
        mbMap,
      } = props;


      if (mbMap.getSource('overlay') !== undefined) {
        mbMap.removeLayer('overlay-layer');
        mbMap.removeSource('overlay');
      }


      if (currentOverlay === null) return;

      const sourceUrl = `mapbox://axismaps.pilot${currentOverlay.SS_ID}`;

      mbMap.addSource(
        'overlay',
        {
          type: 'raster',
          url: sourceUrl,
        },
      );

      mbMap.addLayer({
        id: 'overlay-layer',
        type: 'raster',
        source: 'overlay',
      });

      const bounds = new mapboxgl.LngLatBounds([
        currentOverlay.bounds.slice(0, 2),
        currentOverlay.bounds.slice(2, 4),
      ]);
      mbMap.fitBounds(bounds);
    },
    updateView() {
      const props = privateProps.get(this);
      const {
        currentView,
        mbMap,
        viewshedsGeo,
      } = props;
      const {
        addConeToMap,
        removeCone,
      } = generalMethods;

      if (currentView === null) {
        removeCone({ mbMap });
      } else {
        const coneFeature = viewshedsGeo.features.find(d =>
          d.properties.SS_ID === currentView.SS_ID);
        addConeToMap({
          coneFeature,
          mbMap,
        });
        const bbox = getBBox(coneFeature);
        mbMap.fitBounds(bbox, { padding: 100 });
      }
    },
  };
  return updateMethods;
};

export default getAtlasUpdateMethods;