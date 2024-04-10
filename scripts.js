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
              console.log(ParsedList)
              fetch('./themes.csv')
                  .then(response => {
                      if (!response.ok) {
                          throw new Error('ERROR FETCHING THEMES CSV');
                      }
                      return response.text();
                  })
                  .then(categoriesCsvData => {
                      CategoriesList = parseCategoriesCSV(categoriesCsvData);
                      showCards(1, 10);
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

let currentPageNumber = 1; 

function showCards(pageNumber, pageSize) {
  const cardContainer = document.getElementById("card-container");
  cardContainer.innerHTML = "";
  const templateCard = document.querySelector(".card");

  const startIndex = (pageNumber - 1) * pageSize;
  const endIndex = startIndex + pageSize;

  const setsToShow = ParsedList.slice(startIndex, endIndex);

  setsToShow.forEach((set) => {
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
}

document.addEventListener("DOMContentLoaded", function() {
  getSets(); 
});

function prevPage() {
  const prevPageNumber = currentPageNumber - 1;
  if(prevPageNumber>=1){
    showCards(prevPageNumber, 10);
  }
  else{
    alert("START OF CATALOG")
  }
}

function nextPage() {
  const nextPageNumber = currentPageNumber + 1;
  if(nextPageNumber<=21){
    showCards(nextPageNumber, 10);
  }
  else{
    alert("END OF CATALOG")

  }
}

function sortSetsByDateAscending() {
  ParsedList.sort((a, b) => a.releaseDate - b.releaseDate);
  showCards(currentPageNumber, 10); // Call showCards to display the sorted sets
}
function sortSetsByDateDescending() {
  ParsedList.sort((a, b) => b.releaseDate - a.releaseDate);
  showCards(currentPageNumber, 10); // Call showCards to display the sorted sets
}