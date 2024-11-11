import {Component, OnInit, ViewChild} from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { ChartData, ChartOptions, ChartType } from 'chart.js';
import { PartnerService } from '../../services/partner.service';
import {finalize} from "rxjs";

@Component({
    selector: 'partner-sales-revenue',
    templateUrl: './partner-sales-revenue.component.html',
    styleUrls: ['./partner-sales-revenue.component.scss']
})

export class PartnerSalesRevenueComponent implements OnInit {
    @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;

    selectedRange = 'weekly';
    dateRange: Date[] = [];
    chartType: ChartType = 'bar';
    totalRevenue: number = 0;
    averageRevenue: number = 0;
    isLoading: boolean = false;
    partnerId = 1;

    chartData: ChartData<'bar', number[], string> = {
        labels: [],
        datasets: [{
            label: 'Revenue',
            data: [],
            backgroundColor: 'rgba(59, 130, 246, 0.8)', // Tailwind blue-500
            borderColor: 'rgb(29, 78, 216)', // Tailwind blue-700
            borderWidth: 1,
            borderRadius: 4,
            hoverBackgroundColor: 'rgba(37, 99, 235, 0.9)', // Tailwind blue-600
        }]
    };

    chartOptions: ChartOptions<'bar'> = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false
            },
            tooltip: {
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                titleColor: '#1f2937',
                bodyColor: '#1f2937',
                borderColor: '#e5e7eb',
                borderWidth: 1,
                padding: 12,
                boxPadding: 4,
                usePointStyle: true,
                callbacks: {
                    label: (context) => `Revenue: ${context.formattedValue}`
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    callback: (value) => '$ ' + value.toLocaleString()
                },
                grid: {
                    display: true,
                    // drawBorder: false,
                    color: 'rgba(107, 114, 128, 0.1)'
                }
            },
            x: {
                grid: {
                    display: false
                }
            }
        }
    };

    constructor(private partnerService: PartnerService) {}

    ngOnInit() {
        this.loadSalesRevenueData('weekly');
    }

    onRangeChange(range: string) {
        this.selectedRange = range;
        if (range !== 'custom') {
            this.loadSalesRevenueData(range);
        }
    }

    onDateRangeChange(dates: Date[]) {
        if (dates?.length === 2) {
            this.isLoading = true;
            const [startDate, endDate] = dates;

            this.partnerService.getCustomRangeRevenue(this.partnerId, startDate, endDate)
                .pipe(finalize(() => this.isLoading = false))
                .subscribe({
                    next: (response) => {
                        const { labels, data } = this.processApiResponse(response);
                        this.updateChartData(labels, data);
                    },
                    error: (error) => {
                        console.error('Error fetching custom range revenue data:', error);
                        // Here you might want to add an error notification using your UI framework
                    }
                });
        }
    }

    loadSalesRevenueData(range: string) {
        this.isLoading = true;
        let fetchDataObservable = this.getRevenueObservable(range);

        fetchDataObservable
            .pipe(finalize(() => this.isLoading = false))
            .subscribe({
                next: (response) => {
                    const { labels, data } = this.processApiResponse(response);
                    this.updateChartData(labels, data);
                },
                error: (error) => {
                    console.error('Error fetching sales revenue data:', error);
                    // Here you might want to add an error notification using your UI framework
                }
            });
    }

    private getRevenueObservable(range: string) {
        switch (range) {
            case 'weekly':
                return this.partnerService.getWeeklyRevenue(this.partnerId);
            case 'monthly':
                return this.partnerService.getMonthlyRevenue(this.partnerId);
            case 'yearly':
                return this.partnerService.getYearlyRevenue(this.partnerId);
            default:
                throw new Error('Invalid range selected');
        }
    }

    private processApiResponse(response: any): { labels: string[], data: number[] } {
        if (response && response.labels && response.data) {
            // Calculate total and average revenue
            this.totalRevenue = response.data.reduce((sum: number, curr: number) => sum + curr, 0);
            this.averageRevenue = this.totalRevenue / response.data.length;

            return {
                labels: response.labels,
                data: response.data
            };
        }

        return { labels: [], data: [] };
    }


    private updateChartData(labels: string[], data: number[]) {
        this.chartData.labels = labels;
        this.chartData.datasets[0].data = data;
        this.chart?.update();
    }
}



