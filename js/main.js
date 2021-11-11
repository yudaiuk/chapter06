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

      addedd += slicedData.length;
      if(addedd < filteredData.length) {
        $loadMoreButton.show();
      } else {
        $loadMoreButton.hide();
      }
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