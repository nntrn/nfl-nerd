function init() {
  return new Flexmonster({
    container: '#pivot-container',
    width: '100%',
    height: '800px',
    toolbar: true,
    componentFolder: 'https://cdn.flexmonster.com/',
    licenseKey: 'Z7DT-XGAD3I-182M4K-4C4Z4I-234J5H-3L6P31-353V68-5H5A05-2L2H',
    report: {
      dataSource: {
        data: getData(),
      },
      formats: [{
        name: '',
        thousandsSeparator: ',',
        textAlign: 'center'
      }
      ],
      reportFilters: [
        {
          uniqueName: 'participantsScorer',
          filter: {
            exclude: [
              'participantsscorer.[]'
            ]
          }
        },
        {
          uniqueName: 'typeAbbreviation',
          filter: {
            members: [
              'typeabbreviation.[td]'
            ]
          }
        }
      ],
      rows: [
        {
          uniqueName: 'team'
        },
        {
          uniqueName: 'participantsScorer',
          filter: {
            exclude: [
              'participantsscorer.[]'
            ]
          }
        },
        {
          uniqueName: 'date.Month'
        }
      ],
      columns: [
        {
          uniqueName: 'qtr'
        },
        {
          uniqueName: '[Measures]'
        }
      ],
      measures: [
        {
          uniqueName: 'count',
          formula: 'count("participantsScorer")',
          caption: 'count'
        },
        {
          uniqueName: 'min',
          formula: 'min("timeElapsed")',
          caption: 'min'
        }
      ],
      sorting: {
        column: {
          type: 'desc',
          tuple: [],
          measure: 'Revenue'
        }
      },
      conditions: [
        {
          formula: '#value = 0',
          measure: 'count',
          format: {
            backgroundColor: '#FFFFFF',
            color: '#FFFFFF',

          }
        }
      ],
      options: {
        grid: {
          type: 'classic',
          dragging: false,
          showFilter: true,
          showHeaders: false,
          showTotals: 'off',
          showGrandTotals: 'true',
          showExtraTotalLabels: true,
          showHierarchies: true,
          showHierarchyCaptions: true,
          showReportFiltersArea: true,
          type: 'compact',

          grandTotalsPosition: 'top',
          showExtraTotalLabels: true,

          // showHierarchyCaptions: true,

          dragging: true,
          showAutoCalculationBar: true,
          showEmptyValues: false
        },
        // configuratorButton: false,
        sorting: false,
        drillThrough: true,
        configuratorActive: false
      },
    },

  })

}
