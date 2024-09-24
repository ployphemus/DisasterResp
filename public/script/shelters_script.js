document.getElementById('fetchShelters').addEventListener('click', function() {
    const apiKey = 'api_key_here'; // Replace with your API key
    const url = 'https://www.fema.gov/api/v1/shelters?state=CA'; // Example endpoint

    fetch(url, {
        headers: {
            'Authorization': `Bearer ${apiKey}` // Include API key if required
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            const shelterList = document.getElementById('shelterList');
            shelterList.innerHTML = ''; // Clear previous results

            if (data.length === 0) {
                shelterList.innerHTML = '<p>No shelters found.</p>';
                return;
            }

            data.forEach(shelter => {
                const shelterDiv = document.createElement('div');
                shelterDiv.classList.add('shelter');
                shelterDiv.innerHTML = `
                        <h3>${shelter.name}</h3>
                        <p>Address: ${shelter.address}</p>
                        <p>Capacity: ${shelter.capacity}</p>
                        <p>Services: ${shelter.services.join(', ')}</p>
                    `;
                shelterList.appendChild(shelterDiv);
            });
        })
        .catch(error => {
            console.error('Error fetching shelter data:', error);
            document.getElementById('shelterList').innerHTML = '<p>Error fetching shelter data.</p>';
        });
});