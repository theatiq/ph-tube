function getTimeString(time) {
    const hour = parseInt(time / 3600)
    let remainingSeconds = time % 3600
    const minute = parseInt(remainingSeconds / 60)
    remainingSeconds = remainingSeconds % 60
    return `${hour} hour ${minute} minute ${remainingSeconds} seconds ago`
}

const removeActiveClass = () => {
    const buttons = document.getElementsByClassName("category-btn")
    for (btn of buttons) {
        btn.classList.remove("active")
    }
}

const loadCatagories = () => {
    fetch("https://openapi.programming-hero.com/api/phero-tube/categories")
        .then(res => res.json())
        .then(data => displayCatagories(data.categories))
        .catch(error => console.log(error))
}
const loadVideos = (searchText= "") => {
    fetch(`https://openapi.programming-hero.com/api/phero-tube/videos?title=${searchText}`)
        .then(res => res.json())
        .then(data => displayVideos(data.videos))
        .catch(error => console.log(error))
}

const loadCategoryVideos = (id) => {
    // alert(id)
    fetch(`https://openapi.programming-hero.com/api/phero-tube/category/${id}`)
        .then(res => res.json())
        .then(data => {
            removeActiveClass()
            const activeBtn = document.getElementById(`btn-${id}`)
            activeBtn.classList.add("active")
            displayVideos(data.category)
        })
        .catch(error => console.log(error))
}

const loadDetails = async (videoId) => {
    const uri = `https://openapi.programming-hero.com/api/phero-tube/video/${videoId}`
    const res = await fetch(uri)
    const data = await res.json()
    displayDetails(data.video)
}

const displayDetails = (video) => {
    const detailContainer = document.getElementById("modal-content")

    detailContainer.innerHTML= `
    <img src= ${video.thumbnail}/>
    <p>${video.description}</p>
    `

    // document.getElementById("showModalData").click()
    document.getElementById("customModal").showModal()


}

const displayVideos = (videos) => {
    const videosContainer = document.getElementById("videos")
    videosContainer.innerHTML = ""
    if (videos.length == 0) {
        videosContainer.classList.remove("grid")
        videosContainer.innerHTML = `
        <div class="min-h-[600px] flex flex-col gap-5 justify-center items-center">
        <img src="/assets/Icon.png" />
        <h2 class="text-center text-xl font-bold">No content here in this category</h2>
        </div>
        `
        return
    } else {
        videosContainer.classList.add("grid")
    }



    videos.forEach((video) => {
        const card = document.createElement("div")
        card.classList = "card card-compact"
        card.innerHTML =
            `
            <figure class = "h-[200px] relative">
                <img
                class = "w-full h-full object-cover"
                src= ${video.thumbnail}
                alt="Shoes" />
                ${video.others.posted_date?.length == 0 ? "" : `<span class="absolute right-2 bottom-2 bg-black text-xs text-white rounded p-1">${getTimeString(video.others.posted_date)}</span>`}

            </figure>
            <div class="px-0 py-2 flex gap-2">
                <div>
                    <img class="w-10 h-10 rounded-full object-cover" src=${video.authors[0].profile_picture}/>
                </div>
                <div>
                    <h2 class="font-bold">${video.title}</h2>
                    <div class="flex items-center gap-2">
                        <p class="text-gray-400">${video.authors[0].profile_name}</p>

                        ${video.authors[0].verified === true ? `<img class="w-5" src="https://img.icons8.com/?size=48&id=p9jKUHLk5ejE&format=png"/>` : ""}
                        
                    </div>
                    <p><button onclick="loadDetails('${video.video_id}')" class="btn btn-sm btn-error">Details</button></p>
                </>
            </div>
        `
        videosContainer.append(card)

    })
}

const displayCatagories = (categories) => {
    const categoryContainer = document.getElementById("catagories")
    categories.forEach((item) => {
        console.log(item);
        const buttonContainer = document.createElement("div")
        buttonContainer.innerHTML = `
        <button id="btn-${item.category_id}" onclick = "loadCategoryVideos(${item.category_id})" class = "btn category-btn" >${item.category}</button>
        `
        categoryContainer.append(buttonContainer)

    })
}


document.getElementById("search-input").addEventListener("keyup", (e)=> {
    loadVideos(e.target.value)
})



loadCatagories()
loadVideos()