$(document).ready(function () {


// Ctrl + F to find "Temporary", These will be things that still need changed to work with final product

//=============================================================

//              FireBase

//=============================================================

    // //configuring database
    // var config = {
    //     apiKey: "AIzaSyCCuhVM3rHwb0Qq8qrPlFWdCaQCEg0QYm0",
    //     authDomain: "band-aggregator.firebaseapp.com",
    //     databaseURL: "https://band-aggregator.firebaseio.com",
    //     projectId: "band-aggregator",
    //     storageBucket: "band-aggregator.appspot.com",
    //     messagingSenderId: "432642484449"
    //     };
    //     firebase.initializeApp(config);
    //     let bandDB = firebase.database();
    //     //scrubs the search boxes input for database
    //     let $searchBox = $('#searchBox').val().trim();

    //     let artistInfo = {
    //         artistName: $searchBox,
    //         dateAdded: firebase.database.ServerValue.TIMESTAMP
    //     }
    //     bandDB.ref('artist_info').push($searchBox); //pushes input of search to database.

//=============================================================

//              Functions

//=============================================================

    // When an artists is searched
    const itunesAlbumAJAX = () => {        
        event.preventDefault();

        let albumOnIndex = 0;        
        let albumArray = [];

        $(".collapsible-body").attr("style", "");
        $("li").removeClass("active");

        // Grabs the value of the search
        let artistInput = $("#searchBox").val().trim();

    //const database_config = () => {
    //configuring database
    var config = {
        apiKey: "AIzaSyCCuhVM3rHwb0Qq8qrPlFWdCaQCEg0QYm0",
        authDomain: "band-aggregator.firebaseapp.com",
        databaseURL: "https://band-aggregator.firebaseio.com",
        projectId: "band-aggregator",
        storageBucket: "band-aggregator.appspot.com",
        messagingSenderId: "432642484449"
    };
    firebase.initializeApp(config);
    let bandDB = firebase.database();
    //scrubs the search boxes input for database
    // let $band-name = $('#band-name').val().trim();

    /*let ref = firebase.database().ref('Artists/artistName');
    ref.once("value")
        .then(function (snapshot) {
            let snapA = snapshot.exists();
            let snapB = snapshot.child("artistName" + $band-name).exists();

            if ($band-name.snapshot === snapB) {
                artistCount++;
            }
        })*/

    //=============================================================

    // Ctrl + F to find "Temporary", These will be things that still need changed to work with final product

    //=============================================================

    //              Functions                                   //

    //=============================================================
    // database_config();
    // When an artists is searched

    const itunesAlbumAJAX = () => {
        event.preventDefault();

        // Grabs the value of the search
        let artistInput = $("#band-name").val().trim();

      //  bandDB.ref('Artists').push(artistInfo);

        // Temporary
        // Static Div on HTML
        const $tempDiv = $(".tempDiv");

        // Temporary
        // Empties the display
        $tempDiv.empty();
       // `https://cors-anywhere.herokuapp.com/itunes.apple.com/search?media=music&limit=15&entity=album&term=${artistInput}`

        // Query URL for album search, artistInput only var interaction
        let albumQueryURL = `https://itunes.apple.com/search?media=music&limit=15&entity=album&term=${artistInput}`

        $.ajax({
            url: albumQueryURL,
            method: "GET",
            datatype: "json",
        }).then(function (albumResponse) {
            // Parsing the response to make it a JSON object
            let parsedAlbumResponse = JSON.parse(albumResponse);

            // Shorthand for navigating the object
            let albumResults = parsedAlbumResponse.results;

            console.log(albumResults)

            // Loops over the results
            $.each(albumResults, function(index, value) {
                // If the track count isn't one append album (prevents singles from being appended)
                // and if the track is in a holding array it wont trigger, (prevents duplicates)
                if(value.trackCount !== 1 && $.inArray(value.collectionCensoredName, albumArray) === -1 && albumOnIndex < 5) {
                    // Pushes the album name to a holding array
                    albumArray.push(value.collectionCensoredName);                    

                    // Changes the text to the censored name
                    $(".album" + albumOnIndex + "Name").text(value.collectionCensoredName);


                    // Adds attributes for[album-name, album,length, artist-name, album-index],
                    //  adds class of albumDiv (used for on click), appends $albumNamePar
                    $(".album" + albumOnIndex + "Div").attr("data-album-name", value.collectionCensoredName).attr("data-album-length", value.trackCount).attr("data-artist-name", value.artistName).attr("data-index", albumOnIndex);

                    $(".album" + albumOnIndex + "Img").attr("src", value.artworkUrl100);

                    albumOnIndex++;
                }
            })
            let albumArray = [];
        
            // Loops over the results
            $.each(albumResults, function (index, value) {

                // Temporary
                // Created img needed for interacting with the HTML
                const $albumPictureImg = $("<img>");

                // If the track count isn't one append album (prevents singles from being appended)
                // and if the track is in a holding array it wont trigger, (prevents duplicates)

                if($.inArray(value.collectionCensoredName, albumArray) === -1 && albumOnIndex < 5) {

                    // Pushes the album name to a holding array
                    albumArray.push(value.collectionCensoredName);                    

                    // Changes the text to the censored name
                    $(".album" + albumOnIndex + "Name").text(value.collectionCensoredName);

                    // Adds attributes for[album-name, album,length, artist-name, album-index],
                    //  adds class of albumDiv (used for on click), appends $albumNamePar
                    $(".album" + albumOnIndex + "Div").attr("data-album-name", value.collectionCensoredName).attr("data-album-length", value.trackCount).attr("data-artist-name", value.artistName).attr("data-index", albumOnIndex);

                    $(".album" + albumOnIndex + "Img").attr("src", value.artworkUrl100);

                    albumOnIndex++;
                }
            })
        }) 
                    // Adds class of fullGroupDiv, appends the Album div and empty song Div
                    $fullGroupDiv.addClass("fullGroupDiv").append($albumNameDiv, $SongDiv);

                    // Appends the full group div to the display
                    $tempDiv.append($fullGroupDiv);

                    //sanatizes the search box after click
                    $('#band-name').val('');
                }
            })
            let artistInfo = {
                artistName: {
                    name: artistInput,
                    albums: albumArray,
                },
                dateAdded: firebase.database.ServerValue.TIMESTAMP
            }
            
            bandDB.ref('Artists').on("value", function(snapshot){
            
                console.log('here');
                let mostRecent = snapshot.val().name;
                console.log(mostRecent);
                JSON.stringify(mostRecent);
                let $recentDiv = $(".recent");
                let $P = $('<p>').text('Most Recent: ' + mostRecent);

                $recentDiv.append($P);
                
            });
            bandDB.ref('Artists').set({
                name: artistInput
            });
           
        })
        
    }
   /* let add_recents = () => {
        bandDB.ref('recent_artists').on("child_added", function(snapshot){
            let recents = $('#band-name').snapshot.val().trim();
            console.log(reached);
            let $recentDiv = $('<div>');
            let $appRecents = $('<p>');
            $appRecents.text(recents);
            $recentDiv.append($p);
        })
    }*/
    

    // Temporary
    // Could not get fat arrow functions to interact with "this", if addressed refactor with ES6
    // const itunesSongAJAX = () => {

    //     let $this = $(this);
    //     console.log($this);

    //     let albumName = $this.attr("data-album-name");
    //     console.log(albumName);

    //     let songQueryURL = `https://itunes.apple.com/search?media=music&entity=song&term=${albumName}&limit=${trackCount}`
    // }

    // Called when album is clicked
    function TEMPitunesSongAJAX() {
        // Shorthand
        let $thisAlbum = $(this);
        let albumName = $thisAlbum.attr("data-album-name");
        let albumLength = $thisAlbum.attr("data-album-length");
        let albumArtistName = $thisAlbum.attr("data-artist-name");
        let forAlbumIndex = $thisAlbum.attr("data-index");

        $(".song" + forAlbumIndex + "Div").empty();

        // Query for Song search, limits to album length
        //`https://cors-anywhere.herokuapp.com/itunes.apple.com/search?media=music&entity=song&term=${albumName}&limit=${albumLength}
        let songQueryURL = `https://itunes.apple.com/search?media=music&entity=song&term=${albumName}&limit=${albumLength}`;

        $.ajax({
            url: songQueryURL,
            method: "GET",
            datatype: "json"
        }).then(function (songResponse) {
            // Parsing the response to make it a JSON object
            let parsedSongResponse = JSON.parse(songResponse);

            // Shorthand for interacting with JSON
            let songResults = parsedSongResponse.results;
            console.log(songResults);
            const $songCollection = $("<ul>");
            $songCollection.addClass("collection");

            // Loop for songs
            $.each(songResults, function(index, value) {
                const $songCollectionItem = $("<li>");

                $songCollectionItem.addClass("collection-item");


                // Changes the Text to the song name
                $songCollectionItem.text(value.trackCensoredName).attr("data-song-name", value.trackCensoredName).attr("data-artist-name", albumArtistName);

                // Adds attributes for[song-name, artist-name], adds class of songDiv, appends songNamePar
                $($songCollection).append($songCollectionItem);
            });

            $(".song" + forAlbumIndex + "Div").append($songCollection);            

            // If the data-state is open it empties the song div
            if ($thisAlbum.attr("data-state") === "open") {
                // Sets data-state to closed
                $thisAlbum.attr("data-state", "closed");
                $albumIndex.empty();
            }

            // If the data-state is not open, opens it            
            else {
                // Loop for songs
                $.each(songResults, function (index, value) {
                    // Shorthand
                    const $songNamePar = $("<p>");
                    const $songNameDiv = $("<div>");

                    // Changes the Text to the song name
                    $songNamePar.text(value.trackCensoredName);

                    // Adds attributes for[song-name, artist-name], adds class of songDiv, appends songNamePar
                    $songNameDiv.attr("data-song-name", value.trackCensoredName).attr("data-artist-name", albumArtistName).addClass("songDiv").append($songNamePar);

                    // Appends the Song name div to the empty song div
                    $albumIndex.append($songNameDiv);

                    // Sets the attribute of data-state to open
                    $thisAlbum.attr("data-state", "open")
                });
            };
        });
    };

    function TEMPlyricsAJAX() {
        let $thisSong = $(this);
        let songArtistName = $thisSong.attr("data-artist-name");
        let songName = $thisSong.attr("data-song-name");
        const $lyricsDiv = $(".tempLyricsDiv");
        $lyricsDiv.addClass("line-break lyricsDiv").empty();

        // // Allows spaces eg. ".../coldplay/adventure of a life time", %20 workds aswell, NEEDS SPACES (toLowerCase)
        let queryURL2 = `https://api.lyrics.ovh/v1/${songArtistName}/${songName}`;

        $.ajax({
            url: queryURL2,
            method: "GET"
        }).then(function (lyricsResponse) {
            console.log(lyricsResponse)
            $lyricsDiv.text(lyricsResponse.lyrics)
        
        });
    }


    // const wikiAJAXcall = () => {
    //     const bandName = $("#band-name").val().trim();
    //     const queryURL = `https://en.wikipedia.org/w/api.php?action=query&titles=${bandName}&prop=revisions&rvprop=content&format=json&formatversion=2`
    //     $.ajax({
    //         url: queryURL,
    //         method: "GET"
    //     }).then(function(response){
    //         console.log(response);
    //     });
    // };



    $('#band-name').keyup(function (event){
        if (event.which === 13) {
            // wikiAJAXcall();
            $(".title").addClass("min");
            $(".bio, .band-image").removeClass("hide");
            $(".band-image").addClass("fadeInLeftBig");
            $(".bio").addClass("fadeInUpBig");
            $(".collapsible").addClass("fadeInUpBig").removeClass("hide");
            event.preventDefault();
            return false;
        }
    });

    //=============================================================

    //              On Clicks                                    //  

    //=============================================================


    $("#search-btn").on("click", function (){
        itunesAlbumAJAX();
        // wikiAJAXcall();
        $(".title").addClass("min");

        $(".band-image").addClass("fadeInLeftBig").removeClass("hide");

        setTimeout(function(){
            $(".bio").addClass("fadeInRightBig").removeClass("hide");
            setTimeout(function(){
                $(".collapsible").addClass("fadeInUpBig").removeClass("hide");
                setTimeout(function(){
                    $(".footer-copyright").addClass("fadeInUpBig").removeClass("hide");
                },250)
            },250)
        }, 250)
    });

    $('#band-name').each(function (){
        const elem = $(this);
        // Look for changes in the value
        elem.bind("changes input paste", function (event) {
            // If value has changed...
            if (elem.val() != "") {
                $(".c-btn").removeClass("disabled").addClass("hvr-icon-grow");
            } else {
                $(".c-btn").addClass("disabled").removeClass("hvr-icon-grow");
            };
        });
    });

    $("#searchBtn").on("click", itunesAlbumAJAX);
    $(".collapsible-header").on("click", TEMPitunesSongAJAX);
    $('.collapsible').collapsible();
    //=============================================================

});