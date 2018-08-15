const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const stringify = require('csv-stringify');

const config = {};
const csv = [];
let loaded = 0;
let total = 0;

fs.readdir(path.join(__dirname, '../data/geojson/geography'), (err, files) => {
  total = files.length;
  files.forEach(writeStatic);
});

function writeStatic(f) {
  fs.readFile(path.join(__dirname, '../data/geojson/geography', f), (err2, data) => {
    const name = f.replace(/\.json$/, '');
    const json = JSON.parse(data);
    const props = getProps(json);

    const layer = {};
    layer.features = {};
    layer.group = name === 'WatersLine' || name === 'WaterBodiesPoly' || name === 'OpenSpacesPoly' ? 'Landscape' : 'Urbanism';
    layer.icon = json.features[0].geometry.type === 'LineString' ? 'line.svg' : 'poly.svg';

    // Fake translation for now
    layer.en = name;
    layer.pr = name;

    props.forEach((p) => {
      layer.startYear = layer.startYear ? Math.min(layer.startYear, p.FirstYear) : p.FirstYear;
      layer.endYear = layer.endYear ? Math.max(layer.endYear, p.LastYear) : p.LastYear;

      if (p.SubType) {
        const sub = p.SubType;
        if (!layer.features[sub]) layer.features[sub] = {};

        // Fake translation for now
        layer.features[sub].en = sub;
        layer.features[sub].pr = sub;

        layer.features[sub].startYear = layer.features[sub].startYear ?
          Math.min(layer.features[sub].startYear, p.FirstYear) : p.FirstYear;
        layer.features[sub].endYear = layer.features[sub].endYear ?
          Math.max(layer.features[sub].startYear, p.LastYear) : p.LastYear;
      }
    });

    parseCSV(json);
    config[name] = layer;
    loaded += 1;
    if (loaded === total) {
      getStyleInfo();
      writeCSV();
    }
  });
}

function parseCSV(json) {
  json.features.forEach((f) => {
    if (f.properties.Name && f.geometry) {
      const row = _.extend(getBounds(f.geometry.coordinates), _.pick(f.properties, ['Name', 'FirstYear', 'LastYear', 'SubType']));
      csv.push(row);
    }
  });
}

function writeCSV() {
  stringify(csv, (err, output) => {
    fs.writeFile(path.join(__dirname, '../src/data/features.csv'), output, () => {
      console.log('FEATURES WRITTEN');
    });
  });
}

function getBounds(coordinates) {
  const coords = [];
  const raw = _.flatten(coordinates);
  for (let i = 0; i < raw.length; i += 2) {
    coords.push([raw[i], raw[i + 1]]);
  }
  return {
    xmin: parseFloat(_.reduce(coords, (m, c) => Math.min(m, c[0]), Infinity).toFixed(4)),
    xmax: parseFloat(_.reduce(coords, (m, c) => Math.max(m, c[0]), -Infinity).toFixed(4)),
    ymin: parseFloat(_.reduce(coords, (m, c) => Math.min(m, c[1]), Infinity).toFixed(4)),
    ymax: parseFloat(_.reduce(coords, (m, c) => Math.max(m, c[1]), -Infinity).toFixed(4)),
  };
}

function getProps(json) {
  return json.features.map(f => f.properties);
}

function getStyleInfo() {
  fs.readFile(path.join(__dirname, '../src/data/style.json'), (err, data) => {
    const json = JSON.parse(data);
    _.each(config, (layer, name) => {
      let unmatch = true;
      const styles = _.filter(json.layers, l => l['source-layer'] === name);
      _.each(layer.features, (f, fname) => {
        const id = _.find(styles, (s) => {
          const filter = _.flatten(s.filter);
          return _.some(filter, f1 => f1 === fname);
        });
        if (id) {
          f.style = id.id;
          unmatch = false;
        }
      });
      if (unmatch && styles.length === 1) {
        layer.style = styles[0].id;
      }
    });
    fs.writeFile(path.join(__dirname, '../src/data/config.json'), JSON.stringify(config, null, 2), () => {
      console.log('FILE WRITTEN');
    });
  });
}