const searchBtn = document.getElementById("search-btn");
const resultContainer = document.getElementById("results-container");
const searchBar = document.getElementById("search-bar");
const detailsContainer = document.getElementById("details-container")

document.addEventListener("DOMContentLoaded", fetchOnPageLoad);
searchBtn.addEventListener("click", fetchOnSearch);
searchBar.addEventListener("keydown", (event)=>{
    if (event.key === "Enter"){
        fetchOnSearch();
    }
})


//function to send the user to the link when click on view recipe button
function playVideo (link){
    window.open(link);
}

//whats loaded when the DOM is initially laoded
async function fetchOnPageLoad(){
    try{
        resultContainer.style.display = "grid"
        let i = 0;
        let noDupe = [];
        let cardsArr = []; //This array is to save all the html element and display them all at once later
        while (i < 15){
            const response = await fetch("https://www.themealdb.com/api/json/v1/1/random.php");
            if (!response.ok){
                throw new Error("Could not fetch resource");
            }


            const data = await response.json();
            const meal = data.meals[0];
            const mealId = meal.idMeal;
            if (noDupe.includes(mealId)){
                continue;
            } else{
                noDupe.push(mealId);
                i++;
            }
            const mealName = meal.strMeal;
            const thumbnail = meal.strMealThumb;
            const link = meal.strYoutube;

            cardsArr.push(`
                <div class="card">
                    <p class="meal-name">${mealName}</p>
                    <img class="meal-img" src="${thumbnail}">
                    <button class="video-btn" onclick="playVideo('${link}')">View Recipe</button>
                </div>`)
        }
        resultContainer.innerHTML = cardsArr.join('');
    }

    catch(error){
        console.error(error);
    }
}

//whats loaded when the search has been made
async function fetchOnSearch(){
    resultContainer.innerHTML = "";
    resultContainer.style.display = "block";
    try{
        const inputVal = document.getElementById("search-bar").value.toLowerCase();
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${inputVal}`)

        if (!response.ok){
            throw new Error("Could not fetch resource")
        }

        const data = await response.json();
        if (!data.meals){ //in case the menu does not exist
            fetchOnPageLoad();
            alert("The Recipe for this food does not exist in our database");
            return
        }

        const meal = data.meals[0]
        const mealId = meal.idMeal;

        //adding a video directly into the resultContainer frame as well as two span for ingredients + instructions to be added
        const videoId = meal.strYoutube.split("v=")[1].split("&")[0];
        const embedLink = `https://www.youtube.com/embed/${videoId}`
        
        resultContainer.innerHTML = `
            
            <div class="vid-wrapper">
                <iframe class="meal-video" src="${embedLink}" allowfullscreen></iframe>
            </div>
            <div class="rest-wrapper"> 
                <span id="instruction-wrapper">
                    <h2>Instructions</h2>
                </span>
                <span id="ingredients-wrapper">
                    <h2>Ingredients</h2>
                </span>
            </div>
        `


        const instructions = meal.strInstructions;
    
        //forloop to store all VALID ingredients in a new array
        let ingredientsArr = []
        for (let i = 1; i <= 20; i++){
            const ingredient = meal[`strIngredient${i}`]
            if (!ingredient || ingredient === ""){
                continue;
            } 
            ingredientsArr.push(`${ingredientsArr.length + 1}. ${ingredient} <br>`)
        }
        
        const instructionWrapper = document.getElementById("instruction-wrapper");
        const ingredientsWrapper = document.getElementById("ingredients-wrapper");
        instructionWrapper.innerHTML += instructions.replace(/\n\r?/g, "<br>"); //regex to replace the line breaks
        ingredientsWrapper.innerHTML += ingredientsArr.join("")

    }

    catch(error){
        console.error(error)
    }

}