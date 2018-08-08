$(document).ready(function () {
    let hasSearched = false;
    setInterval(function(){
        if ($("#search-term").val() === "" && (!($("#search-btn").hasClass("disabled")))){   
            //console.error("Nice try bud, but this button is staying disabled!");       
            $("#search-btn").addClass("disabled");
        };
    },1);
    
    //=============================================================

    // Ctrl + F to find "Temporary", These will be things that still need changed to work with final product

    //=============================================================

    //              Materialize
    //=============================================================
    
    // Initializers for materialize stuff
    $(".collapsible").collapsible();
    $(".modal").modal()

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

    //-------------------------------------------------------------
    
    //loops through entirity of database/searches, checks records, called whenever the database is updated (on search);
    bandDB.ref('searches/').orderByChild('searchCount')
    //limits the amound appended to 5.
    .limitToLast(5).on('value',  (snapshot) => {
        // Reference to the HTML
        const $statsTableBody = $(".statsTableBody");

        // Empties the table body
        $statsTableBody.empty();

        // Loops over each searched item
        snapshot.forEach((childSnapshot) => {
            // Creates elements to interact with
            const $statsTableRow = $("<tr>");
            const $statsTableName = $("<td>");
            const $statsTableSearches = $("<td>");
            // add's style to top search model
            $(".statsTableBody").css({"font-weight":"bold", "font-size":"20px","font-family":"Noto Serif"});
            // Shorthand for navigating snapshot
            let childRecord = childSnapshot.val();

            // Writes the list
            $statsTableName.text(childRecord.artist);
            $statsTableSearches.text(childRecord.searchCount);
            $statsTableRow.append($statsTableName, $statsTableSearches)
            $statsTableBody.prepend($statsTableRow);
        });
    });
    
    // Called when search happens
    bandDB.ref('Artists').on("value", (snapshot) => {
        // Grabs info from the database
        let mostRecent = snapshot.val().name;

        // Stringifies the name
        JSON.stringify(mostRecent);

        // Links to the HTML
        let $recentSearchesPar = $(".statsRecentSearches");

        // Changes text to recent search (Shared by all users)
        $recentSearchesPar.text("Most recent search: " + mostRecent);
        $(".statsRecentSearches").css({"font-weight":"bolder","text-align":"center","margin-top":"10px","font-size":"20px"});
    });

    // Shows current snapshot
    // firebase.database().ref('searches/').on('value', (snapshot) => {
    //     //console.log(snapshot);
    // });


    //=============================================================

    //              Functions

    //=============================================================



    // Needs notes
    const toTitleCase = (str) => {

        //Needs notes
        return str.replace(/\w\S*/g, function(txt){

            //Changes first letter to uppercase, the rest to lower
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });
    }

    // Called when search button is clicked
    function updateSearchStats() {
        // Stops the page from refreshing on form input
        // event.preventDefault();
    
        // Grabs the search term from the user
        let searchTerm = $('#search-term').val().toLowerCase().trim();

        // Variable for the amounts of searches
        var searchCount = 0;

        // Sets the search count to the value in the database
        bandDB.ref('searches/' + searchTerm).on('value',  (snapshot) => {
            searchCount = (snapshot.val() && snapshot.val().searchCount) || 0;
        });
        

        // Increases the search count by one
        searchCount = searchCount + 1;

        // Changes the name to titleCase
        let titleSearchTerm = toTitleCase(searchTerm);

        // Sets the values in the database 
        bandDB.ref('searches/' + searchTerm).set({
            searchCount: searchCount,
            artist: titleSearchTerm
        }, (error)=> {
            if(error) {
                //console.log(error);
            }else {
                //console.log("stats saved to database");
            };
        });
    };

    // Called within the wiki ajax call
    const wikiParseURL = (str) => {
        // Changes input to title case
        str = toTitleCase(str);

        // replaces spaces with %20 (url safe version of space)
        str = str.replace(/[" "]/gim,"%20");

        // Returns the str
        return str.trim();
    };
    
    // Called in the wiki ajax call
    const animateIn = () => {
        // Moves the title to the top
        $(".title").addClass("min");

        // removes the hide from the objects, fades them in
        $(".band-image").removeClass("hide fadeOutLeftBig").addClass("fadeInLeftBig");
        $(".band-name").removeClass("hide fadeOutRightBig").addClass("fadeInRightBig");
        $(".bg0, .bg2, .bg4").removeClass("hide fadeOutLeftBig").addClass("fadeInLeftBig");
        $(".bg1, .bg3").removeClass("hide fadeOutRightBig").addClass("fadeInRightBig");
        fitty(".band-name",{maxSize: 325});
        fitty(".bg0");
        fitty(".bg1");
        fitty(".bg2");
        fitty(".bg3");
        fitty(".bg4");

        // Animations for coming in
        setTimeout(function () {
            $(".bio").addClass("fadeInRightBig").removeClass("hide fadeOutRightBig");
            setTimeout(function () {
                $(".collapsible").addClass("fadeInUpBig").removeClass("hide fadeOutDownBig");
                setTimeout(function () {
                    $(".footer-copyright").addClass("fadeInUpBig").removeClass("hide");
                }, 250);
            }, 250);
        }, 250);
    };

    const animateOut = () => {

        // removes the hide from the objects, fades them in
        $(".band-image").removeClass("fadeInLeftBig").addClass("fadeOutLeftBig");
        $(".band-name").removeClass("fadeInRightBig").addClass("fadeOutRightBig");
        $(".bg0, .bg2, .bg4").removeClass("fadeInLeftBig").addClass("fadeOutLeftBig");
        $(".bg1, .bg3").removeClass("fadeInRightBig").addClass("fadeOutRightBig");
        fitty(".band-name",{maxSize: 325});
        fitty(".bg0");
        fitty(".bg1");
        fitty(".bg2");
        fitty(".bg3");
        fitty(".bg4");

        // Animations for coming in
        setTimeout(function () {
            $(".bio").removeClass("fadeInRightBig").addClass("fadeOutRightBig");
            setTimeout(function () {
                $(".collapsible").removeClass("fadeInUpBig").addClass("fadeOutDownBig");
            }, 250);
        }, 250);
    };

    const mediaWikiimageAJAX = (pageID) => {
        // URL for the wiki page
        let wikiQueryURL = `https://cors-anywhere.herokuapp.com/en.wikipedia.org/w/api.php?action=query&prop=pageimages&format=json&piprop=original&pageids=${pageID}`

        // URL for the wiki page (offline)
        //let wikiQueryURL = `https://en.wikipedia.org/w/api.php?action=query&prop=pageimages&format=json&piprop=original&pageids=${pageID}`

        // Call for getting the band wiki picture
        $.ajax({
            url: wikiQueryURL,
            method: "GET",
            datatype: "json",
        }).then(function (wikiResponse) {
            // If the wiki has an image for the page
            if ((Object.values(wikiResponse.query.pages)[0]).original !== undefined){
                // Changes the img to the src
                $(".artist-image").attr("src", (Object.values(wikiResponse.query.pages)[0]).original.source);
            }

            // If there is no image            
            else {
                // If there is no image for an album
                if(($(".album0Img").attr("src")) === "") {
                    // Sets the image to a placeholder Image
                    $(".artist-image").attr("src", "https://www.mikrodots.com/wp-content/uploads/2016/07/placeholder.jpg");                    
                }

                // If there is an image for an album
                else {
                    // Sets the Image to the first album picture
                    $(".artist-image").attr("src", ($(".album0Img").attr("src")));
                }
            };
        });
    };

    // Called internally and when search is clicked    
    const mediaWikiSummaryAJAX = (page) => {
        // If what is passed in is not found
        if(page === undefined){
            // Grabs the user input
            let artistInput = $("#search-term").val().trim();
            $(".bg0, .bg1, .bg2, .bg3, .bg4").text(artistInput);

            // Sends it to clean the input
            let cleanedInput = wikiParseURL(artistInput);

            // query url for Wiki call
            let artistQueryURL = `https://cors-anywhere.herokuapp.com/en.wikipedia.org/w/api.php?action=query&prop=extracts&format=json&exintro=true&titles=${cleanedInput}`

            // query url for Wiki call (for offline)
            //let artistQueryURL = `https://en.wikipedia.org/w/api.php?action=query&prop=extracts&format=json&exintro=true&titles=${cleanedInput}`
            
            // Call for getting the band wiki info
            $.ajax({
                url: artistQueryURL,
                method: "GET",
                datatype: "json",
            }).then(function (wikiResponse) {
                //console.log(wikiResponse);
                // Creates variable for the pageID and the extract
                const pageID = (Object.values(wikiResponse.query.pages)[0]).pageid;
                const extract = (Object.values(wikiResponse.query.pages)[0]).extract;

                // If nothing is returned
                if(extract === "") {
                    // Adds The infront (more likely to find);
                    cleanedInput = "The%20" + cleanedInput;
                    $(".band-name").text((Object.values(wikiResponse.query.pages)[0]).title);

                    // Passes it back through to see if something is found (goes to else);
                    mediaWikiSummaryAJAX(cleanedInput);
                }

                // If there is a response                
                else {
                    // Changes the Name of the Band
                    $(".band-name").text((Object.values(wikiResponse.query.pages)[0]).title);

                    // Grabs the goes to the Image search (giving the page ID);
                    mediaWikiimageAJAX(pageID);

                    // Needs notes
                    $extract = $(extract);
                    
                    $(".bio br").remove();
                    $(`.bio p:not(".read-more")`).remove();

                    if($extract.length !== 0) {
                        $(".bio").prepend($extract);
                        $("<br>").insertAfter(".bio p");
                    }

                    else{
                        let $explenationPar = $("<p>");
                        let $typoPar = $("<p>");
                        let $rewordPar = $("<p>");

                        $explenationPar.text("We couldn't find an artist bio by that name")
                        $typoPar.text("Make sure that what you searched is typed correctly");
                        $rewordPar.text("If that does not help try re-wording the name to fit a wiki search");

                        $(".bio").prepend($typoPar, $rewordPar);
                    };
                };
            });
        }else if(page !== undefined) {
            // Query URL
            let wikiQueryURL = `https://cors-anywhere.herokuapp.com/en.wikipedia.org/w/api.php?action=query&prop=extracts&format=json&exintro=true&titles=${page}`

            // Query URL (for offline)
            //let wikiQueryURL = `https://en.wikipedia.org/w/api.php?action=query&prop=extracts&format=json&exintro=true&titles=${page}`

            // AJAX Call
            $.ajax({
                url: wikiQueryURL,
                method: "GET",
                datatype: "json",
            }).then(function (wikiResponse) {
                // Creates variable for the pageID and the extract
                const pageID = (Object.values(wikiResponse.query.pages)[0]).pageid;
                const extract = (Object.values(wikiResponse.query.pages)[0]).extract;

                // If there is a name for them
                if(extract !== undefined) {
                    // Changes the name to what was found
                    $(".band-name").text((Object.values(wikiResponse.query.pages)[0]).title);
                }

                // If there is no name
                else {
                    setTimeout(function() {
                        if($(".album0Div").attr("data-artist-name") === "") {
                            // Default text
                            $(".band-name").text("We couldn't find an artist by that name");
                        }
                    
                        else {
                            // Grabs the name of the artist from the album0Div slot
                            $(".band-name").text($(".album0Div").attr("data-artist-name"));
                        }
                    }, 250);
                }

                // Finds an image
                mediaWikiimageAJAX(pageID);

                // Needs notes
                $extract = $(extract);
                    
                $(".bio br").remove();
                $(`.bio p:not(".read-more")`).remove();

                if($extract.length !== 0) {
                    $(".bio").prepend($extract);
                    $("<br>").insertAfter(".bio p");
                }

                else{
                    let $explenationPar = $("<p>");
                    let $typoPar = $("<p>");
                    let $rewordPar = $("<p>");

                    $explenationPar.text("We couldn't find an artist bio by that name")
                    $typoPar.text("Make sure that what you searched is typed correctly");
                    $rewordPar.text("If that does not help try re-wording the name to fit a wiki search");

                    $(".bio").prepend($explenationPar, $typoPar, $rewordPar);
                };
            });
        };
    };

    



    //Gets the artists AMG ID instead of searching albums by string. This is used instead of search, as it returns more reliable results.
    const getArtistAMGID = () => {
        // Grabs the value of the search
        let artistInput = $("#search-term").val().trim();

        // Query URL for album search, artistInput only var interaction        
        let IDQueryURL = `https://cors-anywhere.herokuapp.com/itunes.apple.com/search?media=music&limit=1&entity=album&term=${artistInput}`

        // Query URL for album search, artistInput only var interaction (offline)     
        //let IDQueryURL = `https://itunes.apple.com/search?media=music&limit=1&entity=album&term=${artistInput}`

        // Call for getting the album info
        $.ajax({
            url: IDQueryURL,
            method: "GET",
            datatype: "json",
        }).then(function (artistResponse) {
            // Parsing the response to make it a JSON object
            let parsedArtistResponse = JSON.parse(artistResponse);

            // Shorthand for navigating the object
            let artistID = parsedArtistResponse.results[0].amgArtistId;

            // Calls the  album search 
            itunesAlbumAJAX(artistID);
        });
    };



    // When an artists is searched, Called through get artistAMGID
    function itunesAlbumAJAX(artistID) {
        // Holding variables for an Index and an array used to prevent duplicate albums
        let albumOnIndex = 0;
        let albumArray = [];

        $(".collapsible-body").attr("style", "");
        $(".album-list").removeClass("active");
        


        // Grabs the value of the search
        let artistInput = $("#search-term").val().trim();

        // Query URL for album search, artistInput only var interaction

        // For name search
        // let albumQueryURL = `https://cors-anywhere.herokuapp.com/itunes.apple.com/search?media=music&limit=15&entity=album&term=${artistInput}`

        // For name search (offline)
        // let albumQueryURL = `https://itunes.apple.com/search?media=music&limit=15&entity=album&term=${artistInput}`

        // For ID search
        let albumQueryURL = `https://cors-anywhere.herokuapp.com/itunes.apple.com/lookup?amgArtistId=${artistID}&entity=album`

        // For ID search (offline)
        //let albumQueryURL = `https://itunes.apple.com/lookup?amgArtistId=${artistID}&entity=album&limit=15`

        // Call for getting the album info
        $.ajax({
            url: albumQueryURL,
            method: "GET",
            datatype: "json",
        }).then(function (albumResponse) {
            // Parsing the response to make it a JSON object
            let parsedAlbumResponse = JSON.parse(albumResponse);

            // Shorthand for navigating the object
            let albumResults = parsedAlbumResponse.results;

            //Removes any non-albums that were returned
            albumResults.forEach(function(value, index){
                if (value.wrapperType !== "collection"){
                    albumResults.splice(index, 1);
                };
            });

            // If there are album results
            if(albumResults !== 0) {
                // Loops over the results
                $.each(albumResults, function (index, value) {
                    // If the track count is bigger than one (prevents singles on first scan),
                    // the album isnt in the holding array (prevents duplicates),
                    // and the albumOnIndex is less than 5 (stops search at 5 results)  && albumOnIndex < 5
                    if (value.trackCount !== 1 && $.inArray(value.collectionCensoredName, albumArray) === -1 && albumOnIndex < 5) {
                        // Pushes the album name to a holding array
                        albumArray.push(value.collectionCensoredName);

                        // // Changes the text of the album div we are on to the name
                        // $(".album" + albumOnIndex + "Name").text(value.collectionCensoredName).addClass("album-name truncate");

                        // // Adds attributes for[album-name, album-length, album-index],
                        // $(".album" + albumOnIndex + "Div").attr("data-album-name", value.collectionCensoredName).attr("data-album-length", value.trackCount).attr("data-artist-name", value.artistName).attr("data-album-id", value.collectionId).attr("data-index", albumOnIndex).attr("data-load-state", "not-loaded").addClass("valign-wrapper");

                        // // Changes the src of the img to reflect the album name
                        // $(".album" + albumOnIndex + "Img").attr("src", value.artworkUrl100);

                        const $newAlbum = $(`
                        <li class="album-list collection-item">
                            <div class="collapsible-header album${albumOnIndex}Div valign-wrapper" data-album-name="${value.collectionCensoredName}" data-album-length="${value.trackCount}" data-index="${albumOnIndex}" data-album-id="${value.collectionId}" data-load-state="not-loaded">
                                <img class="album${albumOnIndex}Img" src="${value.artworkUrl100}">
                                <p class="album${albumOnIndex}Name album-name truncate">${value.collectionCensoredName}</p>
                            </div>
                            <div class="collapsible-body song${albumOnIndex}Div">

                            </div>
                        </li>`);

                        $(".collapsible").append($newAlbum);
                        $newAlbum.addClass("hvr-grow-shadow").addClass("col s12");
                        itunesSongAJAX(`album${albumOnIndex}Div`);

                        // Increments albumOnIndex to keep track of how many have been added
                        albumOnIndex++;
                    };
                });

                // If weve added less than 5 albums (no need to re-scan if we already have 5)   
                if (albumOnIndex < 5 && $.inArray(albumResults.collectionCensoredName, albumArray)) {
                    // Loops over the result
                    $.each(albumResults, function (index, value) {
                        // If the album isnt in the holding array (prevents duplicates),
                        // and the albumOnIndex is less than 5 (stops search at 5 results)
                        if ($.inArray(value.collectionCensoredName, albumArray) === -1 && albumOnIndex < 5) {
                            // Pushes the album name to a holding array
                            albumArray.push(value.collectionCensoredName);

                            // // Changes the text to the censored name
                            // $(".album" + albumOnIndex + "Name").text(value.collectionCensoredName);

                            // // Adds attributes for[album-name, album-length, album-index]
                            // $(".album" + albumOnIndex + "Div").attr("data-album-name", value.collectionCensoredName)
                            //     .attr("data-album-length", value.trackCount).attr("data-artist-name", value.artistName).attr("data-index", albumOnIndex).attr("data-load-state", "not-loaded");

                            // // Changes the src of the img to reflect the album name    
                            // $(".album" + albumOnIndex + "Img").attr("src", value.artworkUrl100);

                            const $newAlbum = $(`
                            <li class="album-list collection-item">
                                <div class="collapsible-header album${albumOnIndex}Div valign-wrapper" data-album-name="${value.collectionCensoredName}" data-album-length="${value.trackCount}" data-index="${albumOnIndex}" data-album-id="${value.collectionId}" data-load-state="not-loaded">
                                    <img class="album${albumOnIndex}Img" src="${value.artworkUrl100}">
                                    <p class="album${albumOnIndex}Name album-name truncate">${value.collectionCensoredName}</p>
                                </div>
                                <div class="collapsible-body song${albumOnIndex}Div">

                                </div>
                            </li>`);

                            $(".collapsible").append($newAlbum);
                            $newAlbum.addClass("hvr-grow-shadow").addClass("col s12");
                            itunesSongAJAX(`album${albumOnIndex}Div`);
                            

                            // Increments albumOnIndex to keep track of how many have been added    
                            albumOnIndex++;
                        };
                    });
                };
            };

            // If weve added less than 5 albums after the scan
            // if(albumOnIndex < 5) {
            //     // Loops until 5 things are added
            //     for(i = albumOnIndex; i < 5; i++) {
            //         // Changes the text default message
            //         $(".album" + albumOnIndex + "Name").text("We couldn't find an album to put here");

            //         // Sets attributes to ""
            //         $(".album" + albumOnIndex + "Div").attr("data-album-name", "")
            //             .attr("data-album-length", "").attr("data-artist-name", "").attr("data-index", "").attr("data-load-state", "");

            //         // Changes the src of the img to "" 
            //         $(".album" + albumOnIndex + "Img").attr("src", "");

            //         // Increments albumOnIndex to keep track of how many have been added    
            //         albumOnIndex++;
            //     }                
            // }

            
            bandDB.ref('Artists').set({
                name: artistInput
            });

            // Cleans the search bar at end of on clicks to let the info pass first
            $('#search-term').val('');
        });        
    };

    // Called when album is clicked
    function itunesSongAJAX(album) {
        // Shorthand
        let $thisAlbum = $(`.${album}`);
        // let $thisAlbum = $(this);
        //console.log($thisAlbum);
        // let $thisAlbum = $(this);

        // If the information has not already been loaded
        if($thisAlbum.attr("data-load-state") === "not-loaded") {
            //Old way of searching for songs on an album
            // let albumName = $thisAlbum.attr("data-album-name");

            //Stops from loading one too many songs
            let albumLength = ($thisAlbum.attr("data-album-length") - 1) ;
            let forAlbumIndex = $thisAlbum.attr("data-index");
            let albumID = $thisAlbum.attr("data-album-id");

            // Empties the Div that was clicked
            $(".song" + forAlbumIndex + "Div").empty();            
            
            // Old queryURL (live)
            // let songQueryURL = `https://cors-anywhere.herokuapp.com/itunes.apple.com/search?media=music&entity=song&term=${albumName}&limit=${albumLength}`;

            // Old queryURL (offline)
            // let songQueryURL = `https://itunes.apple.com/search?media=music&entity=song&term=${albumName}&limit=${albumLength}`;

            // Query for Song search, limits to album length (live)
            let songQueryURL = `https://cors-anywhere.herokuapp.com/itunes.apple.com/lookup?id=${albumID}&entity=song&limit=${albumLength}`;

            // Query for Song search, limits to album length (offline)
            //let songQueryURL = `https://itunes.apple.com/lookup?id=${albumID}&entity=song&limit=${albumLength}`;

            // Call for getting the song info
            $.ajax({
                url: songQueryURL,
                method: "GET",
                datatype: "json"
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

                // Changes attr to loaded (Prevents constant reloading)
                $thisAlbum.attr("data-load-state", "loaded");
            });
        };
    };
    
    // Needs notes
    const sanitizeString = (str) => {
        str = str.replace(/[^a-z0-9 \_-]/gim,"");
        return str.trim();
    };

    // Called when song is clicked
    function lyricsAJAX() {
        // Shorthand and links to HTML
        let $thisSong = $(this);
        let songArtistName = sanitizeString($thisSong.attr("data-artist-name"));
        let songName = sanitizeString($thisSong.attr("data-song-name"));
        const $lyricsModal = $("#lyricsModal");
        const $lyricsPar = $(".lyricsPar");

        //for youtube
        $(".youtube-content").empty();

        // For getting the lyrics
        let lyricsQueryURL = `https://api.lyrics.ovh/v1/${songArtistName}/${songName}`;

        // Call for the lyrics
        $.ajax({
            url: lyricsQueryURL,
            method: "GET",
            error: function() {
                // Displays an error if the call doesn't work
                $lyricsPar.text("sorry, we couldn't find lyrics for that song");
                $lyricsModal.modal("open");
                youtubeVideo(songArtistName, songName);
            }
        }).then(function (lyricsResponse) {

            // Changes the text to the lyrics
            $lyricsPar.text(lyricsResponse.lyrics)
            
            // Opens the modal
            $lyricsModal.modal("open");
            //calling YouTube API
            youtubeVideo(songArtistName, songName);
        });   
    };

    const allInOne = () => {
        if ($("#search-term").val() === ""){
            M.toast({html: 'You must enter a search term!', classes: "toast-warning"});
            $("#search-btn").addClass("disabled");
        }else if (!hasSearched){
            updateSearchStats();
            getArtistAMGID();
            mediaWikiSummaryAJAX();
            $("#search-btn").addClass("disabled");
            $(".collapsible").empty();
            animateIn();
            hasSearched = true;
        }else if (hasSearched){
            animateOut();
            setTimeout(function(){
                updateSearchStats();
                getArtistAMGID();
                mediaWikiSummaryAJAX();
                $("#search-btn").addClass("disabled");
                $(".collapsible").empty();
                animateIn();    
            }, 1000);
            
        };
    };

    function youtubeVideo(songArtistName, songName) {
        let APIKey = "AIzaSyCi8-fme3jt8JWOwsFM6LVR2EnO6R7m2fY";
        let QueryURL = 'https://www.googleapis.com/youtube/v3/search';
        var songVideo = ''; //Empty to pass in song name.
        $.ajax({
            cache: false,
            data: $.extend({
                key: APIKey,
                q: `${songName} ${songArtistName}`, //  ${songArtistName} s ongArtist / name value from Other API call
            }, {
                maxResults: 1,
                type: 'video',
                category: 'music',
                videoEmbeddable: 'true',
                part: 'snippet',
                //order: 'viewcount', //Gets most viewed
            }),
            dataType: 'json',
            type: 'GET',
            timeout: 3500,
            url: QueryURL
        }).then(function (videoData) {
            console.log('ITSS PEWWWDIEEPIE');
            console.log(videoData);
            let videoObj = videoData.items[0].id.videoId;
            // const etag = removeWrappedQuotes(videoObj);           
            songVideo = `<iframe width="100%" height="100%" src="https://www.youtube.com/embed/${videoObj}" class="youtube-iframe">`;
            console.log('MADE IT');
            console.log(songVideo);
            const $iFrame = $(songVideo);

            $(".youtube-content").append($iFrame);
            $(".youtube-iframe").attr("height", `${($(".youtube-iframe").width())/(1.777778)}px`);
        });
    };


    //=============================================================

    //              On Clicks

    //=============================================================

    $("#search-btn").on("click", function () {
        allInOne();
    });

    $('#search-term').each(function () {
        const elem = $(this);
        // Look for changes in the value
        elem.bind("changes input paste", function (event) {
            // If value has changed...
            if (elem.val() != "") {
                $("#search-btn").removeClass("disabled").addClass("hvr-icon-grow");
            } else {
                $("#search-btn").addClass("disabled").removeClass("hvr-icon-grow");
            };
        });
    });

    // $(document.body).on("click", ".collapsible-header", itunesSongAJAX);
    $(".album-list").on("click", ".song", lyricsAJAX);

    // Needs notes
    $(".read-more").on("click", function(){
        let totalHeight = 0

        let $button = $(this);
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

    $(document.body).on("mouseenter", ".album-list", function () {
        $(this).css("z-index", 500);
    });

    $(document.body).on("mouseleave", ".album-list", function () {
        $(this).css("z-index", 0);
    });

    //=============================================================

    //              Instantly Called

    //=============================================================

    $(function() {
        // Finds each input-feild
        $(".input-field").each(function() {
            // Looks for a keypress
            $(this).find('input').keypress(function(e) {
                // If enter is pressed
                if(e.which == 10 || e.which == 13) {
                    // Calls the searches
                    allInOne();       
                };
            });
        });
    });
    $(window).resize(function(){
        $(".youtube-iframe").attr("height", `${($(".youtube-iframe").width())/(1.777778)}px`);
    });
});



//=============================================================

//              Extra Notes

//=============================================================

//`https://cors-anywhere.herokuapp.com/ -> add to front of queryURL to get running on live

// Wiki api needs to have heroku at all times
// Itunes only needs it live
// Lyrics never needs it

//=============================================================