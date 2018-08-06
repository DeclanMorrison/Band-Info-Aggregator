$(document).ready(function() {
    //=============================================================
    
    // Ctrl + F to find "Temporary", These will be things that still need changed to work with final product
    
    //=============================================================
    
    //              FireBase
    
    //=============================================================
    //Note
    //Firebase stuff
    // bandDB.ref('Artists').on("value", function(snapshot){
    //     $('#recents').empty();
    //        console.log('here');
    //        let mostRecent = snapshot.val().name;
    //        console.log(mostRecent);
    //        JSON.stringify(mostRecent);
    //        let $recentDiv = $("#recents");
    //        let $P = $('<p>').text('Most Recent: ' + mostRecent);
    
    //        $recentDiv.append($P);
    //        $('#recents').append($recentDiv);
    //       // $($P).empty();
    //    });
        
    //=============================================================
    
    //              Functions
    
    //=============================================================
    
        // When an artists is searched
        function itunesAlbumAJAX() {
            // Prevents the page from refreshing on submit
            event.preventDefault();
    
            //Note
            //firebase stuff
            // bandDB.ref('Artists').set({
            //     name: artistInput
            // });
    
            // Holding variables for an Index and an array used to prevent duplicate albums
            let albumOnIndex = 0;        
            let albumArray = [];
    
            $(".collapsible-body").attr("style", "");
            $(".album-list").removeClass("active");
    
            // Grabs the value of the search
            let artistInput = $("#band-name").val().trim();
    
            // Query URL for album search, artistInput only var interaction
            let albumQueryURL = `https://itunes.apple.com/search?media=music&limit=15&entity=album&term=${artistInput}`
    
            // Call for getting the album info
            $.ajax({
                url: albumQueryURL,
                method: "GET",
                datatype: "json",            
            }).then(function(albumResponse) {
                // Parsing the response to make it a JSON object
                let parsedAlbumResponse = JSON.parse(albumResponse);
    
                // Shorthand for navigating the object
                let albumResults = parsedAlbumResponse.results;
                console.log(albumResults)
    
                $(".artist-image").attr("src", albumResults[0].artworkUrl100);
                $(".card-title").text(albumResults[0].artistName)
    
                // Loops over the results
                $.each(albumResults, function(index, value) {
                    // If the track count is bigger than one (prevents singles on first scan),
                    // the album isnt in the holding array (prevents duplicates),
                    // and the albumOnIndex is less than 5 (stops search at 5 results)
                    if(value.trackCount !== 1 && $.inArray(value.collectionCensoredName, albumArray) === -1 && albumOnIndex < 5) {
                        // Pushes the album name to a holding array
                        albumArray.push(value.collectionCensoredName);                    
    
                        // Changes the text of the album div we are on to the name
                        $(".album" + albumOnIndex + "Name").text(value.collectionCensoredName);
    
                        // Adds attributes for[album-name, album-length, album-index],
                        $(".album" + albumOnIndex + "Div").attr("data-album-name", value.collectionCensoredName).attr("data-album-length", value.trackCount).attr("data-index", albumOnIndex);
    
                        // Changes the src of the img to reflect the album name
                        $(".album" + albumOnIndex + "Img").attr("src", value.artworkUrl100);
    
                        // Increments albumOnIndex to keep track of how many have been added
                        albumOnIndex++;
                    }
                })
    
                // If weve added less than 5 albums (no need to re-scan if we already have 5)            
                if(albumOnIndex < 5) {
                    // Loops over the result
                    $.each(albumResults, function(index, value) {
                        // If the album isnt in the holding array (prevents duplicates),
                        // and the albumOnIndex is less than 5 (stops search at 5 results)
                        if($.inArray(value.collectionCensoredName, albumArray) === -1 && albumOnIndex < 5) {
                            // Pushes the album name to a holding array
                            albumArray.push(value.collectionCensoredName);                    
        
                            // Changes the text to the censored name
                            $(".album" + albumOnIndex + "Name").text(value.collectionCensoredName);
        
                            // Adds attributes for[album-name, album-length, album-index]
                            $(".album" + albumOnIndex + "Div").attr("data-album-name", value.collectionCensoredName).attr("data-album-length", value.trackCount).attr("data-index", albumOnIndex);
    
                            // Changes the src of the img to reflect the album name    
                            $(".album" + albumOnIndex + "Img").attr("src", value.artworkUrl100);
    
                            // Increments albumOnIndex to keep track of how many have been added    
                            albumOnIndex++;
                        }
                    })
                }            
            }) 
        }
    
        // Called when album is clicked
        function itunesSongAJAX() {
            // Shorthand
            let $thisAlbum = $(this);
            let albumName = $thisAlbum.attr("data-album-name");
            let albumLength = $thisAlbum.attr("data-album-length");
            let forAlbumIndex = $thisAlbum.attr("data-index");
            
            // Empties the Div that was clicked
            $(".song" + forAlbumIndex + "Div").empty();
    
            // Query for Song search, limits to album length
            let songQueryURL = `https://itunes.apple.com/search?media=music&entity=song&term=${albumName}&limit=${albumLength}`;
    
            // Call for getting the song info
            $.ajax({
                url: songQueryURL,
                method: "GET",
                datatype: "json"
            }).then(function(songResponse) {
                // Parsing the response to make it a JSON object
                let parsedSongResponse = JSON.parse(songResponse);
    
                // Shorthand for interacting with JSON
                let songResults = parsedSongResponse.results;
                console.log(songResults);
    
                // Adds a collection (materialize component) to interact with
                const $songCollection = $("<ul>");
                $songCollection.addClass("collection");
    
                // Loop for songs
                $.each(songResults, function(index, value) {
                    // Adds content to manipulate for the collection
                    const $songCollectionItem = $("<li>");
                    $songCollectionItem.addClass("collection-item");
    
                    // Changes the Text to the song name
                    $songCollectionItem.text(value.trackCensoredName).attr("data-song-name", value.trackCensoredName).attr("data-artist-name", value.artistName);
    
                    // Appends the data for the collection to the collection
                    $($songCollection).append($songCollectionItem);
                });
                
                // Appends the collection to the div (which shows when an album is clicked) under the albume
                $(".song" + forAlbumIndex + "Div").append($songCollection);            
            });
        }
    
        // Called when song is clicked
        function lyricsAJAX() {
            console.log("here");
            // Shorthand
            let $thisSong = $(this);
            let songArtistName = $thisSong.attr("data-artist-name");
            let songName = $thisSong.attr("data-song-name");
            const $lyricsModal = $("#lyricsModal");
            const $lyricsPar = $(".lyricsPar");
    
            $lyricsPar.empty();
            
            let queryURL2 = `https://api.lyrics.ovh/v1/${songArtistName}/${songName}`;
    
            $.ajax({
                url: queryURL2,
                method: "GET"
            }).then(function (lyricsResponse) {
                console.log(lyricsResponse);
                $lyricsPar.text(lyricsResponse.lyrics)
            });
    
            $lyricsModal.modal("open");
        }
    
        $('#band-name').keyup(function (event){
            if (event.which === 13) {
                itunesAlbumAJAX();
                // wikiAJAXcall();
    
                event.preventDefault();
                
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
                
                return false;
            }
        });
    
    //=============================================================
    
    //              On Clicks
    
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
    
        $(".collapsible-header").on("click", itunesSongAJAX);
        $(".album-list").on("click", ".collection-item", lyricsAJAX)
    
    //=============================================================
    
        $(".collapsible").collapsible();
        $(".modal").modal()  
    });