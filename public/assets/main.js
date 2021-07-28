var BTapiUrl = 'https://rest.bandsintown.com/artists/' //bandsintown artists/[artist name]/events?app_id=
var BTapiKey = '/events?app_id=codingbootcamp'


var YTapiUrl = "https://youtube.googleapis.com/youtube/v3/search?type=video&part=snippet&maxResults=1&q="
var YTapiKey = "&key=AIzaSyCbfLWENG7Xt-bGvusj8DNP7usCXXeF1XM"

var video = ''

$('#find').on('click', function (event) {
    var search = $('#search').val()
    event.preventDefault()

    fetch(BTapiUrl + search + BTapiKey)
        .then(data => data.json())
        .then(result => {

            // For some reason its only creating one card, not 4
            for (i = 0; i < 4; i++) {

                var box = $('#event')
                var card = document.createElement('div')
                card.setAttribute('class', 'card')
                card.setAttribute('style', 'width: 15rem')


                //  ThumbNail
                var thumbNail = document.createElement('img')
                var thumbUrl = result[0].artist.thumb_url
                console.log(thumbUrl)
                thumbNail.setAttribute('src', thumbUrl)
                thumbNail.setAttribute('class', 'card-img-top')
                thumbNail.setAttribute('id', 'thumbnail')
                card.appendChild(thumbNail)

                var cardBody = document.createElement('div')
                cardBody.setAttribute('class', 'info-body')

                // Artist Name
                var name = document.createElement('h5')
                name.setAttribute('class', 'card-title')
                var nameEl = result[0].artist.name
                name.textContent = `${nameEl}`
                console.log(name);
                cardBody.appendChild(name);

                // Date 
                var date = document.createElement('span')
                date.setAttribute('class', 'card-text')
                var dateEl = result[i].datetime
                var convertedDate = moment(dateEl, 'YYYY-MM-DD hh:mm:ss')
                var formatedDate = convertedDate.format('MMMM DD YYYY')
                date.textContent = `${formatedDate}`
                cardBody.appendChild(date)

                // Venue
                var venue = document.createElement('span')
                venue.setAttribute('class', 'card-text')
                var venueEl = result[i].venue.name
                venue.textContent = `${venueEl}`
                cardBody.appendChild(venue);
                // Location
                var loc = document.createElement('span')
                loc.setAttribute('class', 'card-text')
                var locEl = result[i].venue.location
                loc.textContent = `${locEl}`
                cardBody.appendChild(loc);

                // Buy Tickets!
                var purchase = document.createElement('a')
                var purchaseUrl = result[i].offers[0].url
                purchase.setAttribute('href', purchaseUrl)
                purchase.setAttribute('class', 'btn btn-primary')
                purchase.setAttribute('target', '_blank')
                purchase.textContent = 'Buy Tickets!'
                cardBody.appendChild(purchase);
                card.appendChild(cardBody);
                box.append(card);
            }

        })

    fetch(YTapiUrl + search + YTapiKey)
        .then(data => data.json())
        .then(result => {
            console.log(result);

            result.items.forEach(item => {
                video =
                    `
            <iframe width="480" height="375" src="http://www.youtube.com/embed/${item.id.videoId}" frameborder="0" allowfullscreen></iframe>
            `
                $('#player').append(video);
            })
        })

})
