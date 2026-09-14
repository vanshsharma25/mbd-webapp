import Link from "next/link";

export default function Home() {
  return <main style={{ maxWidth: 800, margin: "100px auto", padding: 24 }}>
    <p style={{ color: "#32bf8a", fontWeight: 700 }}>MBD PLATFORM</p>
    <h1 style={{ fontSize: 48 }}>Mechanism simulation without enterprise overhead.</h1>
    <p>Build, simulate, and share early mechanical designs in a browser.</p>
    <Link className="button" href="/workspace/demo">Open demo workspace</Link>
  </main>;
}
