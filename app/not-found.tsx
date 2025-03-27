import { Button } from "@/components/button"

export default function NotFound() {
  return (
    <div className="notfound">
      <h2>Not Found</h2>
      <p>Could not find requested resource</p>
      <Button href="/">Return Dashboard</Button>
    </div>
  )
}
