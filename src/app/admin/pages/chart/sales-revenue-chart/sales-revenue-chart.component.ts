    // import {Component, ViewChild} from '@angular/core';
    // import {ChartData, ChartDataset, ChartOptions, ChartType} from "chart.js";
    // import {AdminService} from "../../../services/admin.service";
    // import {BaseChartDirective} from "ng2-charts";


    /*
    @Component({
      selector: 'sales-revenue-chart',
      templateUrl: './sales-revenue-chart.component.html',
      styleUrls: ['./sales-revenue-chart.component.scss']
    })
    export class SalesRevenueChartComponent {
        @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;
    // Define chart type correctly
        public chartType: ChartType = 'bar';
        totalRevenue: number;

        // Correct chart data structure
        public chartData: ChartData<'bar', number[], string> = {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov'],
            datasets: [
                {
                    data: [],
                    backgroundColor: '#007bff',
                    borderColor: '#007bff',
                    borderWidth: 1
                }
            ]
        };

        // Chart options
        public chartOptions: ChartOptions<'bar'> = {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 4000
                }
            }
        };

        constructor(private adminService: AdminService) { }

        ngOnInit() {
            this.loadSalesRevenueData();  // Fetch data on initialization
            this.setFilter('monthly');
        }

        // Function to load sales revenue data from the API
        loadSalesRevenueData() {
            this.adminService.getTotalRevenue().subscribe(res => {
                console.log("Total revenue:", res.totalRevenue);
                this.totalRevenue = res.totalRevenue;

                const currentMonth = new Date().getMonth();
                const monthlyRevenue = Array(12).fill(0);
                monthlyRevenue[currentMonth] = res.totalRevenue;

                // this.chartData.datasets[0].data = [res.totalRevenue];  // Fill the chart with monthly revenue data
                this.chartData.datasets[0].data = monthlyRevenue;  // Fill the chart with monthly revenue data
                if (this.chart) {
                    this.chart.update();  // This ensures the chart is redrawn with new data
                }
                // Force chart update after modifying data
            }, error => {
                console.error('Error fetching sales revenue data:', error);
            });
        }

        setFilter(range: string) {
            let startDate: string, endDate: string;

            if (range === 'weekly') {
                startDate = moment().startOf('week').format('YYYY-MM-DD');
                endDate = moment().endOf('week').format('YYYY-MM-DD');
            } else if (range === 'monthly') {
                startDate = moment().startOf('month').format('YYYY-MM-DD');
                endDate = moment().endOf('month').format('YYYY-MM-DD');
            } else if (range === 'yearly') {
                startDate = moment().startOf('year').format('YYYY-MM-DD');
                endDate = moment().endOf('year').format('YYYY-MM-DD');
            } else {
                // Custom date range (Example)
                startDate = '2023-01-01';
                endDate = '2023-12-31';
            }

            this.loadFilteredData(startDate, endDate);
        }

        loadFilteredData(startDate: string, endDate: string) {
            this.adminService.getRevenueByDateRange(startDate, endDate).subscribe(res => {
                this.totalRevenue = res.revenue;
                this.chartData.datasets[0].data = [this.totalRevenue];
                if (this.chart) this.chart.update();
            });
        }
    }

     */
    // import {Component, AfterViewInit, ChangeDetectorRef} from '@angular/core';
    // import {Chart, ChartData, ChartOptions, registerables} from 'chart.js';
    // import { format } from 'date-fns';
    // import {AdminService} from "../../../services/admin.service";
    //
    // Chart.register(...registerables);
    //
    // @Component({
    //     selector: 'sales-revenue-chart',
    //     templateUrl: './sales-revenue-chart.component.html',
    //     styleUrls: ['./sales-revenue-chart.component.scss']
    // })
    // export class SalesRevenueChartComponent implements AfterViewInit {
    //     selectedRange = 'weekly';
    //     dateRange: Date[] = [];
    //     chart: Chart | undefined;
    //     loading = false;
    //
    //
    //     // Use Chart.js data structure
    //     chartData: ChartData<'line', number[], string> = {
    //         labels: [],
    //         datasets: [{
    //             label: 'Revenue',
    //             data: [],
    //             borderColor: '#1890ff',
    //             tension: 0.1,
    //             fill: false
    //         }]
    //     };
    //
    //     // Chart options
    //     chartOptions: ChartOptions<'line'> = {
    //         responsive: true,
    //         maintainAspectRatio: false,
    //         plugins: {
    //             legend: { position: 'top' },
    //             title: { display: true, text: 'Revenue Over Time' }
    //         },
    //         scales: {
    //             y: {
    //                 beginAtZero: true,
    //                 ticks: {
    //                     callback: (value) => '$' + value
    //                 }
    //             }
    //         }
    //     };
    //
    //     constructor(private adminService: AdminService,  private cdr: ChangeDetectorRef) {}
    //
    //     ngAfterViewInit() {
    //         this.initChart();
    //         this.loadSalesRevenueData('weekly');
    //     }


    //*********************************************ab

        // initChart() {
        //     const canvas = document.getElementById('revenueChart') as HTMLCanvasElement;
        //     if (canvas) {
        //         const ctx = canvas.getContext('2d');
        //         if (ctx) {
        //             this.chart = new Chart(ctx, {
        //                 type: 'line',
        //                 data: {
        //                     labels: [],
        //                     datasets: [{
        //                         label: 'Revenue',
        //                         data: [],
        //                         borderColor: '#1890ff',
        //                         tension: 0.1,
        //                         fill: false
        //                     }]
        //                 },
        //                 options: {
        //                     responsive: true,
        //                     maintainAspectRatio: false,
        //                     plugins: {
        //                         legend: { position: 'top' },
        //                         title: { display: true, text: 'Revenue Over Time' }
        //                     },
        //                     scales: {
        //                         y: {
        //                             beginAtZero: true,
        //                             ticks: {
        //                                 callback: (value) => '$' + value
        //                             }
        //                         }
        //                     }
        //                 }
        //             });
        //         }
        //     }
        // }

    //     initChart() {
    //         const canvas = document.getElementById('revenueChart') as HTMLCanvasElement;
    //         if (canvas) {
    //             const ctx = canvas.getContext('2d');
    //             if (ctx) {
    //                 this.chart = new Chart(ctx, {
    //                     type: 'line',
    //                     data: this.chartData,
    //                     options: this.chartOptions
    //                 });
    //             }
    //         }
    // }
    //*********************************************ab

        //     loadChartData(range: string) {
        //     this.loading = true;
        //     let labels: string[] = [];
        //     let data: number[] = [];
        //
        //     switch (range) {
        //         case 'weekly':
        //             labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        //             data = [4000, 3000, 5000, 2780, 1890, 2390, 3490];
        //             break;
        //         case 'monthly':
        //             labels = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
        //             data = [15000, 18000, 12000, 20000];
        //             break;
        //         case 'yearly':
        //             labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        //             data = [45000, 52000, 48000, 61000, 55000, 67000, 72000, 69000, 75000, 80000, 85000, 90000];
        //             break;
        //     }
        //
        //     if (this.chart) {
        //         this.chart.data.labels = labels;
        //         this.chart.data.datasets[0].data = data;
        //         this.chart.update();
        //     }
        //     this.loading = false;
        // }

        // loadSalesRevenueData(range: string) {
        //     this.loading = true;
        //     let fetchDataObservable;
        //
        //     switch (range) {
        //         case 'weekly':
        //             fetchDataObservable = this.adminService.getWeeklyRevenue();
        //             break;
        //         case 'monthly':
        //             fetchDataObservable = this.adminService.getMonthlyRevenue();
        //             break;
        //         case 'yearly':
        //             fetchDataObservable = this.adminService.getYearlyRevenue();
        //             break;
        //         default:
        //             this.loading = false;
        //             return;
        //     }
        //
        //     // Subscribe to API data and update chart
        //     fetchDataObservable.subscribe(response => {
        //         const { labels, data } = this.processApiResponse(response);
        //         this.chartData.labels = labels;
        //         this.chartData.datasets[0].data = data;
        //         this.chart?.update();
        //         this.loading = false;
        //     }, error => {
        //         console.error('Error fetching sales revenue data:', error);
        //         this.loading = false;
        //     });
        // }
        //
        // processApiResponse(response: any): { labels: string[], data: number[] } {
        //     // Extract labels and data arrays from the API response
        //     const labels = response.labels || [];  // Assuming response has a 'labels' array
        //     const data = response.data || [];      // Assuming response has a 'data' array of numbers
        //     return { labels, data };
        // }
        //
        //
        //
        // onRangeChange(range: string) {
        //     this.selectedRange = range;
        //     if (range !== 'custom') {
        //         this.loadSalesRevenueData(range);
        //     }
        // }
        //
        // onDateRangeChange(dates: Date[]) {
        //     if (dates && dates.length === 2) {
        //         this.loading = true;
        //         const [startDate, endDate] = dates;
        //         this.adminService.getCustomRangeRevenue(startDate, endDate).subscribe(response => {
        //             const {labels, data} = this.processApiResponse(response);
        //             this.chartData.labels = labels;
        //             this.chartData.datasets[0].data = data;
        //             this.chart?.update();
        //             this.loading = false;
        //         }, error => {
        //             console.error('Error fetching custom range revenue data:', error);
        //             this.loading = false;
        //         });
        //     }
        // }
    //*********************************************ab

            // Production code would include these API calls
            // private fetchWeeklyData() {
            //   return this.adminService.getWeeklyRevenue().pipe(
            //     map(response => this.processApiResponse(response))
            //   );
            // }

            // private fetchMonthlyData() {
            //   return this.adminService.getMonthlyRevenue().pipe(
            //     map(response => this.processApiResponse(response))
            //   );
            // }

            // private fetchYearlyData() {
            //   return this.adminService.getYearlyRevenue().pipe(
            //     map(response => this.processApiResponse(response))
            //   );
            // }

            // private fetchCustomRangeData(startDate: Date, endDate: Date) {
            //   return this.adminService.getCustomRangeRevenue(startDate, endDate).pipe(
            //     map(response => this.processApiResponse(response))
            //   );
            // }

        // }


    import { Component, AfterViewInit, ChangeDetectorRef } from '@angular/core';
    import { Chart, ChartData, ChartOptions, registerables } from 'chart.js';
    import { AdminService } from "../../../services/admin.service";

    Chart.register(...registerables);

    @Component({
        selector: 'sales-revenue-chart',
        templateUrl: './sales-revenue-chart.component.html',
        styleUrls: ['./sales-revenue-chart.component.scss']
    })
    export class SalesRevenueChartComponent implements AfterViewInit {
        selectedRange = 'weekly';
        dateRange: Date[] = [];
        chart: Chart | undefined;
        loading = false;

        // Chart data and options
        chartData: ChartData<'line', number[], string> = {
            labels: [],
            datasets: [{
                label: 'Revenue',
                data: [],
                borderColor: '#1890ff',
                tension: 0.1,
                fill: false
            }]
        };

        chartOptions: ChartOptions<'line'> = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'top' },
                title: { display: true, text: 'Revenue Over Time' }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: (value) => '$' + value
                    }
                }
            }
        };

        constructor(private adminService: AdminService, private cdr: ChangeDetectorRef) {}

        ngAfterViewInit() {
            this.loadSalesRevenueData('weekly');
        }

        initChart() {
            const canvas = document.getElementById('revenueChart') as HTMLCanvasElement;
            if (canvas && canvas.getContext('2d')) {
                this.chart = new Chart(canvas.getContext('2d')!, {
                    type: 'line',
                    data: this.chartData,
                    options: this.chartOptions
                });
            }
        }

        loadSalesRevenueData(range: string) {
            this.loading = true;
            let fetchDataObservable;

            switch (range) {
                case 'weekly':
                    fetchDataObservable = this.adminService.getWeeklyRevenue();
                    break;
                case 'monthly':
                    fetchDataObservable = this.adminService.getMonthlyRevenue();
                    break;
                case 'yearly':
                    fetchDataObservable = this.adminService.getYearlyRevenue();
                    break;
                default:
                    this.loading = false;
                    return;
            }

            fetchDataObservable.subscribe(response => {
                const { labels, data } = this.processApiResponse(response);
                console.log("Labels:",labels, data);
                this.chartData.labels = labels;
                this.chartData.datasets[0].data = data;

                // Initialize chart after data is ready
                if (!this.chart) {
                    this.initChart();
                } else {
                    this.chart.update();
                }

                this.loading = false;
            }, error => {
                console.error('Error fetching sales revenue data:', error);
                this.loading = false;
            });
        }

        processApiResponse(response: any): { labels: string[], data: number[] } {
            console.log("Response:", response);

            const labels = response.labels || [];
            const data = response.data || [];

            // Check if the data is a single value (weekly revenue)
            if (typeof data === 'number') {
                // If it is, create an array with that single value to match the labels length
                return { labels: [labels], data: [data] };
            }

            // Ensure the data length matches the labels length and fill with 0 where necessary
            const finalData = new Array(labels.length).fill(0);  // Initialize all data with 0

            // Populate the finalData array with actual values
            for (let i = 0; i < labels.length; i++) {
                if (data[i] !== undefined) {
                    finalData[i] = data[i];
                }
            }

            return { labels, data: finalData };
        }



        onRangeChange(range: string) {
            this.selectedRange = range;
            if (range !== 'custom') {
                this.loadSalesRevenueData(range);
            }
        }

        onDateRangeChange(dates: Date[]) {
            if (dates && dates.length === 2) {
                this.loading = true;
                const [startDate, endDate] = dates;
                this.adminService.getCustomRangeRevenue(startDate, endDate).subscribe(response => {
                    const { labels, data } = this.processApiResponse(response);
                    this.chartData.labels = labels;
                    this.chartData.datasets[0].data = data;
                    this.chart?.update();
                    this.loading = false;
                }, error => {
                    console.error('Error fetching custom range revenue data:', error);
                    this.loading = false;
                });
            }
        }
    }
