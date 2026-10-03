import { redirect } from "next/navigation";

export default function HomePage() {
  redirect("/ai-operations?tab=workflow");
}
