var citations = new Array();
var authors_dict = {};
var selection_list = document.getElementById("authors_list");
var blockq = document.getElementById ("quotes");

var getJSON = function(url, callback) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', url, true);
  xhr.responseType = 'json';
  xhr.onload = function() {
    var status = xhr.status;
    if (status === 200) {
      callback(null, xhr.response);
    } else {
      callback(status, xhr.response);
    }
  };
  xhr.send();
};

getJSON("https://raw.githubusercontent.com/mdn/learning-area/master/accessibility/aria/quotes.json",
function(err, data) {
if (err !== null) {
alert('Something went wrong:');
} else {
for(var i = 0; i < data.length; i++){
  citations.push(data[i].quote  + " - " + data[i].author);
  if (authors_dict[data[i].author]){
    var tmp = authors_dict[data[i].author];
    tmp.push(data[i].quote);
    authors_dict[data[i].author] = tmp;
  }
  else{
    authors_dict[data[i].author] = [data[i].quote];
    var opt = data[i].author;
    var el = document.createElement("option");
    el.textContent = opt;
    el.value = opt;
    selection_list.appendChild(el);
  }
}
}
});

function change_quotes_of_day() {
    counter_ = Math.random() * (citations.length);
    var counter = parseInt(counter_, 10);
    newText = citations[counter];
    blockq.innerText = newText;
}

function change_author() {
  var author = selection_list.value;
  var idx_ = Math.random() * (authors_dict[author].length);
  var idx = parseInt(idx_, 10);
  blockq.innerText = authors_dict[author][idx] + " - " + author;
}
