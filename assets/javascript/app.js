// Waits till document is fully loaded to run JS
$( document ).ready(function() {

    let previousQ;

    // Array storing button values
    let topics = ['Totoro', 'Naruto', 'Dragon Ball Z', 'Akira', 'FMA Brotherhood', 'One Punch Man']
    
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
        
        // The following if statement was provided by the instructor, Jim, to help me complete the function for the show more button.
        
        // Checks if q is truthy
        if (q) {
            // If q has value, check if button pressed is the same as the last one pressed
            if (previousQ !== q) {
                // If button with a new data-name is pressed, limit is reset to 10
                limit = 10
            } else {
                // If show more button is pressed add 10 to limit
                limit += 10
            }
            // Set data-name of show more button equal to 
            previousQ = q;
          }
        
        // Giphy API URL
        let queryURL = 'https://api.giphy.com/v1/gifs/search?api_key=' + api_key + '&q=' + previousQ + '&limit='+limit+'&offset=0&lang=en'
            
        // ajax request to "GET" data from Giphy API
        $.ajax({
        url: queryURL,
        method: "GET"
        
        // Function gets data from Giphy API, converts it into HTML and displays it on page using jQuery
        }).then(function(response) { 
            
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

            // Generate and render show more button
            let showMore = $('<button>')
            showMore.addClass('btn btn-dark my-5')
            showMore.attr('id', 'showMore')
            showMore.attr('data-name', previousQ || q)
            showMore.text('Show More')
            displayGifsDiv.append(showMore)

            // Handler listens for show more button click
            $('#showMore').on('click', function(event){
                event.preventDefault()
                limit=limit+10
                displayGifs()
            })

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

        // Clear input value after new button is created
        $('#searchInput').val('')

    })

    // Handler listens to click on button, displays gif according to which button is pressed
    $(document).on('click', '.topic', displayGifs);

    // Function call to generate initial buttons on page
    generateButtons();

});