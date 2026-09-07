'use client';

import { StaffLayout } from '@/components/layout/StaffLayout';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Form';
import { Download, Eye } from 'lucide-react';
import { useState } from 'react';

export default function StaffDocuments() {
  const [searchTerm, setSearchTerm] = useState('');

  const mockDocuments = [
    {
      id: 'doc1',
      name: 'Partnership Agreements',
      type: 'folder',
      docs: 12,
    },
    {
      id: 'doc2',
      name: 'Client Proposals',
      type: 'folder',
      docs: 28,
    },
    {
      id: 'doc3',
      name: 'Financial Reports',
      type: 'folder',
      docs: 8,
    },
    {
      id: 'doc4',
      name: 'Q1 2024 Performance Report.pdf',
      type: 'file',
      date: '2024-03-10',
      size: '2.4 MB',
    },
    {
      id: 'doc5',
      name: 'Partner Commission Schedule.xlsx',
      type: 'file',
      date: '2024-03-08',
      size: '156 KB',
    },
  ];

  return (
    <StaffLayout
      pageTitle="Documents"
      pageSubtitle="Access shared documents and organizational files"
    >
      <div className="mb-6">
        <Input
          placeholder="Search documents..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="space-y-3">
        {mockDocuments.map((doc) => (
          <Card key={doc.id} hover className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 flex-1">
                <span className="text-2xl">
                  {doc.type === 'folder' ? '📁' : '📄'}
                </span>
                <div>
                  <p className="font-medium text-neutral-900">{doc.name}</p>
                  {doc.type === 'folder' && (
                    <p className="text-xs text-neutral-600">{doc.docs} files</p>
                  )}
                  {doc.type === 'file' && (
                    <p className="text-xs text-neutral-600">
                      {doc.date} • {doc.size}
                    </p>
                  )}
                </div>
              </div>

              {doc.type === 'file' && (
                <div className="flex gap-2">
                  <button className="p-2 hover:bg-neutral-100 rounded-lg">
                    <Eye size={16} className="text-neutral-600" />
                  </button>
                  <button className="p-2 hover:bg-neutral-100 rounded-lg">
                    <Download size={16} className="text-neutral-600" />
                  </button>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>
    </StaffLayout>
  );
}
