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
                dataType: "json"
            }).then(function (response) {

                var results = response.results;
                console.log(results.album);
                console.log(queryURL);

                for (let j = 0; j < results.length; j++) { //appending elements to div if limit > 1;

                    console.log('I\'m here');
                    let $DIV = $('<div>');
                    let $P = $('<p>').attr('data-album-name', results[j].collectionsCensoredName)
                        .addClass('album').attr('data-artist-name', results[j].artistName);

                    $P.text(results[j].collectionCensoredName);

                    $($DIV).append($P);
                    $('body').append($DIV);

                    ///////////////////////

                    let songEntity = "song";
                    limit = 5;
                    //listening event for submit button. 
                    $(document.body).on('click', '.album', function () {
                        console.log(this);
                        $.ajax({
                            url: `${queryURL}&entity=${songEntity}&limit=${limit}`,
                            method: "GET",
                            dataType: "json",
                        }).then(function (response) {
                            var songResults = response.results;
                            //console.log(response); 
                            for (let i = 0; i < songResults.length; i++) {
                                console.log(songResults);

                                let getSongs = $(this).attr("$P", "data-album-name");
                                console.log('SONG' + getSongs);

                                var $OL = $('<ol>').attr('data-album-song', songResults[i].trackName)
                                    .addClass('songs').attr('data-song-name', songResults[i].artistName);
                                $OL.text(songResults[i].trackName);
                                

                            }
                            console.log('made it');
                            $($P).append($OL);
                        });
                    })



                }
            })
        }
        ajax_itunes();
        /* let songEntity = "song";
         limit = 50;
         //listening event for submit button. 
         $('body').on('click', '.album', function () {
             //  console.log(this);
             $.ajax({
                 url: `${queryURL}&entity=${songEntity}&limit=${limit}`,
                 method: "GET",
                 dataType: "json",
             }).then(function (response) {
                 var songResults = response.results;
                 //console.log(response); 
                 for (let i = 0; i < songResults.length; i++) {
                     console.log(songResults);

                     let getSongs = $(this).attr("$P", "data-album-name");
                     console.log('SONG' + getSongs);

                     let $OL = $('<ol>').attr('data-album-song', songResults[i].trackName)
                         .addClass('songs').attr('data-song-name', songResults[i].artistName);

                     $OL.text(songResults[i].trackName);
                     $('body').append($OL);
                 }
             });
         })*/
    });
});