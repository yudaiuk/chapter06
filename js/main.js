$(function() {
  $('#gallery').each(function() {
    var $container = $(this),
        $loadMoreButton = $('#load-more'),
        $filter = $('#gallery-filter'),
        addItemCount = 16,
        addedd = 0,
        allData = [],
        filteredData = [];

    $container.masonry({
      columnWidth: 230,
      gutter: 10,
      itemSelector: '.gallery-item'
    });

    $.getJSON('./data/content.json', initGallery);

    function initGallery(data) {
      allData = data;
      filteredData = allData;
      addItems();
      $loadMoreButton.on('click', addItems);
      $filter.on('change', 'input[type="radio"]', filterItems);
      $container.on('mouseenter mouseleave', '.gallery-item a', hoverDirection);
    }

    function addItems(filter) {
      var elements = [],
          slicedData = filteredData.slice(addedd, addedd + addItemCount);

      $.each(slicedData, function(i, item) {
        var itemHTML = 
          '<li class="gallery-item is-loading">' +
            '<a href="' + item.images.large + '">' +
              '<img src="' + item.images.thumb + '" alt="">' +
              '<span class="caption">' +
                '<span class="inner">' +
                  '<b class="title">' + item.title + '</b>' +
                    '<time class="date" datatime="' + item.date + '">' +
                      item.date.replace(/-0?/g, '/') +
                    '</time>' +
                  '</span>' +
                '</span>' +
              '</a>' +
            '</li>';
        elements.push($(itemHTML).get(0));
      });

      $container
        .append(elements)
        .imagesLoaded(function() {
          $(elements).removeClass('is-loading');
          $container.masonry('appended', elements);
          if(filter) {
            $container.masonry();
          }
        });

      $container.find('a').colorbox({
        maxWidth: '970px',
        maxHeight: '95%',
        title: function() {
          return $(this).find('.inner').html();
        }
      })

      addedd += slicedData.length;
      if(addedd < filteredData.length) {
        $loadMoreButton.show();
      } else {
        $loadMoreButton.hide();
      }
    }

    function hoverDirection (event) {
      var $overlay = $(this).find('.caption'),
          side = getMouseDirection(event),
          animateTo,
          positionIn = {
            top: '0%',
            left: '0%'
          },
          positionOut = (function () {
            switch (side) {
              case 0: return { top: '-100%', left: '0%' };
                      breake;
              case 1: return { top: '0%', left: '100%' };
                      breake;
              case 2: return { top: '100%', left: '0%' };
                      breake;
              default: return { top: '0%', left: '-100%' };
                       breake;
            }
          }) ();
      if (event.type === 'mouseenter') {
        animateTo = positionIn;
        $overlay.css(positionOut);
      } else {
        animateTo = positionOut;
      }
      $overlay.stop(true).animate(animateTo, 250, 'easeOutExpo');
    }

    function getMouseDirection (event) {
      var $el = $(event.currentTarget),
          offset = $el.offset(),
          w = $el.outerWidth(),
          h = $el.outerHeight(),
          x = (event.pageX - offset.left - w / 2) * ((w > h)? h / w: 1),
          y = (event.pageY - offset.top - h / 2) * ((h > w)? w / h: 1),
          direction = Math.round((((Math.atan2(y, x) * (180 / Math.PI)) + 180 ) / 90 ) + 3 ) % 4;
      return direction;
    }

    function filterItems() {
      var key = $(this).val(),
          masonryItems = $container.masonry('getItemElements');

      $container.masonry('remove', masonryItems);
      filteredData = [];
      addedd = 0;
      if(key === 'all') {
        filteredData = allData;
      } else {
        filteredData = $.grep(allData, function(item) {
          return item.category === key;
        });
      }
      addItems(true);
    }
  });
});

$(document).ready(function() {
  $('.filter-form input[type="radio"]').button({
    icons: {
      primary: 'icon-radio'
    }
  });
});