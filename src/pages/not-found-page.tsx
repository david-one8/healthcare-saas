import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <div className="max-w-md text-center">
        <h1 className="text-4xl font-bold">404</h1>
        <p className="mt-2 text-muted-foreground">The page you requested could not be found.</p>
        <Link to="/">
          <Button className="mt-4">Go home</Button>
        </Link>
      </div>
    </div>
  );
}