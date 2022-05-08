import { useState, useEffect } from "react";

import { Card } from "primereact/card";
import { Chart } from "primereact/chart";

import { SalesByMonth } from "../../models/dashboard";
import { MONTHS } from "../../util/months";

interface DashboardProps {
  clients?: number;
  products: number;
  sales?: number;
  salesByMonth?: SalesByMonth[];
}

export const Dashboard: React.FC<DashboardProps> = ({
  clients,
  products,
  sales,
  salesByMonth,
}) => {
  const [chartData, setChartData] = useState({});

  const loadChartData = () => {
    const labels: string[] = salesByMonth?.map((mv) => MONTHS[mv.month - 1]);
    const values = salesByMonth?.map((mv) => mv.value);

    const chartInfo = {
      labels: labels,
      datasets: [
        {
          label: "Monthly Value",
          backgroundColor: "#42A5F5",
          data: values,
        },
      ],
    };

    setChartData(chartInfo);
  };

  useEffect(loadChartData, []);

  const productsCardStyle = {
    background: "red",
    color: "white",
  };

  const clientsCardStyle = {
    background: "blue",
    color: "white",
  };

  const salesCardStyle = {
    background: "green",
    color: "white",
  };

  return (
    <div className="p-fluid">
      <div className="p-grid">
        <div className="p-col">
          <Card title="Products" style={productsCardStyle}>
            <p className="p-m-0">{products}</p>
          </Card>
        </div>

        <div className="p-col">
          <Card title="Clients" style={clientsCardStyle}>
            <p className="p-m-0">{clients}</p>
          </Card>
        </div>

        <div className="p-col">
          <Card title="Sales" style={salesCardStyle}>
            <p className="p-m-0">{sales}</p>
          </Card>
        </div>
      </div>
      <div className="p-grid">
        <Chart
          type="bar"
          data={chartData}
          style={{ position: "relative", width: "100%" }}
        />
      </div>
    </div>
  );
};
