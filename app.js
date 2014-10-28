
var cache = {};


window.onload = function (){

	document.getElementById('search').addEventListener('keyup',getData,false);

    var content = document.createElement('div'),
        loading = document.createElement('div');

    content.setAttribute('id','content');
    document.body.appendChild( content );

    loading.setAttribute('id','loading');
    document.body.appendChild( loading );
    
}

var getData = function () {

    document.getElementById('content').style.display = "none";

    var baseUrl = "https://api.github.com/legacy/repos/search/";
	var query = document.getElementById('search').value;

	if( query.length > 3){

        if(baseUrl+query in cache){
            return callback(baseUrl+query);
        }

        $.ajax({
            type:"GET",
            url: baseUrl + query,
            dataType: "json",
            beforeSend: function () {
                document.getElementById('loading').style.display = "block";
            },
            complete: function () {
                document.getElementById('loading').style.display = "none";
            },
            success: function (data) {
                cache[baseUrl+query] = data;
                callback(baseUrl+query);
            },
            error: function (xhr, ajaxOptions, thrownError) {

                var errortext = eval("(" + xhr.responseText + ")");
                console.log(xhr.status + " " + errortext.message);
                console.log(thrownError);
            }
        });
    }
};
 
function callback(url){
    var result = document.getElementById('results');
    var text = "";

    for (var number = 0; number < cache[url].repositories.length; number++ ){
        text += "<li id='" + number + "-" + url + "'>" + cache[url].repositories[ number ].username +
                " / "+ cache[url].repositories[ number ].owner +"</li>";
    }

    result.innerHTML = '<ul id="repositories">' + text + '</ul>';

    $( '#repositories li' ).on( 'click', function (){
        var id = this.id;
        var array = id.split( '-' );

        click_show( array[0], array[1] );
    });

}

function click_show(number,repositories){
    var full_description = cache[repositories].repositories[number];

    document.getElementById('content').innerHTML="<h1>Repositories Descriptions</h1><h3>Language :</h3><p>" + full_description.language +
                                                 "</p><h3>Followers :</h3><p>" + full_description.followers + "</p><h3>Url : </h3>" +
                                                 "<p>" + full_description.url + "</p><h3>Description :</h3><p>" + full_description.description + "</p>";

    document.getElementById('content').style.display = "block";
}

