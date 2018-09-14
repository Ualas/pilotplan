const getUpdateView = ({
  components,
}) => {
  const updateView = function updateView() {
    const {
      view,
    } = this.props();
    const {
      views,
      sidebar,
      eras,
    } = components;


    views
      .config({ view })
      .updateView();


    eras
      .config({ view });


    if (!this.get('componentsInitialized')) return;

    const layersToClear = this.getLayersToClear([
      'currentOverlay',
      'currentRasterProbe',
      'currentView',
      'highlightedFeature',
      'allRasterOpen',
    ]);

    if (sidebar !== undefined && sidebar.getView() !== 'legend') {
      sidebar.clearSearch();
    }

    this.update({ transitionsDisabled: true });

    this.update(Object.assign({
      footerOpen: true,
      sidebarOpen: false,
    }, layersToClear));

    this.update({ transitionsDisabled: false });
  };
  return updateView;
};

export default getUpdateView;
