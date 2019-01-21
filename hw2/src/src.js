var col_to_show = ['name', 'continent', 'gdp', 'life_expectancy', 'population', 'year'];
var sorting_flag = false;
var format_data = function(row){
	  return col_to_show
	  		.map(function(column) {
				var formatComma = d3.format(","),
				formatDecimal = d3.format(".1f"),
				formatSI = d3.format('.3s');
				if(column == "gdp"){
					return formatSI(row[column]);
				}
				if(column == "life_expectancy"){
					return formatDecimal(row[column]);
				}
				if(column == "population"){
					return formatComma(row[column]);
				}
	  			return row[column];
	  		})
	  	};

      d3.json("https://raw.githubusercontent.com/tatiasha/tatiasha.github.io/master/hw2/data/countries_2012.json", function(error, data){

        var table = d3.select("body").append("table"),
          thead = table.append("thead")
                       .attr("class", "thead");
          tbody = table.append("tbody");

        table.append("caption")
          .html("World Countries Ranking");

        thead.append("tr").selectAll("th")
          .data(col_to_show)
        .enter()
          .append("th")
          .text(function(d) { return d; })
          .on("click", function(header, i) {
            tbody.selectAll("tr").sort(function(a, b) {
              if (sorting_flag == false){
                return d3.descending(a[header], b[header]);
                sorting_flag = true;
              }else{
                return d3.ascending(a[header], b[header]);
                sorting_flag = false;
              }
            });
          });

        var rows = tbody.selectAll("tr.row")
          .data(data)
          .enter()
          .append("tr").attr("class", "row");

          var cells = rows.selectAll("td")
          	.data(format_data)
                .enter()
                .append("td")
                .text(function(d) { return d;});
        // var cells = rows.selectAll("td")
        //   .data(function(row) {
        //       return d3.range(Object.keys(row).length).map(function(column, i) {
        //           return row[Object.keys(row)[i]];
        //       });
        //   })
        //   .enter()
        //   .append("td")
        //   .text(function(d) { return d; })

      });
