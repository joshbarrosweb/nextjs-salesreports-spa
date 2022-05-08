export interface DashboardData {
  products?: number;
  clients?: number;
  sales?: number;
  salesByMonth?: Array<SalesByMonth>;
}

export interface SalesByMonth {
  month?: number;
  value?: number;
}
