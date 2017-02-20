$(function() {
    $('.photo-grid-photo').on('click', function() {
        $('.photo-grid-photo').removeClass('active');
        $(this).toggleClass('active');
    });
  
  $('.read-more').on('click', function() {
      var $bio = $(this).parent().clone();
      var $original = $(this).parent();
    
      $bio.css({
        left: $original.position().left + 'px',
        top: $original.position().top + 'px'/*,
        height: $original.outerHeight() + 'px'*/
      });
    
      $('.photo-grid-photo').toggleClass('active');
      $bio.appendTo('body').addClass('expanded-bio');
      var bioHeight = $bio.outerHeight();
      $bio.find('.hidden-bio').css('display', 'none');
      window.setTimeout(function() {
        $('.photo-grid-photo').removeClass('active');
        $bio.addClass('come-out');
        window.setTimeout(function(){
          //$bio.find('.hidden-bio').show();
          $bio.css('height', bioHeight + 'px');
        }, 500);
      }, 100);
      
  });
});