$(function () {

    console.log('linked');
    let entity = "album";
    let limit = 5;
    let searchBox;
    // console.log(searchBox);

    //  let lyricsQuery = "https://itunes.apple.com/search?media=music&term=x%20infinity&entity=song&limit=1";

    $("#searchBtn").on('click', function () {
        event.preventDefault();

        console.log('clicked');

        let $SUBMIT = $('#searchBox').val();
        console.log($SUBMIT);

        let queryURL = `https://itunes.apple.com/search?term=${$SUBMIT}`;

        //function for the itunes ajax call. -> done by Jake
        const ajax_itunes = () => {
            $.ajax({
                url: `${queryURL}&entity=${entity}&limit=${limit}`, //template literal string for query url
                method: "GET",
                dataType: "jsonp",  //to fix CORS header value of null changed to json p and added header files
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'GET',
                    'Access-Control-Allow-Headers': 'Content-Type, X-Requested-With',
                }
            }).then(function (response) {

                var results = response.results;
                console.log(results);
                console.log(queryURL);

                $.each(results, function (index, value) {

                    //console.log(`I'm here`);
                    let $DIV = $('<div>');
                    let $P = $('<p>').attr('data-album-name', value.collectionName)
                        .attr('data-artist-name', value.artistName).addClass('album');
                    let $UL = $(`<ul class="songs">`);

                    $P.text(value.collectionName);

                    $($DIV).append($P).append($UL);
                    $('body').append($DIV);
                });
            })
        };
        ajax_itunes();
    });

    //listening event for submit button. 
    $(document).on('click', '.album', function () {

        let songEntity = "song";
        let limit = 5;
        let $SUBMIT = $(this).attr("data-album-name");
        let queryURL = `https://itunes.apple.com/search?term=${$SUBMIT}`;
        let $this = $(this);

        console.log($(this));
        $.ajax({
            url: `${queryURL}&entity=${songEntity}&limit=${limit}`,
            method: "GET",
            dataType: "jsonp",
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET',
                'Access-Control-Allow-Headers': 'Content-Type, X-Requested-With',
            }
        }).then(function (response) {
            var songResults = response.results;
            console.log(response);

            $.each(songResults, function (index, value) {
                // console.log('song' + songResults); 
                let $trackName = $(`<li class="song-${index}-${value.trackName}">
                            ${value.trackName}</li>`);

                //if ($this.data($trackName[index]) !== $this.data($trackName[index -1])){ //checking the data values 
                $this.append($trackName);

            });

        });
    });

});