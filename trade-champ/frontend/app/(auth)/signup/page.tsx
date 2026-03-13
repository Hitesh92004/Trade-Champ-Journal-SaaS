import Image from "next/image";
import { Button, Card, Input } from "@/components/ui";

export default function SignupPage() {
  return (
    <Card className="mx-auto max-w-md space-y-4">
      <div className="flex flex-col items-center gap-3">
        <Image src="/logo.png" alt="Trade Champ" width={100} height={100} className="h-auto w-20" />
        <h1 className="text-2xl font-bold">Create your account</h1>
      </div>
      <Input placeholder="Email" type="email" />
      <Input placeholder="Password" type="password" />
      <Input placeholder="Confirm password" type="password" />
      <Button className="w-full">Sign up</Button>
    </Card>
  );
}
