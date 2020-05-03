$( document ).ready(function() {
    console.log( "ready!" );

    let topics = ['Naruto', 'Dragon Ball Z', 'Akira', 'FMA Brotherhood']
    const displayGifsDiv = $('#displayGifs')
    const buttons = $('#buttons')

    // Giphy API AJAX query
    function displayGifs(){
        
        const api_key = 'T9XxzTKyf5mnTi81SiVMeqKKjtR1TO08'
        let q = $(this).attr('data-name');
        let queryURL = 'https://api.giphy.com/v1/gifs/search?api_key=' + api_key + '&q=' + q + '&limit=10&offset=0&lang=en'
            
        $.ajax({
        url: queryURL,
        method: "GET"
        }).then(function(response) {
            displayGifsDiv.empty()
            console.log(response)
            let results = response.data
            for (let i = 0; i < results.length; i++){
                let gifDiv = $('<div>');
                let rating = results[i].rating;
                let p = $('<p>').text('Rated: ' + rating);
                let gifImage = $('<img>')

                gifImage.attr('src', results[i].images.original_still.url)
                gifImage.attr('data-still', results[i].images.original_still.url)
                gifImage.attr('data-animate', results[i].images.original.url)
                gifImage.attr('data-state', 'still')
                gifImage.addClass('gif img-fluid')

                gifDiv.append(gifImage);
                gifDiv.append(p);

                displayGifsDiv.append(gifDiv);
            }
            let instructions = $('<p>').text('Click or tap an image to start/stop the animation.');
            displayGifsDiv.prepend(instructions)

            
            $('.gif').on("click", function() {
                console.log('clicked')
                var state = $(this).attr("data-state");
                if (state === "still") {
                  $(this).attr("src", $(this).attr("data-animate"));
                  $(this).attr("data-state", "animate");
                } else {
                  $(this).attr("src", $(this).attr("data-still"));
                  $(this).attr("data-state", "still");
                }
            });
            
        });
        
    }

    
    

    function generateButtons() {
        buttons.empty()

        for (let i = 0; i < topics.length; i++) {
            let btn = $('<button>');
            btn.addClass('topic btn btn-dark m-1');
            btn.attr('data-name', topics[i]);
            // Uppercase the first letter of each word function from https://www.smartherd.com/convert-text-cases-using-jquery-without-css/
            btn.text(topics[i].toLowerCase().replace(/\b[a-z]/g, function(txtVal) {
                return txtVal.toUpperCase();
            }))
            buttons.append(btn);
        }
    }

    $('#addSearch').on('click', function(event){
        event.preventDefault();

        let topic = $('#searchInput').val().trim()

        topics.push(topic);

        generateButtons();
    })

    $(document).on('click', '.topic', displayGifs);

    generateButtons();

});