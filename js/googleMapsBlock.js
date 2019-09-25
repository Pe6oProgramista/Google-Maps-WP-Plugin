(function (blocks, element) {
    let el = element.createElement;

    let filters = [];
    for (let i = 0; i < filters_names.length; i++) {
        let key = filters_names[i];
        let filter = el('div', {},
            el('label', { class: 'filterLabel' }, key),
            el('div', { id: key + 'Div', class: 'filterDiv' },
                el('input', { id: key + 'Input', class: 'filterInput', name: key, type: 'text', value: '' }),
                el('div', { id: key + 'filtersEditor', class: 'filtersEditor' },
                    el('span'),
                    el('input', { list: key + "List", autocomplete: "off", type: 'text', id: key + 'filtersEditorInput', class: 'filtersEditorInput' })
                ),

                el('datalist', { id: key + 'List', class: 'filterList' })
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
                    el('div', {id: 'dot1', class: 'dotDiv'},
                        el('span', null, 'First dot: '),
                        el('label', { for: 'latDot1' }, 'lat'),
                        el('input', { id: 'latDot1', class: 'dotFilterInput', name: 'latDot1', type: 'number', min: "-90", max: "90" }),
                        el('label', { for: 'lngDot1' }, 'lng'),
                        el('input', { id: 'lngDot1', class: 'dotFilterInput', name: 'lngDot1', type: 'number', min: "-180", max: "180" }),
                    ),
                    el('div', {id: 'dot2', class: 'dotDiv'},
                        el('span', null, 'Second dot: '),
                        el('label', { for: 'latDot2' }, 'lat'),
                        el('input', { id: 'latDot2', class: 'dotFilterInput', name: 'latDot2', type: 'number', min: "-90", max: "90" }),
                        el('label', { for: 'lngDot2' }, 'lng'),
                        el('input', { id: 'lngDot2', class: 'dotFilterInput', name: 'lngDot2', type: 'number', min: "-180", max: "180" })
                    ),
                    el('button', {id: 'initAreaBtn'}, 'Init Area')
                ),
                el('div', null,
                    'Results count: ',
                    el('span', {id: 'resultsCnt'})
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
