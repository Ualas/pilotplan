import rasterMethods from './rasterMethods';

const localMethods = {
  updateImageFromMetadata({
    metadata,
    rasterProbeImageContainer,
  }) {
    const {
      getWidthLimitedDim,
      setBackgroundFromMetadata,
    } = rasterMethods;

    const maxWidth = rasterProbeImageContainer
      .node()
      .getBoundingClientRect()
      .width;

    const {
      width,
      height,
    } = metadata;

    const scaledDim = getWidthLimitedDim({
      width,
      height,
      maxWidth,
    });

    setBackgroundFromMetadata({
      selection: rasterProbeImageContainer,
      maxWidth,
      metadata,
    });

    rasterProbeImageContainer
      .styles({
        width: `${scaledDim.width}px`,
        height: `${scaledDim.height}px`,
      });
  },
  clearImage({
    rasterProbeImageContainer,
  }) {
    rasterProbeImageContainer
      .style('background-image', 'none');
  },
  setImageClickListener({
    rasterProbeImageContainer,
    onImageClick,
  }) {
    rasterProbeImageContainer
      .on('click', onImageClick);
  },
  toggleOverlayControls({
    rasterProbeControlsContainer,
    currentRasterProbe,
  }) {
    if (currentRasterProbe === null) return;

    rasterProbeControlsContainer
      .classed('raster-probe__overlay-controls--hidden', currentRasterProbe.type === 'view');
  },
  setOverlayCloseButtonListener({
    onOverlayCloseClick,
    rasterProbeCloseOverlayButton,
  }) {
    rasterProbeCloseOverlayButton
      .on('click', onOverlayCloseClick);
  },
};

const rasterProbeMethods = {
  updateTitle({
    rasterProbeTitleContainer,
    currentRasterProbe,
  }) {
    rasterProbeTitleContainer
      .text(currentRasterProbe.Title);
  },
  updateImage({
    currentRasterProbe,
    cachedMetadata,
    rasterProbeImageContainer,
    onImageClick,
  }) {
    const {
      updateImageFromMetadata,
      clearImage,
      setImageClickListener,
    } = localMethods;

    const {
      getMetadata,
    } = rasterMethods;

    clearImage({ rasterProbeImageContainer });
    setImageClickListener({
      rasterProbeImageContainer,
      onImageClick,
    });

    if (cachedMetadata.has(currentRasterProbe.SS_ID)) {
      const metadata = cachedMetadata.get(currentRasterProbe.SS_ID);
      updateImageFromMetadata({
        metadata,
        rasterProbeImageContainer,
      });
    } else {
      getMetadata(currentRasterProbe, (metadata) => {
        updateImageFromMetadata({
          metadata,
          rasterProbeImageContainer,
        });
      });
    }
  },
  setCloseButtonListener({
    rasterProbeCloseButton,
    onCloseClick,
  }) {
    rasterProbeCloseButton
      .on('click', onCloseClick);
  },
  updateOverlayControls({
    rasterProbeCloseOverlayButton,
    onOverlayCloseClick,
    rasterProbeControlsContainer,
    currentRasterProbe,
  }) {
    const {
      toggleOverlayControls,
      setOverlayCloseButtonListener,
    } = localMethods;

    toggleOverlayControls({
      rasterProbeControlsContainer,
      currentRasterProbe,
    });

    setOverlayCloseButtonListener({
      onOverlayCloseClick,
      rasterProbeCloseOverlayButton,
    });
  },
};

export default rasterProbeMethods;
