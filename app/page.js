import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function Home() {
  return (
    <div>
      <h1>Home</h1>
      <Button>Click here!</Button>
      <Image src="/login_side_image.jpg" alt="Logo" width={100} height={100} className="text-purple-950"/>
    </div>
  );
}
