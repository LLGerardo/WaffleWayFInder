document.getElementById('hotelSearchForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent form submission
  
    // Get values from the form
    const city = document.getElementById('city').value;
  
    // Call a function to fetch hotel data with the search parameters
    fetchHotelData(city);
  });
  
  async function fetchHotelData(city) {
    const apiUrl = 'https://hotels-com-provider.p.rapidapi.com/v2/hotels/search?region_id=6350699&locale=en_US&checkin_date=2023-12-26&sort_order=REVIEW&adults_number=1&domain=US&checkout_date=2023-12-31&children_ages=4%2C0%2C15&lodging_type=HOTEL%2CBED_AND_BREAKFAST&star_rating_ids=3%2C4%2C5&meal_plan=FREE_BREAKFAST&page_number=1&amenities=WIFI%2CPARKING%2CWAFFLE_MAKER&guest_rating_min=8&available_filter=SHOW_AVAILABLE_ONLY'; // Add other parameters
  
    const options = {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': 'e18a3d6bcfmsh2d4a705d3bc57aep102e82jsnb7335d04df7e',
        'X-RapidAPI-Host': 'hotels-com-provider.p.rapidapi.com'
      }
    };
  
    try {
      const response = await fetch(apiUrl, options);
      const data = await response.json();
  
      // Display hotel results
      //displayHotelResults(data.hotels);
      if (data && data.properties) {
        const hotels =getHotelNames(data.properties);
        displayHotelResults(hotels); // Display hotel results
    } else {
      console.error('No hotel data found or invalid format.');
    }
  
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }
  
  // Function to extract hotel names from an array of hotel objects
  function getHotelNames(properties) {
  return properties.map(property => ({
    name: property.name,
    address: property.neighborhood ? property.neighborhood.name : 'Address not available'
  }))
  }
  
  function displayHotelResults(hotels) {
    const hotelResults = document.getElementById('hotelResults');
    hotelResults.innerHTML = ''; // Clear previous results
  
    hotels.forEach(hotel => {
      const hotelDiv = document.createElement('div');
      hotelDiv.innerHTML = `
        <h3>${hotel.name}</h3>
        <p>Address: ${hotel.address}</p>
        <!-- Other hotel details -->
      `;
      hotelResults.appendChild(hotelDiv);
    });
  }
  
  //I have extracted the data for hotels using rapid api. Some of the JS code is from the snippet of hotels.com Api.
  // Some of the JavaScript code ideas were taken from resources provided by professor.
  //I had taken some help from chatgpt to figure out the implementation of Api as this was
  //was my first time working with api's.
  //W3 schools was also very helpful.