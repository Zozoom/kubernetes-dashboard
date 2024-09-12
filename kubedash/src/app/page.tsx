"use client";

import { useState, useMemo } from "react";
import {
  Search,
  Server,
  Check,
  XCircle,
  Power,
  Download,
  Database,
  RefreshCw,
  Lock,
  ArrowUpDown,
  Cpu,
  HardDrive,
  Activity,
  Cloud,
  ArrowDownToLine,
  ArrowUpToLine,
} from "lucide-react";

const serverDetails = {
  name: "Production Cluster",
  status: "Running",
  uptime: "15d 7h 23m",
  version: "v1.22.3",
  nodes: 5,
  services: [
    { name: "Database", status: "Up", icon: Database },
    { name: "Authorization", status: "Up", icon: Lock },
    { name: "Caching", status: "Down", icon: Server },
    { name: "Monitoring", status: "Up", icon: Activity },
    { name: "Storage", status: "Up", icon: Cloud },
  ],
};

const initialPods = [
  {
    id: 1,
    name: "web-server-1",
    cluster: "prod-east",
    status: "Running",
    cpu: "250m",
    memory: "512Mi",
    createdAt: "2023-06-01",
  },
  {
    id: 2,
    name: "database-1",
    cluster: "prod-west",
    status: "Running",
    cpu: "500m",
    memory: "1Gi",
    createdAt: "2023-05-28",
  },
  {
    id: 3,
    name: "cache-server",
    cluster: "prod-east",
    status: "Disconnected",
    cpu: "100m",
    memory: "256Mi",
    createdAt: "2023-06-02",
  },
  {
    id: 4,
    name: "auth-service",
    cluster: "prod-central",
    status: "Running",
    cpu: "200m",
    memory: "512Mi",
    createdAt: "2023-05-30",
  },
  {
    id: 5,
    name: "logging-agent",
    cluster: "prod-west",
    status: "Failed",
    cpu: "50m",
    memory: "128Mi",
    createdAt: "2023-06-03",
  },
  {
    id: 6,
    name: "monitoring-service",
    cluster: "prod-east",
    status: "Running",
    cpu: "150m",
    memory: "384Mi",
    createdAt: "2023-06-04",
  },
  {
    id: 7,
    name: "backup-service",
    cluster: "prod-central",
    status: "Running",
    cpu: "100m",
    memory: "256Mi",
    createdAt: "2023-06-05",
  },
  {
    id: 8,
    name: "load-balancer",
    cluster: "prod-west",
    status: "Running",
    cpu: "200m",
    memory: "512Mi",
    createdAt: "2023-06-06",
  },
  {
    id: 9,
    name: "message-queue",
    cluster: "prod-east",
    status: "Disconnected",
    cpu: "300m",
    memory: "768Mi",
    createdAt: "2023-06-07",
  },
  {
    id: 10,
    name: "data-processor",
    cluster: "prod-central",
    status: "Running",
    cpu: "400m",
    memory: "1Gi",
    createdAt: "2023-06-08",
  },
  {
    id: 11,
    name: "api-gateway",
    cluster: "prod-west",
    status: "Running",
    cpu: "250m",
    memory: "512Mi",
    createdAt: "2023-06-09",
  },
  {
    id: 12,
    name: "search-indexer",
    cluster: "prod-east",
    status: "Failed",
    cpu: "350m",
    memory: "896Mi",
    createdAt: "2023-06-10",
  },
];

const predefinedFilters = [
  { name: "All", filter: "", icon: Server },
  { name: "Database", filter: "database", icon: Database },
  { name: "Running", filter: "Running", icon: Check },
  { name: "Failed", filter: "Failed", icon: XCircle },
];

type SortConfig = {
  key: keyof (typeof initialPods)[0] | null;
  direction: "asc" | "desc";
};

export default function Component() {
  const [filter, setFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: null,
    direction: "asc",
  });
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date()); // Last update time initialized on page load
  const itemsPerPage = 10;
  const [isCollapsed, setIsCollapsed] = useState(true);

  const refreshData = () => {
    console.log("Refreshing data...");
    setLastUpdated(new Date());
    // Check if `window` is defined to ensure this is running in the browser
    if (typeof window !== "undefined") {
      window.location.reload(); // Reload the page only on the client
    }
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilter(e.target.value);
    setCurrentPage(1);
  };

  const handlePredefinedFilter = (predefinedFilter: string) => {
    setFilter(predefinedFilter);
    setCurrentPage(1);
  };

  const filteredPods = useMemo(() => {
    return initialPods.filter(
      (pod) =>
        pod.name.toLowerCase().includes(filter.toLowerCase()) ||
        pod.cluster.toLowerCase().includes(filter.toLowerCase()) ||
        pod.status.toLowerCase().includes(filter.toLowerCase())
    );
  }, [filter]);

  const sortedPods = useMemo(() => {
    const sortablePods = [...filteredPods];
    if (sortConfig.key !== null) {
      sortablePods.sort((a, b) => {
        if (a[sortConfig.key!] < b[sortConfig.key!]) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (a[sortConfig.key!] > b[sortConfig.key!]) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }
    return sortablePods;
  }, [filteredPods, sortConfig]);

  const statusCounts = useMemo(() => {
    return initialPods.reduce((acc, pod) => {
      acc[pod.status] = (acc[pod.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }, []);

  const paginatedPods = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedPods.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedPods, currentPage]);

  const pageCount = Math.ceil(sortedPods.length / itemsPerPage);

  const handleDownload = (podName: string) => {
    console.log(`Downloading log for ${podName}`);
  };

  const handleSort = (key: keyof (typeof initialPods)[0]) => {
    setSortConfig((prevConfig) => ({
      key,
      direction:
        prevConfig.key === key && prevConfig.direction === "asc"
          ? "desc"
          : "asc",
    }));
  };

  const handleSaveData = () => {
    // Combine the data you want to save
    const dataToSave = {
      serverDetails: {
        ...serverDetails,
        services: serverDetails.services.map((s) => ({
          name: s.name,
          status: s.status,
        })),
      },
      pods: initialPods,
    };

    // Convert the data to a JSON string
    const jsonString = JSON.stringify(dataToSave, null, 2); // 2 spaces for pretty formatting

    // Check if `document` is available
    if (typeof document !== "undefined") {
      // Create a blob from the JSON string
      const blob = new Blob([jsonString], { type: "application/json" });
      const url = URL.createObjectURL(blob);

      // Create a timestamp for the file name
      const timestamp = new Date().toISOString().replace(/[:.]/g, "-"); // Example: 2023-09-12T14-36-24

      // Create the download link with timestamped filename
      const link = document.createElement("a");
      link.href = url;
      link.download = `kubernetes_manager_data_${timestamp}.json`; // Filename with timestamp
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-8">
      <div className="container mx-auto space-y-8">
        {/* Server Details Card */}
        <div className="bg-white shadow-lg rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <Server className="h-6 w-6" /> Server Details
            </h2>
            <div className="flex items-center gap-4">
              {/* Only show lastUpdated time after it's set on the client */}
              {lastUpdated && (
                <p className="text-sm text-gray-500">
                  Last updated: {lastUpdated.toLocaleTimeString()}
                </p>
              )}
              <button
                onClick={handleSaveData}
                className="bg-blue-500 text-white px-4 py-2 rounded-md flex items-center gap-2"
              >
                <Download className="h-4 w-4" /> Save Data
              </button>
              {/* Refresh Button with Timer Dropdown */}
              <div className="relative">
                <button
                  className="bg-gray-500 text-white px-4 py-2 rounded-md flex items-center gap-2"
                  onClick={refreshData} // Manual refresh
                >
                  <RefreshCw className="h-4 w-4" /> Refresh
                </button>
              </div>
            </div>
          </div>

          {!isCollapsed && (
            /* Server Info */
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500 flex items-center gap-1">
                  <Server className="h-4 w-4" /> Name
                </p>
                <p className="text-lg font-semibold text-gray-800">
                  {serverDetails.name}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500 flex items-center gap-1">
                  <Activity className="h-4 w-4" /> Status
                </p>
                <span
                  className={`text-xs px-2 py-1 rounded-md ${
                    serverDetails.status === "Running"
                      ? "bg-green-100 text-green-600"
                      : "bg-red-100 text-red-600"
                  }`}
                >
                  {serverDetails.status}
                </span>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500 flex items-center gap-1">
                  <Power className="h-4 w-4" /> Uptime
                </p>
                <p className="text-lg font-semibold text-gray-800">
                  {serverDetails.uptime}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500 flex items-center gap-1">
                  <ArrowUpDown className="h-4 w-4" /> Version
                </p>
                <p className="text-lg font-semibold text-gray-800">
                  {serverDetails.version}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500 flex items-center gap-1">
                  <Server className="h-4 w-4" /> Nodes
                </p>
                <p className="text-lg font-semibold text-gray-800">
                  {serverDetails.nodes}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500 flex items-center gap-1">
                  <Activity className="h-4 w-4" /> Status
                </p>
                <span
                  className={`text-xs px-2 py-1 rounded-md ${
                    serverDetails.status === "Running"
                      ? "bg-green-100 text-green-600"
                      : "bg-red-100 text-red-600"
                  }`}
                >
                  {serverDetails.status}
                </span>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500 flex items-center gap-1">
                  <Power className="h-4 w-4" /> Uptime
                </p>
                <p className="text-lg font-semibold text-gray-800">
                  {serverDetails.uptime}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500 flex items-center gap-1">
                  <ArrowUpDown className="h-4 w-4" /> Version
                </p>
                <p className="text-lg font-semibold text-gray-800">
                  {serverDetails.version}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500 flex items-center gap-1">
                  <Server className="h-4 w-4" /> Nodes
                </p>
                <p className="text-lg font-semibold text-gray-800">
                  {serverDetails.nodes}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500 flex items-center gap-1">
                  <Server className="h-4 w-4" /> Nodes
                </p>
                <p className="text-lg font-semibold text-gray-800">
                  {serverDetails.nodes}
                </p>
              </div>
            </div>
          )}
          {
            !isCollapsed && (
            /* Services Section */
            <div className="mt-6 bg-gray-100 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <Activity className="h-5 w-5" /> Available Services
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {serverDetails.services.map((service, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg flex items-center justify-between ${
                      service.status === "Up" ? "bg-green-100" : "bg-red-100"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <service.icon
                        className={`h-5 w-5 ${
                          service.status === "Up"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      />
                      <span className="font-medium">{service.name}</span>
                    </div>
                    <span
                      className={`text-xs px-2 py-1 rounded-md ${
                        service.status === "Up"
                          ? "bg-green-100 text-green-600"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {service.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-6">
            <button
              className="font-medium text-gray-600 text-sm hover:text-blue-500"
              onClick={() => setIsCollapsed((prev) => !prev)}
            >
              {isCollapsed ? (
                <span className="flex items-center gap-2">
                  <ArrowDownToLine /> <span>Expand</span>
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <ArrowUpToLine /> <span>Collapse</span>
                </span>
              )}
            </button>
          </div>
        </div>
        {/* Worker Numbers Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center w-full mx-auto md:max-w-3xl">
          <div className="bg-green-100 p-4 rounded-lg shadow-md">
            <div className="flex justify-between items-center gap-4">
              <h4 className="text-sm font-medium text-green-800">
                Running Workers
              </h4>
              <Check className="h-5 w-5 text-green-600" />
            </div>
            <div className="text-3xl font-bold text-green-700 mt-2">
              {statusCounts.Running || 0}
            </div>
          </div>
          <div className="bg-red-100 p-4 rounded-lg shadow-md">
            <div className="flex justify-between items-center">
              <h4 className="text-sm font-medium text-red-800">
                Failing Workers
              </h4>
              <XCircle className="h-5 w-5 text-red-600" />
            </div>
            <div className="text-3xl font-bold text-red-700 mt-2">
              {statusCounts.Failed || 0}
            </div>
          </div>
          <div className="bg-gray-100 p-4 rounded-lg shadow-md">
            <div className="flex justify-between items-center">
              <h4 className="text-sm font-medium text-gray-800">
                Disconnected Workers
              </h4>
              <Power className="h-5 w-5 text-gray-600" />
            </div>
            <div className="text-3xl font-bold text-gray-700 mt-2">
              {statusCounts.Disconnected || 0}
            </div>
          </div>
        </div>

        {/* Pod List */}
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Server className="h-6 w-6" /> Kubernetes Pods
          </h2>
          <div className="flex items-center mb-4">
            <Search className="h-5 w-5 text-gray-500" />
            <input
              className="ml-2 w-full border border-gray-300 rounded-md p-2 focus:ring focus:ring-blue-200"
              type="text"
              placeholder="Filter pods..."
              value={filter}
              onChange={handleFilterChange}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-[repeat(auto-fit,minmax(100px,1fr))] max-w-3xl mx-auto gap-4 mb-6">
            {predefinedFilters.map((presetFilter, index) => (
              <button
                key={index}
                onClick={() => handlePredefinedFilter(presetFilter.filter)}
                className={`p-2 rounded-md flex items-center gap-2 border ${
                  filter === presetFilter.filter
                    ? "bg-blue-500 text-white"
                    : "bg-white text-gray-700 border-gray-300"
                }`}
              >
                <presetFilter.icon className="h-4 w-4" />
                {presetFilter.name}
              </button>
            ))}
          </div>
          <table className="table-auto w-full bg-white border rounded-md">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th
                  className="p-2 cursor-pointer"
                  onClick={() => handleSort("name")}
                >
                  <Server className="h-4 w-4 inline-block mr-1" /> Name{" "}
                  {sortConfig.key === "name" &&
                    (sortConfig.direction === "asc" ? "↑" : "↓")}
                </th>
                <th
                  className="p-2 cursor-pointer"
                  onClick={() => handleSort("cluster")}
                >
                  <Cloud className="h-4 w-4 inline-block mr-1" /> Cluster{" "}
                  {sortConfig.key === "cluster" &&
                    (sortConfig.direction === "asc" ? "↑" : "↓")}
                </th>
                <th
                  className="p-2 cursor-pointer"
                  onClick={() => handleSort("status")}
                >
                  <Activity className="h-4 w-4 inline-block mr-1" /> Status{" "}
                  {sortConfig.key === "status" &&
                    (sortConfig.direction === "asc" ? "↑" : "↓")}
                </th>
                <th
                  className="p-2 cursor-pointer"
                  onClick={() => handleSort("cpu")}
                >
                  <Cpu className="h-4 w-4 inline-block mr-1" /> CPU{" "}
                  {sortConfig.key === "cpu" &&
                    (sortConfig.direction === "asc" ? "↑" : "↓")}
                </th>
                <th
                  className="p-2 cursor-pointer"
                  onClick={() => handleSort("memory")}
                >
                  <HardDrive className="h-4 w-4 inline-block mr-1" /> Memory{" "}
                  {sortConfig.key === "memory" &&
                    (sortConfig.direction === "asc" ? "↑" : "↓")}
                </th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedPods.map((pod) => (
                <tr key={pod.id} className="hover:bg-gray-50">
                  <td className="p-2">{pod.name}</td>
                  <td className="p-2">{pod.cluster}</td>
                  <td className="p-2">
                    <span
                      className={`text-xs px-2 py-1 rounded-md ${
                        pod.status === "Running"
                          ? "bg-green-100 text-green-600"
                          : pod.status === "Failed"
                          ? "bg-red-100 text-red-600"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {pod.status}
                    </span>
                  </td>
                  <td className="p-2">{pod.cpu}</td>
                  <td className="p-2">{pod.memory}</td>
                  <td className="p-2">
                    <button
                      className="bg-gray-100 text-gray-600 px-4 py-1 rounded-md flex items-center gap-2"
                      onClick={() => handleDownload(pod.name)}
                    >
                      <Download className="h-4 w-4" />
                      Download Log
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-between items-center mt-4">
            <button
              className="bg-gray-200 text-gray-600 px-4 py-2 rounded-md"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            >
              Previous
            </button>
            <div className="text-gray-600">
              Page {currentPage} of {pageCount}
            </div>
            <button
              className="bg-gray-200 text-gray-600 px-4 py-2 rounded-md"
              disabled={currentPage === pageCount}
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, pageCount))
              }
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
