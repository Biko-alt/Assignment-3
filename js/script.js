/* =========================================
   LEAGUE OF LEGENDS CHAMPION DASHBOARD

   API:
   Riot Games Data Dragon

   This JavaScript file:
   - Connects to the API
   - Retrieves champion information
   - Dynamically creates champion cards
   - Adds the student's information
   - Provides searching
   - Provides role filtering
   - Provides sorting
   ========================================= */


/* =========================================
   STUDENT INFORMATION
========================================= */

const STUDENT_NAME = "Biko Nyambaka";

const STUDENT_ID = "200651414";


/*
    Find the paragraph in index.html
    and dynamically insert the information.
*/

const studentInfo =
    document.querySelector("#student-info");

studentInfo.textContent =
    `Student: ${STUDENT_NAME} | Student ID: ${STUDENT_ID}`;


/* =========================================
   API CONFIGURATION
========================================= */

/*
    Data Dragon provides League of Legends
    champion data and artwork.

    First, we retrieve the current game version.
    This prevents us from hard-coding an old
    League of Legends patch number.
*/

const VERSION_URL =
    "https://ddragon.leagueoflegends.com/api/versions.json";


/*
    This variable will hold the URL for
    the champion data after the current
    version is retrieved.
*/

let CHAMPION_API_URL = "";


/*
    Champion artwork uses the same version
    number as the champion data.
*/

let IMAGE_BASE_URL = "";


/* =========================================
   HTML ELEMENT REFERENCES
========================================= */

const championContainer =
    document.querySelector("#champion-container");

const statusMessage =
    document.querySelector("#status-message");

const championCount =
    document.querySelector("#champion-count");

const averageDifficulty =
    document.querySelector("#average-difficulty");

const mostDifficult =
    document.querySelector("#most-difficult");

const searchInput =
    document.querySelector("#search-input");

const roleSelect =
    document.querySelector("#role-select");

const sortSelect =
    document.querySelector("#sort-select");


/* =========================================
   DATA STORAGE
========================================= */

/*
    All champions returned from the API
    are stored here.
*/

let champions = [];


/* =========================================
   GET CURRENT LEAGUE VERSION
========================================= */

async function getCurrentVersion() {

    try {

        /*
            Send a GET request to Data Dragon
            to retrieve all available versions.
        */

        const response =
            await fetch(VERSION_URL);


        /*
            Make sure the request succeeded.
        */

        if (!response.ok) {

            throw new Error(
                `HTTP error: ${response.status}`
            );

        }


        /*
            Convert the response into JSON.
        */

        const versions =
            await response.json();


        /*
            The first version is the newest
            available version.
        */

        const currentVersion =
            versions[0];


        /*
            Build the URLs needed for the
            champion API and champion images.
        */

        CHAMPION_API_URL =
            `https://ddragon.leagueoflegends.com/cdn/${currentVersion}/data/en_US/champion.json`;

        IMAGE_BASE_URL =
            `https://ddragon.leagueoflegends.com/cdn/${currentVersion}/img/champion/`;


        /*
            Now retrieve the actual champion data.
        */

        await getChampions();

    }

    catch (error) {

        console.error(
            "Version API Error:",
            error
        );

        statusMessage.textContent =
            "Unable to connect to League of Legends Data Dragon.";

    }

}


/* =========================================
   GET CHAMPION DATA
========================================= */

async function getChampions() {

    try {

        statusMessage.textContent =
            "Loading League of Legends champions...";


        /*
            Send a request to the champion API.
        */

        const response =
            await fetch(CHAMPION_API_URL);


        /*
            Check whether the request succeeded.
        */

        if (!response.ok) {

            throw new Error(
                `HTTP error: ${response.status}`
            );

        }


        /*
            Convert the API response to JSON.
        */

        const data =
            await response.json();


        /*
            The API returns champions inside
            the "data" object.

            Object.values() converts the object
            into an array.
        */

        champions =
            Object.values(data.data);


        /*
            Update the dashboard statistics.
        */

        updateSummary();


        /*
            Display the champion cards.
        */

        displayChampions();


        /*
            Tell the user that the request
            was successful.
        */

        statusMessage.textContent =
            `Successfully loaded ${champions.length} League of Legends champions.`;

    }

    catch (error) {

        console.error(
            "Champion API Error:",
            error
        );

        statusMessage.textContent =
            "Unable to load champion data. Please try again later.";

    }

}


/* =========================================
   UPDATE DASHBOARD SUMMARY
========================================= */

function updateSummary() {

    /*
        Display the number of champions.
    */

    championCount.textContent =
        champions.length;


    /*
        Calculate the average difficulty.
    */

    const totalDifficulty =
        champions.reduce(
            (total, champion) =>
                total + champion.info.difficulty,
            0
        );


    const average =
        totalDifficulty /
        champions.length;


    averageDifficulty.textContent =
        `${average.toFixed(1)} / 10`;


    /*
        Find the champion with the highest
        difficulty rating.
    */

    const difficultChampion =
        [...champions].sort(
            (a, b) =>
                b.info.difficulty -
                a.info.difficulty
        )[0];


    if (difficultChampion) {

        mostDifficult.textContent =
            difficultChampion.name;

    }

}


/* =========================================
   DISPLAY CHAMPIONS
========================================= */

function displayChampions() {

    /*
        Create a copy of the original
        champion array.

        This allows us to filter and sort
        without permanently changing
        the original API data.
    */

    let displayedChampions =
        [...champions];


    /* =====================================
       SEARCH
    ====================================== */

    const searchTerm =
        searchInput.value
            .toLowerCase()
            .trim();


    /*
        Filter champions according to
        the user's search.
    */

    if (searchTerm !== "") {

        displayedChampions =
            displayedChampions.filter(
                champion =>

                    champion.name
                        .toLowerCase()
                        .includes(searchTerm)

                    ||

                    champion.title
                        .toLowerCase()
                        .includes(searchTerm)

            );

    }


    /* =====================================
       ROLE FILTER
    ====================================== */

    const selectedRole =
        roleSelect.value;


    /*
        If "all" is selected, don't filter.
    */

    if (selectedRole !== "all") {

        displayedChampions =
            displayedChampions.filter(
                champion =>
                    champion.tags
                        .map(tag =>
                            tag.toLowerCase()
                        )
                        .includes(selectedRole)
            );

    }


    /* =====================================
       SORTING
    ====================================== */

    const sortValue =
        sortSelect.value;


    if (sortValue === "name") {

        displayedChampions.sort(
            (a, b) =>
                a.name.localeCompare(b.name)
        );

    }


    else if (sortValue === "difficulty") {

        displayedChampions.sort(
            (a, b) =>
                b.info.difficulty -
                a.info.difficulty
        );

    }


    else if (sortValue === "attack") {

        displayedChampions.sort(
            (a, b) =>
                b.info.attack -
                a.info.attack
        );

    }


    else if (sortValue === "defense") {

        displayedChampions.sort(
            (a, b) =>
                b.info.defense -
                a.info.defense
        );

    }


    else if (sortValue === "magic") {

        displayedChampions.sort(
            (a, b) =>
                b.info.magic -
                a.info.magic
        );

    }


    /* =====================================
       CLEAR OLD RESULTS
    ====================================== */

    championContainer.innerHTML = "";


    /* =====================================
       NO RESULTS
    ====================================== */

    if (displayedChampions.length === 0) {

        championContainer.innerHTML = `

            <p>
                No champions match your search.
            </p>

        `;

        return;

    }


    /* =====================================
       CREATE CHAMPION CARDS
    ====================================== */

    displayedChampions.forEach(
        champion => {

            const card =
                createChampionCard(champion);

            championContainer.appendChild(card);

        }
    );

}


/* =========================================
   CREATE CHAMPION CARD
========================================= */

function createChampionCard(champion) {

    /*
        Create an article element
        for the champion card.
    */

    const card =
        document.createElement("article");


    card.classList.add(
        "champion-card"
    );


    /*
        Get the champion's image.

        Data Dragon stores the champion
        image using the champion's image
        filename.
    */

    const imageURL =
        `${IMAGE_BASE_URL}${champion.image.full}`;


    /*
        Store the champion's statistics.
    */

    const attack =
        champion.info.attack;

    const defense =
        champion.info.defense;

    const magic =
        champion.info.magic;

    const difficulty =
        champion.info.difficulty;


    /*
        Create the role tags.

        Each champion can have multiple
        gameplay classifications.
    */

    const roleTags =
        champion.tags
            .map(
                tag =>
                    `<span class="role-tag">${tag}</span>`
            )
            .join("");


    /*
        Create the HTML for the champion card.
    */

    card.innerHTML = `

        <div class="champion-image-container">

            <img
                class="champion-image"
                src="${imageURL}"
                alt="${champion.name}"
                loading="lazy"
            >

            <div class="image-overlay">

                <strong>
                    ${champion.name}
                </strong>

            </div>

        </div>


        <div class="champion-content">

            <h2 class="champion-name">
                ${champion.name}
            </h2>


            <p class="champion-title">
                ${champion.title}
            </p>


            <div class="roles">

                ${roleTags}

            </div>


            <!-- Attack -->

            <div class="stat-row">

                <span>
                    Attack
                </span>

                <span class="stat-value">
                    ${attack}/10
                </span>

            </div>

            <div class="stat-bar-background">

                <div
                    class="stat-bar"
                    style="width: ${attack * 10}%"
                ></div>

            </div>


            <!-- Defense -->

            <div class="stat-row">

                <span>
                    Defense
                </span>

                <span class="stat-value">
                    ${defense}/10
                </span>

            </div>

            <div class="stat-bar-background">

                <div
                    class="stat-bar"
                    style="width: ${defense * 10}%"
                ></div>

            </div>


            <!-- Magic -->

            <div class="stat-row">

                <span>
                    Magic
                </span>

                <span class="stat-value">
                    ${magic}/10
                </span>

            </div>

            <div class="stat-bar-background">

                <div
                    class="stat-bar"
                    style="width: ${magic * 10}%"
                ></div>

            </div>


            <!-- Difficulty -->

            <div class="stat-row">

                <span>
                    Difficulty
                </span>

                <span class="stat-value">
                    ${difficulty}/10
                </span>

            </div>

            <div class="stat-bar-background">

                <div
                    class="stat-bar"
                    style="width: ${difficulty * 10}%"
                ></div>

            </div>

        </div>

    `;


    return card;

}


/* =========================================
   SEARCH EVENT
========================================= */

/*
    Rebuild the champion cards whenever
    the user types into the search field.
*/

searchInput.addEventListener(
    "input",
    displayChampions
);


/* =========================================
   ROLE FILTER EVENT
========================================= */

roleSelect.addEventListener(
    "change",
    displayChampions
);


/* =========================================
   SORT EVENT
========================================= */

sortSelect.addEventListener(
    "change",
    displayChampions
);


/* =========================================
   START APPLICATION
========================================= */

/*
    Begin by finding the newest available
    League of Legends version.
*/

getCurrentVersion();