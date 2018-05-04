const getProbes = (components) => {
  function rasterProbe(p) {
    const {
      dispatch,
      Filmstrip,
      init,
      Map,
      Slider,
    } = components;
    const { mobile } = init;
    const Dispatch = dispatch;
    Dispatch.call('removeall', this);

    $('#fixed-probe .content').empty();
    $('#fixed-probe').show().removeClass('map-feature');
    // $('.search-results').hide();
    const title = $('<p>')
      .attr('class', 'fixed-probe-title')
      .html(p.data.description)
      .appendTo('#fixed-probe .content');

    if (p.data.layer === 'viewsheds') {
      const photos = _.filter(Filmstrip.getRasters(), r => r.layer === 'viewsheds');
      if (photos.length) {
        title.prepend('<i class="icon-angle-left">').prepend('<i class="icon-angle-right">').addClass('stepper');
        const i = photos.indexOf(p.data);
        $('i.icon-angle-left', title).click(() => {
          if (i == 0) rasterProbe(photos[photos.length - 1].photo);
          else rasterProbe(photos[i - 1].photo);
        });
        $('i.icon-angle-right', title).click(() => {
          if (i == photos.length - 1) rasterProbe(photos[0].photo);
          else rasterProbe(photos[i + 1].photo);
        });
      }
    }
    const dimensions = mobile ? [160, 160] : [400, 300];
    const size = p.getScaled(dimensions);
    let slider;
    if (!mobile) {
      $('#fixed-probe .content').css('width', `${size[0]}px`);
    } else {
      $('#fixed-probe .content').css('width', 'auto');
    }

    const img = p.getImage(dimensions, true)
      .attr('class', 'fixed-image')
      .css('width', `${size[0]}px`)
      .css('height', `${size[1]}px`)
      .appendTo('#fixed-probe .content')
      .click(function click() {
        const { formatYear } = init;

        Dispatch.call('removeall', this);

        $('.lightbox').css('display', 'flex');
        $('.lightbox .content > div').remove();

        const div = $('<div>').appendTo('.lightbox .content');
        const w = window.innerWidth * 0.75;
        const h = window.innerHeight - 300;
        const sizeInner = p.getScaled([w, h], true);
        p.getImage([w, h])
          .attr('class', 'lightbox-image')
          .css('width', `${sizeInner[0]}px`)
          .css('height', `${sizeInner[1]}px`)
          .appendTo(div);
        $('<a>')
          .attr('class', 'image blue-button')
          .attr('href', 'https://www.sscommons.org/openlibrary/' + p.href + '&fs=true')
          .attr('target', 'blank')
          .html('View image on SharedShelf Commons')
          .appendTo(div);
        let text = '';
        if (p.data.creator) text += p.data.creator + '<br>';
        if (p.data.description) text += '<span class="image-title">' + p.data.description + '</span><br>';
        if (p.data.date) text += formatYear(p.data.date) + '<br>';
        if (p.data.credits) text += '<span class="image-credit">' + p.data.credits + '</span>';
  
        $('<p>')
          .html(text)
          .appendTo(div);
      });
    if (p.data.layer !== 'viewsheds' && mobile) {
      $('<div>').attr('class', 'blue-button slider-toggle').html('<i class="icon-sliders"></i>').appendTo('#fixed-probe .content')
        .click(() => {
          $('.slider, .button.red', '#fixed-probe .content').toggle();
          $('.blue-button.more').insertBefore('.slider');
          slider.val(p.data.overlay.opacity());
        });
    }
    if (p.data.layer !== 'viewsheds') {
      slider = Slider('#fixed-probe .content').val(p.data.overlay.opacity()).on('sliderchange', function sliderChange(e, d) { 
        Dispatch.call('setopacity', this, d);
      });
      $('<div>').attr('class', 'blue-button more').html('More...').appendTo('#fixed-probe .content')
        .click(() => {
          img.click();
        });
      $('<hr>').appendTo('#fixed-probe .content');
      $('<div>')
        .attr('class', 'button red')
        .html('Remove Overlay')
        .appendTo('#fixed-probe .content')
        .click(function click() {
          Dispatch.call('removeoverlay', this);
        });
      $('#fixed-probe').css('margin-right', '0');
    } else {
      Map.zoomToView(p.data);
      $('#fixed-probe')
        .css('margin-right', $('#overlay-info').is(':visible') ? '65px' : 0);
    }
  }

  function filmstripProbe(photo) {
    const offset = $(this).offset();
    $('#filmstrip-probe .content')
      .empty()
      .html('<p><strong>' + photo.data.description + '</strong></p><p>' + photo.data.date + '</p><p><em>Click to view on map</em></p>')
    $('#filmstrip-probe')
      .show()
      .css({
        top: offset.top - 10 - $('#filmstrip-probe').height() + 'px',
        left: offset.left + 65 - $('#filmstrip-probe').width()/2 + 'px'
      });
  }

  function mapProbe(event, content) {
    const probe = $('#map-probe').show();
    $('#map-probe .content').empty().html(content);
    let x = event.originalEvent.pageX;
    if (x > window.innerWidth / 2) x -= probe.outerWidth() + 10;
    else x += 10;
    let y = event.originalEvent.pageY;
    if (y > window.innerHeight / 2) y -= probe.outerHeight() + 10;
    else y += 10;
    probe.css({
      top: y + 'px',
      left: x + 'px'
    });
  }

  function detailsProbe(name, content) {
    console.log('details probe', name, content);
    $('#fixed-probe .content')
      .empty()
      .css('width', 'auto');

    $('#fixed-probe')
      .show()
      .css('margin-right', $('#overlay-info').is(':visible') ? '65px' : 0)
      .addClass('map-feature');

    $('.search-results').hide();

    $('<p>')
      .attr('class', 'fixed-probe-title')
      .html(name).appendTo('#fixed-probe .content');
  
    // does this mean if content !== undefined ??
    if (content) {
      $('#fixed-probe .content').append(content);
    }
  }

  function hideHintProbe() {
    $('.probe-hint-container').addClass('no-hint');
  }

  return {
    rasterProbe,
    filmstripProbe,
    mapProbe,
    detailsProbe,
    hideHintProbe,
  };
};

export default getProbes;
