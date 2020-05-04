// Waits till document is fully loaded to run JS
$( document ).ready(function() {

    // Array storing button values
    let topics = ['Totoro', 'Naruto', 'Dragon Ball Z', 'Akira', 'FMA Brotherhood']
    
    // Commonly used jQueryS
    const displayGifsDiv = $('#displayGifs')
    const buttons = $('#buttons')
    
    // Number of gifs displayed, could be updated for 'show more' button
    let limit = 10;

    // Function takes data from Giphy API and displays gifs on page
    function displayGifs(){
        
        // Variable storing API key
        const api_key = 'T9XxzTKyf5mnTi81SiVMeqKKjtR1TO08'
        
        //  Variable storing data-name from button click, used as search value in URL from Giphy API
        const q = $(this).attr('data-name');
        
        // Giphy API URL
        let queryURL = 'https://api.giphy.com/v1/gifs/search?api_key=' + api_key + '&q=' + q + '&limit='+limit+'&offset=0&lang=en'
            
        // ajax request to "GET" data from Giphy API
        $.ajax({
        url: queryURL,
        method: "GET"
        }).then(function(response) { // Function gets data from Giphy API, converts it into HTML and displays it on page using jQuery
            
            // Empty all gifs before displaying more
            displayGifsDiv.empty()

            // Store data array to variable
            let results = response.data

            // Loop through data array
            for (let i = 0; i < results.length; i++){

                // Create a div, rating(p tag), and img for each gif
                let gifDiv = $('<div>');
                let rating = results[i].rating;
                let p = $('<p>').text('Rated: ' + rating);
                p.addClass('mt-1') // Add top margin to rating with bootstrap class
                let gifImage = $('<img>')

                // Add attributes to gifImage to toggle still/animated on click in a later function
                gifImage.attr('src', results[i].images.original_still.url)
                gifImage.attr('data-still', results[i].images.original_still.url)
                gifImage.attr('data-animate', results[i].images.original.url)
                gifImage.attr('data-state', 'still')
                gifImage.addClass('gif img-fluid mt-1') // Add .gif and bootstrap classes for styling

                // Add gifImage and rating(p tag) to gifDiv
                gifDiv.append(gifImage);
                gifDiv.append(p);

                // Add gifDiv to displayGifsDiv
                displayGifsDiv.append(gifDiv);
            }
            
            // Instructions for user
            let instructions = $('<p>').text('Click or tap an image to start/stop the animation.');

            // Add instructions to page when gifs are loaded
            displayGifsDiv.prepend(instructions)


            /* ---------- 
            Attempted bonus work: Create a show more button. Button showed up and added more gifs
            but changed content of gifs because of 'data-name', let me know if I'm on the right track!
            
            let showMore = $('<button>')
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
            })
            ----------*/

            // Handler listens for click on a gif
            $('.gif').on('click', function() {
                
                // variable created for clicked gif's data-state attribute
                let state = $(this).attr("data-state");
                
                // Toggle between animated gif and still image each click
                if (state === "still") {
                  $(this).attr("src", $(this).attr("data-animate"));
                  $(this).attr("data-state", "animate");
                } else {
                  $(this).attr("src", $(this).attr("data-still"));
                  $(this).attr("data-state", "still");
                }
            });
            
        }); // *close .then function
                
    } // *close function displayGifs()
    
    // Makes buttons appear on page each related to item in topics array
    function generateButtons() {

        // Prevent duplicate button generation by first clearing the page of all buttons
        buttons.empty()

        // Loop through topics array
        for (let i = 0; i < topics.length; i++) {
            
            // Variable creates a button
            let btn = $('<button>');

            // Add class and data-name attributes to btn
            btn.addClass('topic btn btn-dark m-1');
            btn.attr('data-name', topics[i]);

            // Uppercase the first letter of each word function from https://www.smartherd.com/convert-text-cases-using-jquery-without-css/
            btn.text(topics[i].toLowerCase().replace(/\b[a-z]/g, function(txtVal) {
                return txtVal.toUpperCase();
            }))
            
            // Add btn to buttons(html div)
            buttons.append(btn);
        }
    }

    // When green button is pressed, input value is added as a button
    $('#addSearch').on('click', function(event){
        
        // Prevent button from default function
        event.preventDefault();

        // Create variable for search input value
        let topic = $('#searchInput').val().trim()

        // Push value of search input into topics array
        topics.push(topic);

        // Regenerate all buttons with updated topics array
        generateButtons();
    })

    // Handler listens to click on button, displays gif according to which button is pressed
    $(document).on('click', '.topic', displayGifs);

    // Function call to generate initial buttons on page
    generateButtons();

});