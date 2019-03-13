/** Class implementing the map view. */
class Map {
    /**
     * Creates a Map Object
     */
    constructor() {
        this.projection = d3.geoConicConformal().scale(150).translate([400, 350]);

    }

    /**
     * Function that clears the map
     */
    clearMap() {
        var color = d3.select('#map').selectAll('.countries');
        color.attr('class', 'countries')
        color.classed('host', false);
        color.classed('team', false);
        color.classed('countries', true);
        d3.selectAll('circle').remove();


    }

    /**
     * Update Map with info for a specific FIFA World Cup
     * @param wordcupData the data for one specific world cup
     */
    updateMap(worldcupData) {

        //Clear any previous selections;
        this.clearMap();
        var host = '#' + worldcupData.host_country_code;
        var teams = worldcupData.teams_iso;
        var winner = worldcupData.winner;
        
        var iso = worldcupData.TEAM_LIST.split(',');
        var name = worldcupData.TEAM_NAMES.split(',');
        var i = name.indexOf(winner);
        var win = '#' + iso[i];
        console.log(host, win);
        var color = d3.select('#map').select(host)
            .attr('class', 'countries host');
        for (i in iso){
            var col = d3.select(('#' + iso[i]))
                .classed('team', true);
        }

        var cx = (worldcupData.WIN_LON);
        var cy = (worldcupData.WIN_LAT);
        
        var point_win = d3.select('#map').selectAll('circle')
            .data([cx, cy]).enter().append("circle")
            .attr("r", '7px')
            .attr('class', 'gold')
            .attr("transform", function(d) {
                return "translate(" + proj([
                    cx,
                    cy
                ]) + ")";
            });
        cx = worldcupData.RUP_LON;
        cy = worldcupData.RUP_LAT;
        var point_rup = d3.select('#map').append("circle")
            .attr("r", '7px')
            .attr('class', 'silver')
            .attr("transform", function(d) {
                return "translate(" + proj([
                    cx,
                    cy
                ]) + ")";
            });
        
    }

    /**
     * Renders the actual map
     * @param the json data with the shape of all countries
     */
    drawMap(world) {
        console.log(world)
        window.proj = d3.geoConicConformal().scale(150).translate([400, 350]);
        var geoPath = d3.geoPath()
            .projection(proj);
        var g = d3.select('#map')
            .attr('width', 900)
            .attr('height', 600);
        g.selectAll('path')
            .data(topojson.feature(world, world.objects.countries).features)
            .enter()
            .append('path')
            .attr('class', 'countries')
            .attr('id', function(d){
                return d.id;})
            .attr('d', geoPath);
        console.log(topojson.feature(world, world.objects.countries).features)
        g.append('path')
            .attr('id', 'grid')
            .datum(d3.geoGraticule().stepMinor([10, 10]))
            .attr('class', 'graticule')
            .attr('d', geoPath);
    }


}
