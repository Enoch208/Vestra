import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const META_DIR = join(__dirname, "../metadata");
const PINATA = "https://api.pinata.cloud/pinning";
const GATEWAY = "https://gateway.pinata.cloud/ipfs";

async function pinFile(data: Uint8Array, filename: string, name: string, jwt: string): Promise<string> {
  const form = new FormData();
  form.append("file", new Blob([new Uint8Array(data)]), filename);
  form.append("pinataMetadata", JSON.stringify({ name }));
  const res = await fetch(`${PINATA}/pinFileToIPFS`, {
    method: "POST",
    headers: { Authorization: `Bearer ${jwt}` },
    body: form,
  });
  if (!res.ok) throw new Error(`Pinata file pin failed: ${await res.text()}`);
  return ((await res.json()) as { IpfsHash: string }).IpfsHash;
}

async function pinJSON(content: object, name: string, jwt: string): Promise<string> {
  const res = await fetch(`${PINATA}/pinJSONToIPFS`, {
    method: "POST",
    headers: { Authorization: `Bearer ${jwt}`, "Content-Type": "application/json" },
    body: JSON.stringify({ pinataContent: content, pinataMetadata: { name } }),
  });
  if (!res.ok) throw new Error(`Pinata JSON pin failed: ${await res.text()}`);
  return ((await res.json()) as { IpfsHash: string }).IpfsHash;
}

export async function buildAndPinMetadata(jwt: string): Promise<{ uri: string; image: string }> {
  const logo = readFileSync(join(META_DIR, "vestra-logo.png"));
  const image = `${GATEWAY}/${await pinFile(new Uint8Array(logo), "vestra-logo.png", "vestra-agent-logo", jwt)}`;

  const metadata = JSON.parse(readFileSync(join(META_DIR, "vestra-agent.json"), "utf-8")) as {
    image?: string;
    [k: string]: unknown;
  };
  metadata.image = image;

  const uri = `ipfs://${await pinJSON(metadata, "vestra-agent-metadata", jwt)}`;
  return { uri, image };
}
