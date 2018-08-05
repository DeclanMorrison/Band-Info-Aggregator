$(document).ready(function () {
    $('#modal1').modal();

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

    $('#top').hide();
    //loops through entirity of database checks records
    bandDB.ref('searches/').orderByChild('searchCount') //limits the amound appended to 5. 
        .limitToLast(5).on('value', function (snapshot) {
            let str = '<ul>'  
             snapshot.forEach(function(childSnapshot){
                console.log(childSnapshot.val());
                let childRecord = childSnapshot.val(); //sets variable of childSnapshot
                str += '<li>' + childRecord.artist + ': ' + childRecord.searchCount + '</li>'    
            });
        str += '</ul>';
        $('#top').html(str);
    });
    $('#searchBtn').on('click', function () {
        $('#top').show();
        let searchTerm = $('#searchBox').val().toLowerCase().trim();
        //var userId = firebase.auth().currentUser.uid;
        var searchCount = 0;
        bandDB.ref('searches/' + searchTerm).on('value', function (snapshot) {
            searchCount = (snapshot.val() && snapshot.val().searchCount) || 0;
            console.log('snap' + snapshot);
        });
        searchCount = searchCount + 1;
        bandDB.ref('searches/' + searchTerm).set({
            searchCount: searchCount, 
            artist: searchTerm
        }, function(error){
            if(error){
                console.log(error);
            } else {
                console.log('data saved!');
            }
        });
        
        /*bandDB.ref('searches/').on('value', function (snapshot) {
            snapshot.forEach(function(childSnapshot){
                console.log(childSnapshot.val());
            });
        });*/
    });

    var searchRef = firebase.database().ref('searches/');
        searchRef.on('value', function(snapshot) {
        console.log(snapshot);
    });

    /*let writeUserData = () => {
     
          });
        };*/

    //const database_config = () => {
    //configuring database

    
    let artistCount = 0;
    //scrubs the search boxes input for database
    let $searchBox = $('#searchBox').val().trim();

    /*let ref = firebase.database().ref('Artists/artistName');
    ref.once("value")
        .then(function (snapshot) {
            let snapA = snapshot.exists();
            let snapB = snapshot.child("artistName" + $searchBox).exists();

            if ($searchBox.snapshot === snapB) {
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
        let artistInput = $("#searchBox").val().trim();

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
            let albumArray = [];

            // Loops over the results
            $.each(albumResults, function (index, value) {

                // Temporary
                // Created elements needed for interacting with the HTML
                const $albumNamePar = $("<p>");
                const $albumPictureImg = $("<img>");
                const $albumNameDiv = $("<div>");
                const $SongDiv = $("<div>");
                const $fullGroupDiv = $("<div>");

                // If the track count isn't one append album (prevents singles from being appended)
                // and if the track is in a holding array it wont trigger, (prevents duplicates)
                if (value.trackCount !== 1 && $.inArray(value.collectionCensoredName, albumArray) === -1) {
                    // Pushes the album name to a holding array
                    albumArray.push(value.collectionCensoredName);

                    // Changes the text to the censored name
                    $albumNamePar.text(value.collectionCensoredName);

                    // Adds and Image, can be either 60 or 100
                    $albumPictureImg.attr("src", value.artworkUrl100);

                    // Adds attributes for[album-name, album,length, artist-name, album-index],
                    //  adds class of albumDiv (used for on click), appends $albumNamePar
                    $albumNameDiv.attr("data-album-name", value.collectionCensoredName).attr("data-album-length", value.trackCount).attr("data-artist-name", value.artistName).attr("data-index", index).addClass("albumDiv").append($albumPictureImg, $albumNamePar);

                    // Adds class of albumx to song div, empty div for storing songs eg. album4
                    $SongDiv.addClass("album" + index);

                    // Adds class of fullGroupDiv, appends the Album div and empty song Div
                    $fullGroupDiv.addClass("fullGroupDiv").append($albumNameDiv, $SongDiv);

                    // Appends the full group div to the display
                    $tempDiv.append($fullGroupDiv);

                    //sanatizes the search box after click
                    $('#searchBox').val('');
                }
            })
            let artistInfo = {
                artistName: {
                    name: artistInput,
                    albums: albumArray,
                },
                dateAdded: firebase.database.ServerValue.TIMESTAMP
            }

            bandDB.ref('Artists').on("value", function (snapshot) {
                $('#recents').empty();
                console.log('here');
                let mostRecent = snapshot.val().name;
                console.log(mostRecent);
                JSON.stringify(mostRecent);
                let $recentDiv = $("#recents");
                let $P = $('<p>').text('Most Recent: ' + mostRecent);

                $recentDiv.append($P);
                $('#recents').append($recentDiv);
                // $($P).empty();
            });
            bandDB.ref('Artists').set({
                name: artistInput
            });
            //$($P).empty();

        })

    }
    /* let add_recents = () => {
         bandDB.ref('recent_artists').on("child_added", function(snapshot){
             let recents = $('#searchBox').snapshot.val().trim();
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
        let $albumIndex = $(".album" + $thisAlbum.attr("data-index"));

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
            }
        });
    }

    function TEMPlyricsAJAX() {
        let $thisSong = $(this);
        let songArtistName = $thisSong.attr("data-artist-name");
        let songName = $thisSong.attr("data-song-name");
        const $lyricsDiv = $("#tempLyricsDiv");
        $lyricsDiv.addClass("line-break lyricsDiv").empty();

        // // Allows spaces eg. ".../coldplay/adventure of a life time", %20 workds aswell, NEEDS SPACES (toLowerCase)
        let queryURL2 = `https://api.lyrics.ovh/v1/${songArtistName}/${songName}`;

        $.ajax({
            url: queryURL2,
            method: "GET"
        }).then(function (lyricsResponse) {
            console.log(lyricsResponse)
            $lyricsDiv.text(lyricsResponse.lyrics);
            $(document).on('click', '.songDiv', function () {
                $lyricsDiv.text(lyricsResponse.lyrics);
                $('#modal1').modal('open');
            });

        });
    }

    //=============================================================

    //              On Clicks                                    //  

    //=============================================================

    $("#searchBtn").on("click", itunesAlbumAJAX);
    $(".tempDiv").on("click", ".albumDiv", TEMPitunesSongAJAX);
    $(".tempDiv").on("click", ".songDiv", TEMPlyricsAJAX);

    //=============================================================

});