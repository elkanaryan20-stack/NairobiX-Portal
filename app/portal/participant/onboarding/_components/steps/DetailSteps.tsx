'use client';

import { useState } from 'react';
import { User, Building2, MapPin, Briefcase } from 'lucide-react';
import { Card, Button } from '@/components/ui/Card';
import { Input, Textarea } from '@/components/ui/Form';
import type { OnboardingApplication } from '@/lib/types';

interface StepProps {
  application: OnboardingApplication;
  updateApplication: (patch: Partial<OnboardingApplication>) => void;
  onContinue: () => void;
}

function StepShell({
  icon,
  title,
  description,
  children,
  onContinue,
  canContinue,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  children: React.ReactNode;
  onContinue: () => void;
  canContinue: boolean;
}) {
  return (
    <Card className="p-6">
      <div className="mb-6 flex items-start gap-3">
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-neutral-100 text-neutral-500">
          {icon}
        </div>
        <div>
          <h3 className="text-lg font-semibold text-neutral-900">{title}</h3>
          <p className="text-sm text-neutral-500">{description}</p>
        </div>
      </div>
      <div className="space-y-4">{children}</div>
      <div className="mt-6 flex justify-end border-t border-neutral-100 pt-5">
        <Button variant="primary" onClick={onContinue} disabled={!canContinue}>
          Save &amp; Continue
        </Button>
      </div>
    </Card>
  );
}

export function PartnerDetailsStep({ application, updateApplication, onContinue }: StepProps) {
  const [details, setDetails] = useState(application.partnerDetails);
  const canContinue = !!(details.fullName && details.email && details.phone);

  return (
    <StepShell
      icon={<User size={18} />}
      title="Partner Details"
      description="Tell us who we'll be working with."
      onContinue={() => {
        updateApplication({ partnerDetails: details });
        onContinue();
      }}
      canContinue={canContinue}
    >
      <div>
        <label className="mb-1.5 block text-sm font-medium text-neutral-900">Full name</label>
        <Input
          value={details.fullName}
          onChange={(e) => setDetails({ ...details, fullName: e.target.value })}
          placeholder="e.g. Daniel Mutiso"
        />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-neutral-900">Email</label>
          <Input
            type="email"
            value={details.email}
            onChange={(e) => setDetails({ ...details, email: e.target.value })}
            placeholder="you@business.co.ke"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-neutral-900">Phone</label>
          <Input
            value={details.phone}
            onChange={(e) => setDetails({ ...details, phone: e.target.value })}
            placeholder="+254 7XX XXX XXX"
          />
        </div>
      </div>
    </StepShell>
  );
}

export function BusinessInfoStep({ application, updateApplication, onContinue }: StepProps) {
  const [info, setInfo] = useState(application.businessInfo);
  const canContinue = !!(info.businessName && info.businessDescription);

  return (
    <StepShell
      icon={<Building2 size={18} />}
      title="Business Information"
      description="What does your business do?"
      onContinue={() => {
        updateApplication({ businessInfo: info });
        onContinue();
      }}
      canContinue={canContinue}
    >
      <div>
        <label className="mb-1.5 block text-sm font-medium text-neutral-900">Business name</label>
        <Input
          value={info.businessName}
          onChange={(e) => setInfo({ ...info, businessName: e.target.value })}
        />
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-medium text-neutral-900">Business description</label>
        <Textarea
          rows={4}
          value={info.businessDescription}
          onChange={(e) => setInfo({ ...info, businessDescription: e.target.value })}
          placeholder="Describe what your business does and who it serves."
        />
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-medium text-neutral-900">
          Website <span className="font-normal text-neutral-400">(optional)</span>
        </label>
        <Input
          value={info.website ?? ''}
          onChange={(e) => setInfo({ ...info, website: e.target.value })}
          placeholder="www.yourbusiness.co.ke"
        />
      </div>
    </StepShell>
  );
}

export function LocationStep({ application, updateApplication, onContinue }: StepProps) {
  const [location, setLocation] = useState(application.location);
  const canContinue = !!(location.city && location.address);

  return (
    <StepShell
      icon={<MapPin size={18} />}
      title="Location"
      description="Where do you operate from?"
      onContinue={() => {
        updateApplication({ location });
        onContinue();
      }}
      canContinue={canContinue}
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-neutral-900">City / Town</label>
          <Input
            value={location.city}
            onChange={(e) => setLocation({ ...location, city: e.target.value })}
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-neutral-900">Address</label>
          <Input
            value={location.address}
            onChange={(e) => setLocation({ ...location, address: e.target.value })}
          />
        </div>
      </div>
    </StepShell>
  );
}

export function ExperienceStep({ application, updateApplication, onContinue }: StepProps) {
  const [experience, setExperience] = useState(application.experience);
  const canContinue = !!(experience.background && experience.clientNetwork);

  return (
    <StepShell
      icon={<Briefcase size={18} />}
      title="Experience & Background"
      description="Help NairobiX understand your track record."
      onContinue={() => {
        updateApplication({ experience });
        onContinue();
      }}
      canContinue={canContinue}
    >
      <div>
        <label className="mb-1.5 block text-sm font-medium text-neutral-900">Years of experience</label>
        <Input
          type="number"
          min={0}
          value={experience.yearsExperience}
          onChange={(e) => setExperience({ ...experience, yearsExperience: Number(e.target.value) })}
          className="max-w-[10rem]"
        />
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-medium text-neutral-900">Background</label>
        <Textarea
          rows={3}
          value={experience.background}
          onChange={(e) => setExperience({ ...experience, background: e.target.value })}
        />
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-medium text-neutral-900">Client network</label>
        <Textarea
          rows={3}
          value={experience.clientNetwork}
          onChange={(e) => setExperience({ ...experience, clientNetwork: e.target.value })}
          placeholder="Describe the businesses or contacts you regularly engage with."
        />
      </div>
    </StepShell>
  );
}
