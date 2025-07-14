
 🤖 Shadow Poster Agent

Shadow Poster is an AI-powered social media publishing agent built for the Nosana Mastra AI Agent Challenge. It watches a blog’s RSS feed, generates smart captions using a local or remote LLM, and auto-posts to Instagram and Facebook via the Meta Graph API — all autonomously.



 🧠 Agent Purpose

> Automate social content creation and publishing from any RSS feed to Instagram and Facebook. This agent was inspired because, as a  blogger, It is time consuming to also manage social media activities to push the contents of my blog. It is also expensive to hire a social media manager.

 Core Workflow:
1. User provides an RSS feed URL.
2. Agent fetches the latest post.
3. Captions are generated for Facebook and Instagram.
4. The post is published using the Meta Graph API.
5. Success and post IDs are returned.

---

 ⚙️ Setup Instructions

 1. Clone the project

```bash
git clone https://github.com/mahwii04/agent-challenge.git
cd agent-challenge

2. Install dependencies
pnpm install

If you don’t have pnpm, install it globally with:
 npm install -g pnpm

🔐 Required Environment Variables
Create a .env file in the root directory with the following content:
 Meta API Access
META_FB_PAGE_ID=YOUR_FACEBOOK_PAGE_ID
META_IG_USER_ID=YOUR_INSTAGRAM_USER_ID
META_ACCESS_TOKEN=YOUR_PAGE_ACCESS_TOKEN

 Optional Model config
MODEL_NAME_AT_ENDPOINT=qwen2.5:1.5b
API_BASE_URL=https://YOUR_MODEL_PROVIDER_URL/api

You can also create .env.docker if you're using Docker for deployment.

🐳 Docker: Build & Run
1. Build the Docker image
docker build -t yourusername/agent-challenge:latest .

2. Run the container
docker run -p 8080:8080 --env-file .env yourusername/agent-challenge:latest

Visit: http://localhost:8080 to interact with the agent.

📥 Example Usage
When the agent is deployed and running, you can interact with it via the chat interface.
Example input:
{
  "feedUrl": "https://yourblog.com/rss.xml"
}
Or in chat interface, just send your blog rss fed url

The agent will:
Parse your latest blog post


Generate captions for Instagram and Facebook


Post them via the Meta Graph API


Example success response:
{
  "success": true,
  "fbPostId": "101570132309698_200123456789",
  "igPostId": "17912345678901234"
}


🛠 Tech Stack
🧠 Mastra AI Agent Framework


📦 TypeScript + Zod


🪄 Remote LLM via Ollama API


📡 Facebook Graph API v20.0


🐳 Docker for containerization


⚡ PNPM for fast dependency management



📣 Credits
Built by @mahwii04 for the Nosana AI Agent Challenge.

🔐 Notes
Ensure your Meta access token has required permissions for pages_manage_posts, pages_read_engagement, instagram_basic, instagram_content_publish.


Your FB Page must be linked to a professional Instagram account.

🧠 FUTURE IMPLEMENTATIONS
- Monetization to fuel agent with $NOS or subscription based system
- X (formerly twitter) implementation.
- Use video gen LLMs to create automatic video summary of blog posts for Youtube Shorts, Tiktok content. Since virality has a format, I am sure the Agent can be tailored to make 75% viral content.
- Auto use of templates from canva as image to be posted on social media. i.e Design templates could be made, in the context of a sports blogger, templates for Pre-match review, post-match review, transfer news, Breaking news or League related templates could be made on canva; the agent pulls any template with the knowledge of context from the blog post and auto fill the template to have a ready-to-post design.


