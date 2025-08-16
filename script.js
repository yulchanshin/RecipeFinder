document.addEventListener("DOMContentLoaded", fetchOnPageLoad)


const resultContainer = document.getElementById("results-container");

function playVideo (link){
    window.open(link)
}



async function fetchOnPageLoad(){

    try{
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