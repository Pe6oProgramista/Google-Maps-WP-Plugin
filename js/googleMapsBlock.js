(function (blocks, element) {
    let el = element.createElement;

    let filters = [];
    for (let key of Object.keys(filters_values)) {
        let filter = el('div', {},
            el('label', { class: 'filterLabel' }, key),
            el('div', { id: key + 'Div', class: 'filterDiv' },
                el('input', { id: key + 'Input', class: 'filterInput', name: key, type: 'text', value: '' }),
                el('div', { id: key + 'filtersEditor', class: 'filtersEditor' },
                    el('span'),
                    el('input', { list: key + "List", autocomplete: "on", type: 'text', id: key + 'filtersEditorInput', class: 'filtersEditorInput' })
                ),


                el('datalist', { id: key + 'List', class: 'filterList' },
                    filters_values[key].map((v) => { return el('option', { value: v[key] }) })
                )
            )
        );
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
