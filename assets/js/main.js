$(function () {

    let queryURL = 'https://itunes.apple.com/search?term=';
    let entity = musicArtist;
    let limit = 5;

    queryURL

    $('.submit').on('click', function () {
        let $SUBMIT = $('.submit').val().trim();
    });

    //function for the itunes ajax call. -> done by Jake
    let ajax_itunes = () => {
        $.ajax({
            url: `${queryURL}&entity=${entity}&limit=${limit}`, //template literal string for query url
            method: "GET",
            dataType: "json"
        }).then(function (response) {
            var results = response.results;

            for (let j = 0; j < results.length; j++) { //appending elements to div if limit > 1;
                console.log('I\'m here');
                let $DIV = ('<div>');
                let $P = ('<p>').text('Artist name: ' +
                    results[j].artistName + 'Track: ' +
                    results[j].trackName);
                $($DIV).append($P);
            }
        })
    }
    ajax_itunes();
});