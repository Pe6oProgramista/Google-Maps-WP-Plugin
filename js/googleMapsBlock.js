(function (blocks, element) {
    let el = element.createElement;

    let filters = [];
    for (let col of db_markers.columns) {
        let filter = el('div', { id: col + 'Div', class: 'dropdown' },
            // el ( 'button', { type: 'button', onclick: `showDropdown("${col}Dropdown")`, class: 'dropbtn' }, col ),
            el('input', { list: col + 'List', id: col + 'Input', class: 'filterInput', name: col, type: 'text', placeholder: `Type ${col} filter` }),
            el('datalist', { id: col + 'List', class: 'filterList dropdown-content' },
                db_markers.markers.map((m) => { return el('option', { value: m[col] }) })
            )
        )
        filters.push(filter);
    }

    function elFunc() {
        return el('div', { id: 'myEl' },
            el('div', { id: 'filters' },
                el('div', null, 'Filter markers by: '),
                el('form', { id: 'filtersForm', method: 'POST' },
                    filters,
                    el('input', { type: 'submit', value: 'Filter' })
                )
            ),
            el('div', { id: 'map' }
            )
        );
    }

    blocks.registerBlockType('gm-plugin/google-maps', {
        title: 'Google Maps',
        icon: 'universal-access-alt',
        category: 'layout',
        edit: elFunc,
        save: elFunc,
    });
}(
    window.wp.blocks,
    window.wp.element,
));
