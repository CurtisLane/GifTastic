$( document ).ready(function() {

    let topics = ['Totoro', 'Naruto', 'Dragon Ball Z', 'Akira', 'FMA Brotherhood']
    const displayGifsDiv = $('#displayGifs')
    const buttons = $('#buttons')
    let limit = 10;

    // Giphy API AJAX query
    function displayGifs(){
        const api_key = 'T9XxzTKyf5mnTi81SiVMeqKKjtR1TO08'
        const q = $(this).attr('data-name');
        let queryURL = 'https://api.giphy.com/v1/gifs/search?api_key=' + api_key + '&q=' + q + '&limit='+limit+'&offset=0&lang=en'
            
        $.ajax({
        url: queryURL,
        method: "GET"
        }).then(function(response) {
            displayGifsDiv.empty()
            let results = response.data
            for (let i = 0; i < results.length; i++){
                let gifDiv = $('<div>');
                let rating = results[i].rating;
                let p = $('<p>').text('Rated: ' + rating);
                p.addClass('mt-1')
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


            // Attempted bonus work: Create a show more button. Button showed up and added more gifs
            // but changed content of gifs because of 'data-name', let me know if I'm on the right track!
            /*let showMore = $('<button>')
            showMore.attr('id', 'showMore')
            showMore.attr('data-name', q)
            showMore.text('Show More')
            console.log(showMore)
            displayGifsDiv.append(showMore)

            $('#showMore').on('click', function(event){
                event.preventDefault()
                limit=limit+10
                console.log(limit)
                displayGifs()
            })*/

            
            $('.gif').on('click', function() {
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