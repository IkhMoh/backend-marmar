## Marmer Backend (Express + JavaScript)

Simple Instagram-like backend for **Marmer**, built with **Express** and **JavaScript**.

### Features

- **Entities**: users, posts, comments, stories, suggestions.
- **Posts CRUD**:
  - `POST /posts` – create post with media (uploads to Cloudinary).
  - `GET /posts` – list posts.
  - `GET /posts/:id` – show single post.
  - `DELETE /posts/:id` – delete post.
- **Comments**:
  - `POST /posts/:id/comments` – add a comment to a post.
- **Stories**:
  - `GET /stories` – list stories.
  - `POST /stories` – create a story with media.
- **Users**:
  - `GET /users` – list users.
  - `GET /users/:id` – show single user.
  - `GET /users/:id/posts` – posts by a specific user.
- **Suggestions**:
  - `GET /suggestions` – list suggested users.
- **No authentication** – all endpoints are public.
- **Tags** – posts include a `tags` array; tags are static/controlled from the frontend only.
- **Media** – images/videos are uploaded to **Cloudinary**; only URLs are stored.
- **Seed data** – loaded from JSON files in the `data/` folder.

### Setup

1. Install dependencies:

```bash
npm install
```

2. Configure Cloudinary credentials (recommended via environment variables):

```bash
export CLOUDINARY_CLOUD_NAME=your_cloud_name
export CLOUDINARY_API_KEY=your_api_key
export CLOUDINARY_API_SECRET=your_api_secret
```

3. Start the server:

```bash
npm start
```

The API will run on `http://localhost:3000`.
# backend-marmar
