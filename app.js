// Create a global variable to tell us whether the user has voted
// The best_parade_photo_vote item is set in localStorage when the user votes on a photo
// When the user has not voted, userHasVoted will be null

let userHasVoted = localStorage.getItem("best_parade_photo_vote");


// Get a reference to the total votes ref
const totalVotesRef = database.ref('total_votes');


document.addEventListener("DOMContentLoaded", () => {

    totalVotesRef.once('value')
        .then(totalVotesSnapshot => {
            if (totalVotesSnapshot.val() === null) {
                totalVotesRef.set(0);
            }
        })


    // Static array of modern muscle cars
    const muscleCarPhotos = [{
            id: "ford_mustang_gt350r",
            name: "Ford Mustang GT350R ",
            srcUrl: "https://pictures.topspeed.com/IMG/crop_webp/201604/2016-ford-shelby-gt350r-m-3_1600x0.webp",
            altText: "2016 Ford Mustang 350R photo"

        },
        {
            id: "dodge_charger_srt_hellcat",
            name: "Dodge Charger SRT Hellcat",
            srcUrl: "https://pictures.topspeed.com/IMG/crop_webp/201408/2015-dodge-charger-srt-he-15_1600x0.webp",
            altText: "2015 Dodge Charger SRT Hellcat photo"
        },
        {
            id: "equus_bass_770",
            name: "Equus Bass 770",
            srcUrl: "https://pictures.topspeed.com/IMG/crop_webp/201309/equus-boss770-13_1600x0.webp",
            altText: "2014 Equus Bass 770 photo"
        },
        {
            id: "chevrolet_camaro_zl1",
            name: "Chevrolet Camaro ZL1",
            srcUrl: "https://pictures.topspeed.com/IMG/crop_webp/201603/2018-chevrolet-camaro-zl1-8_1600x0.webp",
            altText: "2018 Chevrolet Camaro ZL1 photo"
        },
        {
            id: "cadillac_ats-v_sedan",
            name: "Cadillac ATS-V Sedan",
            srcUrl: "https://pictures.topspeed.com/IMG/crop_webp/201501/2016-cadillac-ats-v-sedan-11_1600x0.webp",
            altText: "2016 Cadillac ATS-V Sedan photo"

        },
        {
            id: "dodge_challenger_srt",
            name: "Dodge Challenger SRT",
            srcUrl: "https://pictures.topspeed.com/IMG/crop_webp/201704/2018-dodge-challenger-srt-37_1600x0.webp",
            altText: "2018 Dodge Challenger SRT photo"
        }
    ];


    // Load parade photos for the first time and every time there is an update
    database.ref().on('value', () => {
        loadMuscleCarPhotos(muscleCarPhotos)
    })
});


/*
// To re-order photos by votes
database.ref('photos').on('value', (photosSnapshot) => {
    if (photosSnapshot === null) {
        // Use the original array with no votes
        loadParadePhotos(paradePhotos)
    } else {
        // photoVotes is an object with photo ids as keys
        const photosVotes = photosSnapshot.val()

        // Loop over the original array to add votes and sort them by votes
        const paradePhotosWithVotes = paradePhotos.map(photo => {
            return {
                ...photo,
                ...photosVotes[photo.id]
            }
        })

        paradePhotosWithVotes.sort((photo1, photo2) => photo2.votes - photo1.votes);
        loadParadePhotos(paradePhotosWithVotes)
    }
})
*/

const voteSubmit = (event, array) => {
    // Stop the click event from bubbling up
    event.stopPropagation();

    // Set best_parade_photo_vote in localstorage and indicate that the user has already voted
    localStorage.setItem('best_muscle_car_vote', 'voted');

    // userHasVoted = "voted";

    // click event current target is the .vote_btn
    // We gave .vote_btn the data attribute as the unique id in the paradePhotosArray so that we can easily look up the information of the clicked photo

    //Use jQuery to get the photo unique id from the click event current target
    const photoId = event.target.getAttribute('data-car');
    console.log(photoId);

    // Get the total number of votes once from Firebase and tell Firebase to increment that number by 1
    totalVotesRef.once('value')
        .then(totalVotesSnapshot => {
            const totalVotes = totalVotesSnapshot.val();
            totalVotesRef.set(totalVotes + 1)
        })
        .then(() => {
            // Get the photos/photoId ref's number of votes once from Firebase 
            return database.ref(`photos/${photoId}`).once('value');
        })

        .then(photoVotesSnapshot => {
            // Tell Firebase to increment the photo number of votes by 1

            const photoVotes = photoVotesSnapshot.val().votes;
            database.ref(`photos/${photoId}`).set({
                votes: photoVotes + 1
            })
        })
        .then(() => {

            // When Firebase has finished updating the votes, reload the parade photos
            loadMuscleCarPhotos(array);
        })

};

const loadMuscleCarPhotos = (photos) => {
    // Remove div#photos_container if we already have one
    const pContainer = document.querySelector('#photos_container');
    const container = document.querySelector('#container');

    if (pContainer.length !== 0) {
        pContainer.remove();
    }

    // Use jQuery to create div#photos_container
    const photosContainer = document.createElement('div');
    photosContainer.setAttribute('id', 'photos_container');
    photosContainer.setAttribute('class', 'row');


    photos.map((photo, index, array) => {
        const photoContainer = document.createElement('div');
        photoContainer.setAttribute('class', 'photo_container card col-md-4 p-3');

        const image = document.createElement('img');
        image.setAttribute('class', 'photo card-img-top');
        image.setAttribute('src', photo.srcUrl)
        image.setAttribute('alt', photo.altText);

        const photoName = document.createElement('h4');
        photoName.setAttribute('class', 'photo_name card-title my-3')
        photoName.innerText = photo.name;

        photoContainer.append(image, photoName);

        // Only show vote button if user has not voted yet
        if (!userHasVoted) {
            const voteBtn = document.createElement('button');
            voteBtn.setAttribute('class', 'btn btn-primary vote_btn');
            voteBtn.setAttribute('type', 'button');
            console.log(photo.id)
            voteBtn.setAttribute('data-car', `${photo.id}`);
            voteBtn.innerText = 'Vote';
            voteBtn.addEventListener('click', (e) => { 
                voteSubmit(e, array);
            });


            photoContainer.append(voteBtn);

            // Initialize firebase photos/photoId ref's votes to 0 if no one has voted on this photo before
            database.ref(`photos/${photo.id}`).once('value')
                .then(photoVotesSnapshot => {
                    if (photoVotesSnapshot.val() === null) {
                        database.ref(`photos/${photo.id}`).set({
                            votes: 0
                        });
                    }
                })
            // Otherwise show photo votes results
        } else {
            const votesResults = document.createElement('h5');
            votesResults.setAttribute('class', 'votes_results text-center card-subtitle mb-2 text-muted');

            // Get total votes and photo votes results from Firebase and use jQuery to add those votes results as text to votesResults
            totalVotesRef.once('value')
                .then(totalVotesSnapshot => {
                    const totalVotes = totalVotesSnapshot.val();

                    database.ref(`photos/${photo.id}`).once('value')
                        .then(photoVotesSnapshot => {
                            const photoVotes = photoVotesSnapshot.val().votes;
                            votesResults.innerText = `${photoVotes} out of ${totalVotes} votes`;
                        })
                })
            // Append votesResultsContainer to photoContainer
            photoContainer.append(votesResults)
        }
        photosContainer.append(photoContainer);
    })
    container.append(photosContainer);
};