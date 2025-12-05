"use client";

import { useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  useExtractions,
  DataComponent,
  FileComponent,
  ExtractionsList,
  ExtractionReviewer,
  ExtractionComponent,
  UploadJobsList,
} from "@retab/react";

type WidgetId = "data" | "file" | "list" | "reviewer" | "extraction" | "uploads";

interface Widget {
  id: WidgetId;
  name: string;
  component: string;
  description: string;
  category: "display" | "composite" | "list";
}

const widgets: Widget[] = [
  {
    id: "data",
    name: "DataComponent",
    component: "<DataComponent />",
    description: "Display and edit extracted data in form, table, or code view",
    category: "display",
  },
  {
    id: "file",
    name: "FileComponent",
    component: "<FileComponent />",
    description: "Preview documents with PDF rendering and field highlighting",
    category: "display",
  },
  {
    id: "list",
    name: "ExtractionsList",
    component: "<ExtractionsList />",
    description: "Browse extractions with search, filters, and pagination",
    category: "list",
  },
  {
    id: "reviewer",
    name: "ExtractionReviewer",
    component: "<ExtractionReviewer />",
    description: "Complete review interface with list, file preview, and data editor",
    category: "composite",
  },
  {
    id: "extraction",
    name: "ExtractionComponent",
    component: "<ExtractionComponent />",
    description: "Side-by-side file preview and data display with resizable panels",
    category: "composite",
  },
  {
    id: "uploads",
    name: "UploadJobsList",
    component: "<UploadJobsList />",
    description: "Upload files and track processing jobs",
    category: "list",
  },
];

const categories = [
  { id: "display", label: "Display Components" },
  { id: "composite", label: "Composite Components" },
  { id: "list", label: "List Components" },
] as const;

function WidgetRenderer({ widgetId }: { widgetId: WidgetId }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const projectId = process.env.NEXT_PUBLIC_RETAB_PROJECT_ID!;

  const { extractions } = useExtractions();
  const firstExtraction = extractions[0] ?? null;
  const extractionId = searchParams.get("extractionId") || firstExtraction?.id;

  const handleNavigate = useCallback(
    (params: { extractionId?: string }) => {
      const url = params.extractionId
        ? `/?widget=${widgetId}&extractionId=${params.extractionId}`
        : `/?widget=${widgetId}`;
      router.push(url);
    },
    [router, widgetId]
  );

  switch (widgetId) {
    case "data":
      return (
        <DataComponent
          extraction={firstExtraction}
          extractionDisplayOptions={{
            view: "form",
            showTabs: true,
            allowEditing: true,
          }}
        />
      );

    case "file":
      return (
        <FileComponent
          extraction={firstExtraction}
          fieldPath={null}
        />
      );

    case "list":
      return (
        <div className="flex flex-1 flex-col min-h-0 p-2">
          <ExtractionsList
            visibility={{
              statusColumn: true,
              dateColumn: true,
              search: true,
              displayPopover: true,
              filters: true,
            }}
          />
        </div>
      );

    case "reviewer":
      return (
        <ExtractionReviewer
          projectId={projectId}
          extractionId={extractionId}
          onNavigate={handleNavigate}
          visibility={{
            search: true,
            uploadButton: true,
            extractionDisplayOptions: {
              allowEditing: true,
              showTabs: true,
            },
          }}
        />
      );

    case "extraction":
      return (
        <ExtractionComponent
          extractionId={firstExtraction?.id}
          projectId={projectId}
          extractionDisplayOptions={{
            view: "form",
            allowEditing: true,
            showTabs: true,
          }}
        />
      );

    case "uploads":
      return <div className="flex flex-1 flex-col min-h-0 p-2"><UploadJobsList /></div>;

    default:
      return null;
  }
}

export default function WidgetsDemo() {
  const [selectedWidget, setSelectedWidget] = useState<WidgetId>("reviewer");
  const [expandedCategories, setExpandedCategories] = useState<string[]>([
    "display",
    "composite",
    "list",
  ]);

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const currentWidget = widgets.find((w) => w.id === selectedWidget)!;

  return (
    <div className="h-screen flex">
      {/* Sidebar */}
      <div className="w-72 border-r bg-gray-50 flex flex-col">
        <div className="p-4 border-b">
          <h1 className="text-lg font-semibold">Retab Widgets</h1>
          <p className="text-sm text-gray-500 mt-1">
            Interactive component demo
          </p>
        </div>

        <div className="flex-1 overflow-auto p-2">
          {categories.map((category) => {
            const categoryWidgets = widgets.filter(
              (w) => w.category === category.id
            );
            const isExpanded = expandedCategories.includes(category.id);

            return (
              <div key={category.id} className="mb-2">
                <button
                  onClick={() => toggleCategory(category.id)}
                  className="w-full flex items-center justify-between px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded"
                >
                  <span>{category.label}</span>
                  <svg
                    className={`w-4 h-4 transition-transform ${isExpanded ? "rotate-180" : ""
                      }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {isExpanded && (
                  <div className="mt-1 ml-2">
                    {categoryWidgets.map((widget) => (
                      <button
                        key={widget.id}
                        onClick={() => setSelectedWidget(widget.id)}
                        className={`w-full text-left px-3 py-2 text-sm rounded transition-colors ${selectedWidget === widget.id
                          ? "bg-indigo-100 text-indigo-700"
                          : "text-gray-600 hover:bg-gray-100"
                          }`}
                      >
                        <code className="text-xs">{widget.component}</code>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="p-4 border-t bg-white">
          <p className="text-xs text-gray-500">
            Import from{" "}
            <code className="text-indigo-600 bg-indigo-50 px-1 rounded">
              @retab/react
            </code>
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div className="border-b px-4 py-3 bg-white">
          <div className="flex items-center justify-between">
            <code className="text-indigo-600 font-mono text-sm">
              {currentWidget.component}
            </code>
            <p className="text-sm text-gray-500 mt-1">
              {currentWidget.description}
            </p>
          </div>
        </div>

        {/* Widget Preview */}
        <div className="flex-1 min-h-0 flex">
          <WidgetRenderer widgetId={selectedWidget} />
        </div>
      </div>
    </div>
  );
}