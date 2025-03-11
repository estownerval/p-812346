import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Rocket, Shield, Zap } from "lucide-react";

const features = [
  {
    title: "Lightning Fast",
    description:
      "Built with Vite for incredible development speed and optimized builds.",
    icon: Zap,
  },
  {
    title: "Type Safe",
    description:
      "Fully typed with TypeScript for better development experience and fewer bugs.",
    icon: Shield,
  },
  {
    title: "Production Ready",
    description:
      "Includes everything you need to build and deploy your application.",
    icon: Rocket,
  },
];

export function Features() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-50 dark:bg-gray-900">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-3 lg:gap-12">
          {features.map((feature, index) => (
            <Card key={index}>
              <CardHeader>
                <div className="flex items-center gap-4">
                  <feature.icon className="h-8 w-8" />
                  <CardTitle>{feature.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription>{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
