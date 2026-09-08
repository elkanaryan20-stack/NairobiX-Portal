'use client';

import { StaffLayout } from '@/components/layout/StaffLayout';
import { Card } from '@/components/ui/Card';
import { Input, EmptyState } from '@/components/ui/Form';
import { Download, Eye, Folder, FileText } from 'lucide-react';
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

      <div className="space-y-2">
        {mockDocuments
          .filter((doc) => doc.name.toLowerCase().includes(searchTerm.toLowerCase()))
          .map((doc) => (
          <Card key={doc.id} hover className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex flex-1 items-center gap-3">
                <div
                  className={
                    doc.type === 'folder'
                      ? 'flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary-600'
                      : 'flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-neutral-100 text-neutral-500'
                  }
                >
                  {doc.type === 'folder' ? <Folder size={18} /> : <FileText size={18} />}
                </div>
                <div>
                  <p className="text-sm font-medium text-neutral-900">{doc.name}</p>
                  {doc.type === 'folder' && (
                    <p className="text-xs text-neutral-500">{doc.docs} files</p>
                  )}
                  {doc.type === 'file' && (
                    <p className="text-xs text-neutral-500">
                      {doc.date} · {doc.size}
                    </p>
                  )}
                </div>
              </div>

              {doc.type === 'file' && (
                <div className="flex gap-1">
                  <button className="rounded-lg p-2 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900" aria-label="Preview document">
                    <Eye size={16} />
                  </button>
                  <button className="rounded-lg p-2 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900" aria-label="Download document">
                    <Download size={16} />
                  </button>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>

      {mockDocuments.filter((doc) => doc.name.toLowerCase().includes(searchTerm.toLowerCase())).length === 0 && (
        <EmptyState icon={<FileText />} title="No documents found" description="Try a different search term." />
      )}
    </StaffLayout>
  );
}
