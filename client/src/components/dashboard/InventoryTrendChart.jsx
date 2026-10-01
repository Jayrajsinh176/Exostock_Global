import { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { MdTrendingUp, MdPieChart, MdLoop, MdInfoOutline } from 'react-icons/md';
import { getStockMovementAnalysis, getCategoryPerformanceAnalysis, getReorderPatternsAnalysis, AuthService, } from '../../api';
import { isPlanAtLeast } from '../../constants/plans';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const InventoryTrendChart = () => {
  const [activeAnalysis, setActiveAnalysis] = useState('stock-movement');
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const company = AuthService.getCompany();
  // All three analyses (stock movement, category performance, reorder
  // patterns) are Business-and-above, matching the server's plan checks.
  const canAccessAnalytics = isPlanAtLeast(company?.plan, "Business");

  useEffect(() => {
    if (!canAccessAnalytics) return;
    fetchData(activeAnalysis);
  }, [activeAnalysis, canAccessAnalytics]);

  const fetchData = async (analysisType) => {
    try {
      setLoading(true);
      setError(null);
      let response;

      switch (analysisType) {
        case 'category-performance':
          response = await getCategoryPerformanceAnalysis();
          break;
        case 'reorder-patterns':
          response = await getReorderPatternsAnalysis();
          break;
        case 'stock-movement':
        default:
          response = await getStockMovementAnalysis();
      }

      if (response.success) {
        setChartData(response);
      } else {
        setError(response.message || 'Failed to fetch analysis data');
      }
  } catch (err) {
  if (
    err.message?.includes("Analytics is available only")
  ) {
    setError("UPGRADE_REQUIRED");
  } else {
    console.error("Chart data error:", err);
    setError(err.message || "Failed to load chart data");
  }
} finally {
      setLoading(false);
    }
  };

  const getTitleAndDescription = () => {
    switch (activeAnalysis) {
      case 'category-performance':
        return {
          title: 'Category Performance',
          description: 'Inventory value distribution across categories',
          icon: MdPieChart,
        };
      case 'reorder-patterns':
        return {
          title: 'Reorder Patterns',
          description: 'Frequency of product reorders over time',
          icon: MdLoop,
        };
      case 'stock-movement':
      default:
        return {
          title: 'Stock Movement Analysis',
          description: 'Units sold and fulfillment metrics over the last 6 months',
          icon: MdTrendingUp,
        };
    }
  };

  const getFooterNote = () => {
    if (!chartData) return '';

    switch (activeAnalysis) {

      case 'category-performance':
        return `Total categories: ${chartData.totalCategoriesAnalyzed || 0} | Total inventory value: $${(chartData.totalInventoryValue || 0).toLocaleString('en-US')}`;
      case 'stock-movement':
        return `Total products analyzed: ${chartData.totalProductsAnalyzed || 0} | Total inventory value: $${(chartData.totalInventoryValue || 0).toLocaleString('en-US')}`;
      case 'reorder-patterns':
        return `Average reorder frequency: ${chartData.avgReorderFrequency || 0}/month | Low stock items: ${chartData.currentLowStockItems || 0}`;
      default:
        return '';
    }
  };

  // Empty State Component
  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center h-64 text-center">
      <div className="w-16 h-16 bg-[#F8F9FA] rounded-full flex items-center justify-center mb-4">
        <MdInfoOutline className="text-[32px] text-[#6C757D]" />
      </div>
      <h4 className="text-[16px] font-semibold text-[#212529] mb-2">No Data Available</h4>
      <p className="text-[14px] text-[#6C757D] max-w-sm">
        {activeAnalysis === 'category-performance'
          ? 'Add products to categories to see performance metrics.'
          : 'Add products and track inventory to see analytics data.'}
      </p>
    </div>
  );

  // Chart configurations
  const getChartConfig = () => {
    if (!chartData?.data || chartData.data.length === 0) return null;

    const data = chartData.data;
    const colors = ['#007BFF', '#28A745', '#FFC107', '#DC3545', '#6C757D', '#17A2B8', '#6610F2', '#E83E8C'];

    if (activeAnalysis === 'category-performance') {
      // A doughnut can't draw slices when every category's value is 0 — it
      // just renders an empty circle with a legend, which looks broken.
      // A flat zero line/bar (stock movement, reorder patterns) is still a
      // meaningful, correct thing to show, so this check is scoped here only.
      const hasNonZeroValue = data.some((d) => (d.actualValue || d.value || 0) > 0);
      if (!hasNonZeroValue) return null;

      // Doughnut Chart for Category Performance
      return {
        type: 'doughnut',
        data: {
          labels: data.map(d => d.category || 'Unknown'),
          datasets: [{
            data: data.map(d => d.actualValue || d.value || 0),
            backgroundColor: colors.slice(0, data.length),
            borderColor: '#ffffff',
            borderWidth: 3,
            hoverBorderWidth: 4,
            hoverOffset: 8,
          }],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: '65%',
          plugins: {
            legend: {
              position: 'right',
              labels: {
                usePointStyle: true,
                pointStyle: 'circle',
                padding: 20,
                font: { size: 12, family: 'system-ui' },
                color: '#212529',
              },
            },
            tooltip: {
              backgroundColor: '#212529',
              titleColor: '#ffffff',
              bodyColor: '#ffffff',
              padding: 12,
              cornerRadius: 8,
              displayColors: true,
              callbacks: {
                label: (context) => {
                  const value = context.raw || 0;
                  const total = context.dataset.data.reduce((a, b) => a + b, 0);
                  const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
                  return `$${value.toLocaleString('en-US')} (${percentage}%)`;
                },
              },
            },
          },
        },
      };
    }

    // Line/Bar Chart for Stock Movement and Reorder Patterns
    const isStockMovement = activeAnalysis === 'stock-movement';

    return {
      type: isStockMovement ? 'line' : 'bar',
      data: {
        labels: data.map(d => d.month || 'N/A'),
        datasets: [{
          label: isStockMovement ? 'Units Sold' : 'Reorder Count',
          data: data.map(d => d.actualUnits || d.value || 0),
          backgroundColor: isStockMovement
            ? 'rgba(0, 123, 255, 0.1)'
            : 'rgba(0, 123, 255, 0.8)',
          borderColor: '#007BFF',
          borderWidth: isStockMovement ? 3 : 0,
          borderRadius: isStockMovement ? 0 : 6,
          fill: isStockMovement,
          tension: 0.4,
          pointBackgroundColor: '#007BFF',
          pointBorderColor: '#ffffff',
          pointBorderWidth: 2,
          pointRadius: 5,
          pointHoverRadius: 7,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: 'index',
          intersect: false,
        },
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            backgroundColor: '#212529',
            titleColor: '#ffffff',
            bodyColor: '#ffffff',
            padding: 12,
            cornerRadius: 8,
            displayColors: false,
            callbacks: {
              title: (context) => context[0].label,
              label: (context) => {
                const value = context.raw || 0;
                return isStockMovement
                  ? `${value.toLocaleString()} units sold`
                  : `${value} reorders`;
              },
            },
          },
        },
        scales: {
          x: {
            grid: {
              display: false,
            },
            ticks: {
              color: '#6C757D',
              font: { size: 12 },
            },
          },
          y: {
            beginAtZero: true,
            grid: {
              color: '#F1F3F5',
              drawBorder: false,
            },
            ticks: {
              color: '#6C757D',
              font: { size: 12 },
              padding: 10,
            },
          },
        },
      },
    };
  };

  const renderChart = () => {
    const config = getChartConfig();
    if (!config) return <EmptyState />;

    if (activeAnalysis === 'category-performance') {
      return (
        <div className="h-64">
          <Doughnut data={config.data} options={config.options} />
        </div>
      );
    }

    if (activeAnalysis === 'stock-movement') {
      return (
        <div className="h-64">
          <Line data={config.data} options={config.options} />
        </div>
      );
    }

    return (
      <div className="h-64">
        <Bar data={config.data} options={config.options} />
      </div>
    );
  };

  const { title, description, icon: Icon } = getTitleAndDescription();

 if (!canAccessAnalytics || error === "UPGRADE_REQUIRED") {
  return (
    <div className="bg-white rounded-lg border border-[#DEE2E6] p-8 shadow-md mb-8">
      <div className="text-center">
        <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-yellow-100 flex items-center justify-center">
          <MdTrendingUp className="text-3xl text-yellow-600" />
        </div>

        <h2 className="text-2xl font-bold text-[#212529] mb-2">
          Analytics Locked
        </h2>

        <p className="text-[#6C757D] mb-6">
          Upgrade to the <strong>Business</strong> plan to access
          stock movement, category performance and reorder pattern analytics.
        </p>

        <button
          onClick={() => window.location.href = "/subscription"}
          className="px-6 py-3 bg-[#007BFF] text-white rounded-lg font-semibold hover:bg-[#0056b3]"
        >
          Upgrade Plan
        </button>
      </div>
    </div>
  );
}

if (error) {
    return (
      <div className="bg-white rounded-lg border border-[#DEE2E6] p-6 shadow-md mb-8 mt-4">
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-[#FEE2E2] rounded-full flex items-center justify-center mx-auto mb-4">
            <MdInfoOutline className="text-[32px] text-[#DC3545]" />
          </div>
          <p className="text-[#DC3545] font-semibold mb-4">Error: {error}</p>
          <button
            onClick={() => fetchData(activeAnalysis)}
            className="px-4 py-2 bg-[#007BFF] text-white rounded-lg hover:bg-[#0056b3] transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-[#DEE2E6] p-6 shadow-md mb-8">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#E7F3FF] rounded-lg flex items-center justify-center">
            <Icon className="text-[20px] text-[#007BFF]" />
          </div>
          <div>
            <h3 className="text-[18px] font-semibold text-[#212529]">{title}</h3>
            <p className="text-[14px] text-[#6C757D]">{description}</p>
          </div>
        </div>
      </div>

      {/* Analysis Toggle Buttons */}
      <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2 mb-6 border-b border-[#DEE2E6] pb-4">
        <button
          onClick={() => setActiveAnalysis('stock-movement')}
          className={`whitespace-nowrap px-3 sm:px-4 py-2 text-[12px] sm:text-[13px] font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 sm:gap-2 ${activeAnalysis === 'stock-movement'
            ? 'bg-[#007BFF] text-white shadow-sm'
            : 'bg-[#F8F9FA] text-[#212529] border border-[#DEE2E6] hover:bg-[#E9ECEF]'
            }`}
        >
          <MdTrendingUp className="text-[16px]" />
          Stock Movement
        </button>
        <button
         disabled={false}

onClick={() => setActiveAnalysis("category-performance")}
          className={`whitespace-nowrap px-3 sm:px-4 py-2 text-[12px] sm:text-[13px] font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 sm:gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${activeAnalysis === "category-performance"
            ? "bg-[#007BFF] text-white shadow-sm"
            : "bg-[#F8F9FA] text-[#212529] border border-[#DEE2E6] hover:bg-[#E9ECEF]"
            }`}
        >
          <MdPieChart className="text-[16px]" />
          Category Performance
        </button>
        <button
          onClick={() => setActiveAnalysis("reorder-patterns")}
          className={`col-span-2 sm:col-span-1 whitespace-nowrap px-3 sm:px-4 py-2 text-[12px] sm:text-[13px] font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 sm:gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${activeAnalysis === "reorder-patterns"
              ? "bg-[#007BFF] text-white shadow-sm"
              : "bg-[#F8F9FA] text-[#212529] border border-[#DEE2E6] hover:bg-[#E9ECEF]"
            }`}
        >
          <MdLoop className="text-[16px]" />
          Reorder Patterns
        </button>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex flex-col items-center justify-center h-64">
          <div className="animate-spin mb-4">
            <div className="w-12 h-12 border-4 border-[#DEE2E6] border-t-[#007BFF] rounded-full"></div>
          </div>
          <p className="text-[14px] text-[#6C757D]">Loading chart data...</p>
        </div>
      ) : (
        <>
          {/* Chart Container */}
          <div className="px-2">
            {renderChart()}
          </div>

          {/* Legend/Note */}
          <div className="mt-6 pt-4 border-t border-[#F1F3F5]">
            <p className="text-[12px] text-[#6C757D] text-center">{getFooterNote()}</p>
          </div>
        </>
      )}
    </div>
  );
};

export default InventoryTrendChart;
