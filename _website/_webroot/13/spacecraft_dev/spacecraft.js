
//on document ready
$(document).ready(function() {
    proportionalWidthOnPhotoBlock();
    init();
    openSpacecraftDetails()
});

function init() {
    //flags set in this function are acted upon in the applicationreadypoller
    var webFontConfig = {
        google: {
            families: ['Michroma',
                'Oswald:300,400,700',
                'Roboto Mono:200,400,500,700',
                'Roboto Slab:300']
        },
        active: function() {
            gFontsLoaded = true;
        }
    };
    WebFont.load(webFontConfig);
    $('#LRO-overlay').hide(); //hide LRO overlay by default
}

function proportionalWidthOnPhotoBlock() {
    var appBlockWidth = $('body').width() - ($('.video-block').width() + $('.thirtytrack-block').width()) - 1;
    //trace("trying to set photo block width: " + appBlockWidth);
    $('.app-with-tabs-block').width(appBlockWidth);
}

function openSpacecraftDetails() {
    var spacecraftContainer = $('#spacecraftDiv');
    spacecraftContainer.html('');
    var html = $('#spacecraftDescription').html();

    spacecraftContainer.html(html);

    var spacecraftOverlaySelector = $('#spacecraft-overlay');
    spacecraftOverlaySelector.fadeIn();
}

function closeSpacecraftDetails() {
    var spacecraftOverlaySelector = $('#spacecraft-overlay');
    spacecraftOverlaySelector.fadeOut();
}