$(document).ready(function () {
    //=============================================================

    // Ctrl + F to find "Temporary", These will be things that still need changed to work with final product

    //=============================================================

    //              FireBase

    //=============================================================
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
    bandDB.ref('searches/').orderByChild('searchCount')
        .limitToLast(5).on('value',  (snapshot) => { //limits the amound appended to 5. 
            let topFive = '<ul>'
            snapshot.forEach((childSnapshot) => {
                //console.log(childSnapshot.val());
                let childRecord = childSnapshot.val(); //sets variable of childSnapshot
                topFive += '<li>' + childRecord.artist + ' Searches = ' +
                    childRecord.searchCount + '</li>'
            });
            topFive += '</ul>';
            $('#top').html(topFive);
        });

    $('#search-btn').on('click', () => {
        event.preventDefault();
        $('#top').show();
        let searchTerm = $('#band-name').val().toLowerCase().trim();
        var searchCount = 0;

        bandDB.ref('searches/' + searchTerm).on('value',  (snapshot) => {
            searchCount = (snapshot.val() && snapshot.val().searchCount) || 0;
            ////console.log('snap' + snapshot);
        });

        searchCount = searchCount + 1;

        bandDB.ref('searches/' + searchTerm).set({
            searchCount: searchCount,
            artist: searchTerm
        }, (error)=> {
            if (error) {
                //console.log(error);
            } else {
                //console.log('data saved madude');
            }
        });
    })
        //to show what the current snapshot is
    let searchRef = firebase.database().ref('searches/');
    searchRef.on('value', (snapshot) => {
        //console.log(snapshot);
    });


    //=============================================================

    //              Functions

    //=============================================================
    const mediaWikiSummaryAJAX = (page) => {
        console.log(page);
        if (page === undefined){
            let artistInput = $("#band-name").val().trim();
            let cleanedInput = wikiParseURL(artistInput);
            console.log(cleanedInput);

            let albumQueryURL = `https://en.wikipedia.org/w/api.php?action=query&prop=extracts&format=json&exintro=true&titles=${cleanedInput}`
            
            // Call for getting the band wiki info
            $.ajax({
                url: albumQueryURL,
                method: "GET",
                datatype: "jsonp",
            }).then(function (wikiResponse) {
                console.log(wikiResponse);
                const pageID = (Object.values(wikiResponse.query.pages)[0]).pageid;
                const extract = (Object.values(wikiResponse.query.pages)[0]).extract;

                if (extract === ""){
                    cleanedInput = "The%20" + cleanedInput;
                    mediaWikiSummaryAJAX(cleanedInput);
                }else{
                    $(".band-name").text((Object.values(wikiResponse.query.pages)[0]).title);
                    //console.log(extract);

                    mediaWikiimageAJAX(pageID);

                    $extract = $(extract);
                    $(".bio br").remove();
                    $(`.bio p:not(".read-more")`).remove();
                    
                    $(".bio").prepend($extract);
                    $("<br>").insertAfter(".bio p");
                };
            });
        }else if (page !== undefined){
            
            let albumQueryURL = `https://en.wikipedia.org/w/api.php?action=query&prop=extracts&format=json&exintro=true&titles=${page}`

            $.ajax({
                url: albumQueryURL,
                method: "GET",
                datatype: "jsonp",
            }).then(function (wikiResponse) {
                console.log(wikiResponse);
                $(".band-name").text((Object.values(wikiResponse.query.pages)[0]).title);

                const pageID = (Object.values(wikiResponse.query.pages)[0]).pageid;
                const extract = (Object.values(wikiResponse.query.pages)[0]).extract;
                //console.log(extract);

                mediaWikiimageAJAX(pageID);

                $extract = $(extract);
                $(".bio br").remove();
                $(`.bio p:not(".read-more")`).remove();
                
                $(".bio").prepend($extract);
                // $(".bio p:first").remove();
                $("<br>").insertAfter(".bio p");
            });
        };
    };

    const mediaWikiimageAJAX = (pageID) => {

        let albumQueryURL = `https://en.wikipedia.org/w/api.php?action=query&prop=pageimages&format=json&piprop=original&pageids=${pageID}`

        // Call for getting the band wiki picture
        $.ajax({
            url: albumQueryURL,
            method: "GET",
            datatype: "jsonp",
        }).then(function (wikiResponse) {
            console.log(wikiResponse);
            if ((Object.values(wikiResponse.query.pages)[0]).original !== undefined){
                $(".artist-image").attr("src", (Object.values(wikiResponse.query.pages)[0]).original.source);
            }else{
                $(".artist-image").attr("src", ($(".album0Img").attr("src")));
            };
            
            animateIn();
        });
    };



    //Gets the artists AMG ID instead of searching albums by string. This is used instead of search, as it returns more reliable results.
    const getArtistAMGID = () => {
        // Grabs the value of the search
        let artistInput = $("#band-name").val().trim();

        // Query URL for album search, artistInput only var interaction
        //`https://cors-anywhere.herokuapp.com/ -> add to front of queryURL to get running on live
        let albumQueryURL = `https://itunes.apple.com/search?media=music&limit=1&entity=album&term=${artistInput}`

        // Call for getting the album info
        $.ajax({
            url: albumQueryURL,
            method: "GET",
            datatype: "jsonp",
        }).then(function (artistResponse) {
            //console.log('Got artist');
            // Parsing the response to make it a JSON object
            let parsedArtistResponse = JSON.parse(artistResponse);

            // Shorthand for navigating the object
            let artistID = parsedArtistResponse.results[0].amgArtistId;
            //console.log(artistID);
            itunesAlbumAJAX(artistID);
        });
    };



    // When an artists is searched
    function itunesAlbumAJAX(artistID) {
        // Prevents the page from refreshing on submit

        // Holding variables for an Index and an array used to prevent duplicate albums
        let albumOnIndex = 0;
        let albumArray = [];

        $(".collapsible-body").attr("style", "");
        $(".album-list").removeClass("active");

        // Grabs the value of the search
        let artistInput = $("#band-name").val().trim();

        // Query URL for album search, artistInput only var interaction
        //`https://cors-anywhere.herokuapp.com/ -> add to front of queryURL to get running on live
        // let albumQueryURL = `https://cors-anywhere.herokuapp.com/itunes.apple.com/search?media=music&limit=5&entity=album&term=${artistInput}`
        let albumQueryURL = `https://itunes.apple.com/lookup?amgArtistId=${artistID}&entity=album&limit=5`
        //console.log(albumQueryURL);
        // Call for getting the album info
        $.ajax({
            url: albumQueryURL,
            method: "GET",
            datatype: "jsonp",
        }).then(function (albumResponse) {
            //console.log('Got artist albums');
            // Parsing the response to make it a JSON object
            let parsedAlbumResponse = JSON.parse(albumResponse);

            // Shorthand for navigating the object
            let albumResults = parsedAlbumResponse.results;
            //console.log(albumResults)

            //Removes album metadata, first index of array
            albumResults.shift();

            // $(".artist-image").attr("src", albumResults[0].artworkUrl100);
            $(".card-title").text("");

            // Loops over the results
            $.each(albumResults, function (index, value) {
                // If the track count is bigger than one (prevents singles on first scan),
                // the album isnt in the holding array (prevents duplicates),
                // and the albumOnIndex is less than 5 (stops search at 5 results)  && albumOnIndex < 5
                if (value.trackCount !== 1 &&
                    $.inArray(value.collectionCensoredName, albumArray) === -1) {
                    // Pushes the album name to a holding array
                    albumArray.push(value.collectionCensoredName);

                    const $newAlbum = $(`
                    <li class="album-list collection-item">
                        <div class="collapsible-header album${albumOnIndex}Div valign-wrapper" data-album-name="${value.collectionCensoredName}" data-album-length="${value.trackCount}" data-index="${albumOnIndex}" data-album-id="${value.collectionId}">
                            <img class="album${albumOnIndex}Img" src="${value.artworkUrl100}">
                            <p class="album${albumOnIndex}Name album-name truncate">${value.collectionCensoredName}</p>
                        </div>
                        <div class="collapsible-body song${albumOnIndex}Div">

                        </div>
                    </li>`);

                    $(".collapsible").append($newAlbum);

                    // Increments albumOnIndex to keep track of how many have been added
                    albumOnIndex++;
                }
            })

            // If weve added less than 5 albums (no need to re-scan if we already have 5)            
            if (albumOnIndex < 5) {
                // Loops over the result
                $.each(albumResults, function (index, value) {
                    // If the album isnt in the holding array (prevents duplicates),
                    // and the albumOnIndex is less than 5 (stops search at 5 results)
                    if ($.inArray(value.collectionCensoredName, albumArray) === -1 && albumOnIndex < 5) {
                        // Pushes the album name to a holding array
                        albumArray.push(value.collectionCensoredName);

                        const $newAlbum = $(`
                        <li class="album-list">
                            <div class="collapsible-header album${albumOnIndex}Div valign-wrapper" data-album-name="${value.collectionCensoredName}" data-album-length="${value.trackCount}" data-index="${albumOnIndex}" data-album-id="${value.collectionId}">
                                <img class="album${albumOnIndex}Img" src="${value.artworkUrl100}">
                                <p class="album${albumOnIndex}Name album-name truncate">${value.collectionCensoredName}</p>
                            </div>
                            <div class="collapsible-body song${albumOnIndex}Div">

                            </div>
                        </li>`);

                        $(".collapsible").append($newAlbum);

                        // Increments albumOnIndex to keep track of how many have been added    
                        albumOnIndex++;
                    }
                })
            }
            $('#band-name').val(''); //last fix

            let artistInfo = { //structure of how all inputs will be added
                artistName: {
                    albums: albumArray,
                    name: artistInput,
                },
                dateAdded: firebase.database.ServerValue.TIMESTAMP
            }
            //
            bandDB.ref('Artists').on("value", (snapshot) => {
                $('#recents').empty();
                //console.log('here');
                let mostRecent = snapshot.val().name;
                // //console.log(mostRecent);
                JSON.stringify(mostRecent);  //changes output from object to str
                let $recentDiv = $("#recents");
                let $P = $('<p>').text('Most Recent: ' + mostRecent);
                $recentDiv.append($P);
                $('#recents').append($recentDiv);
            });
            bandDB.ref('Artists').set({
                name: artistInput
            });
            //references 'all-Artists' then orders by key, and limits to the last 2 objects in group
            let keyQuery = firebase.database().ref('all-Artists').limitToLast(2); 
            keyQuery.once("value")
                .then((snapshot) => {
                    let snapShot = snapshot.val();
                    //snapShot.val();
                    JSON.stringify(snapShot);
                    //console.log(snapShot);
                    //console.log('here');
                       // //console.log(previousSnap.val());
                    //  let lowestKey = previousSnap.getChildren().val();
                     // //console.log(lowestKey);
                   
                })    
        
            bandDB.ref('all-Artists').push(artistInfo); 
        })
        
    }

    // Called when album is clicked
    function itunesSongAJAX() {
        console.log("Song Get");
        // Shorthand
        let $thisAlbum = $(this);
        //Old way of searching for songs on an album
        // let albumName = $thisAlbum.attr("data-album-name");

        //Stops from loading one too many songs
        let albumLength = ($thisAlbum.attr("data-album-length") - 1) ;
        let forAlbumIndex = $thisAlbum.attr("data-index");
        let albumID = $thisAlbum.attr("data-album-id");

        // Empties the Div that was clicked
        $(".song" + forAlbumIndex + "Div").empty();

        // Query for Song search, limits to album length
        //`https://cors-anywhere.herokuapp.com/ -> add to front of queryURL to get running on live
        
        // Old queryURL
        // let songQueryURL = `https://itunes.apple.com/search?media=music&entity=song&term=${albumName}&limit=${albumLength}`;
        let songQueryURL = `https://itunes.apple.com/lookup?id=${albumID}&entity=song&limit=${albumLength}`;

        // Call for getting the song info
        $.ajax({
            url: songQueryURL,
            method: "GET",
            datatype: "jsonp"
        }).then(function (songResponse) {
            // Parsing the response to make it a JSON object
            let parsedSongResponse = JSON.parse(songResponse);

            // Shorthand for interacting with JSON
            let songResults = parsedSongResponse.results;
            //console.log(songResults);

            //Removes first index, which is album meta data
            songResults.shift();

            // Adds a collection (materialize component) to interact with
            const $songCollection = $("<ul>");
            $songCollection.addClass("collection");

            // Loop for songs
            $.each(songResults, function (index, value) {
                // Adds content to manipulate for the collection
                const $songCollectionItem = $("<li>");
                $songCollectionItem.addClass("collection-item song");

                // Changes the Text to the song name
                $songCollectionItem.text(value.trackCensoredName)
                    .attr("data-song-name", value.trackCensoredName)
                    .attr("data-artist-name", value.artistName);

                // Appends the data for the collection to the collection
                $($songCollection).append($songCollectionItem);
            });

            // Appends the collection to the div (which shows when an album is clicked) under the albume
            $(".song" + forAlbumIndex + "Div").append($songCollection);
        });
    }

    // Called when song is clicked
    function lyricsAJAX() {
        
        // Shorthand
        let $thisSong = $(this);
        console.log($thisSong.attr("data-artist-name"));
        let songArtistName = sanitizeString($thisSong.attr("data-artist-name"));
        let songName = sanitizeString($thisSong.attr("data-song-name"));
        const $lyricsModal = $("#lyricsModal");
        const $lyricsPar = $(".lyricsPar");
        const $youtubeContent = $(".youtube-content");

        $youtubeContent.empty();
        $lyricsPar.empty();

        let queryURL2 = `https://api.lyrics.ovh/v1/${songArtistName}/${songName}`;

        $.ajax({
            url: queryURL2,
            method: "GET"
        }).then(function (lyricsResponse) {
            console.log(lyricsResponse);
            $lyricsPar.text(lyricsResponse.lyrics)
            $lyricsModal.modal("open");
            youtubeVideo(songArtistName, songName);            
        });   
    };

    const sanitizeString = (str) => {
        console.log(str);
        str = str.replace(/[^a-z0-9 \(\)\_-]/gim,"");
        console.log(str);
        return str.trim();
    };

    const wikiParseURL = (str) => {
        str = toTitleCase(str);
        //console.log(str);
        str = str.replace(/[" "]/gim,"%20");
        //console.log(str);
        return str.trim();
    };

    const toTitleCase = (str) => {
        return str.replace(/\w\S*/g, function(txt){
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });
    };

    const animateIn = () => {
        $(".title").addClass("min");

        $(".band-image").addClass("fadeInLeftBig").removeClass("hide");
        $(".band-name").addClass("fadeInRightBig").removeClass("hide");
        fitty(".band-name",{maxSize: 325});

        setTimeout(function () {
            $(".bio").addClass("fadeInRightBig").removeClass("hide");
            setTimeout(function () {
                $(".collapsible").addClass("fadeInUpBig").removeClass("hide");
                setTimeout(function () {
                    $(".footer-copyright").addClass("fadeInUpBig").removeClass("hide");
                }, 250);
            }, 250);
        }, 250);
    };

    $('#band-name').keypress(function(event) {
        if (event.keyCode == 13 || event.which == 13) {
            getArtistAMGID();
            mediaWikiSummaryAJAX();
            $(".c-btn").addClass("disabled");
            $(".collapsible").empty();
        };
    });

    //=============================================================

    //              On Clicks

    //=============================================================

    $("#search-btn").on("click", function () {
        getArtistAMGID();
        mediaWikiSummaryAJAX();
        $(".c-btn").addClass("disabled");
        $(".collapsible").empty();
    });

    $('#band-name').each(function () {
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

    $(document.body).on("click", ".collapsible-header", itunesSongAJAX);
    $(".album-list").on("click", ".song", lyricsAJAX);

    //=============================================================
    function youtubeVideo(songArtistName, songName) {         
        let APIKey = "AIzaSyCi8-fme3jt8JWOwsFM6LVR2EnO6R7m2fY";                
        let QueryURL = 'https://www.googleapis.com/youtube/v3/search';        
        var songVideo = '';         
        $.ajax({             
            cache: false,             
            data: $.extend({                 
                key: APIKey,
                q: `${songArtistName} ${songName}`,             
                }, 
                {                 
                    maxResults: 1,                 
                    type: 'video',                 
                    videoEmbeddable: 'true',                 
                    part: 'snippet'             
                    }),             
                dataType: 'json',             
                type: 'GET',             
                timeout: 5000,             
                url: QueryURL         
                }).then(function (videoData) {             
                    console.log('YOUTUBE');             
                    console.log(videoData);             
                    let videoObj = videoData.items[0].id.videoId;
                    // const etag = removeWrappedQuotes(videoObj);           
                    songVideo = `<iframe width="550" height="350" src="https://www.youtube.com/embed/${videoObj}">`;             
                    console.log('MADE IT BROV');             
                    console.log(songVideo);
                    const $iframe = $(songVideo);        
                    $(".youtube-content").append($iframe);        
                });         
                //return songVideo;     
            };

    $(".collapsible").collapsible();
    $(".modal").modal()
    $(".read-more").on("click", function(){
        let totalHeight = 0

        let $button = $(this);
        console.log($button);
        let $up = $button.parent();
        let $ps = $up.find("p:not('.read-more')");
        
        if ($(this).attr("data-state") === "open"){
            // measure how tall inside should be by adding together heights of all inside paragraphs (except read-more paragraph)
            $ps.each(function() {
                totalHeight += $(this).outerHeight();
                totalHeight += 25;
            });
                    
            $up
                .css({
                // Set height to prevent instant jumpdown when max height is removed
                "height": $up.height(),
                "max-height": 9999
                })
                .animate({
                "height": totalHeight += 48,
                });
            
            // fade out read-more
            $(".read-more a").text("Close");
            $button.attr("data-state","close");
            
            // prevent jump-down
            return false;
        }else if ($(this).attr("data-state") === "close"){
            
            $up
                .animate({
                "height": 240,
                });

            $(".read-more a").text("Read More");
            $button.attr("data-state", "open")

            return false;
        };  
    });
}); 