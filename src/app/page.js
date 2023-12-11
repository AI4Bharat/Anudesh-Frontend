import Link from "next/link"

export default function Home() {
  return (
    <main>
      <h1>Anudesh</h1>
      <h3><Link href="/organizations">Organization</Link></h3>
      <h3><Link href="/login">Login</Link></h3>
      <h3><Link href="/invite/500">Sign-Up</Link></h3>
      <h3><Link href="/forgot-password">Forgot Password</Link></h3>
      <h3><Link href="/dataset">Dataset</Link></h3>
      <h3><Link href="/projects">Projects</Link></h3>
      <h3><Link href="/change-password">Change Password</Link></h3>
      <h3><Link href="/profile">My Profile</Link></h3>
      <h3><Link href="/progress">My Progress</Link></h3>
    </main>
  )
}  