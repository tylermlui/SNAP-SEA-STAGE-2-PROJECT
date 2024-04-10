let page = 4;
function parseCSVData(csvData) {

    const dataList =[];
    const lines = csvData.trim().split('\n');
  
    lines.forEach(line => {

      const fields = line.split(',');
  
      const setNumber = fields[0].trim();
      const setName = fields[1].trim();
      const releaseDate = parseInt(fields[2].trim()); 
      const themeId = parseInt(fields[3].trim()); 
      const numberOfPieces = parseInt(fields[4].trim()); 
      const imageUrl = fields[5].trim();
      console.log(imageUrl);
      const entry = {
        setNumber: setNumber,
        setName: setName,
        releaseDate: releaseDate,
        themeId: themeId,
        numberOfPieces: numberOfPieces,
        imageUrl: imageUrl
      };
  
      dataList.push(entry);
    });

    console.log(dataList)
  
    return dataList;
  }

    const parseCategoriesCSV = (csvData) => {
      const themes = {};
      const lines = csvData.trim().split('\n');

      lines.forEach(line => {
        const fields = line.split(',');
        const themeId = parseInt(fields[0].trim());
        const themeName = fields[1].trim();

        themes[themeId] = themeName;
      });
      return themes;
      
    };


    function getSets() {
      fetch('./sets.csv')
          .then(response => {
              if (!response.ok) {
                  throw new Error('ERROR FETCHING SETS CSV');
              }
              return response.text();
          })
          .then(setsCsvData => {
              ParsedList = parseCSVData(setsCsvData);
              
              fetch('./themes.csv')
                  .then(response => {
                      if (!response.ok) {
                          throw new Error('ERROR FETCHING THEMES CSV');
                      }
                      return response.text();
                  })
                  .then(categoriesCsvData => {
                      CategoriesList = parseCategoriesCSV(categoriesCsvData);
                      // Call showCards here after data is fetched and processed
                      showCards(1, 5);
                  })
                  .catch(error => {
                      console.error('ERROR FETCHING THEMES CSV', error);
                  });
          })
          .catch(error => {
              console.error('ERROR FETCHING SETS CSV', error);
          });
  }


document.addEventListener("DOMContentLoaded", getSets); 

let currentPageNumber = 1; // Track the current page number globally

function showCards(pageNumber, pageSize) {
    const cardContainer = document.getElementById("card-container");
    cardContainer.innerHTML = "";
    const templateCard = document.querySelector(".card");

    const startIndex = (pageNumber - 1) * pageSize;
    const endIndex = startIndex + pageSize;

    const setsToShow = ParsedList.slice(startIndex, endIndex);

    setsToShow.forEach((set, index) => {
        const nextCard = templateCard.cloneNode(true);

        editCardContent(nextCard, set.setName,
            set.imageUrl, set.setNumber, set.releaseDate,
            set.numberOfPieces, CategoriesList[set.themeId]);

        cardContainer.appendChild(nextCard);
    });

    currentPageNumber = pageNumber; 
}


function editCardContent(card, newSet, newImageURL, newSetNumber, newReleaseDate, newNumberPieces, newSetTheme) {
    card.style.display = "block";

    const cardHeader = card.querySelector("h2");
    cardHeader.textContent = newSet;

    const cardImage = card.querySelector("img");
    cardImage.src = newImageURL;
    cardImage.alt = newSet + " Poster";

    const setNumberListItem = card.querySelector('.setNumber');
    setNumberListItem.innerHTML = "<b>Set Number:</b> " + newSetNumber;

    const releaseDateListItem = card.querySelector('.cardRelease');
    releaseDateListItem.innerHTML = "<b>Release date: </b>" + newReleaseDate;

    const numberPiecesListItem = card.querySelector('.numberPieces');
    numberPiecesListItem.innerHTML = "<b>Piece Count: </b>"+newNumberPieces;

    const setTheme = card.querySelector('.setTheme');
    setTheme.innerHTML = "<b>Set Theme: </b>"+newSetTheme;

    console.log("new card:", newSet, "- html: ", card);
}


// document.addEventListener("DOMContentLoaded", function() {
//   showCards(1, 4);
// });
document.addEventListener("DOMContentLoaded", function() {
  getSets(); // Call getSets function to fetch data
});

function quoteAlert() {
    console.log("Button Clicked!")
    alert("I guess I can kiss heaven goodbye, because it got to be a sin to look this good!");
}

function prevPage() {
  const nextPageNumber = currentPageNumber - 5;
  if(nextPageNumber>= 0){
    showCards(nextPageNumber, 5);
  }
}

function nextPage() {
  const nextPageNumber = currentPageNumber + 5;
  showCards(nextPageNumber, 5);
}
