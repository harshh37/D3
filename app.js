const DUMMY_DATA = [
    { id: 'd1', region: 'USA', value: 10 },
    { id: 'd2', region: 'India', value: 12 },
    { id: 'd3', region: 'China', value: 11 },
    { id: 'd4', region: 'Germany', value: 6 },
];

let uncheckedIds = [];

const MARGINS = {
    top: 20,
    bottom: 20,
};
const CHART_WIDTH = 600;
const CHART_HEIGHT = 400 - MARGINS.top - MARGINS.bottom;

// Scales for BarChart
const x = d3.scaleBand().rangeRound([0, CHART_WIDTH]).padding(0.1);
const y = d3.scaleLinear().range([CHART_HEIGHT, 0]);

const chartContainer = d3
    .select('svg')
    .attr('width', CHART_WIDTH)
    .attr('height', CHART_HEIGHT + MARGINS.top + MARGINS.bottom);

const chart = chartContainer.append('g');

x.domain(DUMMY_DATA.map((el) => el.region));
y.domain([0, d3.max(DUMMY_DATA, (d) => d.value) + 3]);

render(DUMMY_DATA);
chart
    .append('g')
    .call(d3.axisBottom(x).tickSizeOuter(0))
    .attr('transform', `translate(0, ${CHART_HEIGHT})`)
    .attr('color', 'red');

function render(newData) {
    chart
        .selectAll('.bar')
        .data(newData, data=> data.id)
        .enter()
        .append('rect')
        .classed('bar', true)
        .attr('width', x.bandwidth())
        .attr('height', (data) => CHART_HEIGHT - y(data.value))
        .attr('x', (dta) => x(dta.region))
        .attr('y', (data) => y(data.value));

        chart.selectAll('.bar')
        .data(newData, data=>data.id)
        .exit().remove();

    chart
        .selectAll('label')
        .data(newData, data=>data.id)
        .enter()
        .append('text')
        .text((dta) => dta.value)
        .attr('x', (dta) => x(dta.region) + x.bandwidth() / 2)
        .attr('y', (dta) => y(dta.value) - 20)
        .attr('text-anchor', 'middle')
        .classed('label', true);

        chart.selectAll('label')
        .data(newData, data=>data.id)
        .exit().remove();

}

// Other_Functionality
const listItems = d3.select('#data').select('ul').selectAll('li').data(DUMMY_DATA).enter().append('li');

listItems.append('span').text((dta) => dta.region);
listItems
    .append('input')
    .attr('type', 'checkbox')
    .attr('checked', true)
    .on('change', (data) => {
        // console.log(data);
        if (uncheckedIds.indexOf(data.id) == -1) {
            uncheckedIds.push(data.id);

        } else {
            uncheckedIds = uncheckedIds.filter((id) => id != data.id);
        }
        let newData =  DUMMY_DATA.filter(data => uncheckedIds.indexOf(data.id) == -1);
        render(newData);
    });
