
const rovers = document.querySelectorAll('input[name="rover"');
const cameras = document.querySelectorAll('input[name="camera"');

rovers.forEach(rover => rover.addEventListener('click', updateAvailableCameras));

const submitBtn = document.querySelector('#submit');
const img = document.querySelector('#image');
submitBtn.addEventListener('click', getAndSetImg);


function uacLogic(camArr, cams) {
    cams.forEach(cam => {
        if (camArr.includes(cam.id)) {
            cam.toggleAttribute('disabled', false);
        } else {
            cam.toggleAttribute('disabled', true);
            if (cam.checked) {
                cams[0].checked = true;
            }
        }
    });  
}

function updateAvailableCameras(e) {
    const curiosityCams = ['fhaz', 'rhaz', 'mast', 'chemcam', 'mahli', 'mardi', 'navcam']
    const otherCams = ['fhaz', 'rhaz', 'navcam', 'pancam', 'minites'];
    if (e.target.id == 'curiosity') {
        uacLogic(curiosityCams, cameras);
    } else if (e.target.id == 'opportunity' || e.target.id == 'spirit') {
        uacLogic(otherCams, cameras);
    }
} 


// return an array of [selectedRover, selectedCam]
function getFormData(camNodes, roverNodes) {
    const out = [];
    for (const i of roverNodes) {
        if (i.checked) out.push(i.id);
    }
    for (const i of camNodes) {
        if (i.checked) out.push(i.id);
    }
    return out;
}

function rng(max) {
    return Math.floor(Math.random() * max);
}

function getValidRandomDate(fetchData, formData) {
    const availableImgs = fetchData.photo_manifest.photos.filter(obj => obj.cameras.includes(formData[1].toUpperCase()));
    return availableImgs[rng(availableImgs.length)].earth_date;
}
function getAndSetImg(e) {
    const apiKey = 'WRCjAcGjNnqIp1c1BilHOqpYLCWcPHe5wdSZE18l';
    const formData = getFormData(cameras, rovers);
    

    const manifestLink = `https://api.nasa.gov/mars-photos/api/v1/manifests/${formData[0]}?api_key=${apiKey}`;
    let date = '';
    
    fetch(manifestLink)
    .then(res => res.json())
    .then(data => {
        date = getValidRandomDate(data, formData);console.log

        let imgFetchLink = `https://api.nasa.gov/mars-photos/api/v1/rovers/${formData[0]}/photos?earth_date=${date}&camera=${formData[1]}&api_key=${apiKey}`;
        fetch(imgFetchLink)
            .then(res => res.json())
            .then(data => {
                img.src = data.photos[rng(data.photos.length)].img_src;
            })
            .catch(err => console.log(`imgFetchLink error: ${err}`))

        })
        .catch(err => console.log(`error: ${err}`));
    

    
    
}

/*
fetch(link)
    .then(res => res.json())
    .then(data => {
        console.log(data);
        document.querySelector('img').src = data.photos[0].img_src;
    })
    .catch(err => console.log(`error: ${err}`));

const apiKey = 'WRCjAcGjNnqIp1c1BilHOqpYLCWcPHe5wdSZE18l'
const rovers = ['curiosity', 'opportunity', 'spirit'];



let link = `https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?sol=1000&api_key=${apiKey}`;
/*
fetch(link)
    .then(res => res.json())
    .then(data => {
        console.log(data);
        document.querySelector('img').src = data.photos[0].img_src;
    })
    .catch(err => console.log(`error: ${err}`));
*/