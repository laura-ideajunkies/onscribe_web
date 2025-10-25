import { Shield, FileCheck, TrendingUp, Lock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function ValuePropositionSidebar() {
  const features = [
    {
      icon: Shield,
      title: 'Creative Ownership',
      description: 'Your stories, your rights. Every piece you publish is time-stamped and verifiably yours.',
    },
    {
      icon: FileCheck,
      title: 'Trust & Transparency',
      description: 'No hidden platforms or permissions - your work can\'t be silently altered or claimed by others.',
    },
    {
      icon: TrendingUp,
      title: 'Beautiful Simplicity',
      description: 'Write in a clean, distraction-free editor designed for flow and focus.',
    },
    {
      icon: Lock,
      title: 'Proof, Not Paperwork',
      description: 'Copyright protection without the forms and delays - your content is instantly registered.',
    },
  ];

  return (
    <Card className="sticky top-6 glass-card">
      <CardHeader>
        <CardTitle className="text-2xl">
          Why Creators Use OnScribe
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <p className="text-muted-foreground italic">
          OnScribe feels like writing in your favourite notebook - only smarter.
        </p>

        <div className="space-y-3">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div key={feature.title} className="glass-feature">
                <div className="flex gap-3">
                  <div className="flex-shrink-0 mt-1">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm mb-1">
                      {feature.title}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="pt-4 border-t border-purple-100">
          <p className="text-sm text-muted-foreground">
            Every idea is quietly protected as you publish, so you can share freely knowing your authorship is safe.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
