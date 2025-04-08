const db = require("../prisma/queries"); 
const { SitemapStream, streamToPromise } = require("sitemap");
const { Readable } = require("stream");

const createSitemap = async (req, res) => {
    try { 
        const posts = await db.findAllPublishedPosts(1, 1000); 

        const postLinks = posts.data.map(post => ({
            url: `/post/${post.slug}`,
            changefreq: 'weekly', 
            priority: 0.8, 
            lastmod: post.updated_ad || post.created_at,
        }))

        //static urls;
        const staticLinks = [
            {url: '/', changefreq: 'weekly', priority: 1.0},
            {url: '/posts', changefreq: 'weekly', priority: 0.9},
            {url: '/tags', changefreq: 'weekly', priority: 0.8},
            {url: '/about', changefreq: 'weekly', priority: 0.5}
        ]

        const allLinks = [...staticLinks, ...postLinks]; 

        const stream = new SitemapStream({hostname: 'https://coffeeshopcoding.dev'})

        res.header('content-type', 'application/xml'); 
        const xml = await streamToPromise(Readable.from(allLinks).pipe(stream)).then(data => data.toString()); 
        res.send(xml); 
        return; 
    } catch(err) { 
        console.error("Sitemap generation error:", err); 
        res.status(500).end(); 
        return;
    }
} 

module.exports = { 
    createSitemap
}