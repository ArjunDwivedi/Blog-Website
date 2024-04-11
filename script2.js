let subheading = document.getElementById("Sub-heading");
let form = document.querySelector("form");
let blogContainer = document.querySelector(".container");
let blogCount = 0;

async function fetchBlogPosts() {
    try {
        let response = await axios.get('https://crudcrud.com/api/7bb246a558dc48bd83cc7aeed9c15973/blogPost');
        return response.data;
    } catch (error) {
        console.error('Failed to fetch blog posts:', error);
        return [];
    }
}


function renderBlogPosts(posts) {
    console.log(posts);
    blogContainer.innerHTML = '';
    posts.forEach(post => {
        blogContainer.innerHTML += `
            <div class="blog-post">
                <h3>${post['title-text']}</h3>
                <img src="${post['image-url']}">
                <p>${post['blog-content']}</p>
                <button class="edit-btn" data-id="${post._id}">Edit</button>
                <button class="delete-btn" data-id="${post._id}">Delete</button>
            </div>
        `;
    });
    blogCount = posts.length;
    subheading.querySelector("#blogcount").textContent = blogCount;
}

async function handleSubmit(event) {
    event.preventDefault();
    let formData = new FormData(form);
    let postData = Object.fromEntries(formData);
    try {
        await axios.post('https://crudcrud.com/api/7bb246a558dc48bd83cc7aeed9c15973/blogPost', postData);
        await initialize();
        form.reset();
    } catch (error) {
        console.error('Failed to post blog:', error);
    }
}

async function handleDelete(postId) {
    try {
        await axios.delete(`https://crudcrud.com/api/7bb246a558dc48bd83cc7aeed9c15973/blogPost/${postId}`);
        await initialize(); 
    } catch (error) {
        console.error('Failed to delete blog post:', error);
    }
}
async function handleEdit(postId) {
    try {
        let data = await axios.get(`https://crudcrud.com/api/7bb246a558dc48bd83cc7aeed9c15973/blogPost/${postId}`);
        await initialize();
        console.log("data",data);
        console.log(data.data);
        const postData = data.data;
        document.getElementById("title-text").value = postData["title-text"];
        document.getElementById("image-url").value = postData["image-url"];
        document.getElementById("blog-content").value = postData["blog-content"];
        await axios.delete(`https://crudcrud.com/api/7bb246a558dc48bd83cc7aeed9c15973/blogPost/${postId}`);
        await initialize(); 
    } catch (error) {
        console.error('Failed to delete blog post:', error);
    }
}
form.addEventListener('submit', handleSubmit);
blogContainer.addEventListener('click', async (event) => {
    let target = event.target;
    let postId = target.getAttribute('data-id');
    if (target.classList.contains('edit-btn')) {
        await handleEdit(postId);
    } else if (target.classList.contains('delete-btn')) {
        await handleDelete(postId);
    }
});

async function initialize() {
    const posts = await fetchBlogPosts();
    console.log("posts",posts);
    renderBlogPosts(posts);
}

initialize();
