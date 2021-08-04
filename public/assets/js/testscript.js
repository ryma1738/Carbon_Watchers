
let newsKey = '826c8d002dc24d088e02c40677ecd5e5'


// News API information
$(document).ready(function() {
    currentNews();
    console.log( "ready!" );
  });

  function currentNews() {
    var url = 'https://newsapi.org/v2/top-headlines?q=climate&from=2021-08-01&sortBy=relevancy&' + newsKey;
  
//   var req = new Request(url);
  
  fetch(url)
      .then(response => {
          response.json();
      })
      .then(result => {
  
        for(i=0; i < 3; i++) {
  
          let box = $('#news')
          let card = document.createElement('div')
          card.setAttribute('class', 'card')
          card.setAttribute('style', 'width: 40rem')
          
          let thumbNail = document.createElement('img')
          let thumbUrl = result.articles[0].urlToImage
          console.log(thumbUrl)
         thumbNail.setAttribute('src', thumbUrl)
         thumbNail.setAttribute('class', 'card-img-top')
         thumbNail.setAttribute('id', 'thumbnail')
         card.appendChild(thumbNail)
  
         let cardBody = document.createElement('div')
         cardBody.setAttribute('class', 'info-body')
  
  
         let title = document.createElement('h5')
         title.setAttribute('class', 'card-title')
         let titleEl = result.articles.title
         title.textContent = `${titleEl}`
         console.log(title);
         cardBody.appendChild(title)
  
         let contents = document.createElement('article')
              contents.setAttribute('class', 'card-text')
              let contentEl = result.articles.content;
              contents.textContent = `${contentEl}`
              cardBody.appendChild(contents)
  
              card.appendChild(cardBody);
              box.append(card);
        }
  
      })
  }