import { Button } from "../ui/button";
import Link from "next/link";
export default function Feedback() {
  return (
    <Button asChild variant="link">
      <Link href="https://eoe6o38s8t3.typeform.com/to/Pqwa7gv3" target="_blank">
        Help us with feedback (3 questions)
      </Link>
    </Button>
  );
}
