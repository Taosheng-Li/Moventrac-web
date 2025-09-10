import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/components/utils/cn";

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 py-16">
      <div className="max-w-3xl text-center">
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
          Moventrac · Smart Fitness Tracking
        </h1>
        <p className="mt-4 text-lg text-gray-600">
          Connect your device, track every workout, and see your trends.
        </p>
        <div className="mt-8 flex items-center justify-center gap-4 flex-wrap">
          <Link href="/login">
            <Button>Log In</Button>
          </Link>
          <Link href="/register">
            <Button variant="outline">Sign Up</Button>
          </Link>
          <a
            href="/download/moventrac-latest.apk"
            download
            className={cn(buttonVariants({ variant: "outline" }))}
          >
            Download APK
          </a>
        </div>
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6">
          <Feature
            title="Real-time Sync"
            desc="See your mobile workouts in the cloud"
          />
          <Feature
            title="Trend Insights"
            desc="Accuracy, duration, and speed charts at a glance"
          />
          <Feature title="Privacy & Security" desc="JWT-based secure access" />
        </div>
      </div>
    </main>
  );
}

function Feature({ title, desc }: { title: string; desc: string }) {
  return (
    <Card className="p-5">
      <h3 className="font-semibold">{title}</h3>
      <p className="mt-1 text-sm text-gray-600">{desc}</p>
    </Card>
  );
}
