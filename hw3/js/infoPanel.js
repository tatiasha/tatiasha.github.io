/** Class implementing the infoPanel view. */
class InfoPanel {
    /**
     * Creates a infoPanel Object
     */
    constructor() {
    }

    /**
     * Update the info panel to show info about the currently selected world cup
     * @param oneWorldCup the currently selected world cup
     */
    updateInfo(oneWorldCup) {
        var data = oneWorldCup;
        console.log(oneWorldCup);
        var ib = d3.select('#details')
        ib.select('#edition')
            .text(data.EDITION);
        ib.select('#host') 
            .text(data.host)
        ib.select('#winner') 
            .text(data.winner)
        ib.select('#silver') 
            .text(data.runner_up)
        var team = ib.select('#teams')
        team.select('ul').remove();
        team.append('ul').selectAll('li')
            .data(data.teams_names)
            .enter()
                .append('li')
                .html(String);
    }

}