# 📺 Marvel Addon for Stremio

Watch the entire Marvel Catalog **chronological order**, **X-Men**, or explore by **movies**, **series**, and **animations**.

---

## Installation

Open your own instance at `https://your-domain.example/` to configure the catalogs and optionally use an RPDB key.

In **Stremio**:

1. Go to _Addons_ → _Community Addons_ → Search for Marvel

Or install directly via:  
🔗 [Addon Community Catalog - Marvel](https://stremio-addons.net/addons/marvel)

---

## Self-hosting

The addon is a stateless Deno service and can run on any VPS with Docker and Docker Compose.

1. Copy `.env.example` to `.env`.
2. Set `PUBLIC_URL` to the public HTTPS URL of your instance. `TMDB_API_KEY` is optional when `Data/metadataCache.json` contains all metadata.
3. Set `IMAGE_NAME` to the GHCR image created by the GitHub Actions workflow.
4. Connect the container to Traefik's external Docker network named `traefik` and point `DOMAIN` to the hostname.
5. Pull and start it with `docker compose pull && docker compose up -d`.

Cloudflare should proxy the hostname and use SSL/TLS mode **Full (strict)**. The `TRAEFIK_CERTRESOLVER=dns-cloudflare` setting tells Traefik to use its Cloudflare DNS challenge for the certificate. The `dns-cloudflare` resolver and its Cloudflare API token must be configured in the central Traefik stack. Traefik forwards HTTPS traffic to the container's internal port `7777`.

The workflow in `.github/workflows/docker-image.yml` builds the Docker image on every push to `main` and publishes it to GitHub Container Registry as `ghcr.io/<owner>/<repository>:latest`.

The catalog data and metadata cache are stored in the repository. Updating the catalog means updating those files and rebuilding the container. The service itself does not depend on the developer's server.

## About the Developer

Hey! I'm **joaogonp**, a newbie dev and Marvel fan. This is my first serious project — I built this addon to help fellow fans enjoy the MCU in the best possible way.

If you liked it and want to support me:  
🍺 [buymeacoffee.com/joaogonp](https://buymeacoffee.com/joaogonp) — feel free to buy me a beer!

---

## 📬 Feedback

This project is a work in progress — I’d love to hear your thoughts!  
Issues, suggestions, or questions? Open an issue or email me:  
📧 [jpnapsp@gmail.com](mailto:jpnapsp@gmail.com)

---

## 📜 License

This project is under the MIT License.
