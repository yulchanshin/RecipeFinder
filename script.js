document.addEventListener("DOMContentLoaded", fetchOnPageLoad)


const resultContainer = document.getElementById("results-container");

function playVideo (link){
    window.open(link)
}

async function fetchOnPageLoad(){

    try{
        const response = await fetch("https://www.themealdb.com/api/json/v1/1/random.php");
        if (!response.ok){
            throw new Error("Could not fetch resource");
        }

        const data = await response.json();
        const meal = data.meals[0]
        const mealName = meal.strMeal;
        const thumbnail = meal.strMealThumb;
        const link = meal.strYoutube
         resultContainer.innerHTML += `
            <div class="card">
                <p class="meal-name">${mealName}</p>
                <img class="meal-img" src="${thumbnail}">
                <button class="video-btn" onclick="playVideo('${link}')">View Recipe</button>
            </div>
`
    }

    catch(error){
        console.error(error);
    }
}