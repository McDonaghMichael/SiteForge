
export function getTime(){
    let date = new Date();
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
}

export function getPages(pages) {
    if (!pages || pages.length === 0) {
        return "<p>No pages available</p>";
    }

    let pagesList = '<ul class="pages-list">';
    pages.forEach(page => {
        pagesList += `<li>
            <a href="/${page.slug}">
                <span>${page.title}</span>
            </a>
        </li>`;
    });
    pagesList += '</ul>';

    return pagesList;
}

export function getPosts(posts) {
    if (!posts || posts.length === 0) {
        return "<p>No posts available</p>";
    }

    let postsList = '<ul class="posts-list">';
    posts.forEach(post => {
        const date = new Date(post.updated_date || Date.now());
        const formattedDate = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;

        postsList += `<li>
            <a href="/posts/${post.slug}">
                <span>${post.title}</span>
                <br>
                <span class="post-date">${formattedDate}</span>
            </a>
        </li>`;
    });
    postsList += '</ul>';

    return postsList;
}