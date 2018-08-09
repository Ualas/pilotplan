import getSearchMethods from './sidebarSearch';

const privateProps = new WeakMap();

const privateMethods = {
  init() {
    const {
      drawLayerGroups,
      drawLayers,
      drawFeatures, // draw features
      listenForText,
      setSearchReturnListener,
    } = privateMethods;

    // drawLayerCategories.call(this);
    drawLayerGroups.call(this);
    drawLayers.call(this);
    drawFeatures.call(this);
    listenForText.call(this);
    setSearchReturnListener.call(this);
  },
  setSearchReturnListener() {
    const props = privateProps.get(this);
    const {
      searchReturnContainer,
      textSearchReturnButton,
      searchInput,
    } = props;

    searchReturnContainer
      .on('click', () => {
        props.view = 'legend';
        searchInput.node().value = '';
        this.updateResults();
      });
    textSearchReturnButton
      .on('click', () => {
        props.view = 'legend';
        searchInput.node().value = '';
        this.updateResults();
      });
  },
  drawLayerGroups() {
    const props = privateProps.get(this);
    const {
      availableLayers,
      contentContainer,
    } = props;

    const groups = contentContainer
      .selectAll('.sidebar__layer-group-block')
      .data(availableLayers, d => d.group);

    const newGroups = groups
      .enter()
      .append('div')
      .attr('class', 'sidebar__layer-group-block');
    newGroups
      .append('div')
      .attr('class', 'sidebar__layer-group-title')
      .text(d => d.group);

    newGroups.append('div')
      .attr('class', 'sidebar__layer-block');

    groups.exit().remove();

    props.layerGroups = newGroups.merge(groups);
  },
  drawLayers() {
    const props = privateProps.get(this);
    const {
      contentContainer,
      layerGroups,
      language,
    } = props;

    layerGroups.each(function addLayers(d) {
      const layers = d3.select(this)
        .select('.sidebar__layer-block')
        .selectAll('.sidebar__layer-row')
        .data(d.layers, layer => layer.id);

      const layersNew = layers.enter()
        .append('div')
        .attr('class', 'sidebar__layer-row');

      layersNew.append('div')
        .attr('class', 'sidebar__layer-title-row')
        .html(layer => `
          <input type="checkbox" value="builtdomain" checked="checked">
          <span class="sidebar__layer-name">${layer[language]}</span>
          `);

      layersNew
        .append('div')
        .attr('class', 'sidebar__feature-block');

      layers.exit().remove();
    });
    props.layers = contentContainer.selectAll('.sidebar__layer-row');
  },
  drawFeatures() {
    const props = privateProps.get(this);
    const {
      layers,
      language,
      contentContainer,
      onLayerClick,
    } = props;

    layers.each(function addFeature(d) {
      const features = d3.select(this)
        .select('.sidebar__feature-block')
        .selectAll('.sidebar__feature-row')
        .data(d.features, feature => feature.id);

      features
        .enter()
        .append('div')
        .attr('class', 'sidebar__feature-row')
        .classed('sidebar__feature-row--inactive', feature => feature.id === undefined)
        .html(feature => `
          <i class="icon-binoculars"></i>
          <span class="sidebar__feature-name">${feature[language]}</span>
        `)
        .on('click', (feature) => {
          onLayerClick(feature.id);
        });

      features.exit().remove();
    });
    props.features = contentContainer.selectAll('.sidebar__feature-row');
  },
  // drawFeatures() {
  // const {
  //   layerGroups,
  //   onLayerClick,
  //   language,
  // } = privateProps.get(this);

  // layerGroups.each(function addRows(d) {
  //   // console.log(d);
  //   const layers = d3.select(this)
  //     .select('.sidebar__layers')
  //     .selectAll('.sidebar__layer-block')
  //     .data(d.features, dd => dd.en);

  //   layers
  //     .enter()
  //     .append('div')
  //     .attr('class', 'sidebar__layer-block')
  //     .classed('sidebar__layer-row--inactive', dd => dd.id === undefined)
  //     .text(dd => dd[language])
  //     .on('click', (dd) => {
  //       onLayerClick(dd.id);
  //     });

  //   layers.exit().remove();
  // });
  // },
  setView() {
    const {
      view,
      container,
    } = privateProps.get(this);
    // console.log('view', view);
    const classesForViews = new Map([
      ['legend', 'sidebar--legend'],
      ['textSearch', 'sidebar--text-search'],
      ['clickSearch', 'sidebar--click-search'],
    ]);
    classesForViews.forEach((val, key) => {
      container.classed(val, key === view);
    });
  },

};

Object.assign(
  privateMethods,
  getSearchMethods({ privateMethods, privateProps }),
);

class Sidebar {
  constructor(config) {
    const {
      init,
      // listenForText,
    } = privateMethods;

    privateProps.set(this, {
      container: d3.select('.sidebar'),
      contentContainer: d3.select('.sidebar__content'),
      resultsContainer: d3.select('.sidebar__results'),
      searchReturnContainer: d3.select('.sidebar__search-return'),
      textSearchReturnButton: d3.select('.sidebar__text-search-return-icon'),
      searchInput: d3.select('.sidebar__input'),
      view: null,
      previousView: null,
      results: null,
      availableLayers: null,
      currentLayers: null,
    });

    this.config(config);

    privateProps.get(this).previousView = config.view;

    init.call(this);


    this.updateCurrentLayers();
  }
  config(config) {
    Object.assign(privateProps.get(this), config);
    return this;
  }
  updateAvailableLayers() {
    // console.log('update available layers');
    const {
      drawLayerGroups,
      drawLayers,
      drawFeatures,
    } = privateMethods;
    drawLayerGroups.call(this);
    drawLayers.call(this);
    drawFeatures.call(this);
    this.updateCurrentLayers();
  }
  updateCurrentLayers() {
    const {
      contentContainer,
      currentLayers,
    } = privateProps.get(this);

    contentContainer
      .selectAll('.sidebar__feature-row')
      .classed('sidebar__feature-row--off', d => !currentLayers.includes(d.id));
  }
  updateResults() {
    const props = privateProps.get(this);
    const {
      view,
      previousView,
    } = props;
    const {
      setView,
      clearResults,
      drawTextSearchResults,
      drawClickSearchResults,
      drawResultRowContainer,
    } = privateMethods;

    // console.log('update?', checkNeedsUpdate.call(this));
    if (previousView === 'legend' && view === 'legend') return;

    setView.call(this);
    // use enter/exit instead of this
    clearResults.call(this);
    drawResultRowContainer.call(this);
    if (view === 'textSearch') {
      drawTextSearchResults.call(this);
    } else if (view === 'clickSearch' || view === 'areaSearch') {
      drawClickSearchResults.call(this);
    }
    props.previousView = view;
  }
}

export default Sidebar;
