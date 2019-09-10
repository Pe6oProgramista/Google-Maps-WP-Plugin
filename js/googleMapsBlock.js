( function( blocks, element ) {
    let el = element.createElement;
    
    let filters = [];
    for (let col of db_markers.columns) {
        let filter = el ('div', {id: col + 'Div', class: 'dropdown'},
                el ( 'button', { type: 'button', onclick: `myFunction("${col}Dropdown")`, class: 'dropbtn' }, col ),
                el ( 'div', { id:  col + 'Dropdown', class: 'dropdown-content' },
                    el ('select', { name: col, multiple: true },
                        db_markers.markers.map( (m) => { return el ('option', { value: m[col] }, m[col]) } )
                    )
                )
            )
        filters.push(filter);
    }

    function elFunc() {
        return el( 'div', {id: 'myEl'},
            el( 'div', { id: 'filters' },
                el ('div', null, 'Filter markers by: '),
                el ( 'form', { id: 'filtersForm', action: '', method: 'POST', onsubmit: 'return makeChanges("filtersForm")' },
                    filters,
                    el ( 'input', { type: 'submit', value: "Filter"} )
                )
            ),
            el( 'div', { id: 'map' }
            )
        );
    }

    blocks.registerBlockType( 'gm-plugin/google-maps', {
        title: 'Google Maps',
        icon: 'universal-access-alt',
        category: 'layout',
        edit: elFunc,
        save: elFunc,
    } );
}(
    window.wp.blocks,
    window.wp.element,
) );
