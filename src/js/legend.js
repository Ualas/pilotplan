let Legend = (function($, dispatch) {
  
  let Lg = {};

  let legend = $('#legend');

  let year = 2015;

  let tempLayers;

  Lg.hasViews = true;

  let layers;
  let plans;

  function init_events () {
    $('.legend-toggle').click(function () {
      legend.toggleClass('collapsed').addClass('subsequent');
    });
    $('.legend-contents').on('change', function (){
      // checkbox clicks
      dispatch.call('setlayers', this, Lg.layers());
    });
  }

  function updateYear (y) {
    if (y == year) return;
    year = y;
    $('.legend-contents').empty();
    $.getJSON(server + 'layers/' + year, function(layersJson) {
      //$.getJSON(server + 'plans/' + year, function(plansJson) {
        layers = layersJson;
        //plans = plansJson;
        _.each(layersJson, function (category, categoryName) {
          let cat = $('<div>').attr('class', 'legend-category').appendTo('.legend-contents');
          $('<div>').attr('class', 'category-title').html(categoryName.toUpperCase()).appendTo(cat);
          _.each(category, function (obj) { // there's an extra level here
            _.each(obj, function (group, groupName) {
              let gr = $('<div>').attr('class', 'legend-group').attr('data-group', groupName).appendTo(cat);
              let groupTitle = $('<div>').attr('class', 'group-title').appendTo(gr);
              $('<label>')
                .html(names[groupName.toLowerCase()] || groupName)
                .prepend('<input type="checkbox" value="' + groupName + '"checked>')
                .appendTo(groupTitle);
              _.each(group.features, function (feature) {
                let layer = $('<div>').attr('class', 'layer').appendTo(gr);
                addLayerExisting(feature, layer);
              });

              let swatch = add_swatch(group.style).appendTo(groupTitle);
            });
        });

        dispatch.call('setlayers', this, Lg.layers());
        dispatch.call('statechange', this);

        if (tempLayers) {
          Lg.layers(tempLayers);
          tempLayers = null;
          dispatch.call('setlayers', this, Lg.layers());
          dispatch.call('statechange', this);
        }
      });
    });
  }

  function getPlansForLayer (layer) {
    if (!plans) return;
    let planArray;
    plans.forEach(function (plan) {
      if (plan.features.indexOf(layer) !== -1) {
        if (!planArray) planArray = [];
        planArray.push(plan);
      }
    });
    return planArray;
  }

  function addLayerExisting (feature, container, notpresent) {
    let l = $('<div>')
      .attr('class', 'layer-existing')
      .attr('data-name', feature.name || feature)
      .data('name', feature.name || feature)
      .html(feature.name || feature)
      .appendTo(container);
    if (!notpresent) {
      l
        .prepend('<i class="icon-binoculars">')
        .click(layerClick);
      } else {
        l.addClass('not-present');
      }
  }

  function layerClick () {
    if (!$(this).hasClass('highlighted')) {
      highlightFeature($(this).data('name'));
      $(this).toggleClass('highlighted');
      if (mobile) legend.addClass('collapsed');
    } else {
      dispatch.call('removehighlight', this);
    }
  }

  function highlightFeature (feature) {
    dispatch.call('removehighlight', this);
    Dispatch.call('removeprobe', this);
    $.getJSON(server + 'feature/' + year + '/' + feature, function (json) {
      dispatch.call('highlightfeature', this, json);
    })
  }

  function add_swatch( style )
  {
    if (!style) return $('<div>');
    var swatch = $( document.createElement( 'div' ) ).addClass( "swatch" ).addClass(style.shape.slice(0, style.shape.indexOf('.')));
    if( style.shape.match( /svg$/ ) )
    {
      swatch.load( "img/legend/" + style.shape );
    }
    else
    {
      swatch.append(
        $( document.createElement( 'img' ) ).attr( "src", "img/legend/" + style.shape )
      );
    }

    if( style.fill || style.stroke ) swatch.css( style );

    return swatch;
  }

  Lg.addViews = function () {
    let cat = $('<div>').attr('class', 'legend-category').attr('data-category', 'views').prependTo('.legend-contents');
    $('<div>').attr('class', 'category-title').html('VIEWS').appendTo(cat);
    let gr = $('<div>').attr('class', 'legend-group').attr('data-group', 'views').appendTo(cat);
    let groupTitle = $('<div>').attr('class', 'group-title').appendTo(gr);
    let label = $('<label>')
      .html('Cones of vision')
      .appendTo(groupTitle);
    $('<input type="checkbox" value="views">')
      .attr('checked', Lg.hasViews ? 'checked' : null)
      .on('change', function () {
        if ($(this).is(':checked')) dispatch.call('showviews', this);
        else dispatch.call('hideviews', this);
        Lg.hasViews = $(this).is(':checked');
        dispatch.call('statechange', this);
      })
      .prependTo(label);
    add_swatch({shape:'viewshed.png'}).appendTo(groupTitle);
  }

  Lg.layers = function (list) {
    if (!list) {
      let layers = [];
      $('.legend-contents input').each(function () {
        if (!$(this).is(':checked') && $(this).attr('value') != 'views') {
          layers.push($(this).attr('value'));
        }
      });
      if (!layers.length) layers = ['all'];
      return layers;
    }

    if (!$('.legend-contents input').length) {
      // loaded in from URL before checkboxes exist
      tempLayers = list;
      return Lg;
    }

    if (list[0] == 'all') {
      $('.legend-contents input').attr('checked', 'checked');
      if (!Lg.hasViews) $('input[value="views"]').attr('checked', null);
    } else {
      list.forEach(function (l) {
        $('.legend-group[data-group="' + l + '"] input').attr('checked', null);
      });
    }
    return Lg;
    
  }

  Lg.initialize = function () {
    init_events();

    return Lg;
  }

  Lg.setYear = function (newYear) {
    updateYear(newYear);

    return Lg;
  }

  return Lg;
})(jQuery, Dispatch);