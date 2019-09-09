( function( blocks, element ) {
    var el = element.createElement;
 
    var blockStyle = {
		top: '10vh',
//		left: '20vw',
		border:'0px',
		width: '100vw',
		height: '50vh',
		position: 'none',
	};
 
    blocks.registerBlockType( 'custom-google-maps/google-maps', {
        title: 'Google Maps',
        icon: 'universal-access-alt',
        category: 'layout',
        edit: function() {
            return el(
                'div',
                { style: blockStyle,
		  id: 'map' }
            );
        },
        save: function() {
            return el(
                'div',
                { style: blockStyle,
		  id: 'map' }
            );
        },
    } );
}(
    window.wp.blocks,
    window.wp.element,
) );
