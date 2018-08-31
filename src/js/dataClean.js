const cleanData = (rawData) => {
  //
  const [
    rawLayers,
    rawViewsheds,
    rawAerials,
    rawMaps,
    rawPlans,
  ] = rawData;

  const layerGroups = [
    'Views',
    'Landscape',
    'Urbanism',
  ];

  //
  //
  //
  //
  //

  const layers = layerGroups
    .map((group) => {
      const groupRecord = {
        group,
        layers: Object.keys(rawLayers)
          .filter(groupKey => rawLayers[groupKey].group === group)
          .map((groupKey) => {
            const layerRecord = Object.assign({}, rawLayers[groupKey]);
            layerRecord.id = groupKey;
            layerRecord.features = Object.keys(layerRecord.features)
              .map((featureKey) => {
                const featureRecord = Object.assign({}, layerRecord.features[featureKey]);
                featureRecord.id = featureRecord.style;
                delete featureRecord.style;
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


  const rasters = new Map();

  rasters.set('views', views);
  rasters.set('maps', processOverlay(rawMaps));
  rasters.set('plans', processOverlay(rawPlans));
  rasters.set('aerials', processOverlay(rawAerials));

  const data = {
    layers,
    viewshedsGeo: rawViewsheds,
    rasters,
  };

  return data;
};

export default cleanData;
