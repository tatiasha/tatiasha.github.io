var filterTitles = ['Americas', 'Africa', 'Asia', 'Europe', 'Oceania'];
var continentFilter = [];
var timelineData = [1995, 2012];
var selectedDate = 1995;
var filtredData = [];
var isAgregated = false;
var sortField = "name";
var sortOrder = "asc";
var encodeField = "population";
var colors = {
    'Americas' : 'red',
    'Africa': 'orange',
    'Asia': 'yellow',
    'Europe': 'green',
    'Oceania': 'blue'
};

d3.json("https://raw.githubusercontent.com/tatiasha/tatiasha.github.io/master/hw2/data/countries_1995_2012.json", function(error, data) {
    flatJson = [];
    data.forEach( country => {
        country.years.forEach( year => {
            flatJson.push({
                continent: country.continent,
                gdp: year.gdp,
                life_expectancy: year.life_expectancy,
                name: country.name,
                population: year.population,
                year: year.year
            });
        });
    });
    data = flatJson;
  
    function fetchFiltredData() {
        filtredData = data.filter( item => item.year == selectedDate);
        if (continentFilter.length > 0 && continentFilter.length < 5) {
            tempData = [];
            filtredData.forEach(function(item) {
                if (continentFilter.includes(item.continent)) {
                    tempData.push(item);
                }
            });
            filtredData = tempData;
        }
        if (isAgregated) {
            tempData = d3.nest()
            .key(function(d) { return d.continent;})
            .rollup(function(leaves) {
                return {
                    name: leaves[0].continent,
                    continent: leaves[0].continent,
                    gdp: d3.sum(leaves.map(function(item) {
                        return item.gdp;
                    })),
                    life_expectancy: d3.mean(leaves.map(function(item) {
                        return item.life_expectancy;
                    })),
                    population: d3.sum(leaves.map(function(item) {
                        return item.population;
                    })),
                    year: leaves[0].year
                };
            }).entries(filtredData);
            filtredData = tempData.map(function(item) {
                return item.values;
            });
        }
        filtredData.sort( (a,b) => {
            let result = 0;
            if (typeof a[sortField] === "string") {
                result = a[sortField].localeCompare(b[sortField]);
            } else {
                result = a[sortField] - b[sortField];
            }
            if (sortOrder === 'asc') {
                return result;
            } else {
                return -result;
            }
        });
        d3.select('svg').remove();
        var margin = {top: 50, bottom: 10, left:0, right: 0};
        var width = 900 - margin.left - margin.right;
        var height = (25 * filtredData.length) - margin.top - margin.bottom + 100;
        var xScale = d3.scale.linear().range([0, width]);
        var yScale = d3.scale.ordinal().rangeRoundBands([0, height], .8, 0);
        var svg = d3.select("body").append("svg")
            .attr("width", width+margin.left+margin.right)
            .attr("height", height+margin.top+margin.bottom);
        var g = svg.append("g")
            .attr("transform", "translate("+margin.left+","+margin.top+")");
        var max = d3.max(filtredData, function(d) { return d[encodeField]; } );
        var min = 0;
        xScale.domain([min, max]);
        yScale.domain(filtredData.map(function(d) { return d.name; }));
        var groups = g.append("g")
            .selectAll("text")
            .data(filtredData)
            .enter()
            .append("g");
        var bars = groups
            .append("rect")
            .attr("width", function(d) { return xScale(d[encodeField]); })
            .attr("height", 10)
            .attr("style", function(d) { console.log(d.continent); return "fill:"+colors[d.continent]+";" })
            .attr("x", xScale(min)+200)
            .attr("y", function(d) { return yScale(d.name); });
        groups.append("text")
            .attr("x", xScale(min))
            .attr("y", function(d) { return yScale(d.name); })
            .attr("dy", ".5em")
            .text(function(d) { return d.name; });
    }
    var timeline = d3.select('body').append('div')
        .attr('class', 'controller-row').text('Time update:');
    timeline.append('span').text(timelineData[0]);
    timeline.append('input').attr('type', 'range')
        .attr('name', 'points')
        .attr('min', timelineData[0]).attr('max', timelineData[1])
        .attr('step', '1').attr('value', '0')
        .on('input', function() {
            selectedDate = this.value;
            fetchFiltredData();
        });
    timeline.append('span').text(timelineData[1]);
    var filterController = d3.select('body').append('div')
        .attr('class', 'controller-row')
        .text('Filter by:').selectAll('span')
        .data(filterTitles).enter().append("span");
    filterController.append('input').attr('type', 'checkbox')
        .attr('id', function(d) { return 'checkbox-' + d.toLowerCase(); })
        .attr('name', function(d) { return d; })
        .attr('value', function(d) { return d; })
        .on('change', function(value) {
            if (this. checked) {
                continentFilter.push(value);
            } else {
                var index = continentFilter.indexOf(value);
                if (index !== -1) {
                    continentFilter.splice(index, 1);
                }
            }
            fetchFiltredData();
        });
    filterController.append("label")
        .attr('for', function(d) { return 'checkbox-' + d.toLowerCase(); })
        .text(function(d) { return d; });
    var aggregation = d3.select('body').append('div')
        .attr('class', 'controller-row')
        .text('Aggregation:').selectAll('span')
        .data(['None', 'by Continent']).enter().append("span");
    aggregation.append('input').attr('type', 'radio')
        .attr('id', function(d) { return 'radio-' + d.toLowerCase(); })
        .attr('name', 'aggregation')
        .attr('value', function(d) { return d; })
        .property('checked', function(d, i) { return i == 0; })
        .on('click', function(value) {
            if (value === 'None') {
                isAgregated = false;
            } else {
                isAgregated = true;
            }
            fetchFiltredData();
        });
    aggregation.append("label")
        .attr('for', function(d) { return 'radio-' + d.toLowerCase(); })
        .text(function(d) { return d; });
    var sortBy = d3.select('body').append('div')
        .attr('class', 'controller-row')
        .text('Sort By:').selectAll('span')
        .data(['name', 'population','gdp']).enter().append("span");
    sortBy.append('input').attr('type', 'radio')
        .attr('id', function(d) { return 'radio-' + d.toLowerCase(); })
        .attr('name', 'sortby')
        .attr('value', function(d) { return d; })
        .property('checked', function(d, i) { return i == 0; })
        .on('change', function(value) {
            console.log(value);
            sortField = value;
            fetchFiltredData();
        });
    sortBy.append("label")
        .attr('for', function(d) { return 'radio-' + d.toLowerCase(); })
        .text(function(d) { return d; });
    var sortOrd = d3.select('body').append('div')
        .attr('class', 'controller-row')
        .text('Sort Order:').selectAll('span')
        .data(['asc', 'desc']).enter().append("span");
    sortOrd.append('input').attr('type', 'radio')
        .attr('id', function(d) { return 'radio-' + d.toLowerCase(); })
        .attr('name', 'sortord')
        .attr('value', function(d) { return d; })
        .property('checked', function(d, i) { return i == 0; })
        .on('change', function(value) {
            sortOrder = value;
            fetchFiltredData();
        });
    sortOrd.append("label")
        .attr('for', function(d) { return 'radio-' + d.toLowerCase(); })
        .text(function(d) { return d; });
    var encodeBy = d3.select('body').append('div')
        .attr('class', 'controller-row')
        .text('Encode By:').selectAll('span')
        .data(['population','gdp']).enter().append("span");
    encodeBy.append('input').attr('type', 'radio')
        .attr('id', function(d) { return 'radio-' + d.toLowerCase(); })
        .attr('name', 'encodeby')
        .attr('value', function(d) { return d; })
        .property('checked', function(d, i) { return i == 0; })
        .on('click', function(value) {
            encodeField = value;
            fetchFiltredData();
        });
    encodeBy.append("label")
        .attr('for', function(d) { return 'radio-' + d.toLowerCase(); })
        .text(function(d) { return d; });
    fetchFiltredData();
});