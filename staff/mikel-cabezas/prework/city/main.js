jQuery(document).ready(function() {
    jQuery('.gb-pocket').click(function(){
        jQuery('.main').removeClass('gb')
        jQuery('.main').addClass('gb-pocket')
        jQuery('.menu-container').removeClass('gb')
        jQuery('.menu-container').addClass('gb-pocket')
    });
    jQuery('.gb').click(function(){
        jQuery('.main').removeClass('gb-pocket')
        jQuery('.main').addClass('gb')
        jQuery('.menu-container').removeClass('gb-pocket')
        jQuery('.menu-container').addClass('gb')
    });
    jQuery('.gbc').click(function(){
        jQuery('.main').removeClass('gb-pocket')
        jQuery('.main').removeClass('gb')
        jQuery('.menu-container').removeClass('gb-pocket')
        jQuery('.menu-container').removeClass('gb')
    });
  });