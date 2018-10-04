import { eras } from './config';

const cleanData = (rawData) => {
  const [
    rawLayers,
    rawViewsheds,
    rawAerials,
    rawMaps,
    rawPlans,
    rawExtents,
    rawTranslations,
  ] = rawData;

  const layerGroups = [
    'Views',
    'Landscape',
    'Urbanism',
  ];

  const layers = layerGroups
    .map((group) => {
      const groupRecord = {
        group,
        layers: Object.keys(rawLayers)
          .filter(groupKey => rawLayers[groupKey].group === group)
          .map((groupKey) => {
            const layerRecord = Object.assign({}, rawLayers[groupKey]);
            layerRecord.sourceLayer = groupKey;
            layerRecord.features = Object.keys(layerRecord.features)
              .map((featureKey) => {
                const featureRecord = Object.assign({}, layerRecord.features[featureKey]);
                featureRecord.dataLayer = featureKey;

                return featureRecord;
              });
            return layerRecord;
          }),
      };
      return groupRecord;
    });

  const views = rawViewsheds.features.map((d) => {
    const record = Object.assign({}, d.properties);
    record.type = 'view';
    return record;
  });

  const processOverlay = data => data.map((d) => {
    const record = Object.assign({}, d);
    record.type = 'overlay';
    return record;
  });

  const translations = rawTranslations
    .reduce((accumulator, d) => {
      const { en, pr } = d;
      /* eslint-disable no-param-reassign */
      accumulator[`${d.id}`] = { en, pr };
      /* eslint-enable no-param-reassign */
      return accumulator;
    }, {});


  const erasWithTranslations = eras.map(d => Object.assign({}, d, translations[d.id]));

  const rasters = new Map();

  rasters.set('views', views);
  rasters.set('maps', processOverlay(rawMaps));
  rasters.set('plans', processOverlay(rawPlans));
  rasters.set('aerials', processOverlay(rawAerials));

  const data = {
    layers,
    viewshedsGeo: rawViewsheds,
    rasters,
    translations,
    eras: erasWithTranslations,
  };

  console.log('extents', rawExtents);

  return data;
};

export default cleanData;
